"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          
          {/* Profile Image - Left */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 md:order-1"
          >
            <div className="relative w-full max-w-sm mx-auto md:mr-auto md:ml-0 aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.2)]">
              {/* Fallback mock image since we don't have sanity connected yet */}
              <div className="absolute inset-0 bg-zinc-900 border-2 border-primary/50 group">
                <Image 
                  src="/images/Profile_Photo.jpg" 
                  alt="Thomas Hung" 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                {/* Purple Overlay Glow */}
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
              </div>
            </div>
            
            {/* Decoration */}
            <div className="absolute -z-10 -bottom-6 -left-6 w-full h-full border-2 border-primary/30 rounded-3xl hidden md:block" />
          </motion.div>

          {/* Text Content - Right */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="order-1 md:order-2"
          >
            <div className="text-sm uppercase tracking-widest text-primary mb-2 font-mono">Biography</div>
            <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-8">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-hover">Me</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted font-light leading-relaxed">
              <p>
                I am an Engineering Physics student with a deep curiosity for mechanical design, prototyping, and material science. I thrive in environments where complex physical systems meet tangible engineering challenges.
              </p>
              <p>
                From designing automation end-effectors with the Canadian Space Agency to manufacturing bio-composite foiling vessels, my work is driven by one core philosophy: <strong className="text-foreground font-medium">Curiosity everyday.</strong>
              </p>
              <p>
                I'm actively working to build a future where rigorous physics and beautiful design principles create scalable, high-performance systems.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
