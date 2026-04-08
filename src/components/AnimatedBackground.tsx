"use client";

import { motion } from "framer-motion";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none flex justify-center items-center">
      {/* Container for the floating orbs to keep them centered relative to viewport */}
      <div className="relative w-full h-full max-w-7xl mx-auto flex justify-center items-center">
        
        {/* Blue Orb (#5682B1) */}
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute opacity-30 bg-[#5682B1] rounded-full blur-[100px] w-96 h-96 top-1/4 left-1/4"
        />

        {/* Light Blue Orb (#739EC9) */}
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 70, -30, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute opacity-30 bg-[#739EC9] rounded-full blur-[120px] w-[28rem] h-[28rem] bottom-1/4 right-1/4"
        />

        {/* Peach Orb (#FFE8DB) */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, 40, -60, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute opacity-20 bg-[#FFE8DB] rounded-full blur-[110px] w-80 h-80 top-1/3 right-1/3"
        />
        
      </div>
    </div>
  );
}
