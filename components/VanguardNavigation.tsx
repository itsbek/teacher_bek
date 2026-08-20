"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAppStore, type FontSize } from "@/lib/store";
import { useAudio } from "./audio-provider";
import { Volume2, VolumeX } from "lucide-react";
import { trackLanguageSwitch } from "@/lib/analytics";

const LANGUAGES = [
    { code: "en", label: "EN", name: "English" },
    { code: "vi", label: "VI", name: "Tiếng Việt" },
    { code: "zh", label: "ZH", name: "中文" },
    { code: "ru", label: "RU", name: "Русский" },
] as const;

const FONT_SIZES: { size: FontSize; px: number; label: string }[] = [
    { size: "sm", px: 12, label: "A−" },
    { size: "md", px: 15, label: "A" },
    { size: "lg", px: 18, label: "A+" },
];

const SECTION_IDS = ["hero", "about", "testimonials", "programs", "methodology", "credentials", "reads", "faq", "contact"] as const;

export function VanguardNavigation() {
    const t       = useTranslations("nav");
    const tCommon = useTranslations("common");
    const locale = useLocale();
    const pathname = usePathname();
    const { fontSize, setFontSize } = useAppStore();

    const { isMuted, toggleMute } = useAudio();

    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>("");
    const [langOpen, setLangOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
    const langBtnRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isHomepage = pathname === `/${locale}` || pathname === `/${locale}/`;

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // Scroll spy
    useEffect(() => {
        if (!isHomepage) return;
        const observers: IntersectionObserver[] = [];

        SECTION_IDS.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;
            const observer = new IntersectionObserver(
                ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
                { rootMargin: "-40% 0px -55% 0px" }
            );
            observer.observe(el);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [isHomepage]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    const localizedPath = (newLocale: string) =>
        pathname.replace(/^\/(en|vi|zh|ru)(?=\/|$)/, `/${newLocale}`) || `/${newLocale}`;

    const handleAnchorClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        const hash = href.split("#")[1];
        if (!hash) return;
        if (isHomepage) {
            e.preventDefault();
            const target = document.getElementById(hash);
            if (!target) return;
            const lenis = (window as Window & { __lenis?: { scrollTo: (el: HTMLElement, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
            if (lenis) {
                lenis.scrollTo(target, { offset: -60, duration: 1.0 });
            } else {
                target.scrollIntoView({ behavior: "smooth" });
            }
        }
        setIsOpen(false);
    }, [isHomepage]);

    const openLang = useCallback(() => {
        if (langBtnRef.current) {
            const rect = langBtnRef.current.getBoundingClientRect();
            setDropdownPos({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right,
            });
        }
        setLangOpen((v) => !v);
    }, []);

    // Close lang dropdown on outside click
    useEffect(() => {
        if (!langOpen) return;
        const close = (e: MouseEvent) => {
            const insideBtn = langBtnRef.current?.contains(e.target as Node);
            const insidePanel = dropdownRef.current?.contains(e.target as Node);
            if (!insideBtn && !insidePanel) {
                setLangOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, [langOpen]);

    const menuItems = [
        { href: `/${locale}#about`, label: t("about"), section: "about" },
        { href: `/${locale}#testimonials`, label: t("testimonials"), section: "testimonials" },
        { href: `/${locale}#programs`, label: t("services"), section: "programs" },
        { href: `/${locale}/community`, label: t("community"), section: "" },
        { href: `/${locale}/blog`, label: t("blog_link"), section: "" },
        { href: `/${locale}#faq`, label: t("faq"), section: "faq" },
        { href: `/${locale}#contact`, label: t("contact"), section: "contact" },
    ];

    const isActive = (item: typeof menuItems[number]) => {
        if (item.section) {
            // Anchor-based nav items are only active on the homepage
            return isHomepage && activeSection === item.section;
        }
        const [path] = item.href.split("#");
        if (!path) return false;
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const currentLang = LANGUAGES.find((l) => l.code === locale);

    return (
        <>
            {/* ── Fixed Header — mix-blend-mode: difference makes it always visible ── */}
            <nav
                aria-label="Main navigation"
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    pointerEvents: "none",
                    backdropFilter: "blur(16px) saturate(180%)",
                    WebkitBackdropFilter: "blur(16px) saturate(180%)",
                    background: scrolled
                        ? "hsl(var(--background) / 0.92)"
                        : "hsl(var(--background) / 0.75)",
                    borderBottom: scrolled
                        ? "1px solid hsl(var(--foreground) / 0.08)"
                        : "1px solid transparent",
                    transition: "background 0.3s ease, border-color 0.3s ease",
                    color: "hsl(var(--foreground))",
                }}
                className="px-6 md:px-10 lg:px-16 py-5 flex justify-between items-center"
            >
                {/* Logo */}
                <Link
                    href={`/${locale}`}
                    aria-label="Go to homepage"
                    style={{ pointerEvents: "auto", color: "inherit" }}
                    className="font-display font-bold text-xl md:text-2xl uppercase tracking-[-0.04em] leading-none hover:opacity-70 transition-opacity duration-300"
                >
                    {tCommon("siteName")}
                </Link>

                {/* Desktop Nav + Utilities — all in one row, no overlap */}
                <div
                    className="hidden lg:flex items-center gap-6"
                    style={{ pointerEvents: "auto", color: "inherit" }}
                >
                    {/* Nav links */}
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={(e) => handleAnchorClick(e, item.href)}
                            style={{ color: "inherit" }}
                            className={`link-line font-sans text-[13px] uppercase tracking-[0.18em] font-light transition-opacity duration-300 ${isActive(item) ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    {/* Divider */}
                    <span style={{ width: 1, height: 14, background: "currentColor", opacity: 0.2, display: "block", flexShrink: 0 }} aria-hidden="true" />

                    {/* Font size — A− A A+ */}
                    <div className="flex items-center" role="group" aria-label="Font size">
                        {FONT_SIZES.map(({ size, px, label }) => (
                            <button
                                key={size}
                                onClick={() => setFontSize(size)}
                                aria-pressed={fontSize === size}
                                aria-label={`Font size ${size}`}
                                style={{
                                    fontFamily: "var(--font-display)",
                                    fontSize: px,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    padding: "8px 8px",
                                    opacity: fontSize === size ? 1 : 0.3,
                                    transition: "opacity 0.2s",
                                    letterSpacing: "-0.02em",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "inherit",
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Divider */}
                    <span style={{ width: 1, height: 14, background: "currentColor", opacity: 0.2, display: "block", flexShrink: 0 }} aria-hidden="true" />

                    {/* Language dropdown trigger */}
                    <button
                        ref={langBtnRef}
                        onClick={openLang}
                        aria-expanded={langOpen}
                        aria-haspopup="listbox"
                        aria-label={`Language: ${currentLang?.name ?? locale.toUpperCase()}`}
                        style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: 13,
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            opacity: 0.7,
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "inherit",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
                    >
                        {currentLang?.label ?? locale.toUpperCase()}
                        <span
                            style={{
                                display: "inline-block",
                                fontSize: 8,
                                transition: "transform 0.2s",
                                transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
                            }}
                            aria-hidden="true"
                        >
                            ▾
                        </span>
                    </button>

                    {/* Divider */}
                    <span style={{ width: 1, height: 14, background: "currentColor", opacity: 0.2, display: "block", flexShrink: 0 }} aria-hidden="true" />

                    {/* Theme toggle */}
                    <ThemeToggle />

                    {/* Mute toggle */}
                    <button
                        onClick={toggleMute}
                        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                        aria-pressed={isMuted}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "inherit",
                            opacity: isMuted ? 0.35 : 0.7,
                            display: "flex",
                            alignItems: "center",
                            padding: "4px",
                            transition: "opacity 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = isMuted ? "0.35" : "0.7")}
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                </div>

                {/* Mobile controls */}
                <div className="lg:hidden flex items-center gap-4" style={{ pointerEvents: "auto", color: "inherit" }}>
                    {/* Hamburger */}
                    <button
                        type="button"
                        aria-label={isOpen ? "Close menu" : "Open menu"}
                        aria-expanded={isOpen}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex flex-col items-end gap-[5px] w-8 h-8 justify-center"
                        style={{ color: "inherit" }}
                    >
                        <span className={`h-[1px] bg-current transition-all duration-500 ${isOpen ? "w-6 rotate-45 translate-y-[3px]" : "w-7"}`} />
                        <span className={`h-[1px] bg-current transition-all duration-500 ${isOpen ? "w-6 -rotate-45 -translate-y-[3px]" : "w-5"}`} />
                    </button>
                </div>
            </nav>

            {/* ── Language dropdown — portal escapes blend-mode compositing ── */}
            {langOpen && mounted && createPortal(
                <div
                    ref={dropdownRef}
                    role="listbox"
                    aria-label="Select language"
                    style={{
                        position: "fixed",
                        top: dropdownPos.top,
                        right: dropdownPos.right,
                        zIndex: 10002,
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--foreground) / 0.12)",
                        minWidth: 160,
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    }}
                >
                    {LANGUAGES.map((lang) => (
                        <Link
                            key={lang.code}
                            href={localizedPath(lang.code)}
                            role="option"
                            aria-selected={locale === lang.code}
                            onClick={() => { setLangOpen(false); if (lang.code !== locale) trackLanguageSwitch(locale, lang.code); }}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 16px",
                                fontFamily: "var(--font-sans)",
                                fontSize: 13,
                                textDecoration: "none",
                                color: "hsl(var(--foreground))",
                                opacity: locale === lang.code ? 1 : 0.55,
                                fontWeight: locale === lang.code ? 600 : 400,
                                borderBottom: "1px solid hsl(var(--foreground) / 0.06)",
                                transition: "opacity 0.15s, background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.opacity = "1";
                                (e.currentTarget as HTMLElement).style.background = "hsl(var(--foreground) / 0.04)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.opacity = locale === lang.code ? "1" : "0.55";
                                (e.currentTarget as HTMLElement).style.background = "transparent";
                            }}
                        >
                            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11 }}>
                                {lang.label}
                            </span>
                            <span style={{ opacity: 0.7 }}>{lang.name}</span>
                            {locale === lang.code && (
                                <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 10 }}>✓</span>
                            )}
                        </Link>
                    ))}
                </div>,
                document.body
            )}

            {/* ── Full-screen mobile menu ── */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                        exit={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
                        transition={{ duration: 0.7, ease: [0.11, 0.82, 0.39, 0.92] }}
                        className="fixed inset-0 z-[9999] bg-foreground text-background flex flex-col overflow-hidden"
                        role="dialog"
                        aria-label="Navigation menu"
                        aria-modal="true"
                    >
                        {/* Noise overlay */}
                        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
                        />

                        {/* Close button */}
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => setIsOpen(false)}
                            className="absolute top-5 right-6 z-10 flex flex-col items-end gap-[5px] w-8 h-8 justify-center"
                        >
                            <span className="h-[1px] w-6 bg-current rotate-45 translate-y-[3px]" />
                            <span className="h-[1px] w-6 bg-current -rotate-45 -translate-y-[3px]" />
                        </button>

                        <div className="flex flex-col justify-between h-full px-8 pt-24 pb-12 relative z-10">
                            {/* Nav items */}
                            <nav className="flex flex-col gap-0">
                                {menuItems.map((item, i) => (
                                    <motion.div
                                        key={item.href}
                                        initial={{ opacity: 0, x: -30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + i * 0.07, duration: 0.6, ease: [0.11, 0.82, 0.39, 0.92] }}
                                        className="border-b border-current/10"
                                    >
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleAnchorClick(e, item.href)}
                                            className="font-display font-bold text-[clamp(2.5rem,12vw,5rem)] uppercase tracking-[-0.04em] leading-[1.05] hover:opacity-60 transition-opacity duration-300 block py-2 text-background"
                                        >
                                            {item.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Bottom: font size + language + theme + copyright */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.55, duration: 0.5 }}
                                className="flex items-center justify-between pt-8 border-t border-current/15"
                            >
                                {/* Font size controls */}
                                <div className="flex items-center gap-1" role="group" aria-label="Font size">
                                    {FONT_SIZES.map(({ size, px, label }) => (
                                        <button
                                            key={size}
                                            onClick={() => setFontSize(size)}
                                            aria-pressed={fontSize === size}
                                            style={{
                                                fontFamily: "var(--font-display)",
                                                fontSize: px,
                                                fontWeight: 700,
                                                padding: "8px 8px",
                                                opacity: fontSize === size ? 1 : 0.3,
                                                transition: "opacity 0.2s",
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                color: "hsl(var(--background))",
                                            }}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Language links */}
                                <div className="flex items-center gap-3">
                                    {LANGUAGES.map((lang) => (
                                        <Link
                                            key={lang.code}
                                            href={localizedPath(lang.code)}
                                            aria-current={locale === lang.code ? "true" : undefined}
                                            onClick={() => setIsOpen(false)}
                                            className={`font-sans text-[13px] uppercase tracking-[0.14em] transition-opacity duration-300 ${locale === lang.code ? "opacity-100 text-background" : "opacity-35 text-background hover:opacity-70"}`}
                                        >
                                            {lang.label}
                                        </Link>
                                    ))}
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={toggleMute}
                                        aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
                                        aria-pressed={isMuted}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            cursor: "pointer",
                                            color: "hsl(var(--background))",
                                            opacity: isMuted ? 0.3 : 0.6,
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "4px",
                                        }}
                                    >
                                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                                    </button>
                                    <ThemeToggle />
                                    <p className="font-sans text-[12px] uppercase tracking-[0.15em] opacity-20 text-background">
                                        © 2025
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
