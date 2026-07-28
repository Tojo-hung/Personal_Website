"use client";

/*
 * Interactive pole-figure viewer — web port of PoleFigureViewer.py.
 * Parses Philips / PANalytical .PLF files entirely in the browser and
 * renders the figures on <canvas>. All math lives in src/lib/polefigure.ts.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Upload, Download, FileText, FlaskConical, X } from "lucide-react";
import {
  PoleFigure, PFStats, Centre, Projection, Mode, Cmap,
  parsePLF, getSampler, contourLevels, makeCmap, radius,
  makeDemoPoleFigures, COLORMAPS,
} from "@/lib/polefigure";

const GRID = 480; // resample resolution of the disc, px

// ---------------------------------------------------------------- drawing
interface PanelSpec {
  pf: PoleFigure;
  Z: Float64Array;
  zmax: number;
  levels: number[];
  cmap: Cmap;
  projection: Projection;
  title: string | null;
  caption: string;
}

/** Colour for a value given contourf-style discrete bands (extend both). */
function bandColor(v: number, lv: number[], cmap: Cmap): [number, number, number] {
  const nBands = lv.length - 1;
  if (v < lv[0]) return cmap(0);
  for (let i = 0; i < nBands; i++) {
    if (v < lv[i + 1]) return cmap((i + 0.5) / nBands);
  }
  return cmap(1);
}

function fmtLevel(v: number): string {
  return String(Math.round(v * 100) / 100);
}

/**
 * Draw one pole-figure panel (disc + decorations + colorbar) onto a canvas.
 * `k` scales the whole panel geometry (2 = double-resolution, for the zoom
 * view); `grid` is the resample resolution of the disc image.
 */
function drawPanel(cv: HTMLCanvasElement, spec: PanelSpec, k = 1, grid = GRID) {
  const { pf, Z, levels, cmap, projection, title, caption } = spec;
  const W = 620 * k;
  const scale = 200 * k; // px per unit disc radius
  const titleH = (title ? 40 : 12) * k;
  const plotH = 500 * k;
  const barH = 96 * k;
  const H = titleH + plotH + barH;
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");
  if (!ctx) return;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);
  const cx = W / 2;
  const cy = titleH + 250 * k;
  const font = (px: number, bold = false) =>
    `${bold ? "bold " : ""}${Math.round(px * k)}px 'Space Mono', ui-monospace, monospace`;

  // ---- disc image: per-pixel discrete bands, like contourf/BoundaryNorm
  const off = document.createElement("canvas");
  off.width = grid;
  off.height = grid;
  const offCtx = off.getContext("2d");
  if (!offCtx) return;
  const img = offCtx.createImageData(grid, grid);
  const px = img.data;
  const nBands = levels.length - 1;
  const bandRGB: [number, number, number][] = [];
  for (let i = 0; i < nBands; i++) bandRGB.push(cmap((i + 0.5) / nBands));
  const under = cmap(0);
  const over = cmap(1);
  for (let p = 0; p < grid * grid; p++) {
    const v = Z[p];
    const o = p * 4;
    if (Number.isNaN(v)) {
      px[o + 3] = 0;
      continue;
    }
    let c: [number, number, number];
    if (v < levels[0]) c = under;
    else if (v >= levels[nBands]) c = over;
    else {
      c = bandRGB[nBands - 1];
      for (let i = 0; i < nBands; i++) {
        if (v < levels[i + 1]) { c = bandRGB[i]; break; }
      }
    }
    px[o] = c[0];
    px[o + 1] = c[1];
    px[o + 2] = c[2];
    px[o + 3] = 255;
  }
  offCtx.putImageData(img, 0, 0);

  // clip to the rim circle so the resampled square never bleeds outside
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, scale, 0, 2 * Math.PI);
  ctx.clip();
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(off, cx - scale, cy - scale, 2 * scale, 2 * scale);
  ctx.restore();

  // ---- static furniture: rim, guide circles, ticks, RD/TD labels
  const circle = (r: number, stroke: string, lw: number, dash: number[] = []) => {
    ctx.beginPath();
    ctx.setLineDash(dash.map((d) => d * k));
    ctx.strokeStyle = stroke;
    ctx.lineWidth = lw * k;
    ctx.arc(cx, cy, r * scale, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.setLineDash([]);
  };
  circle(radius(pf.alphaMax, projection), "#737373", 1, [4, 3]); // measured cap
  for (const a of [30, 60]) circle(radius(a, projection), "#999999", 0.6);
  circle(1, "#000000", 1.8);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1.2 * k;
  for (let b = 0; b < 360; b += 30) {
    const t = b * (Math.PI / 180);
    const x = Math.sin(t);
    const y = Math.cos(t);
    ctx.beginPath();
    ctx.moveTo(cx + x * scale, cy - y * scale);
    ctx.lineTo(cx + x * 0.96 * scale, cy - y * 0.96 * scale);
    ctx.stroke();
  }
  ctx.fillStyle = "#000000";
  ctx.font = font(15, true);
  ctx.textAlign = "center";
  ctx.textBaseline = "bottom";
  ctx.fillText("RD", cx, cy - 1.06 * scale);
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("TD", cx + 1.06 * scale, cy);

  if (title) {
    ctx.font = font(17, true);
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(title, cx, 10 * k);
  }
  ctx.font = font(12);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#222222";
  ctx.fillText(caption, cx, cy + 1.12 * scale);

  // ---- colorbar: uniform bands with extend triangles, like matplotlib
  const bx0 = 90 * k;
  const bx1 = W - 90 * k;
  const by0 = titleH + plotH + 14 * k;
  const bh = 20 * k;
  const bw = (bx1 - bx0) / nBands;
  for (let i = 0; i < nBands; i++) {
    const c = bandRGB[i];
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.fillRect(bx0 + i * bw, by0, bw + 0.5, bh);
  }
  const tri = (xTip: number, xBase: number, c: [number, number, number]) => {
    ctx.fillStyle = `rgb(${c[0]},${c[1]},${c[2]})`;
    ctx.beginPath();
    ctx.moveTo(xTip, by0 + bh / 2);
    ctx.lineTo(xBase, by0);
    ctx.lineTo(xBase, by0 + bh);
    ctx.closePath();
    ctx.fill();
  };
  tri(bx0 - 14 * k, bx0, under);
  tri(bx1 + 14 * k, bx1, over);
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 0.8 * k;
  ctx.strokeRect(bx0, by0, bx1 - bx0, bh);

  ctx.fillStyle = "#000000";
  ctx.font = font(10);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const step = levels.length > 14 ? 2 : 1; // skip alternate labels if crowded
  for (let i = 0; i < levels.length; i += step) {
    ctx.fillText(fmtLevel(levels[i]), bx0 + i * bw, by0 + bh + 5 * k);
  }
  ctx.font = font(11);
  ctx.fillText("m.r.d.", cx, by0 + bh + 24 * k);
}

// ------------------------------------------------------------- component
interface RowSpec {
  key: string;
  pfIndex: number;
  smooth: boolean;
}

export default function PoleFigureViewer() {
  const [pfs, setPfs] = useState<PoleFigure[] | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [selected, setSelected] = useState<boolean[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [mode, setMode] = useState<Mode>("both");
  const [sigma, setSigma] = useState(3.0);
  const [cmapName, setCmapName] = useState("texture");
  const [log, setLog] = useState(false);
  const [vmaxStr, setVmaxStr] = useState("auto");
  const [projection, setProjection] = useState<Projection>("stereographic");
  const [betaOffset, setBetaOffset] = useState(0);
  const [flip, setFlip] = useState(false);
  // .PLF stores rings from the pole-figure centre outwards; trust that by
  // default (like the desktop app) and keep auto-detection as an option.
  const [centre, setCentre] = useState<Centre>("first");

  const [stats, setStats] = useState<{ hkl: string; s: PFStats }[]>([]);
  const [zoomKey, setZoomKey] = useState<string | null>(null);

  const canvases = useRef(new Map<string, HTMLCanvasElement>());
  const zoomCanvas = useRef<HTMLCanvasElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // ---- rows to render (one canvas per pole figure per raw/smoothed row)
  const rows = useMemo<RowSpec[]>(() => {
    if (!pfs) return [];
    const out: RowSpec[] = [];
    pfs.forEach((_, i) => {
      if (!selected[i]) return;
      if (mode === "both" || mode === "raw")
        out.push({ key: `${i}-raw`, pfIndex: i, smooth: false });
      if (mode === "both" || mode === "smoothed")
        out.push({ key: `${i}-smooth`, pfIndex: i, smooth: true });
    });
    return out;
  }, [pfs, selected, mode]);

  const selectedIdx = useMemo(
    () => (pfs ? pfs.map((_, i) => i).filter((i) => selected[i]) : []),
    [pfs, selected],
  );

  // ---- redraw (debounced so dragging the sigma slider stays responsive)
  useEffect(() => {
    if (!pfs) return;
    const t = setTimeout(() => {
      const cmap = makeCmap(cmapName);
      const vmax = parseFloat(vmaxStr);
      const useVmax = Number.isFinite(vmax) && vmax > 0 ? vmax : null;
      const info: { hkl: string; s: PFStats }[] = [];

      for (const i of selectedIdx) {
        const pf = pfs[i];
        info.push({ hkl: pf.hkl, s: pf.stats(sigma, centre) });
        const sampler = getSampler(pf.alpha, pf.beta, projection, GRID, betaOffset, flip);
        for (const smooth of [false, true]) {
          const cv = canvases.current.get(`${i}-${smooth ? "smooth" : "raw"}`);
          if (!cv) continue;
          const D = smooth ? pf.smoothed(sigma, centre) : pf.normalised(centre);
          const { Z, max } = sampler.apply(D);
          const top = useVmax ?? max;
          drawPanel(cv, {
            pf, Z, zmax: max,
            levels: contourLevels(top, 11, log),
            cmap, projection,
            title: smooth && mode === "both"
              ? null
              : `(${pf.hkl})   2θ = ${pf.twoTheta.toFixed(2)}°`,
            caption: smooth
              ? `smoothed  σ = ${sigma.toFixed(1)}°    max = ${max.toFixed(1)} m.r.d.`
              : `as measured    max = ${max.toFixed(1)} m.r.d.`,
          });
        }
      }
      setStats(info);
    }, 60);
    return () => clearTimeout(t);
  }, [pfs, selectedIdx, mode, sigma, cmapName, log, vmaxStr, projection,
    betaOffset, flip, centre]);

  // ---- zoom view: same panel redrawn at 2x geometry / higher grid
  useEffect(() => {
    if (!zoomKey || !pfs) return;
    const cv = zoomCanvas.current;
    if (!cv) return;
    const [idxStr, kind] = zoomKey.split("-");
    const pf = pfs[parseInt(idxStr, 10)];
    if (!pf) return;
    const smooth = kind === "smooth";
    const t = setTimeout(() => {
      const zoomGrid = 800;
      const sampler = getSampler(pf.alpha, pf.beta, projection, zoomGrid,
        betaOffset, flip);
      const D = smooth ? pf.smoothed(sigma, centre) : pf.normalised(centre);
      const { Z, max } = sampler.apply(D);
      const vmax = parseFloat(vmaxStr);
      const top = Number.isFinite(vmax) && vmax > 0 ? vmax : max;
      drawPanel(cv, {
        pf, Z, zmax: max,
        levels: contourLevels(top, 11, log),
        cmap: makeCmap(cmapName), projection,
        title: `(${pf.hkl.trim()})   2θ = ${pf.twoTheta.toFixed(2)}°`,
        caption: smooth
          ? `smoothed  σ = ${sigma.toFixed(1)}°    max = ${max.toFixed(1)} m.r.d.`
          : `as measured    max = ${max.toFixed(1)} m.r.d.`,
      }, 2, zoomGrid);
    }, 60);
    return () => clearTimeout(t);
  }, [zoomKey, pfs, sigma, cmapName, log, vmaxStr, projection, betaOffset,
    flip, centre]);

  useEffect(() => {
    if (!zoomKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomKey(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomKey]);

  // ------------------------------------------------------------ file I/O
  const loadFile = useCallback(async (f: File) => {
    try {
      const buf = await f.arrayBuffer();
      const text = new TextDecoder("latin1").decode(buf);
      const parsed = parsePLF(text);
      setPfs(parsed);
      setSelected(parsed.map(() => true));
      setFileName(f.name);
      setError(null);
      setZoomKey(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const loadDemo = useCallback(() => {
    const demo = makeDemoPoleFigures();
    setPfs(demo);
    setSelected(demo.map(() => true));
    setFileName("demo (synthetic)");
    setError(null);
    setZoomKey(null);
  }, []);

  const baseName = fileName.includes("demo")
    ? "demo"
    : fileName.replace(/\.[^.]*$/, "") || "polefigure";

  const exportPNG = useCallback(() => {
    if (!pfs || selectedIdx.length === 0) return;
    const cols = selectedIdx.length;
    const rowKinds = mode === "both" ? ["raw", "smooth"] : [mode === "raw" ? "raw" : "smooth"];
    const first = canvases.current.get(`${selectedIdx[0]}-${rowKinds[0]}`);
    if (!first) return;
    const pad = 20;
    const headH = 70;
    const cw = first.width;
    const out = document.createElement("canvas");
    out.width = pad * 2 + cols * cw;
    // panel heights differ (title row vs not), measure per row kind
    const rowH = rowKinds.map((rk) =>
      canvases.current.get(`${selectedIdx[0]}-${rk}`)?.height ?? 0);
    out.height = headH + rowH.reduce((a, b) => a + b, 0) + pad;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, out.width, out.height);
    ctx.fillStyle = "#000000";
    ctx.font = "bold 20px 'Space Mono', ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(pfs[selectedIdx[0]].sample, out.width / 2, 16);
    ctx.font = "11px 'Space Mono', ui-monospace, monospace";
    ctx.fillStyle = "#555555";
    const projName = projection === "equal-area"
      ? "equal-area (Schmidt)" : "stereographic (Wulff)";
    ctx.fillText(
      `${projName} projection · normalised to m.r.d. · measured to α = ` +
      `${pfs[selectedIdx[0]].alphaMax.toFixed(0)}° (dashed)`,
      out.width / 2, 44);
    let y = headH;
    rowKinds.forEach((rk, r) => {
      selectedIdx.forEach((i, c) => {
        const cv = canvases.current.get(`${i}-${rk}`);
        if (cv) ctx.drawImage(cv, pad + c * cw, y);
      });
      y += rowH[r];
    });
    out.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${baseName}_polefigures.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, "image/png");
  }, [pfs, selectedIdx, mode, projection, baseName]);

  const exportCSV = useCallback(() => {
    if (!pfs || selectedIdx.length === 0) return;
    const lines = ["hkl,two_theta,alpha_deg,beta_deg,mrd,mrd_smoothed"];
    for (const i of selectedIdx) {
      const pf = pfs[i];
      const N = pf.normalised(centre);
      const S = pf.smoothed(sigma, centre);
      for (let a = 0; a < pf.na; a++) {
        for (let b = 0; b < pf.nb; b++) {
          lines.push(
            `${pf.hkl.trim()},${pf.twoTheta.toFixed(2)},${pf.alpha[a].toFixed(1)},` +
            `${pf.beta[b].toFixed(1)},${N[a * pf.nb + b].toFixed(4)},` +
            `${S[a * pf.nb + b].toFixed(4)}`);
        }
      }
    }
    const blob = new Blob([lines.join("\n") + "\n"], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${baseName}_grid.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [pfs, selectedIdx, sigma, centre, baseName]);

  // ------------------------------------------------------------ UI bits
  const labelCls = "text-xs uppercase tracking-wider text-muted";
  const boxCls = "bg-surface border border-border rounded-xl p-4 flex flex-col gap-3";
  const segBtn = (active: boolean) =>
    `px-3 py-1.5 text-xs rounded-lg border transition-colors ${
      active
        ? "bg-primary text-white border-primary"
        : "border-border text-muted hover:text-foreground hover:border-primary/50"
    }`;

  const rawOnly = mode === "raw";
  const projName = projection === "equal-area"
    ? "equal-area (Schmidt)" : "stereographic (Wulff)";

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ------------------------------------------------ controls */}
      <aside className="lg:w-72 shrink-0 flex flex-col gap-4">
        <div className={boxCls}>
          <span className={labelCls}>File</span>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              if (f) loadFile(f);
            }}
            onClick={() => fileInput.current?.click()}
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
              transition-colors text-sm ${
              dragOver ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
            }`}
          >
            <Upload className="w-5 h-5 mx-auto mb-2 text-muted" />
            <span className="text-muted">
              Drop a <span className="text-foreground">.PLF</span> file or click to browse
            </span>
            <input
              ref={fileInput}
              type="file"
              accept=".plf,.PLF,.txt"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) loadFile(f);
                e.target.value = "";
              }}
            />
          </div>
          <button
            onClick={loadDemo}
            className="flex items-center justify-center gap-2 text-sm border border-border
              rounded-lg py-2 text-muted hover:text-foreground hover:border-primary/50
              transition-colors"
          >
            <FlaskConical className="w-4 h-4" /> Load demo data
          </button>
          {fileName && (
            <p className="text-xs text-muted flex items-center gap-2 break-all">
              <FileText className="w-3.5 h-3.5 shrink-0" /> {fileName}
            </p>
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        {pfs && (
          <>
            <div className={boxCls}>
              <span className={labelCls}>Pole figures</span>
              {pfs.map((pf, i) => (
                <label key={i} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selected[i] ?? false}
                    onChange={(e) => {
                      const next = [...selected];
                      next[i] = e.target.checked;
                      setSelected(next);
                    }}
                    className="accent-primary"
                  />
                  ({pf.hkl.trim()})&nbsp; 2θ = {pf.twoTheta.toFixed(2)}°
                </label>
              ))}
            </div>

            <div className={boxCls}>
              <span className={labelCls}>Show</span>
              <div className="flex gap-2 flex-wrap">
                {(["raw", "smoothed", "both"] as Mode[]).map((m) => (
                  <button key={m} className={segBtn(mode === m)} onClick={() => setMode(m)}>
                    {m === "raw" ? "as measured" : m}
                  </button>
                ))}
              </div>
            </div>

            <div className={boxCls}>
              <span className={labelCls}>Display</span>
              <div className={rawOnly ? "opacity-40 pointer-events-none" : ""}>
                <div className="flex justify-between text-sm mb-1">
                  <span>Smoothing σ</span>
                  <span className="text-muted">{sigma.toFixed(1)}°</span>
                </div>
                <input
                  type="range" min={0} max={10} step={0.1} value={sigma}
                  disabled={rawOnly}
                  onChange={(e) => setSigma(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <label className="flex flex-col gap-1 text-sm">
                <span>Colour map</span>
                <select
                  value={cmapName}
                  onChange={(e) => setCmapName(e.target.value)}
                  className="bg-background border border-border rounded-lg px-2 py-1.5
                    text-sm focus:border-primary outline-none"
                >
                  {COLORMAPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox" checked={log}
                  onChange={(e) => setLog(e.target.checked)}
                  className="accent-primary"
                />
                Logarithmic level spacing
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span>Max level</span>
                <input
                  value={vmaxStr}
                  onChange={(e) => setVmaxStr(e.target.value)}
                  className="w-20 bg-background border border-border rounded-lg px-2 py-1
                    text-sm text-right focus:border-primary outline-none"
                />
              </label>
            </div>

            <div className={boxCls}>
              <span className={labelCls}>Projection &amp; orientation</span>
              <div className="flex gap-2 flex-wrap">
                <button
                  className={segBtn(projection === "stereographic")}
                  onClick={() => setProjection("stereographic")}
                >
                  stereographic
                </button>
                <button
                  className={segBtn(projection === "equal-area")}
                  onClick={() => setProjection("equal-area")}
                >
                  equal-area
                </button>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 text-sm mb-1">
                  <span>Rotate β</span>
                  <span className="flex items-center gap-1">
                    <input
                      type="number" min={-180} max={180} step={0.5} value={betaOffset}
                      onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        if (Number.isFinite(v))
                          setBetaOffset(Math.min(Math.max(v, -180), 180));
                      }}
                      className="w-20 bg-background border border-border rounded-lg px-2 py-1
                        text-sm text-right focus:border-primary outline-none"
                    />
                    <span className="text-muted">°</span>
                  </span>
                </div>
                <input
                  type="range" min={-180} max={180} step={0.5} value={betaOffset}
                  onChange={(e) => setBetaOffset(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox" checked={flip}
                  onChange={(e) => setFlip(e.target.checked)}
                  className="accent-primary"
                />
                Mirror (flip TD)
              </label>
              <label className="flex items-center justify-between gap-2 text-sm">
                <span>Centre ring</span>
                <select
                  value={centre}
                  onChange={(e) => setCentre(e.target.value as Centre)}
                  className="bg-background border border-border rounded-lg px-2 py-1.5
                    text-sm focus:border-primary outline-none"
                >
                  <option value="first">file order</option>
                  <option value="auto">auto detect</option>
                  <option value="last">reversed</option>
                </select>
              </label>
            </div>

            <div className={boxCls}>
              <span className={labelCls}>Export</span>
              <div className="flex gap-2">
                <button
                  onClick={exportPNG}
                  className="flex-1 flex items-center justify-center gap-2 text-sm border
                    border-border rounded-lg py-2 text-muted hover:text-foreground
                    hover:border-primary/50 transition-colors"
                >
                  <Download className="w-4 h-4" /> PNG
                </button>
                <button
                  onClick={exportCSV}
                  className="flex-1 flex items-center justify-center gap-2 text-sm border
                    border-border rounded-lg py-2 text-muted hover:text-foreground
                    hover:border-primary/50 transition-colors"
                >
                  <Download className="w-4 h-4" /> CSV
                </button>
              </div>
            </div>

            {stats.length > 0 && (
              <div className={boxCls}>
                <span className={labelCls}>Numbers</span>
                <pre className="text-[11px] leading-relaxed text-foreground/90
                  whitespace-pre-wrap font-mono">
                  {stats.map(({ hkl, s }) =>
                    `(${hkl.trim()})\n` +
                    `  max        ${s.rawMax.toFixed(2).padStart(8)}  m.r.d.\n` +
                    `  min        ${s.rawMin.toFixed(2).padStart(8)}\n` +
                    `  median     ${s.median.toFixed(2).padStart(8)}\n` +
                    `  smoothed   ${s.smoothMax.toFixed(2).padStart(8)}  max\n` +
                    `  PF index   ${s.pfIndex.toFixed(2).padStart(8)}  (1 = random)\n` +
                    `  >5 m.r.d.  ${(100 * s.fracGt5).toFixed(1).padStart(7)} %\n` +
                    (s.grainy
                      ? `  !! peaks collapse ${s.spikiness.toFixed(0)}x under 3° ` +
                        `smoothing\n     -> coarse grain / poor grain statistics,` +
                        ` not resolvable texture\n`
                      : "")
                  ).join("\n")}
                </pre>
              </div>
            )}
          </>
        )}
      </aside>

      {/* ------------------------------------------------ figures */}
      <div className="flex-1 min-w-0">
        {!pfs ? (
          <div className="h-full min-h-[320px] border border-border rounded-xl
            flex flex-col items-center justify-center gap-3 text-muted text-sm p-8
            text-center">
            <FlaskConical className="w-8 h-8" />
            <p>
              Open a Philips / PANalytical <span className="text-foreground">.PLF</span>{" "}
              pole-figure file, or load the demo data to explore the viewer.
            </p>
            <p className="text-xs text-muted/70">
              Everything runs in your browser — files never leave your machine.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="text-center">
              <h3 className="font-bold text-lg">{pfs[0].sample}</h3>
              <p className="text-xs text-muted mt-1">
                {projName} projection · normalised to multiples of a random
                distribution · measured to α = {pfs[0].alphaMax.toFixed(0)}° (dashed)
              </p>
            </div>
            {selectedIdx.length === 0 ? (
              <p className="text-center text-muted text-sm py-16">
                No pole figure selected
              </p>
            ) : (
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns:
                    `repeat(${Math.min(selectedIdx.length, 3)}, minmax(0, 1fr))`,
                }}
              >
                {selectedIdx.map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden
                    border border-border flex flex-col">
                    {rows.filter((r) => r.pfIndex === i).map((r) => (
                      <canvas
                        key={r.key}
                        ref={(el) => {
                          if (el) canvases.current.set(r.key, el);
                          else canvases.current.delete(r.key);
                        }}
                        onClick={() => setZoomKey(r.key)}
                        title="Click to enlarge"
                        className="w-full h-auto cursor-zoom-in"
                      />
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ------------------------------------------------ zoom lightbox */}
      {zoomKey && (
        <div
          onClick={() => setZoomKey(null)}
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-sm
            flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
        >
          <button
            onClick={() => setZoomKey(null)}
            aria-label="Close enlarged view"
            className="absolute top-4 right-4 text-white/70 hover:text-white
              transition-colors"
          >
            <X className="w-7 h-7" />
          </button>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl overflow-auto max-h-full cursor-default"
          >
            <canvas
              ref={zoomCanvas}
              className="h-auto w-[min(92vw,85vh)] max-w-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
