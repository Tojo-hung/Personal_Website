"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";

import type { ProjectRecord } from "@/types/projects";

const LazyModelViewer = dynamic(() => import("@/components/cad/ModelViewer"), {
  ssr: false,
  loading: () => (
    <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-background/60 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.25)]">
      <div className="flex h-[22rem] w-full items-center justify-center rounded-[1.25rem] border border-white/8 bg-gradient-to-br from-white/[0.06] via-transparent to-primary/10 md:h-[28rem]">
        <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center backdrop-blur-md">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary/90">
            Loading Viewer
          </p>
          <p className="mt-2 text-sm text-white/70">
            Preparing the interactive CAD preview...
          </p>
        </div>
      </div>
    </div>
  ),
});

const projectsData: ProjectRecord[] = [
  {
    id: "aquafoil",
    title: "aQuaFoil",
    subtitle: "Sustainable Performance",
    tag: "Leadership · Composites",
    year: "2026 - 2027",
    role: "Co-Founder",
    tools: "OpenFOAM · Composites · FEA",
    summary:
      "Co-founded a design team building a competition-grade foiling Moth for the SuMoth Challenge 2027.",
    description:
      "I co-founded aQuaFoil, operating at the intersection of environmental responsibility and elite performance. We treat sustainability not as a constraint, but as the design brief. Our goal is to demonstrate that engineering excellence and environmental responsibility are the same pursuit.\n\nWe are building a foiling Moth, one of sailing's most technically unforgiving vessels, utilizing bio-composite construction. This involves sustainable reinforcement fibres and bio-based epoxy resin systems.",
    bullets: [
      "Leading a team of 30+ engineers across materials science, structures, hydrodynamics, and fabrication.",
      "Implementing a CFD-optimized OpenFOAM simulation pipeline for hydrofoil lift, drag, and cavitation analysis.",
      "Integrating full lifecycle material assessments and FEA structural validation into the core manufacturing plan.",
    ],
    color: "from-[#0f152a] to-[#1a2544]",
    image: null,
    gallery: [
      { src: "/images/hero-1.jpg", caption: "Foil design" },
      { src: "/images/hero-2.JPG", caption: "Hull rendering" },
    ],
    pills: ["Leadership", "CFD", "Composites"],
    githubUrl: "https://github.com/Tojo-hung/Hull_Design",
    liveUrl: "https://www.aquafoil.ca/",
  },
  {
    id: "aquatonomous",
    title: "aQuatonomous",
    subtitle: "RoboBoat 2026",
    tag: "Autonomous Systems · Team Lead",
    year: "2024 - 2026",
    role: "Mechanical Director",
    tools: "SolidWorks · FDM 3D Printing · Fiberglass Composites · Project Management",
    summary:
      "Mechanical team director for the Queen's autonomous surface vehicle team. Designed and manufactured fiberglass hulls.",
    description:
      "As the Mechanical Team Director for Queen's University's autonomous surface vehicle team, I manage the full mechanical lifecycle for the RoboBoat challenge, from parametric CAD in SolidWorks to on-water testing.\n\nI developed a unique fabrication process utilizing FDM 3D printed mold segments glued together for a full-scale mold.",
    bullets: [
      "Designed an optimized, segmented 3D printed hull mold strategy.",
      "Manufactured a modular aluminum crossbeam platform for sensitive IMU, electronics, and propulsion hardware.",
      "Coordinated a multi-disciplinary team to integrate electrical interfaces securely.",
    ],
    color: "from-blue-900 to-indigo-900",
    image: "/images/aquatonomous-hero.jpg",
    gallery: [
      { src: "/images/aq-layup.jpg", caption: "Build" },
      { src: "/images/aq-water.jpg", caption: "Testing" },
      { src: "/images/aq-assembly.png", caption: "CAD" },
      { src: "/images/aq-mold.jpg", caption: "Mold" },
    ],
    pills: [
      "SolidWorks",
      "FDM 3D Printing",
      "Fiberglass Composites",
      "Project Management",
    ],
    githubUrl: "https://github.com/aQuatonomous",
    liveUrl: "https://aquatonomous.vercel.app/",
    model3d: {
      src: "/models/Frontenac_Assembly.glb",
      poster: "/images/aq-assembly.png",
      alt: "Interactive CAD preview of the aQuatonomous RoboBoat hull assembly.",
      cameraOrbit: "35deg 68deg 130%",
      cameraTarget: "auto auto auto",
      fieldOfView: "28deg",
    },
  },
  {
    id: "csa-arm",
    title: "CSA Robotic Arm",
    subtitle: "End-Effector",
    tag: "Space · Robotics · Design",
    year: "Winter 2025",
    role: "Designer",
    tools: "SolidWorks · FEA · TPU",
    summary:
      "Designed a robotic arm end-effector prototype in collaboration with the Canadian Space Agency.",
    description:
      "Partnering with the Canadian Space Agency, I designed a robotic arm end-effector prototype capable of handling irregular payloads. The CSA provided strict constraints regarding size, mass budget, and payload retention.\n\nWe translated mission objectives into parametric models utilizing SolidWorks, combining rigid PLA+ structural components with flexible TPU grip pads.",
    bullets: [
      "Conducted FEA simulations to find a geometry that allowed for a Fin Ray inspired compliant mechanism built with PLA and TPU using an FDM 3D printer.",
      "Tuned print layout for precise slip-fit joints, requiring zero post-processing.",
      "Tested and successfully validated payload retention and grip force against CSA client acceptance criteria.",
    ],
    color: "from-zinc-800 to-zinc-950",
    image: "/images/csa-arm-hero.jpg",
    gallery: [
      { src: "/images/csa-fea.png", caption: "FEA" },
      { src: "/images/csa-assembly.png", caption: "CAD" },
    ],
    pills: ["SolidWorks", "FEA", "TPU"],
  },
  {
    id: "foil-gauge",
    title: "Windsurf Foil Gauge",
    subtitle: "Precision Tool",
    tag: "Product Design · Business",
    year: "2023",
    role: "Creator",
    tools: "3D Scanning · CAD · FDM",
    summary:
      "Designed, prototyped, and sold an FDM-printed gauge to measure wing angle of attack for Olympic windsurfing.",
    description:
      "In Olympic iQFOiL windsurfing, wing angle of attack is critical for tuning hydrofoil lift. Having competed internationally, I realized athletes lacked a reliable tool for this, so I designed a purpose-built precision gauge.\n\nI captured the exact mast base geometry using 3D scanning, designing a bespoke PETG two-part gauge via Fusion 360 that mounts automatically without user calibration.",
    bullets: [
      "Integrated an embedded bubble level and laser-engraved angular scale, reducing setup time to under 30 seconds.",
      "Iterated prototype geometries using athlete feedback to ensure weather resistance and tight slip-fit tolerances.",
      "Manufactured and sold commercial units to international fleets on the World Championship circuit.",
    ],
    color: "from-purple-900/40 to-black",
    image: "/images/iqfoil-start.JPG",
    gallery: [],
    pills: ["3D Scanning", "CAD", "FDM"],
    model3d: {
      src: "/models/foil-gauge.glb",
      poster: "/images/hero-4.jpg",
      alt: "Interactive CAD preview of the windsurf foil gauge.",
      cameraOrbit: "20deg 70deg 120%",
      cameraTarget: "auto auto auto",
      fieldOfView: "22deg",
    },
  },
];

function ProjectLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(event) => event.stopPropagation()}
      className="rounded-full bg-white/5 p-2 text-muted transition-colors hover:bg-white/10 hover:text-primary"
    >
      <span className="sr-only">{label}</span>
      {icon}
    </a>
  );
}

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const mounted = typeof document !== "undefined";

  const selectedProject = projectsData.find((project) => project.id === selectedId);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    document.body.style.overflow = selectedId ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mounted, selectedId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null || !selectedProject) {
        if (event.key === "Escape" && selectedId) {
          setSelectedId(null);
        }
        return;
      }

      const totalImages = selectedProject.gallery.length;

      if (event.key === "ArrowRight") {
        setSelectedImageIndex((current) =>
          current !== null ? (current + 1) % totalImages : 0,
        );
      } else if (event.key === "ArrowLeft") {
        setSelectedImageIndex((current) =>
          current !== null ? (current - 1 + totalImages) % totalImages : 0,
        );
      } else if (event.key === "Escape") {
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedId, selectedImageIndex, selectedProject]);

  const openModal = (projectId: string) => {
    setSelectedId(projectId);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
    setSelectedId(null);
  };

  return (
    <section id="projects" className="relative py-24">
      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="mb-2 font-mono text-sm uppercase tracking-widest text-primary">
            Selected Work
          </div>
          <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
            Featured{" "}
            <span className="bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projectsData.map((project, index) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              onClick={() => openModal(project.id)}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-white/10 bg-surface shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-primary/50"
            >
              <div className="pointer-events-none absolute -inset-0.5 z-0 rounded-3xl bg-primary/20 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100" />

              <div
                className={`relative z-10 flex h-64 w-full items-center justify-center overflow-hidden bg-gradient-to-br ${project.color}`}
              >
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <span className="font-mono font-bold uppercase tracking-widest text-primary opacity-70 drop-shadow-md transition-opacity group-hover:opacity-100">
                    {project.title}
                  </span>
                )}

                {project.model3d && (
                  <div className="absolute left-5 top-5 rounded-full border border-primary/30 bg-black/45 px-3 py-1 text-[0.65rem] font-mono uppercase tracking-[0.25em] text-primary backdrop-blur-md">
                    3D Ready
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
              </div>

              <div className="relative z-10 flex flex-grow flex-col bg-surface p-8">
                <div className="mb-3 text-xs font-mono text-primary">{project.tag}</div>
                <h3 className="mb-3 text-2xl font-bold tracking-tight">{project.title}</h3>
                <p className="mb-6 flex-grow font-light text-muted">{project.summary}</p>

                <div className="mt-auto flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.pills.map((pill) => (
                      <span
                        key={pill}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted"
                      >
                        {pill}
                      </span>
                    ))}
                  </div>

                  <div className="flex min-h-[4rem] items-center gap-4 border-t border-white/5 pt-4">
                    {project.githubUrl && (
                      <ProjectLink
                        href={project.githubUrl}
                        label="GitHub"
                        icon={
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="h-5 w-5"
                          >
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                          </svg>
                        }
                      />
                    )}
                    {project.liveUrl && (
                      <ProjectLink
                        href={project.liveUrl}
                        label="Live Site"
                        icon={<ExternalLink className="h-5 w-5" />}
                      />
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedId && selectedProject && (
              <div className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={closeModal}
                  className="pointer-events-auto absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="pointer-events-auto relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-y-auto rounded-3xl border border-white/10 bg-surface shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                >
                  <div className="relative">
                    <div
                      className={`relative flex h-64 w-full items-center justify-center bg-gradient-to-br ${selectedProject.color} md:h-96`}
                    >
                      {selectedProject.image ? (
                        <Image
                          src={selectedProject.image}
                          alt={selectedProject.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="font-mono text-2xl font-bold uppercase tracking-widest text-primary shadow-sm">
                          {selectedProject.title}
                        </span>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90" />
                    </div>

                    <button
                      onClick={closeModal}
                      className="fixed right-6 top-6 z-[110] rounded-full border border-white/10 bg-black/40 p-2 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="relative p-8 md:p-12">
                    <div className="flex flex-col gap-12 md:flex-row">
                      <div className="md:w-2/3">
                        <h3 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">
                          {selectedProject.title}
                        </h3>
                        <div className="mb-8 text-xl font-light italic text-primary">
                          {selectedProject.subtitle}
                        </div>

                        <div className="max-w-none">
                          {selectedProject.description.split("\n").map((paragraph, index) => (
                            <p
                              key={`${selectedProject.id}-paragraph-${index}`}
                              className="mb-4 font-light leading-relaxed text-muted"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>

                        {selectedProject.model3d && (
                          <LazyModelViewer model={selectedProject.model3d} />
                        )}

                        <h4 className="mt-10 mb-4 border-b border-white/10 pb-2 text-xl font-bold">
                          Key Engineering Scope
                        </h4>
                        <ul className="mb-8 space-y-3 font-light text-muted">
                          {selectedProject.bullets.map((bullet, index) => (
                            <li key={`${selectedProject.id}-bullet-${index}`} className="flex gap-3">
                              <span className="mt-1 text-primary">▹</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>

                        {selectedProject.gallery.length > 0 && (
                          <>
                            <h4 className="mt-10 mb-6 border-b border-white/10 pb-2 text-xl font-bold">
                              Gallery
                            </h4>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {selectedProject.gallery.map((image, index) => (
                                <button
                                  key={`${selectedProject.id}-gallery-${index}`}
                                  type="button"
                                  onClick={() => setSelectedImageIndex(index)}
                                  className="group relative aspect-video overflow-hidden rounded-xl border border-white/5 bg-background/50 text-left"
                                >
                                  <Image
                                    src={image.src}
                                    alt={image.caption}
                                    fill
                                    className="object-cover transition-transform group-hover:scale-105"
                                    unoptimized
                                  />
                                  <div className="absolute inset-0 z-10 hidden bg-black/0 transition-colors group-hover:bg-black/20 md:block" />
                                  <div className="absolute inset-x-0 bottom-0 z-20 bg-black/60 p-2 text-center font-mono text-xs text-white backdrop-blur-sm">
                                    {image.caption}
                                  </div>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      <div className="md:w-1/3">
                        <div className="sticky top-6 rounded-2xl border border-white/5 bg-background p-6">
                          <h4 className="mb-6 text-lg font-bold">Project Specs</h4>

                          <div className="space-y-4 font-mono text-sm">
                            <div>
                              <div className="mb-1 text-muted/60">Role</div>
                              <div className="text-foreground">{selectedProject.role}</div>
                            </div>
                            <div>
                              <div className="mb-1 text-muted/60">Timeline</div>
                              <div className="text-foreground">{selectedProject.year}</div>
                            </div>
                            <div>
                              <div className="mb-1 text-muted/60">Tools</div>
                              <div className="text-primary">{selectedProject.tools}</div>
                            </div>
                            {selectedProject.model3d && (
                              <div>
                                <div className="mb-1 text-muted/60">3D Asset</div>
                                <div className="break-all text-foreground">
                                  {selectedProject.model3d.src}
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="mt-8 border-t border-white/5 pt-8">
                            <h4 className="mb-4 text-lg font-bold">Tags</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.pills.map((pill) => (
                                <span
                                  key={`${selectedProject.id}-${pill}`}
                                  className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                                >
                                  {pill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selectedImageIndex !== null && selectedProject && (
              <div className="pointer-events-none fixed inset-0 z-[200] flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedImageIndex(null)}
                  className="pointer-events-auto absolute inset-0 cursor-pointer bg-black/95 backdrop-blur-md"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="pointer-events-auto relative flex max-h-screen w-full max-w-7xl flex-col items-center justify-center p-4"
                >
                  <button
                    onClick={() => setSelectedImageIndex(null)}
                    className="absolute right-4 top-4 z-50 rounded-full border border-white/10 bg-black/50 p-3 text-white transition-colors hover:bg-white hover:text-black md:right-8 md:top-8"
                  >
                    <X size={24} />
                  </button>

                  {selectedProject.gallery.length > 1 && (
                    <>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedImageIndex(
                            (selectedImageIndex - 1 + selectedProject.gallery.length) %
                            selectedProject.gallery.length,
                          );
                        }}
                        className="absolute left-4 z-50 hidden rounded-full border border-white/10 bg-black/50 p-3 text-white transition-colors hover:bg-white hover:text-black sm:block md:left-8"
                      >
                        <ChevronLeft size={32} />
                      </button>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedImageIndex(
                            (selectedImageIndex + 1) % selectedProject.gallery.length,
                          );
                        }}
                        className="absolute right-4 z-50 hidden rounded-full border border-white/10 bg-black/50 p-3 text-white transition-colors hover:bg-white hover:text-black sm:block md:right-8"
                      >
                        <ChevronRight size={32} />
                      </button>
                    </>
                  )}

                  <div
                    className="relative h-[75vh] w-full cursor-pointer md:h-[85vh]"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedImageIndex(
                        (selectedImageIndex + 1) % selectedProject.gallery.length,
                      );
                    }}
                  >
                    <Image
                      src={selectedProject.gallery[selectedImageIndex].src}
                      alt={selectedProject.gallery[selectedImageIndex].caption}
                      fill
                      className="object-contain drop-shadow-2xl"
                      unoptimized
                    />
                  </div>

                  <div className="mt-6 text-center font-mono font-medium tracking-wider text-white/70">
                    {selectedProject.gallery[selectedImageIndex].caption}
                    <span className="ml-3 opacity-50">
                      ({selectedImageIndex + 1} / {selectedProject.gallery.length})
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
