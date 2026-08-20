"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ScrollText } from "./ScrollText";
import { useAudio } from "./audio-provider";
import { useLocale, useTranslations } from "next-intl";
import { BlogPost } from "@/lib/blog-types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function VanguardJournal({ initialArticles }: { initialArticles: BlogPost[] }) {
    const locale = useLocale();
    const t = useTranslations("journal");
    const articles = initialArticles;
    const { playSound } = useAudio();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const lastHoverSound = useRef(0);

    const sectionRef = useRef<HTMLElement>(null);
    const rowsRef = useRef<HTMLDivElement>(null);
    const viewAllRef = useRef<HTMLDivElement>(null);

    const throttledHoverSound = () => {
        const now = Date.now();
        if (now - lastHoverSound.current > 400) {
            lastHoverSound.current = now;
            playSound('hover');
        }
    };

    useEffect(() => {
        if (!sectionRef.current) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const rows = rowsRef.current?.children;
            if (rows && rows.length > 0) {
                Array.from(rows).forEach((row, i) => {
                    gsap.fromTo(row,
                        { x: 60, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
                          scrollTrigger: { trigger: row, start: 'top 85%' } }
                    );
                });
            }
            if (viewAllRef.current) {
                gsap.fromTo(viewAllRef.current,
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
                      scrollTrigger: { trigger: viewAllRef.current, start: 'top 90%' } }
                );
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="bg-transparent text-foreground px-6 md:px-10 lg:px-16 relative overflow-hidden">
            <div className="max-w-[1920px] mx-auto">

                {/* ── Section header — always visible ── */}
                <div className="grid grid-cols-12 gap-8 mb-8 lg:mb-12 items-end">
                    <div className="col-span-12 lg:col-span-8">
                        <div className="flex items-center gap-6 mb-8 opacity-85">
                            <div className="w-12 h-[1px] bg-foreground/30" />
                            <span className="text-[var(--text-xs)] uppercase tracking-[0.22em] font-medium text-foreground/65">[ {t("sectionLabel")} ]</span>
                        </div>
                        <h2 className="type-title-md leading-[0.9]">
                            <ScrollText mode="scrub" as="span" start="top 85%" end="top 40%">
                                {t("heading")}
                            </ScrollText>
                            <br />
                            <span className="italic">
                                <ScrollText mode="scrub" as="span" className="italic" start="top 80%" end="top 35%">
                                    {t("headingItalic")}
                                </ScrollText>
                            </span>
                        </h2>
                    </div>
                    <div className="col-span-12 lg:col-span-4 lg:text-right border-l lg:border-l-0 lg:border-r border-foreground/20 pl-8 lg:pl-0 lg:pr-8 py-4">
                        <span className="type-label opacity-75 block mb-4">{t("insightsLabel")}</span>
                        <p className="type-body-lg max-w-sm ml-auto">{t("subtitle")}</p>
                    </div>
                </div>

                {articles.length === 0 ? (
                    /* ── Empty state ── */
                    <div ref={viewAllRef} className="border-t border-foreground/20">
                        <div className="grid grid-cols-12 gap-8 py-10 lg:py-14 items-end">
                            <div className="col-span-12 lg:col-span-8">
                                <p className="font-mono text-foreground/50 leading-relaxed" style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)", maxWidth: "52ch" }}>
                                    {t("emptyNote")}
                                </p>
                            </div>
                            <div className="col-span-12 lg:col-span-4 lg:flex lg:justify-end">
                                <Link
                                    href={`/${locale}/blog`}
                                    onMouseEnter={() => playSound('hover')}
                                    onClick={() => playSound('click')}
                                    className="group inline-flex items-center gap-3 px-6 py-4 border border-foreground/20 hover:border-foreground/60 hover:bg-foreground hover:text-background transition-all duration-300"
                                >
                                    <span className="font-mono text-[11px] uppercase tracking-[0.2em]">{t("visitJournal")}</span>
                                    <ArrowRightIcon />
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* ── Article rows ── */}
                        <div ref={rowsRef} className="flex flex-col border-t border-foreground/20 h-full">
                            {articles.map((article, index) => (
                                <Link
                                    key={article.slug}
                                    href={`/${locale}/blog/${article.slug}`}
                                    data-cursor-label="READ"
                                    className="group relative h-full py-8 lg:py-10 border-b border-foreground/15 transition-all duration-500 hover:bg-foreground/[0.04] hover:pl-2 block"
                                    onMouseEnter={() => { setHoveredIndex(index); throttledHoverSound(); }}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => playSound('click')}
                                >
                                    <div className="grid grid-cols-12 gap-8 items-center h-full relative z-10">
                                        <div className="col-span-2 lg:col-span-1 hidden md:flex flex-col">
                                            <span className="type-meta opacity-60">{t("articlePrefix")} {index + 1}</span>
                                            <span className="type-meta opacity-80">{article.date}</span>
                                        </div>
                                        <div className="col-span-12 md:col-span-10 lg:col-span-8 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-12">
                                            <h3 className="text-[clamp(1.2rem,2.4vw,2rem)] font-display tracking-tight leading-[1.1] transition-transform duration-500 group-hover:translate-x-2">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-8 h-[1px] bg-foreground" />
                                                <ArrowRightIcon />
                                            </div>
                                        </div>
                                        <div className="col-span-12 lg:col-span-3 text-left lg:text-right pt-6 lg:pt-0">
                                            <span className="px-4 py-2 border border-foreground/40 type-label-tight group-hover:bg-foreground group-hover:text-background transition-colors">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        <div ref={viewAllRef} className="mt-12 flex justify-center">
                            <Link
                                href={`/${locale}/blog`}
                                onMouseEnter={() => playSound('hover')}
                                onClick={() => playSound('click')}
                                className="vanguard-magnetic group flex flex-col items-center gap-4"
                            >
                                <span className="type-label opacity-75 group-hover:opacity-100 transition-opacity">{t("viewAll")}</span>
                                <div className="w-32 h-[1px] bg-foreground/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                </div>
                            </Link>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .vanguard-magnetic { transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1); }
                .vanguard-magnetic:hover { transform: translateY(-5px); }
            `}</style>
        </section>
    );
}

function ArrowRightIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}
