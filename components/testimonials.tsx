"use client";

import { useTranslations } from 'next-intl';
import { motion, useAnimationControls } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Star } from 'lucide-react';

// Testimonial data
const testimonials = [
  {
    name: "Chị Linh Nguyễn",
    role: "Parent of 2 students",
    location: "Phú Nhuận",
    text: "The classroom at Golden Mansion is safe with CCTV. My kids love going to class every week.",
    initials: "LN",
  },
  {
    name: "Anh Minh Trần",
    role: "IT Manager",
    location: "Gò Vấp",
    text: "Finally found a teacher who makes learning English practical for my career.",
    initials: "MT",
  },
  {
    name: "Bé Hà Phương",
    role: "Student, age 8",
    location: "Phú Nhuận",
    text: "Teacher makes learning fun! I can speak English with my cousins now.",
    initials: "HP",
  },
  {
    name: "Cô Thanh Hương",
    role: "Kindergarten Teacher",
    location: "Bình Thạnh",
    text: "A professional with TESOL and PGCE certifications. My daughter's English improved dramatically.",
    initials: "TH",
  },
  {
    name: "Anh Quốc Bảo",
    role: "Business Owner",
    location: "Gò Vấp",
    text: "After 6 months, I negotiated my first international deal entirely in English.",
    initials: "QB",
  },
  {
    name: "Chị Mai Anh",
    role: "University Student",
    location: "Phú Nhuận",
    text: "The dedicated classroom is so comfortable. Achieved my target IELTS score in 3 months.",
    initials: "MA",
  },
  {
    name: "Ông Văn Đức",
    role: "Retired Engineer",
    location: "Bình Thạnh",
    text: "Learning English at 65! Patient teaching and a well-designed learning space.",
    initials: "VD",
  },
  {
    name: "Chị Yến Nhi",
    role: "Mother of young learner",
    location: "Phú Nhuận",
    text: "The CCTV in the classroom gives me peace of mind while my 5-year-old learns.",
    initials: "YN",
  },
];

// Single testimonial card
function TestimonialCard({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) {
  return (
    <motion.div
      className="group relative flex-shrink-0 w-[320px] md:w-[380px]"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-full p-6 md:p-8 bg-[#FDFCF8]/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl border border-[#0F0F11]/10 dark:border-[#F5F1E8]/10 transition-all duration-500 group-hover:border-[#C85C3F]/30 dark:group-hover:border-[#E88C73]/30 group-hover:shadow-[0_8px_40px_-12px_rgba(200,92,63,0.15)] dark:group-hover:shadow-[0_8px_40px_-12px_rgba(232,140,115,0.15)]">
        {/* Quote accent line */}
        <div className="absolute top-0 left-6 md:left-8 w-8 h-[2px] bg-gradient-to-r from-[#C85C3F] to-[#B8956A] dark:from-[#E88C73] dark:to-[#D4B896]" />

        {/* Stars */}
        <div className="flex gap-0.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#B8956A] text-[#B8956A] dark:fill-[#D4B896] dark:text-[#D4B896]" />
          ))}
        </div>

        {/* Quote */}
        <p className="font-sans text-base md:text-lg text-[#0F0F11] dark:text-[#F5F1E8] leading-relaxed mb-6 line-clamp-2">
          "{testimonial.text}"
        </p>

        {/* Author */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center text-xs font-mono tracking-wider bg-[#C85C3F] dark:bg-[#E88C73] text-white">
            {testimonial.initials}
          </div>
          <div>
            <p className="font-display text-sm font-semibold text-[#0F0F11] dark:text-[#F5F1E8]">
              {testimonial.name}
            </p>
            <p className="font-mono text-[10px] tracking-wider text-[#0F0F11]/50 dark:text-[#F5F1E8]/50 uppercase">
              {testimonial.role} · {testimonial.location}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Infinite marquee component
function Marquee({ children, reverse = false, pauseOnHover = true }: {
  children: React.ReactNode;
  reverse?: boolean;
  pauseOnHover?: boolean;
}) {
  const [isPaused, setIsPaused] = useState(false);

  return (
    <div
      className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      <motion.div
        className="flex gap-4 md:gap-6 pr-4 md:pr-6"
        animate={{
          x: reverse ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{
          animationPlayState: isPaused ? "paused" : "running",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}

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

      {/* Compact Header with Stats */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-12">
          {/* Left: Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-md"
          >
            <span className="inline-block font-mono text-[10px] tracking-[0.3em] uppercase text-[#C85C3F] dark:text-[#E88C73] mb-3">
              Testimonials
            </span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[#0F0F11] dark:text-[#F5F1E8] leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
              {t('title')}
            </h2>
          </motion.div>

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
                <StatValue value={1700} suffix="+" />
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
                <span className="font-display text-3xl md:text-4xl font-bold text-[#0F0F11] dark:text-[#F5F1E8]">5.0</span>
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
          <Marquee pauseOnHover>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
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
