"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";

export function VanguardServiceGlimpse() {
    const locale = useLocale();

    const categories = [
        { title: "Kids English (6-10)", type: "Confidence + Vocabulary", label: "01" },
        { title: "Teens English (11-17)", type: "School + Speaking Fluency", label: "02" },
        { title: "IELTS Preparation", type: "Band Score Strategy", label: "03" },
        { title: "English for Work", type: "Meetings + Interviews", label: "04" },
    ];

    return (
        <section className="px-6 md:px-12 lg:px-24 bg-background border-y border-foreground/5 overflow-hidden relative">
            <div className="atmosphere-grid opacity-60" />
            <div className="max-w-[1920px] mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 lg:mb-20">
                    <div className="max-w-xl">
                        <span className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-80 mb-6 block">Programs Overview</span>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display leading-[0.92] tracking-tightest headline-balance">
                            Practical English programs built for <span className="italic">real progress.</span>
                        </h2>
                    </div>
                    <div className="md:pb-1 text-right">
                        <span className="text-[10px] font-mono tracking-[0.2em] uppercase opacity-80">Max 10 students per class</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-foreground/10 border border-foreground/10">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={cat.label}
                            initial={false}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="bg-background group p-10 lg:p-12 hover:bg-foreground hover:text-background transition-colors duration-500 cursor-pointer"
                        >
                            <Link href={`/${locale}/services#program-${cat.label}`} className="block">
                                <span className="text-[10px] font-mono opacity-75 mb-8 block group-hover:text-background/75 group-hover:translate-x-1 transition-all">Program {cat.label}</span>
                                <h3 className="text-3xl md:text-4xl font-display mb-4 group-hover:italic transition-all">{cat.title}</h3>
                                <p className="text-[11px] uppercase tracking-widest font-bold opacity-80 group-hover:text-background/90">{cat.type}</p>

                                <div className="mt-12 w-8 h-[2px] bg-foreground group-hover:bg-background transition-all group-hover:w-16" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
