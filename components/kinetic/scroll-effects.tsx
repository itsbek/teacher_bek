"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Horizontal scroll section
interface HorizontalScrollProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: string;
}

export function HorizontalScroll({
  children,
  className = '',
  backgroundColor = 'transparent'
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - container.offsetWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor }}
    >
      <div ref={trackRef} className="flex h-full">
        {children}
      </div>
    </div>
  );
}

// Pinned section with scroll progress
interface PinnedSectionProps {
  children: ReactNode;
  className?: string;
  duration?: number;
}

export function PinnedSection({
  children,
  className = '',
  duration = 1
}: PinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${window.innerHeight * duration}`,
        pin: true,
        pinSpacing: true,
      });
    }, container);

    return () => ctx.revert();
  }, [duration]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Staggered reveal on scroll
interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  delay?: number;
}

export function StaggerReveal({
  children,
  className = '',
  stagger = 0.1,
  y = 60,
  delay = 0
}: StaggerRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const items = container.children;

    const ctx = gsap.context(() => {
      gsap.fromTo(items,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger,
          delay,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            once: true,
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [stagger, y, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Scale on scroll
interface ScaleOnScrollProps {
  children: ReactNode;
  className?: string;
  fromScale?: number;
  toScale?: number;
  scrub?: boolean | number;
}

export function ScaleOnScroll({
  children,
  className = '',
  fromScale = 0.8,
  toScale = 1,
  scrub = 1
}: ScaleOnScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(container,
        { scale: fromScale, opacity: 0.5 },
        {
          scale: toScale,
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'center center',
            scrub: typeof scrub === 'number' ? scrub : 1,
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [fromScale, toScale, scrub]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Fade mask on scroll
interface FadeMaskProps {
  children: ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export function FadeMask({
  children,
  className = '',
  direction = 'up'
}: FadeMaskProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const mask = maskRef.current;
    if (!container || !mask) return;

    const transforms: Record<string, { from: string; to: string }> = {
      up: { from: 'translateY(0%)', to: 'translateY(-100%)' },
      down: { from: 'translateY(0%)', to: 'translateY(100%)' },
      left: { from: 'translateX(0%)', to: 'translateX(-100%)' },
      right: { from: 'translateX(0%)', to: 'translateX(100%)' },
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(mask,
        { transform: transforms[direction].from },
        {
          transform: transforms[direction].to,
          ease: 'power4.inOut',
          duration: 1.2,
          scrollTrigger: {
            trigger: container,
            start: 'top 75%',
            once: true,
          }
        }
      );
    }, container);

    return () => ctx.revert();
  }, [direction]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {children}
      <div
        ref={maskRef}
        className="absolute inset-0 bg-[#C85C3F] dark:bg-[#B8956A] z-10"
      />
    </div>
  );
}

// Parallax container for multiple layers
interface ParallaxLayerProps {
  children: ReactNode;
  className?: string;
  speed: number;
  direction?: 'vertical' | 'horizontal';
}

export function ParallaxLayer({
  children,
  className = '',
  speed,
  direction = 'vertical'
}: ParallaxLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const parent = layer.parentElement;
    if (!parent) return;

    const ctx = gsap.context(() => {
      const movement = speed * 100;

      if (direction === 'vertical') {
        gsap.fromTo(layer,
          { y: movement },
          {
            y: -movement,
            ease: 'none',
            scrollTrigger: {
              trigger: parent,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          }
        );
      } else {
        gsap.fromTo(layer,
          { x: movement },
          {
            x: -movement,
            ease: 'none',
            scrollTrigger: {
              trigger: parent,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            }
          }
        );
      }
    }, layer);

    return () => ctx.revert();
  }, [speed, direction]);

  return (
    <div ref={layerRef} className={className}>
      {children}
    </div>
  );
}

// Morphing shape on scroll
interface MorphingShapeProps {
  className?: string;
  color?: string;
}

export function MorphingShape({ className = '', color = '#C85C3F' }: MorphingShapeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const path = svg.querySelector('path');
    if (!path) return;

    const shapes = [
      'M50,10 C80,10 90,30 90,50 C90,70 80,90 50,90 C20,90 10,70 10,50 C10,30 20,10 50,10',
      'M50,5 C85,15 95,40 85,55 C75,70 60,95 40,85 C20,75 5,50 15,35 C25,20 15,-5 50,5',
      'M45,8 C70,8 92,25 88,52 C84,79 65,95 40,92 C15,89 8,68 12,45 C16,22 20,8 45,8',
      'M55,12 C78,18 95,38 90,58 C85,78 62,92 42,88 C22,84 5,62 10,42 C15,22 32,6 55,12',
    ];

    let currentShape = 0;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: svg,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          const shapeIndex = Math.floor(self.progress * (shapes.length - 1));
          if (shapeIndex !== currentShape) {
            currentShape = shapeIndex;
            gsap.to(path, {
              attr: { d: shapes[shapeIndex] },
              duration: 0.5,
              ease: 'power2.out',
            });
          }
        }
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <path
        d="M50,10 C80,10 90,30 90,50 C90,70 80,90 50,90 C20,90 10,70 10,50 C10,30 20,10 50,10"
        fill={color}
      />
    </svg>
  );
}

// Counter animation on scroll
interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  end,
  duration = 2,
  suffix = '',
  prefix = '',
  className = ''
}: AnimatedCounterProps) {
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const obj = { value: 0 };
          gsap.to(obj, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => {
              counter.textContent = `${prefix}${Math.round(obj.value)}${suffix}`;
            }
          });
        }
      });
    }, counter);

    return () => ctx.revert();
  }, [end, duration, suffix, prefix]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

// Scroll progress indicator
interface ScrollProgressProps {
  className?: string;
  color?: string;
  height?: number;
  position?: 'top' | 'bottom';
}

export function ScrollProgress({
  className = '',
  color = '#C85C3F',
  height = 3,
  position = 'top'
}: ScrollProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    const ctx = gsap.context(() => {
      gsap.to(progress, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={progressRef}
      className={`fixed ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 origin-left scale-x-0 ${className}`}
      style={{ height, backgroundColor: color }}
    />
  );
}
