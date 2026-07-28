/*
 * Pole-figure core: parsing, normalisation, smoothing, projection.
 * TypeScript port of the numpy core of PoleFigureViewer.py — everything here
 * is pure math on typed arrays, no DOM or React.
 *
 * .PLF layout
 * -----------
 *   header : hkl(cols 1-3) | sample name | date | 2theta | n_alpha |
 *            alpha_start alpha_end | c1 c2 | max
 *   data   : n_alpha rings of fixed-width F8.4 values, beta = 0..360 deg,
 *            rings ordered from the pole-figure centre outwards
 *   blocks : separated by a line of '*'
 */

export const FWIDTH = 8; // fixed-width field, characters

export type Centre = "auto" | "first" | "last";
export type Projection = "stereographic" | "equal-area";
export type Mode = "both" | "raw" | "smoothed";

export interface PFStats {
  rawMax: number;
  rawMin: number;
  median: number;
  mean: number;
  smoothMax: number;
  smoothMin: number;
  pfIndex: number;
  fracGt5: number;
  spikiness: number;
  grainy: boolean;
}

const DEG = Math.PI / 180;

// =====================================================================
//  PoleFigure: I[n_alpha, n_beta] on a regular polar grid
// =====================================================================
export class PoleFigure {
  readonly hkl: string;
  readonly sample: string;
  readonly date: string;
  readonly twoTheta: number;
  readonly alpha: Float64Array; // degrees
  readonly beta: Float64Array;  // degrees
  readonly na: number;
  readonly nb: number;
  readonly Iraw: Float64Array;  // row-major [na][nb]

  private dist: Float32Array | null = null; // cached angular-distance matrix
  private smoothCache = new Map<string, Float64Array>();

  /**
   * File-level centre orientation, stamped by parsePLF: every block in a
   * .PLF shares one physical scan order, so the file-wide vote is far more
   * robust than judging each block alone (a strong centre spike can fool
   * the per-block metric, as in blocks with an intense alpha=0 peak).
   */
  centreFirstHint: boolean | null = null;

  constructor(
    hkl: string, sample: string, date: string, twoTheta: number,
    alpha: Float64Array, beta: Float64Array, I: Float64Array,
  ) {
    this.hkl = hkl;
    this.sample = sample;
    this.date = date;
    this.twoTheta = twoTheta;
    this.alpha = alpha;
    this.beta = beta;
    this.na = alpha.length;
    this.nb = beta.length;
    this.Iraw = I;
  }

  get alphaMax(): number {
    return this.alpha[this.na - 1];
  }

  /** Solid angle of each alpha ring (half-width cells at both ends). */
  ringWeights(): Float64Array {
    const n = this.na;
    const a = new Float64Array(n);
    for (let i = 0; i < n; i++) a[i] = this.alpha[i] * DEG;
    const e = new Float64Array(n + 1);
    for (let i = 1; i < n; i++) e[i] = 0.5 * (a[i] + a[i - 1]);
    e[0] = a[0];
    e[n] = n > 1 ? a[n - 1] + 0.5 * (a[n - 1] - a[n - 2]) : a[0];
    for (let i = 0; i <= n; i++) e[i] = Math.min(Math.max(e[i], 0), Math.PI / 2);
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) w[i] = Math.cos(e[i]) - Math.cos(e[i + 1]);
    return w;
  }

  /** Pearson correlation between two rings of Iraw. */
  private ringCorr(rowA: number, rowB: number): number {
    const n = this.nb;
    let ma = 0;
    let mb = 0;
    for (let j = 0; j < n; j++) {
      ma += this.Iraw[rowA * n + j];
      mb += this.Iraw[rowB * n + j];
    }
    ma /= n;
    mb /= n;
    let va = 0;
    let vb = 0;
    let cov = 0;
    for (let j = 0; j < n; j++) {
      const a = this.Iraw[rowA * n + j] - ma;
      const b = this.Iraw[rowB * n + j] - mb;
      va += a * a;
      vb += b * b;
      cov += a * b;
    }
    const d = Math.sqrt(va * vb);
    return d === 0 ? 0 : cov / d;
  }

  /**
   * Evidence that ring 0 is the pole-figure centre (positive = yes).
   *
   * The centre ring is a single physical direction, so it correlates
   * poorly with its neighbouring ring, while a rim ring carries real
   * texture that its neighbour shares.  Note this can misfire on a block
   * with an intense centre spike (smooth eccentricity wobble correlates
   * with the next ring), which is why parsePLF votes across all blocks
   * of a file rather than trusting any single block.
   */
  centreEvidence(): number {
    if (this.na < 3) return 0;
    return this.ringCorr(this.na - 1, this.na - 2) - this.ringCorr(0, 1);
  }

  /** Which end of the ring stack is the pole-figure centre? */
  centreIsFirst(): boolean {
    if (this.centreFirstHint !== null) return this.centreFirstHint;
    return this.centreEvidence() >= 0;
  }

  /** Return I with ring 0 = pole-figure centre, centre ring collapsed. */
  oriented(centre: Centre = "auto"): Float64Array {
    const first = centre === "auto" ? this.centreIsFirst() : centre === "first";
    const { na, nb } = this;
    const I = new Float64Array(na * nb);
    for (let i = 0; i < na; i++) {
      const src = first ? i : na - 1 - i;
      for (let j = 0; j < nb; j++) I[i * nb + j] = this.Iraw[src * nb + j];
    }
    if (this.alpha[0] === 0.0) {
      // alpha = 0 is a single direction; its beta scatter is sample
      // eccentricity, not texture, so replace the ring by its mean
      let m = 0;
      for (let j = 0; j < nb; j++) m += I[j];
      m /= nb;
      for (let j = 0; j < nb; j++) I[j] = m;
    }
    return I;
  }

  /** Scale to multiples of a random distribution over the measured cap. */
  normalised(centre: Centre = "auto"): Float64Array {
    const I = this.oriented(centre);
    const w = this.ringWeights();
    const { na, nb } = this;
    let num = 0;
    let wsum = 0;
    for (let i = 0; i < na; i++) {
      let rowMean = 0;
      for (let j = 0; j < nb; j++) rowMean += I[i * nb + j];
      rowMean /= nb;
      num += rowMean * w[i];
      wsum += w[i];
    }
    const norm = num / wsum;
    const out = new Float64Array(I.length);
    for (let k = 0; k < I.length; k++) out[k] = I[k] / norm;
    return out;
  }

  private distanceMatrix(): Float32Array {
    if (this.dist === null) {
      const { na, nb } = this;
      const N = na * nb;
      const vx = new Float64Array(N);
      const vy = new Float64Array(N);
      const vz = new Float64Array(N);
      for (let i = 0; i < na; i++) {
        const A = this.alpha[i] * DEG;
        const sA = Math.sin(A);
        const cA = Math.cos(A);
        for (let j = 0; j < nb; j++) {
          const B = this.beta[j] * DEG;
          const k = i * nb + j;
          vx[k] = sA * Math.cos(B);
          vy[k] = sA * Math.sin(B);
          vz[k] = cA;
        }
      }
      const d = new Float32Array(N * N);
      for (let p = 0; p < N; p++) {
        for (let q = p + 1; q < N; q++) {
          let dot = vx[p] * vx[q] + vy[p] * vy[q] + vz[p] * vz[q];
          if (dot > 1) dot = 1;
          else if (dot < -1) dot = -1;
          const dd = Math.acos(dot);
          d[p * N + q] = dd;
          d[q * N + p] = dd;
        }
      }
      this.dist = d;
    }
    return this.dist;
  }

  /** Gaussian convolution over true angular distance on the sphere. */
  smoothed(sigmaDeg: number, centre: Centre = "auto"): Float64Array {
    const key = `${(Math.round(sigmaDeg * 1000) / 1000).toFixed(3)}|${centre}`;
    const hit = this.smoothCache.get(key);
    if (hit) return hit;

    const I = this.normalised(centre);
    let out: Float64Array;
    if (sigmaDeg <= 0) {
      out = I;
    } else {
      const { na, nb } = this;
      const N = na * nb;
      const d = this.distanceMatrix();
      const rw = this.ringWeights();
      const w = new Float64Array(N);
      for (let i = 0; i < na; i++)
        for (let j = 0; j < nb; j++) w[i * nb + j] = rw[i] / nb;
      const inv2s2 = 1 / (2 * (sigmaDeg * DEG) ** 2);
      out = new Float64Array(N);
      for (let p = 0; p < N; p++) {
        let num = 0;
        let den = 0;
        const row = p * N;
        for (let q = 0; q < N; q++) {
          const dd = d[row + q];
          const e = Math.exp(-dd * dd * inv2s2) * w[q];
          num += e * I[q];
          den += e;
        }
        out[p] = num / den;
      }
    }
    if (this.smoothCache.size > 24) this.smoothCache.clear();
    this.smoothCache.set(key, out);
    return out;
  }

  stats(sigmaDeg = 3.0, centre: Centre = "auto"): PFStats {
    const I = this.normalised(centre);
    const S = this.smoothed(sigmaDeg, centre);
    const { na, nb } = this;
    const rw = this.ringWeights();
    let wsum = 0;
    for (let i = 0; i < na; i++) wsum += rw[i];

    let pfIndex = 0;
    let rawMax = -Infinity;
    let rawMin = Infinity;
    let mean = 0;
    let gt5 = 0;
    let smoothMax = -Infinity;
    let smoothMin = Infinity;
    for (let i = 0; i < na; i++) {
      const w = rw[i] / nb / wsum;
      for (let j = 0; j < nb; j++) {
        const v = I[i * nb + j];
        pfIndex += v * v * w;
        if (v > rawMax) rawMax = v;
        if (v < rawMin) rawMin = v;
        if (v > 5) gt5++;
        mean += v;
        const s = S[i * nb + j];
        if (s > smoothMax) smoothMax = s;
        if (s < smoothMin) smoothMin = s;
      }
    }
    mean /= na * nb;

    const sorted = Array.from(I).sort((a, b) => a - b);
    const mid = sorted.length >> 1;
    const median = sorted.length % 2 ? sorted[mid] : 0.5 * (sorted[mid - 1] + sorted[mid]);

    const s3 = this.smoothed(3.0, centre);
    let s3max = -Infinity;
    for (let k = 0; k < s3.length; k++) if (s3[k] > s3max) s3max = s3[k];
    const spike = rawMax / Math.max(s3max, 1e-9); // peak collapse under 3 deg

    return {
      rawMax, rawMin, median, mean, smoothMax, smoothMin,
      pfIndex,
      fracGt5: gt5 / (na * nb),
      spikiness: spike,
      grainy: spike > 2.5 && median < 0.75,
    };
  }
}

// ---------------------------------------------------------------- parsing
/** Parse the text of a .PLF file into a list of PoleFigure objects. */
export function parsePLF(text: string, fwidth = FWIDTH): PoleFigure[] {
  interface Block {
    hkl: string; sample: string; date: string; twoTheta: number;
    nalpha: number; a0: number; a1: number; vals: number[];
  }
  const blocks: Block[] = [];
  let cur: Block | null = null;

  for (const raw of text.split("\n")) {
    const line = raw.replace(/[\r\n]+$/, "");
    if (line.startsWith("****")) continue;
    if (
      line.length > 60 &&
      /^\d+$/.test(line.slice(0, 3).trim()) &&
      line.slice(3, 6).trim() === ""
    ) {
      const f = line.slice(70).trim().split(/\s+/);
      cur = {
        hkl: line.slice(0, 3),
        sample: line.slice(6, 70).trim(),
        date: f[0],
        twoTheta: parseFloat(f[1]),
        nalpha: parseInt(f[2], 10),
        a0: parseFloat(f[3]),
        a1: parseFloat(f[4]),
        vals: [],
      };
      blocks.push(cur);
      continue;
    }
    if (cur === null || line.trim() === "") continue;
    const s = line.replace(/\s+$/, "");
    for (let i = 0; i < s.length; i += fwidth) {
      const v = parseFloat(s.slice(i, i + fwidth));
      if (!Number.isNaN(v)) cur.vals.push(v);
    }
  }

  if (blocks.length === 0) {
    throw new Error("No pole-figure blocks found in this file");
  }

  const figs = blocks.map((b) => {
    const n = b.nalpha;
    if (b.vals.length % n !== 0) {
      throw new Error(
        `(${b.hkl}): ${b.vals.length} values is not a multiple of ${n} rings`,
      );
    }
    const nb = b.vals.length / n;
    const alpha = new Float64Array(n);
    for (let i = 0; i < n; i++)
      alpha[i] = n > 1 ? b.a0 + ((b.a1 - b.a0) * i) / (n - 1) : b.a0;
    const beta = new Float64Array(nb);
    for (let j = 0; j < nb; j++) beta[j] = (j * 360.0) / nb;
    return new PoleFigure(
      b.hkl, b.sample, b.date, b.twoTheta, alpha, beta, Float64Array.from(b.vals),
    );
  });

  // All blocks of one file share a single physical scan order, so decide the
  // centre orientation once, from the summed evidence.  A tie keeps the .PLF
  // convention: rings ordered from the pole-figure centre outwards.
  const evidence = figs.reduce((s, pf) => s + pf.centreEvidence(), 0);
  const centreFirst = evidence >= 0;
  for (const pf of figs) pf.centreFirstHint = centreFirst;
  return figs;
}

// ------------------------------------------------------------- projection
/** Plot radius for a polar angle, scaled so alpha = 90 deg -> r = 1. */
export function radius(alphaDeg: number, kind: Projection = "stereographic"): number {
  const a = alphaDeg * DEG;
  if (kind === "equal-area") return Math.sin(a / 2) * Math.SQRT2;
  return Math.tan(a / 2);
}

export function inverseRadius(r: number, kind: Projection = "stereographic"): number {
  if (kind === "equal-area") {
    const x = Math.min(Math.max(r / Math.SQRT2, -1), 1);
    return (2 * Math.asin(x)) / DEG;
  }
  return (2 * Math.atan(r)) / DEG;
}

/**
 * Cached bilinear resampler from the (alpha, beta) polar grid onto a
 * Cartesian pole-figure disc.  The index and weight maps depend only on
 * the geometry, not on the intensities, so they are memoised.
 */
export class Sampler {
  readonly n: number;
  readonly mask: Uint8Array;
  private i0: Int32Array;
  private i1: Int32Array;
  private j0: Int32Array;
  private j1: Int32Array;
  private w0: Float32Array;
  private w1: Float32Array;
  private w2: Float32Array;
  private w3: Float32Array;
  private nb: number;

  constructor(
    alpha: Float64Array, beta: Float64Array,
    kind: Projection = "stereographic", n = 480,
    betaOffset = 0.0, flip = false,
  ) {
    const na = alpha.length;
    const nb = beta.length;
    this.n = n;
    this.nb = nb;
    const rmax = radius(alpha[na - 1], kind);
    const size = n * n;
    this.mask = new Uint8Array(size);
    this.i0 = new Int32Array(size);
    this.i1 = new Int32Array(size);
    this.j0 = new Int32Array(size);
    this.j1 = new Int32Array(size);
    this.w0 = new Float32Array(size);
    this.w1 = new Float32Array(size);
    this.w2 = new Float32Array(size);
    this.w3 = new Float32Array(size);

    const da = na > 1 ? alpha[1] - alpha[0] : 1;
    const db = nb > 1 ? beta[1] - beta[0] : 1;

    for (let py = 0; py < n; py++) {
      const y = 1 - (2 * py) / (n - 1); // canvas row 0 = top = +y
      for (let px = 0; px < n; px++) {
        const x = -1 + (2 * px) / (n - 1);
        const k = py * n + px;
        const R = Math.hypot(x, y);
        this.mask[k] = R > rmax ? 1 : 0;

        let aq = inverseRadius(Math.min(R, 1), kind);
        aq = Math.min(Math.max(aq, alpha[0]), alpha[na - 1]);
        // beta = 0 at top, counterclockwise — the PANalytical / popLA
        // convention (matplotlib polar with theta_zero_location N,
        // theta_direction 1); `flip` mirrors it to clockwise
        const th = -Math.atan2(x, y) / DEG;
        let bq = (flip ? betaOffset - th : th - betaOffset) % 360;
        if (bq < 0) bq += 360;

        const fa = Math.min(Math.max((aq - alpha[0]) / da, 0), na - 1 - 1e-9);
        const fb = bq / db;
        const i0 = Math.floor(fa);
        const j0f = Math.floor(fb);
        const j0 = j0f % nb;
        const ta = fa - i0;
        const tb = fb - j0f;
        this.i0[k] = i0;
        this.j0[k] = j0;
        this.i1[k] = Math.min(i0 + 1, na - 1);
        this.j1[k] = (j0 + 1) % nb;
        this.w0[k] = (1 - ta) * (1 - tb);
        this.w1[k] = ta * (1 - tb);
        this.w2[k] = (1 - ta) * tb;
        this.w3[k] = ta * tb;
      }
    }
  }

  /** Resample intensities onto the disc; masked pixels are NaN. */
  apply(I: Float64Array): { Z: Float64Array; max: number } {
    const size = this.n * this.n;
    const nb = this.nb;
    const Z = new Float64Array(size);
    let max = -Infinity;
    for (let k = 0; k < size; k++) {
      if (this.mask[k]) {
        Z[k] = NaN;
        continue;
      }
      const v =
        I[this.i0[k] * nb + this.j0[k]] * this.w0[k] +
        I[this.i1[k] * nb + this.j0[k]] * this.w1[k] +
        I[this.i0[k] * nb + this.j1[k]] * this.w2[k] +
        I[this.i1[k] * nb + this.j1[k]] * this.w3[k];
      Z[k] = v;
      if (v > max) max = v;
    }
    return { Z, max };
  }
}

const samplerCache = new Map<string, Sampler>();

/** Memoised Sampler lookup. */
export function getSampler(
  alpha: Float64Array, beta: Float64Array,
  kind: Projection = "stereographic", n = 480,
  betaOffset = 0.0, flip = false,
): Sampler {
  const key = [
    alpha.length, alpha[0], alpha[alpha.length - 1], beta.length,
    kind, n, Math.round(betaOffset * 1e4) / 1e4, flip,
  ].join("|");
  let s = samplerCache.get(key);
  if (!s) {
    if (samplerCache.size > 32) samplerCache.clear();
    s = new Sampler(alpha, beta, kind, n, betaOffset, flip);
    samplerCache.set(key, s);
  }
  return s;
}

/** Nice contour levels from 0 to vmax. */
export function contourLevels(vmax: number, n = 11, log = false, vmin = 0.25): number[] {
  vmax = Math.max(vmax, vmin * 2);
  let lv: number[];
  if (log) {
    lv = [0];
    for (let i = 0; i < n; i++) lv.push(vmin * Math.pow(vmax / vmin, i / (n - 1)));
  } else {
    const nice = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10,
      12, 15, 20, 25, 30, 40, 50];
    lv = nice.filter((v) => v < vmax).concat([vmax]);
    if (lv.length < 4) {
      lv = [];
      for (let i = 0; i < n; i++) lv.push((vmax * i) / (n - 1));
    }
  }
  const rounded = lv.map((v) => Math.round(v * 1e4) / 1e4);
  return Array.from(new Set(rounded)).sort((a, b) => a - b);
}

// ---------------------------------------------------------------- colours
export const TEXTURE_COLORS = ["#ffffff", "#d8e7f5", "#8fbfe0", "#4a9fd4", "#3fb8a0",
  "#7fd44a", "#e8e337", "#f6a623", "#e8452c", "#8b1a1a"];

const CMAP_STOPS: Record<string, string[]> = {
  texture: TEXTURE_COLORS,
  viridis: ["#440154", "#482878", "#3e4989", "#31688e", "#26828e", "#1f9e89",
    "#35b779", "#6ece58", "#b5de2b", "#fde725"],
  inferno: ["#000004", "#1b0c41", "#4a0c6b", "#781c6d", "#a52c60", "#cf4446",
    "#ed6925", "#fb9b06", "#f7d13d", "#fcffa4"],
  plasma: ["#0d0887", "#46039f", "#7201a8", "#9c179e", "#bd3786", "#d8576b",
    "#ed7953", "#fb9f3a", "#fdca26", "#f0f921"],
  magma: ["#000004", "#180f3d", "#440f76", "#721f81", "#9e2f7f", "#cd4071",
    "#f1605d", "#fd9668", "#feca8d", "#fcfdbf"],
  turbo: ["#30123b", "#4145ab", "#4675ed", "#39a2fc", "#1bcfd4", "#24eca6",
    "#61fc6c", "#a4fc3b", "#d1e834", "#f3c63a", "#f36315", "#d93806", "#b11901", "#7a0402"],
  jet: ["#00007f", "#0000ff", "#007fff", "#00ffff", "#7fff7f", "#ffff00",
    "#ff7f00", "#ff0000", "#7f0000"],
  coolwarm: ["#3b4cc0", "#6688ee", "#9abbff", "#c9d7f0", "#dddddd", "#f2cbb7",
    "#f7a889", "#e26952", "#b40426"],
  Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6",
    "#2171b5", "#08519c", "#08306b"],
  Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373",
    "#525252", "#252525", "#000000"],
};

export const COLORMAPS = Object.keys(CMAP_STOPS);

export type Cmap = (t: number) => [number, number, number];

function hexToRgb(h: string): [number, number, number] {
  return [
    parseInt(h.slice(1, 3), 16),
    parseInt(h.slice(3, 5), 16),
    parseInt(h.slice(5, 7), 16),
  ];
}

/** Linear-interpolated colormap over the named stop list, t in [0, 1]. */
export function makeCmap(name: string): Cmap {
  const stops = (CMAP_STOPS[name] ?? CMAP_STOPS.texture).map(hexToRgb);
  const nSeg = stops.length - 1;
  return (t: number) => {
    const x = Math.min(Math.max(t, 0), 1) * nSeg;
    const i = Math.min(Math.floor(x), nSeg - 1);
    const f = x - i;
    const a = stops[i];
    const b = stops[i + 1];
    return [
      Math.round(a[0] + (b[0] - a[0]) * f),
      Math.round(a[1] + (b[1] - a[1]) * f),
      Math.round(a[2] + (b[2] - a[2]) * f),
    ];
  };
}

// ------------------------------------------------------------- demo data
/**
 * Synthetic cube-texture demo (three PFs) so the page works without a file.
 * Peak positions are the ideal {100}<001> cube-orientation poles.
 */
export function makeDemoPoleFigures(): PoleFigure[] {
  const na = 16;
  const nb = 72;
  const alpha = new Float64Array(na);
  for (let i = 0; i < na; i++) alpha[i] = i * 5; // 0..75 deg
  const beta = new Float64Array(nb);
  for (let j = 0; j < nb; j++) beta[j] = j * 5;

  const figs: Array<{ hkl: string; tt: number; peaks: [number, number][] }> = [
    { hkl: "111", tt: 43.3, peaks: [[54.7, 45], [54.7, 135], [54.7, 225], [54.7, 315]] },
    { hkl: "200", tt: 50.43, peaks: [[0, 0]] },
    { hkl: "220", tt: 74.13, peaks: [[45, 0], [45, 90], [45, 180], [45, 270]] },
  ];

  return figs.map(({ hkl, tt, peaks }) => {
    const I = new Float64Array(na * nb);
    const s2 = 2 * (8 * DEG) ** 2; // 8 deg peak spread
    for (let i = 0; i < na; i++) {
      const A = alpha[i] * DEG;
      for (let j = 0; j < nb; j++) {
        const B = beta[j] * DEG;
        let v = 0.4;
        for (const [pa, pb] of peaks) {
          const A0 = pa * DEG;
          const B0 = pb * DEG;
          let dot = Math.sin(A) * Math.sin(A0) * Math.cos(B - B0) +
            Math.cos(A) * Math.cos(A0);
          dot = Math.min(Math.max(dot, -1), 1);
          const d = Math.acos(dot);
          v += 8 * Math.exp(-(d * d) / s2);
        }
        I[i * nb + j] = v;
      }
    }
    const pf = new PoleFigure(
      hkl, "Synthetic cube-texture demo (Cu)", "2026-07-28", tt, alpha, beta, I,
    );
    pf.centreFirstHint = true; // generated centre-out
    return pf;
  });
}
