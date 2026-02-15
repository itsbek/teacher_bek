"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function VanguardTransmission() {
    const t = useTranslations("testimonials");

    const testimonials = [
        {
            id: 1,
            text: "Bek's approach is pure precision. I went from hesitating to leading meetings in months.",
            author: "Elena Ivanova",
            origin: "Russia",
        },
        {
            id: 2,
            text: "The focus on voice and narrative changed how I see English. It's no longer just a subject.",
            author: "Nguyễn Thu Hà",
            origin: "Vietnam",
        },
        {
            id: 3,
            text: "Elite instruction. The small group dynamic allows for real, intellectual growth.",
            author: "Li Wei",
            origin: "China",
        }
    ];

    return (
        <section id="testimonials" className="py-32 bg-black text-white px-8 border-t border-white/5">
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-24">
                    <span className="font-sans text-[10px] tracking-vanguard uppercase text-vanguard-lime mb-4 block">
                        The Evidence
                    </span>
                    <h2 className="text-7xl lg:text-9xl font-display leading-[0.85] tracking-tightest uppercase">
                        The <span className="text-white italic">Transmission</span>
                    </h2>
                </header>

                <div className="flex flex-col gap-32">
                    {testimonials.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            viewport={{ once: true }}
                            className="flex flex-col lg:flex-row items-baseline gap-8"
                        >
                            <span className="font-display text-4xl text-vanguard-lime">0{item.id}</span>
                            <div className="max-w-4xl">
                                <p className="font-display text-4xl lg:text-6xl uppercase leading-tight tracking-tightest">
                                    "{item.text}"
                                </p>
                                <div className="mt-8 flex items-center gap-4">
                                    <div className="w-12 h-[1px] bg-white/20" />
                                    <span className="font-sans text-xs tracking-widest uppercase opacity-40">
                                        {item.author} — {item.origin}
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
