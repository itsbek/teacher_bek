'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollTextProps {
    children: string;
    /** 'entrance' = chars animate in on scroll enter; 'scrub' = opacity linked to scroll progress */
    mode?: 'entrance' | 'scrub';
    className?: string;
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'p' | 'div';
    start?: string;
    end?: string;
    /** Stagger between characters for entrance mode */
    stagger?: number;
}

export function ScrollText({
    children,
    mode = 'entrance',
    className = '',
    as: Tag = 'span',
    start,
    end,
    stagger = 0.02,
}: ScrollTextProps) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect reduced motion
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const split = new SplitType(el, { types: 'chars' });
        const chars = split.chars;
        if (!chars || chars.length === 0) return;

        const isMobile = window.innerWidth < 768;
        let tween: gsap.core.Tween;

        if (mode === 'scrub') {
            // Scroll-scrubbed: character opacity from 0.15 to 1, linked to scroll progress
            gsap.set(chars, { opacity: 0.15 });
            tween = gsap.to(chars, {
                opacity: 1,
                stagger: 0.05,
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    start: start || (isMobile ? 'top 98%' : 'top 80%'),
                    end: end || (isMobile ? 'top 60%' : 'top 30%'),
                    scrub: true,
                },
            });
        } else {
            // Entrance: chars animate in on scroll enter
            gsap.set(chars, { opacity: 0, y: '60%', rotateX: -40, filter: 'blur(4px)' });
            tween = gsap.to(chars, {
                opacity: 1,
                y: '0%',
                rotateX: 0,
                filter: 'blur(0px)',
                duration: 1,
                stagger,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: start || (isMobile ? 'top 98%' : 'top 85%'),
                    toggleActions: 'play none none none',
                },
            });
        }

        return () => {
            tween?.scrollTrigger?.kill();
            tween?.kill();
            split.revert();
        };
    }, [children, mode, start, end, stagger]);

    return (
        // @ts-expect-error - dynamic tag element
        <Tag ref={ref} className={`inline-block ${className}`} style={{ perspective: '1000px' }}>
            {children}
        </Tag>
    );
}
