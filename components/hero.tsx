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
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            initial={{ y: '110%', rotateX: -80 }}
            animate={{ y: 0, rotateX: 0 }}
            transition={{
              duration: 0.8,
              delay: delay + i * 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block mr-[0.25em]"
            style={{ transformOrigin: 'bottom' }}
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

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100svh] flex flex-col justify-center overflow-hidden bg-background"
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
        className="absolute -top-[20%] -right-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-primary/5 to-transparent blur-3xl" />
      </motion.div>

      {/* Large decorative text in background */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.02, x: 0 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="absolute -right-[5%] top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        >
          <span className="font-display text-[25vw] font-bold tracking-tighter text-foreground">
            1K+
          </span>
        </motion.div>
      )}

      {/* Vertical accent line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-6 md:left-10 lg:left-16 top-0 w-[1px] h-full bg-gradient-to-b from-primary via-primary/30 to-transparent origin-top hidden md:block"
      />

      {/* Main content */}
      <motion.div style={{ y, opacity, scale }} className="relative z-10 pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-24">
        <div className="container-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 md:mb-12"
          >
            <span className="eyebrow">{t('badge')}</span>
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
            {/* Left - Headline & CTA */}
            <div className="lg:col-span-8">
              {/* Giant Headline */}
              <h1 className="text-foreground mb-6 md:mb-8 max-w-4xl">
                <TextReveal delay={0.4}>{t('title')}</TextReveal>
              </h1>

              {/* Accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="w-24 md:w-32 h-1 bg-primary mb-6 md:mb-8 origin-left"
              />

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl mb-10 md:mb-12 leading-relaxed"
              >
                {t('subtitle')}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="flex flex-col sm:flex-row gap-4"
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

            {/* Right - Stats */}
            <div className="lg:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="flex flex-row lg:flex-col gap-8 lg:gap-10"
              >
                {/* Stat 1 */}
                <div className="stat-block">
                  <div className="number-large text-foreground">
                    <AnimatedCounter value={1000} suffix="+" delay={2} />
                  </div>
                  <p className="label mt-2">{t('stats.students')}</p>
                </div>

                {/* Stat 2 */}
                <div className="stat-block">
                  <div className="number-medium text-foreground">
                    <AnimatedCounter value={3} delay={2.3} />
                  </div>
                  <p className="label mt-2">{t('stats.experience')}</p>
                </div>

                {/* Stat 3 - Text badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 2.6 }}
                  className="hidden lg:block"
                >
                  <p className="font-display text-xl md:text-2xl font-semibold text-primary leading-tight">
                    {t('stats.success')}
                  </p>
                  <p className="label mt-2">Teaching Background</p>
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Location Pills */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.8 }}
            className="mt-16 md:mt-24 lg:mt-32 flex flex-wrap items-center gap-3 md:gap-4"
          >
            <span className="label mr-2">Teaching in:</span>
            {['Gò Vấp', 'Phú Nhuận', 'Bình Thạnh'].map((district, i) => (
              <motion.span
                key={district}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.9 + i * 0.1 }}
                whileHover={{ y: -2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 text-foreground text-sm font-medium border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300"
              >
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {district}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 3.2 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="label-sm">Scroll</span>
          <div className="w-[1px] h-8 md:h-12 bg-gradient-to-b from-primary to-transparent" />
        </motion.div>
      </motion.div>

      {/* Bottom border accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
}
