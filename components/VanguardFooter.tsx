"use client";

import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUp } from "lucide-react";
import { useAudio } from "./audio-provider";

export function VanguardFooter() {
    const locale = useLocale();
    const t = useTranslations("footer");
    const navT = useTranslations("nav");
    const ctaT = useTranslations("cta");
    const { playSound } = useAudio();

    const scrollToTop = () => {
        const lenis = (window as Window & { __lenis?: { scrollTo: (to: number, opts?: { duration?: number }) => void } }).__lenis;
        if (lenis) {
            lenis.scrollTo(0, { duration: 1.1 });
            return;
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-foreground text-background relative overflow-hidden">

            {/* ─── CTA Section ─── */}
            <div className="px-6 md:px-12 lg:px-24 pt-20 pb-16 border-b border-background/10">
                <div className="max-w-[1920px] mx-auto">
                    <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10 lg:gap-16">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-5 mb-8">
                                <span className="w-10 h-[1px] bg-background/30 shrink-0" aria-hidden="true" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.22em] opacity-40">
                                    {t("contact")}
                                </span>
                            </div>
                            <h2
                                className="font-display font-bold leading-[0.9] tracking-tight mb-8"
                                style={{ fontSize: "clamp(2.2rem,5vw,4.5rem)" }}
                            >
                                {ctaT("title")}{" "}
                                <span className="italic opacity-30">{ctaT("subtitle").split(".")[0]}.</span>
                            </h2>
                        </div>
                        <a
                            href="mailto:hello@teacherbek.com"
                            onMouseEnter={() => playSound("hover")}
                            onClick={() => playSound("click")}
                            className="group inline-flex items-center gap-5 shrink-0 font-mono text-sm tracking-wide border-b border-background/25 pb-2 hover:border-background transition-colors duration-400"
                        >
                            hello@teacherbek.com
                            <ArrowRight
                                size={16}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </a>
                    </div>
                </div>
            </div>

            {/* ─── Links Grid ─── */}
            <div className="px-6 md:px-12 lg:px-24 py-16">
                <div className="max-w-[1920px] mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">

                        {/* Quick Links */}
                        <div className="flex flex-col gap-4">
                            <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-35 mb-1">
                                {t("quickLinks")}
                            </span>
                            <Link
                                href={`/${locale}/about`}
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => playSound("click")}
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {navT("about")}
                            </Link>
                            <Link
                                href={`/${locale}/services`}
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => playSound("click")}
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {navT("services")}
                            </Link>
                            <Link
                                href={`/${locale}/blog`}
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => playSound("click")}
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {navT("blog_link")}
                            </Link>
                            <Link
                                href={`/${locale}#contact`}
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => playSound("click")}
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {navT("contact")}
                            </Link>
                        </div>

                        {/* Channels */}
                        <div className="flex flex-col gap-4">
                            <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-35 mb-1">
                                {t("channels")}
                            </span>
                            <a
                                href="https://wa.me/84000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {t("whatsapp")}
                            </a>
                            <a
                                href="https://zalo.me/0000000000"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {t("telegram")}
                            </a>
                            <a
                                href="https://www.linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                LinkedIn
                            </a>
                            <a
                                href="mailto:hello@teacherbek.com"
                                className="font-mono text-sm opacity-55 hover:opacity-100 transition-opacity duration-300"
                            >
                                {t("email")}
                            </a>
                        </div>

                        {/* Qualifications */}
                        <div className="flex flex-col gap-4">
                            <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-35 mb-1">
                                {t("certifications")}
                            </span>
                            <span className="font-mono text-sm opacity-55">{t("tefl")}</span>
                            <span className="font-mono text-sm opacity-55">{t("tesol")}</span>
                            <span className="font-mono text-sm opacity-55">DELTA</span>
                            <span className="font-mono text-sm opacity-55">{t("experience")}</span>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-4">
                            <span className="font-mono text-[9px] uppercase tracking-[0.22em] opacity-35 mb-1">
                                Location
                            </span>
                            <p className="font-mono text-sm opacity-55 leading-relaxed">
                                {t("location")}<br />
                                Ho Chi Minh City
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* ─── Bottom Bar ─── */}
            <div className="px-6 md:px-12 lg:px-24 pb-8 border-t border-background/10">
                <div className="max-w-[1920px] mx-auto pt-8">
                    <div className="grid grid-cols-3 items-center">

                        {/* Left: tagline watermark */}
                        <p className="font-mono text-[9px] uppercase tracking-[0.12em] opacity-25 leading-relaxed hidden md:block">
                            {t("tagline")}
                        </p>
                        {/* Left mobile fallback */}
                        <p className="font-mono text-[9px] opacity-25 md:hidden">
                            © 2025
                        </p>

                        {/* Center: back to top */}
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onMouseEnter={() => playSound("hover")}
                                onClick={() => {
                                    playSound("click");
                                    scrollToTop();
                                }}
                                aria-label="Back to top"
                                className="w-11 h-11 border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-400 group"
                            >
                                <ArrowUp
                                    size={16}
                                    className="group-hover:-translate-y-0.5 transition-transform duration-300"
                                />
                            </button>
                        </div>

                        {/* Right: legal */}
                        <div className="flex justify-end gap-6 font-mono text-[9px] uppercase tracking-[0.1em] opacity-35">
                            <Link
                                href={`/${locale}/privacy`}
                                className="hover:opacity-100 transition-opacity duration-300"
                            >
                                {t("privacy")}
                            </Link>
                            <Link
                                href={`/${locale}/terms`}
                                className="hover:opacity-100 transition-opacity duration-300"
                            >
                                {t("terms")}
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

        </footer>
    );
}
