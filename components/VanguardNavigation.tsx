"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { MuteToggle } from "./mute-toggle";
import { useAudio } from "./audio-provider";

export function VanguardNavigation() {
    const t = useTranslations("nav");
    const locale = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const { playSound } = useAudio();

    const switchLanguage = (newLocale: string) => {
        const segments = pathname.split('/');
        segments[1] = newLocale;
        router.push(segments.join('/'));
    };

    const menuItems = [
        { href: `/${locale}/about`, label: t("about") },
        { href: `/${locale}/services`, label: t("services") },
        { href: `/${locale}/blog`, label: t("blog_link") },
        { href: `/${locale}/faq`, label: t("faq") },
        { href: `/${locale}#contact`, label: t("contact") },
    ];

    return (
        <>
            <nav className="fixed top-0 w-full z-50 px-8 py-8 flex justify-between items-center mix-blend-difference text-white">
                {/* Logo - Vance Style */}
                <a
                    href={`/${locale}`}
                    className="text-2xl md:text-3xl font-bold tracking-tighter uppercase pointer-events-auto"
                >
                    BEK VANGUARD®
                </a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-12 pointer-events-auto">
                    {menuItems.map((item) => (
                        <a
                            key={item.href}
                            href={item.href}
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => playSound('click')}
                            className="text-[var(--text-xs)] uppercase tracking-widest hover:text-gray-400 transition-colors"
                        >
                            {item.label}
                        </a>
                    ))}

                    <div className="flex items-center gap-4 ml-8">
                        {['en', 'vi', 'zh', 'ru'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => {
                                    playSound('click');
                                    switchLanguage(lang);
                                }}
                                onMouseEnter={() => playSound('hover')}
                                className={`text-[var(--text-xs)] tracking-widest uppercase transition-colors ${locale === lang ? "text-white" : "text-white/30 hover:text-white/60"}`}
                            >
                                {lang}
                            </button>
                        ))}
                        <div className="w-[1px] h-4 bg-white/20 mx-2" />
                        <div className="flex items-center gap-2">
                            <MuteToggle />
                            <ThemeToggle />
                        </div>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden pointer-events-auto"
                    onClick={() => setIsOpen(true)}
                >
                    <Menu size={24} />
                </button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-vanguard-bone dark:bg-vanguard-black flex flex-col p-8"
                    >
                        <div className="flex justify-between items-center">
                            <span className="font-display text-xl font-bold uppercase tracking-tighter">BEK</span>
                            <button onClick={() => setIsOpen(false)} className="text-foreground">
                                <X size={32} />
                            </button>
                        </div>

                        <div className="mt-24 flex flex-col gap-8">
                            {menuItems.map((item, i) => (
                                <motion.a
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className="font-display text-5xl uppercase tracking-tightest hover:italic transition-all"
                                >
                                    {item.label}
                                </motion.a>
                            ))}
                        </div>

                        <div className="mt-auto pt-8 border-t border-foreground/10 flex flex-wrap gap-8">
                            <ThemeToggle />
                            {['en', 'vi', 'zh', 'ru'].map((lang) => (
                                <button
                                    key={lang}
                                    onClick={() => switchLanguage(lang)}
                                    className={`text-sm uppercase tracking-widest ${locale === lang ? "text-primary underline underline-offset-8" : "text-foreground/30"}`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
