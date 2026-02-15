"use client";

import React from "react";
import { motion } from "framer-motion";

export function VanguardMarquee() {
    const text = "Academic Strategy — Creative Mentorship — Linguistic Blueprinting — Intellectual Resilience — Narrative Mastery — ";

    return (
        <div className="w-full bg-black text-[#f4f4f0] py-8 overflow-hidden border-y border-white/5">
            <div className="whitespace-nowrap flex">
                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="flex shrink-0 gap-8"
                >
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="flex gap-8 items-center">
                            <span className="font-display text-[var(--text-2xl)] md:text-[var(--text-display-lg)] italic">
                                {text}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
