"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { KineticText } from "./KineticText";
import { useAudio } from "./audio-provider";
import { useLocale } from "next-intl";
import { BlogPost } from "@/lib/blog-types";

export function VanguardJournal({ initialArticles }: { initialArticles: BlogPost[] }) {
    const locale = useLocale();
    const articles = initialArticles;
    const { playSound } = useAudio();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const reduceMotion = useReducedMotion();
    const lastHoverSound = useRef(0);

    const throttledHoverSound = () => {
        const now = Date.now();
        if (now - lastHoverSound.current > 400) {
            lastHoverSound.current = now;
            playSound('hover');
        }
    };

    return (
        <section className="bg-transparent text-white px-6 md:px-12 lg:px-24 relative overflow-hidden">
            <div className="max-w-[1920px] mx-auto">
                {/* Header: Disciplined Symmetry */}
                <div className="grid grid-cols-12 gap-8 mb-14 lg:mb-18 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="flex items-center gap-6 mb-8 opacity-85">
                            <div className="w-12 h-[1px] bg-white" />
                            <span className="type-label">From the Journal</span>
                        </div>
                        <h2 className="type-title-md leading-[0.9]">
                            <KineticText text="Things I" /> <br />
                            <span className="italic">
                                <KineticText text="Actually Write About" delay={0.2} className="italic" />
                            </span>
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:text-right border-l lg:border-l-0 lg:border-r border-white/20 pl-8 lg:pl-0 lg:pr-8 py-4">
                        <span className="type-label opacity-75 block mb-4">New Articles</span>
                        <p className="type-body-lg max-w-sm ml-auto">
                            Short reads for parents, students, and people working on their English.
                        </p>
                    </div>
                </div>

                {/* Symmetrical Row Grid */}
                <div className="flex flex-col border-t border-white/20 h-full">
                    {articles.map((article, index) => (
                        <Link
                            key={article.slug}
                            href={`/${locale}/blog/${article.slug}`}
                            className="group relative h-full py-8 lg:py-10 border-b border-white/20 transition-colors hover:bg-white/[0.05] block"
                            onMouseEnter={() => {
                                setHoveredIndex(index);
                                throttledHoverSound();
                            }}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => playSound('click')}
                        >
                            <div className="grid grid-cols-12 gap-8 items-center h-full relative z-10">
                                {/* Academic Marker */}
                                <div className="col-span-2 lg:col-span-1 hidden md:flex flex-col">
                                    <span className="type-meta opacity-60">Article {index + 1}</span>
                                    <span className="type-meta opacity-80">{article.date}</span>
                                </div>

                                {/* Title: Clamped and Energetic */}
                                <div className="col-span-10 lg:col-span-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12">
                                    <h3 className="text-[clamp(1.2rem,2.4vw,2rem)] font-display tracking-tight leading-[1.1] group-hover:italic transition-all duration-500">
                                        {article.title}
                                    </h3>
                                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-8 h-[1px] bg-white" />
                                        <ArrowRightIcon />
                                    </div>
                                </div>

                                {/* Category: Tactical Marker */}
                                <div className="col-span-12 lg:col-span-3 text-left lg:text-right pt-6 lg:pt-0">
                                        <span className="px-4 py-2 border border-white/40 rounded-full type-label-tight group-hover:bg-white group-hover:text-black transition-colors">
                                            {article.category}
                                        </span>
                                </div>
                            </div>

                        </Link>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <Link
                        href={`/${locale}/blog`}
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => playSound('click')}
                        className="vanguard-magnetic group flex flex-col items-center gap-4"
                    >
                        <span className="type-label opacity-75 group-hover:opacity-100 transition-opacity">View All Articles</span>
                        <div className="w-32 h-[1px] bg-white/30 relative overflow-hidden">
                            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                        </div>
                    </Link>
                </div>
            </div>

            <style jsx>{`
                .vanguard-magnetic {
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .vanguard-magnetic:hover {
                    transform: translateY(-5px);
                }
            `}</style>
        </section>
    );
}

function ArrowRightIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );
}
