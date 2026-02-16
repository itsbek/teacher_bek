"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Send, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { TobaccoSmoke, PunchedLabel, OxidizedGlow } from './lingua-noir/archaeological-effects';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * LINGUA NOIR - Enhanced Newsletter Component
 *
 * Features:
 * - Telegraph-style input fields
 * - Tobacco smoke tendrils
 * - Oxidized copper accents
 * - Liquid metal submit button
 * - Mechanical typewriter sound effects (optional)
 * - Wax seal success state
 */
export function NewsletterEnhanced() {
  const t = useTranslations('newsletter');
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [subscriberType, setSubscriberType] = useState<'student' | 'parent' | 'teacher'>('student');
  const [formStartedAt] = useState(() => Date.now());

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Telegraph wires drawing in
      gsap.fromTo('.newsletter-wire',
        { scaleX: 0, transformOrigin: 'left' },
        {
          scaleX: 1,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );

      // Section number with chromatic split
      gsap.fromTo('.newsletter-number',
        { opacity: 0, x: -80, filter: 'blur(10px)' },
        {
          opacity: 1,
          x: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          }
        }
      );

      // Headline with liquid reveal
      gsap.fromTo('.newsletter-headline',
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.5,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: '.newsletter-headline',
            start: 'top 75%',
            once: true,
          }
        }
      );

      // Form with scale reveal
      gsap.fromTo('.newsletter-form-container',
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.newsletter-form-container',
            start: 'top 80%',
            once: true,
          }
        }
      );

      // Stamp elements
      gsap.fromTo('.newsletter-stamp',
        { opacity: 0, scale: 0, rotation: -45 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.newsletter-stamps',
            start: 'top 85%',
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

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
        setMessage('Successfully subscribed!');
        setEmail('');

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');

        // Reset after 5 seconds
        setTimeout(() => {
          setStatus('idle');
          setMessage('');
        }, 5000);
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error. Please check your connection.');
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#050505] dark:bg-[#050505] py-32 lg:py-48 overflow-hidden"
    >
      {/* Tobacco smoke tendrils */}
      <TobaccoSmoke />

      {/* Telegraph wires */}
      <div className="absolute top-0 left-0 right-0 flex gap-2 px-6">
        <div className="newsletter-wire h-px bg-gradient-to-r from-transparent via-[#43b3ae] to-transparent flex-1" />
        <div className="newsletter-wire h-px bg-gradient-to-r from-transparent via-[#8a0303] to-transparent flex-1" style={{ animationDelay: '0.2s' }} />
        <div className="newsletter-wire h-px bg-gradient-to-r from-transparent via-[#43b3ae] to-transparent flex-1" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.1) 2px,
            rgba(255, 255, 255, 0.1) 4px
          )`
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)'
        }}
      />

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Section Number */}
        <div className="newsletter-number absolute top-0 left-6 md:left-12 lg:left-20 text-[200px] lg:text-[280px] font-display font-bold leading-none pointer-events-none select-none"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1px rgba(67, 179, 174, 0.08)',
            opacity: 0.5,
          }}
        >
          06
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Headline + Description */}
          <div>
            {/* Label with oxidized copper */}
            <div className="flex items-center gap-4 mb-8">
              <Sparkles className="w-4 h-4 text-[#43b3ae]" />
              <span className="text-[11px] font-mono tracking-[0.2em] uppercase text-[#43b3ae]">
                Stay Informed
              </span>
            </div>

            {/* Headline */}
            <div className="newsletter-headline overflow-hidden mb-8">
              <h2 className="font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#f4ecd8]">
                {t('title') || 'Weekly English Tips'}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#f4ecd8]/60 leading-[1.8] mb-10 max-w-xl">
              {t('description') || 'Get practical English lessons, teaching insights, and language learning strategies delivered to your inbox every Tuesday.'}
            </p>

            {/* Trust stamps */}
            <div className="newsletter-stamps flex flex-wrap gap-4">
              <PunchedLabel className="newsletter-stamp">
                2000+ Subscribers
              </PunchedLabel>
              <PunchedLabel className="newsletter-stamp">
                Weekly Updates
              </PunchedLabel>
              <PunchedLabel className="newsletter-stamp">
                Unsubscribe Anytime
              </PunchedLabel>
            </div>
          </div>

          {/* Right: Telegraph-style Form */}
          <div className="newsletter-form-container">
            <OxidizedGlow intensity="normal">
              <div
                className="relative p-8 md:p-12 border"
                style={{
                  background: 'linear-gradient(145deg, #0d0d0d 0%, #1a1a1a 100%)',
                  borderColor: 'rgba(67, 179, 174, 0.2)',
                }}
              >
                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#43b3ae]/40" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#43b3ae]/40" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#43b3ae]/40" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#43b3ae]/40" />

                <form onSubmit={handleSubmit} className="space-y-6">
                  <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

                  <div>
                    <label htmlFor="newsletter-subscriber-type" className="block text-xs font-mono tracking-[0.15em] uppercase text-[#f4ecd8]/40 mb-3">
                      Subscriber Type
                    </label>
                    <select
                      id="newsletter-subscriber-type"
                      value={subscriberType}
                      onChange={(e) => setSubscriberType(e.target.value as 'student' | 'parent' | 'teacher')}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b-2 font-mono text-sm tracking-[0.08em] uppercase focus:outline-none"
                      style={{
                        color: '#f4ecd8',
                        borderColor: 'rgba(244, 236, 216, 0.2)',
                      }}
                    >
                      <option value="student" style={{ color: '#050505' }}>Student</option>
                      <option value="parent" style={{ color: '#050505' }}>Parent</option>
                      <option value="teacher" style={{ color: '#050505' }}>Teacher</option>
                    </select>
                  </div>

                  {/* Telegraph input */}
                  <div className="relative">
                    <label
                      htmlFor="newsletter-email"
                      className="block text-xs font-mono tracking-[0.15em] uppercase text-[#f4ecd8]/40 mb-3"
                    >
                      Telegraph Address
                    </label>
                    <input
                      type="email"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      required
                      disabled={status === 'loading' || status === 'success'}
                      placeholder="your.address@telegraph.com"
                      className="w-full px-0 py-4 bg-transparent border-0 border-b-2 transition-all duration-300 font-mono text-lg tracking-[0.05em] placeholder:text-[#f4ecd8]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        color: '#f4ecd8',
                        borderColor: isFocused ? '#43b3ae' : 'rgba(244, 236, 216, 0.2)',
                        textShadow: isFocused ? '0 0 10px rgba(67, 179, 174, 0.3)' : 'none',
                      }}
                    />

                    {/* Morse code indicator */}
                    {isFocused && (
                      <div className="absolute -right-8 top-1/2 flex gap-1">
                        <div
                          className="w-1 h-1 rounded-full bg-[#43b3ae] animate-pulse"
                          style={{ animationDelay: '0s' }}
                        />
                        <div
                          className="w-1 h-1 rounded-full bg-[#43b3ae] animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        />
                        <div
                          className="w-1 h-1 rounded-full bg-[#43b3ae] animate-pulse"
                          style={{ animationDelay: '0.4s' }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Status message */}
                  {message && (
                    <div
                      className={`flex items-center gap-3 px-4 py-3 text-sm font-mono ${
                        status === 'success'
                          ? 'text-[#43b3ae] bg-[#43b3ae]/10 border border-[#43b3ae]/30'
                          : 'text-[#ff6b35] bg-[#ff6b35]/10 border border-[#ff6b35]/30'
                      }`}
                    >
                      {status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 shrink-0" />
                      )}
                      <span>{message}</span>
                    </div>
                  )}

                  {/* Submit button - Liquid metal */}
                  <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="group relative w-full px-8 py-5 text-sm font-semibold tracking-[0.1em] uppercase overflow-hidden transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(135deg, #43b3ae 0%, #3d9994 100%)',
                      color: '#050505',
                      boxShadow: '0 0 30px rgba(67, 179, 174, 0.3)',
                    }}
                  >
                    {/* Liquid expand effect */}
                    <div
                      className="absolute inset-0 bg-[#7df9ff] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
                    />

                    {/* Content */}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {status === 'loading' ? (
                        <>
                          <span className="animate-pulse">Transmitting...</span>
                        </>
                      ) : status === 'success' ? (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          <span>Subscribed!</span>
                        </>
                      ) : (
                        <>
                          <span>Send Telegraph</span>
                          <Send className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </span>
                  </button>

                  {/* Privacy note */}
                  <p className="text-xs text-[#f4ecd8]/30 font-mono text-center">
                    No spam. Unsubscribe via telegraph at any time.
                  </p>
                </form>

                {/* Wax seal success overlay */}
                {status === 'success' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-[#0d0d0d]/95 backdrop-blur-sm animate-in fade-in duration-500">
                    <div className="text-center">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#43b3ae]/20 border-2 border-[#43b3ae] mb-6">
                        <CheckCircle2 className="w-10 h-10 text-[#43b3ae]" />
                      </div>
                      <p className="text-2xl font-display font-semibold text-[#f4ecd8] mb-2">
                        Telegraph Received
                      </p>
                      <p className="text-sm text-[#f4ecd8]/60 font-mono">
                        Weekly updates confirmed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </OxidizedGlow>
          </div>

        </div>
      </div>

      {/* Bottom telegraph line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#43b3ae]/30 to-transparent" />
    </section>
  );
}
