"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-primary/5 border border-primary/20 rounded-3xl p-10 md:p-16 backdrop-blur-md relative overflow-hidden group shadow-2xl"
        >
          {/* Animated glow background */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          
          <h2 className="text-4xl md:text-5xl font-bold font-sans tracking-tight mb-6 relative">
            Get In <span className="text-primary italic">Touch</span>
          </h2>
          
          <p className="text-xl text-muted font-light mb-10 max-w-2xl mx-auto leading-relaxed relative">
            I'm actively looking for internship opportunities starting in Summer 2027. 
            If you're working on applied physics, mechanical design, or aerospace — I'd love to hear from you.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative">
            <Link
              href="mailto:23rfs3@queensu.ca"
              className="group/btn flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-full hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_20px_rgba(86,130,177,0.2)] hover:shadow-[0_0_30px_rgba(115,158,201,0.4)] font-medium text-lg"
            >
              <Mail className="w-5 h-5" />
              Send an Email
              <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-12 flex justify-center gap-8 relative pb-4">
            <a
              href="https://github.com/tojo-hung"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary hover:-translate-y-1 transition-transform"
            >
              <span className="sr-only">GitHub</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/thomas-hung-8a3082299"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary hover:-translate-y-1 transition-transform"
            >
              <span className="sr-only">LinkedIn</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
