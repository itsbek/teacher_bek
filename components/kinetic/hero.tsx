"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react';
import { gsap } from 'gsap';

/**
 * KINETIC HERO COMPONENT
 *
 * Features:
 * - Bouncing kinetic typography
 * - Floating geometric shapes
 * - Gradient text animations
 * - Glass morphism stat cards
 * - Parallax scroll effects
 * - Interactive hover states
 */
export function KineticHero() {
  const t = useTranslations('hero');
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    // Floating animation for geometric shapes
    const shapes = document.querySelectorAll('.geometric-shape');
    shapes.forEach((shape, index) => {
      gsap.to(shape, {
        y: '+=30',
        x: '+=20',
        rotation: '+=15',
        duration: 3 + index * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Gradient animation for text
    const gradientText = document.querySelector('.gradient-animated-text');
    if (gradientText) {
      gsap.to(gradientText, {
        backgroundPosition: '200% center',
        duration: 8,
        repeat: -1,
        ease: 'none',
      });
    }
  }, []);

  const stats = [
    { icon: Target, value: '2000+', label: t('stats.students') || 'Students Taught', color: 'primary' },
    { icon: Zap, value: '3+', label: t('stats.experience') || 'Years Experience', color: 'secondary' },
    { icon: Sparkles, value: '7', label: t('stats.success') || 'Languages Spoken', color: 'accent' },
  ];

  return (
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center py-20 px-6 md:px-12 lg:px-20 overflow-hidden">

      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 animate-gradient-shift" />

      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-[10%] w-32 h-32 bg-primary/20 rounded-xl geometric-shape blur-xl" />
      <div className="absolute top-40 right-[15%] w-24 h-24 bg-secondary/20 rounded-full geometric-shape blur-xl" />
      <div className="absolute bottom-40 left-[20%] w-40 h-40 bg-accent/20 rounded-lg geometric-shape blur-xl rotate-45" />
      <div className="absolute bottom-60 right-[25%] w-28 h-28 bg-purple/20 rounded-2xl geometric-shape blur-xl" />

      {/* Content with parallax */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 max-w-6xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 glass-card-primary rounded-full"
        >
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">
            {t('badge') || 'Professional English Teacher'}
          </span>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
        </motion.div>

        {/* Main heading with kinetic typography */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 font-display"
        >
          {/* Split text into words for individual animation */}
          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none mb-4">
            {(t('titleLine1') || 'Learn').split('').map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.05,
                  type: 'spring',
                  stiffness: 200,
                }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2 },
                }}
              >
                {letter === ' ' ? '\u00A0' : letter}
              </motion.span>
            ))}
          </span>

          <span className="block text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none">
            <span
              className="gradient-animated-text bg-clip-text text-transparent"
              style={{
                background: 'var(--gradient-rainbow)',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
              }}
            >
              {t('titleLine2') || 'English'}
            </span>
            <motion.span
              className="inline-block ml-4"
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: 'mirror',
              }}
            >
              ✨
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto"
        >
          {t('subtitle') || 'Small groups, real conversations, and a safe classroom designed for focused learning in Ho Chi Minh City.'}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          {/* Primary CTA */}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-primary-foreground rounded-full gradient-primary shadow-glow-primary hover:shadow-xl transition-all duration-300"
          >
            <span className="relative z-10">{t('cta') || 'Start Learning'}</span>
            <ArrowRight className="relative z-10 w-5 h-5 transition-transform group-hover:translate-x-1" />

            {/* Shimmer effect */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent shimmer" />
            </div>
          </motion.a>

          {/* Secondary CTA */}
          <motion.a
            href="#courses"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-foreground glass-card rounded-full hover:glass-card-primary transition-all duration-300"
          >
            <span>{t('secondary') || 'View Courses'}</span>
          </motion.a>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className={`glass-card-${stat.color} rounded-2xl p-6 hover:shadow-glow-${stat.color} transition-all duration-300 group`}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 bg-${stat.color}/20 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-${stat.color}`} />
                </div>
                <div className={`text-4xl font-bold font-display mb-2 text-${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-sm font-medium">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-current rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
