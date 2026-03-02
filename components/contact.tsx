"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ContactForm } from './contact-form';
import { trackCTAClick } from '@/lib/analytics';
import { ArrowRight, MapPin, Mail, Clock, Shield, Award } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Official brand icons
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Official Zalo icon
const ZaloIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 48 48" fill="currentColor" className={className}>
    <path d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z M34.5,29.5c0,1.381-1.119,2.5-2.5,2.5H16c-1.381,0-2.5-1.119-2.5-2.5v-11c0-1.381,1.119-2.5,2.5-2.5h16c1.381,0,2.5,1.119,2.5,2.5V29.5z"/>
    <path d="M28.3,20.6l-3.8,3.8l-3.8-3.8c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l3.8,3.8l-3.8,3.8c-0.4,0.4-0.4,1,0,1.4c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l3.8-3.8l3.8,3.8c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3c0.4-0.4,0.4-1,0-1.4l-3.8-3.8l3.8-3.8c0.4-0.4,0.4-1,0-1.4S28.7,20.2,28.3,20.6z"/>
  </svg>
);

export function Contact() {
  const t = useTranslations('cta');
  const contactT = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);

  const contactMethods = [
    {
      icon: WhatsAppIcon,
      label: "WhatsApp",
      description: "Quick responses",
      action: "Chat Now",
      href: "https://wa.me/+84123456789?text=Hi! I'm interested in English lessons.",
    },
    {
      icon: ZaloIcon,
      label: "Zalo",
      description: "Popular in Vietnam",
      action: "Message",
      href: "https://zalo.me/0123456789",
    },
    {
      icon: Mail,
      label: "Email",
      description: "Detailed inquiries",
      action: "Send Email",
      href: "mailto:hello@teacherbek.com",
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number
      gsap.fromTo(".contact-number",
        { opacity: 0, x: -60 },
        {
          opacity: 1, x: 0, duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Label with line
      gsap.fromTo(".contact-label-line",
        { scaleX: 0 },
        {
          scaleX: 1, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      gsap.fromTo(".contact-label",
        { opacity: 0, x: -20 },
        {
          opacity: 1, x: 0, duration: 0.6, delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Title words
      gsap.fromTo(".contact-title-word",
        { y: 60, opacity: 0, rotateX: -45 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-title",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Subtitle
      gsap.fromTo(".contact-subtitle",
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6,
          scrollTrigger: {
            trigger: ".contact-subtitle",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Methods with stagger
      gsap.fromTo(".contact-method",
        { y: 40, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, stagger: 0.12,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-methods",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Location card
      gsap.fromTo(".contact-location",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-location",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Form with scale
      gsap.fromTo(".contact-form",
        { y: 50, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".contact-form",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Trust badges
      gsap.fromTo(".trust-badge",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 0.5, stagger: 0.08,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".trust-badges",
            start: "top 90%",
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = ["Let's", "Start", "Your", "Journey"];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative bg-[#FDFBF7] dark:bg-[#0A0A0A] py-32 lg:py-48 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-96 h-96 rounded-full border border-[#C4A84D]/5 dark:border-[#ECD06F]/5" />
        <div className="absolute bottom-40 left-[5%] w-64 h-64 rounded-full bg-[#C4A84D]/3 dark:bg-[#ECD06F]/3" />
        <div className="absolute top-1/3 left-[20%] w-2 h-2 bg-[#C4A84D] dark:bg-[#ECD06F] rounded-full" />
      </div>

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Header */}
        <div className="mb-20 lg:mb-24">
          {/* Section indicator */}
          <div className="flex items-start gap-6 mb-8">
            <span className="contact-number text-[100px] lg:text-[140px] font-display font-bold text-foreground/[0.04] dark:text-white/[0.04] leading-none -mt-6">
              06
            </span>
            <div className="pt-4">
              {/* Label */}
              <div className="flex items-center gap-4 mb-6">
                <div className="contact-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#ECD06F] origin-left" />
                <span className="contact-label text-[13px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
                  Get in Touch
                </span>
              </div>

              {/* Title */}
              <h2 className="contact-title font-display text-[clamp(36px,5vw,72px)] font-semibold text-foreground dark:text-white leading-[1.0] tracking-[-0.03em] mb-6">
                {titleWords.map((word, i) => (
                  <span key={i} className="contact-title-word inline-block mr-[0.2em]" style={{ transformStyle: 'preserve-3d' }}>
                    {word}
                  </span>
                ))}
              </h2>
            </div>
          </div>

          {/* Subtitle */}
          <p className="contact-subtitle text-lg md:text-xl text-foreground/50 dark:text-white/50 max-w-xl leading-[1.8] ml-auto lg:mr-20">
            {contactT('subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left - Contact Methods */}
          <div>
            {/* Quick Contact */}
            <div className="contact-methods space-y-4 mb-12">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? "_blank" : undefined}
                    rel={method.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    onClick={() => trackCTAClick('contact', method.label.toLowerCase())}
                    className="contact-method group flex items-center gap-5 p-6 border border-foreground/10 dark:border-white/10 bg-white dark:bg-black hover:border-[#C4A84D]/40 dark:hover:border-[#ECD06F]/40 transition-all duration-500"
                  >
                    {/* Number */}
                    <span className="text-[13px] font-mono text-foreground/20 dark:text-white/20">
                      0{index + 1}
                    </span>

                    {/* Icon */}
                    <div className="w-14 h-14 flex items-center justify-center border border-foreground/10 dark:border-white/10 group-hover:border-[#C4A84D]/50 dark:group-hover:border-[#ECD06F]/50 group-hover:bg-[#C4A84D]/10 dark:group-hover:bg-[#ECD06F]/10 transition-all duration-500">
                      <Icon className="w-6 h-6 text-foreground/50 dark:text-white/50 group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors duration-500" />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground dark:text-white group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors duration-300">{method.label}</p>
                      <p className="text-sm text-foreground/40 dark:text-white/40">{method.description}</p>
                    </div>

                    {/* Action */}
                    <span className="text-sm font-medium text-[#C4A84D] dark:text-[#ECD06F] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2">
                      {method.action}
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Location Info */}
            <div className="contact-location p-8 lg:p-10 border border-[#C4A84D]/30 dark:border-[#ECD06F]/30 bg-gradient-to-br from-[#C4A84D]/5 dark:from-[#ECD06F]/5 via-transparent to-transparent">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 flex items-center justify-center bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg text-foreground dark:text-white mb-2">{contactT('location.title')}</p>
                  <p className="text-[#C4A84D] dark:text-[#ECD06F] font-medium mb-4">
                    Golden Mansion 1, 119 Phổ Quang, Phú Nhuận
                  </p>
                  <p className="text-foreground/50 dark:text-white/50 text-sm mb-6 leading-relaxed">
                    {contactT('location.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Gò Vấp', 'Phú Nhuận', 'Bình Thạnh'].map((district) => (
                      <span
                        key={district}
                        className="text-[13px] font-medium tracking-[0.08em] uppercase px-4 py-2 border border-foreground/10 dark:border-white/10 text-foreground/50 dark:text-white/50"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="contact-form">
            <div className="p-8 lg:p-12 border border-foreground/10 dark:border-white/10 bg-white dark:bg-black">
              {/* Form header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 flex items-center justify-center bg-[#C4A84D]/10 dark:bg-[#ECD06F]/10">
                  <Mail className="w-5 h-5 text-[#C4A84D] dark:text-[#ECD06F]" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground dark:text-white">
                    {contactT('form.title')}
                  </h3>
                  <p className="text-sm text-foreground/40 dark:text-white/40">Usually responds within 24 hours</p>
                </div>
              </div>

              <ContactForm
                translations={{
                  title: contactT('form.title'),
                  name: contactT('form.name'),
                  email: contactT('form.email'),
                  phone: contactT('form.phone'),
                  message: contactT('form.message'),
                  consent: contactT('form.consent'),
                  submit: contactT('form.submit'),
                  submitting: contactT('form.submitting'),
                  success: contactT('form.success'),
                  error: contactT('form.error'),
                }}
              />
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="trust-badges flex flex-wrap justify-center gap-4 mt-20 lg:mt-28 pt-12 border-t border-foreground/10 dark:border-white/10">
          {[
            { icon: Award, label: 'TESOL Certified' },
            { icon: Award, label: 'PGCE Certified' },
            { icon: Clock, label: '3 Years in Vietnam' },
            { icon: Shield, label: '2000+ Students' },
          ].map((badge, index) => (
            <div
              key={badge.label}
              className="trust-badge inline-flex items-center gap-3 px-5 py-3 border border-foreground/10 dark:border-white/10 bg-white/50 dark:bg-white/5"
            >
              <badge.icon className="w-4 h-4 text-[#C4A84D] dark:text-[#ECD06F]" />
              <span className="text-[13px] font-medium tracking-[0.08em] uppercase text-foreground/60 dark:text-white/60">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
