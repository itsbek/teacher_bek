"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";

interface KineticTextProps {
    text: string;
    className?: string;
    delay?: number;
    once?: boolean;
    stagger?: number;
    /** Allow wrapping at word boundaries. Default false (original whitespace-nowrap behaviour). */
    noWrap?: boolean;
}

export function KineticText({
    text,
    className = "",
    delay = 0,
    once = true,
    stagger = 0.02,
    noWrap = true,
}: KineticTextProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once });

    // ── Variant for noWrap=true: staggerChildren drives the timing ──
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: stagger, delayChildren: delay },
        },
    };

    const charVariants: Variants = {
        hidden: { opacity: 0, y: "100%", rotateX: -45, filter: "blur(8px)" },
        visible: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
        },
    };

    // ── Variant for noWrap=false: each char carries its own delay via `custom` ──
    // staggerChildren can't cross a plain-HTML word-wrapper, so we manage timing manually.
    const containerVariantsWrap: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const charVariantsWrap: Variants = {
        hidden: { opacity: 0, y: "100%", rotateX: -45, filter: "blur(8px)" },
        visible: (charDelay: number) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            transition: { duration: 1.2, delay: charDelay, ease: [0.16, 1, 0.3, 1] },
        }),
    };

    // ── Wrappable rendering: words are atomic units, spaces are real break points ──
    if (!noWrap) {
        const words = text.split(" ");
        let globalIdx = 0;

        return (
            <motion.span
                ref={ref}
                variants={containerVariantsWrap}
                initial={false}
                animate="visible"
                // `inline` so the word-spans flow like text
                className={`inline perspective-1000 ${className}`}
            >
                {words.map((word, wordIdx) => {
                    const wordEl = (
                        // `inline-block whitespace-nowrap` = this word never breaks mid-character
                        <span
                            key={`w${wordIdx}`}
                            style={{ display: "inline-block", whiteSpace: "nowrap" }}
                        >
                            {word.split("").map((char) => {
                                const i = globalIdx++;
                                return (
                                    <motion.span
                                        key={i}
                                        variants={charVariantsWrap}
                                        custom={delay + i * stagger}
                                        className="inline-block"
                                    >
                                        {char}
                                    </motion.span>
                                );
                            })}
                        </span>
                    );

                    // Append a real space after every word except the last.
                    // A plain text node " " between inline-block spans is a valid break opportunity.
                    return wordIdx < words.length - 1 ? (
                        <React.Fragment key={`f${wordIdx}`}>
                            {wordEl}{" "}
                        </React.Fragment>
                    ) : wordEl;
                })}
            </motion.span>
        );
    }

    // ── Original rendering: single line, no wrapping ──
    return (
        <motion.span
            ref={ref}
            variants={containerVariants}
            initial={false}
            animate={isInView ? "visible" : "visible"}
            className={`inline-block whitespace-nowrap perspective-1000 ${className}`}
        >
            {text.split("").map((char, index) => (
                <motion.span
                    key={index}
                    variants={charVariants}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.span>
    );
}
