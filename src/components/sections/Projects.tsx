"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

const projectsData = [
  {
    id: "aquafoil",
    title: "aQuaFoil",
    subtitle: "Sustainable Performance",
    tag: "Leadership · Composites",
    year: "2026 — 2027",
    role: "Co-Founder",
    tools: "OpenFOAM · Composites · FEA",
    summary: "Co-founded a design team building a competition-grade foiling Moth for the SuMoth Challenge 2027.",
    description: "I co-founded aQuaFoil, operating at the intersection of environmental responsibility and elite performance. We treat sustainability not as a constraint, but as the design brief. Our goal is to demonstrate that engineering excellence and environmental responsibility are the same pursuit.\n\nWe are building a foiling Moth — one of sailing's most technically unforgiving vessels — utilizing bio-composite construction. This involves sustainable reinforcement fibres and bio-based epoxy resin systems.",
    bullets: [
      "Leading a team of 30+ engineers across materials science, structures, hydrodynamics, and fabrication.",
      "Implementing a CFD-optimized OpenFOAM simulation pipeline for hydrofoil lift, drag, and cavitation analysis.",
      "Integrating full lifecycle material assessments and FEA structural validation into the core manufacturing plan."
    ],
    color: "from-[#0f152a] to-[#1a2544]",
    image: null,
    gallery: [
      { src: "/images/hero-1.jpg", caption: "Foil design" },
      { src: "/images/hero-2.JPG", caption: "Hull rendering" }
    ],
    pills: ["Leadership", "CFD", "Composites"]
  },
  {
    id: "aquatonomous",
    title: "aQuatonomous",
    subtitle: "RoboBoat 2026",
    tag: "Autonomous Systems · Team Lead",
    year: "2024 — Present",
    role: "Mechanical Director",
    tools: "SolidWorks · FDM · Fiberglass",
    summary: "Mechanical team lead for the Queen's autonomous surface vehicle. Designed and manufactured fiberglass hulls.",
    description: "As Mechanical Team Lead for Queen's University's autonomous surface vehicle (ASV) team, I managed the full mechanical lifecycle for the RoboBoat challenge—from parametric CAD in SolidWorks to on-water testing.\n\nI developed a unique fabrication process utilizing FDM-printed mold segments bolted together for a full-scale mold. This allowed rapid fiberglass layups, cutting mold lead time by 60% compared to traditional methods.",
    bullets: [
      "Designed an optimized, segmented FDM hull mold strategy.",
      "Manufactured a modular aluminum crossbeam platform for sensitive IMU, electronics, and propulsion hardware.",
      "Coordinated a multi-disciplinary team to integrate electrical interfaces securely."
    ],
    color: "from-blue-900 to-indigo-900",
    image: "/images/aquatonomous-hero.jpg",
    gallery: [
      { src: "/images/hero-3.jpg", caption: "Build" },
      { src: "/images/hero-4.jpg", caption: "Testing" }
    ],
    pills: ["SolidWorks", "FDM", "Fiberglass"]
  },
  {
    id: "csa-arm",
    title: "CSA Robotic Arm",
    subtitle: "End-Effector",
    tag: "Space · Robotics",
    year: "Winter 2025",
    role: "Designer",
    tools: "SolidWorks · FEA · TPU",
    summary: "Designed a robotic arm end-effector prototype in collaboration with the Canadian Space Agency.",
    description: "Partnering directly with the Canadian Space Agency, I helped design a robotic arm end-effector prototype capable of handling irregular payloads. The CSA provided strict constraints regarding grip force, mass budget, and 3D printability.\n\nWe translated mission objectives into parametric models utilizing SolidWorks, combining rigid PLA+ structural components with flexible TPU grip pads.",
    bullets: [
      "Conducted extensive FEA simulation to optimize topology, reducing the jaw assembly mass by 23% while yielding a 3.0 safety factor.",
      "Tuned print layout for precise slip-fit joints, requiring zero post-processing.",
      "Tested and successfully validated payload retention and grip force against CSA client acceptance criteria."
    ],
    color: "from-zinc-800 to-zinc-950",
    image: "/images/csa-arm-hero.jpg",
    gallery: [],
    pills: ["SolidWorks", "FEA", "TPU"]
  },
  {
    id: "foil-gauge",
    title: "Windsurf Foil Gauge",
    subtitle: "Precision Tool",
    tag: "Product Design · Business",
    year: "2023",
    role: "Creator",
    tools: "3D Scanning · CAD · FDM",
    summary: "Designed, prototyped, and sold an FDM-printed gauge to measure wing angle of attack for Olympic windsurfing.",
    description: "In Olympic iQFOiL windsurfing, wing angle of attack is critical for tuning hydrofoil lift. Having competed internationally, I realized athletes lacked a reliable tool for this, so I designed a purpose-built precision gauge.\n\nI captured the exact mast base geometry using 3D scanning, designing a bespoke PETG two-part gauge via Fusion 360 that mounts automatically without user calibration.",
    bullets: [
      "Integrated an embedded bubble level and laser-engraved angular scale, reducing setup time to under 30 seconds.",
      "Iterated prototype geometries using athlete feedback to ensure weather resistance, tight slip-fit joint tolerances.",
      "Manufactured and sold commercial units to international fleets on the World Championship circuit."
    ],
    color: "from-purple-900/40 to-black",
    image: null,
    gallery: [],
    pills: ["3D Scanning", "CAD", "FDM"]
  }
];

export default function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedProject = projectsData.find((p) => p.id === selectedId);

  const closeModal = () => {
    document.body.style.overflow = "auto";
    setSelectedId(null);
  };

  return (
    <section id="projects" className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="text-sm uppercase tracking-widest text-primary mb-2 font-mono">Selected Work</div>
          <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
            Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Projects</span>
          </h2>
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsData.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              onClick={() => {
                document.body.style.overflow = "hidden";
                setSelectedId(project.id);
              }}
              className="group cursor-pointer bg-surface border border-white/10 rounded-3xl overflow-hidden hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 shadow-lg relative flex flex-col"
            >
              {/* Subtle hover glow layer */}
              <div className="absolute -inset-0.5 bg-primary/20 blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none z-0" />

              <div className={`w-full h-64 relative bg-gradient-to-br ${project.color} flex items-center justify-center overflow-hidden z-10`}>
                {project.image ? (
                  <Image src={project.image} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                ) : (
                  <span className="font-mono text-primary font-bold tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md">
                    {project.title}
                  </span>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-8 flex flex-col flex-grow relative z-10 bg-surface">
                <div className="text-xs font-mono text-primary mb-3">
                  {project.tag}
                </div>
                <h3 className="text-2xl font-bold font-sans tracking-tight mb-3">
                  {project.title}
                </h3>
                <p className="text-muted font-light mb-6 flex-grow">
                  {project.summary}
                </p>
                <div className="flex flex-col gap-4 mt-auto">
                  <div className="flex flex-wrap gap-2">
                    {project.pills.map(pill => (
                      <span key={pill} className="text-xs px-3 py-1 bg-white/5 border border-white/10 rounded-full text-muted">
                        {pill}
                      </span>
                    ))}
                  </div>
                  
                  {/* Card Links */}
                  <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                    <button onClick={(e) => e.stopPropagation()} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-primary">
                      <span className="sr-only">GitHub</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                    </button>
                    <button onClick={(e) => e.stopPropagation()} className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-muted hover:text-primary">
                      <span className="sr-only">Live Site</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portal out the Lightbox to document.body so z-index / overflow isn't clipped by layout.tsx */}
      {mounted && createPortal(
        <AnimatePresence>
          {selectedId && selectedProject && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 pointer-events-none">
              
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={closeModal}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm pointer-events-auto"
              />
              
              {/* Modal Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="relative bg-surface border border-white/10 w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] custom-scrollbar pointer-events-auto"
              >
                <div className="relative">
                  <div className={`w-full h-64 md:h-96 relative bg-gradient-to-br ${selectedProject.color} flex items-center justify-center`}>
                    {selectedProject.image ? (
                      <Image src={selectedProject.image} alt={selectedProject.title} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="font-mono text-primary font-bold tracking-widest text-2xl uppercase shadow-sm">
                        {selectedProject.title}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-90" />
                  </div>
                  
                  <button
                    onClick={closeModal}
                    className="fixed top-6 right-6 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors border border-white/10 z-[110]"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 md:p-12 relative">
                  <div className="flex flex-col md:flex-row gap-12">
                    {/* Main Content */}
                    <div className="flex-2 md:w-2/3">
                      <h3 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-2">
                        {selectedProject.title}
                      </h3>
                      <div className="text-xl text-primary font-light mb-8 italic">
                        {selectedProject.subtitle}
                      </div>

                      <div className="prose prose-invert prose-p:text-muted prose-p:font-light prose-p:leading-relaxed max-w-none">
                        {selectedProject.description.split('\n').map((paragraph, idx) => (
                          <p key={idx} className="mb-4">{paragraph}</p>
                        ))}
                      </div>

                      <h4 className="text-xl font-bold mt-10 mb-4 border-b border-white/10 pb-2">Key Engineering Scope</h4>
                      <ul className="space-y-3 mb-8 text-muted font-light">
                        {selectedProject.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex gap-3">
                            <span className="text-primary mt-1">▹</span>
                            {bullet}
                          </li>
                        ))}
                      </ul>
                      
                      {selectedProject.gallery.length > 0 && (
                        <>
                          <h4 className="text-xl font-bold mt-10 mb-6 border-b border-white/10 pb-2">Gallery</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {selectedProject.gallery.map((img, idx) => (
                              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden bg-background/50 border border-white/5">
                                <Image src={img.src} alt={img.caption} fill className="object-cover hover:scale-105 transition-transform" unoptimized />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-center text-white font-mono">
                                  {img.caption}
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sidebar Specs */}
                    <div className="flex-1 md:w-1/3">
                      <div className="bg-background rounded-2xl p-6 border border-white/5 sticky top-6">
                        <h4 className="text-lg font-bold mb-6 font-sans">Project Specs</h4>
                        
                        <div className="space-y-4 font-mono text-sm">
                          <div>
                            <div className="text-muted/60 mb-1">Role</div>
                            <div className="text-foreground">{selectedProject.role}</div>
                          </div>
                          <div>
                            <div className="text-muted/60 mb-1">Timeline</div>
                            <div className="text-foreground">{selectedProject.year}</div>
                          </div>
                          <div>
                            <div className="text-muted/60 mb-1">Tools</div>
                            <div className="text-primary">{selectedProject.tools}</div>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5">
                          <h4 className="text-lg font-bold mb-4 font-sans">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.pills.map(pill => (
                              <span key={pill} className="text-xs px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary font-medium">
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
        document.body
      )}
    </section>
  );
}
