"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * SmoothScroll — single Lenis instance, driven by GSAP ticker.
 *
 * GSAP ticker drives Lenis (not a separate rAF loop), and every Lenis
 * scroll event feeds ScrollTrigger.update so trigger positions and
 * Lenis virtual scroll are always in sync. Without this, GSAP reads
 * a different scroll position than Lenis renders, causing the view to
 * jump backward when you stop scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.05,
            easing: (t) => 1 - Math.pow(1 - t, 3),
            orientation: "vertical",
            gestureOrientation: "vertical",
            smoothWheel: true,
            wheelMultiplier: 0.85,
            touchMultiplier: 0.9,
            syncTouch: true,
        });

        (window as Window & { __lenis?: Lenis }).__lenis = lenis;
        document.documentElement.classList.add("lenis-enabled");

        // Sync every Lenis scroll event into ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update);

        // Drive Lenis via GSAP ticker — no separate rAF loop
        const tickerFn = (time: number) => { lenis.raf(time * 1000); };
        gsap.ticker.add(tickerFn);
        gsap.ticker.lagSmoothing(0);

        return () => {
            gsap.ticker.remove(tickerFn);
            lenis.destroy();
            delete (window as Window & { __lenis?: Lenis }).__lenis;
            document.documentElement.classList.remove("lenis-enabled");
        };
    }, []);

    return <>{children}</>;
}
