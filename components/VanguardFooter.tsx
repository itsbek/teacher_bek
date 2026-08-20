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
const IcZalo = () => (
    <svg width="14" height="14" viewBox="0 0 50 50" fill="none" aria-hidden="true">
        {/* outer rounded square → white */}
        <path fill="rgba(255,255,255,0.9)" fillRule="evenodd" clipRule="evenodd" d="M22.782 0.166016H27.199C33.2653 0.166016 36.8103 1.05701 39.9572 2.74421C43.1041 4.4314 45.5875 6.89585 47.2557 10.0428C48.9429 13.1897 49.8339 16.7347 49.8339 22.801V27.1991C49.8339 33.2654 48.9429 36.8104 47.2557 39.9573C45.5685 43.1042 43.1041 45.5877 39.9572 47.2559C36.8103 48.9431 33.2653 49.8341 27.199 49.8341H22.8009C16.7346 49.8341 13.1896 48.9431 10.0427 47.2559C6.89583 45.5687 4.41243 43.1042 2.7442 39.9573C1.057 36.8104 0.166016 33.2654 0.166016 27.1991V22.801C0.166016 16.7347 1.057 13.1897 2.7442 10.0428C4.43139 6.89585 6.89583 4.41245 10.0427 2.74421C13.1707 1.05701 16.7346 0.166016 22.782 0.166016Z"/>
        {/* inner screen area → dark so letters are visible */}
        <path fill="rgba(0,0,0,0.82)" fillRule="evenodd" clipRule="evenodd" d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"/>
        {/* ZALO letters → white */}
        <path fill="rgba(255,255,255,0.9)" d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17ZM32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947ZM25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317 21.0747 27.0478 23.1979 29.171 25.814 29.171 28.4301 29.171 30.5533 27.0478 30.5533 24.4317 30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317 23.0273 22.8962 24.2785 21.645 25.814 21.645 27.3495 21.645 28.6007 22.8962 28.6007 24.4317 28.6007 25.9672 27.3685 27.2184 25.814 27.2184ZM40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934 35.7095 27.0285 37.8516 29.1707 40.4867 29.1707 43.1217 29.1707 45.2639 27.0285 45.2639 24.3934 45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124 37.681 22.8579 38.9322 21.6067 40.4867 21.6067 42.0412 21.6067 43.2924 22.8579 43.2924 24.4124 43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"/>
        <path fill="rgba(255,255,255,0.9)" d="M29.4562 29.0944H30.5747V19.957H28.6221V28.2793C28.6221 28.7153 29.0012 29.0944 29.4562 29.0944Z"/>
    </svg>
);
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
    const tCommon       = useTranslations("common");
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
        { href: `/${locale}#about`,         label: navT("about")        },
        { href: `/${locale}#testimonials`,  label: navT("testimonials") },
        { href: `/${locale}#programs`,      label: navT("services")     },
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
        if (name === "zalo")      return <IcZalo />;
        if (name === "whatsapp")  return <IcWhatsApp />;
        if (name === "email")     return <IcMail />;
        if (name === "linkedin")  return <IcLinkedIn />;
        if (name === "instagram") return <IcInstagram />;
        if (name === "facebook")  return <IcFacebook />;
        if (name === "tiktok")    return <IcTikTok />;
        return null;
    }

    return (
        <footer ref={footerRef} className="light bg-foreground text-background" style={{ textDecoration: "none" }}>

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
                                    <span className="font-mono text-[13px] opacity-70 group-hover:opacity-95 transition-opacity duration-200">{item.label}</span>
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
                                    <span className="font-mono text-[13px] opacity-70 group-hover:opacity-95 transition-opacity duration-200">{item.label}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 3 — Follow + info */}
                    <div className="col-span-2 md:col-span-1">
                        <p className="font-mono text-[11px] uppercase tracking-[0.25em] opacity-35 mb-4">{t("follow")}</p>
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
                                    <span className="font-mono text-[12px] opacity-70 group-hover:opacity-95 transition-opacity duration-200">{item.label}</span>
                                </a>
                            ))}
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="font-mono text-[12px] opacity-40">{inquiryT("weekdays")} · {t("weekdayHours")}</p>
                            <p className="font-mono text-[12px] opacity-40">{inquiryT("weekends")} · {t("weekendHours")}</p>
                            <p className="font-mono text-[12px] opacity-25 mt-1">{t("location")}, {t("city")}</p>
                        </div>
                    </div>

                </div>
            </div>

            {/* ── Bottom bar ────────────────────────────────────────── */}
            <div className="px-6 md:px-10 lg:px-16 py-4">
                <div className="flex items-center justify-between flex-wrap gap-3 max-w-[1920px] mx-auto">
                    <p className="font-mono text-[11px] opacity-50 tracking-[0.06em]">
                        © {new Date().getFullYear()} {tCommon("siteName")} · {t("tagline").split(".")[0]}
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href={`/${locale}/privacy`} style={{ textDecoration: "none" }}
                            className="font-mono text-[11px] opacity-50 hover:opacity-75 transition-opacity duration-200 text-background">
                            {t("privacy")}
                        </Link>
                        <Link href={`/${locale}/terms`} style={{ textDecoration: "none" }}
                            className="font-mono text-[11px] opacity-50 hover:opacity-75 transition-opacity duration-200 text-background">
                            {t("terms")}
                        </Link>
                        <button type="button"
                            onMouseEnter={() => playSound("hover")}
                            onClick={() => { playSound("click"); scrollToTop(); }}
                            aria-label={t("backToTop")}
                            className="group flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.15em] opacity-50 hover:opacity-75 transition-opacity duration-200 text-background">
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
