"use client";

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Li Wei",
    role: "Software Engineer",
    location: "Beijing",
    country: "CN",
    text: "After 6 months of lessons, I passed my IELTS with 8.0! The personalized approach made all the difference. Now I work confidently with international clients.",
    initials: "LW"
  },
  {
    name: "Nguyễn Thu Hà",
    role: "Marketing Manager",
    location: "Ho Chi Minh City",
    country: "VN",
    text: "I was nervous about speaking English at work. Now I lead presentations and meetings with confidence. The business English course was exactly what I needed.",
    initials: "NH"
  },
  {
    name: "Dmitry Sokolov",
    role: "MBA Student",
    location: "Moscow",
    country: "RU",
    text: "The flexible schedule and focus on practical communication helped me succeed in my MBA program. Highly recommend for busy professionals!",
    initials: "DS"
  },
  {
    name: "Wang Mei",
    role: "Student",
    location: "Shanghai",
    country: "CN",
    text: "I started from beginner level and now I study at a UK university! The teaching methods are clear, patient, and very effective.",
    initials: "WM"
  },
  {
    name: "Trần Minh",
    role: "Business Owner",
    location: "Hanoi",
    country: "VN",
    text: "My business expanded internationally thanks to improved English skills. The lessons focused on real-world scenarios I use every day.",
    initials: "TM"
  },
  {
    name: "Elena Ivanova",
    role: "Translator",
    location: "St. Petersburg",
    country: "RU",
    text: "Advanced lessons helped me perfect my accent and cultural understanding. Now I work as a professional translator for top companies.",
    initials: "EI"
  }
];

export function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section id="testimonials" className="section">
      <div className="container-lg">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="label-sm text-primary mb-4 block"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground mb-4"
          >
            {t('title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground"
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full p-6 lg:p-8 bg-card border border-border rounded-lg hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-primary/30 mb-4" />

                {/* Testimonial Text */}
                <p className="text-foreground leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 flex items-center justify-center text-xs font-medium bg-primary/10 text-primary rounded-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {testimonial.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {testimonial.role}, {testimonial.location}
                    </p>
                  </div>
                  <span className="text-[10px] font-accent tracking-wider text-muted-foreground">
                    {testimonial.country}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 pt-12 border-t border-border"
        >
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20">
            {[
              { value: '4.9/5', label: 'Average Rating', icon: Star },
              { value: '500+', label: 'Happy Students' },
              { value: '25+', label: 'Countries' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-2">
                  {stat.icon && <stat.icon className="w-5 h-5 text-accent fill-accent" />}
                  <span className="font-display text-3xl md:text-4xl font-semibold text-primary">
                    {stat.value}
                  </span>
                </div>
                <p className="label-sm mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
