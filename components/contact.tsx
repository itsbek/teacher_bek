"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ContactForm } from './contact-form';
import { trackCTAClick } from '@/lib/analytics';
import { MessageCircle, Send, Mail, Clock, Calendar, Video, ArrowRight } from 'lucide-react';

export function Contact() {
  const t = useTranslations('cta');
  const contactT = useTranslations('contact');

  const whatsappNumber = "+1234567890";
  const telegramUsername = "your_telegram";
  const email = "hello@englishwithconfidence.com";

  const contactMethods = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      description: "Chat instantly",
      href: `https://wa.me/${whatsappNumber}?text=Hi! I'm interested in English lessons.`,
      color: "text-[#25D366]",
    },
    {
      icon: Send,
      label: "Telegram",
      description: "Message me",
      href: `https://t.me/${telegramUsername}`,
      color: "text-[#0088cc]",
    },
    {
      icon: Mail,
      label: "Email",
      description: email,
      href: `mailto:${email}`,
      color: "text-primary",
    }
  ];

  return (
    <section id="contact" className="section">
      <div className="container-lg">
        {/* Main CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden mb-16 lg:mb-24 rounded-2xl"
        >
          <div className="relative bg-primary p-10 lg:p-16">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="inline-block text-xs font-accent tracking-wider uppercase text-primary-foreground/70 mb-4"
              >
                Start Your Journey
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mb-4"
              >
                {t('title')}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg text-primary-foreground/80 max-w-xl mx-auto mb-8"
              >
                {t('subtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi! I'd like to book a free consultation.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackCTAClick('contact', 'whatsapp_cta')}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-foreground text-primary font-medium rounded-lg hover:opacity-90 transition-opacity group"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('button')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Contact Methods Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 lg:mb-24">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <motion.a
                key={index}
                href={method.href}
                target={method.href.startsWith('http') ? "_blank" : undefined}
                rel={method.href.startsWith('http') ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => trackCTAClick('contact', method.label.toLowerCase())}
                className="group p-6 lg:p-8 border border-border rounded-lg bg-card hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <div className={`${method.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {method.label}
                </h3>
                <p className="text-sm text-muted-foreground">{method.description}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Availability Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 py-8 border-y border-border mb-16 lg:mb-24"
        >
          {[
            { icon: Clock, text: "Flexible scheduling for your timezone" },
            { icon: Calendar, text: "Free 30-minute consultation" },
            { icon: Video, text: "Online via Zoom, Skype, or WhatsApp" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="flex items-center gap-3 text-muted-foreground">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            );
          })}
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-10">
            <span className="label-sm text-primary mb-4 block">Or Send a Message</span>
            <h3 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
              {contactT('form.title')}
            </h3>
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
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-12"
        >
          {['TEFL Certified', 'TESOL Certified', '10+ Years Experience', '500+ Students'].map((badge, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-accent tracking-wider text-muted-foreground border border-border rounded-full"
            >
              <span className="w-1.5 h-1.5 bg-accent rounded-full" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
