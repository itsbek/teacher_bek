'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Centralized GSAP ScrollTrigger controller.
 * Scans the DOM for `data-scroll` attributes and applies animations.
 *
 * Supported data-scroll values:
 *   fade-up, parallax, reveal, stagger, scrub-text,
 *   scale, counter
 *
 * Config attributes:
 *   data-scroll-delay, data-scroll-speed, data-scroll-scrub,
 *   data-scroll-start, data-scroll-end, data-scroll-stagger
 */
export function useScrollAnimations(containerRef: React.RefObject<HTMLElement | null>) {
    useEffect(() => {
        if (!containerRef.current) return;
        if (typeof window === 'undefined') return;

        // Respect reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        // Small delay so DOM is settled after React renders
        const rafId = requestAnimationFrame(() => {
            const container = containerRef.current;
            if (!container) return;

            const elements = container.querySelectorAll<HTMLElement>('[data-scroll]');
            const triggers: ScrollTrigger[] = [];

            elements.forEach((el) => {
                const type = el.dataset.scroll;
                const delay = parseFloat(el.dataset.scrollDelay || '0');
                const speed = parseFloat(el.dataset.scrollSpeed || '0.3');
                const useScrub = el.dataset.scrollScrub === 'true';
                const start = el.dataset.scrollStart || 'top 85%';
                const end = el.dataset.scrollEnd || 'bottom 20%';
                const staggerVal = parseFloat(el.dataset.scrollStagger || '0.15');

                switch (type) {
                    case 'fade-up': {
                        const tween = gsap.fromTo(
                            el,
                            { y: 40, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.9,
                                delay,
                                ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: el,
                                    start,
                                    toggleActions: 'play none none none',
                                },
                            }
                        );
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }

                    case 'parallax': {
                        const tween = gsap.to(el, {
                            yPercent: speed * 100,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: el,
                                start: 'top bottom',
                                end: 'bottom top',
                                scrub: true,
                            },
                        });
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }

                    case 'reveal': {
                        const tween = gsap.fromTo(
                            el,
                            { clipPath: 'inset(0 0 100% 0)' },
                            {
                                clipPath: 'inset(0 0 0% 0)',
                                duration: 1,
                                delay,
                                ease: 'power3.inOut',
                                scrollTrigger: {
                                    trigger: el,
                                    start,
                                    scrub: useScrub,
                                    ...(useScrub ? { end } : {}),
                                    toggleActions: useScrub ? undefined : 'play none none none',
                                },
                            }
                        );
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }

                    case 'stagger': {
                        const children = el.children;
                        if (children.length === 0) break;
                        const tween = gsap.fromTo(
                            children,
                            { y: 30, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.7,
                                stagger: staggerVal,
                                ease: 'power3.out',
                                scrollTrigger: {
                                    trigger: el,
                                    start,
                                    toggleActions: 'play none none none',
                                },
                            }
                        );
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }

                    case 'scale': {
                        const tween = gsap.fromTo(
                            el,
                            { scale: 0.9, opacity: 0 },
                            {
                                scale: 1,
                                opacity: 1,
                                ease: 'none',
                                scrollTrigger: {
                                    trigger: el,
                                    start: start || 'top 90%',
                                    end: end || 'top 30%',
                                    scrub: true,
                                },
                            }
                        );
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }

                    case 'counter': {
                        const target = el.dataset.scrollTarget ? parseFloat(el.dataset.scrollTarget) : 0;
                        const suffix = el.dataset.scrollSuffix || '';
                        const obj = { val: 0 };
                        const tween = gsap.to(obj, {
                            val: target,
                            duration: 1.5,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: el,
                                start,
                                toggleActions: 'play none none none',
                            },
                            onUpdate: () => {
                                el.textContent = Math.round(obj.val).toLocaleString() + suffix;
                            },
                        });
                        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
                        break;
                    }
                }
            });

            // Store triggers for cleanup
            (container as HTMLElement & { __scrollTriggers?: ScrollTrigger[] }).__scrollTriggers = triggers;
        });

        return () => {
            cancelAnimationFrame(rafId);
            const container = containerRef.current;
            if (container) {
                const stored = (container as HTMLElement & { __scrollTriggers?: ScrollTrigger[] }).__scrollTriggers;
                if (stored) {
                    stored.forEach((st) => st.kill());
                }
            }
        };
    }, [containerRef]);
}
