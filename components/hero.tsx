"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useMemo } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -----------------------------------------------------------------------------
// SCRAMBLE WORD
// -----------------------------------------------------------------------------
const ScrambleWord = ({ words, interval = 3000 }: { words: string[]; interval?: number }) => {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [currentWord, setCurrentWord] = useState(words[0]);
  const indexRef = useRef(0);

  // Find longest word to reserve space and prevent layout shift
  const longestWord = useMemo(() => words.reduce((a, b) => a.length > b.length ? a : b, ""), [words]);

  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const cycle = setInterval(() => {
      indexRef.current = (indexRef.current + 1) % words.length;
      const nextWord = words[indexRef.current];
      const el = elementRef.current;

      if (!el) return;

      let frame = 0;
      const totalFrames = 30; // 30 frames for ~500ms transition

      const animate = () => {
        let output = '';
        const progress = frame / totalFrames;

        for (let i = 0; i < nextWord.length; i++) {
          // If we're past the "scramble" phase for this character, show the real char
          if (progress > (i / nextWord.length)) {
            output += nextWord[i];
          } else {
            // Otherwise show a random character with lower opacity
            // Ensure width doesn't fluctuate wildly by using non-breaking space if random char is narrow?
            // Actually, the Grid spacer handles the container width. 
            // The text itself might jitter inside, but the layout won't shake.
            output += `<span class="opacity-30">${chars[Math.floor(Math.random() * chars.length)]}</span>`;
          }
        }

        el.innerHTML = output;
        frame++;

        if (frame <= totalFrames) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete, sync React state
          setCurrentWord(nextWord);
        }
      };

      animate();
    }, interval);

    return () => clearInterval(cycle);
  }, [words, interval]);

  return (
    <span className="inline-grid grid-cols-1 overflow-hidden" style={{ verticalAlign: 'top' }}>
      {/* Invisible spacer to reserve constant width */}
      <span className="col-start-1 row-start-1 opacity-0 pointer-events-none select-none" aria-hidden="true">
        {longestWord}
      </span>

      {/* Animated text overlay */}
      <span
        ref={elementRef}
        className="col-start-1 row-start-1 text-primary whitespace-nowrap"
        aria-label={currentWord}
      >
        {currentWord}
      </span>
    </span>
  );
};

// -----------------------------------------------------------------------------
// WIREGLOBE BACKGROUND ELEMENT
// -----------------------------------------------------------------------------
const WireGlobe = () => {
  return (
    <div className="absolute top-1/2 right-[5%] -translate-y-1/2 w-[600px] h-[600px] opacity-[0.04] pointer-events-none hidden xl:block mix-blend-difference">
      <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
        {/* Outer sphere */}
        <circle cx="100" cy="100" r="95" fill="none" stroke="currentColor" strokeWidth="0.5" />

        {/* Latitude lines */}
        <ellipse cx="100" cy="100" rx="95" ry="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="95" ry="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="82" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" />

        {/* Longitude lines */}
        <ellipse cx="100" cy="100" rx="30" ry="95" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="60" ry="95" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <ellipse cx="100" cy="100" rx="82" ry="80" fill="none" stroke="currentColor" strokeWidth="0.5" transform="rotate(90 100 100)" />

        {/* Vertical center line */}
        <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="0.5" />

        {/* Horizontal center line */}
        <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

// -----------------------------------------------------------------------------
// MAIN HERO
// -----------------------------------------------------------------------------
const WORDS = ['Confidence', 'Clarity', 'Purpose'];

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [displayCount, setDisplayCount] = useState(0);
  const hasAnimated = useRef(false);

  // Count-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const target = 2000;
            const duration = 2000;
            const startTime = Date.now();

            const tick = () => {
              const elapsed = Date.now() - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const easeOutQuart = 1 - Math.pow(1 - progress, 4);
              setDisplayCount(Math.floor(easeOutQuart * target));

              if (progress < 1) {
                requestAnimationFrame(tick);
              }
            };

            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // GSAP Entrance - Fixed for descenders
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // Grid lines
      tl.fromTo(".grid-line", { scaleX: 0 }, { scaleX: 1, duration: 1.2, stagger: 0.1 });
      tl.fromTo(".eyebrow", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

      // Headline - Manual line reveal to preserve ScrambleWord React state
      if (headlineRef.current) {
        tl.to([".line-1-text", ".line-2-text"], {
          y: '0%',
          duration: 1.4,
          stagger: 0.12,
          ease: "power4.out"
        }, "-=0.6");
      }

      // Globe fade in
      tl.fromTo(".wire-globe-container", { opacity: 0, scale: 0.9 }, { opacity: 0.04, scale: 1, duration: 2 }, "-=1");

      // Stat row
      tl.fromTo(".stat-row", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

      // Subtitle
      tl.fromTo(".subtitle", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.6");

      // CTAs
      tl.fromTo(".cta-group", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, "-=0.6");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-center bg-background overflow-hidden"
    >
      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

      {/* Wireframe Globe - Transparent background element */}
      <div className="wire-globe-container absolute inset-0 pointer-events-none">
        <WireGlobe />
      </div>

      {/* Decorative grid lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid-line absolute left-[8vw] top-1/4 bottom-1/4 w-px bg-foreground/[0.03] origin-top" />
        <div className="grid-line absolute right-[8vw] top-1/3 bottom-1/3 w-px bg-foreground/[0.02] origin-top" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 lg:px-12 pt-32 pb-20">

        {/* Top row */}
        <div className="flex items-center justify-between mb-16">
          <div className="eyebrow flex items-center gap-4">
            <div className="h-px w-8 bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary font-semibold">
              {t('badge')}
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 hidden sm:block">
            Issue 01 — 2024
          </span>
        </div>

        {/* MAIN COMPOSITION */}
        <div className="space-y-10">

          {/* Headline - Fixed line-height for descenders */}
          {/* leading-[1.05] gives enough room for tails of p, y, q, g, j */}
          <h1
            ref={headlineRef}
            className="font-display text-[12vw] sm:text-[10vw] lg:text-[8vw] xl:text-[6.5vw] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground max-w-4xl"
          >
            <span className="block overflow-hidden pb-2">
              <span className="block line-1-text translate-y-[110%]">Speak English</span>
            </span>
            <span className="block overflow-hidden pb-4 -mb-4">
              <span className="inline-flex items-baseline line-2-text translate-y-[110%]">
                with <span className="w-[0.2em]" /> <ScrambleWord words={WORDS} />
              </span>
            </span>
          </h1>

          {/* Stat - Inline, proud but not shouting */}
          <div className="stat-row inline-flex items-center gap-6 py-3 px-0 border-t border-b border-border/30">
            <div className="flex items-baseline gap-1">
              <span className="font-display text-5xl lg:text-6xl font-bold text-foreground tabular-nums tracking-tight">
                {displayCount.toLocaleString()}
              </span>
              <span className="font-display text-2xl lg:text-3xl font-bold text-primary">+</span>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border/50" />
            <div className="hidden sm:block">
              <span className="block font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground/80">Students taught</span>
              <span className="block font-mono text-[9px] text-muted-foreground/50 mt-0.5">Since 2012</span>
            </div>
          </div>

          {/* Subtitle */}
          <p className="subtitle text-lg lg:text-xl text-muted-foreground leading-relaxed max-w-2xl text-pretty">
            {t('subtitle')}
          </p>

          {/* CTAs */}
          <div className="cta-group flex flex-col sm:flex-row gap-4 pt-2">
            <a
              href="#contact"
              onClick={() => trackCTAClick('hero', 'contact')}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-medium relative overflow-hidden hover:shadow-glow transition-shadow duration-500"
            >
              <span className="relative z-10">{t('cta')}</span>
              <ArrowRight className="relative z-10 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              <div className="absolute inset-0 bg-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </a>

            <a
              href="#courses"
              onClick={() => trackCTAClick('hero', 'courses')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 border border-foreground/20 text-foreground font-medium hover:border-primary hover:text-primary transition-colors duration-300"
            >
              {t('secondary')}
            </a>
          </div>
        </div>
      </div>

      {/* Animation keyframes for slow spin */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
