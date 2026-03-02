"use client";

import { useRef, useEffect } from "react";
import { Shield, Users, Wind, MapPin, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const trustIcons = [Shield, Users, Wind, MapPin] as const;
const trustKeys = [
  { labelKey: "cctv", descKey: "cctvDesc" },
  { labelKey: "comfort", descKey: "comfortDesc" },
  { labelKey: "materials", descKey: "materialsDesc" },
  { labelKey: "safety", descKey: "safetyDesc" },
] as const;

export function TrustSection() {
  const t = useTranslations("about.classroom");
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const borderRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Header fade-up
      gsap.fromTo(
        headerRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
          },
        }
      );

      // Cards stagger with slight parallax offset
      const cards = cardsRef.current?.children;
      if (cards && cards.length > 0) {
        gsap.fromTo(
          cards,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // Border width animation: scrub from 0% to 100% as card enters
      borderRefs.current.forEach((borderEl) => {
        if (!borderEl) return;
        gsap.fromTo(
          borderEl,
          { width: "0%" },
          {
            width: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: borderEl.parentElement,
              start: "top 80%",
              end: "top 40%",
              scrub: true,
            },
          }
        );
      });

      // Icon rotation: 360deg as section scrolls through
      iconRefs.current.forEach((iconEl) => {
        if (!iconEl) return;
        gsap.to(iconEl, {
          rotation: 360,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // CTA strip fade-in
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 90%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-foreground/10 bg-background py-[clamp(3.5rem,7vw,6rem)] px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div className="dot-grid opacity-30" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        {/* Header */}
        <div ref={headerRef} className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-14 lg:mb-20">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-10 h-[1px] bg-foreground/30" />
              <span className="bracket-label">02 &mdash; {t("title")}</span>
            </div>
            <h2 className="font-display text-[clamp(2.2rem,5.5vw,4.5rem)] leading-[0.92] tracking-tight text-foreground">
              {t("title")}{" "}
              <span className="italic text-foreground/50">{t("description").split('.')[0]}.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 flex items-end">
            <p className="text-foreground/50 text-base leading-relaxed max-w-xs">
              {t("description")}
            </p>
          </div>
        </div>

        {/* Trust Points Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {trustKeys.map((point, i) => {
            const Icon = trustIcons[i];
            const index = String(i + 1).padStart(2, "0");
            return (
              <div
                key={point.labelKey}
                className="group relative border-t-2 border-foreground/15 hover:border-foreground pt-8 pb-10 pr-8 lg:pr-12 transition-all duration-500"
              >
                {/* Index */}
                <span className="absolute top-8 right-0 lg:right-4 text-[13px] tracking-[0.2em] text-foreground/15 group-hover:text-foreground/35 transition-colors duration-300">
                  {index}
                </span>

                {/* GSAP-animated border bar */}
                <div
                  ref={(el) => { borderRefs.current[i] = el; }}
                  className="absolute top-[-2px] left-0 h-[2px] bg-foreground"
                  style={{ width: "0%" }}
                />

                {/* Icon with rotation */}
                <div
                  ref={(el) => { iconRefs.current[i] = el; }}
                  className="mb-7"
                >
                  <Icon
                    size={22}
                    strokeWidth={1.5}
                    className="text-foreground/40 group-hover:text-foreground transition-colors duration-300"
                  />
                </div>

                {/* Label */}
                <p className="text-[13px] uppercase tracking-[0.18em] text-foreground/45 mb-3 group-hover:text-foreground/70 transition-colors duration-300">
                  {t(`features.${point.labelKey}`)}
                </p>

                {/* Description */}
                <p className="font-display text-[1.05rem] leading-snug text-foreground/65 group-hover:text-foreground group-hover:pl-1 transition-all duration-500">
                  {t(`features.${point.descKey}`)}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div
          ref={ctaRef}
          className="mt-16 pt-8 border-t border-foreground/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <p className="font-display italic text-[clamp(1.1rem,2.5vw,1.6rem)] text-foreground/60">
            {t("address")}
          </p>
          <a
            href="#contact"
            className="accent-underline group inline-flex items-center gap-3 text-sm uppercase tracking-[0.15em] text-foreground border-b border-foreground/25 pb-1 hover:border-foreground transition-colors duration-300"
          >
            {t("title")}
            <ArrowUpRight
              size={14}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
