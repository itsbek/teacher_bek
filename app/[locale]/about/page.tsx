"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";

export default function AboutPage() {
    const t = useTranslations("about");

    const milestones = [
        { year: "2018 — PRESENT", title: "Independent Educational Strategist", desc: "Developing bespoke academic roadmaps for high-potential students globally, focusing on narrative-driven college applications." },
        { year: "2012 — 2018", title: "Director of Pedagogy, St. Jude's Academy", desc: "Led the redesign of the humanities curriculum, implementing a cross-disciplinary Socratic seminar model across grades 9-12." },
        { year: "2008 — 2012", title: "Doctoral Research, Oxford University", desc: "Ph.D. in Educational Philosophy on Cognitive Resilience and Inquiry-Based Learning." }
    ];

    return (
        <>
            <VanguardNavigation />
            <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased">
                {/* Elite Header: About Monolith */}
                <section className="relative px-6 md:px-12 lg:px-24 py-24 lg:py-40 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[38.2%] h-full bg-[#f0f0eb] dark:bg-vanguard-carbon -z-10 hidden lg:block" />

                    <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-end">
                        <div className="col-span-12 lg:col-span-8">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 mb-8 block"
                            >
                                Profile // Archetype 01
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="text-[clamp(4rem,15vw,10rem)] font-display leading-[0.8] tracking-tightest mb-12"
                            >
                                Architect <br />of <span className="italic">Inquiry</span>
                            </motion.h1>
                        </div>
                        <div className="col-span-12 lg:col-span-4 lg:pb-12 border-l lg:border-l-0 lg:border-r border-foreground/10 pl-8 lg:pl-0 lg:pr-8">
                            <p className="text-xl font-sans font-light leading-relaxed max-w-sm">
                                A narrative of fifteen years dedicated to the intersection of pedagogical rigor and creative intellectual freedom.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Core Philosophy: Staggered Content */}
                <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
                    <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-12 lg:gap-24 items-start">
                        <div className="col-span-12 md:col-span-5">
                            <h2 className="text-[10px] font-mono tracking-widest uppercase opacity-40 mb-12 flex items-center gap-4">
                                <span className="w-8 h-[1px] bg-foreground"></span> The Core Principles
                            </h2>
                            <p className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight mb-12">
                                Education is not the filling of a vessel, but the <span className="italic">kindling of a flame.</span>
                            </p>
                            <div className="space-y-8 text-foreground/70 leading-relaxed text-lg font-light">
                                <p>My approach is rooted in the belief that every student possesses a unique intellectual fingerprint. My role is to provide the framework—the scaffolding—within which that intellect can build something meaningful.</p>
                                <p>I reject the industrial model of education. Instead, I advocate for a personalized, inquiry-based system where curiosity is the primary driver of achievement.</p>
                            </div>
                        </div>

                        <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4 h-full pt-12 lg:pt-0">
                            <motion.div
                                initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                                whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                                transition={{ duration: 1.5 }}
                                className="aspect-[3/4] overflow-hidden grayscale brightness-90"
                            >
                                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
                                whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                                transition={{ duration: 1.5, delay: 0.2 }}
                                className="aspect-[3/4] overflow-hidden grayscale brightness-90 mt-24"
                            >
                                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Milestone Timeline: Disciplined Academic Loop */}
                <section className="py-24 md:py-48 bg-foreground text-background">
                    <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
                        <div className="flex flex-col items-center text-center mb-32">
                            <span className="text-[10px] font-mono tracking-[0.5em] uppercase opacity-40 mb-8">Record of Achievement</span>
                            <h2 className="font-display text-6xl md:text-8xl italic">Milestones</h2>
                        </div>

                        <div className="relative">
                            {/* Vertical Logic Line */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px] bg-background/10 hidden lg:block" />

                            <div className="space-y-32 lg:space-y-60 relative z-10">
                                {milestones.map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 40 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                        className={`grid grid-cols-12 gap-8 items-center ${idx % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
                                    >
                                        <div className={`col-span-12 lg:col-span-5 ${idx % 2 === 0 ? "lg:text-right" : "lg:col-start-8 lg:order-2"}`}>
                                            <span className="font-mono text-[11px] opacity-40 mb-4 block tracking-[0.3em] font-bold">{item.year}</span>
                                            <h3 className="font-display text-4xl md:text-5xl mb-6 italic leading-none">{item.title}</h3>
                                            <p className="text-background/60 text-lg font-light leading-relaxed max-w-sm ml-auto mr-0 lg:ml-auto lg:mr-0 inline-block">
                                                {item.desc}
                                            </p>
                                        </div>

                                        <div className={`col-span-12 lg:col-span-2 flex justify-center scale-0 lg:scale-100 ${idx % 2 === 0 ? "" : "lg:order-1 lg:col-start-6"}`}>
                                            <div className="w-4 h-4 rounded-full border border-background flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-background rounded-full" />
                                            </div>
                                        </div>

                                        <div className={`col-span-12 lg:col-span-5 ${idx % 2 === 0 ? "lg:col-start-8" : "lg:col-start-1 lg:order-1 lg:text-right"}`}>
                                            <div className="aspect-video bg-background/5 overflow-hidden filter grayscale opacity-50 hover:opacity-100 transition-opacity">
                                                <img
                                                    src={`https://images.unsplash.com/photo-${idx === 0 ? "1434030216411-0b793f4b4173" : idx === 1 ? "1517245386807-bb43f82c33c4" : "1523050335392-93851179ae22"}?q=80&w=800&auto=format&fit=crop`}
                                                    className="w-full h-full object-cover"
                                                    alt="Milestone"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <VanguardFooter />
            </main>
        </>
    );
}
