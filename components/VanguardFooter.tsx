"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAudio } from "./audio-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function VanguardFooter() {
    const locale        = useLocale();
    const t             = useTranslations("footer");
    const navT          = useTranslations("nav");
    const inquiryT      = useTranslations("inquiry");
    const { playSound } = useAudio();

    const footerRef = useRef<HTMLElement>(null);
    const titleRef  = useRef<HTMLDivElement>(null);
    const linksRef  = useRef<HTMLDivElement>(null);

    const scrollToTop = () => {
        const lenis = (window as Window & { __lenis?: { scrollTo: (to: number, opts?: { duration?: number }) => void } }).__lenis;
        if (lenis) { lenis.scrollTo(0, { duration: 1.0 }); return; }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        if (!footerRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const ctx = gsap.context(() => {
            const letters = titleRef.current?.querySelectorAll(".footer-letter");
            if (letters?.length) {
                gsap.fromTo(letters,
                    { y: "110%", opacity: 0 },
                    {
                        y: "0%", opacity: 1, duration: 0.9, stagger: 0.035, ease: "power3.out",
                        scrollTrigger: { trigger: titleRef.current, start: "top 85%", once: true },
                    }
                );
            }

            const columns = linksRef.current?.children;
            if (columns?.length) {
                gsap.fromTo(Array.from(columns),
                    { y: 24, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
                        scrollTrigger: { trigger: linksRef.current, start: "top 85%", once: true },
                    }
                );
            }
        }, footerRef);

        return () => ctx.revert();
    }, []);

    const navLinks = [
        { href: `/${locale}#about`,    label: navT("about")     },
        { href: `/${locale}#programs`, label: navT("services")  },
        { href: `/${locale}/blog`,     label: navT("blog_link") },
        { href: `/${locale}#faq`,      label: navT("faq")       },
        { href: `/${locale}#contact`,  label: navT("contact")   },
    ];

    const channelLinks = [
        { href: "https://zalo.me/84353885757", label: t("telegram"),  external: true  },
        { href: "https://wa.me/84353885757",   label: t("whatsapp"),  external: true  },
        { href: "mailto:hello@teacherbek.com", label: t("email"),     external: false },
        { href: "https://www.linkedin.com",    label: t("linkedin"),  external: true  },
    ];

    const titleText = "TEACHER BEK.";

    return (
        <footer
            ref={footerRef}
            className="bg-foreground text-background relative overflow-hidden"
        >
            {/* ── CTA ───────────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 pt-20 md:pt-28 pb-16 border-b border-background/10">
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-45 mb-6">
                            {t("contact")}
                        </p>
                        <h2
                            className="font-display font-bold uppercase leading-[0.9]"
                            style={{ fontSize: "clamp(2rem, 6vw, 5.5rem)", letterSpacing: "-0.05em" }}
                        >
                            {t("ctaHeading")}
                        </h2>
                    </div>

                    <a
                        href="mailto:hello@teacherbek.com"
                        onMouseEnter={() => playSound("hover")}
                        onClick={() => playSound("click")}
                        className="group shrink-0 flex items-center gap-3 text-background opacity-75 hover:opacity-100 transition-opacity duration-400"
                        style={{ fontSize: "clamp(0.8rem, 1.2vw, 1rem)" }}
                    >
                        <span className="font-mono tracking-[0.04em]">hello@teacherbek.com</span>
                        <ArrowUpRight
                            size={14}
                            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                            aria-hidden="true"
                        />
                    </a>
                </div>
            </div>

            {/* ── Links grid ────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-14 border-b border-background/10">
                <div
                    ref={linksRef}
                    className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8"
                >

                    {/* Col 1 — Quick Links */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-40 mb-4">
                            {t("quickLinks")}
                        </span>
                        <nav aria-label="Footer navigation" className="flex flex-col gap-0.5">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group flex items-center justify-between py-1.5 text-background no-underline"
                                >
                                    <span className="font-mono text-[12px] tracking-[0.06em] opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                    <ArrowUpRight
                                        size={9}
                                        className="opacity-0 group-hover:opacity-50 group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300 shrink-0"
                                        aria-hidden="true"
                                    />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Col 2 — Reach Me */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-40 mb-4">
                            {t("channels")}
                        </span>
                        <div className="flex flex-col gap-0.5">
                            {channelLinks.map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    target={item.external ? "_blank" : undefined}
                                    rel={item.external ? "noopener noreferrer" : undefined}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group flex items-center justify-between py-1.5 text-background no-underline"
                                >
                                    <span className="font-mono text-[12px] tracking-[0.06em] opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                    {item.external && (
                                        <ArrowUpRight
                                            size={9}
                                            className="opacity-0 group-hover:opacity-50 group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300 shrink-0"
                                            aria-hidden="true"
                                        />
                                    )}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Hours */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-40 mb-4">
                            {inquiryT("hoursLabel")}
                        </span>
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="font-mono text-[12px] tracking-[0.06em] opacity-60 mb-0.5">
                                    {inquiryT("weekdays")}
                                </p>
                                <p className="font-mono text-[11px] opacity-45">19:30 – 21:00</p>
                            </div>
                            <div>
                                <p className="font-mono text-[12px] tracking-[0.06em] opacity-60 mb-0.5">
                                    {inquiryT("weekends")}
                                </p>
                                <p className="font-mono text-[11px] opacity-45">14:00 – 20:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Col 4 — Location */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-40 mb-4">
                            {t("locationLabel")}
                        </span>
                        <div className="flex flex-col gap-1.5">
                            <p className="font-mono text-[12px] tracking-[0.06em] opacity-60 leading-relaxed">
                                {t("location")}
                            </p>
                            <p className="font-mono text-[12px] tracking-[0.06em] opacity-60">
                                {t("city")}
                            </p>
                            <p className="font-mono text-[12px] tracking-[0.06em] opacity-45">
                                {t("country")}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Giant watermark title ──────────────────────────────── */}
            <div
                ref={titleRef}
                className="px-4 pt-10 pb-3 overflow-hidden select-none"
                aria-hidden="true"
            >
                <div
                    className="font-display font-bold uppercase leading-[0.82] overflow-hidden"
                    style={{
                        fontSize: "clamp(5rem, 18vw, 22rem)",
                        letterSpacing: "-0.05em",
                        opacity: 0.06,
                    }}
                >
                    {titleText.split("").map((char, i) => (
                        <span
                            key={i}
                            className="footer-letter"
                            style={{ display: "inline-block" }}
                        >
                            {char === " " ? "\u00a0" : char}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Bottom bar ────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-5 border-t border-background/10">
                <div className="flex items-center justify-between flex-wrap gap-4">

                    <p className="font-mono text-[11px] tracking-[0.08em] opacity-35 leading-relaxed hidden md:block">
                        {t("tagline")}
                    </p>
                    <p className="font-mono text-[11px] opacity-35 md:hidden">
                        © {new Date().getFullYear()} Teacher Bek
                    </p>

                    <button
                        type="button"
                        onMouseEnter={() => playSound("hover")}
                        onClick={() => { playSound("click"); scrollToTop(); }}
                        aria-label={t("backToTop")}
                        className="group flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] opacity-30 hover:opacity-70 transition-opacity duration-300 text-background"
                    >
                        {t("backToTop")}
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                            className="group-hover:-translate-y-0.5 transition-transform duration-300">
                            <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5"/>
                        </svg>
                    </button>

                    <div className="flex items-center gap-5">
                        <Link
                            href={`/${locale}/privacy`}
                            className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-35 hover:opacity-65 transition-opacity duration-300 text-background no-underline"
                        >
                            {t("privacy")}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            className="font-mono text-[11px] uppercase tracking-[0.1em] opacity-35 hover:opacity-65 transition-opacity duration-300 text-background no-underline"
                        >
                            {t("terms")}
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}
