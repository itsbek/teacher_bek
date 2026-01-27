"use client";

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Award, BookOpen, GraduationCap, MapPin, Shield, Users } from 'lucide-react';

export function About() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const credentials = [
    {
      icon: Award,
      title: t('credentials.tesol'),
      description: t('credentials.tesolDesc'),
    },
    {
      icon: GraduationCap,
      title: t('credentials.pgce'),
      description: t('credentials.pgceDesc'),
    },
    {
      icon: BookOpen,
      title: t('credentials.delta'),
      description: t('credentials.deltaDesc'),
    },
  ];

  const classroomFeatures = [
    {
      icon: Shield,
      title: t('classroom.features.cctv'),
      description: t('classroom.features.cctvDesc'),
    },
    {
      icon: Users,
      title: t('classroom.features.comfort'),
      description: t('classroom.features.comfortDesc'),
    },
    {
      icon: BookOpen,
      title: t('classroom.features.materials'),
      description: t('classroom.features.materialsDesc'),
    },
  ];

  return (
    <section ref={sectionRef} id="about" className="relative py-20 md:py-32 overflow-hidden bg-[#FDFCF8] dark:bg-[#0A0A0C]">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0F0F11]/10 dark:via-[#F5F1E8]/10 to-transparent" />

      {/* Background decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.02 } : {}}
        transition={{ duration: 1 }}
        className="absolute -right-[10%] top-1/2 -translate-y-1/2 font-display text-[25vw] font-bold text-[#0F0F11] dark:text-[#F5F1E8] select-none pointer-events-none hidden lg:block"
      >
        &
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase text-[#C85C3F] dark:text-[#E88C73] mb-4"
          >
            {t('label')}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[#0F0F11] dark:text-[#F5F1E8] leading-[1.1] mb-6"
            style={{ letterSpacing: '-0.02em' }}
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-sans text-lg md:text-xl text-[#0F0F11]/60 dark:text-[#F5F1E8]/60 max-w-2xl"
          >
            {t('intro')}
          </motion.p>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Story */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-7"
          >
            {/* Story Content */}
            <div className="relative p-8 md:p-10 bg-white/50 dark:bg-[#111113]/50 backdrop-blur-sm border border-[#0F0F11]/10 dark:border-[#F5F1E8]/10">
              {/* Accent line */}
              <div className="absolute top-0 left-8 md:left-10 w-16 h-[2px] bg-gradient-to-r from-[#C85C3F] to-[#B8956A] dark:from-[#E88C73] dark:to-[#D4B896]" />

              <h3 className="font-display text-2xl md:text-3xl font-semibold text-[#0F0F11] dark:text-[#F5F1E8] mb-6">
                {t('story.title')}
              </h3>

              <div className="space-y-4 font-sans text-[#0F0F11]/70 dark:text-[#F5F1E8]/70 leading-relaxed">
                <p>{t('story.p1')}</p>
                <p>{t('story.p2')}</p>
                <p>{t('story.p3')}</p>
              </div>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-4 mt-8"
            >
              {[
                { value: t('stats.students'), label: t('stats.studentsLabel') },
                { value: t('stats.years'), label: t('stats.yearsLabel') },
                { value: t('stats.schools'), label: t('stats.schoolsLabel') },
              ].map((stat, index) => (
                <div key={index} className="text-center p-4 bg-[#0F0F11] dark:bg-[#F5F1E8] text-[#F5F1E8] dark:text-[#0F0F11]">
                  <div className="font-display text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[9px] tracking-[0.2em] uppercase opacity-60 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Credentials & Classroom */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 space-y-8"
          >
            {/* Credentials */}
            <div>
              <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0F0F11]/40 dark:text-[#F5F1E8]/40 mb-6">
                {t('credentials.title')}
              </h3>
              <div className="space-y-4">
                {credentials.map((cred, index) => {
                  const Icon = cred.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-white/50 dark:bg-[#111113]/50 border border-[#0F0F11]/10 dark:border-[#F5F1E8]/10 hover:border-[#C85C3F]/30 dark:hover:border-[#E88C73]/30 transition-colors"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-[#C85C3F]/10 dark:bg-[#E88C73]/10 text-[#C85C3F] dark:text-[#E88C73]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-display text-sm font-semibold text-[#0F0F11] dark:text-[#F5F1E8]">
                          {cred.title}
                        </p>
                        <p className="font-sans text-xs text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 mt-0.5">
                          {cred.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Classroom */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="p-6 bg-gradient-to-br from-[#C85C3F]/5 to-[#B8956A]/5 dark:from-[#E88C73]/5 dark:to-[#D4B896]/5 border border-[#C85C3F]/20 dark:border-[#E88C73]/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#0F0F11] dark:bg-[#F5F1E8] text-[#F5F1E8] dark:text-[#0F0F11]">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-display text-lg font-semibold text-[#0F0F11] dark:text-[#F5F1E8]">
                    {t('classroom.title')}
                  </h4>
                  <p className="font-mono text-[10px] tracking-wider text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 mt-1">
                    {t('classroom.address')}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {classroomFeatures.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[#C85C3F] dark:text-[#E88C73]" />
                      <span className="font-sans text-sm text-[#0F0F11]/70 dark:text-[#F5F1E8]/70">
                        {feature.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Philosophy Quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="relative"
            >
              <div className="absolute -left-2 top-0 text-6xl font-display text-[#C85C3F]/20 dark:text-[#E88C73]/20 leading-none">
                "
              </div>
              <blockquote className="pl-8 font-display text-lg md:text-xl italic text-[#0F0F11]/80 dark:text-[#F5F1E8]/80">
                {t('philosophy.description')}
              </blockquote>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
