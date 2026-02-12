"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { trackContactFormSubmit } from '@/lib/analytics';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the privacy policy to continue',
  }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  translations: {
    title: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    consent: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
  };
}

export function ContactForm({ translations }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitStatus('success');
      trackContactFormSubmit('inline_form');
      reset();

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus('error');

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground dark:text-white">
          {translations.name} <span className="text-[#C4A84D] dark:text-[#ECD06F]">*</span>
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className={`w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] border text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C4A84D]/50 dark:focus:ring-[#ECD06F]/50 focus:border-[#C4A84D] dark:focus:border-[#ECD06F] transition-colors rounded-lg ${
            errors.name ? 'border-red-500' : 'border-foreground/10 dark:border-white/10'
          }`}
          placeholder="John Doe"
        />
        <AnimatePresence>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.name.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground dark:text-white">
          {translations.email} <span className="text-[#C4A84D] dark:text-[#ECD06F]">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className={`w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] border text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C4A84D]/50 dark:focus:ring-[#ECD06F]/50 focus:border-[#C4A84D] dark:focus:border-[#ECD06F] transition-colors rounded-lg ${
            errors.email ? 'border-red-500' : 'border-foreground/10 dark:border-white/10'
          }`}
          placeholder="john@example.com"
        />
        <AnimatePresence>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.email.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Phone Field (Optional) */}
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium text-foreground dark:text-white">
          {translations.phone} <span className="text-foreground/40 dark:text-white/40">(optional)</span>
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone')}
          className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] border border-foreground/10 dark:border-white/10 text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C4A84D]/50 dark:focus:ring-[#ECD06F]/50 focus:border-[#C4A84D] dark:focus:border-[#ECD06F] transition-colors rounded-lg"
          placeholder="+1234567890"
        />
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground dark:text-white">
          {translations.message} <span className="text-[#C4A84D] dark:text-[#ECD06F]">*</span>
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={4}
          className={`w-full px-4 py-3 bg-[#FDFBF7] dark:bg-[#0A0A0A] border text-foreground dark:text-white placeholder:text-foreground/30 dark:placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-[#C4A84D]/50 dark:focus:ring-[#ECD06F]/50 focus:border-[#C4A84D] dark:focus:border-[#ECD06F] transition-colors resize-none rounded-lg ${
            errors.message ? 'border-red-500' : 'border-foreground/10 dark:border-white/10'
          }`}
          placeholder="Tell me about your English learning goals..."
        />
        <AnimatePresence>
          {errors.message && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.message.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* GDPR Consent Checkbox */}
      <div className="space-y-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              {...register('consent')}
              className="peer sr-only"
            />
            <div className="w-5 h-5 border border-foreground/20 dark:border-white/20 rounded peer-checked:border-[#C4A84D] dark:peer-checked:border-[#ECD06F] peer-checked:bg-[#C4A84D] dark:peer-checked:bg-[#ECD06F] transition-all" />
            <svg
              className="absolute inset-0 w-5 h-5 text-white dark:text-black opacity-0 peer-checked:opacity-100 transition-opacity"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-foreground/50 dark:text-white/50 group-hover:text-foreground/70 dark:group-hover:text-white/70 transition-colors leading-relaxed">
            {translations.consent}
            <a
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C4A84D] dark:text-[#ECD06F] hover:underline underline-offset-2 ml-1"
            >
              privacy policy
            </a>
          </span>
        </label>
        <AnimatePresence>
          {errors.consent && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-red-400 flex items-center gap-2 ml-8"
            >
              <AlertCircle className="w-4 h-4" />
              {errors.consent.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black font-medium rounded-full hover:shadow-[0_0_40px_rgba(196,168,77,0.3)] dark:hover:shadow-[0_0_40px_rgba(236,208,111,0.3)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {translations.submitting}
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {translations.submit}
            </>
          )}
        </button>
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {submitStatus === 'success' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 p-4 border border-green-500/30 bg-green-500/10 rounded-lg"
          >
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-400">{translations.success}</p>
          </motion.div>
        )}

        {submitStatus === 'error' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center gap-3 p-4 border border-red-500/30 bg-red-500/10 rounded-lg"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-400">{translations.error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
