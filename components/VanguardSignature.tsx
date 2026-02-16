"use client";

import React from "react";
import { motion } from "framer-motion";

export function VanguardSignature() {
  return (
    <section className="relative bg-background border-t border-foreground/10 overflow-hidden">
      <div className="atmosphere-grid opacity-60" />
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-[1px] bg-foreground" />
              <span className="text-[10px] uppercase tracking-[0.22em] font-mono text-foreground/80">Teaching Approach</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,6vw,4.5rem)] leading-[0.95] tracking-tight mb-6 headline-balance">
              Structured lessons. Real speaking. Measurable results.
            </h2>
            <p className="text-foreground/85 text-lg md:text-xl leading-relaxed rhythm-copy">
              Students improve faster when classes are clear, interactive, and consistent. Every week includes speaking practice, focused correction, and concrete targets you can track.
            </p>
          </motion.div>

          <motion.div
            initial={false}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 editorial-panel p-6 md:p-8"
          >
            <h3 className="text-[11px] uppercase tracking-[0.2em] font-mono text-foreground/75 mb-5">How It Works</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4 border-b border-foreground/10 pb-3">
                <span className="text-foreground/80 text-sm uppercase tracking-wide">Assessment</span>
                <span className="text-foreground font-medium text-right">Current level, goals, speaking gaps</span>
              </div>
              <div className="flex justify-between items-start gap-4 border-b border-foreground/10 pb-3">
                <span className="text-foreground/80 text-sm uppercase tracking-wide">Training</span>
                <span className="text-foreground font-medium text-right">Speaking-first lessons and drills</span>
              </div>
              <div className="flex justify-between items-start gap-4 border-b border-foreground/10 pb-3">
                <span className="text-foreground/80 text-sm uppercase tracking-wide">Feedback</span>
                <span className="text-foreground font-medium text-right">Corrections, homework, and milestones</span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-foreground/80 text-sm uppercase tracking-wide">Outcome</span>
                <span className="text-foreground font-medium text-right">Confident communication in real life</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
