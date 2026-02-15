"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
  duration?: number;
}

export function Preloader({ onComplete, duration = 5.7 }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const grainRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const linguaRef = useRef<HTMLDivElement>(null);
  const noirRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const dot = dotRef.current;
    const line = lineRef.current;
    const lingua = linguaRef.current;
    const noir = noirRef.current;

    if (!container || !dot || !line || !lingua || !noir) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        onComplete?.();
      }
    });

    // Initial state
    gsap.set([dot, line, lingua, noir], { opacity: 0 });
    gsap.set(line, { scaleX: 0 });
    gsap.set(lingua.children, { y: -100, opacity: 0 });
    gsap.set(noir, { x: 100, opacity: 0, skewX: -20 });

    // 0.8s - Projector ignition (dot appears)
    tl.to(dot, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out',
    }, 0.8);

    // 1.2s - Dot bleeds into horizontal line
    tl.to(dot, {
      scaleX: 200,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    }, 1.2);

    tl.to(line, {
      opacity: 1,
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.inOut',
    }, 1.2);

    // 2.0s - Line expands, reveals "L"
    tl.to(line, {
      scaleY: 50,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 2.0);

    // 3.0s - Letters cascade with elastic bounce
    const letters = lingua.children;
    tl.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: {
        each: 0.08,
        from: 'start',
      },
      ease: 'elastic.out(1, 0.5)',
    }, 2.5);

    // 4.5s - Line becomes liquid (turbulence effect via filter)
    tl.to(lingua, {
      filter: 'url(#turbulence)',
      duration: 0.3,
    }, 4.2);

    tl.to(lingua, {
      filter: 'none',
      duration: 0.3,
    }, 4.5);

    // 5.0s - "NOIR" crashes in with motion blur
    tl.to(noir, {
      x: 0,
      opacity: 1,
      skewX: 0,
      duration: 0.4,
      ease: 'power4.out',
    }, 4.8);

    // 5.7s - Burn away effect
    tl.to(container, {
      clipPath: 'inset(0 0 0 100%)',
      filter: 'brightness(2) sepia(0.3)',
      duration: 0.5,
      ease: 'power2.in',
    }, duration - 0.5);

    return () => {
      tl.kill();
    };
  }, [duration, onComplete]);

  if (isComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center overflow-hidden"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="turbulence">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Film Grain */}
      <div
        ref={grainRef}
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          animation: 'grain-shift 0.15s steps(1) infinite',
        }}
      />

      {/* Projector Dot */}
      <div
        ref={dotRef}
        className="absolute w-2 h-2 bg-white rounded-full"
        style={{ transformOrigin: 'center' }}
      />

      {/* Scanline */}
      <div
        ref={lineRef}
        className="absolute w-full h-[2px] bg-white"
        style={{ transformOrigin: 'center' }}
      />

      {/* LINGUA Text */}
      <div className="absolute flex flex-col items-center gap-2">
        <div
          ref={linguaRef}
          className="flex overflow-hidden"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {'LINGUA'.split('').map((letter, i) => (
            <span
              key={i}
              className="text-[clamp(3rem,15vw,10rem)] font-bold tracking-[-0.05em] text-[#f4ecd8]"
              style={{
                textShadow: '0 0 40px rgba(67, 179, 174, 0.5)',
              }}
            >
              {letter}
            </span>
          ))}
        </div>

        <div
          ref={noirRef}
          className="text-[clamp(2rem,10vw,6rem)] font-bold tracking-[0.3em] text-[#43b3ae]"
          style={{
            fontFamily: 'var(--font-display)',
            textShadow: '0 0 60px rgba(67, 179, 174, 0.8)',
            filter: 'blur(0px)',
          }}
        >
          NOIR
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}
      />
    </div>
  );
}

// Simpler loading indicator for quick loads
export function LoadingDot() {
  return (
    <div className="fixed inset-0 z-[10000] bg-[#050505] flex items-center justify-center">
      <div className="w-3 h-3 bg-[#43b3ae] rounded-full animate-pulse" />
    </div>
  );
}
