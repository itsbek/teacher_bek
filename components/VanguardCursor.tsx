"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function VanguardCursor() {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Dot follows tightly
    const dotConfig = { damping: 30, stiffness: 300 };
    const dotX = useSpring(mouseX, dotConfig);
    const dotY = useSpring(mouseY, dotConfig);

    // Ring trails behind with lag
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
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.getAttribute('role') === 'button' ||
                target.classList.contains('cursor-pointer');
            setIsHovered(!!isClickable);
        };

        const handleMouseDown = () => setIsPressed(true);
        const handleMouseUp = () => setIsPressed(false);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseover", handleMouseOver);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseover", handleMouseOver);
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            {/* Inner dot — precise, follows cursor tightly */}
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
                    width: isPressed ? 6 : isHovered ? 10 : 8,
                    height: isPressed ? 6 : isHovered ? 10 : 8,
                }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 300,
                }}
            />

            {/* Outer ring — trails with delay, expands on hover */}
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9998]"
                style={{
                    x: ringX,
                    y: ringY,
                    translateX: "-50%",
                    translateY: "-50%",
                    border: "1px solid",
                    mixBlendMode: "difference",
                }}
                animate={{
                    width: isHovered ? 64 : 40,
                    height: isHovered ? 64 : 40,
                    borderColor: isHovered
                        ? "rgba(255, 255, 255, 0.6)"
                        : "rgba(255, 255, 255, 0.25)",
                    backgroundColor: isHovered
                        ? "rgba(255, 255, 255, 0.06)"
                        : "transparent",
                    scale: isPressed ? 0.85 : 1,
                }}
                transition={{
                    type: "spring",
                    damping: 18,
                    stiffness: 180,
                    mass: 0.6,
                }}
            />
        </>
    );
}
