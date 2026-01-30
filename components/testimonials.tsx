"use client";

import { useTranslations } from 'next-intl';
import { motion, useAnimationControls, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Reveal } from '@/components/ui/reveal';

// Testimonial data
const testimonials = [
  {
    name: "Linh Nguyễn",
    role: "Parent of 2 students",
    location: "Ho Chi Minh City, VN",
    text: "The classroom at Golden Mansion is a decent setup. My kids seem to enjoy the lessons and the teacher is patient with them.",
    initials: "LN",
  },
  {
    name: "Alexei Volkov",
    role: "Software Engineer",
    location: "Moscow, RU",
    text: "We focused on practical communication which was what I needed. It's a straightforward approach to learning.",
    initials: "AV",
  },
  {
    name: "Ji-won Kim",
    role: "University Student",
    location: "Seoul, KR",
    text: "Instruction is clear and the atmosphere is relaxed. It helped me get more comfortable with speaking naturally.",
    initials: "JK",
  },
  {
    name: "Emre Yilmaz",
    role: "Business Owner",
    location: "Istanbul, TR",
    text: "The business English sessions were helpful for my specific industry needs. Useful for anyone looking for targeted practice.",
    initials: "EY",
  },
  {
    name: "Mei Ling Chen",
    role: "Marketing Professional",
    location: "Shanghai, CN",
    text: "Good focus on communicative aspects. The material is relevant and the teacher is quite flexible with scheduling.",
    initials: "MC",
  },
  {
    name: "Olena Kravchenko",
    role: "UI/UX Designer",
    location: "Kyiv, UA",
    text: "The lessons are helpful for professional development. I feel like I can participate more easily in team discussions now.",
    initials: "OK",
  },
  {
    name: "Battuya Ganbold",
    role: "Graduate Student",
    location: "Ulaanbaatar, MN",
    text: "Helped me work through some specific academic writing hurdles. It was a productive experience overall.",
    initials: "BG",
  },
  {
    name: "Minh Trần",
    role: "IT Manager",
    location: "Ho Chi Minh City, VN",
    text: "I appreciate the localized context used in the examples. It's a reliable option for improving your general fluency.",
    initials: "MT",
  },
];

// Single testimonial card
// Single testimonial card
function TestimonialCard({
  testimonial,
  onClick
}: {
  testimonial: typeof testimonials[0];
  onClick: (t: typeof testimonials[0]) => void;
}) {
  return (
    <div
      className="group relative flex-shrink-0 w-[320px] md:w-[380px] h-[240px] md:h-[260px] cursor-pointer transition-all duration-500 hover:!opacity-100 hover:!grayscale-0 group-hover/marquee:opacity-40 group-hover/marquee:grayscale"
      onClick={() => onClick(testimonial)}
    >
      <div className="absolute inset-0 bg-card/80 backdrop-blur-xl border border-border transition-all duration-300 group-hover:bg-card group-hover:border-primary/30 group-hover:shadow-lg group-hover:-translate-y-1 rounded-xl overflow-hidden p-6 md:p-8 flex flex-col justify-between">

        {/* Quote accent */}
        <div className="absolute top-0 left-6 md:left-8 w-8 h-[2px] bg-gradient-to-r from-[#C85C3F] to-[#B8956A] dark:from-[#E88C73] dark:to-[#D4B896]" />

        <div>
          {/* Stars */}
          <div className="flex gap-0.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#B8956A] text-[#B8956A] dark:fill-[#D4B896] dark:text-[#D4B896]" />
            ))}
          </div>

          {/* Quote - Truncated */}
          <p className="font-sans text-base text-[#0F0F11] dark:text-[#F5F1E8] leading-relaxed line-clamp-3 mb-4 group-hover:text-primary transition-colors duration-300">
            "{testimonial.text}"
          </p>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 mt-auto">
          <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 flex items-center justify-center text-xs font-mono tracking-wider bg-[#C85C3F] dark:bg-[#E88C73] text-white rounded-full">
            {testimonial.initials}
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-semibold text-[#0F0F11] dark:text-[#F5F1E8] truncate">
              {testimonial.name}
            </p>
            <p className="font-mono text-[10px] tracking-wider text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 uppercase truncate">
              {testimonial.role}
            </p>
          </div>
        </div>

        {/* Hover Hint */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] uppercase tracking-widest text-primary font-mono">Read</span>
        </div>
      </div>
    </div>
  );
}

// Expanded Card Overlay
function ExpandedCard({ testimonial, onClose }: { testimonial: typeof testimonials[0]; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/20 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-card border border-primary/20 shadow-2xl rounded-2xl p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#C85C3F] to-[#B8956A]" />

        <div className="flex gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#B8956A] text-[#B8956A]" />
          ))}
        </div>

        <p className="font-sans text-lg md:text-xl text-foreground leading-relaxed mb-8">
          "{testimonial.text}"
        </p>

        <div className="flex items-center gap-4 pt-6 border-t border-border/50">
          <div className="w-12 h-12 flex items-center justify-center text-sm font-mono tracking-wider bg-[#C85C3F] text-white rounded-full">
            {testimonial.initials}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-foreground">
              {testimonial.name}
            </p>
            <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Infinite marquee component
// Infinite marquee component
function Marquee({ children, reverse = false, isPaused = false }: {
  children: React.ReactNode;
  reverse?: boolean;
  isPaused?: boolean;
}) {
  const [hovering, setHovering] = useState(false);

  return (
    <div
      className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] group/marquee"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        className="flex gap-4 md:gap-6 pr-4 md:pr-6 animate-marquee"
        style={{
          animationPlayState: (isPaused || hovering) ? "paused" : "running",
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="flex gap-4 md:gap-6 items-center">
          {children}
        </div>
        <div className="flex gap-4 md:gap-6 items-center">
          {children}
        </div>
      </div>
    </div>
  );
}

// ... StatValue remains same ... (omitted for brevity, I will match start line correctly)
// Wait, I cannot omit StatValue if I am replacing a big chunk.
// I will just replace `Testimonials` and `TestimonialCard` and `Marquee` blocks?
// The file has:
// 1. testimonials data (unchanged)
// 2. TestimonialCard (replacing)
// 3. Marquee (replacing)
// 4. StatValue (keeping)
// 5. Testimonials (replacing)

// I will use multiple TargetContent to be safe or one big block if they are contiguous?
// They are contiguous: TestimonialCard -> Marquee -> StatValue -> Testimonials.
// I'll skip StatValue replacement to minimize specific text matching errors, using multi_replace.


// Animated stat counter
function StatValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setMounted(true);
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {mounted ? displayValue : 0}{suffix}
    </span>
  );
}

export function Testimonials() {
  const t = useTranslations('testimonials');
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<typeof testimonials[0] | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="testimonials" className="relative py-16 md:py-24 overflow-hidden bg-[#FDFCF8] dark:bg-[#0A0A0C]">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0F0F11]/10 dark:via-[#F5F1E8]/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0F0F11]/10 dark:via-[#F5F1E8]/10 to-transparent" />
      </div>

      <AnimatePresence>
        {activeTestimonial && (
          <ExpandedCard
            testimonial={activeTestimonial}
            onClose={() => setActiveTestimonial(null)}
          />
        )}
      </AnimatePresence>

      {/* Compact Header with Stats */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
          {/* Left: Title */}
          <div className="max-w-md">
            <Reveal>
              <span className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase text-[#C85C3F] dark:text-[#E88C73] mb-3">
                Feedback
              </span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0F0F11] dark:text-[#F5F1E8] leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                {t('title')}
              </h2>
            </Reveal>
          </div>

          {/* Right: Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-8 md:gap-12"
          >
            {/* Stat 1 */}
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-[#0F0F11] dark:text-[#F5F1E8]">
                <StatValue value={2000} suffix="+" />
              </div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 mt-1">
                Students
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-[#0F0F11]/10 dark:bg-[#F5F1E8]/10" />

            {/* Stat 2 */}
            <div className="text-center">
              <div className="font-display text-3xl md:text-4xl font-bold text-[#0F0F11] dark:text-[#F5F1E8]">
                <StatValue value={3} />
              </div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 mt-1">
                Years
              </p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-[#0F0F11]/10 dark:bg-[#F5F1E8]/10" />

            {/* Stat 3 - Rating */}
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center">
                <span className="font-display text-3xl md:text-4xl font-bold text-[#0F0F11] dark:text-[#F5F1E8]">4.9</span>
                <Star className="w-5 h-5 fill-[#B8956A] text-[#B8956A] dark:fill-[#D4B896] dark:text-[#D4B896]" />
              </div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 mt-1">
                Rating
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Marquee */}
      {mounted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Marquee isPaused={!!activeTestimonial}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                onClick={setActiveTestimonial}
              />
            ))}
          </Marquee>
        </motion.div>
      )}

      {/* Bottom accent */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-7xl mx-auto px-4 md:px-8 mt-12 md:mt-16"
      >
        <div className="flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-[#0F0F11]/20 dark:to-[#F5F1E8]/20" />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#0F0F11]/40 dark:text-[#F5F1E8]/40">
            ILA Vietnam · Blue Sky Academy · 15+ Schools
          </span>
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-[#0F0F11]/20 dark:to-[#F5F1E8]/20" />
        </div>
      </motion.div>
    </section>
  );
}
