"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Typewriter from "@/components/Typewriter";

export default function Hero() {
  const words = [
    "Engineering Physics Student",
    "Problem Solver & Builder",
    "Passionate About Material Science",
    "Loves the Outdoor",
    "Future Industry Leader"
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto px-6 z-10 flex flex-col items-center justify-center text-center">
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-bold font-sans tracking-tight mb-6"
        >
          Thomas <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Hung</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-2xl md:text-3xl text-foreground font-light mb-12 h-10"
        >
          <Typewriter words={words} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#projects"
            className="px-8 py-4 bg-primary text-white font-medium rounded-full hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="px-8 py-4 bg-transparent border border-white/20 text-white font-medium rounded-full hover:bg-white/5 hover:border-white/40 transition-colors"
          >
            Get In Touch
          </a>
        </motion.div>
        
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted"
      >
        <span className="text-xs uppercase tracking-widest font-mono">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-primary" />
        </motion.div>
      </motion.div>
    </section>
  );
}
