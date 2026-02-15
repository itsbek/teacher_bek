"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { ArrowUpRight } from "lucide-react";

export default function ServicesPage() {
    const t = useTranslations("services");

    const programs = [
        {
            id: "01",
            title: "Elite Mentorship",
            desc: "Bespoke intellectual scaffolding for high-potential individuals. We focus on cognitive resilience, narrative precision, and the articulation of complex intellectual agency.",
            features: ["Personalized Roadmaps", "Cognitive Assessment", "Narrative Strategy"],
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1200"
        },
        {
            id: "02",
            title: "Corporate Dialect",
            desc: "Strategic linguistic training for the boardroom and beyond. Master the dialect of international diplomacy and high-stakes corporate discourse with surgical precision.",
            features: ["Executive Rhetoric", "Diplomatic Protocol", "Crisis Communication"],
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200"
        },
        {
            id: "03",
            title: "Conceptual Literacy",
            desc: "Advanced workshops in the structure of persuasion. We deconstruct the mechanics of influence and reconstruct them into a formidable linguistic architecture.",
            features: ["Rhetorical Analysis", "Architectural Prose", "Logic & Synthesis"],
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
        }
    ];

    return (
        <>
            <VanguardNavigation />
            <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased">
                {/* Hero: Algebraic Clarity */}
                <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-40">
                    <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-9">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 0.4, x: 0 }}
                                className="text-[10px] font-mono tracking-[0.5em] uppercase mb-12 block"
                            >
                                Inventory — Systems & Dialects
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(3.5rem,12vw,9rem)] font-display leading-[0.85] tracking-tightest mb-12"
                            >
                                Linguistic <br /><span className="italic">Systems</span>
                            </motion.h1>
                        </div>
                        <div className="col-span-12 lg:col-span-3 flex flex-col justify-end lg:pb-12 border-t border-foreground/10 lg:border-t-0 pt-12">
                            <p className="text-xl font-sans font-light leading-relaxed max-w-sm">
                                Elite academic frameworks designed for global narrative mastery and intellectual resilience.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Programs: Kinetic Scaffolding */}
                <section className="pb-40 px-6 md:px-12 lg:px-24">
                    <div className="max-w-[1920px] mx-auto space-y-40 lg:space-y-60">
                        {programs.map((program, idx) => (
                            <motion.div
                                key={program.id}
                                initial={{ opacity: 0, y: 60 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="grid grid-cols-12 gap-8 lg:gap-24"
                            >
                                {/* Media Column (8/12) */}
                                <div className={`col-span-12 lg:col-span-7 ${idx % 2 === 0 ? "order-1" : "lg:order-2"}`}>
                                    <div className="relative aspect-[16/9] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                                        <img src={program.image} className="w-full h-full object-cover scale-105" alt={program.title} />
                                        <div className="absolute top-0 right-0 p-8">
                                            <span className="text-[10px] font-mono text-white/40 rotate-90 inline-block origin-right">PLATE 0{program.id}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Content Column (4/12) */}
                                <div className={`col-span-12 lg:col-span-5 flex flex-col justify-center ${idx % 2 === 0 ? "order-2" : "lg:order-1"}`}>
                                    <span className="text-[10px] font-mono tracking-widest uppercase opacity-30 mb-8">SEC_{program.id} // VERIFIED</span>
                                    <h2 className="text-5xl md:text-7xl font-display tracking-tightest mb-8 leading-none">
                                        {program.title}
                                    </h2>
                                    <p className="text-xl text-foreground/70 font-light leading-relaxed mb-12 max-w-md">
                                        {program.desc}
                                    </p>

                                    <ul className="space-y-4 mb-12">
                                        {program.features.map(f => (
                                            <li key={f} className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] font-bold opacity-40">
                                                <div className="w-6 h-[1px] bg-foreground" />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>

                                    <button className="vanguard-magnetic group w-fit flex items-center gap-6 py-4 px-8 border border-foreground/10 hover:bg-foreground hover:text-background transition-colors duration-500">
                                        <span className="text-[10px] uppercase tracking-widest font-bold">Initiate Protocol</span>
                                        <ArrowUpRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <VanguardFooter />
            </main>

            <style jsx>{`
                .vanguard-magnetic {
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .vanguard-magnetic:hover {
                    transform: translateY(-2px);
                }
            `}</style>
        </>
    );
}
