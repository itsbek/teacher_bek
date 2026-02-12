"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Living Typography Hero - AWWWARDS SOTY Level
 *
 * Features:
 * - 3D letter tilting toward mouse cursor
 * - Parallax scrolling with GSAP
 * - Breathing animation on idle
 * - Dual-mode: Maison d'Or (light) / Lingua Noir (dark)
 * - Special treatment for word "key" with gradient/glow
 * - Staggered entrance animations
 * - Reduced-motion support
 */
export function HeroAwwwards() {
  const t = useTranslations('hero');
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Track mouse position for 3D tilt effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Normalize to -1 to 1 range
      setMousePos({
        x: (clientX / innerWidth - 0.5) * 2,
        y: (clientY / innerHeight - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  // GSAP animations: entrance, breathing, parallax
  useEffect(() => {
    setIsLoaded(true);
    if (!headlineRef.current || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const letters = headlineRef.current?.querySelectorAll('.letter');
      const words = headlineRef.current?.querySelectorAll('.word');

      if (prefersReducedMotion) {
        // Instant reveal for reduced motion
        if (letters) gsap.set(letters, { opacity: 1, y: 0 });
        gsap.set(['.hero-subheadline', '.hero-cta'], { opacity: 1, y: 0 });
        return;
      }

      if (!words || words.length === 0) return;

      // Entrance animation: Staggered word fade-in
      gsap.fromTo(
        words,
        {
          opacity: 0,
          y: 80,
          rotateX: -45,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.05,
          ease: 'power4.out',
          delay: 0.3,
        }
      );

      // Subheadline fade in
      gsap.fromTo(
        '.hero-subheadline',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 1,
          ease: 'power3.out',
        }
      );

      // CTA buttons fade in
      gsap.fromTo(
        '.hero-cta',
        { opacity: 0, y: 20, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          delay: 1.2,
          ease: 'back.out(1.7)',
        }
      );

      // Breathing animation (idle state)
      gsap.to('.hero-headline', {
        scale: 1.02,
        duration: 4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });

      // Parallax effect on scroll
      gsap.to('.hero-headline', {
        y: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // Parallax for subheadline (different speed)
      gsap.to('.hero-subheadline', {
        y: -50,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      // Parallax for CTAs
      gsap.to('.hero-cta', {
        y: -30,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Calculate 3D tilt for individual letters based on mouse position
  const getLetterStyle = (index: number, totalLetters: number) => {
    if (prefersReducedMotion) return {};

    // Normalize letter position (-1 to 1)
    const letterPos = (index / totalLetters - 0.5) * 2;

    // Distance from mouse (closer = more tilt)
    const distanceX = Math.abs(mousePos.x - letterPos);
    const distanceY = Math.abs(mousePos.y);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // Tilt strength (inversely proportional to distance)
    const tiltStrength = Math.max(0, 1 - distance);
    const rotateY = mousePos.x * tiltStrength * 15; // Max 15deg tilt
    const rotateX = -mousePos.y * tiltStrength * 10; // Max 10deg tilt

    return {
      transform: `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`,
      transition: 'transform 0.1s ease-out',
    };
  };

  // Split text into words and letters for individual animation
  const renderAnimatedText = (text: string) => {
    const words = text.split(' ');
    let letterIndex = 0;
    const totalLetters = text.replace(/\s/g, '').length;

    return words.map((word, wordIndex) => {
      const isKeyWord = word.toLowerCase().includes('key');
      const letters = word.split('').map((letter, i) => {
        const currentIndex = letterIndex++;
        return (
          <span
            key={`${wordIndex}-${i}`}
            className="letter inline-block"
            style={getLetterStyle(currentIndex, totalLetters)}
          >
            {letter}
          </span>
        );
      });

      return (
        <span
          key={wordIndex}
          className={`word inline-block mr-[0.15em] ${
            isKeyWord ? 'hero-key-word' : ''
          }`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {letters}
        </span>
      );
    });
  };

  const headline = t('headline') || 'English is not a language—it is a key';

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#FDFCF8] dark:bg-[#050505] transition-colors duration-700"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      {/* Atmospheric background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light mode: Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-0 transition-opacity duration-700">
          <svg width="100%" height="100%">
            <filter id="noise">
              <feTurbulence baseFrequency="0.8" numOctaves="4" />
              <feColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.02 0" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>

        {/* Dark mode: Gradient bleed */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-700">
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(67,179,174,0.12) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(138,3,3,0.08) 0%, transparent 40%)
              `,
            }}
          />
        </div>

        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.05) 100%)',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center">
        {/* Headline with living typography */}
        <div
          ref={headlineRef}
          className="hero-headline mb-12 md:mb-16"
          style={{ perspective: '1000px' }}
        >
          <h1
            className="font-display font-bold leading-[0.95] tracking-[-0.03em] text-[#2A2A2C] dark:text-[#F4ECD8] transition-colors duration-700"
            style={{
              fontSize: 'clamp(4rem, 12vw, 10rem)',
            }}
          >
            {renderAnimatedText(headline)}
          </h1>
        </div>

        {/* Subheadline */}
        <div className="hero-subheadline mb-12 md:mb-16">
          <p
            className="text-xs md:text-sm tracking-[0.2em] uppercase text-[#C4A84D] dark:text-[#43b3ae] font-medium transition-colors duration-700"
          >
            {t('subheadline') || 'TESOL Certified • ILA Vietnam • Ho Chi Minh City'}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
          {/* Primary CTA */}
          <a
            href="#contact"
            className="hero-cta group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-[0.05em] uppercase overflow-hidden transition-all duration-500 bg-[#C4A84D] hover:bg-[#B8956A] dark:bg-[#43b3ae] dark:hover:bg-[#3d9994] text-white dark:text-[#050505] rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505]"
            style={{
              boxShadow: '0 4px 20px rgba(196, 168, 77, 0.2)',
            }}
          >
            <span className="relative z-10">
              {t('primaryCTA') || 'Start Learning'}
            </span>
            <ArrowRight
              className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              aria-hidden="true"
            />

            {/* Hover shine effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700"
            />
          </a>

          {/* Secondary CTA */}
          <a
            href="#courses"
            className="hero-cta group relative inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-[0.05em] uppercase border-2 border-[#C4A84D] dark:border-[#43b3ae] text-[#C4A84D] dark:text-[#43b3ae] hover:bg-[#C4A84D]/10 dark:hover:bg-[#43b3ae]/10 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505]"
          >
            <span className="relative z-10">
              {t('secondaryCTA') || 'View Courses'}
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator (optional) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 animate-bounce">
        <span className="text-xs tracking-wider text-[#2A2A2C] dark:text-[#F4ECD8]">
          SCROLL
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-[#C4A84D] dark:from-[#43b3ae] to-transparent" />
      </div>

      <style jsx>{`
        /* Special treatment for "key" word */
        .hero-key-word {
          background: linear-gradient(135deg, #C4A84D 0%, #E8B86D 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s ease-in-out infinite;
        }

        :global(.dark) .hero-key-word {
          background: linear-gradient(135deg, #43b3ae 0%, #00FFFF 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
          animation: glow-pulse 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.6));
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .letter,
          .hero-headline,
          .hero-subheadline,
          .hero-cta {
            animation: none !important;
            transition: none !important;
          }

          .hero-key-word {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
