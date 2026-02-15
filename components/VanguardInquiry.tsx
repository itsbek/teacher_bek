"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useAudio } from "./audio-provider";
import { ArrowRight, MapPin, Clock, Send } from "lucide-react";

export function VanguardInquiry() {
    const t = useTranslations("footer"); // Reusing for context or adding new keys
    const locale = useLocale();
    const { playSound } = useAudio();
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        playSound('click');
        alert("Transmission sent. Expect response within one academic cycle.");
    };

    return (
        <section id="contact" className="bg-background text-foreground px-6 md:px-12 lg:px-24 relative overflow-hidden">
            <div className="max-w-[1920px] mx-auto">
                {/* Academic Header */}
                <div className="flex justify-between items-end mb-24 pb-8 border-b border-foreground/10">
                    <div>
                        <span className="text-[var(--text-xs)] font-mono opacity-20 block mb-2">SEC_04 / TRANSMISSION</span>
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-display tracking-tightest leading-none">
                            ENQUIRY <span className="italic font-light opacity-50 underline decoration-1 underline-offset-[10px]">PROTOCOL</span>
                        </h2>
                    </div>
                    <div className="hidden md:block text-right">
                        <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-20">Secure Channel // 256-BIT</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
                    {/* Form Side */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-12 group/form">
                            <div className={`relative border-b transition-colors duration-500 ${focusedField === 'name' ? 'border-foreground' : 'border-foreground/20 group-hover/form:border-foreground/40'}`}>
                                <label className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Full Name / Entity</label>
                                <input
                                    type="text"
                                    required
                                    onFocus={() => { setFocusedField('name'); playSound('hover'); }}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="LELAND STAMFORD JR."
                                    className="w-full bg-transparent border-none py-6 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-5"
                                />
                            </div>

                            <div className={`relative border-b transition-colors duration-500 ${focusedField === 'email' ? 'border-foreground' : 'border-foreground/20 group-hover/form:border-foreground/40'}`}>
                                <label className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Electronic Mail</label>
                                <input
                                    type="email"
                                    required
                                    onFocus={() => { setFocusedField('email'); playSound('hover'); }}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="ENCRYPTED@STAMFORD.EDU"
                                    className="w-full bg-transparent border-none py-6 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-5"
                                />
                            </div>

                            <div className={`relative border-b transition-colors duration-500 ${focusedField === 'message' ? 'border-foreground' : 'border-foreground/20 group-hover/form:border-foreground/40'}`}>
                                <label className="block text-[var(--text-xs)] uppercase tracking-[0.2em] font-bold mb-4 opacity-40">Objective / Scope</label>
                                <textarea
                                    required
                                    rows={1}
                                    onFocus={() => { setFocusedField('message'); playSound('hover'); }}
                                    onBlur={() => setFocusedField(null)}
                                    placeholder="DESCRIBE YOUR SYNTACTIC NEEDS"
                                    className="w-full bg-transparent border-none py-6 font-display text-3xl md:text-5xl uppercase tracking-tighter outline-none placeholder:opacity-5 resize-none min-h-[120px]"
                                />
                            </div>

                            <button
                                type="submit"
                                onMouseEnter={() => playSound('hover')}
                                className="vanguard-magnetic group self-start flex flex-col gap-4 mt-8"
                            >
                                <span className="text-[var(--text-xs)] uppercase tracking-[0.5em] font-bold flex items-center gap-4 group-hover:italic transition-all">
                                    Initiate Connection <Send size={14} className="group-hover:translate-x-2 transition-transform" />
                                </span>
                                <div className="w-40 h-[2px] bg-foreground/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-foreground -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
                                </div>
                            </button>
                        </form>
                    </div>

                    {/* Information Side (Location & Hours) */}
                    <div className="lg:col-span-5 flex flex-col gap-16">
                        {/* Map Component */}
                        <div className="relative aspect-[4/3] w-full border border-foreground/10 overflow-hidden grayscale invert dark:invert-0 bg-foreground/5">
                            <div className="absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md px-4 py-2 border border-foreground/10">
                                <span className="text-[var(--text-xs)] font-bold tracking-widest uppercase flex items-center gap-2">
                                    <MapPin size={12} className="text-primary" /> BASE_CLASSROOM: PHU NHUAN
                                </span>
                            </div>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.106579893414!2d106.6669923!3d10.80313!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293da27d979d%3A0x6bba46bc20e58f0d!2sGolden%20Mansion!5e0!3m2!1sen!2svn!4v1700000000000!5m2!1sen!2svn"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            />
                        </div>

                        {/* Practical Markers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <span className="text-[var(--text-xs)] font-bold uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                                    <Clock size={12} /> Sync Hours (GMT+7)
                                </span>
                                <div className="space-y-2 font-mono text-[var(--text-xs)] opacity-60">
                                    <p className="flex justify-between border-b border-foreground/5 pb-2"><span>MON — THU</span> <span>09:00 - 18:00</span></p>
                                    <p className="flex justify-between border-b border-foreground/5 pb-2"><span>FRI</span> <span>09:00 - 15:00</span></p>
                                    <p className="flex justify-between"><span>SAT — SUN</span> <span className="italic opacity-40">ASYNC ONLY</span></p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <span className="text-[var(--text-xs)] font-bold uppercase tracking-[0.2em] opacity-30 flex items-center gap-2">
                                    Location Registry
                                </span>
                                <p className="font-mono text-[var(--text-xs)] leading-relaxed opacity-60">
                                    Golden Mansion<br />
                                    119 Đ. Phổ Quang, Phường 9<br />
                                    Phú Nhuận, HCMC<br />
                                    Vietnam
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
