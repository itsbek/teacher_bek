"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowRight, MessageCircle } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const;

export function FAQ() {
  const t = useTranslations('faq');
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number
      gsap.fromTo(".faq-number",
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Label with line
      gsap.fromTo(".faq-label-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      gsap.fromTo(".faq-label",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Title words
      gsap.fromTo(".faq-title-word",
        { y: 60, opacity: 0, rotateX: -45 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".faq-title",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Subtitle
      gsap.fromTo(".faq-subtitle",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6,
          scrollTrigger: {
            trigger: ".faq-subtitle",
            start: "top 85%",
            once: true,
          }
        }
      );

      // CTA button
      gsap.fromTo(".faq-cta",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".faq-cta",
            start: "top 90%",
            once: true,
          }
        }
      );

      // FAQ items stagger with scale
      gsap.fromTo(".faq-item",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".faq-list",
            start: "top 75%",
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = ['Frequently', 'Asked'];

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative bg-[#FDFBF7] dark:bg-black py-32 lg:py-48 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[15%] w-80 h-80 rounded-full border border-[#C4A84D]/5 dark:border-[#ECD06F]/5" />
        <div className="absolute bottom-1/3 left-[5%] w-2 h-2 bg-[#C4A84D] dark:bg-[#ECD06F] rounded-full" />
      </div>

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-16 lg:gap-24">
          {/* Left: Header */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            {/* Section indicator */}
            <div className="flex items-start gap-6 mb-8">
              <span className="faq-number text-[100px] lg:text-[140px] font-display font-bold text-foreground/[0.04] dark:text-white/[0.04] leading-none -mt-6">
                05
              </span>
              <div className="pt-4">
                {/* Label */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="faq-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#ECD06F] origin-left" />
                  <span className="faq-label text-[11px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
                    Questions
                  </span>
                </div>

                {/* Title */}
                <h2 className="faq-title font-display text-[clamp(36px,5vw,64px)] font-semibold text-foreground dark:text-white leading-[1.0] tracking-[-0.03em] mb-6">
                  {titleWords.map((word, i) => (
                    <span key={i} className="faq-title-word inline-block mr-[0.2em]" style={{ transformStyle: 'preserve-3d' }}>
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </div>

            {/* Subtitle */}
            <p className="faq-subtitle text-foreground/50 dark:text-white/50 text-lg leading-[1.8] mb-10 max-w-sm">
              Everything you need to know about my English lessons and teaching approach.
            </p>

            {/* CTA */}
            <a
              href="#contact"
              className="faq-cta group relative inline-flex items-center gap-4 px-8 py-4 bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black text-sm font-semibold tracking-[0.05em] uppercase overflow-hidden transition-all duration-500"
            >
              <MessageCircle className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Still have questions?</span>
              <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-foreground dark:bg-black transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            </a>
          </div>

          {/* Right: FAQ Items */}
          <div className="faq-list space-y-4" itemScope itemType="https://schema.org/FAQPage">
            {faqKeys.map((key, index) => {
              const isOpen = openIndex === index;
              const questionKey = key;
              const answerKey = key.replace('q', 'a') as `a${number}`;

              return (
                <motion.div
                  key={index}
                  className="faq-item"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left p-6 lg:p-8 border transition-all duration-500 group ${
                      isOpen
                        ? 'bg-white dark:bg-[#0A0A0A] border-[#C4A84D]/40 dark:border-[#ECD06F]/40'
                        : 'bg-transparent border-foreground/10 dark:border-white/10 hover:border-foreground/20 dark:hover:border-white/20 hover:bg-white/50 dark:hover:bg-white/5'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <span className={`text-[11px] font-mono tracking-[0.15em] pt-1.5 transition-colors duration-300 ${
                          isOpen ? 'text-[#C4A84D] dark:text-[#ECD06F]' : 'text-foreground/30 dark:text-white/30'
                        }`}>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3
                          className={`text-lg lg:text-xl font-medium pr-4 transition-colors duration-300 leading-tight ${
                            isOpen ? 'text-foreground dark:text-white' : 'text-foreground/70 dark:text-white/70 group-hover:text-foreground dark:group-hover:text-white'
                          }`}
                          itemProp="name"
                        >
                          {t(questionKey)}
                        </h3>
                      </div>
                      <div
                        className={`flex-shrink-0 w-12 h-12 flex items-center justify-center border transition-all duration-300 ${
                          isOpen
                            ? 'bg-[#C4A84D] dark:bg-[#ECD06F] border-[#C4A84D] dark:border-[#ECD06F] text-white dark:text-black'
                            : 'border-foreground/15 dark:border-white/15 text-foreground/50 dark:text-white/50 group-hover:border-foreground/30 dark:group-hover:border-white/30'
                        }`}
                      >
                        <Plus
                          className={`w-5 h-5 transition-transform duration-500 ${
                            isOpen ? 'rotate-45' : ''
                          }`}
                        />
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p
                            className="text-foreground/60 dark:text-white/60 leading-[1.8] pt-6 pl-12 text-base lg:text-lg"
                            itemProp="text"
                          >
                            {t(answerKey)}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mt-20 lg:mt-28">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-6 px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-foreground/5 dark:border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/50 dark:text-white/50">
              Always Happy to Help
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
