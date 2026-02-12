"use client";

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import { SocialIcons, defaultSocialLinks } from './social-icons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const footerRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const ctx = gsap.context(() => {
      // Large brand text reveal
      gsap.fromTo(".footer-brand-large",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            once: true,
          }
        }
      );

      // Brand description
      gsap.fromTo(".footer-brand-desc",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8,
          ease: "power4.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 75%",
            once: true,
          }
        }
      );

      // Navigation columns
      gsap.fromTo(".footer-nav-col",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".footer-nav",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Social links
      gsap.fromTo(".footer-social",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.08,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".footer-social-container",
            start: "top 90%",
            once: true,
          }
        }
      );

      // Bottom bar
      gsap.fromTo(".footer-bottom",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: ".footer-bottom",
            start: "top 95%",
            once: true,
          }
        }
      );

    }, footerRef);

    return () => ctx.revert();
  }, []);

  const currentYear = mounted ? new Date().getFullYear() : 2025;

  const n = useTranslations('nav');

  const navLinks = [
    { href: `/${locale}#about`, label: n('about') },
    { href: `/${locale}#courses`, label: n('courses') },
    { href: `/${locale}/blog`, label: n('blog_link') },
    { href: `/${locale}#testimonials`, label: n('testimonials') },
    { href: `/${locale}#faq`, label: n('faq') },
    { href: `/${locale}#contact`, label: n('contact') },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={footerRef}
      className="relative bg-[#F8F4EC] dark:bg-black overflow-hidden"
    >
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A84D]/50 dark:via-[#ECD06F]/50 to-transparent" />

      {/* Main Footer Content */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 lg:py-32">

        {/* Large Brand Section */}
        <div className="mb-20 lg:mb-28">
          <div className="footer-brand-large mb-8">
            <a href="#" className="inline-block group">
              <span className="font-display text-[clamp(48px,8vw,120px)] font-bold text-foreground dark:text-white leading-none tracking-[-0.03em] group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors duration-500">
                Teacher Bek
              </span>
              <span className="text-[#C4A84D] dark:text-[#ECD06F] text-[clamp(48px,8vw,120px)] font-bold">.</span>
            </a>
          </div>
          <p className="footer-brand-desc text-foreground/50 dark:text-white/50 text-lg md:text-xl leading-[1.7] max-w-xl">
            {t('tagline')}
          </p>
        </div>

        {/* Navigation Grid */}
        <div className="footer-nav grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-20 lg:mb-28">
          {/* Column 1: Navigation */}
          <div className="footer-nav-col">
            <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30 mb-8">
              Navigation
            </h4>
            <nav className="space-y-4">
              {navLinks.slice(0, 3).map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group flex items-center gap-3 text-base text-foreground/60 dark:text-white/60 hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-all duration-300"
                >
                  <span className="w-0 h-px bg-[#C4A84D] dark:bg-[#ECD06F] group-hover:w-4 transition-all duration-300" />
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Column 2: More Links */}
          <div className="footer-nav-col">
            <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30 mb-8">
              More
            </h4>
            <nav className="space-y-4">
              {navLinks.slice(3).map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="group flex items-center gap-3 text-base text-foreground/60 dark:text-white/60 hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-all duration-300"
                >
                  <span className="w-0 h-px bg-[#C4A84D] dark:bg-[#ECD06F] group-hover:w-4 transition-all duration-300" />
                  <span>{link.label}</span>
                </a>
              ))}
            </nav>
          </div>

          {/* Column 3: Certifications */}
          <div className="footer-nav-col">
            <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30 mb-8">
              {t('certifications')}
            </h4>
            <div className="space-y-4">
              {[
                { label: t('tefl') },
                { label: t('tesol') },
                { label: t('experience') },
              ].map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-base text-foreground/60 dark:text-white/60"
                >
                  <span className="w-2 h-2 bg-[#C4A84D] dark:bg-[#ECD06F]" />
                  <span>{cert.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 4: Connect */}
          <div className="footer-nav-col">
            <h4 className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/30 dark:text-white/30 mb-8">
              Connect
            </h4>
            <div className="footer-social-container">
              <SocialIcons
                links={defaultSocialLinks}
                variant="minimal"
                size="md"
                className="flex-wrap gap-3 [&_a]:footer-social [&_a]:w-12 [&_a]:h-12 [&_a]:border-foreground/15 dark:[&_a]:border-white/15 [&_a]:text-foreground/50 dark:[&_a]:text-white/50 [&_a:hover]:text-[#C4A84D] dark:[&_a:hover]:text-[#ECD06F] [&_a:hover]:border-[#C4A84D] dark:[&_a:hover]:border-[#ECD06F] [&_a:hover]:bg-[#C4A84D]/10 dark:[&_a:hover]:bg-[#ECD06F]/10"
              />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom pt-8 border-t border-foreground/10 dark:border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-foreground/40 dark:text-white/40">
              © {currentYear} Teacher Bek. All rights reserved.
            </p>

            {/* Links */}
            <div className="flex items-center gap-8">
              {[
                { href: '#', label: 'Privacy' },
                { href: '#', label: 'Terms' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 text-sm text-foreground/40 dark:text-white/40 hover:text-foreground dark:hover:text-white transition-colors duration-300"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="group flex items-center gap-3 text-sm text-foreground/40 dark:text-white/40 hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-colors duration-300"
            >
              <span>Back to top</span>
              <div className="w-10 h-10 flex items-center justify-center border border-foreground/15 dark:border-white/15 group-hover:border-[#C4A84D] dark:group-hover:border-[#ECD06F] group-hover:bg-[#C4A84D]/10 dark:group-hover:bg-[#ECD06F]/10 transition-all duration-300">
                <ArrowUp className="w-4 h-4 transform group-hover:-translate-y-0.5 transition-transform duration-300" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Decorative background text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <p className="font-display text-[clamp(100px,20vw,300px)] font-bold text-foreground/[0.02] dark:text-white/[0.02] leading-none tracking-tighter whitespace-nowrap text-center translate-y-1/3">
          ENGLISH · TEACHING · CONFIDENCE
        </p>
      </div>
    </footer>
  );
}
