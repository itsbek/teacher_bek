"use client";

import { useTranslations } from 'next-intl';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

// Cinematic text reveal - word by word
function TextReveal({ children, delay = 0 }: { children: string; delay?: number }) {
  const words = children.split(' ');

  return (
    <span className="inline">
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-visible py-[0.1em] -my-[0.1em]">
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block mr-[0.25em]"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

// Animated counter with mounting guard
function AnimatedCounter({ value, suffix = '', delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <span className="tabular-nums">
      {mounted ? displayValue : 0}{suffix}
    </span>
  );
}

export function Hero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Much gentler scroll effects - content stays visible longer
  const y = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0.3]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] flex flex-col justify-center overflow-hidden bg-background"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Gradient orb - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute -top-[20%] -right-[10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-3xl" />
      </motion.div>

      {/* Large decorative text in background */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.02, x: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute -right-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden xl:block"
        >
          <span className="font-display text-[18vw] font-bold tracking-tighter text-foreground">
            1K+
          </span>
        </motion.div>
      )}

      {/* Vertical accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-4 md:left-8 lg:left-12 top-0 w-[1px] h-full bg-gradient-to-b from-primary via-primary/30 to-transparent origin-top hidden md:block"
      />

      {/* Main content - adjusted padding for viewport fit */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 pt-20 md:pt-24 lg:pt-28 pb-8 md:pb-12"
      >
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <span className="eyebrow">{t('badge')}</span>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 items-end">
            {/* Left - Headline & CTA */}
            <div className="lg:col-span-8">
              {/* Headline - refined size for viewport fit */}
              <h1 className="text-foreground mb-4 md:mb-6 max-w-4xl hero-title">
                <TextReveal delay={0.4}>{t('title')}</TextReveal>
              </h1>

              {/* Accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-16 md:w-24 h-[3px] bg-primary mb-4 md:mb-6 origin-left"
              />

              {/* Subtitle - more compact */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-xl mb-6 md:mb-8 leading-relaxed"
              >
                {t('subtitle')}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <motion.a
                  href="#contact"
                  onClick={() => trackCTAClick('hero', 'contact')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary group"
                >
                  <span>{t('cta')}</span>
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </motion.a>
                <motion.a
                  href="#courses"
                  onClick={() => trackCTAClick('hero', 'courses')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline"
                >
                  <span>{t('secondary')}</span>
                </motion.a>
              </motion.div>
            </div>

            {/* Right - Stats - more compact layout */}
            <div className="lg:col-span-4 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.4 }}
                className="flex flex-col gap-6"
              >
                {/* Stat 1 */}
                <div className="stat-block">
                  <div className="font-display text-4xl xl:text-5xl font-bold text-foreground tracking-tight">
                    <AnimatedCounter value={2000} suffix="" delay={1.6} />
                  </div>
                  <p className="label mt-1">{t('stats.students')}</p>
                </div>

                {/* Stat 2 */}
                <div className="stat-block">
                  <div className="font-display text-3xl xl:text-4xl font-semibold text-foreground tracking-tight">
                    <AnimatedCounter value={3} suffix=" yrs" delay={1.8} />
                  </div>
                  <p className="label mt-1">{t('stats.experience')}</p>
                </div>

                {/* Stat 3 - Text badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2 }}
                >
                  <p className="font-display text-lg xl:text-xl font-semibold text-primary leading-tight">
                    {t('stats.success')}
                  </p>
                  <p className="label mt-1">Teaching Background</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Location Pills - compact spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.2 }}
            className="mt-8 md:mt-10 lg:mt-12 flex flex-wrap items-center gap-2 md:gap-3"
          >
            <span className="label mr-1">Teaching in:</span>
            {['Gò Vấp', 'Phú Nhuận', 'Bình Thạnh'].map((district, i) => (
              <motion.span
                key={district}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 2.3 + i * 0.08 }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-foreground text-xs md:text-sm font-medium border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
              >
                <MapPin className="w-3 h-3 text-primary" />
                {district}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator - positioned to not overflow */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.6 }}
        className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="label-sm text-[8px] md:text-[9px]">Scroll</span>
          <div className="w-[1px] h-6 md:h-8 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
