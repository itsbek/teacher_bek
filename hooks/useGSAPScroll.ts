'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RefObject } from 'react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type AnimationType =
    | 'fade-up'
    | 'parallax'
    | 'scrub-text'
    | 'pin-section'
    | 'reveal'
    | 'stagger'
    | 'counter'
    | 'scale';

interface UseGSAPScrollProps {
    ref: RefObject<HTMLElement | null>;
    type: AnimationType;
    options?: {
        trigger?: RefObject<HTMLElement | null>;
        delay?: number;
        duration?: number;
        scrub?: boolean | number;
        markers?: boolean;
        pin?: boolean;
        start?: string;
        end?: string;
        stagger?: number;
        /** For counter type: target number */
        counterTarget?: number;
        /** For counter type: suffix after number */
        counterSuffix?: string;
        /** For parallax: speed factor */
        speed?: number;
    };
}

export function useGSAPScroll({ ref, type, options = {} }: UseGSAPScrollProps) {
    useGSAP(() => {
        if (!ref.current) return;

        // Respect reduced motion
        if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const triggerEl = options.trigger?.current || ref.current;

        switch (type) {
            case 'fade-up':
                gsap.fromTo(
                    ref.current,
                    { y: 50, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: options.duration || 1,
                        delay: options.delay || 0,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: triggerEl,
                            start: options.start || 'top 85%',
                            markers: options.markers,
                        },
                    }
                );
                break;

            case 'parallax':
                gsap.to(ref.current, {
                    yPercent: (options.speed ?? 0.2) * 100,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: triggerEl,
                        start: options.start || 'top bottom',
                        end: options.end || 'bottom top',
                        scrub: options.scrub ?? true,
                        markers: options.markers,
                    },
                });
                break;

            case 'scrub-text': {
                const chars = ref.current.querySelectorAll('.char');
                if (chars.length > 0) {
                    gsap.fromTo(chars,
                        { opacity: 0.15 },
                        {
                            opacity: 1,
                            stagger: 0.05,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: triggerEl,
                                start: options.start || 'top 80%',
                                end: options.end || 'top 20%',
                                scrub: options.scrub ?? true,
                                markers: options.markers,
                            }
                        }
                    );
                }
                break;
            }

            case 'pin-section':
                ScrollTrigger.create({
                    trigger: triggerEl,
                    start: options.start || 'top top',
                    end: options.end || '+=100%',
                    pin: options.pin ?? true,
                    pinSpacing: true,
                    markers: options.markers,
                });
                break;

            case 'reveal':
                gsap.fromTo(
                    ref.current,
                    { clipPath: 'inset(0 0 100% 0)' },
                    {
                        clipPath: 'inset(0 0 0% 0)',
                        duration: options.duration || 1,
                        delay: options.delay || 0,
                        ease: 'power3.inOut',
                        scrollTrigger: {
                            trigger: triggerEl,
                            start: options.start || 'top 85%',
                            scrub: options.scrub ?? false,
                            ...(options.scrub ? { end: options.end || 'top 30%' } : {}),
                            markers: options.markers,
                        },
                    }
                );
                break;

            case 'stagger': {
                const children = ref.current.children;
                if (children.length === 0) break;
                gsap.fromTo(
                    children,
                    { y: 30, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        duration: options.duration || 0.7,
                        stagger: options.stagger || 0.15,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: triggerEl,
                            start: options.start || 'top 85%',
                            markers: options.markers,
                        },
                    }
                );
                break;
            }

            case 'counter': {
                const target = options.counterTarget ?? 0;
                const suffix = options.counterSuffix ?? '';
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: options.duration || 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: triggerEl,
                        start: options.start || 'top 85%',
                        markers: options.markers,
                    },
                    onUpdate: () => {
                        if (ref.current) {
                            ref.current.textContent = Math.round(obj.val).toLocaleString() + suffix;
                        }
                    },
                });
                break;
            }

            case 'scale':
                gsap.fromTo(
                    ref.current,
                    { scale: 0.9, opacity: 0 },
                    {
                        scale: 1,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: triggerEl,
                            start: options.start || 'top 90%',
                            end: options.end || 'top 30%',
                            scrub: true,
                            markers: options.markers,
                        },
                    }
                );
                break;
        }
    }, { scope: ref, dependencies: [type] });
}
