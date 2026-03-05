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

/* ── Inline brand icons — all monochrome (currentColor) ── */
const IcWhatsApp  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>;
const IcMail      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
const IcLinkedIn  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7H10V9h4v1.765C14.396 9.387 15.232 9 16 9zm-12 1H0v13h4V9zM2 6.5A2 2 0 1 1 2 2.5a2 2 0 0 1 0 4z"/></svg>;
const IcInstagram = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>;
const IcFacebook  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const IcTikTok    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77-.39 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-6.13 6.33 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.83a8.28 8.28 0 0 0 4.83 1.55V6.9a4.85 4.85 0 0 1-1.06-.21z"/></svg>;

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

    const navLinks = [
        { href: `/${locale}#about`,    label: navT("about")     },
        { href: `/${locale}#programs`, label: navT("services")  },
        { href: `/${locale}/blog`,     label: navT("blog_link") },
        { href: `/${locale}#faq`,      label: navT("faq")       },
        { href: `/${locale}#contact`,  label: navT("contact")   },
    ];

    const channelLinks = [
        { href: "https://zalo.me/84353885757",                 label: t("telegram"), icon: "zalo"     },
        { href: "https://wa.me/84353885757",                   label: t("whatsapp"), icon: "whatsapp" },
        { href: "mailto:hello@teacherbek.com",                 label: t("email"),    icon: "email"    },
        { href: "https://www.linkedin.com/in/bek-boymirzaev/", label: t("linkedin"), icon: "linkedin" },
    ];

    const socialLinks = [
        { href: "https://www.instagram.com/itsteacherbek", label: t("instagram"), icon: "instagram" },
        { href: "https://www.facebook.com/teacherbek",     label: t("facebook"),  icon: "facebook"  },
        { href: "https://www.tiktok.com/@itsteacherbek",   label: t("tiktok"),    icon: "tiktok"    },
    ];

    function renderIcon(name: string) {
        if (name === "zalo") return (
            // eslint-disable-next-line @next/next/no-img-element
            <img src="/assets/icons/zalo.svg" width={14} height={14} alt="" aria-hidden="true"
                style={{ display: "block", filter: "brightness(0) invert(1)" }} />
        );
        if (name === "whatsapp")  return <IcWhatsApp />;
        if (name === "email")     return <IcMail />;
        if (name === "linkedin")  return <IcLinkedIn />;
        if (name === "instagram") return <IcInstagram />;
        if (name === "facebook")  return <IcFacebook />;
        if (name === "tiktok")    return <IcTikTok />;
        return null;
    }

    return (
        <footer ref={footerRef} className="bg-foreground text-background" style={{ textDecoration: "none" }}>

            {/* ── CTA + email ───────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 pt-14 pb-10 border-b border-background/10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 max-w-[1920px] mx-auto">
                    <h2 className="font-display font-bold uppercase leading-[0.9]"
                        style={{ fontSize: "clamp(1.6rem, 4vw, 3.5rem)", letterSpacing: "-0.04em" }}>
                        {t("ctaHeading")}
                    </h2>
                    <a href="mailto:hello@teacherbek.com"
                        onMouseEnter={() => playSound("hover")}
                        onClick={() => playSound("click")}
                        style={{ textDecoration: "none" }}
                        className="group shrink-0 flex items-center gap-2 text-background/70 hover:text-background transition-colors duration-300">
                        <span className="font-mono text-[13px] tracking-[0.04em]">hello@teacherbek.com</span>
                        <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" aria-hidden="true" />
                    </a>
                </div>
            </div>

            {/* ── 3-column links ────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-10 border-b border-background/10">
                <div ref={linksRef} className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-[1920px] mx-auto">

                    {/* Col 1 — Navigation */}
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">{t("quickLinks")}</p>
                        <nav aria-label="Footer navigation" className="flex flex-col">
                            {navLinks.map((item) => (
                                <Link key={item.href} href={item.href}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    style={{ textDecoration: "none" }}
                                    className="group flex items-center justify-between py-1.5 text-background border-b border-background/[0.06] last:border-0">
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
                            {channelLinks.map((item) => (
                                <a key={item.href} href={item.href}
                                    target={item.href.startsWith("http") ? "_blank" : undefined}
                                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    style={{ textDecoration: "none" }}
                                    className="group flex items-center gap-2.5 py-1.5 text-background border-b border-background/[0.06] last:border-0">
                                    <span className="shrink-0 opacity-40 group-hover:opacity-80 transition-opacity duration-200">
                                        {renderIcon(item.icon)}
                                    </span>
                                    <span className="font-mono text-[13px] opacity-55 group-hover:opacity-90 transition-opacity duration-200">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Follow + info */}
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">Follow</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {socialLinks.map((item) => (
                                <a key={item.href} href={item.href}
                                    target="_blank" rel="noopener noreferrer"
                                    onMouseEnter={() => playSound("hover")}
                                    onClick={() => playSound("click")}
                                    style={{ textDecoration: "none" }}
                                    className="group inline-flex items-center gap-2 px-3 py-2 border border-background/15 hover:border-background/45 transition-colors duration-200">
                                    <span className="opacity-50 group-hover:opacity-90 transition-opacity duration-200">
                                        {renderIcon(item.icon)}
                                    </span>
                                    <span className="font-mono text-[12px] opacity-55 group-hover:opacity-90 transition-opacity duration-200">{item.label}</span>
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-mono text-[12px] opacity-40">{inquiryT("weekdays")} · 19:30–21:00</p>
                            <p className="font-mono text-[12px] opacity-40">{inquiryT("weekends")} · 14:00–20:00</p>
                            <p className="font-mono text-[12px] opacity-25 mt-1">{t("location")}, {t("city")}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom bar ────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3 max-w-[1920px] mx-auto">
                    <p className="font-mono text-[11px] opacity-25 tracking-[0.06em]">
                        © {new Date().getFullYear()} Teacher Bek · {t("tagline").split(".")[0]}
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href={`/${locale}/privacy`} style={{ textDecoration: "none" }}
                            className="font-mono text-[11px] opacity-25 hover:opacity-55 transition-opacity duration-200 text-background">
                            {t("privacy")}
                        </Link>
                        <Link href={`/${locale}/terms`} style={{ textDecoration: "none" }}
                            className="font-mono text-[11px] opacity-25 hover:opacity-55 transition-opacity duration-200 text-background">
                            {t("terms")}
                        </Link>
                        <button type="button"
                            onMouseEnter={() => playSound("hover")}
                            onClick={() => { playSound("click"); scrollToTop(); }}
                            aria-label={t("backToTop")}
                            className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] opacity-25 hover:opacity-65 transition-opacity duration-200 text-background">
                            {t("backToTop")}
                            <svg width="9" height="9" viewBox="0 0 10 10" fill="none" aria-hidden="true"
                                className="group-hover:-translate-y-px transition-transform duration-200">
                                <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
