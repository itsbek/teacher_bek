"use client";

import React, { useEffect, useRef } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

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

        lenisRef.current = lenis;
        (window as Window & { __lenis?: Lenis }).__lenis = lenis;
        document.documentElement.classList.add("lenis-enabled");
        let rafId = 0;

        function raf(time: number) {
            lenis.raf(time);
            rafId = requestAnimationFrame(raf);
        }

        rafId = requestAnimationFrame(raf);

        return () => {
            cancelAnimationFrame(rafId);
            lenis.destroy();
            delete (window as Window & { __lenis?: Lenis }).__lenis;
            document.documentElement.classList.remove("lenis-enabled");
        };
    }, []);

    return <>{children}</>;
}
