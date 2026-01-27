"use client";

import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ContactForm } from './contact-form';
import { trackCTAClick } from '@/lib/analytics';
import { MessageCircle, Send, Mail, ArrowRight, MapPin } from 'lucide-react';

export function Contact() {
  const t = useTranslations('cta');
  const contactT = useTranslations('contact');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const whatsappNumber = "+1234567890";
  const telegramUsername = "your_telegram";
  const email = "hello@englishwithconfidence.com";

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      description: "Quick responses",
      action: "Chat Now",
      href: `https://wa.me/${whatsappNumber}?text=Hi! I'm interested in English lessons.`,
    },
    {
      icon: Send,
      label: "Zalo",
      description: "Popular in Vietnam",
      action: "Message",
      href: `https://zalo.me/${telegramUsername}`,
    },
    {
      icon: Mail,
      label: "Email",
      description: "Detailed inquiries",
      action: "Send Email",
      href: `mailto:${email}`,
    }
  ];

  return (
    <section id="contact" ref={sectionRef} className="section relative overflow-hidden bg-muted/30">
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Background decorative element */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 0.015 } : {}}
        transition={{ duration: 1 }}
        className="absolute right-0 top-1/2 -translate-y-1/2 font-display text-[25vw] font-bold text-foreground select-none pointer-events-none hidden lg:block"
      >
        @
      </motion.div>

      <div className="container-2xl relative">
        {/* Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="eyebrow mb-6"
          >
            Contact
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-foreground mb-6"
          >
            {contactT('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl"
          >
            {contactT('subtitle')}
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Contact Methods */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Quick Contact */}
            <div className="space-y-4 mb-12">
              {contactMethods.map((method, index) => {
                const Icon = method.icon;
                return (
                  <motion.a
                    key={method.label}
                    href={method.href}
                    target={method.href.startsWith('http') ? "_blank" : undefined}
                    rel={method.href.startsWith('http') ? "noopener noreferrer" : undefined}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    onClick={() => trackCTAClick('contact', method.label.toLowerCase())}
                    whileHover={{ x: 8 }}
                    className="group flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/30 transition-all duration-300"
                  >
                    <div className="w-12 h-12 flex items-center justify-center bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{method.label}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                    <span className="text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      {method.action}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.a>
                );
              })}
            </div>

            {/* Location Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="p-6 border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-foreground text-background shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">{contactT('location.title')}</p>
                  <p className="text-primary text-sm font-medium mb-3">
                    Golden Mansion 1, 119 Phổ Quang, Phú Nhuận
                  </p>
                  <p className="text-muted-foreground text-sm mb-3">
                    {contactT('location.description')}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Gò Vấp', 'Phú Nhuận', 'Bình Thạnh'].map((district) => (
                      <span
                        key={district}
                        className="text-xs font-mono tracking-wide px-2 py-1 bg-muted text-muted-foreground"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="p-6 md:p-8 lg:p-10 border border-border bg-card">
              <h3 className="font-display text-xl md:text-2xl font-semibold text-foreground mb-6">
                {contactT('form.title')}
              </h3>
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
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-3 mt-16 md:mt-20 pt-12 border-t border-border"
        >
          {['TESOL Certified', 'PGCE Certified', '3 Years in Vietnam', '1700+ Students'].map((badge) => (
            <span
              key={badge}
              className="px-4 py-2 text-xs font-mono tracking-wider text-muted-foreground bg-muted border border-border"
            >
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
