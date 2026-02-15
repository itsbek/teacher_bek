"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { KineticText } from "./KineticText";
import { useAudio } from "./audio-provider";

export function VanguardHero() {
    const t = useTranslations("hero");
    const { playSound } = useAudio();

    return (
        <header className="relative min-h-screen w-full flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-32 pb-40 overflow-hidden bg-background">
            {/* Golden Ratio Split Background (38.2%) */}
            <div className="absolute top-0 right-0 w-[38.2%] h-full bg-[#f4f4f0] dark:bg-vanguard-carbon/20 -z-10 hidden lg:block" />

            {/* Grid Logic: 12 Columns Overlay */}
            <div className="absolute inset-x-6 md:inset-x-12 lg:inset-x-24 top-0 h-full grid grid-cols-12 gap-8 pointer-events-none opacity-[0.03]">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-full border-x border-foreground/5" />
                ))}
            </div>

            <div className="max-w-[1920px] mx-auto w-full relative z-10 flex flex-col">
                {/* 12vw MASTER TYPOGRAPHY LAYER */}
                <div className="flex flex-col mb-20 lg:mb-32">
                    <h1 className="font-display text-[12vw] md:text-[13vw] lg:text-[12vw] leading-[0.8] tracking-tighter text-foreground mix-blend-difference mb-[-0.1em]">
                        <KineticText text="THE ART" />
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex items-center gap-8 md:gap-16 lg:gap-24"
                    >
                        <div className="w-12 md:w-24 lg:w-48 h-[2px] bg-foreground hidden md:block" />
                        <h1 className="font-display text-[12vw] md:text-[13vw] lg:text-[12vw] leading-[0.8] tracking-tighter text-foreground italic">
                            <KineticText text="OF LEARNING" delay={0.3} className="italic font-serif" />
                        </h1>
                    </motion.div>

                    <div className="flex flex-col md:flex-row justify-between items-start lg:items-end mt-12 lg:mt-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="max-w-xl pb-1"
                        >
                            <p className="text-[var(--text-lg)] md:text-[var(--text-xl)] font-light leading-relaxed text-foreground/60">
                                Educational strategy and elite English mentorship for the next generation of thinkers. Bridging the gap between traditional academics and creative linguistic mastery.
                            </p>
                        </motion.div>
                        <h1 className="font-display text-[12vw] md:text-[13vw] lg:text-[12vw] leading-[0.8] tracking-tighter text-foreground text-right ml-auto opacity-10 lg:opacity-100">
                            <KineticText text="REIMAGINED" delay={0.6} />
                        </h1>
                    </div>
                </div>

                {/* CALL TO ACTION PROTOCOL */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-wrap gap-12 lg:gap-20 pt-12 border-t border-foreground/5"
                >
                    <a
                        href="#lexicon"
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => playSound('click')}
                        className="group flex flex-col gap-4"
                    >
                        <span className="text-[var(--text-xs)] uppercase tracking-[0.4em] font-bold text-foreground inline-flex items-center gap-2">
                            Curriculum <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <div className="w-24 h-[1px] bg-foreground/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </div>
                    </a>
                    <a
                        href="#contact"
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => playSound('click')}
                        className="group flex flex-col gap-4"
                    >
                        <span className="text-[var(--text-xs)] uppercase tracking-[0.4em] font-bold text-foreground inline-flex items-center gap-2">
                            Inquiry <ArrowUpRight size={14} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <div className="w-24 h-[1px] bg-foreground/10 relative overflow-hidden">
                            <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
                        </div>
                    </a>
                </motion.div>
            </div>

            {/* STATUS & SCROLL INDICATOR */}
            <div className="absolute bottom-12 inset-x-6 md:inset-x-12 lg:inset-x-24 flex justify-between items-end opacity-40">
                <div className="flex items-center gap-6">
                    <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-mono tracking-widest uppercase">Status: 2024 Cycle Active</span>
                </div>
                <div className="hidden lg:flex flex-col items-center gap-4">
                    <span className="text-[10px] font-mono tracking-widest uppercase vertical-text">Scroll to explore</span>
                    <div className="w-[1px] h-12 bg-foreground/30" />
                </div>
            </div>

            {/* CONCEPTUAL REVEAL IMAGE */}
            <motion.div
                initial={{ opacity: 0, scale: 1.1, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, scale: 1, clipPath: "inset(0 0 0% 0)" }}
                transition={{ duration: 1.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1/2 -translate-y-1/2 right-[5%] w-[32vw] h-[45vw] z-[-1] hidden lg:block"
            >
                <div className="relative w-full h-full grayscale brightness-90 contrast-125 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop"
                        alt="Structural Excellence"
                        className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
                    />
                    <div className="absolute inset-0 border border-foreground/10" />
                    <div className="absolute bottom-6 right-6">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest bg-black/40 backdrop-blur-sm px-3 py-1">Plate 01.A</span>
                    </div>
                </div>
            </motion.div>

            <style jsx>{`
                .vertical-text {
                    writing-mode: vertical-rl;
                    text-orientation: mixed;
                }
            `}</style>
        </header>
    );
}
