"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MessageCircle, Send, Mail } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');

  const whatsappNumber = "+1234567890";
  const telegramUsername = "your_telegram";
  const email = "hello@englishwithconfidence.com";

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/${whatsappNumber}`,
      icon: MessageCircle,
    },
    {
      name: 'Telegram',
      href: `https://t.me/${telegramUsername}`,
      icon: Send,
    },
    {
      name: 'Email',
      href: `mailto:${email}`,
      icon: Mail,
    },
  ];

  const navLinks = [
    { href: '#courses', label: 'Courses' },
    { href: '#testimonials', label: 'Testimonials' },
    { href: '#faq', label: 'FAQ' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container-lg py-12 lg:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <a href="#" className="inline-block mb-4">
              <span className="font-display text-xl font-semibold text-foreground">
                English<span className="text-accent">.</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
              {t('tagline')}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <a
                    key={index}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    aria-label={link.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </motion.div>

          {/* Navigation Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="label-sm mb-4">Navigation</h4>
            <nav className="space-y-3">
              {navLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          {/* Certifications Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="label-sm mb-4">{t('certifications')}</h4>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span>{t('tefl')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span>{t('tesol')}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                <span>{t('experience')}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              {currentYear} English with Confidence. All rights reserved.
            </p>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
