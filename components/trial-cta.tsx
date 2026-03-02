"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function TrialCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Label animation
      gsap.fromTo(".trial-label",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Title animation
      gsap.fromTo(".trial-title",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: ".trial-title",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Description animation
      gsap.fromTo(".trial-description",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6,
          scrollTrigger: {
            trigger: ".trial-description",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Button animation
      gsap.fromTo(".trial-button",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5,
          scrollTrigger: {
            trigger: ".trial-button",
            start: "top 90%",
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="trial"
      className="relative bg-[#F8F4EC] dark:bg-[#0A0A0A] py-32 lg:py-40 overflow-hidden"
    >
      {/* Gradient accent background */}
      <div
        className="absolute inset-0 pointer-events-none dark:block hidden"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(236,208,111,0.05) 0%, transparent 60%)
          `,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none dark:hidden"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 50%, rgba(196,168,77,0.08) 0%, transparent 60%)
          `,
        }}
      />

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center max-w-2xl mx-auto">
          {/* Label */}
          <div className="trial-label flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-4 h-4 text-[#C4A84D] dark:text-[#ECD06F]" />
            <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
              Free Assessment
            </span>
            <Sparkles className="w-4 h-4 text-[#C4A84D] dark:text-[#ECD06F]" />
          </div>

          {/* Title */}
          <h2 className="trial-title font-sans text-[clamp(32px,5vw,56px)] font-normal text-foreground dark:text-white leading-[1.1] tracking-[-0.01em] mb-6">
            Want to Give It a <span className="text-[#C4A84D] dark:text-[#ECD06F]">Try?</span>
          </h2>

          {/* Description */}
          <p className="trial-description text-foreground/50 dark:text-white/50 text-base lg:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            Book a free assessment and we&apos;ll figure out if this is a good fit.
            No pressure, just a conversation about what you&apos;re looking for.
          </p>

          {/* CTA Button */}
          <a
            href="#contact"
            className="trial-button group inline-flex items-center gap-3 px-8 py-4 bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black text-sm font-medium tracking-[0.02em] uppercase rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_60px_rgba(196,168,77,0.4)] dark:hover:shadow-[0_0_60px_rgba(236,208,111,0.4)]"
          >
            <span>Get in Touch</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Trust indicators */}
          <div className="mt-12 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl font-normal text-foreground dark:text-white">Free</div>
              <div className="text-[13px] font-medium tracking-[0.1em] uppercase text-foreground/40 dark:text-white/40 mt-1">Assessment</div>
            </div>
            <div className="w-px h-10 bg-foreground/10 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-normal text-foreground dark:text-white">30 min</div>
              <div className="text-[13px] font-medium tracking-[0.1em] uppercase text-foreground/40 dark:text-white/40 mt-1">Session</div>
            </div>
            <div className="w-px h-10 bg-foreground/10 dark:bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-normal text-foreground dark:text-white">No</div>
              <div className="text-[13px] font-medium tracking-[0.1em] uppercase text-foreground/40 dark:text-white/40 mt-1">Commitment</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-foreground/10 dark:via-white/10 to-transparent" />
    </section>
  );
}
