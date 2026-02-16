"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface KineticTextProps {
    text: string;
    className?: string;
    delay?: number;
    once?: boolean;
    stagger?: number;
}

export function KineticText({
    text,
    className = "",
    delay = 0,
    once = true,
    stagger = 0.02
}: KineticTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once });

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    const childVariants: Variants = {
        hidden: {
            opacity: 0,
            y: "100%",
            rotateX: -45,
            filter: "blur(8px)"
        },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: {
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1], // Gold-standard prestige easing
            },
        },
    };

    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            // Render visible by default so content never disappears if JS/in-view logic fails.
            initial={false}
            animate={isInView ? "visible" : "visible"}
            className={`inline-block whitespace-nowrap perspective-1000 ${className}`}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={childVariants}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}
