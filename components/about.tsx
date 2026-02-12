"use client";

import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProfileImage } from '@/components/protected-image';
import { ArrowRight, MapPin, Award, BookOpen } from 'lucide-react';
import { SmokeTendrils } from '@/components/lingua-noir/fluid-smoke';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Animated text reveal with blur
function AnimatedParagraph({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: 50, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay,
          ease: "power4.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          }
        }
      );
    }, el);

    return () => ctx.revert();
  }, [delay]);

  return (
    <p ref={ref} className={className}>
      {children}
    </p>
  );
}

export default function AboutSection() {
  const t = useTranslations('about');
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imageHover, setImageHover] = useState(false);

  // Mouse tracking for 3D image effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!imageRef.current) return;
      const rect = imageRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section number with clip path reveal
      gsap.fromTo(".about-number",
        { clipPath: "inset(100% 0 0 0)" },
        {
          clipPath: "inset(0% 0 0 0)",
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Eyebrow with draw effect
      gsap.fromTo(".about-eyebrow-line",
        { scaleX: 0, transformOrigin: "left" },
        {
          scaleX: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      gsap.fromTo(".about-eyebrow-text",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          delay: 0.3,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            once: true,
          }
        }
      );

      // Headline with staggered word reveal
      gsap.fromTo(".about-headline-word",
        { y: 120, opacity: 0, rotateX: -60 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-headline",
            start: "top 75%",
            once: true,
          }
        }
      );

      // Image reveal with wax melt effect
      gsap.fromTo(".about-image-curtain",
        { scaleY: 1, transformOrigin: "top" },
        {
          scaleY: 0,
          duration: 1.8,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: ".about-image-container",
            start: "top 70%",
            once: true,
          }
        }
      );

      // Image zoom
      gsap.fromTo(".about-image-inner",
        { scale: 1.5, filter: "sepia(0.3)" },
        {
          scale: 1,
          filter: "sepia(0)",
          duration: 2.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-image-container",
            start: "top 70%",
            once: true,
          }
        }
      );

      // Quote with blur reveal
      gsap.fromTo(".about-quote",
        { opacity: 0, y: 60, filter: "blur(15px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-quote",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Credentials with bounce
      gsap.fromTo(".about-credential",
        { y: 40, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "elastic.out(1, 0.5)",
          scrollTrigger: {
            trigger: ".about-credentials",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Stats counter animation
      gsap.fromTo(".about-stat",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".about-stats",
            start: "top 85%",
            once: true,
          }
        }
      );

      // Parallax on scroll for image
      gsap.to(".about-image-inner", {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        }
      });

      // Breathing animation (7 second pulse)
      gsap.to(".breath-pulse", {
        filter: "brightness(1.1)",
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headlineWords = ['The', 'excavation', 'of', 'fluency'];

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-32 lg:py-48 overflow-hidden"
      style={{ backgroundColor: 'var(--void-black, #050505)' }}
    >
      {/* Gradient bleed background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(61,40,23,0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(67,179,174,0.15) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 90%, rgba(138,3,3,0.1) 0%, transparent 30%)
          `
        }}
      />

      {/* Smoke tendrils */}
      <SmokeTendrils className="absolute inset-0 opacity-30" />

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Oxidized copper glow */}
        <div
          className="absolute top-1/4 right-[10%] w-64 h-64 breath-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(67,179,174,0.2) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />

        {/* Tobacco smoke orb */}
        <div
          className="absolute bottom-1/3 left-[5%] w-48 h-48"
          style={{
            background: 'radial-gradient(circle, rgba(61,40,23,0.3) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Grid pattern - Archaeological */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(67,179,174,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(67,179,174,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">

          {/* Left: Content */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            {/* Section header */}
            <div className="flex items-start gap-8 mb-16">
              <span
                className="about-number text-[120px] lg:text-[180px] font-display font-bold leading-none -mt-8 select-none"
                style={{
                  color: 'transparent',
                  WebkitTextStroke: '1px rgba(67, 179, 174, 0.15)',
                }}
              >
                02
              </span>
              <div className="pt-6">
                {/* Eyebrow */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="about-eyebrow-line h-[1px] w-14"
                    style={{ backgroundColor: 'var(--oxidized-copper, #43b3ae)' }}
                  />
                  <span
                    className="about-eyebrow-text text-[11px] font-mono font-medium tracking-[0.2em] uppercase"
                    style={{ color: 'var(--oxidized-copper, #43b3ae)' }}
                  >
                    {t('label')}
                  </span>
                </div>

                {/* Headline */}
                <div className="about-headline overflow-hidden mb-12" style={{ perspective: '1000px' }}>
                  <h2
                    className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-[-0.03em]"
                    style={{ color: 'var(--vintage-paper, #f4ecd8)' }}
                  >
                    {headlineWords.map((word, i) => (
                      <span
                        key={i}
                        className="about-headline-word inline-block mr-[0.25em]"
                        style={{
                          transformStyle: 'preserve-3d',
                          color: word === 'fluency'
                            ? 'var(--oxidized-copper, #43b3ae)'
                            : 'inherit',
                          textShadow: word === 'fluency'
                            ? '0 0 40px rgba(67, 179, 174, 0.5)'
                            : 'none',
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
            </div>

            {/* Body text with animated reveals */}
            <div className="space-y-8 mb-16 max-w-xl">
              <AnimatedParagraph
                className="text-xl md:text-2xl leading-[1.7] font-light"
                style={{ color: 'rgba(244, 236, 216, 0.7)' }}
                delay={0}
              >
                Originally from Tashkent, Uzbekistan, I found my way to Vietnam through volunteering—and discovered a passion I never expected.
              </AnimatedParagraph>

              <AnimatedParagraph
                className="text-2xl md:text-3xl leading-[1.5] font-medium"
                style={{ color: 'var(--vintage-paper, #f4ecd8)' }}
                delay={0.1}
              >
                Teaching became my purpose.
              </AnimatedParagraph>

              <AnimatedParagraph
                className="text-lg leading-[1.8]"
                style={{ color: 'rgba(244, 236, 216, 0.5)' }}
                delay={0.2}
              >
                I created this classroom at home after requests from parents seeking small, focused groups where every child actually speaks. Personalized attention and real conversation practice.
              </AnimatedParagraph>

              <AnimatedParagraph
                className="text-base leading-[1.8]"
                style={{ color: 'rgba(244, 236, 216, 0.4)' }}
                delay={0.3}
              >
                When I'm not teaching, you'll find me reading, lifting weights, or on the mats grappling.
              </AnimatedParagraph>
            </div>

            {/* Quote - Engraved style */}
            <blockquote className="about-quote relative pl-8 mb-16 max-w-lg">
              <div
                className="absolute left-0 top-0 bottom-0 w-[2px]"
                style={{
                  background: 'linear-gradient(to bottom, var(--oxidized-copper, #43b3ae), var(--dried-blood, #8a0303), transparent)'
                }}
              />
              <p
                className="text-2xl md:text-3xl font-display italic leading-[1.4]"
                style={{ color: 'rgba(244, 236, 216, 0.6)' }}
              >
                &ldquo;{t('philosophy.description')}&rdquo;
              </p>
            </blockquote>

            {/* Credentials - Punched metal style */}
            <div className="about-credentials flex flex-wrap items-center gap-4 mb-12">
              <span
                className="about-credential punched-label group inline-flex items-center gap-3"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                  border: '1px solid rgba(67, 179, 174, 0.2)',
                  color: 'var(--vintage-paper, #f4ecd8)',
                }}
              >
                <Award className="w-4 h-4" style={{ color: 'var(--oxidized-copper, #43b3ae)' }} />
                {t('credentials.tesol')}
              </span>
              <span
                className="about-credential punched-label group inline-flex items-center gap-3"
                style={{
                  background: 'linear-gradient(180deg, #1a1a1a 0%, #0d0d0d 100%)',
                  border: '1px solid rgba(67, 179, 174, 0.2)',
                  color: 'var(--vintage-paper, #f4ecd8)',
                }}
              >
                <BookOpen className="w-4 h-4" style={{ color: 'var(--oxidized-copper, #43b3ae)' }} />
                {t('credentials.pgce')}
              </span>
              <span
                className="about-credential inline-flex items-center gap-3 px-6 py-4 text-[10px] font-mono font-medium tracking-[0.12em] uppercase"
                style={{
                  color: 'var(--oxidized-copper, #43b3ae)',
                  border: '1px solid rgba(67, 179, 174, 0.4)',
                  background: 'rgba(67, 179, 174, 0.1)',
                }}
              >
                DELTA Trained
              </span>
            </div>

            {/* CTA - Liquid button */}
            <a
              href="#contact"
              className="about-credential group relative inline-flex items-center gap-4 px-10 py-5 text-sm font-semibold tracking-[0.08em] uppercase overflow-hidden transition-all duration-500"
              style={{
                background: 'linear-gradient(135deg, var(--oxidized-copper, #43b3ae), #3d9994)',
                color: 'var(--void-black, #050505)',
                boxShadow: '0 0 30px rgba(67, 179, 174, 0.3)',
              }}
            >
              <span className="relative z-10">Start your journey</span>
              <ArrowRight className="relative z-10 w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
              <div
                className="absolute inset-0 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"
                style={{ background: 'var(--vintage-paper, #f4ecd8)' }}
              />
            </a>
          </div>

          {/* Right: Image - Bell jar / Wax figure aesthetic */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-32">
            <div
              ref={imageRef}
              className="about-image-container relative aspect-[3/4] overflow-hidden"
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
              style={{
                transform: imageHover
                  ? `perspective(1000px) rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`
                  : 'perspective(1000px) rotateY(0deg) rotateX(0deg)',
                transition: 'transform 0.3s ease-out',
                border: '1px solid rgba(67, 179, 174, 0.1)',
              }}
            >
              {/* Curtain reveal - Tobacco color */}
              <div
                className="about-image-curtain absolute inset-0 z-20"
                style={{ backgroundColor: 'var(--tobacco-brown, #3d2817)' }}
              />

              {/* Image with wax-like treatment */}
              <div className="about-image-inner absolute inset-0">
                <ProfileImage className="w-full h-full object-cover object-top" />
              </div>

              {/* Gradient overlays - Darker, more dramatic */}
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(to top, rgba(5,5,5,0.8) 0%, rgba(5,5,5,0.3) 40%, transparent 100%)'
                }}
              />
              <div
                className="absolute inset-0 z-10"
                style={{
                  background: 'linear-gradient(to right, rgba(61,40,23,0.5) 0%, transparent 50%)'
                }}
              />

              {/* Glass jar / Bell jar effect */}
              <div
                className="absolute inset-0 z-15 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                }}
              />

              {/* Location badge */}
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <div
                  className="inline-flex items-center gap-3 px-5 py-3 text-xs font-mono tracking-wider backdrop-blur-xl"
                  style={{
                    background: 'rgba(5, 5, 5, 0.7)',
                    border: '1px solid rgba(67, 179, 174, 0.2)',
                    color: 'var(--vintage-paper, #f4ecd8)',
                  }}
                >
                  <MapPin className="w-4 h-4" style={{ color: 'var(--oxidized-copper, #43b3ae)' }} />
                  Ho Chi Minh City, Vietnam
                </div>
              </div>

              {/* Corner accents - Oxidized copper */}
              <div
                className="absolute top-0 left-0 w-16 h-16 z-10"
                style={{
                  borderLeft: '2px solid var(--oxidized-copper, #43b3ae)',
                  borderTop: '2px solid var(--oxidized-copper, #43b3ae)',
                }}
              />
              <div
                className="absolute bottom-0 right-0 w-16 h-16 z-10"
                style={{
                  borderRight: '2px solid var(--dried-blood, #8a0303)',
                  borderBottom: '2px solid var(--dried-blood, #8a0303)',
                }}
              />

              {/* Hover glow - Oxidized copper */}
              <div
                className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-500"
                style={{
                  opacity: imageHover ? 0.4 : 0,
                  background: `radial-gradient(circle at ${(mousePos.x + 1) * 50}% ${(mousePos.y + 1) * 50}%, rgba(67, 179, 174, 0.3) 0%, transparent 50%)`
                }}
              />
            </div>

            {/* Stats - Obsidian slabs */}
            <div className="about-stats grid grid-cols-3 gap-4 mt-8">
              {[
                { value: '2K+', label: 'Students' },
                { value: '3', label: 'Years', accent: true },
                { value: '15+', label: 'Schools' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="about-stat obsidian-card text-center p-6"
                  style={{
                    background: 'linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 50%, #1a1a1a 100%)',
                    border: '1px solid rgba(67, 179, 174, 0.1)',
                  }}
                >
                  <span
                    className="block text-4xl md:text-5xl font-display font-bold"
                    style={{
                      color: stat.accent
                        ? 'var(--oxidized-copper, #43b3ae)'
                        : 'var(--vintage-paper, #f4ecd8)',
                      textShadow: stat.accent
                        ? '0 0 20px rgba(67, 179, 174, 0.5)'
                        : 'none',
                    }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-[10px] font-mono tracking-[0.15em] uppercase"
                    style={{ color: 'rgba(244, 236, 216, 0.4)' }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom marquee text - Archaeological */}
      <div
        className="absolute bottom-0 left-0 right-0 overflow-hidden py-6"
        style={{
          borderTop: '1px solid rgba(67, 179, 174, 0.1)',
          background: 'rgba(5, 5, 5, 0.8)',
        }}
      >
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="mx-12 text-6xl md:text-8xl font-display font-bold tracking-tighter"
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px rgba(67, 179, 174, 0.1)',
              }}
            >
              EXCAVATE
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
