"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function VanguardServiceGlimpse() {
    const locale = useLocale();
    const t = useTranslations("services");

    const sectionRef    = useRef<HTMLElement>(null);
    const headingRef    = useRef<HTMLHeadingElement>(null);
    const cardsWrapRef  = useRef<HTMLDivElement>(null);

    const programs = [
        {
            id: "01",
            key: "mentorship" as const,
            tag: "Young Learners",
            age: "Ages 6–10",
            meta: "Group · Max 10",
        },
        {
            id: "02",
            key: "dialect" as const,
            tag: "Teens English",
            age: "Ages 11–17",
            meta: "Group · Max 10",
        },
        {
            id: "03",
            key: "literacy" as const,
            tag: "IELTS Prep",
            age: "All Levels",
            meta: "Group · Band Targets",
        },
    ];

    useEffect(() => {
        if (!sectionRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            // Heading letter reveal
            const words = headingRef.current?.querySelectorAll(".service-word");
            if (words?.length) {
                gsap.fromTo(words,
                    { y: "100%", opacity: 0 },
                    {
                        y: "0%",
                        opacity: 1,
                        duration: 0.8,
                        stagger: 0.08,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: "top 80%",
                            once: true,
                        },
                    }
                );
            }

            // Cards clip-path reveal
            const cards = cardsWrapRef.current?.children;
            if (cards?.length) {
                Array.from(cards).forEach((card, i) => {
                    gsap.fromTo(card,
                        { clipPath: "inset(0 0 100% 0)", opacity: 0 },
                        {
                            clipPath: "inset(0 0 0% 0)",
                            opacity: 1,
                            duration: 0.85,
                            delay: i * 0.12,
                            ease: "power3.inOut",
                            scrollTrigger: {
                                trigger: card,
                                start: "top 85%",
                                once: true,
                            },
                        }
                    );
                });
            }
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative overflow-hidden border-t border-current/10"
            id="services"
        >
            {/* ── Section header ─────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-current/10">
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-8 h-[1px] bg-current opacity-30 shrink-0" />
                        <span className="font-sans text-[12px] uppercase tracking-[0.22em] opacity-40 font-light">
                            [ Programs Overview ]
                        </span>
                    </div>

                    <div className="overflow-hidden">
                        <h2
                            ref={headingRef}
                            className="font-display font-bold uppercase leading-[0.9]"
                            style={{ fontSize: "clamp(2.8rem, 8vw, 9rem)", letterSpacing: "-0.05em" }}
                        >
                            {t("title").split(" ").map((word, i) => (
                                <span
                                    key={i}
                                    className="service-word inline-block mr-[0.2em] last:mr-0"
                                    style={{ display: "inline-block" }}
                                >
                                    {word}
                                </span>
                            ))}
                        </h2>
                    </div>
                </div>

                <p className="font-sans font-light opacity-40 max-w-xs shrink-0"
                    style={{ fontSize: "clamp(0.8rem, 1.3vw, 1rem)" }}>
                    {t("subtitle")}
                </p>
            </div>

            {/* ── Service cards grid ─────────────────────────────────── */}
            <div
                ref={cardsWrapRef}
                className="grid grid-cols-1 md:grid-cols-3 border-b border-current/10"
            >
                {programs.map((prog, idx) => (
                    <Link
                        key={prog.id}
                        href={`/${locale}/services#program-${prog.id}`}
                        className={`group relative flex flex-col justify-between p-10 lg:p-14 min-h-[360px] lg:min-h-[440px] border-current/10 hover:bg-foreground hover:text-background transition-all duration-700 cursor-pointer overflow-hidden ${
                            idx > 0 ? "border-l" : ""
                        }`}
                        style={{ transitionTimingFunction: "var(--transition-main)" }}
                    >
                        {/* Program number */}
                        <div className="flex items-start justify-between mb-auto">
                            <span
                                className="font-display font-bold opacity-10 select-none leading-none"
                                style={{ fontSize: "clamp(3rem, 8vw, 7rem)", letterSpacing: "-0.06em" }}
                                aria-hidden="true"
                            >
                                {prog.id}
                            </span>
                            {/* Arrow icon — rotates on hover */}
                            <span className="font-sans text-[13px] opacity-30 group-hover:opacity-100 transition-opacity duration-300">
                                <svg
                                    width="16" height="16" viewBox="0 0 16 16" fill="none"
                                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-400"
                                    aria-hidden="true"
                                >
                                    <path d="M2 14L14 2M14 2H5M14 2V11" stroke="currentColor" strokeWidth="1.5"/>
                                </svg>
                            </span>
                        </div>

                        {/* Content */}
                        <div className="mt-auto">
                            <p className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-40 font-light mb-4 group-hover:opacity-60 transition-opacity">
                                {prog.tag}
                            </p>
                            <h3
                                className="font-display font-bold uppercase leading-[0.9] mb-4"
                                style={{ fontSize: "clamp(1.8rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
                            >
                                {t(`programs.${prog.key}.title`)}
                            </h3>
                            <p
                                className="font-sans font-light opacity-50 leading-relaxed group-hover:opacity-70 transition-opacity duration-300"
                                style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}
                            >
                                {t(`programs.${prog.key}.desc`)}
                            </p>

                            {/* Bottom meta */}
                            <div className="flex items-center gap-4 mt-8 pt-6 border-t border-current/10">
                                <span className="font-sans text-[12px] uppercase tracking-[0.15em] opacity-30 font-light">
                                    {prog.age}
                                </span>
                                <span className="w-3 h-[1px] bg-current opacity-20" />
                                <span className="font-sans text-[12px] uppercase tracking-[0.15em] opacity-30 font-light">
                                    {prog.meta}
                                </span>
                            </div>
                        </div>

                        {/* Hover fill line indicator */}
                        <div
                            className="absolute bottom-0 left-0 h-[2px] bg-background w-0 group-hover:w-full transition-all duration-700"
                            style={{ transitionTimingFunction: "var(--transition-main)" }}
                        />
                    </Link>
                ))}
            </div>

            {/* ── Bottom info strip ─────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-6 flex items-center justify-between border-b border-current/10">
                <span className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-30 font-light">
                    From 1,990,000 VND / month
                </span>
                <span className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-30 font-light">
                    Weekdays 19:30 – 21:00 · Weekends 14:00 – 20:00
                </span>
            </div>
        </section>
    );
}
