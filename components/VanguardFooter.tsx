"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useAudio } from "./audio-provider";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ── Brand icon SVGs ─────────────────────────────────────── */
const IconInstagram = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    </svg>
);

const IconFacebook = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
);

const IconTikTok = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.28 8.28 0 0 0 4.83 1.55V6.9a4.85 4.85 0 0 1-1.06-.21z"/>
    </svg>
);

const IconLinkedIn = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
    </svg>
);

const IconWhatsApp = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
);

const IconZalo = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.655 1.443 5.163L2 22l4.946-1.418A9.953 9.953 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-3.5 7h4.75l-4.75 5H13M8.5 9v6m6.5-6v6"/>
    </svg>
);

export function VanguardFooter() {
    const locale        = useLocale();
    const t             = useTranslations("footer");
    const navT          = useTranslations("nav");
    const inquiryT      = useTranslations("inquiry");
    const { playSound } = useAudio();

    const footerRef  = useRef<HTMLElement>(null);
    const titleRef   = useRef<HTMLDivElement>(null);
    const linksRef   = useRef<HTMLDivElement>(null);
    const socialRef  = useRef<HTMLDivElement>(null);

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

            const socialItems = socialRef.current?.children;
            if (socialItems?.length) {
                gsap.fromTo(Array.from(socialItems),
                    { y: 16, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out",
                        scrollTrigger: { trigger: socialRef.current, start: "top 90%", once: true },
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

    /* Messaging & professional contact */
    const channelLinks = [
        { href: "https://zalo.me/84353885757",                 label: t("telegram"),  icon: <IconZalo />,     external: true  },
        { href: "https://wa.me/84353885757",                   label: t("whatsapp"),  icon: <IconWhatsApp />, external: true  },
        { href: "mailto:hello@teacherbek.com",                 label: t("email"),     icon: <Mail size={15} aria-hidden="true" />, external: false },
        { href: "https://www.linkedin.com/in/bek-boymirzaev/", label: t("linkedin"),  icon: <IconLinkedIn />, external: true  },
    ];

    /* Social platforms — displayed as prominent icon strip */
    const socialLinks = [
        { href: "https://www.instagram.com/itsteacherbek", label: t("instagram"), icon: <IconInstagram /> },
        { href: "https://www.facebook.com/teacherbek",     label: t("facebook"),  icon: <IconFacebook />  },
        { href: "https://www.tiktok.com/@itsteacherbek",   label: t("tiktok"),    icon: <IconTikTok />    },
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
                        <p className="font-mono text-[13px] uppercase tracking-[0.22em] opacity-45 mb-6">
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
                        style={{ fontSize: "clamp(0.85rem, 1.2vw, 1rem)" }}
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
                        <span className="font-mono text-[12px] uppercase tracking-[0.28em] opacity-40 mb-5">
                            {t("quickLinks")}
                        </span>
                        <nav aria-label="Footer navigation" className="flex flex-col gap-0.5">
                            {navLinks.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group flex items-center justify-between py-2 text-background no-underline"
                                >
                                    <span className="font-mono text-[14px] tracking-[0.04em] opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                    <ArrowUpRight
                                        size={10}
                                        className="opacity-0 group-hover:opacity-50 group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300 shrink-0"
                                        aria-hidden="true"
                                    />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Col 2 — Reach Me */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[12px] uppercase tracking-[0.28em] opacity-40 mb-5">
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
                                    className="group flex items-center gap-3 py-2 text-background no-underline"
                                >
                                    <span className="opacity-35 group-hover:opacity-70 transition-opacity duration-300 shrink-0">
                                        {item.icon}
                                    </span>
                                    <span className="font-mono text-[14px] tracking-[0.04em] opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                                        {item.label}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Hours */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[12px] uppercase tracking-[0.28em] opacity-40 mb-5">
                            {inquiryT("hoursLabel")}
                        </span>
                        <div className="flex flex-col gap-4">
                            <div>
                                <p className="font-mono text-[14px] tracking-[0.04em] opacity-60 mb-1">
                                    {inquiryT("weekdays")}
                                </p>
                                <p className="font-mono text-[13px] opacity-40">19:30 – 21:00</p>
                            </div>
                            <div>
                                <p className="font-mono text-[14px] tracking-[0.04em] opacity-60 mb-1">
                                    {inquiryT("weekends")}
                                </p>
                                <p className="font-mono text-[13px] opacity-40">14:00 – 20:00</p>
                            </div>
                        </div>
                    </div>

                    {/* Col 4 — Location */}
                    <div className="flex flex-col gap-1">
                        <span className="font-mono text-[12px] uppercase tracking-[0.28em] opacity-40 mb-5">
                            {t("locationLabel")}
                        </span>
                        <div className="flex flex-col gap-2">
                            <p className="font-mono text-[14px] tracking-[0.04em] opacity-60 leading-relaxed">
                                {t("location")}
                            </p>
                            <p className="font-mono text-[14px] tracking-[0.04em] opacity-60">
                                {t("city")}
                            </p>
                            <p className="font-mono text-[13px] tracking-[0.04em] opacity-40">
                                {t("country")}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Social strip ──────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-10 border-b border-background/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <span className="font-mono text-[12px] uppercase tracking-[0.28em] opacity-40">
                        Follow
                    </span>
                    <div ref={socialRef} className="flex items-center gap-2">
                        {socialLinks.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={item.label}
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => playSound("click")}
                                className="group flex items-center gap-2.5 px-5 py-3 border border-background/15 hover:border-background/40 transition-colors duration-300"
                            >
                                <span className="opacity-50 group-hover:opacity-90 transition-opacity duration-300">
                                    {item.icon}
                                </span>
                                <span className="font-mono text-[13px] tracking-[0.06em] opacity-50 group-hover:opacity-90 transition-opacity duration-300">
                                    {item.label}
                                </span>
                            </a>
                        ))}
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

                    <p className="font-mono text-[12px] tracking-[0.08em] opacity-35 leading-relaxed hidden md:block">
                        {t("tagline")}
                    </p>
                    <p className="font-mono text-[12px] opacity-35 md:hidden">
                        © {new Date().getFullYear()} Teacher Bek
                    </p>

                    <button
                        type="button"
                        onMouseEnter={() => playSound("hover")}
                        onClick={() => { playSound("click"); scrollToTop(); }}
                        aria-label={t("backToTop")}
                        className="group flex items-center gap-2.5 font-mono text-[12px] uppercase tracking-[0.2em] opacity-30 hover:opacity-70 transition-opacity duration-300 text-background"
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
                            className="font-mono text-[12px] uppercase tracking-[0.1em] opacity-35 hover:opacity-65 transition-opacity duration-300 text-background no-underline"
                        >
                            {t("privacy")}
                        </Link>
                        <Link
                            href={`/${locale}/terms`}
                            className="font-mono text-[12px] uppercase tracking-[0.1em] opacity-35 hover:opacity-65 transition-opacity duration-300 text-background no-underline"
                        >
                            {t("terms")}
                        </Link>
                    </div>

                </div>
            </div>
        </footer>
    );
}
