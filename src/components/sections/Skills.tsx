"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { PenTool, Code2, Wrench, Languages, Box, Cpu, Database, Droplet } from "lucide-react";

// Mock data acting as if fetched from Sanity
const skillsData = [
  { title: "SolidWorks", icon: <Box className="w-8 h-8" />, imgSrc: "https://icon.horse/icon/solidworks.com", proficiency: 95 },
  { title: "Fusion 360", icon: <PenTool className="w-8 h-8" />, imgSrc: "https://icon.horse/icon/autodesk.com", proficiency: 90 },
  { title: "OpenFOAM CFD", icon: <Droplet className="w-8 h-8" />, imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaK9NB9jD4-F9Rb2cyTRq3Q2QapLJXevleHA&s", proficiency: 85 },
  { title: "Ansys", icon: <Code2 className="w-8 h-8" />, imgSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0WS77jbQmdQGpxTj46JAeRwMnjJG1ufTphg&s", proficiency: 80 },
  { title: "Python", icon: <Database className="w-8 h-8" />, imgSrc: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1280px-Python-logo-notext.svg.png", proficiency: 75 },
  { title: "Arduino", icon: <Cpu className="w-8 h-8" />, imgSrc: "https://icon.horse/icon/arduino.cc", proficiency: 85 },
  { title: "Composites", icon: <Wrench className="w-8 h-8" />, proficiency: 90 },
  { title: "French (Bilingual)", icon: <Languages className="w-8 h-8" />, proficiency: 95 },
];

export default function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10" ref={ref}>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center md:text-left"
        >
          <div className="text-sm uppercase tracking-widest text-primary mb-2 font-mono">Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight">
            Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Skills</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {skillsData.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }} // 100ms stagger
              className="group relative bg-[#111111] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-all cursor-crosshair overflow-hidden"
            >
              {/* Subtle Purple Glow on Hover */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-500 rounded-2xl pointer-events-none" />
              <div className="absolute -inset-0.5 bg-primary/0 group-hover:bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none z-0" />
              
              <div className="relative z-10 text-muted group-hover:text-primary transition-colors duration-300 mb-4 flex items-center justify-center h-10 w-10">
                {skill.imgSrc ? (
                  <Image src={skill.imgSrc} alt={`${skill.title} logo`} width={32} height={32} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-sm" unoptimized />
                ) : (
                  skill.icon
                )}
              </div>
              <h3 className="relative z-10 text-lg font-bold font-sans tracking-tight text-foreground mb-3">
                {skill.title}
              </h3>
              
              {/* Proficiency Bar */}
              <div className="relative z-10 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.proficiency}%` } : { width: 0 }}
                  transition={{ duration: 1, delay: 0.5 + (index * 0.1), ease: "easeOut" }}
                  className="h-full bg-primary"
                />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
