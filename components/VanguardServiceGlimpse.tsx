"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function VanguardServiceGlimpse() {
    const t = useTranslations("services");

    const categories = [
        { title: "Elite Mentorship", type: "1:1 Strategy", label: "01" },
        { title: "Corporate Dialect", type: "Professional Diplomacy", label: "02" },
        { title: "Conceptual Literacy", type: "Narrative Mastery", label: "03" },
        { title: "Critical Synthesis", type: "Academic Rigor", label: "04" },
    ];

    return (
        <section className="px-6 md:px-12 lg:px-24 bg-background border-y border-foreground/5 overflow-hidden">
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 mb-6 block">Direct Offering // At a Glimpse</span>
                        <h2 className="text-4xl md:text-5xl font-display leading-tight tracking-tightest">
                            Frameworks tailored for <br />the <span className="italic">prestigious intellectual.</span>
                        </h2>
                    </div>
                    <div className="md:pb-1 text-right">
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-40">System Release — 24.2</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-background group p-10 lg:p-12 hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
                        >
                            <span className="text-[10px] font-mono opacity-30 mb-8 block group-hover:text-white/50 group-hover:translate-x-1 transition-all">SEC — {cat.label}</span>
                            <h3 className="text-2xl font-display mb-4 group-hover:italic transition-all">{cat.title}</h3>
                            <p className="text-[11px] uppercase tracking-widest font-bold opacity-40 group-hover:text-white/60">{cat.type}</p>

                            <div className="mt-12 w-8 h-[2px] bg-foreground group-hover:bg-white transition-all group-hover:w-16" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
