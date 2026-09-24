"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { projects } from "@/data/site";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ProjectRecord } from "@/types/projects";

const ModelViewer = dynamic(() => import("@/components/cad/ModelViewer"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full border border-line bg-paper-sunk md:h-[440px]" />,
});

const FLIP_MS = 850;

function framesOf(project: ProjectRecord) {
  return project.image ? [project.image, ...project.gallery] : [];
}

interface CardProps {
  project: ProjectRecord;
  open: boolean;
  frame: number | null;
  onSelect: () => void;
  onHover: (hovering: boolean) => void;
}

function ProjectCard({ project, open, frame, onSelect, onHover }: CardProps) {
  const frames = framesOf(project);
  const flipping = frame !== null && frames.length > 1;
  const current = flipping ? frame % frames.length : 0;

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls="project-detail"
      onClick={onSelect}
      onPointerEnter={(e) => e.pointerType === "mouse" && onHover(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && onHover(false)}
      className="flex min-w-0 cursor-pointer flex-col gap-3 border-0 bg-transparent p-0 text-left text-ink"
    >
      {frames.length > 0 ? (
        <div className="relative aspect-square w-full bg-hinoki">
          {frames.map((src, i) => (
            <Image
              key={src}
              src={src}
              alt=""
              fill
              sizes="(min-width: 1200px) 280px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
              style={{ visibility: i === current ? "visible" : "hidden" }}
            />
          ))}
          {project.model3d && (
            <span className="absolute top-2 left-2 inline-flex h-[22px] items-center rounded-[2px] bg-paper-raised px-2 text-[11px] leading-4 font-medium tracking-[0.08em] text-ink uppercase">
              3D model
            </span>
          )}
          {flipping && (
            <div aria-hidden="true" className="absolute right-2 bottom-2 left-2 flex gap-1">
              {frames.map((src, i) => (
                <div
                  key={src}
                  className="h-[2px] flex-1"
                  style={{ background: i === current ? "var(--paper)" : "rgba(28,26,23,0.45)" }}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="t-label flex aspect-square w-full items-end bg-hinoki p-4 text-ink">
          Photos soon
        </div>
      )}
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] leading-[22px]">{project.title}</span>
        <span className="text-[13px] leading-5 text-ink-muted">
          {project.role} · {project.when}
        </span>
      </div>
      {open && <div className="h-[2px] w-full bg-ink" />}
    </button>
  );
}

function ProjectDetail({ project }: { project: ProjectRecord }) {
  return (
    <div
      id="project-detail"
      className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] gap-8 border border-line bg-paper-raised p-6 md:p-8"
    >
      {project.model3d && (
        <div className="col-span-full">
          <ModelViewer model={project.model3d} />
        </div>
      )}
      <div className="flex max-w-[640px] flex-col gap-4">
        <h3 className="t-h3 m-0">{project.title}</h3>
        <p className="m-0 text-pretty">{project.summary}</p>
        {project.bullets.map((bullet) => (
          <p key={bullet} className="m-0 border-l border-line-strong pl-4 text-ink-muted text-pretty">
            {bullet}
          </p>
        ))}
        <div className="flex flex-wrap gap-4 text-[13px] leading-[22px]">
          <span className="text-ink-muted">{project.tools}</span>
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
      {project.gallery.length > 0 && (
        <div className="grid grid-cols-2 content-start gap-2">
          {project.gallery.map((src) => (
            <div key={src} className="relative aspect-square w-full bg-paper-sunk">
              <Image src={src} alt="" fill sizes="(min-width: 768px) 260px, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const still = useReducedMotion();
  const [openProjectId, setOpenProjectId] = useState<string | null>(null);
  const [hoverProjectId, setHoverProjectId] = useState<string | null>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!hoverProjectId || still) return;
    const id = setInterval(() => setFrame((f) => f + 1), FLIP_MS);
    return () => clearInterval(id);
  }, [hoverProjectId, still]);

  const openProject = projects.find((p) => p.id === openProjectId) ?? null;

  return (
    <section id="work" className="flex scroll-mt-6 flex-col gap-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h2 className="t-h2 m-0">What I&apos;ve been making</h2>
        <span className="text-[13px] text-ink-muted">
          Hover to flip through photos. Click and I&apos;ll tell you about it.
        </span>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            open={openProjectId === project.id}
            frame={!still && hoverProjectId === project.id ? frame : null}
            onSelect={() => setOpenProjectId((id) => (id === project.id ? null : project.id))}
            onHover={(hovering) => {
              setHoverProjectId(hovering ? project.id : null);
              setFrame(hovering ? 1 : 0);
            }}
          />
        ))}
      </div>
      {openProject && <ProjectDetail key={openProject.id} project={openProject} />}
    </section>
  );
}
