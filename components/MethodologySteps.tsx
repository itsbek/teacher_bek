"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface MethodologyStepsProps {
    children: React.ReactNode;
}

export function MethodologySteps({ children }: MethodologyStepsProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        let ctx: gsap.Context;
        const rafId = requestAnimationFrame(() => {
            ctx = gsap.context(() => {
                const cards = ref.current?.children;
                if (!cards || cards.length === 0) return;

                const isMobile = window.innerWidth < 768;
                gsap.fromTo(
                    cards,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: isMobile ? 0.08 : 0.15,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: ref.current,
                            start: isMobile ? "top 98%" : "top 80%",
                        },
                    }
                );
            }, ref);
        });

        return () => {
            cancelAnimationFrame(rafId);
            ctx?.revert();
        };
    }, []);

    return (
        <div
            ref={ref}
            className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10"
        >
            {children}
        </div>
    );
}
