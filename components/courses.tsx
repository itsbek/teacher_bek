"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Users, GraduationCap, Sparkles } from 'lucide-react';
import { trackCTAClick } from '@/lib/analytics';
import { MetaballCanvas } from '@/components/webgl/metaball-canvas';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const courseData = [
  { key: 'youngLearners', icon: BookOpen, color: '#E8B86D', secondaryColor: '#C4A84D' },
  { key: 'teens', icon: Users, color: '#C4A84D', secondaryColor: '#B8956A' },
  { key: 'ielts', icon: GraduationCap, color: '#A89545', secondaryColor: '#C85C3F' },
] as const;

// Card with advanced 3D tilt, shine, and WebGL background
function CourseCard({
  course,
  index,
  t,
}: {
  course: typeof courseData[number];
  index: number;
  t: ReturnType<typeof useTranslations<'courses'>>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const Icon = course.icon;

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });

      // Update glow position
      setGlowPosition({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });

      // Apply 3D tilt with perspective
      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 12,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 1000,
        transformOrigin: "center center",
      });

      // Move inner content for depth effect
      gsap.to(card.querySelector('.card-content'), {
        x: x * 10,
        y: y * 10,
        duration: 0.4,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });

      gsap.to(card.querySelector('.card-content'), {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });

      setIsHovering(false);
    };

    const handleMouseEnter = () => setIsHovering(true);

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="course-card group relative"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="relative p-8 lg:p-10 bg-white dark:bg-[#0A0A0A] border border-foreground/10 dark:border-white/10 transition-all duration-500 h-full flex flex-col hover:border-[#C4A84D]/40 dark:hover:border-[#ECD06F]/40 overflow-hidden">

        {/* Metaball WebGL background on hover */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
          style={{ transform: 'translateZ(-20px)' }}
        >
          {isHovering && (
            <MetaballCanvas
              ballCount={5}
              color={course.color}
              secondaryColor={course.secondaryColor}
              threshold={0.45}
              mouseInfluence={0.8}
            />
          )}
        </div>

        {/* Dynamic glow effect overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: isHovering
              ? `radial-gradient(600px circle at ${glowPosition.x}% ${glowPosition.y}%, rgba(196, 168, 77, 0.15), transparent 40%)`
              : 'none',
          }}
        />

        {/* Animated border gradient */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A84D]/60 dark:via-[#ECD06F]/60 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4A84D]/30 dark:via-[#ECD06F]/30 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right delay-100" />
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C4A84D]/40 dark:via-[#ECD06F]/40 to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-top delay-200" />
          <div className="absolute right-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#C4A84D]/20 dark:via-[#ECD06F]/20 to-transparent transform scale-y-0 group-hover:scale-y-100 transition-transform duration-700 origin-bottom delay-300" />
        </div>

        {/* Card Content with depth transform */}
        <div className="card-content relative z-10 h-full flex flex-col">
          {/* Card Header */}
          <div className="flex items-start justify-between mb-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-foreground/30 dark:text-white/30">
                Program
              </span>
              <span
                className="text-[clamp(48px,6vw,72px)] font-display font-bold leading-none transition-all duration-500"
                style={{
                  color: isHovering ? `${course.color}20` : 'currentColor',
                  opacity: isHovering ? 0.3 : 0.06,
                }}
              >
                0{index + 1}
              </span>
            </div>
            <div
              className="w-14 h-14 flex items-center justify-center transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3"
              style={{
                background: isHovering ? `${course.color}15` : 'rgba(0,0,0,0.03)',
              }}
            >
              <Icon
                className="w-6 h-6 transition-all duration-500"
                style={{
                  color: isHovering ? course.color : 'currentColor',
                  opacity: isHovering ? 1 : 0.5,
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <h3
              className="font-display text-2xl lg:text-3xl font-semibold mb-4 transition-colors duration-500 leading-tight"
              style={{
                color: isHovering ? course.color : 'currentColor',
              }}
            >
              {t(`${course.key}.title`)}
            </h3>
            <p className="text-foreground/50 dark:text-white/50 text-base leading-[1.8] mb-8 group-hover:text-foreground/70 dark:group-hover:text-white/70 transition-colors duration-500">
              {t(`${course.key}.description`)}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-4 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-foreground/60 dark:text-white/60 border border-foreground/10 dark:border-white/10 backdrop-blur-sm transition-all duration-300 group-hover:border-foreground/20 dark:group-hover:border-white/20">
              {t(`${course.key}.duration`)}
            </span>
            <span
              className="px-4 py-2 text-[10px] font-medium tracking-[0.08em] uppercase border backdrop-blur-sm transition-all duration-300"
              style={{
                color: course.color,
                borderColor: `${course.color}40`,
              }}
            >
              {t(`${course.key}.level`)}
            </span>
          </div>

          {/* CTA */}
          <a
            href="#contact"
            onClick={() => trackCTAClick('courses', course.key)}
            className="inline-flex items-center gap-3 text-sm font-medium text-foreground/60 dark:text-white/60 hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-all duration-300 pt-8 border-t border-foreground/10 dark:border-white/10 group/link"
          >
            <span className="relative">
              Enroll Now
              <span className="absolute bottom-0 left-0 w-0 h-px bg-[#C4A84D] dark:bg-[#ECD06F] group-hover/link:w-full transition-all duration-300" />
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-2 transition-transform duration-300" />
          </a>
        </div>

        {/* Shine sweep effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 45%, transparent 50%)`,
            transform: isHovering ? 'translateX(100%)' : 'translateX(-100%)',
            transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </div>
    </div>
  );
}

export function Courses() {
  const t = useTranslations('courses');
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number
      gsap.fromTo(".courses-number",
        { opacity: 0, x: -50 },
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

      // Label with line draw
      gsap.fromTo(".courses-label-line",
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

      gsap.fromTo(".courses-label",
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

      // Headline with split reveal
      gsap.fromTo(".courses-headline-word",
        { y: 80, opacity: 0, rotateX: -45 },
        {
          y: 0, opacity: 1, rotateX: 0,
          duration: 1, stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".courses-headline",
            start: "top 75%",
            once: true,
          }
        }
      );

      // Subtitle
      gsap.fromTo(".courses-subtitle",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".courses-subtitle",
            start: "top 80%",
            once: true,
          }
        }
      );

      // Cards with 3D stagger
      gsap.fromTo(".course-card",
        {
          y: 100,
          opacity: 0,
          scale: 0.9,
          rotateX: -15,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".courses-grid",
            start: "top 80%",
            once: true,
          }
        }
      );

      // CTA Banner with reveal
      gsap.fromTo(".courses-cta-banner",
        { y: 60, opacity: 0, scale: 0.98 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".courses-cta-banner",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Parallax for decorative elements
      gsap.to(".courses-deco-1", {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

      gsap.to(".courses-deco-2", {
        y: 40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split title into words
  const titleWords = t('title').split(' ');

  return (
    <section
      ref={sectionRef}
      id="courses"
      className="relative bg-[#FDFBF7] dark:bg-black py-32 lg:py-48 overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="courses-deco-1 absolute top-20 right-[10%] w-64 h-64 rounded-full border border-[#C4A84D]/10 dark:border-[#ECD06F]/10" />
        <div className="courses-deco-2 absolute bottom-40 left-[5%] w-40 h-40 rounded-full bg-[#C4A84D]/5 dark:bg-[#ECD06F]/5" />
        <div className="absolute top-1/2 right-0 w-[1px] h-[400px] bg-gradient-to-b from-transparent via-foreground/10 dark:via-white/10 to-transparent" />
      </div>

      {/* Container */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">

        {/* Header */}
        <div className="mb-20 lg:mb-28">
          {/* Section indicator */}
          <div className="flex items-start gap-8 mb-12">
            <span className="courses-number text-[120px] lg:text-[180px] font-display font-bold text-foreground/[0.04] dark:text-white/[0.04] leading-none -mt-8">
              02
            </span>
            <div className="pt-4">
              {/* Label */}
              <div className="flex items-center gap-4 mb-8">
                <div className="courses-label-line h-[1px] w-12 bg-[#C4A84D] dark:bg-[#ECD06F] origin-left" />
                <span className="courses-label text-[11px] font-medium tracking-[0.15em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
                  Programs
                </span>
              </div>

              {/* Headline */}
              <div className="courses-headline overflow-hidden">
                <h2 className="font-display text-[clamp(40px,6vw,80px)] font-semibold text-foreground dark:text-white leading-[1.0] tracking-[-0.03em]">
                  {titleWords.map((word, i) => (
                    <span key={i} className="courses-headline-word inline-block mr-[0.25em]" style={{ transformStyle: 'preserve-3d' }}>
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </div>
          </div>

          {/* Subtitle */}
          <p className="courses-subtitle text-lg md:text-xl text-foreground/50 dark:text-white/50 max-w-2xl leading-[1.8] ml-auto lg:mr-20">
            {t('subtitle')}
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="courses-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-24 lg:mb-32" style={{ perspective: '1000px' }}>
          {courseData.map((course, index) => (
            <CourseCard
              key={course.key}
              course={course}
              index={index}
              t={t}
            />
          ))}
        </div>

        {/* CTA Banner */}
        <div className="courses-cta-banner relative overflow-hidden">
          {/* Background with gradient */}
          <div className="absolute inset-0 bg-[#C4A84D] dark:bg-[#ECD06F]" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-white/10" />

          {/* Animated pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
              backgroundSize: '32px 32px',
              animation: 'patternMove 20s linear infinite',
            }}
          />

          <div className="relative z-10 p-10 lg:p-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-5 h-5 text-white/70 dark:text-black/60" />
                <span className="text-[11px] font-medium tracking-[0.15em] uppercase text-white/70 dark:text-black/60">
                  Free Consultation
                </span>
              </div>
              <h3 className="font-display text-3xl lg:text-5xl font-semibold text-white dark:text-black mb-6 leading-[1.1] tracking-[-0.02em]">
                Ready to Start Your English Journey?
              </h3>
              <p className="text-white/70 dark:text-black/60 text-lg leading-[1.7]">
                Not sure which program is right for you? Book a free assessment and I&apos;ll create a personalized learning plan.
              </p>
            </div>

            <a
              href="#contact"
              onClick={() => trackCTAClick('courses', 'consultation')}
              className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white dark:bg-black text-[#C4A84D] dark:text-[#ECD06F] text-sm font-semibold tracking-[0.05em] uppercase overflow-hidden transition-all duration-500 shrink-0"
            >
              <span className="relative z-10">Book Free Assessment</span>
              <ArrowRight className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-foreground dark:bg-[#ECD06F] transform translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              <span className="absolute inset-0 flex items-center justify-center gap-4 text-white dark:text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <span>Book Free Assessment</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes patternMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(32px, 32px); }
        }
      `}</style>
    </section>
  );
}
