"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Briefcase } from "lucide-react";

const experienceData = [
  {
    company: "Queen's aQuatonomous Design Team",
    role: "Mechanical Team Lead",
    dateRange: "2024 — PRESENT",
    description: "Leading hull design, fabrication, and project coordination for an autonomous surface vehicle competing at RoboBoat 2026. Managing full lifecycle hardware deployment under strict timeline pressures.",
    image: null,
  },
  {
    company: "Canadian Space Agency Partnership",
    role: "Design Engineer",
    dateRange: "WINTER 2025",
    description: "Collaborated with the CSA to design a robotic arm end-effector, applying FEA-driven optimization for additive manufacturing resulting in a highly robust TPU/PLA hybrid jaw.",
    image: null,
  },
  {
    company: "Queen's Engineering Society",
    role: "Orientation Leader",
    dateRange: "FALL 2025",
    description: "Mentored a cohort of 25 incoming students, facilitating their transition into the Engineering program and building critical path interpersonal communication skills.",
    image: null,
  },
  {
    company: "Sail Canada",
    role: "ISAF Youth Sailing Worlds",
    dateRange: "2023 — 2024",
    description: "Represented Canada in iQFOiL windsurfing at the international level, requiring extreme dedication, continuous optimization of hydrofoil hardware, and rigorous travel logistics.",
    image: null,
  }
];

export default function Experience() {
  const ref = useRef(null);
  // Re-triggering or 'once: true' can be configured here.
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <div className="text-sm uppercase tracking-widest text-primary mb-2 font-mono">Timeline</div>
          <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Experience</span>
          </h2>
        </motion.div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Vertical purple line down the middle (hidden on mobile, centered on desktop) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/30 md:-translate-x-1/2" />

          {/* Experience Items */}
          <div className="space-y-12">
            {experienceData.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div key={index} className="relative flex flex-col md:flex-row items-center justify-between w-full">
                  
                  {/* Center Dot */}
                  <div className="absolute left-8 md:left-1/2 w-5 h-5 bg-[#111] border-2 border-primary rounded-full md:-translate-x-1/2 shadow-[0_0_10px_rgba(139,92,246,0.8)] z-10 mt-1 md:mt-0" />

                  {/* Left Side Content (Empty if odd) */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 ${isEven ? "md:pr-16 md:text-right" : "md:order-2"}`}>
                    {isEven && (
                      <ExperienceCard item={item} index={index} isInView={isInView} direction="left" />
                    )}
                  </div>

                  {/* Right Side Content (Empty if even) */}
                  <div className={`w-full md:w-5/12 pl-20 md:pl-0 pt-0 ${!isEven ? "md:pl-16 md:text-left" : "md:order-1 hidden md:block"}`}>
                    {!isEven && (
                      <ExperienceCard item={item} index={index} isInView={isInView} direction="right" />
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}

function ExperienceCard({ item, index, isInView, direction }: { item: any, index: number, isInView: boolean, direction: "left" | "right" }) {
  const slideDistance = 50;
  const initialX = direction === "left" ? -slideDistance : slideDistance;

  return (
    <motion.div
      initial={{ opacity: 0, x: initialX }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: initialX }}
      transition={{ duration: 0.6, delay: 0.2 + (index * 0.15), ease: "easeOut" }}
      className="bg-[#111111] border border-white/10 p-6 rounded-2xl hover:border-primary/40 transition-colors shadow-xl group relative overflow-hidden text-left"
    >
      {/* Optional: subtle background glow on hover */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 rounded-xl bg-background border border-white/5 flex items-center justify-center shrink-0 overflow-hidden relative">
          {item.image ? (
            <Image src={item.image} alt={item.company} fill className="object-cover" />
          ) : (
            <Briefcase className="w-5 h-5 text-primary" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold font-sans tracking-tight text-foreground">{item.role}</h3>
          <h4 className="text-primary font-medium text-sm">{item.company}</h4>
        </div>
      </div>
      
      <div className="text-xs font-mono text-muted/60 mb-4 tracking-widest relative z-10">
        {item.dateRange}
      </div>
      
      <p className="text-muted font-light leading-relaxed relative z-10">
        {item.description}
      </p>
    </motion.div>
  );
}
