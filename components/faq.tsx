"use client";

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Plus, ArrowRight } from 'lucide-react';

const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const;

export function FAQ() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="section bg-muted/30">
      <div className="container-lg">
        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-12 lg:gap-16">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="label-sm text-primary mb-4 block">FAQ</span>
            <h2 className="text-foreground mb-4">{t('title')}</h2>
            <p className="text-muted-foreground mb-8">
              Everything you need to know about my English lessons and teaching approach.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:gap-3 transition-all"
            >
              <span>Still have questions?</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* FAQ Items */}
          <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {faqKeys.map((key, index) => {
              const isOpen = openIndex === index;
              const questionKey = key;
              const answerKey = key.replace('q', 'a') as `a${number}`;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className={`w-full text-left p-6 border rounded-lg transition-all duration-300 ${
                      isOpen
                        ? 'bg-card border-primary/30 shadow-sm'
                        : 'bg-card border-border hover:border-primary/20'
                    }`}
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <span className="text-xs font-accent tracking-wider text-muted-foreground pt-1">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <h3
                          className="font-display text-lg font-semibold text-foreground pr-4"
                          itemProp="name"
                        >
                          {t(questionKey)}
                        </h3>
                      </div>
                      <div
                        className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                          isOpen
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Plus
                          className={`w-4 h-4 transition-transform duration-300 ${
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
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p
                            className="text-muted-foreground leading-relaxed pt-4 pl-10"
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
    </section>
  );
}
