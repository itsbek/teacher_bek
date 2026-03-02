"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const stats = [
  { value: "2,000+", label: "Students taught" },
  { value: "7", label: "Languages spoken" },
  { value: "15+", label: "Schools in HCMC" },
  { value: "Max 10", label: "Per group" },
];

const credentials = [
  { code: "TESOL", full: "Teaching English to Speakers of Other Languages" },
  { code: "PGCE", full: "Postgraduate Certificate in Education" },
  { code: "MBA", full: "Currently pursuing MBA" },
];

const howItWorks = [
  { step: "Assessment", detail: "Current level, goals, speaking gaps" },
  { step: "Training", detail: "Speaking-first lessons and drills" },
  { step: "Feedback", detail: "Corrections, homework, and milestones" },
  { step: "Outcome", detail: "Confident communication in real life" },
];

export function VanguardSignature() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative bg-background border-t border-foreground/10 overflow-hidden py-[clamp(3.5rem,7vw,6rem)] px-6 md:px-10 lg:px-16">
      {/* Dot grid background */}
      <div className="dot-grid opacity-50" />

      <div className="max-w-[1920px] mx-auto relative z-10">

        {/* Section label — bracket notation */}
        <div className="flex items-center gap-4 mb-12">
          <span className="w-8 h-[1px] bg-foreground/30 shrink-0" />
          <span className="bracket-label">01 &mdash; About the Teacher</span>
        </div>

        {/* Top row: headline + intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 mb-14 lg:mb-20">
          <motion.div
            className="lg:col-span-7"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2
              className="font-display tracking-tight leading-[1.05] text-foreground"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
            >
              Clear sessions. Honest feedback.{" "}
              <span className="italic text-foreground/60">Consistent progress.</span>
            </h2>
          </motion.div>

          <motion.div
            className="lg:col-span-5 flex flex-col justify-end"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm text-foreground/55 leading-relaxed">
              Each week covers speaking practice, error correction, and something
              concrete to take away. No filler — just structured, focused work
              that compounds over time.
            </p>
          </motion.div>
        </div>

        {/* Stats strip — technical grid style */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-foreground/10 mb-14"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`group p-6 md:p-8 flex flex-col gap-1 hover:bg-foreground/[0.03] transition-colors duration-500 ${
                i < stats.length - 1 ? "border-r border-foreground/10" : ""
              }`}
            >
              <span
                className="font-display font-bold leading-none text-foreground group-hover:tracking-wide transition-all duration-500"
                style={{
                  fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stat.value}
              </span>
              <span className="text-[13px] uppercase tracking-[0.15em] text-foreground/35 group-hover:text-foreground/55 transition-colors duration-300">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bottom: credentials + how it works */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">

          {/* Credentials */}
          <motion.div
            className="lg:col-span-5"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="bracket-label mb-6">Qualifications</p>
            <div className="flex flex-col divide-y divide-foreground/[0.07]">
              {credentials.map((cred) => (
                <div
                  key={cred.code}
                  className="py-4 flex items-start justify-between gap-4 group"
                >
                  <span className="font-display text-xl font-bold text-foreground leading-none shrink-0 group-hover:italic transition-all duration-300">
                    {cred.code}
                  </span>
                  <span className="text-xs text-foreground/45 text-right leading-snug">
                    {cred.full}
                  </span>
                </div>
              ))}
            </div>

            <a
              href="#contact"
              onClick={() => trackCTAClick("signature", "book_assessment")}
              className="accent-underline inline-flex items-center gap-2 mt-8 self-start text-[13px] uppercase tracking-[0.2em] text-foreground border-b border-foreground/20 pb-1 hover:border-foreground transition-colors duration-300"
            >
              Book a Free Assessment
              <ArrowUpRight size={13} />
            </a>
          </motion.div>

          {/* How It Works — numbered steps */}
          <motion.div
            className="lg:col-span-7 editorial-panel p-6 md:p-8 bg-foreground/[0.02]"
            initial={reduceMotion ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="bracket-label mb-5">How It Works</p>
            <div className="flex flex-col">
              {howItWorks.map((row, i) => (
                <div
                  key={row.step}
                  className={`group flex justify-between items-baseline gap-4 py-4 hover:pl-2 transition-all duration-300 ${
                    i < howItWorks.length - 1
                      ? "border-b border-foreground/[0.08]"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-[12px] text-foreground/20 tabular-nums group-hover:text-foreground/40 transition-colors duration-300">
                      0{i + 1}
                    </span>
                    <span className="text-sm text-foreground/60 uppercase tracking-wide group-hover:text-foreground transition-colors duration-300">
                      {row.step}
                    </span>
                  </div>
                  <span className="text-sm text-foreground font-medium text-right">
                    {row.detail}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
