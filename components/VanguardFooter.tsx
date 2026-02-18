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
        <footer className="bg-background text-foreground pt-16 pb-8 px-4 md:px-10 relative overflow-hidden border-t border-foreground/10">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    <div>
                        <h2 className="type-title-md mb-6">
                            Ready to speak English with<br /><span className="text-foreground/25 italic font-light">more confidence?</span>
                        </h2>
                        <p className="type-body text-foreground/60 max-w-sm mb-8">
                            Currently accepting a limited number of new students. Reach out to discuss your goal and available schedule.
                        </p>
                        <a
                            href="mailto:hello@teacherbek.com"
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => playSound('click')}
                            className="inline-flex items-center gap-4 type-body-lg border-b border-foreground/25 pb-2 hover:border-foreground transition-all duration-500"
                        >
                            hello@teacherbek.com
                            <ArrowRight size={20} />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 lg:pl-8">
                        <div className="flex flex-col space-y-4">
                            <span className="type-label text-foreground/35 mb-4">{t("quickLinks")}</span>
                            <Link href={`/${locale}/about`} onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="type-meta text-foreground/65 hover:text-foreground transition-colors">{navT("about")}</Link>
                            <Link href={`/${locale}/services`} onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="type-meta text-foreground/65 hover:text-foreground transition-colors">{navT("services")}</Link>
                            <Link href={`/${locale}#journal`} onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="type-meta text-foreground/65 hover:text-foreground transition-colors">Journal</Link>
                            <Link href={`/${locale}#contact`} onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="type-meta text-foreground/65 hover:text-foreground transition-colors">{navT("contact")}</Link>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <span className="type-label text-foreground/35 mb-4">Channels</span>
                            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="type-meta text-foreground/65 hover:text-foreground transition-colors">LinkedIn</a>
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="type-meta text-foreground/65 hover:text-foreground transition-colors">Instagram</a>
                            <a href="https://zalo.me/0123456789" target="_blank" rel="noopener noreferrer" className="type-meta text-foreground/65 hover:text-foreground transition-colors">Zalo</a>
                        </div>
                        <div className="col-span-2 mt-4">
                            <span className="type-label text-foreground/35 mb-4 block">Location</span>
                            <p className="type-meta text-foreground/65 leading-relaxed">
                                Golden Mansion, Phu Nhuan<br />
                                Ho Chi Minh City, Vietnam
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end border-t border-foreground/10 pt-8">
                    <div className="mb-4 md:mb-0 flex items-center gap-8">
                        <span className="text-[7vw] md:text-[4.6vw] leading-none font-bold tracking-tighter text-foreground opacity-[0.06] select-none pointer-events-none uppercase">
                            Teacher Bek
                        </span>
                        <button
                            type="button"
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => {
                                playSound('click');
                                scrollToTop();
                            }}
                            aria-label="Back to top"
                            className="w-12 h-12 rounded-full border border-foreground/20 flex items-center justify-center hover:bg-foreground hover:text-background transition-all duration-500 group"
                        >
                            <ArrowUp size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        </button>
                    </div>
                    <div className="flex gap-8 type-label-tight text-foreground/40">
                        <Link href={`/${locale}/privacy`} className="hover:text-foreground">{t("privacy")}</Link>
                        <Link href={`/${locale}/terms`} className="hover:text-foreground">{t("terms")}</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
