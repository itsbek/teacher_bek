"use client";

import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export function VanguardMarquee() {
    const t = useTranslations("marquee");
    const text = t("text");
    const repeated = `${text} ${text} ${text} ${text}`;

    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!trackRef.current || !containerRef.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        // Base marquee animation
        const track = trackRef.current;
        const baseSpeed = 60; // seconds for one full cycle

        // Use GSAP for the marquee so we can modulate speed with scroll velocity
        const tween = gsap.to(track, {
            xPercent: -50,
            ease: "none",
            duration: baseSpeed,
            repeat: -1,
        });

        // Modulate speed based on scroll velocity
        let currentDirection = 1;
        const st = ScrollTrigger.create({
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                const velocity = Math.abs(self.getVelocity());
                // Speed multiplier: faster scroll = faster marquee
                const speedMultiplier = 1 + velocity / 1500;
                tween.timeScale(speedMultiplier * currentDirection);

                // Reverse direction when scrolling up
                const newDirection = self.direction === -1 ? -1 : 1;
                if (newDirection !== currentDirection) {
                    currentDirection = newDirection;
                    gsap.to(tween, {
                        timeScale: speedMultiplier * currentDirection,
                        duration: 0.4,
                        ease: "power2.out",
                    });
                }
            },
        });

        return () => {
            tween.kill();
            st.kill();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full bg-foreground text-background py-5 overflow-hidden select-none flex whitespace-nowrap"
        >
            <div ref={trackRef} className="flex w-max flex-nowrap">
                <span className="font-display font-bold uppercase tracking-[-0.03em] px-4 whitespace-nowrap opacity-60 leading-none" style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}>
                    {repeated}
                </span>
                <span
                    className="font-display font-bold uppercase tracking-[-0.03em] px-4 whitespace-nowrap opacity-60 leading-none"
                    style={{ fontSize: "clamp(1.1rem, 1.8vw, 1.5rem)" }}
                    aria-hidden="true"
                >
                    {repeated}
                </span>
            </div>
        </div>
    );
}
