"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, Monitor, GraduationCap, Briefcase, ArrowRight, Check } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';

const courseKeys = ['beginner', 'intermediate', 'advanced', 'business'] as const;

const courseIcons = {
  beginner: BookOpen,
  intermediate: Monitor,
  advanced: GraduationCap,
  business: Briefcase,
};

export function Courses() {
  const t = useTranslations('courses');

  const benefits = [
    "Personalized curriculum",
    "Flexible scheduling",
    "Progress tracking",
    "Certificate included"
  ];

  return (
    <section id="courses" className="section bg-muted/30">
      <div className="container-lg">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="label-sm text-primary mb-4 block"
          >
            Courses
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {courseKeys.map((key, index) => {
            const Icon = courseIcons[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="h-full p-8 lg:p-10 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-accent tracking-wider text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Card Title */}
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                    {t(`${key}.title`)}
                  </h3>

                  {/* Card Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {t(`${key}.description`)}
                  </p>

                  {/* Meta Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="inline-flex items-center px-3 py-1 text-xs font-accent tracking-wider text-primary bg-primary/10 rounded-full">
                      {t(`${key}.duration`)}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 text-xs font-accent tracking-wider text-foreground bg-muted rounded-full">
                      {t(`${key}.level`)}
                    </span>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-2 mb-8 pt-6 border-t border-border">
                    {benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href="#contact"
                    onClick={() => trackCTAClick('courses', key)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Consultation CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-block p-8 md:p-12 border-2 border-dashed border-border rounded-lg bg-card/50">
            <span className="label-sm text-accent mb-4 block">Not Sure?</span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-3">
              Let's Talk
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Book a free consultation and I'll recommend the perfect course for your goals.
            </p>
            <a
              href="#contact"
              onClick={() => trackCTAClick('courses', 'consultation')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-accent-foreground font-medium rounded-lg hover:opacity-90 transition-opacity group"
            >
              <span>Free Consultation</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
