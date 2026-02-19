"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { KineticText } from "./KineticText";
import { trackCTAClick } from "@/lib/analytics";

const PROGRAM_KEYS = ["youngLearners", "teens", "ielts", "workEnglish"] as const;
const PROGRAM_IDS = ["01", "02", "03", "04"] as const;
const OUTCOMES_COUNT = 4;

export function VanguardLexicon() {
  const t = useTranslations("programs");
  const reduceMotion = useReducedMotion();

  const programs = PROGRAM_KEYS.map((key, i) => ({
    id: PROGRAM_IDS[i],
    key,
    title: t(`${key}.title`),
    subtitle: t(`${key}.subtitle`),
    tagline: t(`${key}.tagline`),
    format: t(`${key}.format`),
    price: t(`${key}.price`),
    schedule: t(`${key}.schedule`),
    outcomes: Array.from({ length: OUTCOMES_COUNT }, (_, j) =>
      t(`${key}.outcomes_${j}` as Parameters<typeof t>[0])
    ),
  }));

  return (
    <section className="bg-background text-foreground border-t border-foreground/5 relative overflow-hidden">

      {/* PRICING BANNER — inverted, impossible to miss */}
      <div className="bg-foreground text-background px-6 md:px-12 lg:px-24 py-12 md:py-16 lg:py-20">
        <div className="max-w-[1920px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-20">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-40 mb-5 block">
                {t("sectionLabel")}
              </span>
              <div
                className="font-display font-bold leading-[0.85] tracking-tight"
                style={{ fontSize: "clamp(2.4rem,5.5vw,4.8rem)" }}
              >
                {t("pricingNote")}
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 font-mono text-sm opacity-60">
                <span className="w-5 h-[1px] bg-background/50 shrink-0" aria-hidden="true" />
                <span>{t("scheduleNote")}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-sm opacity-60">
                <span className="w-5 h-[1px] bg-background/50 shrink-0" aria-hidden="true" />
                <span>{t("formatNote")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-12 lg:px-24 py-[clamp(3.5rem,7vw,6rem)]">
        <div className="max-w-[1920px] mx-auto">

          {/* Section Header */}
          <div className="grid grid-cols-12 gap-8 mb-14 lg:mb-20">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-[1px] bg-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/60">
                  {t("sectionLabel")}
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] tracking-tight mb-8">
                <KineticText text={t("heading")} />{" "}
                <span className="italic">
                  <KineticText text={t("headingItalic")} delay={0.2} className="italic" />
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right border-t border-foreground/10 lg:border-t-0 pt-10 lg:pt-0">
              <p className="font-display text-xl italic mb-3 text-foreground/80">
                {t("subtitle")}
              </p>
              <p className="font-mono text-sm text-foreground/55 max-w-xs leading-relaxed">
                {t("subtitleDesc")}
              </p>
            </div>
          </div>

          {/* Program Grid — 2 columns on desktop */}
          {/* gap-px + bg-foreground/10 renders hairline grid lines between cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10">
            {programs.map((program, index) => (
              <motion.div
                key={program.id}
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "250px 0px" }}
                transition={{
                  duration: 0.65,
                  delay: 0.06 * index,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col bg-background p-8 lg:p-12 min-h-[420px]"
              >
                {/* Ghost ID — top-right watermark */}
                <div
                  className="font-display font-bold leading-none select-none text-foreground/[0.05] group-hover:text-foreground/[0.09] transition-colors duration-700 absolute top-4 right-6 pointer-events-none"
                  style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}
                  aria-hidden="true"
                >
                  {program.id}
                </div>

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Program identity */}
                  <div className="mb-6">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40 mb-2">
                      {program.subtitle}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2 group-hover:italic transition-all duration-500">
                      {program.title}
                    </h3>
                    <p className="font-mono text-xs text-foreground/50 italic leading-relaxed">
                      {program.tagline}
                    </p>
                  </div>

                  {/* Price block — prominent, outlined */}
                  <div className="border border-foreground/15 px-5 py-4 mb-6">
                    <div
                      className="font-display font-bold leading-none tracking-tight text-foreground mb-3"
                      style={{ fontSize: "clamp(1.5rem,2.8vw,2rem)" }}
                    >
                      {program.price}
                    </div>
                    <div className="flex flex-col gap-1.5 pt-3 border-t border-foreground/10">
                      <p className="font-mono text-[10px] text-foreground/50 leading-snug">
                        {program.schedule}
                      </p>
                      <p className="font-mono text-[10px] text-foreground/50 leading-snug">
                        {program.format}
                      </p>
                    </div>
                  </div>

                  {/* Outcomes */}
                  <ul className="flex flex-col divide-y divide-foreground/[0.06] mb-8 flex-1">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-baseline gap-3 py-2.5">
                        <span
                          className="font-mono text-foreground/25 text-[10px] shrink-0 group-hover:text-foreground/55 transition-colors duration-500"
                          aria-hidden="true"
                        >
                          →
                        </span>
                        <span className="font-mono text-[11px] text-foreground/65 leading-snug">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA link */}
                  <a
                    href="#contact"
                    onClick={() => trackCTAClick("lexicon", `program_${program.id}`)}
                    className="inline-flex items-center gap-2 mt-auto font-mono text-[10px] uppercase tracking-widest text-foreground/40 underline underline-offset-4 hover:text-foreground transition-colors duration-300 self-start"
                  >
                    {t("requestDetails")}
                    <ArrowUpRight size={10} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 pt-10 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-xl">
              <h4 className="font-display text-[clamp(1.6rem,3.5vw,2.8rem)] italic mb-3 leading-tight">
                {t("readyTitle")}
              </h4>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                {t("readyDesc")}
              </p>
            </div>
            <a href="#contact" className="group shrink-0">
              <div
                className="relative px-10 py-5 border border-foreground/20 overflow-hidden hover:border-foreground transition-colors duration-300"
                onClick={() => trackCTAClick("lexicon", "apply_admission")}
              >
                <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.2em]">
                  {t("requestCta")}
                </span>
                <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-[0.04]" />
              </div>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
