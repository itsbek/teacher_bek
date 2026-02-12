"use client";

import React from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const chapters = [
    { id: "hero", label: "Intro", top: "0%" },
    { id: "about", label: "Teacher", top: "25%" },
    { id: "services", label: "Classes", top: "50%" },
    { id: "testimonials", label: "Results", top: "75%" },
    { id: "faq", label: "FAQ", top: "90%" },
];

export const BookmarkRibbon = () => {
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div className="fixed right-4 top-0 bottom-0 z-[50] pointer-events-none hidden md:flex items-start justify-center w-12">
            {/* Ribbon Track */}
            <div className="absolute top-0 bottom-0 w-[2px] bg-[#ECD06F]/10" />

            {/* Dynamic Ribbon */}
            <motion.div
                className="absolute top-0 w-[6px] bg-gradient-to-b from-[#ECD06F] via-[#ECD06F]/80 to-[#ECD06F] origin-top shadow-[0_0_15px_rgba(236,208,111,0.3)]"
                style={{ scaleY, height: "100%" }}
            />

            {/* Chapter markers */}
            {chapters.map((chapter) => (
                <div
                    key={chapter.id}
                    className="absolute left-0 w-full flex items-center"
                    style={{ top: chapter.top }}
                >
                    <div className="w-2 h-2 rounded-full bg-[#ECD06F]/20 border border-[#ECD06F]/40 -ml-[5px]" />
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="ml-4 px-2 py-1 bg-black/80 backdrop-blur-sm border border-white/10 rounded text-[10px] font-mono uppercase tracking-tighter text-white/50 whitespace-nowrap shadow-sm"
                    >
                        {chapter.label}
                    </motion.div>
                </div>
            ))}

            {/* The "Embossed Tab" indicator */}
            <motion.div
                className="absolute w-8 h-12 bg-[#ECD06F] flex items-center justify-center rounded-l-md shadow-lg pointer-events-auto"
                style={{
                    top: useTransform(scrollYProgress, [0, 1], ["0%", "95%"]),
                    x: 24, // Positioned on the right edge
                }}
            >
                <div className="w-1 h-6 bg-black/20 rounded-full" />
            </motion.div>
        </div>
    );
};
