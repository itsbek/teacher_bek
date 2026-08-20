"use client";

import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type TestimonialItem = {
  name: string;
  role: string;
  quote: string;
  rating: number;
};

export function Testimonials() {
  const t = useTranslations("testimonials");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);

  // Placeholder testimonials — structured for a real-review swap once Google Reviews / GBP is set up.
  const items = t.raw("items") as TestimonialItem[];

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      const cards = cardsGridRef.current?.children;
      if (cards && cards.length > 0) {
        Array.from(cards).forEach((card, i) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.7,
              delay: i * 0.08,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 92%", once: true },
            }
          );
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="bg-background text-foreground border-t border-foreground/5 px-6 md:px-10 lg:px-16 py-[clamp(3.5rem,7vw,6rem)]"
      style={{ scrollMarginTop: "var(--nav-h)" }}
    >
      <div className="max-w-[1920px] mx-auto">
        {/* Section header */}
        <div className="grid grid-cols-12 gap-8 mb-14 lg:mb-20">
          <div className="col-span-12 lg:col-span-7">
            <div className="flex items-center gap-6 mb-8">
              <div className="w-12 h-[1px] bg-foreground/30" />
              <span className="bracket-label">
                03 &mdash; {t("sectionLabel")}
              </span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] tracking-tight">
              {t("title")}
            </h2>
          </div>
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right border-t border-foreground/10 lg:border-t-0 pt-10 lg:pt-0">
            <p className="font-mono text-sm text-foreground/65 max-w-sm leading-relaxed">
              {t("subtitle")}
            </p>
          </div>
        </div>

        {/* Testimonial grid */}
        <div ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10">
          {items.map((item) => (
            <div
              key={item.name}
              className="flex flex-col bg-background p-7 lg:p-8"
            >
              <div className="flex items-center gap-1 mb-5" aria-label={`${item.rating} out of 5 stars`}>
                {Array.from({ length: item.rating }, (_, i) => (
                  <Star key={i} size={13} fill="currentColor" className="text-foreground/70" aria-hidden="true" />
                ))}
              </div>
              <p className="font-sans font-light text-[14px] text-foreground/75 leading-relaxed mb-7 flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="pt-4 border-t border-foreground/10">
                <p className="font-display font-bold text-foreground leading-tight">{item.name}</p>
                <p className="font-mono text-[12px] text-foreground/50 mt-1">{item.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
