"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";
import { useAudio } from "@/components/audio-provider";

export const CustomCursor = () => {
    const [cursorType, setCursorType] = useState<"default" | "text" | "button" | "draw">("default");
    const [isPressed, setIsPressed] = useState(false);
    const [inkTrail, setInkTrail] = useState<{ x: number; y: number; time: number }[]>([]);
    const { playSound } = useAudio();

    useEffect(() => {
        if (cursorType !== "default") {
            playSound("morph");
        }
    }, [cursorType, playSound]);

    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 20, stiffness: 250, restDelta: 0.001 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    const pressTimerRef = useRef<NodeJS.Timeout | null>(null);

    const onMouseMove = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX);
        cursorY.set(e.clientY);

        if (cursorType === "draw") {
            setInkTrail(prev => [...prev.slice(-20), { x: e.clientX, y: e.clientY, time: Date.now() }]);
        }
    }, [cursorType]);

    const onMouseDown = useCallback(() => {
        setIsPressed(true);
        pressTimerRef.current = setTimeout(() => {
            setCursorType("draw");
        }, 500);
    }, []);

    const onMouseUp = useCallback(() => {
        setIsPressed(false);
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current);
        setCursorType("default");
        setInkTrail([]);
    }, []);

    useEffect(() => {
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON" || target.closest("button") || target.tagName === "A" || target.closest("a")) {
                setCursorType("button");
            } else if (target.tagName === "P" || target.tagName === "H1" || target.tagName === "H2" || target.tagName === "H3" || target.tagName === "SPAN") {
                setCursorType("text");
            } else {
                setCursorType("default");
            }
        };

        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, [onMouseMove, onMouseDown, onMouseUp]);

    return (
        <>
            <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
          .custom-cursor {
            display: none !important;
          }
        }
      `}</style>

            {/* Ink Trail */}
            <div className="custom-cursor pointer-events-none fixed inset-0 z-[9999]">
                <svg className="h-full w-full">
                    <AnimatePresence>
                        {inkTrail.length > 1 && (
                            <motion.path
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.4 }}
                                exit={{ opacity: 0 }}
                                d={`M ${inkTrail[0].x} ${inkTrail[0].y} ${inkTrail.map(p => `L ${p.x} ${p.y}`).join(" ")}`}
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                    </AnimatePresence>
                </svg>
            </div>

            <motion.div
                className="custom-cursor pointer-events-none fixed top-0 left-0 z-[10000] flex items-center justify-center rounded-full mix-blend-difference"
                style={{
                    x: springX,
                    y: springY,
                    translateX: "-50%",
                    translateY: "-50%",
                    width: cursorType === "button" ? 60 : cursorType === "text" ? 2 : 12,
                    height: cursorType === "button" ? 60 : cursorType === "text" ? 30 : 12,
                    backgroundColor: cursorType === "text" ? "rgba(255, 255, 0, 0.4)" : "white",
                    border: cursorType === "button" ? "1px solid white" : "none",
                }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                }}
            >
                {cursorType === "draw" && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-2 w-2 rounded-full bg-red-500"
                    />
                )}
            </motion.div>
        </>
    );
};
