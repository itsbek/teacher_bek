"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

export function Hero() {
  const t = useTranslations('hero');

  const stats = [
    { value: '500+', label: 'Students' },
    { value: '10+', label: 'Years' },
    { value: '25+', label: 'Countries' },
  ];

  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-20">
      <div className="container-lg">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-accent tracking-wider uppercase bg-primary/10 text-primary rounded-full">
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              {t('badge')}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-foreground mb-6"
          >
            {t('title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10"
          >
            {t('subtitle')}
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <a
              href="#contact"
              onClick={() => trackCTAClick('hero', 'contact')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-opacity group"
            >
              {t('cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#courses"
              onClick={() => trackCTAClick('hero', 'courses')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-border font-medium rounded-lg hover:bg-muted transition-colors"
            >
              {t('secondary')}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8 md:gap-12"
          >
            {stats.map((stat, i) => (
              <div key={i} className="group">
                <div className="font-display text-4xl md:text-5xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-accent tracking-wider text-muted-foreground uppercase">
          Scroll
        </span>
        <ArrowDown className="w-4 h-4 text-muted-foreground animate-bounce" />
      </motion.div>
    </section>
  );
}
