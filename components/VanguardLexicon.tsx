"use client";

import React, { useRef, useEffect, useState } from "react";
import { ArrowUpRight, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { ScrollText } from "./ScrollText";
import { trackCTAClick } from "@/lib/analytics";
import { PricingGateModal } from "./PricingGateModal";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const PROGRAM_KEYS = ["youngLearners", "teens", "ielts"] as const;
const PROGRAM_IDS = ["01", "02", "03"] as const;
const OUTCOMES_COUNT = 4;

export function VanguardLexicon() {
  const t = useTranslations("programs");
  const reduceMotion = useReducedMotion();
  const [pricingOpen, setPricingOpen] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const bannerTextRef = useRef<HTMLDivElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const progressSegRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const ghostRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bottomCtaRef = useRef<HTMLDivElement>(null);

  const programs = PROGRAM_KEYS.map((key, i) => ({
    id: PROGRAM_IDS[i],
    key,
    title: t(`${key}.title`),
    subtitle: t(`${key}.subtitle`),
    tagline: t(`${key}.tagline`),
    method: t(`${key}.method`),
    format: t(`${key}.format`),
    price: t(`${key}.price`),
    schedule: t(`${key}.schedule`),
    outcomes: Array.from({ length: OUTCOMES_COUNT }, (_, j) =>
      t(`${key}.outcomes_${j}` as Parameters<typeof t>[0])
    ),
  }));

  useEffect(() => {
    if (reduceMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Pricing banner text parallax — skip on mobile (perf + layout jank)
      if (bannerTextRef.current && !isMobile) {
        gsap.to(bannerTextRef.current, {
          yPercent: -15,
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      // Program cards — dramatic 3D entrance stagger
      const cards = cardsGridRef.current?.children;
      if (cards && cards.length > 0) {
        Array.from(cards).forEach((card, i) => {
          const delay = isMobile ? 0 : i * 0.14;
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: isMobile ? 40 : 60,
              rotateX: isMobile ? 0 : 8,
              scale: 0.94,
              transformOrigin: "center bottom",
            },
            {
              opacity: 1,
              y: 0,
              rotateX: 0,
              scale: 1,
              duration: isMobile ? 0.7 : 1.0,
              delay,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: isMobile ? "top 98%" : "top 88%",
                once: true,
              },
            }
          );
        });
      }

      // Card grid perspective for 3D effect
      if (cardsGridRef.current && !isMobile) {
        gsap.set(cardsGridRef.current, { perspective: 1200, perspectiveOrigin: "50% 80%" });
      }

      // Pinned showcase — desktop only
      if (!isMobile && pinWrapRef.current && cardsGridRef.current) {
        const cards = Array.from(cardsGridRef.current.children) as HTMLElement[];
        const segs = progressSegRefs.current.filter(Boolean) as HTMLSpanElement[];
        const PIN_DISTANCE = 560;

        // Initialise dimmed state (applied after entrance anim via delay)
        gsap.delayedCall(1.2, () => {
          cards.forEach((c, i) => {
            if (i > 0) gsap.set(c, { opacity: 0.45 });
          });
          if (segs[0]) gsap.set(segs[0], { scaleX: 1 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: pinWrapRef.current,
            pin: true,
            start: "top top+=72",
            end: `+=${PIN_DISTANCE}`,
            scrub: 1,
            anticipatePin: 1,
          },
        });

        // Card 0 → 1 transition at 40% progress
        tl.to(cards[0], { opacity: 0.45, ease: "power1.inOut" }, 0.3)
          .to(cards[1], { opacity: 1,    ease: "power1.inOut" }, 0.3)
          .to(segs[0],  { scaleX: 1,     ease: "none"         }, 0)
          .to(segs[1],  { scaleX: 1,     ease: "none"         }, 0.35);

        // Card 1 → 2 transition at 70% progress
        tl.to(cards[1], { opacity: 0.45, ease: "power1.inOut" }, 0.65)
          .to(cards[2], { opacity: 1,    ease: "power1.inOut" }, 0.65)
          .to(segs[2],  { scaleX: 1,     ease: "none"         }, 0.68);
      }

      // Ghost ID counter - count up from 00 to value
      ghostRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = parseInt(PROGRAM_IDS[i]);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el.parentElement,
            start: isMobile ? "top 98%" : "top 80%",
          },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.val)).padStart(2, "0");
          },
        });
      });

      // Bottom CTA fade up
      if (bottomCtaRef.current) {
        gsap.fromTo(
          bottomCtaRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: bottomCtaRef.current,
              start: "top 90%",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      id="lexicon"
      ref={sectionRef}
      className="bg-background text-foreground border-t border-foreground/5 relative overflow-hidden"
      style={{ scrollMarginTop: "var(--nav-h)" }}
    >
      {/* PRICING BANNER */}
      <div
        ref={bannerRef}
        className="bg-foreground text-background px-6 md:px-10 lg:px-16 py-12 md:py-16 lg:py-20 relative overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div ref={bannerTextRef} className="max-w-[1920px] mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8 lg:gap-20">
            <div>
              <span className="text-[13px] uppercase tracking-[0.22em] opacity-60 mb-5 block">
                {t("sectionLabel")}
              </span>
              <div
                className="font-display font-bold leading-[0.94] tracking-tight max-w-2xl"
                style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.6rem)" }}
              >
                {t("pricingNote")}
              </div>
              <button
                type="button"
                onClick={() => { trackCTAClick("lexicon", "pricing_gate_banner"); setPricingOpen(true); }}
                className="group mt-6 inline-flex items-center gap-3 px-6 py-3.5 bg-background text-foreground font-mono text-[12px] uppercase tracking-[0.2em] hover:opacity-90 transition-opacity duration-300"
              >
                <Lock size={12} aria-hidden="true" />
                {t("pricingCta")}
                <ArrowUpRight size={12} aria-hidden="true" />
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 font-mono text-sm opacity-60">
                <span className="w-5 h-[1px] bg-background/50 shrink-0" aria-hidden="true" />
                <span>{t("scheduleNote")}</span>
              </div>
              <div className="flex items-center gap-4 font-mono text-sm opacity-60">
                <span className="w-5 h-[1px] bg-background/50 shrink-0" aria-hidden="true" />
                <span>{t("formatNote")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content — pinWrapRef wraps for GSAP pin on desktop */}
      <div ref={pinWrapRef} className="px-6 md:px-10 lg:px-16 py-[clamp(3.5rem,7vw,6rem)]">
        <div className="max-w-[1920px] mx-auto">
          {/* Section Header */}
          <div className="grid grid-cols-12 gap-8 mb-14 lg:mb-20">
            <div className="col-span-12 lg:col-span-7">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-12 h-[1px] bg-foreground/30" />
                <span className="bracket-label">
                  03 &mdash; {t("sectionLabel")}
                </span>
              </div>
              <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] tracking-tight mb-8">
                <ScrollText mode="entrance">{t("heading")}</ScrollText>{" "}
                <span className="italic">
                  <ScrollText mode="entrance" stagger={0.03} className="italic">
                    {t("headingItalic")}
                  </ScrollText>
                </span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-5 flex flex-col justify-end lg:items-end lg:text-right border-t border-foreground/10 lg:border-t-0 pt-10 lg:pt-0">
              <p className="font-display text-xl italic mb-3 text-foreground/80">
                {t("subtitle")}
              </p>
              <p className="font-mono text-sm text-foreground/65 max-w-xs leading-relaxed">
                {t("subtitleDesc")}
              </p>
            </div>
          </div>

          {/* Scroll-progress bar — desktop only, hidden on mobile */}
          <div className="hidden md:flex items-center gap-1 mb-5" aria-hidden="true">
            {PROGRAM_KEYS.map((key, i) => (
              <span key={key} className="flex-1 h-[2px] bg-foreground/10 relative overflow-hidden">
                <span
                  ref={(el) => { progressSegRefs.current[i] = el; }}
                  className="absolute inset-0 bg-foreground/50 origin-left"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            ))}
          </div>

          {/* Program Grid — 3 equal editorial columns */}
          <div id="programs" ref={cardsGridRef} className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10">
            {programs.map((program, index) => (
              <div
                key={program.id}
                data-cursor-label="VIEW"
                className="group relative flex flex-col bg-background p-7 lg:p-10 min-h-0 md:min-h-[480px] hover:bg-foreground/[0.02] transition-colors duration-700"
              >
                {/* Ghost ID */}
                <div
                  ref={(el) => { ghostRefs.current[index] = el; }}
                  className="font-display font-bold leading-none select-none text-foreground/[0.05] group-hover:text-foreground/[0.09] transition-colors duration-700 absolute top-4 right-6 pointer-events-none"
                  style={{ fontSize: "clamp(4rem, 8vw, 7rem)" }}
                  aria-hidden="true"
                >
                  {program.id}
                </div>

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Program identity */}
                  <div className="mb-6">
                    <p className="font-mono text-[13px] uppercase tracking-[0.18em] text-foreground/40 mb-2">
                      {program.subtitle}
                    </p>
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2 group-hover:italic transition-all duration-500">
                      {program.title}
                    </h3>
                    <p className="font-mono text-xs text-foreground/50 italic leading-relaxed mb-5">
                      {program.tagline}
                    </p>
                    {/* Method — distinct per program */}
                    <div className="border-l-2 border-foreground/20 pl-3 group-hover:border-foreground/40 transition-colors duration-500">
                      <p className="font-sans font-light text-[13px] text-foreground/60 leading-relaxed">
                        {program.method}
                      </p>
                    </div>
                  </div>

                  {/* Schedule block — pricing lives behind the gate, not on the card */}
                  <div className="border border-foreground/15 px-5 py-4 mb-6">
                    <div className="flex flex-col gap-1.5">
                      <p className="font-mono text-[13px] text-foreground/50 leading-snug">
                        {program.schedule}
                      </p>
                      <p className="font-mono text-[13px] text-foreground/50 leading-snug">
                        {program.format}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { trackCTAClick("lexicon", `pricing_gate_${program.id}`); setPricingOpen(true); }}
                      className="group mt-3 pt-3 border-t border-foreground/10 w-full flex items-center justify-between font-mono text-[12px] uppercase tracking-[0.14em] text-foreground/45 hover:text-foreground transition-colors duration-300"
                    >
                      <span className="flex items-center gap-2">
                        <Lock size={11} aria-hidden="true" />
                        {t("pricingCta")}
                      </span>
                      <ArrowUpRight size={11} aria-hidden="true" />
                    </button>
                  </div>

                  {/* Outcomes */}
                  <ul className="flex flex-col divide-y divide-foreground/[0.06] mb-8 flex-1">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome} className="flex items-baseline gap-3 py-2.5">
                        <span
                          className="font-mono text-foreground/25 text-[13px] shrink-0 group-hover:text-foreground/55 transition-colors duration-500"
                          aria-hidden="true"
                        >
                          →
                        </span>
                        <span className="font-mono text-[13px] text-foreground/65 leading-snug">
                          {outcome}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA link */}
                  <a
                    href="#contact"
                    onClick={() => trackCTAClick("lexicon", `program_${program.id}`)}
                    className="inline-flex items-center gap-2 mt-auto font-mono text-[13px] uppercase tracking-widest text-foreground/40 underline underline-offset-4 hover:text-foreground transition-colors duration-300 self-start"
                  >
                    {t("requestDetails")}
                    <ArrowUpRight size={10} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div
            ref={bottomCtaRef}
            className="mt-16 pt-10 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          >
            <div className="max-w-xl">
              <h4 className="font-display text-[clamp(1.6rem,3.5vw,2.8rem)] italic mb-3 leading-tight">
                {t("readyTitle")}
              </h4>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">
                {t("readyDesc")}
              </p>
            </div>
            <a href="#contact" className="group shrink-0">
              <div
                className="relative px-10 py-5 border border-foreground/20 overflow-hidden hover:border-foreground transition-colors duration-300"
                onClick={() => trackCTAClick("lexicon", "apply_admission")}
              >
                <span className="relative z-10 font-mono text-[13px] uppercase tracking-[0.2em]">
                  {t("requestCta")}
                </span>
                <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 opacity-[0.04]" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <PricingGateModal
        isOpen={pricingOpen}
        onClose={() => setPricingOpen(false)}
        programs={programs.map(({ key, title, price }) => ({ key, title, price }))}
      />
    </section>
  );
}
