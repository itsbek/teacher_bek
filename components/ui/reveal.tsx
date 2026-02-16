"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useAudio } from "@/components/audio-provider";

interface RevealProps {
    children: React.ReactNode;
    width?: "fit-content" | "100%";
    delay?: number;
    duration?: number;
}

export const Reveal = ({ children, width = "fit-content", delay = 0, duration = 0.8 }: RevealProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
    const { playSound } = useAudio();

    useEffect(() => {
        if (isInView) {
            playSound("reveal");
        }
    }, [isInView, playSound]);

    return (
        <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y: 75, filter: "blur(10px)" },
                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                // Fail-safe: keep content visible even if in-view observers fail.
                initial={false}
                animate={isInView ? "visible" : "visible"}
                transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
};

export const LineReveal = ({ children, delay = 0 }: { children: string; delay?: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div ref={ref} className="relative overflow-hidden">
            <motion.div
                initial={false}
                animate={isInView ? { y: 0 } : { y: 0 }}
                transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    );
};
