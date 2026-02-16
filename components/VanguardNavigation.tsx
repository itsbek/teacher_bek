"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MuteToggle } from "./mute-toggle";

const LANGUAGES = ["en", "vi", "zh", "ru"] as const;

export function VanguardNavigation() {
    const t = useTranslations("nav");
    const locale = useLocale();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const localizedPath = (newLocale: string) =>
        pathname.replace(/^\/(en|vi|zh|ru)(?=\/|$)/, `/${newLocale}`) || `/${newLocale}`;

    const menuItems = [
        { href: `/${locale}/about`, label: t("about") },
        { href: `/${locale}/services`, label: t("services") },
        { href: `/${locale}/blog`, label: t("blog_link") },
        { href: `/${locale}/faq`, label: t("faq") },
        { href: `/${locale}#contact`, label: t("contact") },
    ];

    const isMenuItemActive = (href: string) => {
        const [path] = href.split("#");
        if (!path) return false;
        if (path === `/${locale}`) return pathname === `/${locale}`;
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-[10000] px-6 md:px-8 py-5 flex justify-between items-center bg-background/85 backdrop-blur-md border-b border-foreground/10 text-foreground pointer-events-auto">
                {/* Logo - Vance Style */}
                <Link
                    href={`/${locale}`}
                    aria-label="Go to homepage"
                    className="text-2xl md:text-3xl font-bold tracking-tighter uppercase pointer-events-auto"
                >
                    BEK VANGUARD®
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10 pointer-events-auto relative z-[10010]">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-[var(--text-xs)] uppercase tracking-widest transition-colors ${isMenuItemActive(item.href) ? "text-foreground border-b border-foreground/40 pb-1" : "text-foreground/75 hover:text-foreground"}`}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="flex items-center gap-3 ml-4">
                        <div className="flex items-center gap-1 rounded-full border border-foreground/15 bg-background/70 px-1 py-1">
                        {LANGUAGES.map((lang) => (
                            <Link
                                key={lang}
                                href={localizedPath(lang)}
                                aria-label={`Switch language to ${lang.toUpperCase()}`}
                                aria-current={locale === lang ? "true" : undefined}
                                className={`rounded-full px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase transition-colors ${locale === lang ? "bg-foreground text-background" : "text-foreground/60 hover:text-foreground"}`}
                            >
                                {lang}
                            </Link>
                        ))}
                        </div>
                        <div className="flex items-center gap-2">
                            <MuteToggle />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden pointer-events-auto flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        onClick={() => setIsOpen(true)}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-foreground/20 bg-background/80"
                    >
                        <Menu size={20} />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-background text-foreground flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-display text-xl font-bold uppercase tracking-tighter">BEK</span>
                            <button onClick={() => setIsOpen(false)} aria-label="Close navigation menu" className="text-foreground">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="mt-24 flex flex-col gap-8">
                            {menuItems.map((item, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    key={item.href}
                                    className="font-display text-5xl uppercase tracking-tightest hover:italic transition-all"
                                >
                                    <Link href={item.href} onClick={() => setIsOpen(false)}>
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-auto pt-8 border-t border-foreground/10 space-y-6">
                            <div className="flex items-center gap-2">
                                <MuteToggle />
                                <ThemeToggle />
                            </div>
                            <div className="flex flex-wrap gap-2">
                            {LANGUAGES.map((lang) => (
                                <Link
                                    key={lang}
                                    href={localizedPath(lang)}
                                    aria-current={locale === lang ? "true" : undefined}
                                    aria-label={`Switch language to ${lang.toUpperCase()}`}
                                    onClick={() => setIsOpen(false)}
                                    className={`rounded-full border px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${locale === lang ? "border-foreground bg-foreground text-background" : "border-foreground/20 text-foreground/60"}`}
                                >
                                    {lang}
                                </Link>
                            ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
