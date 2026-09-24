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
    <div className="mx-auto max-w-[1200px] px-6 pt-16 pb-24">
      <p className="t-label text-ink-muted mb-3">
        Tools
      </p>
      <h1 className="mb-4 text-[40px] leading-[52px] font-normal tracking-[0.02em]">
        Material science tools
      </h1>
      <p className="text-ink-muted max-w-[640px] mb-12">
        Interactive utilities from my materials research work. Everything runs
        locally in your browser, so nothing you open here is uploaded anywhere.
      </p>

      <section>
        <h2 className="t-h2 mb-2">Pole figure viewer</h2>
        <p className="text-ink-muted max-w-[640px] mb-6">
          View Philips / PANalytical <span className="text-foreground">.PLF</span>{" "}
          X-ray pole-figure files: intensities are normalised to multiples of a
          random distribution (m.r.d.) and projected stereographically or
          equal-area. Includes texture metrics and PNG / CSV export.
        </p>
        <PoleFigureViewer />
      </section>
    </div>
  );
}
