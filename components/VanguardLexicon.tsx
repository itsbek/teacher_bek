"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { KineticText } from "./KineticText";

export function VanguardLexicon() {
    const t = useTranslations("courses");

    const programs = [
        {
            id: "01",
            title: "Elite Mentorship",
            description: "Personalized academic guidance focusing on narrative precision and cognitive agility for global trajectory.",
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop",
            caption: "Strategy — 1:1"
        },
        {
            id: "02",
            title: "Corporate Dialect",
            description: "Strategic communication for high-stakes discourse and international diplomacy.",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
            caption: "Linguistic — Global"
        },
        {
            id: "03",
            title: "Conceptual Literacy",
            description: "Deep-dive workshops on the structure of persuasion and narrative architecture.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
            caption: "Structural — Intel"
        },
        {
            id: "04",
            title: "Critical Synthesis",
            description: "Advanced workshops in academic writing and multidisciplinary intellectual resilience.",
            image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop",
            caption: "Research — Studio"
        }
    ];

    return (
        <section id="lexicon" className="bg-background text-foreground px-6 md:px-12 lg:px-24 border-t border-foreground/5 relative overflow-hidden">
            {/* Disciplined Header: 12-Column Alignment */}
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-12 gap-8 mb-24 lg:mb-32">
                    <div className="col-span-12 lg:col-span-7">
                        <div className="flex items-center gap-6 mb-8 opacity-40">
                            <div className="w-12 h-[1px] bg-foreground" />
                            <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase">COLLECTION A.24 — SYSTEMS</span>
                        </div>
                        <h2 className="text-[var(--text-display-lg)] tracking-tighter font-display leading-[0.8] mb-12">
                            <KineticText text="Program" /> <br /><span className="italic"><KineticText text="Frameworks" delay={0.2} className="italic" /></span>
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right border-t border-foreground/10 lg:border-t-0 pt-12 lg:pt-0">
                        <p className="font-display text-3xl md:text-5xl lg:text-4xl italic mb-6">Disciplined Excellence</p>
                        <p className="text-[var(--text-base)] uppercase tracking-[0.4em] text-foreground/40 leading-relaxed font-bold max-w-sm">
                            Tailored linguistic architecture for individuals who demand precision in every syllable.
                        </p>
                    </div>
                </div>

                {/* Symmetrical Grid: 1-col (mobile), 2-col (tablet), 3-col (large) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-24 lg:gap-y-32">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="group "
                        >
                            <div className="relative border-t border-foreground opacity-100 mb-8 pt-8 flex justify-between items-center overflow-hidden">
                                <span className="text-[var(--text-xs)] font-mono tracking-tighter text-foreground/40 font-bold">PLATE NO. {program.id} // 04</span>
                                <div className="h-6 w-[1px] bg-foreground/10" />
                                <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase text-foreground/40 font-bold">{program.caption}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-5 lg:col-span-4">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 cursor-none">
                                        <motion.img
                                            whileHover={{ scale: 1.05 }}
                                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                            src={program.image}
                                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                            alt={program.title}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center text-white">
                                            <span className="text-[9px] font-mono tracking-widest uppercase">Verified Access</span>
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full pt-4 lg:pt-0">
                                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-display leading-[0.9] tracking-tightest mb-6 group-hover:italic transition-all duration-500">
                                        {program.title}
                                    </h3>
                                    <p className="text-foreground/60 text-lg font-light leading-relaxed max-w-md">
                                        {program.description}
                                    </p>
                                    <div className="mt-8 flex gap-8">
                                        <div className="w-12 h-[1px] bg-foreground/20 mt-3" />
                                        <span className="text-[var(--text-xs)] uppercase tracking-widest font-bold text-foreground/30 group-hover:text-foreground transition-colors">Selection Matrix Available</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Symmetrical High-Energy Closer */}
                <div className="mt-40 pt-16 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
                    <div className="max-w-xl">
                        <h4 className="font-display text-4xl mb-4 italic">The Threshold of Mastery</h4>
                        <p className="text-[var(--text-base)] uppercase tracking-widest text-foreground/30 font-bold leading-relaxed">
                            Admission to the prestige circle is by application only. We prioritize intellectual resilience and the capacity for narrative transformation.
                        </p>
                    </div>
                    <a href="#contact" className="group">
                        <div className="relative px-12 py-6 border border-foreground/10 overflow-hidden hover:border-foreground transition-colors">
                            <span className="relative z-10 text-[var(--text-xs)] uppercase tracking-[0.4em] font-bold">Apply for Admission</span>
                            <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-[0.03]" />
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
