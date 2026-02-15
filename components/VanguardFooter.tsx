"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ArrowUp } from "lucide-react";
import { useAudio } from "./audio-provider";

export function VanguardFooter() {
    const t = useTranslations("footer");
    const locale = useLocale();
    const { playSound } = useAudio();

    return (
        <footer className="bg-black text-[#f4f4f0] pt-24 pb-12 px-4 md:px-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-[1600px] mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <div>
                        <h2 className="text-[var(--text-xl)] md:text-[var(--text-display-lg)] tracking-tighter mb-8 font-display leading-[0.9]">
                            Let's shape the<br /><span className="text-white/20 italic font-light">future.</span>
                        </h2>
                        <p className="text-[var(--text-base)] text-white/40 max-w-sm leading-relaxed mb-12 font-sans font-light">
                            Currently accepting select students for the 2024 academic cycle. Reach out to schedule a consultation regarding your linguistic trajectory.
                        </p>
                        <a
                            href="mailto:bek@teacher.edu"
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => playSound('click')}
                            className="inline-flex items-center gap-4 text-[var(--text-lg)] md:text-[var(--text-xl)] border-b border-white/20 pb-2 hover:border-white transition-all duration-500"
                        >
                            bek@teacher.edu
                            <ArrowRight size={20} />
                        </a>
                    </div>

                    <div className="grid grid-cols-2 gap-8 lg:pl-20">
                        <div className="flex flex-col space-y-4">
                            <span className="text-[var(--text-xs)] font-bold uppercase tracking-widest text-white/20 mb-4">Structure</span>
                            <a href={`/${locale}/about`} onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="text-[var(--text-xs)] text-white/40 hover:text-white transition-colors">Philosophy</a>
                            <a href="#lexicon" onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="text-[var(--text-xs)] text-white/40 hover:text-white transition-colors">Frameworks</a>
                            <a href="#journal" onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="text-[var(--text-xs)] text-white/40 hover:text-white transition-colors">Journal</a>
                            <a href="#contact" onMouseEnter={() => playSound('hover')} onClick={() => playSound('click')} className="text-[var(--text-xs)] text-white/40 hover:text-white transition-colors">Inquiry</a>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <span className="text-[var(--text-xs)] font-bold uppercase tracking-widest text-white/20 mb-4">Socials</span>
                            {['LinkedIn', 'Instagram', 'Zalo'].map((item) => (
                                <a key={item} href="#" className="text-[var(--text-xs)] text-white/40 hover:text-white transition-colors">{item}</a>
                            ))}
                        </div>
                        <div className="col-span-2 mt-8">
                            <span className="text-[var(--text-xs)] font-bold uppercase tracking-widest text-white/20 mb-4 block">Headquarters</span>
                            <p className="text-white/40 text-[var(--text-xs)] leading-relaxed">
                                District 1, Ho Chi Minh City<br />
                                Vietnam, UTC+7
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end border-t border-white/5 pt-12">
                    <div className="mb-4 md:mb-0 flex items-center gap-12">
                        <h1 className="text-[8vw] md:text-[6vw] leading-none font-bold tracking-tighter text-white opacity-[0.05] select-none pointer-events-none uppercase">
                            BEK VANGUARD®
                        </h1>
                        <button
                            onMouseEnter={() => playSound('hover')}
                            onClick={() => {
                                playSound('click');
                                window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 group"
                        >
                            <ArrowUp size={18} className="group-hover:translate-y-[-2px] transition-transform" />
                        </button>
                    </div>
                    <div className="flex gap-8 text-[var(--text-xs)] text-white/30 uppercase tracking-widest font-bold">
                        <span>© {new Date().getFullYear()} Vanguard Mastery</span>
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
