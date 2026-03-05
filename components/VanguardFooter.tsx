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
            const columns = linksRef.current?.children;
            if (columns?.length) {
                gsap.fromTo(Array.from(columns),
                    { y: 20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out",
                      scrollTrigger: { trigger: linksRef.current, start: "top 90%", once: true } }
                );
            }
        }, footerRef);
        return () => ctx.revert();
    }, []);

    return (
        <footer
            ref={footerRef}
            className="bg-foreground text-background"
        >
            {/* ── Top: CTA + email ──────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 pt-14 pb-10 border-b border-background/10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 max-w-[1920px] mx-auto">
                    <h2
                        className="font-display font-bold uppercase leading-[0.9]"
                        style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}
                    >
                        {t("ctaHeading")}
                    </h2>
                    <a
                        href="mailto:hello@teacherbek.com"
                        onMouseEnter={() => playSound("hover")}
                        onClick={() => playSound("click")}
                        className="group shrink-0 flex items-center gap-2 text-background/70 hover:text-background transition-colors duration-300"
                    >
                        <span className="font-mono text-[13px] tracking-[0.04em]">hello@teacherbek.com</span>
                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* ── Middle: 3-column links ────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-10 border-b border-background/10">
                <div ref={linksRef} className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-[1920px] mx-auto">

                    {/* Col 1 — Navigation */}
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">{t("quickLinks")}</p>
                        <nav aria-label="Footer navigation" className="flex flex-col">
                            {[
                                { href: `/${locale}#about`,    label: navT("about")    },
                                { href: `/${locale}#programs`, label: navT("services") },
                                { href: `/${locale}/blog`,     label: navT("blog_link")},
                                { href: `/${locale}#faq`,      label: navT("faq")      },
                                { href: `/${locale}#contact`,  label: navT("contact")  },
                            ].map((item) => (
                                <Link key={item.href} href={item.href}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group flex items-center justify-between py-1.5 text-background no-underline border-b border-background/[0.06] last:border-0"
                                >
                                    <span className="font-mono text-[13px] opacity-55 group-hover:opacity-90 transition-opacity duration-200">{item.label}</span>
                                    <ArrowUpRight size={9} className="opacity-0 group-hover:opacity-40 transition-opacity duration-200 shrink-0" aria-hidden="true" />
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Col 2 — Channels */}
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">{t("channels")}</p>
                        <div className="flex flex-col">
                            {[
                                { href: "https://zalo.me/84353885757",                 label: t("telegram"),  img: "/assets/icons/zalo.svg" },
                                { href: "https://wa.me/84353885757",                   label: t("whatsapp"),  img: null },
                                { href: "mailto:hello@teacherbek.com",                 label: t("email"),     img: null },
                                { href: "https://www.linkedin.com/in/bek-boymirzaev/", label: t("linkedin"),  img: null },
                            ].map((item) => (
                                <a key={item.href} href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group flex items-center gap-2.5 py-1.5 text-background no-underline border-b border-background/[0.06] last:border-0"
                                >
                                    {item.img ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.img} width={14} height={14} alt="" aria-hidden="true" className="shrink-0 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                                    ) : (
                                        <span className="w-[14px] shrink-0" aria-hidden="true" />
                                    )}
                                    <span className="font-mono text-[13px] opacity-55 group-hover:opacity-90 transition-opacity duration-200">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Social + Hours */}
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">Follow</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { href: "https://www.instagram.com/itsteacherbek", label: t("instagram") },
                                { href: "https://www.facebook.com/teacherbek",     label: t("facebook")  },
                                { href: "https://www.tiktok.com/@itsteacherbek",   label: t("tiktok")    },
                            ].map((item) => (
                                <a key={item.href} href={item.href}
                                    target="_blank" rel="noopener noreferrer"
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    className="group inline-flex items-center gap-1.5 px-3 py-1.5 border border-background/15 hover:border-background/40 transition-colors duration-200"
                                >
                                    <span className="font-mono text-[12px] opacity-55 group-hover:opacity-90 transition-opacity duration-200">{item.label}</span>
                                    <ArrowUpRight size={8} className="opacity-0 group-hover:opacity-40 transition-opacity duration-200" aria-hidden="true" />
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-mono text-[12px] opacity-45">{inquiryT("weekdays")} · 19:30–21:00</p>
                            <p className="font-mono text-[12px] opacity-45">{inquiryT("weekends")} · 14:00–20:00</p>
                            <p className="font-mono text-[12px] opacity-30 mt-1">{t("location")}, {t("city")}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom bar ────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3 max-w-[1920px] mx-auto">
                    <p className="font-mono text-[11px] opacity-30 tracking-[0.06em]">
                        © {new Date().getFullYear()} Teacher Bek · {t("tagline").split(".")[0]}
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href={`/${locale}/privacy`} className="font-mono text-[11px] opacity-30 hover:opacity-60 transition-opacity duration-200 text-background no-underline">{t("privacy")}</Link>
                        <Link href={`/${locale}/terms`}   className="font-mono text-[11px] opacity-30 hover:opacity-60 transition-opacity duration-200 text-background no-underline">{t("terms")}</Link>
                        <button
                            type="button"
                            onMouseEnter={() => playSound("hover")}
                            onClick={() => { playSound("click"); scrollToTop(); }}
                            aria-label={t("backToTop")}
                            className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] opacity-30 hover:opacity-70 transition-opacity duration-200 text-background"
                        >
                            {t("backToTop")}
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="group-hover:-translate-y-px transition-transform duration-200">
                                <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
