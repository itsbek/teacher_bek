"use client";

import { useTranslations, useLocale } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { MessageCircle, Send, Mail, ArrowUpRight } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const footerRef = useRef<HTMLElement>(null);
  const isInView = useInView(footerRef, { once: true, margin: "-50px" });
  const [mounted, setMounted] = useState(false);

  const whatsappNumber = "+1234567890";
  const telegramUsername = "your_telegram";
  const email = "hello@englishwithconfidence.com";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only compute year on client to avoid hydration mismatch
  const currentYear = mounted ? new Date().getFullYear() : 2025;

  const socialLinks = [
    { name: 'WhatsApp', href: `https://wa.me/${whatsappNumber}`, icon: MessageCircle },
    { name: 'Zalo', href: `https://zalo.me/${telegramUsername}`, icon: Send },
    { name: 'Email', href: `mailto:${email}`, icon: Mail },
  ];

  const navLinks = [
    { href: `/${locale}#courses`, label: 'Courses' },
    { href: `/${locale}/blog`, label: 'Blog' },
    { href: `/${locale}#testimonials`, label: 'Testimonials' },
    { href: `/${locale}#faq`, label: 'FAQ' },
    { href: `/${locale}#contact`, label: 'Contact' },
  ];

  return (
    <footer ref={footerRef} className="relative bg-foreground text-background">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />

      <div className="container-2xl py-16 lg:py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
          >
            <a href="#" className="inline-flex items-baseline gap-0.5 mb-6 group">
              <span className="font-display text-2xl font-bold text-background group-hover:text-primary transition-colors">
                English
              </span>
              <span className="text-primary font-display text-2xl font-bold">.</span>
            </a>
            <p className="text-background/60 text-sm leading-relaxed max-w-sm mb-8">
              {t('tagline')}
            </p>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 flex items-center justify-center border border-background/20 text-background/60 hover:text-primary hover:border-primary transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6">
              Navigation
            </h4>
            <nav className="space-y-3">
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.15 + index * 0.05 }}
                  className="block text-sm text-background/60 hover:text-primary transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="font-mono text-[10px] tracking-[0.3em] uppercase text-background/40 mb-6">
              {t('certifications')}
            </h4>
            <div className="space-y-3">
              {[
                { label: t('tefl') },
                { label: t('tesol') },
                { label: t('experience') },
              ].map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 text-sm text-background/60"
                >
                  <span className="w-1 h-1 bg-primary" />
                  <span>{cert.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="pt-8 border-t border-background/10"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-background/40">
              © {currentYear} English with Confidence. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {[
                { href: '#', label: 'Privacy' },
                { href: '#', label: 'Terms' },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-1 text-xs text-background/40 hover:text-background transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
