"use client";

import { useEffect, useRef, useState } from "react";

import type { ProjectModel3D } from "@/types/projects";

const SCRIPT_ID = "model-viewer-script";
const SCRIPT_SRC = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";

interface ModelViewerProps {
  model: ProjectModel3D;
}

export default function ModelViewer({ model }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.type = "module";
      script.src = SCRIPT_SRC;
      document.head.appendChild(script);
    }

    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const handleError = () => setFailed(true);
    let viewer: HTMLElement | null = null;

    // Mount a beat later so React StrictMode's double effect never creates
    // two WebGL contexts at once.
    const mountTimer = setTimeout(() => {
      viewer = document.createElement("model-viewer");
      viewer.setAttribute("src", model.src);
      viewer.setAttribute("poster", model.poster);
      viewer.setAttribute("alt", model.alt);
      viewer.setAttribute("camera-controls", "");
      viewer.setAttribute("touch-action", "pan-y");
      viewer.setAttribute("shadow-intensity", "1");
      viewer.setAttribute("exposure", "1");
      viewer.setAttribute("loading", "lazy");
      if (model.cameraOrbit) viewer.setAttribute("camera-orbit", model.cameraOrbit);
      if (model.cameraTarget) viewer.setAttribute("camera-target", model.cameraTarget);
      if (model.fieldOfView) viewer.setAttribute("field-of-view", model.fieldOfView);
      viewer.style.cssText = "display:block;width:100%;height:100%;background:var(--paper-sunk)";
      viewer.addEventListener("error", handleError);
      container.appendChild(viewer);
    }, 100);

    return () => {
      clearTimeout(mountTimer);
      viewer?.removeEventListener("error", handleError);
      container.innerHTML = "";
    };
  }, [model]);

  return (
    <figure className="m-0 flex flex-col gap-2">
      <div
        ref={containerRef}
        className="h-[360px] w-full border border-line bg-paper-sunk bg-contain bg-center bg-no-repeat md:h-[440px]"
        style={{ backgroundImage: `url(${model.poster})` }}
      />
      <figcaption className="t-caption flex justify-between gap-3 text-ink-muted">
        <span>
          {failed
            ? "Model not available yet"
            : "The actual CAD. Drag to turn it, scroll to zoom, pinch on a phone."}
        </span>
        <span className="text-right">{model.label}</span>
      </figcaption>
    </figure>
  );
}
