"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export function VanguardCursor() {
    const [isHovered, setIsHovered]   = useState(false);
    const [isPressed, setIsPressed]   = useState(false);
    const [label, setLabel]           = useState("");

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const dotConfig  = { damping: 30, stiffness: 300 };
    const dotX = useSpring(mouseX, dotConfig);
    const dotY = useSpring(mouseY, dotConfig);

    const ringConfig = { damping: 20, stiffness: 120 };
    const ringX = useSpring(mouseX, ringConfig);
    const ringY = useSpring(mouseY, ringConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === "A" ||
                target.tagName === "BUTTON" ||
                target.closest("a") ||
                target.closest("button") ||
                target.getAttribute("role") === "button" ||
                target.classList.contains("cursor-pointer");
            setIsHovered(!!isClickable);

            // Cursor label from data attribute — traverse up to find it
            const labelEl = target.closest("[data-cursor-label]");
            setLabel(labelEl?.getAttribute("data-cursor-label") ?? "");
        };

        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp   = () => setIsPressed(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup",   handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup",   handleMouseUp);
        };
    }, [mouseX, mouseY]);

    const hasLabel   = label.length > 0;
    const ringSize   = hasLabel ? 88 : isHovered ? 64 : 40;
    const ringBorder = hasLabel || isHovered
        ? "rgba(255, 255, 255, 0.6)"
        : "rgba(255, 255, 255, 0.25)";

    return (
        <>
            {/* Inner dot */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    x: dotX,
                    y: dotY,
                    translateX: "-50%",
                    translateY: "-50%",
                    backgroundColor: "white",
                }}
                animate={{
                    width:  isPressed ? 4 : hasLabel ? 0 : isHovered ? 10 : 8,
                    height: isPressed ? 4 : hasLabel ? 0 : isHovered ? 10 : 8,
                }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />

            {/* Outer ring — expands for labels */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998] overflow-hidden"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    border: "1px solid",
                    mixBlendMode: "difference",
                }}
                animate={{
                    width:       ringSize,
                    height:      ringSize,
                    borderColor: ringBorder,
                    backgroundColor: hasLabel
                        ? "rgba(255, 255, 255, 0.12)"
                        : isHovered
                            ? "rgba(255, 255, 255, 0.06)"
                            : "transparent",
                    scale: isPressed ? 0.85 : 1,
                }}
                transition={{ type: "spring", damping: 18, stiffness: 180, mass: 0.6 }}
            >
                {/* Label text — inside the ring */}
                <AnimatePresence mode="wait">
                    {hasLabel && (
                        <motion.span
                            key={label}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                                fontFamily: "var(--font-sans)",
                                fontSize: "9px",
                                fontWeight: 600,
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "white",
                                mixBlendMode: "difference",
                            }}
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {label}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    );
}
