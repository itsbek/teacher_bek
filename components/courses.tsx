"use client";

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Users, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

const courseData = [
  { key: 'beginner', icon: BookOpen, accent: 'from-orange-500 to-amber-500' },
  { key: 'intermediate', icon: Users, accent: 'from-primary to-orange-400' },
  { key: 'advanced', icon: GraduationCap, accent: 'from-rose-500 to-primary' },
  { key: 'business', icon: Briefcase, accent: 'from-amber-500 to-orange-500' },
] as const;

export function Courses() {
  const t = useTranslations('courses');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="courses" className="section relative overflow-hidden bg-background">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background number */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.015 } : {}}
        transition={{ duration: 1 }}
        className="absolute -left-[10%] top-1/2 -translate-y-1/2 font-display text-[30vw] font-bold text-foreground select-none pointer-events-none hidden lg:block"
      >
        04
      </motion.div>

      <div className="container-2xl relative">
        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            Courses
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-foreground mb-6"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {courseData.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.key}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="group"
              >
                <div className="card-feature h-full p-6 md:p-8 lg:p-10">
                  {/* Top Row: Number + Icon */}
                  <div className="flex items-start justify-between mb-6 md:mb-8">
                    <span className="font-mono text-xs text-muted-foreground tracking-wider">
                      0{index + 1}
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center bg-gradient-to-br ${course.accent}`}
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </motion.div>
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-foreground mb-3 md:mb-4 group-hover:text-primary transition-colors duration-300">
                    {t(`${course.key}.title`)}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-6">
                    {t(`${course.key}.description`)}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6 md:mb-8">
                    <span className="badge">
                      {t(`${course.key}.duration`)}
                    </span>
                    <span className="tag">
                      {t(`${course.key}.level`)}
                    </span>
                  </div>

                  {/* CTA */}
                  <a
                    href="#contact"
                    onClick={() => trackCTAClick('courses', course.key)}
                    className="link-arrow text-sm"
                  >
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 md:mt-24"
        >
          <div className="relative p-8 md:p-12 lg:p-16 bg-foreground text-background overflow-hidden">
            {/* Corner decorations */}
            <div className="corner-decoration corner-tl top-4 left-4" />
            <div className="corner-decoration corner-br bottom-4 right-4" />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 md:gap-8">
              <div className="max-w-lg">
                <span className="label text-background/60 mb-3 block">Not sure where to start?</span>
                <h3 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-background mb-3">
                  Let's Talk
                </h3>
                <p className="text-background/70 text-base md:text-lg">
                  Book a free consultation and I'll recommend the perfect approach for your goals.
                </p>
              </div>
              <motion.a
                href="#contact"
                onClick={() => trackCTAClick('courses', 'consultation')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-background text-foreground font-semibold text-base transition-all duration-300 hover:bg-primary hover:text-primary-foreground group shrink-0"
              >
                <span>Free Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
