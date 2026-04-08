"use client";

import { useEffect, useRef, useState } from "react";

import type { ProjectModel3D } from "@/types/projects";

type LoadState = "loading" | "ready" | "error";

interface ModelViewerProps {
  model: ProjectModel3D;
}

export default function ModelViewer({ model }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 1. Ensure the CDN script is loaded
    if (!document.getElementById("model-viewer-script")) {
      const script = document.createElement("script");
      script.id = "model-viewer-script";
      script.type = "module";
      script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.2.0/model-viewer.min.js";
      document.head.appendChild(script);
    }

    if (!containerRef.current) return;
    
    // Clear any previous instances immediately
    containerRef.current.innerHTML = "";

    // Delay mounting by 400ms to allow Framer Motion scale animations to finish
    // and debounce React StrictMode double-invocations which crash WebGL context
    let viewer: any = null;
    let handleLoad: any;
    let handleError: any;
    let handleProgress: any;

    const mountTimer = setTimeout(() => {
      if (!containerRef.current) return;

      // 2. Create the element using Vanilla JS
      viewer = document.createElement("model-viewer");
      
      // Configure properties
      viewer.src = model.src;
      viewer.loading = "lazy";
      viewer.reveal = "auto";
      viewer.exposure = 1;
      viewer.shadowIntensity = 1;
      viewer.interactionPrompt = "auto";
      viewer.interactionPromptThreshold = 1500;
      viewer.setAttribute("camera-controls", "true");
      viewer.setAttribute("touch-action", "pan-y");
      
      if (model.poster) viewer.poster = model.poster;
      if (model.alt) viewer.alt = model.alt;
      if (model.cameraOrbit) viewer.cameraOrbit = model.cameraOrbit;
      if (model.cameraTarget) viewer.cameraTarget = model.cameraTarget;
      if (model.fieldOfView) viewer.fieldOfView = model.fieldOfView;

      // Apply tailwind styling directly
      viewer.className = "block w-full h-[22rem] md:h-[28rem] bg-transparent";

      // 3. Setup Events
      handleLoad = () => {
        setLoadState("ready");
        setProgress(100);
      };

      handleError = (event: any) => {
        console.error("ModelViewer error:", event);
        setLoadState("error");
        setProgress(0);
      };

      handleProgress = (event: any) => {
        const detail = event.detail;
        const nextProgress = detail?.totalProgress ?? 0;
        setProgress(Math.round(nextProgress * 100));
      };

      viewer.addEventListener("load", handleLoad);
      viewer.addEventListener("error", handleError);
      viewer.addEventListener("progress", handleProgress);

      // Mount to the DOM
      containerRef.current.appendChild(viewer);
    }, 400);

    return () => {
      clearTimeout(mountTimer);
      if (viewer) {
        viewer.removeEventListener("load", handleLoad);
        viewer.removeEventListener("error", handleError);
        viewer.removeEventListener("progress", handleProgress);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [model]);

  return (
    <div className="mt-10 rounded-[1.75rem] border border-white/10 bg-background/60 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      <div className="relative overflow-hidden rounded-[1.25rem] border border-white/8 bg-gradient-to-br from-white/[0.06] via-transparent to-primary/10">
        <div ref={containerRef} className="block w-full h-[22rem] md:h-[28rem]" />

        <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md rounded-2xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur-md">
            <p className="text-[0.7rem] font-mono uppercase tracking-[0.3em] text-primary/90">
              Interactive CAD View
            </p>
            <p className="mt-2 text-sm text-white/80">
              Drag to rotate. Scroll to zoom. Pinch and drag on mobile.
            </p>
          </div>

          {loadState === "loading" && (
            <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white/75 backdrop-blur-md">
              Loading model{progress > 0 ? `... ${progress}%` : "..."}
            </div>
          )}
        </div>

        {loadState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/55 p-6 backdrop-blur-sm">
            <div className="max-w-md rounded-3xl border border-amber-400/20 bg-surface/95 p-6 text-center shadow-xl">
              <p className="text-xs font-mono uppercase tracking-[0.25em] text-amber-300">
                3D Model Not Available Yet
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Add the exported GLB at <code>{model.src}</code> to activate this
                viewer. The poster image stays in place until the asset is ready.
              </p>
            </div>
          </div>
        )}
      </div>

      {model.notes && model.notes.length > 0 && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {model.notes.map((note) => (
            <div
              key={note}
              className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-muted"
            >
              {note}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
