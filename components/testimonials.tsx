"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, Quote, ArrowUpRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    name: "Linh Nguyễn",
    role: "Parent of 2 students",
    location: "Ho Chi Minh City, VN",
    text: "The classroom at Golden Mansion is a decent setup. My kids seem to enjoy the lessons and the teacher is patient with them.",
    initials: "LN",
    rating: 5,
  },
  {
    name: "Alexei Volkov",
    role: "Software Engineer",
    location: "Moscow, RU",
    text: "We focused on practical communication which was what I needed. It's a straightforward approach to learning.",
    initials: "AV",
    rating: 5,
  },
  {
    name: "Ji-won Kim",
    role: "University Student",
    location: "Seoul, KR",
    text: "Instruction is clear and the atmosphere is relaxed. It helped me get more comfortable with speaking naturally.",
    initials: "JK",
    rating: 5,
  },
  {
    name: "Emre Yilmaz",
    role: "Business Owner",
    location: "Istanbul, TR",
    text: "The business English sessions were helpful for my specific industry needs. Useful for anyone looking for targeted practice.",
    initials: "EY",
    rating: 5,
  },
  {
    name: "Mei Ling Chen",
    role: "Marketing Professional",
    location: "Shanghai, CN",
    text: "Good focus on communicative aspects. The material is relevant and the teacher is quite flexible with scheduling.",
    initials: "MC",
    rating: 5,
  },
  {
    name: "Olena Kravchenko",
    role: "UI/UX Designer",
    location: "Kyiv, UA",
    text: "The lessons are helpful for professional development. I feel like I can participate more easily in team discussions now.",
    initials: "OK",
    rating: 5,
  },
];

function TestimonialCard({
  testimonial,
  onClick,
  index
}: {
  testimonial: typeof testimonials[0];
  onClick: (t: typeof testimonials[0]) => void;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

      gsap.to(card, {
        rotateY: x * 5,
        rotateX: -y * 5,
        duration: 0.3,
        ease: "power2.out",
        transformPerspective: 800,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)",
      });
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative flex-shrink-0 w-[340px] md:w-[400px] cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
      onClick={() => onClick(testimonial)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative p-8 md:p-10 bg-white dark:bg-[#0A0A0A] border border-foreground/10 dark:border-white/10 transition-all duration-500 hover:border-[#C4A84D]/40 dark:hover:border-[#ECD06F]/40 h-full">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C4A84D] dark:from-[#ECD06F] to-transparent transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />

        {/* Quote icon */}
        <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
          <Quote className="w-12 h-12 text-[#C4A84D] dark:text-[#ECD06F]" />
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-6">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#C4A84D] dark:fill-[#ECD06F] text-[#C4A84D] dark:text-[#ECD06F]" />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-lg text-foreground/70 dark:text-white/70 leading-[1.7] line-clamp-3 mb-8 group-hover:text-foreground/90 dark:group-hover:text-white/90 transition-colors duration-500">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Author */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center text-sm font-semibold tracking-wider bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black">
              {testimonial.initials}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground dark:text-white">
                {testimonial.name}
              </p>
              <p className="text-[13px] tracking-[0.1em] text-foreground/40 dark:text-white/40 uppercase">
                {testimonial.role}
              </p>
            </div>
          </div>

          {/* Hover indicator */}
          <div className="w-10 h-10 flex items-center justify-center border border-foreground/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:border-[#C4A84D]/30 dark:group-hover:border-[#ECD06F]/30">
            <ArrowUpRight className="w-4 h-4 text-[#C4A84D] dark:text-[#ECD06F] transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
        </div>

        {/* Card number */}
        <div className="absolute bottom-4 left-4 text-[13px] font-mono tracking-wider text-foreground/20 dark:text-white/20">
          0{index + 1}
        </div>
      </div>
    </div>
  );
}

function ExpandedCard({ testimonial, onClose }: { testimonial: typeof testimonials[0]; onClose: () => void }) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-xl bg-white dark:bg-[#0A0A0A] border border-foreground/10 dark:border-white/10 p-10 md:p-14 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center border border-foreground/10 dark:border-white/10 hover:border-[#C4A84D] dark:hover:border-[#ECD06F] hover:bg-[#C4A84D]/10 dark:hover:bg-[#ECD06F]/10 transition-all duration-300 group"
        >
          <X className="w-5 h-5 text-foreground/60 dark:text-white/60 group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors" />
        </button>

        {/* Large quote icon */}
        <div className="mb-8">
          <Quote className="w-16 h-16 text-[#C4A84D]/20 dark:text-[#ECD06F]/20" />
        </div>

        {/* Stars */}
        <div className="flex gap-1.5 mb-8">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#C4A84D] dark:fill-[#ECD06F] text-[#C4A84D] dark:text-[#ECD06F]" />
          ))}
        </div>

        {/* Quote text */}
        <p className="text-2xl md:text-3xl font-display text-foreground dark:text-white leading-[1.4] mb-10">
          &ldquo;{testimonial.text}&rdquo;
        </p>

        {/* Divider */}
        <div className="w-16 h-[2px] bg-[#C4A84D] dark:bg-[#ECD06F] mb-8" />

        {/* Author */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 flex items-center justify-center text-lg font-bold tracking-wider bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black">
            {testimonial.initials}
          </div>
          <div>
            <p className="text-xl font-semibold text-foreground dark:text-white mb-1">
              {testimonial.name}
            </p>
            <p className="text-sm tracking-[0.05em] text-foreground/50 dark:text-white/50">
              {testimonial.role}
            </p>
            <p className="text-xs tracking-[0.1em] text-foreground/30 dark:text-white/30 uppercase mt-1">
              {testimonial.location}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Marquee({
  children,
  isPaused = false,
  direction = 'left',
  speed = 40
}: {
  children: React.ReactNode;
  isPaused?: boolean;
  direction?: 'left' | 'right';
  speed?: number;
}) {
  const [hovering, setHovering] = useState(false);
  const marqueeRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div
        ref={marqueeRef}
        className="flex gap-8 pr-8"
        style={{
          animation: `marquee ${speed}s linear infinite`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
          animationPlayState: (isPaused || hovering) ? "paused" : "running",
        }}
      >
        <div className="flex gap-8 items-stretch">{children}</div>
        <div className="flex gap-8 items-stretch">{children}</div>
      </div>
    </div>
  );
}

function StatValue({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [mounted, setMounted] = useState(false);
  const [displayValue, setDisplayValue] = useState(0);

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
    <span className="tabular-nums">
      {mounted ? displayValue : 0}{suffix}
    </span>
  );
}

export function Testimonials() {
  const t = useTranslations('testimonials');
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState<typeof testimonials[0] | null>(null);

  useEffect(() => {
    setMounted(true);

    const ctx = gsap.context(() => {
      // Section number
      gsap.fromTo(".testimonials-number",
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
      gsap.fromTo(".testimonials-label-line",
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

      gsap.fromTo(".testimonials-label",
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

      // Title with word reveal
      gsap.fromTo(".testimonials-title-word",
        { y: 60, opacity: 0, rotateX: -45 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 0.8, stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".testimonials-title",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Stats with scale up
      gsap.fromTo(".testimonials-stat",
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, stagger: 0.12,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".testimonials-stats",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Marquee reveal
      gsap.fromTo(".testimonials-marquee",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".testimonials-marquee",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Schools marquee
      gsap.fromTo(".testimonials-schools",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8,
          scrollTrigger: {
            trigger: ".testimonials-schools",
            start: "top 90%",
            once: true,
          }
        }
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const titleWords = t('title').split(' ');

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative bg-[#F8F4EC] dark:bg-[#050505] py-32 lg:py-48 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-px h-32 bg-gradient-to-b from-[#C4A84D]/20 dark:from-[#ECD06F]/20 to-transparent" />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 rounded-full border border-[#C4A84D]/5 dark:border-[#ECD06F]/5" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mb-16 lg:mb-20 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-12">
          {/* Left */}
          <div>
            {/* Section indicator */}
            <div className="flex items-start gap-6 mb-8">
              <span className="testimonials-number text-[100px] lg:text-[140px] font-display font-bold text-foreground/[0.04] dark:text-white/[0.04] leading-none -mt-6">
                04
              </span>
              <div className="pt-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="testimonials-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#ECD06F] origin-left" />
                  <span className="testimonials-label text-[13px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
                    Testimonials
                  </span>
                </div>

                <h2 className="testimonials-title font-display text-[clamp(36px,5vw,64px)] font-semibold text-foreground dark:text-white leading-[1.0] tracking-[-0.03em]">
                  {titleWords.map((word, i) => (
                    <span key={i} className="testimonials-title-word inline-block mr-[0.2em]" style={{ transformStyle: 'preserve-3d' }}>
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="testimonials-stats flex items-center gap-6 lg:gap-10">
            <div className="testimonials-stat text-center px-4 py-3">
              <div className="font-display text-4xl md:text-5xl font-bold text-foreground dark:text-white">
                <StatValue value={2000} suffix="+" />
              </div>
              <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-foreground/40 dark:text-white/40 mt-2">
                Students
              </p>
            </div>

            <div className="w-px h-16 bg-foreground/10 dark:bg-white/10" />

            <div className="testimonials-stat text-center px-4 py-3">
              <div className="font-display text-4xl md:text-5xl font-bold text-[#C4A84D] dark:text-[#ECD06F]">
                <StatValue value={3} />
              </div>
              <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-foreground/40 dark:text-white/40 mt-2">
                Years
              </p>
            </div>

            <div className="w-px h-16 bg-foreground/10 dark:bg-white/10" />

            <div className="testimonials-stat text-center px-4 py-3">
              <div className="flex items-center gap-2 justify-center">
                <span className="font-display text-4xl md:text-5xl font-bold text-foreground dark:text-white">4.9</span>
                <Star className="w-6 h-6 fill-[#C4A84D] dark:fill-[#ECD06F] text-[#C4A84D] dark:text-[#ECD06F]" />
              </div>
              <p className="text-[13px] font-medium tracking-[0.15em] uppercase text-foreground/40 dark:text-white/40 mt-2">
                Rating
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeTestimonial && (
          <ExpandedCard testimonial={activeTestimonial} onClose={() => setActiveTestimonial(null)} />
        )}
      </AnimatePresence>

      {/* Marquee */}
      {mounted && (
        <div className="testimonials-marquee py-4">
          <Marquee isPaused={!!activeTestimonial} speed={50}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                testimonial={testimonial}
                onClick={setActiveTestimonial}
                index={index}
              />
            ))}
          </Marquee>
        </div>
      )}

      {/* Schools marquee */}
      <div className="testimonials-schools max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 mt-16 lg:mt-20">
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-8 px-8 py-4 bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-foreground/5 dark:border-white/5">
            <span className="text-[13px] font-medium tracking-[0.2em] uppercase text-foreground/30 dark:text-white/30">
              Trusted by
            </span>
            <div className="h-4 w-px bg-foreground/10 dark:bg-white/10" />
            <span className="text-[13px] font-medium tracking-[0.1em] text-foreground/50 dark:text-white/50">
              ILA Vietnam
            </span>
            <span className="text-[13px] font-medium tracking-[0.1em] text-foreground/50 dark:text-white/50">
              Blue Sky Academy
            </span>
            <span className="text-[13px] font-medium tracking-[0.1em] text-foreground/50 dark:text-white/50">
              15+ Schools
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
