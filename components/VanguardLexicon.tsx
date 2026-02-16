"use client";

import React from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { KineticText } from "./KineticText";
import { trackCTAClick } from "@/lib/analytics";

export function VanguardLexicon() {
    const reduceMotion = useReducedMotion();

    const programs = [
        {
            id: "01",
            title: "Young Learners (6-10)",
            description: "Interactive English classes that build vocabulary, pronunciation, and confidence through practice.",
            image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=800&auto=format&fit=crop",
            caption: "Kids Program"
        },
        {
            id: "02",
            title: "Teens (11-17)",
            description: "Support for school English, speaking fluency, and communication skills for academic success.",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop",
            caption: "Teen Program"
        },
        {
            id: "03",
            title: "IELTS Preparation",
            description: "Goal-based IELTS lessons with speaking drills, writing feedback, and test strategy.",
            image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
            caption: "Exam Program"
        },
        {
            id: "04",
            title: "English for Work",
            description: "Professional English for interviews, meetings, presentations, and client communication.",
            image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?q=80&w=600&auto=format&fit=crop",
            caption: "Career Program"
        }
    ];

    return (
        <section id="lexicon" className="bg-background text-foreground px-6 md:px-12 lg:px-24 border-t border-foreground/5 relative overflow-hidden">
            <div className="atmosphere-grid opacity-55" />
            {/* Disciplined Header: 12-Column Alignment */}
            <div className="max-w-[1920px] mx-auto">
                <div className="grid grid-cols-12 gap-8 mb-14 lg:mb-18">
                    <div className="col-span-12 lg:col-span-7">
                        <div className="flex items-center gap-6 mb-8 opacity-85">
                            <div className="w-12 h-[1px] bg-foreground" />
                            <span className="type-label">Program Collection</span>
                        </div>
                        <h2 className="type-title-lg mb-8">
                            <KineticText text="Program" /> <span className="italic"><KineticText text="Frameworks" delay={0.2} className="italic" /></span>
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right border-t border-foreground/10 lg:border-t-0 pt-12 lg:pt-0">
                        <p className="type-title-sm italic mb-4">Practical English Results</p>
                        <p className="type-body text-foreground/75 max-w-sm">
                            Clear lesson tracks for children, teens, and adults with real communication goals.
                        </p>
                    </div>
                </div>

                {/* Symmetrical Grid: 1-col (mobile), 2-col (tablet), 3-col (large) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-10 lg:gap-x-14 gap-y-14 lg:gap-y-20">
                    {programs.map((program, index) => (
                        <motion.div
                            key={program.id}
                            initial={false}
                            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                            className="group "
                        >
                            <div className="relative border-t border-foreground opacity-100 mb-8 pt-8 flex justify-between items-center overflow-hidden">
                                <span className="type-meta text-foreground/80">PROGRAM {program.id} / 04</span>
                                <div className="h-6 w-[1px] bg-foreground/10" />
                                <span className="type-meta uppercase text-foreground/80">{program.caption}</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                                <div className="md:col-span-5 lg:col-span-4">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-foreground/5 cursor-none">
                                        <motion.div
                                            whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                                        >
                                            <Image
                                                src={program.image}
                                                alt={program.title}
                                                fill
                                                sizes="(max-width: 768px) 90vw, (max-width: 1200px) 40vw, 30vw"
                                                className="w-full h-full object-cover"
                                            />
                                        </motion.div>
                                        <div className="absolute inset-x-0 bottom-0 p-4 bg-black/45 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex justify-between items-center text-white">
                                            <span className="type-meta uppercase">View Program</span>
                                            <ArrowUpRight size={14} />
                                        </div>
                                    </div>
                                </div>
                                <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-center h-full pt-4 lg:pt-0">
                                    <h3 className="type-title-lg mb-6 group-hover:italic transition-all duration-500">
                                        {program.title}
                                    </h3>
                                    <p className="type-body text-foreground/85 max-w-md">
                                        {program.description}
                                    </p>
                                    <div className="mt-8 flex gap-8">
                                        <div className="w-12 h-[1px] bg-foreground/20 mt-3" />
                                        <span className="type-label-tight text-foreground/75 group-hover:text-foreground transition-colors">Course details on request</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Symmetrical High-Energy Closer */}
                <div className="mt-20 pt-10 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="max-w-xl">
                        <h4 className="type-title-md mb-4 italic">Ready to start?</h4>
                        <p className="type-body text-foreground/75">
                            Send your level and goal. You will receive a recommended program and schedule options.
                        </p>
                    </div>
                    <a href="#contact" className="group">
                        <div
                          className="relative px-12 py-6 border border-foreground/15 overflow-hidden hover:border-foreground transition-colors link-sheen"
                          onClick={() => trackCTAClick("lexicon", "apply_admission")}
                        >
                            <span className="relative z-10 type-label">Request Placement Call</span>
                            <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-[0.03]" />
                        </div>
                    </a>
                </div>
            </div>
        </section>
    );
}
