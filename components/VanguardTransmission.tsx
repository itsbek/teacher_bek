"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function VanguardTransmission() {
    const t = useTranslations("testimonials");

    const testimonials = [
        {
            id: 1,
            text: "Bek\u2019s approach is pure precision. I went from hesitating to leading meetings in months.",
            author: "Elena Ivanova",
            origin: "Russia",
        },
        {
            id: 2,
            text: "The focus on voice and narrative changed how I see English. It\u2019s no longer just a subject.",
            author: "Nguy\u1EC5n Thu H\u00E0",
            origin: "Vietnam",
        },
        {
            id: 3,
            text: "Elite instruction. The small group dynamic allows for real, intellectual growth.",
            author: "Li Wei",
            origin: "China",
        },
    ];

    return (
        <section
            id="testimonials"
            className="py-32 bg-black text-white px-8 border-t border-white/5 relative overflow-hidden"
        >
            {/* Dot grid background */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="max-w-[1400px] mx-auto relative z-10">
                <header className="mb-24">
                    <div className="flex items-center gap-4 mb-6">
                        <span className="w-8 h-[1px] bg-white/20" />
                        <span className="text-[13px] uppercase tracking-[0.22em] text-white/35">
                            [ 05 &mdash; Student Stories ]
                        </span>
                    </div>
                    <h2 className="text-7xl lg:text-9xl font-display leading-[0.85] tracking-tighter uppercase">
                        Real{" "}
                        <span className="text-white/50 italic">Growth</span>
                    </h2>
                </header>

                <div className="flex flex-col gap-24 lg:gap-32">
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.8,
                                delay: i * 0.15,
                                ease: [0.16, 1, 0.3, 1],
                            }}
                            viewport={{ once: true }}
                            className="group flex flex-col lg:flex-row items-baseline gap-8 hover:pl-2 transition-all duration-500"
                        >
                            <span className="font-display text-4xl text-white/15 group-hover:text-white/30 transition-colors duration-300 tabular-nums">
                                0{item.id}
                            </span>
                            <div className="max-w-4xl">
                                <p className="font-display text-4xl lg:text-6xl uppercase leading-tight tracking-tighter text-white/90">
                                    &ldquo;{item.text}&rdquo;
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-white/15" />
                                    <span className="text-xs tracking-widest uppercase text-white/30">
                                        {item.author} &mdash; {item.origin}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
