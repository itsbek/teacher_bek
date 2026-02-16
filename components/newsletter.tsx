"use client";

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Mail, Check, Loader2, Users, BookOpen, GraduationCap, AlertCircle, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Email validation schema using zod
const emailSchema = z.string().email('Please enter a valid email address');

type SubscriberType = 'student' | 'parent' | 'teacher' | '';

export function Newsletter() {
  const t = useTranslations('newsletter');
  const [formStartedAt] = useState(() => Date.now());
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [subscriberType, setSubscriberType] = useState<SubscriberType>('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const subscriberTypes = [
    { value: 'student', label: 'Student', icon: GraduationCap, description: 'Learning English' },
    { value: 'parent', label: 'Parent', icon: Users, description: 'Supporting my child' },
    { value: 'teacher', label: 'Teacher', icon: BookOpen, description: 'Teaching English' },
  ] as const;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".newsletter-label",
        { opacity: 0, x: -30 },
        {
          opacity: 1, x: 0, duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      gsap.fromTo(".newsletter-title",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: ".newsletter-title",
            start: "top 80%",
            once: true,
          }
        }
      );

      gsap.fromTo(".newsletter-card",
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: ".newsletter-card",
            start: "top 80%",
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Validate email on change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when empty (not submitted yet)
    if (!value) {
      setEmailError(null);
      return;
    }

    // Validate email
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      setEmailError(result.error.issues[0].message);
    } else {
      setEmailError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email before submission
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.issues[0].message);
      return;
    }

    if (!email || !subscriberType) return;

    setStatus('loading');
    setEmailError(null);

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          subscriberType,
          website: '',
          formStartedAt,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Thanks for subscribing!');
        setEmail('');
        setSubscriberType('');
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <section ref={sectionRef} className="relative bg-[#F8F4EC] dark:bg-black py-32 lg:py-40 overflow-hidden">
      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          {/* Label */}
          <div className="newsletter-label flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-foreground/20 dark:bg-white/20" />
            <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
              Free Resources
            </span>
            <div className="h-px w-12 bg-foreground/20 dark:bg-white/20" />
          </div>

          {/* Title */}
          <h2 className="newsletter-title font-sans text-[clamp(32px,5vw,56px)] font-normal text-foreground dark:text-white leading-[1.1] tracking-[-0.01em] mb-4">
            {t('title')}
          </h2>
          <p className="text-foreground/50 dark:text-white/50 text-base lg:text-lg max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="newsletter-card relative max-w-2xl mx-auto p-8 md:p-12 rounded-2xl bg-white dark:bg-[#0A0A0A] border border-foreground/10 dark:border-white/10 overflow-hidden"
        >
          {/* Gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C4A84D]/50 dark:via-[#ECD06F]/50 to-transparent" />

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4"
                >
                  <Check className="w-8 h-8 text-green-400" />
                </motion.div>
                <p className="text-lg font-medium text-foreground dark:text-white mb-2">{t('success')}</p>
                <p className="text-foreground/50 dark:text-white/50 text-sm">{message}</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                {/* Subscriber Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-foreground dark:text-white mb-4 text-center">
                    I am a...
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {subscriberTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = subscriberType === type.value;
                      return (
                        <motion.button
                          key={type.value}
                          type="button"
                          onClick={() => setSubscriberType(type.value)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className={`relative p-4 rounded-xl border text-center transition-all duration-300 ${
                            isSelected
                              ? 'border-[#C4A84D]/50 dark:border-[#ECD06F]/50 bg-[#C4A84D]/5 dark:bg-[#ECD06F]/5'
                              : 'border-foreground/10 dark:border-white/10 hover:border-foreground/20 dark:hover:border-white/20 hover:bg-foreground/5 dark:hover:bg-white/5'
                          }`}
                        >
                          <motion.div
                            animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
                            className={`w-10 h-10 mx-auto mb-2 rounded-full flex items-center justify-center ${
                              isSelected ? 'bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black' : 'bg-foreground/10 dark:bg-white/10 text-foreground/60 dark:text-white/60'
                            }`}
                          >
                            <Icon className="w-5 h-5" />
                          </motion.div>
                          <div className={`font-medium text-sm ${isSelected ? 'text-foreground dark:text-white' : 'text-foreground/80 dark:text-white/80'}`}>{type.label}</div>
                          <div className="text-xs text-foreground/40 dark:text-white/40 mt-0.5">{type.description}</div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Email Input */}
                <div className="relative space-y-2">
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${emailError ? 'text-red-400' : 'text-foreground/40 dark:text-white/40'}`} />
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder={t('emailPlaceholder')}
                      required
                      aria-invalid={!!emailError}
                      aria-describedby={emailError ? "email-error" : undefined}
                      className={`w-full pl-12 pr-4 py-4 rounded-xl border bg-[#FDFBF7] dark:bg-black text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C4A84D]/50 dark:focus:ring-[#ECD06F]/50 focus:border-[#C4A84D] dark:focus:border-[#ECD06F] transition-all ${
                        emailError ? 'border-red-500' : 'border-foreground/10 dark:border-white/10'
                      }`}
                    />
                  </div>
                  <AnimatePresence>
                    {emailError && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center gap-2 text-sm text-red-400"
                      >
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        {emailError}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <motion.button
                    type="submit"
                    disabled={status === 'loading' || !email || !subscriberType || !!emailError}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black font-medium rounded-full hover:shadow-[0_0_40px_rgba(196,168,77,0.3)] dark:hover:shadow-[0_0_40px_rgba(236,208,111,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('subscribing')}
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        {t('subscribe')}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>

                {/* Error Message */}
                {status === 'error' && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-red-400"
                  >
                    {message}
                  </motion.p>
                )}

                {/* Privacy Note */}
                <p className="text-center text-xs text-foreground/30 dark:text-white/30">
                  {t('privacy')}
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Bottom accent */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mt-16 lg:mt-20">
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-foreground/10 dark:to-white/10" />
          <span className="text-[10px] font-medium tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30">
            No Spam, Just Value
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-foreground/10 dark:to-white/10" />
        </div>
      </div>
    </section>
  );
}
