"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
import { useAudio } from "./audio-provider";

const stats = [
    { value: "2,000+", labelKey: "statsStudents" as const },
    { value: "3",      labelKey: "statsYears"    as const },
    { value: "15+",    labelKey: "statsSchools"  as const },
];

const CYCLING_WORDS = [
    "finally sticks",
    "opens doors",
    "trains confidence",
    "travels past IELTS",
    "removes the ceiling",
    "becomes you",
];

type LenisInstance = { scrollTo: (el: HTMLElement, opts?: { offset?: number; duration?: number }) => void };

export function VanguardHero() {
    const t             = useTranslations("hero");
    const { playSound } = useAudio();
    const reduceMotion  = useReducedMotion();
    const [wordIndex, setWordIndex] = useState(0);

    const scrollToPrograms = () => {
        playSound("click");
        trackCTAClick("hero", "curriculum");
        const el = document.getElementById("programs");
        if (!el) return;
        const lenis = (window as Window & { __lenis?: LenisInstance }).__lenis;
        const offset = -(window.innerHeight / 2) + (el.offsetHeight / 2);
        if (lenis) {
            lenis.scrollTo(el, { offset, duration: 1.2 });
        } else {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    useEffect(() => {
        if (reduceMotion) return;
        const id = setInterval(
            () => setWordIndex((i) => (i + 1) % CYCLING_WORDS.length),
            2600,
        );
        return () => clearInterval(id);
    }, [reduceMotion]);

    return (
        <header
            className="relative w-full flex flex-col bg-background"
            style={{ minHeight: "100dvh", paddingTop: "var(--nav-h)" }}
        >
            {/* ── Copper atmospheric glow ─────────────────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    background: "radial-gradient(ellipse 55% 60% at 15% 40%, rgba(200,92,63,0.09) 0%, transparent 70%)",
                }}
            />

            {/* ── Ghost index ─────────────────────────────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute select-none font-display font-bold leading-none"
                style={{
                    fontSize: "clamp(10rem, 28vw, 36rem)",
                    letterSpacing: "-0.07em",
                    opacity: 0.04,
                    right: "-1%",
                    bottom: "6%",
                    color: "hsl(var(--foreground))",
                }}
            >
                01
            </div>

            {/* ── Fine grid texture ────────────────────────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: [
                        "repeating-linear-gradient(0deg,transparent,transparent 79px,rgba(128,128,128,0.03) 79px,rgba(128,128,128,0.03) 80px)",
                        "repeating-linear-gradient(90deg,transparent,transparent 79px,rgba(128,128,128,0.03) 79px,rgba(128,128,128,0.03) 80px)",
                    ].join(","),
                }}
            />

            {/* ════════════════════════════════════════════════════════════════
                MOBILE  (< md)
                Type-first. Stats as social proof. No portrait — that's About.
                Heading → stats strip → subtitle → CTA. Every zone earns space.
            ════════════════════════════════════════════════════════════════ */}
            <div className="flex md:hidden flex-col flex-1 relative z-10 pt-5 pb-4 min-h-0 justify-between">

                {/* ── TOP GROUP: type cascade anchored to top ── */}
                <div className="shrink-0 px-6">
                    {/* Section index — single line, no wrap */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="w-5 h-[1px] bg-foreground/25 shrink-0" aria-hidden="true" />
                        <div className="relative overflow-hidden min-w-0 flex-1">
                            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 whitespace-nowrap block">
                                [ 01 &mdash; {t("tagline")} ]
                            </span>
                            <div
                                aria-hidden="true"
                                className="absolute right-0 top-0 h-full w-8 pointer-events-none"
                                style={{ background: "linear-gradient(to left, hsl(var(--background)), transparent)" }}
                            />
                        </div>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={reduceMotion ? false : { y: 10 }}
                        animate={{ y: 0 }}
                        transition={{ duration: 0.75, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display text-foreground overflow-visible"
                        aria-label={`English ${CYCLING_WORDS[wordIndex]}`}
                    >
                        <span
                            className="block font-bold uppercase"
                            style={{
                                fontSize: "clamp(5rem, 20.5vw, 6.5rem)",
                                lineHeight: 0.87,
                                letterSpacing: "-0.04em",
                            }}
                        >
                            English
                        </span>
                        <span
                            className="block font-light italic"
                            style={{
                                fontSize: "clamp(1.9rem, 7.2vw, 2.5rem)",
                                lineHeight: 0.95,
                                letterSpacing: "-0.03em",
                                opacity: 0.52,
                            }}
                        >
                            that{" "}
                            <span
                                style={{ display: "inline-grid", gridTemplateAreas: '"word"' }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={CYCLING_WORDS[wordIndex]}
                                        initial={{ opacity: 0, filter: "blur(8px)", y: 5  }}
                                        animate={{ opacity: 1, filter: "blur(0px)",  y: 0  }}
                                        exit={{   opacity: 0, filter: "blur(8px)",  y: -5 }}
                                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        style={{ gridArea: "word", display: "block", whiteSpace: "nowrap" }}
                                    >
                                        {CYCLING_WORDS[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </span>
                    </motion.h1>
                </div>


                {/* ── BOTTOM GROUP: social proof + action anchored to bottom ── */}
                <div className="flex flex-col gap-4 shrink-0 px-6">

                    {/* Stats strip */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.32 }}
                        className="grid grid-cols-3"
                        style={{ borderTop: "1px solid hsl(var(--foreground) / 0.10)", borderBottom: "1px solid hsl(var(--foreground) / 0.10)" }}
                    >
                        {stats.map(({ value, labelKey }, i) => (
                            <div
                                key={labelKey}
                                className="flex flex-col py-3 px-3"
                                style={{
                                    borderRight: i < stats.length - 1
                                        ? "1px solid hsl(var(--foreground) / 0.10)"
                                        : "none",
                                }}
                            >
                                <span
                                    className="font-display font-bold leading-none text-foreground"
                                    style={{ fontSize: "clamp(1.25rem, 4.8vw, 1.6rem)", letterSpacing: "-0.02em" }}
                                >
                                    {value}
                                </span>
                                <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/50 mt-1 leading-tight">
                                    {t(labelKey)}
                                </span>
                            </div>
                        ))}
                    </motion.div>

                    {/* Subtitle */}
                    <motion.p
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.44 }}
                        className="font-mono text-foreground/65 leading-relaxed"
                        style={{ fontSize: "clamp(0.8rem, 3.4vw, 0.875rem)" }}
                    >
                        {t("subtitle")}
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: 0.54 }}
                        className="flex flex-col gap-2"
                    >
                        <Link
                            href="#contact"
                            onClick={() => { playSound("click"); trackCTAClick("hero", "primary_inquiry"); }}
                            className="group relative w-full inline-flex items-center justify-center gap-2 py-[14px] text-[12px] font-bold tracking-[0.2em] uppercase overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                            style={{ background: "#C85C3F", color: "#fff" }}
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {t("cta")}
                                <ArrowUpRight size={12} aria-hidden="true" />
                            </span>
                            <span
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                style={{ background: "rgba(255,255,255,0.13)" }}
                            />
                        </Link>
                        <button
                            type="button"
                            onClick={scrollToPrograms}
                            className="inline-flex items-center justify-center py-2 text-[11px] font-mono tracking-[0.18em] uppercase text-foreground/45 hover:text-foreground transition-colors duration-300 underline underline-offset-4 decoration-foreground/20"
                        >
                            {t("secondary")}
                        </button>
                    </motion.div>

                    {/* Credential pills — horizontal scroll, never wraps */}
                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.45, delay: 0.64 }}
                        className="flex gap-2 pb-1"
                        style={{ overflowX: "auto", scrollbarWidth: "none" } as React.CSSProperties}
                    >
                        {[t("badgeTesol"), t("badgePgce"), t("badgeLocation"), t("badgeFormat")].map((item) => (
                            <span
                                key={item}
                                className="font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1.5 text-foreground/50 shrink-0"
                                style={{ border: "1px solid hsl(var(--foreground) / 0.12)" }}
                            >
                                {item}
                            </span>
                        ))}
                    </motion.div>

                </div>

            </div>

            {/* ════════════════════════════════════════════════════════════════
                DESKTOP  (md+)
                Editorial: label top, void, heading + content bottom.
            ════════════════════════════════════════════════════════════════ */}
            <div className="hidden md:flex flex-col flex-1 relative z-10 justify-between px-10 lg:px-16 py-10 lg:py-12 min-h-0">

                {/* Label — top anchor */}
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex items-center gap-4 shrink-0"
                >
                    <span className="w-8 h-[1px] bg-foreground/25 shrink-0" aria-hidden="true" />
                    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/55">
                        [ 01 &mdash; {t("tagline")} ]
                    </span>
                </motion.div>

                {/* Heading + content — bottom anchor */}
                <div className="flex flex-col gap-4 shrink-0">
                    <h1 className="font-display text-foreground overflow-visible">
                        <motion.span
                            initial={reduceMotion ? false : { y: 12 }}
                            animate={{ y: 0 }}
                            transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            className="block font-bold uppercase"
                            style={{
                                fontSize: "clamp(5.5rem, 22vw, 14rem)",
                                lineHeight: 0.87,
                                letterSpacing: "-0.04em",
                            }}
                        >
                            English
                        </motion.span>
                        <motion.span
                            initial={reduceMotion ? false : { opacity: 0, y: "0.25em" }}
                            animate={{ opacity: 0.52, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="block font-light italic"
                            style={{
                                fontSize: "clamp(2.5rem, 6.5vw, 8rem)",
                                lineHeight: 0.9,
                                letterSpacing: "-0.03em",
                            }}
                        >
                            that{" "}
                            <span
                                style={{ display: "inline-grid", gridTemplateAreas: '"word"' }}
                                aria-live="polite"
                                aria-atomic="true"
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.span
                                        key={CYCLING_WORDS[wordIndex]}
                                        initial={{ opacity: 0, filter: "blur(12px)", y: 8  }}
                                        animate={{ opacity: 1, filter: "blur(0px)",  y: 0  }}
                                        exit={{   opacity: 0, filter: "blur(12px)", y: -8 }}
                                        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                                        style={{ gridArea: "word", display: "block", whiteSpace: "nowrap" }}
                                    >
                                        {CYCLING_WORDS[wordIndex]}
                                    </motion.span>
                                </AnimatePresence>
                            </span>
                        </motion.span>
                    </h1>

                    <motion.div
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.85 }}
                        className="flex flex-col gap-4"
                    >
                        <div className="flex lg:flex-row lg:items-end justify-between gap-5">
                            <p
                                className="font-mono text-foreground/65 leading-relaxed max-w-[44ch]"
                                style={{ fontSize: "clamp(0.875rem, 1.1vw, 0.9rem)" }}
                            >
                                {t("subtitle")}
                            </p>
                            <div className="flex flex-row gap-3 shrink-0">
                                <Link
                                    href="#contact"
                                    onClick={() => { playSound("click"); trackCTAClick("hero", "primary_inquiry"); }}
                                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
                                    style={{ background: "#C85C3F", color: "#fff" }}
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        {t("cta")}
                                        <ArrowUpRight size={12} aria-hidden="true" />
                                    </span>
                                    <span
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: "rgba(255,255,255,0.13)" }}
                                    />
                                </Link>
                                <button
                                    type="button"
                                    onClick={scrollToPrograms}
                                    className="inline-flex items-center justify-center px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:text-foreground"
                                    style={{
                                        border: "1px solid hsl(var(--foreground) / 0.15)",
                                        color: "hsl(var(--foreground) / 0.5)",
                                    }}
                                >
                                    {t("secondary")}
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {[t("badgeTesol"), t("badgePgce"), t("badgeLocation"), t("badgeFormat")].map((item) => (
                                <span
                                    key={item}
                                    className="font-mono text-[11px] tracking-[0.15em] uppercase px-3 py-1 text-foreground/50"
                                    style={{ border: "1px solid hsl(var(--foreground) / 0.12)" }}
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ══ STATS BAR ══════════════════════════════════════════════════ */}
            <motion.div
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.1 }}
                className="relative z-10 shrink-0"
                style={{ borderTop: "1px solid hsl(var(--foreground) / 0.07)" }}
            >
                <div className="flex items-center px-6 md:px-10 lg:px-16">
                    {stats.map(({ value, labelKey }, i) => (
                        <div
                            key={labelKey}
                            className="hidden sm:flex flex-col py-4"
                            style={{
                                paddingRight: "clamp(1rem, 2vw, 2rem)",
                                paddingLeft: i > 0 ? "clamp(1rem, 2vw, 2rem)" : 0,
                                borderRight: i < stats.length - 1
                                    ? "1px solid hsl(var(--foreground) / 0.07)"
                                    : "none",
                            }}
                        >
                            <span
                                className="font-display font-bold leading-none text-foreground"
                                style={{ fontSize: "clamp(1rem, 1.6vw, 1.6rem)", letterSpacing: "-0.02em" }}
                            >
                                {value}
                            </span>
                            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/50 mt-0.5">
                                {t(labelKey)}
                            </span>
                        </div>
                    ))}
                    <div className="flex items-center gap-4 ml-auto py-3">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
                                style={{ animation: "pulse-glow 2s ease-in-out infinite" }}
                                aria-hidden="true"
                            />
                            <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-foreground/55">
                                {t("statusOpen")}
                            </span>
                        </div>
                        <span className="hidden md:block font-mono text-[11px] tracking-[0.24em] uppercase text-foreground/35">
                            [ {t("scrollLabel")} ]
                        </span>
                    </div>
                </div>
            </motion.div>

        </header>
    );
}
