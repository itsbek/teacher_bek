"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { KineticText } from "./KineticText";
import { useAudio } from "./audio-provider";
import { trackCTAClick } from "@/lib/analytics";

const stats = [
  { value: "2,000+", labelKey: "statsStudents" as const },
  { value: "3", labelKey: "statsYears" as const },
  { value: "4.9★", labelKey: "statsRating" as const },
];

export function VanguardHero() {
    const t = useTranslations("hero");
    const { playSound } = useAudio();
    const reduceMotion = useReducedMotion();

    return (
        <header className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-40 overflow-hidden bg-background">
            <div className="max-w-[1920px] mx-auto w-full relative z-10 flex flex-col">
                {/* HERO HEADLINE */}
                <div className="flex flex-col mb-16 lg:mb-24">
                    <h1 className="font-display text-[8vw] md:text-[7.5vw] lg:text-[7vw] leading-[0.88] tracking-tighter text-foreground">
                        <span className="block">
                            <KineticText text="LEARN ENGLISH." />
                        </span>
                        <motion.span
                            initial={false}
                            animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="block italic"
                        >
                            <KineticText text="ACTUALLY SPEAK IT." delay={0.3} className="italic" />
                        </motion.span>
                    </h1>

                    <motion.div
                        initial={false}
                        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        className="max-w-xl mt-10"
                    >
                        <p className="text-[var(--text-lg)] font-light leading-relaxed text-foreground/60">
                            {t("subtitle")}
                        </p>

                        {/* min-h prevents layout shift when badge text length varies by locale */}
                        <div className="flex flex-wrap gap-2 mt-8 min-h-[2.5rem]">
                            {[
                                t("badgeTesol"),
                                t("badgePgce"),
                                t("badgeLocation"),
                                t("badgeFormat"),
                            ].map((item) => (
                                <span
                                    key={item}
                                    className="px-3 py-1.5 border border-foreground/10 text-xs tracking-[0.12em] uppercase font-mono text-foreground/60 whitespace-nowrap"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-8 mt-10 pt-10 border-t border-foreground/10 min-h-[5rem]">
                            {stats.map(({ value, labelKey }) => (
                                <div key={labelKey} className="flex flex-col gap-1 min-w-[4rem]">
                                    <span className="font-display text-2xl md:text-3xl font-bold text-foreground leading-none" style={{ fontVariantNumeric: "tabular-nums" }}>
                                        {value}
                                    </span>
                                    <span className="text-xs uppercase tracking-[0.12em] font-mono text-foreground/45">
                                        {t(labelKey)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={false}
                    animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap items-center gap-4 pt-10 border-t border-foreground/10"
                >
                    <Link
                        href="#contact"
                        onClick={() => {
                            playSound('click');
                            trackCTAClick('hero', 'primary_inquiry');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                        {t("cta")}
                        <ArrowUpRight size={15} aria-hidden="true" />
                    </Link>
                    <Link
                        href="#lexicon"
                        onClick={() => {
                            playSound('click');
                            trackCTAClick('hero', 'curriculum');
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 border border-foreground/25 text-sm font-semibold tracking-wide text-foreground/80 hover:border-foreground hover:text-foreground transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                    >
                        {t("secondary")}
                    </Link>
                </motion.div>
            </div>

            {/* STATUS & SCROLL INDICATOR */}
            <div className="absolute bottom-12 inset-x-6 md:inset-x-12 lg:inset-x-24 flex justify-between items-end">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                    <span className="text-xs font-mono tracking-widest uppercase text-foreground/60">{t("statusOpen")}</span>
                </div>
                <div className="hidden lg:flex flex-col items-center gap-4" aria-hidden="true">
                    <span className="text-xs font-mono tracking-widest uppercase text-foreground/40" style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}>Scroll</span>
                    <div className="w-[1px] h-12 bg-foreground/30" />
                </div>
            </div>

            {/* TEACHER PORTRAIT — real photo, primary trust signal */}
            <motion.div
                initial={false}
                animate={reduceMotion ? undefined : { opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[32vw] h-[45vw] z-[-1] hidden lg:block"
            >
                <div className="relative w-full h-full overflow-hidden editorial-panel">
                    <Image
                        src="/images/teacher-profile.webp"
                        alt="Teacher Bek — English teacher in Ho Chi Minh City"
                        fill
                        sizes="(min-width: 1024px) 32vw, 0vw"
                        priority
                        quality={90}
                        className="w-full h-full object-cover object-top transition-transform duration-[3000ms] ease-[var(--ease-editorial)] hover:scale-105"
                    />
                    <div className="absolute inset-0 border border-foreground/10" aria-hidden="true" />
                    <div className="absolute bottom-6 left-6">
                        <span className="text-xs font-mono text-white/70 uppercase tracking-widest bg-black/50 backdrop-blur-sm px-3 py-1">
                            {t("photoCaption")}
                        </span>
                    </div>
                </div>
            </motion.div>
        </header>
    );
}
