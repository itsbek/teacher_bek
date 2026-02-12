"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, BookOpen, Star } from 'lucide-react';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * About Section - AWWWARDS Editorial Style
 *
 * Features:
 * - 60/40 asymmetric layout (portrait + bio)
 * - WebGL-style liquid edge effect in dark mode
 * - GSAP scroll-triggered animations
 * - Animated stat counters
 * - Dual-mode: Maison d'Or (light) / Lingua Noir (dark)
 * - Full semantic HTML and accessibility
 */
export function AboutAwwwards() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP scroll-triggered animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Section number fade in
      gsap.fromTo(
        '.about-number',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Label line draw
      gsap.fromTo(
        '.about-label-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Label text
      gsap.fromTo(
        '.about-label',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Headline words with 3D rotation
      gsap.fromTo(
        '.about-headline-word',
        { y: 60, opacity: 0, rotateX: -45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-headline',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Portrait fade from left
      gsap.fromTo(
        '.about-portrait',
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.about-portrait',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Stats with elastic bounce
      gsap.fromTo(
        '.about-stat',
        { y: 40, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // Bio text fade
      gsap.fromTo(
        '.about-bio',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: '.about-bio',
            start: 'top 85%',
            once: true,
          },
        }
      );

      // Credentials stagger
      gsap.fromTo(
        '.about-credential',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.about-credentials',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // Split headline into words for animation
  const headline = t('title') || 'A Teacher Who Listens';
  const headlineWords = headline.split(' ');

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen flex items-center bg-[#FDFCF8] dark:bg-[#050505] py-20 md:py-32 overflow-hidden transition-colors duration-700"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Light mode: subtle radial gradient */}
        <div className="absolute inset-0 opacity-30 dark:opacity-0">
          <div
            className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(196,168,77,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
            }}
          />
        </div>

        {/* Dark mode: atmospheric glow */}
        <div className="absolute inset-0 opacity-0 dark:opacity-100">
          <div
            className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(67,179,174,0.12) 0%, transparent 70%)',
              filter: 'blur(100px)',
            }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 w-full">
        {/* Section Header */}
        <div className="mb-16 md:mb-20">
          <div className="flex items-start gap-8">
            {/* Section Number */}
            <span className="about-number text-[clamp(100px,12vw,160px)] font-display font-bold text-[#2A2A2C]/[0.04] dark:text-[#F4ECD8]/[0.04] leading-none -mt-4">
              02
            </span>

            {/* Label and Headline */}
            <div className="flex-1 pt-4">
              {/* Label */}
              <div className="flex items-center gap-4 mb-8">
                <div className="about-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#43b3ae] origin-left" />
                <span className="about-label text-[11px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#43b3ae]">
                  {t('label') || 'About'}
                </span>
              </div>

              {/* Headline */}
              <h2 className="about-headline font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold text-[#2A2A2C] dark:text-[#F4ECD8] leading-[1.0] tracking-[-0.03em]">
                {headlineWords.map((word, i) => (
                  <span
                    key={i}
                    className="about-headline-word inline-block mr-[0.2em]"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </div>
          </div>
        </div>

        {/* Main Content: 60/40 Asymmetric Grid */}
        <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-start">
          {/* LEFT: Portrait */}
          <div className="about-portrait">
            <figure className="relative aspect-[3/4] group">
              {/* Elegant frame */}
              <div className="absolute inset-0 border-2 border-[#C4A84D]/20 dark:border-[#43b3ae]/20 pointer-events-none z-10" />

              {/* Portrait image placeholder */}
              <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-[#C4A84D]/10 to-[#B8956A]/10 dark:from-[#43b3ae]/10 dark:to-[#00FFFF]/10">
                {/* Image would go here */}
                <div className="absolute inset-0 flex items-center justify-center text-[#2A2A2C]/20 dark:text-[#F4ECD8]/20">
                  <BookOpen className="w-24 h-24" aria-hidden="true" />
                </div>

                {/* WebGL-style liquid edge effect in dark mode */}
                <div className="absolute inset-0 opacity-0 dark:opacity-100 pointer-events-none">
                  <div
                    className="absolute inset-0"
                    style={{
                      clipPath: 'polygon(0 0, 100% 0, 100% 98%, 95% 100%, 90% 99%, 85% 100%, 80% 98%, 0 98%)',
                      filter: 'blur(1px)',
                      background: 'linear-gradient(180deg, transparent 90%, rgba(67,179,174,0.3) 100%)',
                    }}
                  />
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-r-2 border-b-2 border-[#C4A84D] dark:border-[#43b3ae] opacity-30 pointer-events-none" />
            </figure>
          </div>

          {/* RIGHT: Bio + Stats */}
          <div className="space-y-12">
            {/* Intro Bio */}
            <div className="about-bio space-y-6">
              <p className="text-lg md:text-xl leading-relaxed text-[#2A2A2C] dark:text-[#F4ECD8] font-light">
                {t('intro') || 'I believe the best way to learn is by doing - speaking, laughing, and trying without fear.'}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-[#2A2A2C]/70 dark:text-[#F4ECD8]/70 font-light">
                {t('story.p1') || 'With TESOL and PGCE certifications, I\'ve taught across Ho Chi Minh City at schools like ILA Vietnam and in my own classroom in Phú Nhuận.'}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="about-stats grid grid-cols-3 gap-4">
              {/* Stat 1 */}
              <dl className="about-stat text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <dt className="text-xs tracking-wider uppercase text-[#2A2A2C]/50 dark:text-[#F4ECD8]/50 mb-2">
                  Students
                </dt>
                <dd className="font-display text-3xl md:text-4xl font-bold text-[#C4A84D] dark:text-[#43b3ae]">
                  2000+
                </dd>
              </dl>

              {/* Stat 2 */}
              <dl className="about-stat text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <dt className="text-xs tracking-wider uppercase text-[#2A2A2C]/50 dark:text-[#F4ECD8]/50 mb-2">
                  Years
                </dt>
                <dd className="font-display text-3xl md:text-4xl font-bold text-[#C4A84D] dark:text-[#43b3ae]">
                  3
                </dd>
              </dl>

              {/* Stat 3 */}
              <dl className="about-stat text-center p-6 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <dt className="text-xs tracking-wider uppercase text-[#2A2A2C]/50 dark:text-[#F4ECD8]/50 mb-2">
                  Rating
                </dt>
                <dd className="flex items-center justify-center gap-1 font-display text-3xl md:text-4xl font-bold text-[#C4A84D] dark:text-[#43b3ae]">
                  4.9
                  <Star className="w-5 h-5 fill-current" aria-hidden="true" />
                </dd>
              </dl>
            </div>

            {/* Credentials */}
            <div className="about-credentials space-y-3">
              <div className="about-credential flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <Award className="w-5 h-5 text-[#C4A84D] dark:text-[#43b3ae] flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-[#2A2A2C] dark:text-[#F4ECD8]">
                    TESOL Qualified
                  </div>
                  <div className="text-xs text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60">
                    Certified to teach English
                  </div>
                </div>
              </div>

              <div className="about-credential flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <Award className="w-5 h-5 text-[#C4A84D] dark:text-[#43b3ae] flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-[#2A2A2C] dark:text-[#F4ECD8]">
                    PGCE Holder
                  </div>
                  <div className="text-xs text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60">
                    Professional Education Certificate
                  </div>
                </div>
              </div>

              <div className="about-credential flex items-center gap-3 p-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-[#C4A84D]/10 dark:border-[#43b3ae]/10">
                <BookOpen className="w-5 h-5 text-[#C4A84D] dark:text-[#43b3ae] flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-[#2A2A2C] dark:text-[#F4ECD8]">
                    ILA Vietnam
                  </div>
                  <div className="text-xs text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60">
                    International Language Academy
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .about-number,
          .about-label-line,
          .about-label,
          .about-headline-word,
          .about-portrait,
          .about-stat,
          .about-bio,
          .about-credential {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}
