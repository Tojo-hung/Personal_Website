import type { Metadata } from "next";
import PoleFigureViewer from "@/components/tools/PoleFigureViewer";

export const metadata: Metadata = {
  title: "Material Science Tools — Thomas Hung",
  description:
    "Browser-based material science tools: an interactive X-ray pole figure " +
    "viewer for Philips / PANalytical .PLF texture measurements.",
};

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
      <p className="text-primary text-sm uppercase tracking-[0.3em] mb-3">
        Tools
      </p>
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Material Science Tools
      </h1>
      <p className="text-muted max-w-2xl mb-12 text-sm leading-relaxed">
        Interactive utilities from my materials research work. Everything runs
        locally in your browser — no data is uploaded anywhere.
      </p>

      <section>
        <h2 className="text-xl font-bold mb-1">Pole Figure Viewer</h2>
        <p className="text-muted text-sm max-w-3xl mb-6 leading-relaxed">
          View Philips / PANalytical <span className="text-foreground">.PLF</span>{" "}
          X-ray pole-figure files: intensities are normalised to multiples of a
          random distribution (m.r.d.), optionally smoothed with a Gaussian over
          true angular distance on the sphere, and projected stereographically
          or equal-area. Includes texture metrics and PNG / CSV export.
        </p>
        <PoleFigureViewer />
      </section>
    </div>
  );
}
