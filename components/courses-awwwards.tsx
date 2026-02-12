"use client";

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Users, GraduationCap, Sparkles, ArrowRight } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface CourseCardProps {
  title: string;
  description: string;
  duration: string;
  level: string;
  icon: React.ElementType;
  accentColor: string;
  index: number;
}

/**
 * Course Card with 3D Tilt Effect
 *
 * Features parallax depth illusion by tilting card and moving content
 * in opposite direction. Uses perspective transform for 3D effect.
 */
function CourseCard({
  title,
  description,
  duration,
  level,
  icon: Icon,
  accentColor,
  index,
}: CourseCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Check for reduced motion
  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  useEffect(() => {
    if (!cardRef.current || prefersReducedMotion) return;

    const card = cardRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate position relative to center (-1 to 1)
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);

      // Apply tilt (max 12 degrees)
      setTilt({ x: -y * 12, y: x * 12 });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
      setIsHovering(false);
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [prefersReducedMotion]);

  return (
    <article
      ref={cardRef}
      className="course-card group"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <div
        className="relative p-8 lg:p-10 h-full flex flex-col bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-xl border border-[#C4A84D]/10 dark:border-[#43b3ae]/10 transition-all duration-400 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
        style={{
          transform: prefersReducedMotion
            ? 'none'
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: 'transform 0.1s ease-out, box-shadow 0.4s, translate 0.4s',
          boxShadow: isHovering
            ? `0 20px 60px rgba(196, 168, 77, 0.2)`
            : '0 4px 20px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Animated border gradient on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"
            style={{ color: accentColor }}
          />
        </div>

        {/* Card Content with parallax offset */}
        <div
          className="card-content relative z-10 h-full flex flex-col"
          style={{
            transform: prefersReducedMotion
              ? 'none'
              : `translate(${tilt.y * 0.5}px, ${-tilt.x * 0.5}px)`,
            transition: 'transform 0.1s ease-out',
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            {/* Program number */}
            <span
              className="text-[clamp(48px,6vw,72px)] font-display font-bold leading-none transition-all duration-500"
              style={{
                color: isHovering ? `${accentColor}30` : 'currentColor',
                opacity: isHovering ? 0.3 : 0.06,
              }}
            >
              0{index + 1}
            </span>

            {/* Icon */}
            <div
              className="w-14 h-14 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
              style={{
                backgroundColor: isHovering ? `${accentColor}15` : 'rgba(0,0,0,0.03)',
              }}
            >
              <Icon
                className="w-6 h-6 transition-all duration-500"
                style={{
                  color: isHovering ? accentColor : 'currentColor',
                  opacity: isHovering ? 1 : 0.5,
                }}
                aria-hidden="true"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 mb-8">
            <h3
              className="font-display text-2xl lg:text-3xl font-semibold mb-4 transition-colors duration-500 leading-tight"
              style={{
                color: isHovering ? accentColor : 'currentColor',
              }}
            >
              {title}
            </h3>
            <p className="text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60 text-base leading-relaxed group-hover:text-[#2A2A2C]/80 dark:group-hover:text-[#F4ECD8]/80 transition-colors duration-500">
              {description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-2 text-[10px] font-medium tracking-wider uppercase text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60 border border-[#C4A84D]/10 dark:border-[#43b3ae]/10 backdrop-blur-sm">
              {duration}
            </span>
            <span
              className="px-4 py-2 text-[10px] font-medium tracking-wider uppercase border backdrop-blur-sm"
              style={{
                color: accentColor,
                borderColor: `${accentColor}40`,
              }}
            >
              {level}
            </span>
          </div>

          {/* CTA */}
          <a
            href="#contact"
            className="inline-flex items-center gap-3 text-sm font-medium text-[#2A2A2C]/60 dark:text-[#F4ECD8]/60 hover:text-[#C4A84D] dark:hover:text-[#43b3ae] transition-all duration-300 pt-8 border-t border-[#C4A84D]/10 dark:border-[#43b3ae]/10 group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2"
          >
            <span className="relative">
              Enroll Now
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C4A84D] dark:bg-[#43b3ae] group-hover/link:w-full transition-all duration-300" />
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-2 transition-transform duration-300" aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}

/**
 * Courses Section - AWWWARDS Level
 *
 * Features:
 * - 3D tilt cards with depth parallax
 * - GSAP scroll-triggered animations
 * - CTA banner with animated pattern
 * - Dual-mode styling
 */
export function CoursesAwwwards() {
  const t = useTranslations('courses');
  const sectionRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Section number
      gsap.fromTo(
        '.courses-number',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Label line
      gsap.fromTo(
        '.courses-label-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Label text
      gsap.fromTo(
        '.courses-label',
        { opacity: 0, x: -20 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          delay: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            once: true,
          },
        }
      );

      // Headline words
      gsap.fromTo(
        '.courses-headline-word',
        { y: 60, opacity: 0, rotateX: -45 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.courses-headline',
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Cards with 3D stagger
      gsap.fromTo(
        '.course-card',
        { y: 100, opacity: 0, scale: 0.9, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.courses-grid',
            start: 'top 80%',
            once: true,
          },
        }
      );

      // CTA banner
      gsap.fromTo(
        '.courses-cta-banner',
        { y: 60, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: '.courses-cta-banner',
            start: 'top 85%',
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const headline = t('title') || 'Transform Your English Skills';
  const headlineWords = headline.split(' ');

  const courses = [
    {
      key: 'youngLearners',
      title: 'Young Learners',
      description: 'Fun, engaging lessons that make children love English through games and stories',
      duration: '45 min/lesson',
      level: 'Ages 5-12',
      icon: BookOpen,
      accentColor: '#E8B86D',
    },
    {
      key: 'teens',
      title: 'Teens',
      description: 'Building confidence and academic skills for high school success',
      duration: '60 min/lesson',
      level: 'Ages 13-17',
      icon: Users,
      accentColor: '#C4A84D',
    },
    {
      key: 'ielts',
      title: 'IELTS Prep',
      description: 'Achieve your target band score with focused exam strategies',
      duration: '90 min/lesson',
      level: 'Band 5.5-8.0',
      icon: GraduationCap,
      accentColor: '#A89545',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="courses"
      className="relative min-h-screen bg-[#FDFCF8] dark:bg-[#050505] py-32 lg:py-48 overflow-hidden transition-colors duration-700"
      style={{
        scrollSnapAlign: 'start',
        scrollSnapStop: 'always',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-64 h-64 rounded-full border border-[#C4A84D]/10 dark:border-[#43b3ae]/10" />
        <div className="absolute bottom-40 left-[5%] w-40 h-40 rounded-full bg-[#C4A84D]/5 dark:bg-[#43b3ae]/5" />
      </div>

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Header */}
        <div className="mb-20 lg:mb-28">
          <div className="flex items-start gap-8 mb-12">
            <span className="courses-number text-[clamp(100px,12vw,160px)] font-display font-bold text-[#2A2A2C]/[0.04] dark:text-[#F4ECD8]/[0.04] leading-none -mt-8">
              03
            </span>

            <div className="pt-4">
              {/* Label */}
              <div className="flex items-center gap-4 mb-8">
                <div className="courses-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#43b3ae] origin-left" />
                <span className="courses-label text-[11px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#43b3ae]">
                  Programs
                </span>
              </div>

              {/* Headline */}
              <div className="courses-headline overflow-hidden">
                <h2 className="font-display text-[clamp(2.5rem,6vw,4rem)] font-semibold text-[#2A2A2C] dark:text-[#F4ECD8] leading-[1.0] tracking-[-0.03em]">
                  {headlineWords.map((word, i) => (
                    <span
                      key={i}
                      className="courses-headline-word inline-block mr-[0.25em]"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div
          className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24 lg:mb-32"
          style={{ perspective: '1000px' }}
        >
          {courses.map((course, index) => (
            <CourseCard
              key={course.key}
              title={course.title}
              description={course.description}
              duration={course.duration}
              level={course.level}
              icon={course.icon}
              accentColor={course.accentColor}
              index={index}
            />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="courses-cta-banner relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-[#C4A84D] dark:bg-[#43b3ae]" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />

          {/* Animated dot pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '32px 32px',
              animation: 'patternMove 20s linear infinite',
            }}
          />

          {/* Content */}
          <div className="relative z-10 p-10 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-white/70 dark:text-black/60" aria-hidden="true" />
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/70 dark:text-black/60">
                  Free Consultation
                </span>
              </div>
              <h3 className="font-display text-3xl lg:text-5xl font-semibold text-white dark:text-black mb-6 leading-[1.1] tracking-[-0.02em]">
                Ready to Start Your English Journey?
              </h3>
              <p className="text-white/70 dark:text-black/60 text-lg leading-relaxed">
                Not sure which program is right for you? Book a free assessment and I'll create a personalized learning plan.
              </p>
            </div>

            <a
              href="#contact"
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white dark:bg-black text-[#C4A84D] dark:text-[#43b3ae] text-sm font-semibold tracking-[0.05em] uppercase overflow-hidden transition-all duration-500 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:ring-offset-[#C4A84D] dark:focus-visible:ring-offset-[#43b3ae]"
            >
              <span className="relative z-10">Book Free Assessment</span>
              <ArrowRight className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />

              <div className="absolute inset-0 bg-[#2A2A2C] dark:bg-[#43b3ae] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center gap-4 text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span>Book Free Assessment</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes patternMove {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(32px, 32px);
          }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
}
