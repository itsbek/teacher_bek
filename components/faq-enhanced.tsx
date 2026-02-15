"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageCircle, ArrowRight } from 'lucide-react';
import { TobaccoSmoke, CrackUnderline, WaxDrip } from './lingua-noir/archaeological-effects';
import { trackCTAClick } from '@/lib/analytics';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

/**
 * LINGUA NOIR - Enhanced FAQ Component
 *
 * Features:
 * - Liquid pool reveal animations
 * - Crack underlines on questions
 * - Wax drip effect on hover
 * - Tobacco smoke background
 * - Mechanical accordion with copper accents
 * - Asymmetric layout (60/40 split)
 */
export function FAQEnhanced() {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number with liquid reveal
      gsap.fromTo('.faq-number',
        { clipPath: 'circle(0% at 0% 0%)' },
        {
          clipPath: 'circle(150% at 0% 0%)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );

      // Label with oxidized copper draw
      gsap.fromTo('.faq-label-line',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );

      gsap.fromTo('.faq-label',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );

      // Title words with 3D flip
      gsap.fromTo('.faq-title-word',
        { y: 100, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.faq-title',
            start: 'top 80%',
            once: true,
          }
        }
      );

      // Subtitle with smoke effect
      gsap.fromTo('.faq-subtitle',
        { y: 40, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          scrollTrigger: {
            trigger: '.faq-subtitle',
            start: 'top 85%',
            once: true,
          }
        }
      );

      // CTA with elastic bounce
      gsap.fromTo('.faq-cta',
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.faq-cta',
            start: 'top 90%',
            once: true,
          }
        }
      );

      // FAQ items with liquid reveal
      gsap.fromTo('.faq-item',
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 0.8,
          stagger: 0.12,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 75%',
            once: true,
          }
        }
      );

      // Parallax decorative elements
      gsap.to('.faq-deco-1', {
        y: -80,
        rotation: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

      gsap.to('.faq-deco-2', {
        y: 60,
        rotation: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = t('title').split(' ');

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-[#FDFBF7] dark:bg-black py-32 lg:py-48 overflow-hidden"
    >
      {/* Tobacco smoke tendrils */}
      <TobaccoSmoke className="opacity-20 dark:opacity-40" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Oxidized copper circles */}
        <div className="faq-deco-1 absolute top-1/4 right-[15%] w-80 h-80 rounded-full border-2 border-[#C4A84D]/10 dark:border-[#43b3ae]/10" />
        <div className="faq-deco-2 absolute bottom-1/3 left-[5%] w-3 h-3 rounded-full bg-[#8a0303] dark:bg-[#ff6b35]" />

        {/* Vertical accent lines */}
        <div className="absolute top-0 bottom-0 left-[20%] w-px bg-gradient-to-b from-transparent via-foreground/5 dark:via-white/5 to-transparent" />
        <div className="absolute top-0 bottom-0 right-[30%] w-px bg-gradient-to-b from-transparent via-foreground/5 dark:via-white/5 to-transparent" />
      </div>

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Asymmetric grid: 40% header / 60% content */}
        <div className="grid lg:grid-cols-[40%_60%] gap-16 lg:gap-24">

          {/* Left: Sticky header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Section indicator */}
            <div className="flex items-start gap-6 mb-10">
              <span
                className="faq-number text-[100px] lg:text-[140px] font-display font-bold leading-none -mt-6"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px hsl(var(--foreground) / 0.04)',
                }}
              >
                05
              </span>

              <div className="pt-6">
                {/* Label */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="faq-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#43b3ae] origin-left" />
                  <span className="faq-label text-[11px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#43b3ae]">
                    FAQ
                  </span>
                </div>

                {/* Headline */}
                <div className="faq-title overflow-hidden mb-8">
                  <h2 className="font-display text-[clamp(3rem,6vw,5rem)] font-semibold leading-[1.0] tracking-[-0.03em]">
                    {titleWords.map((word, i) => (
                      <span
                        key={i}
                        className="faq-title-word inline-block mr-[0.2em]"
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="faq-subtitle text-lg text-foreground/60 dark:text-white/60 leading-[1.8] mb-10 max-w-md">
                  {t('description')}
                </p>

                {/* CTA */}
                <a
                  href="#contact"
                  onClick={() => trackCTAClick('faq', 'still_questions')}
                  className="faq-cta group inline-flex items-center gap-3 px-6 py-4 border-2 border-[#C4A84D] dark:border-[#43b3ae] text-sm font-semibold tracking-[0.05em] uppercase transition-all duration-500 hover:bg-[#C4A84D] dark:hover:bg-[#43b3ae] hover:text-white dark:hover:text-black"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Ask Your Question</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Right: FAQ List */}
          <div className="faq-list space-y-2">
            {faqKeys.map((key, index) => (
              <div
                key={key}
                className="faq-item relative overflow-hidden"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Hover glow effect */}
                {hoveredIndex === index && (
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(196, 168, 77, 0.08), transparent 40%)',
                    }}
                  />
                )}

                {/* Question */}
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full text-left p-6 md:p-8 border border-foreground/10 dark:border-white/10 hover:border-[#C4A84D]/30 dark:hover:border-[#43b3ae]/30 transition-all duration-500 group"
                  style={{
                    background: openIndex === index
                      ? 'linear-gradient(135deg, rgba(196, 168, 77, 0.05) 0%, transparent 100%)'
                      : 'transparent',
                  }}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      {/* Question number */}
                      <span className="text-xs font-mono tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30 mb-3 block">
                        Q{String(index + 1).padStart(2, '0')}
                      </span>

                      {/* Question text with crack underline on hover */}
                      <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground dark:text-white mb-1 transition-colors duration-300">
                        {hoveredIndex === index ? (
                          <CrackUnderline>
                            {t(`${key}.question`)}
                          </CrackUnderline>
                        ) : (
                          t(`${key}.question`)
                        )}
                      </h3>
                    </div>

                    {/* Toggle icon with wax drip on hover */}
                    <div className="relative shrink-0">
                      {hoveredIndex === index ? (
                        <WaxDrip>
                          <div
                            className="w-10 h-10 flex items-center justify-center border border-[#C4A84D] dark:border-[#43b3ae] transition-transform duration-500"
                            style={{
                              transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                            }}
                          >
                            <Plus className="w-5 h-5 text-[#C4A84D] dark:text-[#43b3ae]" />
                          </div>
                        </WaxDrip>
                      ) : (
                        <div
                          className="w-10 h-10 flex items-center justify-center border border-foreground/20 dark:border-white/20 transition-all duration-500"
                          style={{
                            transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)',
                          }}
                        >
                          <Plus className="w-5 h-5 text-foreground/40 dark:text-white/40" />
                        </div>
                      )}
                    </div>
                  </div>
                </button>

                {/* Answer - Liquid reveal animation */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden border-x border-b border-foreground/10 dark:border-white/10"
                    >
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="px-6 md:px-8 py-6 md:py-8"
                      >
                        {/* Answer content */}
                        <div className="text-base md:text-lg text-foreground/70 dark:text-white/70 leading-[1.8] space-y-4">
                          {t(`${key}.answer`).split('\n').map((paragraph: string, i: number) => (
                            <p key={i}>{paragraph}</p>
                          ))}
                        </div>

                        {/* Optional: Related action */}
                        {(key === 'q1' || key === 'q3') && (
                          <div className="mt-6 pt-6 border-t border-foreground/10 dark:border-white/10">
                            <a
                              href="#contact"
                              className="inline-flex items-center gap-2 text-sm font-medium text-[#C4A84D] dark:text-[#43b3ae] hover:gap-4 transition-all duration-300 group/link"
                            >
                              <span>Get a personalized assessment</span>
                              <ArrowRight className="w-4 h-4" />
                            </a>
                          </div>
                        )}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom accent line - appears on open */}
                {openIndex === index && (
                  <div className="h-[2px] bg-gradient-to-r from-[#C4A84D] dark:from-[#43b3ae] to-transparent animate-in slide-in-from-left duration-700" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom telegraph line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4A84D]/30 dark:via-[#43b3ae]/30 to-transparent" />
    </section>
  );
}
