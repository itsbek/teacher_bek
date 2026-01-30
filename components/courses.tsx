"use client";

import { useTranslations } from 'next-intl';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BookOpen, Users, GraduationCap, Briefcase, ArrowRight } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';
import { Tilt } from '@/components/ui/tilt';
import { Magnetic } from '@/components/ui/magnetic';
import { Reveal } from '@/components/ui/reveal';

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

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  return (
    <section ref={sectionRef} id="courses" className="relative bg-background">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background number */}
      <motion.div
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 50]) }}
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.015 } : {}}
        transition={{ duration: 1 }}
        className="absolute -left-[5%] top-1/4 font-display text-[25vw] font-bold text-foreground select-none pointer-events-none hidden lg:block"
      >
        02
      </motion.div>

      <div className="container-2xl relative py-20 md:py-32">
        {/* Section Header */}
        <div className="max-w-4xl mb-16 md:mb-24">
          <Reveal>
            <div className="eyebrow mb-6">Courses</div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-foreground mb-6 font-display text-4xl md:text-5xl lg:text-7xl font-semibold tracking-tight">
              {t('title')}
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-muted-foreground text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed">
              {t('subtitle')}
            </p>
          </Reveal>
        </div>

        {/* Responsive Grid Layout - Clean & Standard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {courseData.map((course, index) => {
            const Icon = course.icon;
            return (
              <motion.div
                key={course.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="h-full"
              >
                <Tilt>
                  <div className="card-feature h-full p-8 relative overflow-hidden flex flex-col justify-between shadow-lg group hover:shadow-2xl transition-all duration-500 border border-primary/10 bg-card">

                    {/* Top Content */}
                    <div>
                      <div className="flex items-start justify-between mb-8">
                        <span className="font-mono text-xs text-muted-foreground tracking-wider">0{index + 1}</span>
                        <div className={`w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br ${course.accent} text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      <h3 className="font-display text-2xl font-semibold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                        {t(`${course.key}.title`)}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                        {t(`${course.key}.description`)}
                      </p>
                    </div>

                    {/* Bottom Content */}
                    <div>
                      <div className="flex flex-wrap gap-2 mb-8">
                        <span className="badge">{t(`${course.key}.duration`)}</span>
                        <span className="tag">{t(`${course.key}.level`)}</span>
                      </div>

                      <Magnetic strength={0.2}>
                        <a
                          href="#contact"
                          onClick={() => trackCTAClick('courses', course.key)}
                          className="link-arrow text-sm inline-flex items-center gap-2 group/link w-full justify-between pt-6 border-t border-border"
                        >
                          <span className="font-medium">Enroll Now</span>
                          <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                        </a>
                      </Magnetic>
                    </div>

                    {/* Gloss Reflection Layer */}
                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 md:mt-32 lg:mt-48"
        >
          <div className="relative p-8 md:p-16 lg:p-24 bg-foreground text-background overflow-hidden">
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12">
              <div className="max-w-xl">
                <span className="label text-background/60 mb-4 block font-mono uppercase tracking-[0.2em] text-xs">Inquiries & Admissions</span>
                <h3 className="font-display text-3xl md:text-4xl lg:text-6xl font-bold text-background mb-6 leading-[1.1]">
                  Personalized paths to fluency.
                </h3>
                <p className="text-background/70 text-lg md:text-xl">
                  Not sure which class fits your current level? Let's have a brief conversation to evaluate your goals and finding the right starting point.
                </p>
              </div>
              <motion.a
                href="#contact"
                onClick={() => trackCTAClick('courses', 'consultation')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-primary text-primary-foreground font-semibold text-lg transition-all duration-300 hover:bg-primary/90 group shrink-0 shadow-lg"
              >
                <span>Free Evaluation</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section >
  );
}
