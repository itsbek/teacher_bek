"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FluidSmoke } from '@/components/lingua-noir/fluid-smoke';
import { LiquidMetalText, SmokeText } from '@/components/lingua-noir/liquid-metal-text';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Magnetic button hook
function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(el, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return ref;
}

// Scramble text effect
function useScrambleText(text: string, isActive: boolean) {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!<>-_\\/[]{}—=+*^?#';

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }
      iteration += 1 / 3;
    }, 50);

    return () => clearInterval(interval);
  }, [text, isActive, chars]);

  return displayText;
}

// Rolling ball scroll indicator
function RollingBall() {
  const ballRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;

    gsap.to(ball, {
      x: '100vw',
      rotation: 720,
      duration: 4,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(ball);
    };
  }, []);

  return (
    <div className="absolute bottom-8 left-0 w-full overflow-hidden h-8">
      <div
        ref={ballRef}
        className="w-3 h-3 rounded-full -ml-4"
        style={{
          background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728)',
          boxShadow: '0 0 10px rgba(191, 149, 63, 0.5)',
        }}
      />
    </div>
  );
}

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const primaryBtnRef = useMagnetic(0.25);
  const secondaryBtnRef = useMagnetic(0.2);

  // Scramble effect for badge text
  const scrambledBadge = useScrambleText(t('badge'), isLoaded);

  // Track mouse for parallax
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX - innerWidth / 2) / innerWidth,
      y: (clientY - innerHeight / 2) / innerHeight
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // GSAP Cinematic Entrance
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        delay: 0.3
      });

      // Reveal from center
      tl.fromTo(".hero-reveal",
        { clipPath: "inset(50% 50% 50% 50%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "power4.inOut" }
      )

      // Badge drops in
      .fromTo(".hero-badge",
        { opacity: 0, y: -30, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
        "-=0.5"
      )

      // Title lines slide in
      .fromTo(".hero-line-1",
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(".hero-line-2",
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.8"
      )

      // Subtitle smoke effect
      .fromTo(".hero-subtitle",
        { opacity: 0, y: 20, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8 },
        "-=0.4"
      )

      // CTA liquid reveal
      .fromTo(".hero-cta",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.7)"
        },
        "-=0.3"
      )

      // Side elements
      .fromTo(".hero-side",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.1 },
        "-=0.4"
      );

      // Continuous breathing animation (7 second pulse)
      gsap.to(".breath-element", {
        filter: "brightness(1.1)",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // Parallax on scroll
      gsap.to(".hero-content", {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      // Fluid smoke parallax
      gsap.to(".hero-smoke", {
        y: 50,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 2,
        }
      });

    }, containerRef);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] overflow-hidden"
      style={{ backgroundColor: 'var(--void-black, #050505)' }}
    >
      {/* Reveal mask */}
      <div className="hero-reveal absolute inset-0">
        {/* Gradient bleed background */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 20%, rgba(138,3,3,0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 80%, rgba(67,179,174,0.15) 0%, transparent 40%),
              radial-gradient(ellipse at 50% 50%, rgba(61,40,23,0.3) 0%, transparent 60%)
            `
          }}
        />

        {/* Fluid smoke simulation - Teacher silhouette area */}
        <div className="hero-smoke absolute left-0 top-0 w-1/2 h-full">
          <FluidSmoke
            className="opacity-70"
            colors={{
              tobacco: '#3d2817',
              copper: '#43b3ae',
              blood: '#8a0303',
            }}
          />
        </div>

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.015]"
          style={{
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.1) 2px,
              rgba(255, 255, 255, 0.1) 4px
            )`
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)'
          }}
        />
      </div>

      {/* Main Content - Asymmetric layout */}
      <div className="hero-content relative z-10 min-h-[100svh] grid lg:grid-cols-[45%_55%] items-center">

        {/* Left side - Fluid/Smoke area (on large screens) */}
        <div className="hidden lg:flex items-center justify-center relative">
          {/* Tobacco smoke tendrils */}
          <div
            className="absolute w-64 h-64 breath-element"
            style={{
              background: 'radial-gradient(circle, rgba(67,179,174,0.3) 0%, transparent 70%)',
              filter: 'blur(60px)',
              transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
            }}
          />
          <div
            className="absolute w-48 h-48"
            style={{
              background: 'radial-gradient(circle, rgba(61,40,23,0.4) 0%, transparent 70%)',
              filter: 'blur(40px)',
              transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
            }}
          />
        </div>

        {/* Right side - Typography */}
        <div className="px-6 md:px-12 lg:px-16 py-20 lg:py-0">
          {/* Badge */}
          <div className="hero-badge mb-8">
            <span
              className="inline-flex items-center gap-3 px-4 py-2 text-[9px] md:text-[10px] font-mono tracking-[0.25em] uppercase border breath-element"
              style={{
                color: 'var(--oxidized-copper, #43b3ae)',
                borderColor: 'rgba(67, 179, 174, 0.3)',
                backgroundColor: 'rgba(67, 179, 174, 0.05)',
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--oxidized-copper, #43b3ae)' }}
              />
              {scrambledBadge}
            </span>
          </div>

          {/* Main Headline - Liquid Metal Typography */}
          <div className="mb-10" style={{ perspective: '1000px' }}>
            {/* Line 1 */}
            <div className="hero-line-1 overflow-hidden mb-2">
              <LiquidMetalText
                className="text-[clamp(2.5rem,8vw,6rem)] font-display font-bold leading-[0.95] tracking-[-0.03em]"
                delay={0.5}
              >
                {t('titleLine1') || 'English is not'}
              </LiquidMetalText>
            </div>

            {/* Line 2 */}
            <div className="hero-line-2 overflow-hidden">
              <h1
                className="text-[clamp(2.5rem,8vw,6rem)] font-display font-bold leading-[0.95] tracking-[-0.03em]"
                style={{
                  color: 'var(--vintage-paper, #f4ecd8)',
                  textShadow: '0 0 60px rgba(67, 179, 174, 0.3)',
                }}
              >
                {t('titleLine2') || 'a language — it is a'}
                <span
                  className="ml-4 italic"
                  style={{
                    background: 'linear-gradient(135deg, #43b3ae 0%, #7df9ff 50%, #43b3ae 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                    textShadow: 'none',
                  }}
                >
                  {t('titleAccent') || 'key'}
                </span>
              </h1>
            </div>
          </div>

          {/* Subtitle - Smoke-like fade */}
          <div className="hero-subtitle mb-12 max-w-lg">
            <SmokeText className="text-lg md:text-xl leading-relaxed font-light" style={{ color: 'rgba(244, 236, 216, 0.6)' }}>
              {t('subtitle')}
            </SmokeText>
          </div>

          {/* CTAs - Hidden until scroll reveals liquid pool effect */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              ref={primaryBtnRef}
              href="#contact"
              onClick={() => trackCTAClick('hero', 'contact')}
              className="hero-cta group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase overflow-hidden transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, #43b3ae 0%, #3d9994 100%)',
                color: 'var(--void-black, #050505)',
                boxShadow: '0 0 30px rgba(67, 179, 174, 0.3)',
              }}
            >
              <span className="relative z-10">{t('cta')}</span>
              <ArrowRight className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              <div
                className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"
                style={{ background: 'var(--vintage-paper, #f4ecd8)' }}
              />
            </a>

            <a
              ref={secondaryBtnRef}
              href="#courses"
              onClick={() => trackCTAClick('hero', 'courses')}
              className="hero-cta group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase border overflow-hidden transition-all duration-500"
              style={{
                color: 'var(--vintage-paper, #f4ecd8)',
                borderColor: 'rgba(244, 236, 216, 0.2)',
              }}
            >
              <span className="relative z-10">{t('secondary')}</span>
              <div
                className="absolute inset-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"
                style={{ background: 'rgba(67, 179, 174, 0.1)' }}
              />
            </a>
          </div>
        </div>
      </div>

      {/* Side editorial elements */}
      <div className="hero-side absolute left-6 md:left-10 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-6 pointer-events-none">
        <div
          className="w-px h-20"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(67, 179, 174, 0.3), transparent)' }}
        />
        <span
          className="text-[9px] font-mono tracking-[0.4em] uppercase [writing-mode:vertical-rl] rotate-180"
          style={{ color: 'rgba(67, 179, 174, 0.4)' }}
        >
          Est. 2023
        </span>
        <div
          className="w-px h-20"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(67, 179, 174, 0.3), transparent)' }}
        />
      </div>

      {/* Section number - Oxidized */}
      <div className="hero-side absolute right-6 md:right-10 bottom-1/4 hidden lg:block pointer-events-none">
        <span
          className="text-[180px] font-display font-bold leading-none breath-element"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(67, 179, 174, 0.1)',
          }}
        >
          01
        </span>
      </div>

      {/* Rolling ball scroll indicator */}
      <RollingBall />

      {/* Bottom marquee - Tobacco aesthetic */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden py-3 border-t"
        style={{
          borderColor: 'rgba(67, 179, 174, 0.1)',
          background: 'rgba(5, 5, 5, 0.8)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="mx-8 text-xs font-mono tracking-wider flex items-center gap-4"
              style={{ color: 'rgba(244, 236, 216, 0.3)' }}
            >
              <span style={{ color: 'var(--oxidized-copper, #43b3ae)' }}>◆</span>
              TESOL Certified
              <span style={{ color: 'var(--dried-blood, #8a0303)' }}>◆</span>
              ILA Vietnam
              <span style={{ color: 'var(--oxidized-copper, #43b3ae)' }}>◆</span>
              2000+ Students
              <span style={{ color: 'var(--dried-blood, #8a0303)' }}>◆</span>
              Ho Chi Minh City
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
