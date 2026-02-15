"use client";

import React from "react";
import { motion } from "framer-motion";
export function VanguardSignature() {

    return (
        <section className="relative bg-background overflow-hidden border-t border-foreground/5">
            {/* Disciplined Grid Overlay (Subtle) */}
            <div className="absolute inset-x-6 md:inset-x-12 lg:inset-x-24 top-0 h-full grid grid-cols-12 gap-8 pointer-events-none opacity-[0.02]">
                {[...Array(12)].map((_, i) => (
                    <div key={i} className="h-full border-x border-foreground" />
                ))}
            </div>

            <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="grid grid-cols-12 gap-8 items-center">
                    {/* Centered Monolith "B" */}
                    <div className="col-span-12 flex justify-center items-center pointer-events-none mb-12 lg:mb-0">
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 0.05, scale: 1 }}
                            transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                            className="font-display text-[50vw] leading-none tracking-tightest text-foreground select-none"
                        >
                            B
                        </motion.h1>
                    </div>

                    {/* Philosophy Overlay: Ratio-Bound (6/12 cols center) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="grid grid-cols-12 gap-8 w-full px-6 md:px-12 lg:px-24">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="col-span-12 md:col-start-3 md:col-span-8 lg:col-start-4 lg:col-span-6 text-center"
                            >
                                <div className="flex flex-col items-center gap-8">
                                    <div className="flex items-center gap-6 opacity-40">
                                        <div className="w-8 h-[1px] bg-foreground" />
                                        <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase font-bold">THE PHILOSOPHY</span>
                                        <div className="w-8 h-[1px] bg-foreground" />
                                    </div>

                                    <p className="font-display text-[clamp(2rem,6vw,4rem)] leading-[1.1] tracking-tight">
                                        "Education is the <span className="italic">manifestation</span> of disciplined agency through linguistic mastery."
                                    </p>

                                    <div className="flex flex-col items-center gap-4 opacity-50">
                                        <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase">Est. 2012 — VERIFIED BLUEPRINT</span>
                                        <div className="w-0.5 h-12 bg-foreground/20" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Technical Footers: Symmetrical */}
                <div className="absolute bottom-12 inset-x-6 md:inset-x-12 lg:inset-x-24 flex justify-between items-end opacity-20">
                    <div className="flex flex-col gap-2">
                        <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40">PLATE NO. 06 / CONCLUSION</span>
                        <div className="w-24 h-[1px] bg-foreground" />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40">BEK VANGUARD® // ELITE SYSTEMS</span>
                        <div className="w-24 h-[1px] bg-foreground" />
                    </div>
                </div>
            </div>
        </section>
    );
}
