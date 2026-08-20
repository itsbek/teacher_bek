"use client";

import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  id: string;
  title: string;
  description: string;
}

interface MethodologyStepsProps {
  heading: string;
  headingItalic: string;
  sectionLabel: string;
  stepLabel: string;
  steps: Step[];
}

export function MethodologySteps({ heading, headingItalic, sectionLabel, stepLabel, steps }: MethodologyStepsProps) {
  const desktopRef = useRef<HTMLDivElement>(null);
  const trackRef   = useRef<HTMLDivElement>(null);
  const mobileRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const isDesktop = window.innerWidth >= 1024;
    const ctx = gsap.context(() => {

      if (isDesktop && desktopRef.current && trackRef.current) {
        const track = trackRef.current;

        // Delay one tick so layout dimensions are settled
        gsap.delayedCall(0.05, () => {
          const trackWidth   = track.scrollWidth;
          const viewportW    = window.innerWidth;
          const headingW     = viewportW * 0.28;
          const distance     = trackWidth - (viewportW - headingW);
          if (distance <= 0) return;

          gsap.to(track, {
            x: -distance,
            ease: "none",
            scrollTrigger: {
              trigger: desktopRef.current,
              start: "top top",
              end: `+=${distance}`,
              pin: true,
              scrub: 0.8,
              anticipatePin: 1,
            },
          });

          // Fade cards in as section enters
          const cards = track.querySelectorAll<HTMLElement>(".method-card");
          cards.forEach((card, i) => {
            gsap.fromTo(card,
              { opacity: 0, y: 18 },
              {
                opacity: 1, y: 0,
                duration: 0.65,
                delay: i * 0.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: desktopRef.current,
                  start: "top 85%",
                  once: true,
                },
              }
            );
          });
        });
      }

      if (!isDesktop && mobileRef.current) {
        const items = mobileRef.current.querySelectorAll<HTMLElement>("article");
        items.forEach((item, i) => {
          gsap.fromTo(item,
            { y: 28, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.7,
              delay: i * 0.09,
              ease: "power3.out",
              scrollTrigger: { trigger: item, start: "top 92%", once: true },
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ── DESKTOP: pinned horizontal scroll ─────────────────── */}
      <div
        ref={desktopRef}
        className="hidden lg:flex items-stretch"
        style={{ minHeight: "100vh" }}
        aria-label={`${heading} ${headingItalic}`}
      >
        {/* Fixed heading column */}
        <div
          className="flex flex-col justify-center px-16 xl:px-20 shrink-0"
          style={{ width: "28%", borderRight: "1px solid hsl(var(--foreground) / 0.08)" }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="w-8 h-[1px] bg-current opacity-25 shrink-0" aria-hidden="true" />
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
              [ 04 &mdash; {sectionLabel} ]
            </span>
          </div>
          <h3
            className="font-display font-bold leading-[0.88] tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 4.5vw, 5rem)" }}
          >
            {heading}{" "}
            <span className="italic">{headingItalic}</span>
          </h3>
          <div className="mt-12 flex flex-col gap-2">
            {steps.map((_, i) => (
              <span
                key={i}
                className="font-mono text-[10px] uppercase tracking-[0.3em] opacity-20"
                aria-hidden="true"
              >
                — {String(i + 1).padStart(2, "0")}
              </span>
            ))}
          </div>
        </div>

        {/* Scrolling track container */}
        <div className="flex-1 overflow-hidden flex items-stretch">
          <div
            ref={trackRef}
            className="flex will-change-transform"
            style={{ paddingRight: "18vw" }}
          >
            {steps.map((step, i) => (
              <article
                key={step.id}
                className="method-card flex flex-col justify-between bg-background shrink-0 px-12 xl:px-16 py-20"
                style={{
                  width: "clamp(300px, 26vw, 400px)",
                  borderRight: "1px solid hsl(var(--foreground) / 0.08)",
                  minHeight: "100vh",
                }}
              >
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-35 mb-10">
                    {stepLabel} {step.id}
                  </p>
                  <h4
                    className="font-display font-bold leading-[0.9] tracking-tight mb-7"
                    style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}
                  >
                    {step.title}
                  </h4>
                  <p className="font-mono text-[13px] text-foreground/55 leading-relaxed"
                     style={{ maxWidth: "28ch" }}>
                    {step.description}
                  </p>
                </div>
                <span
                  className="font-display font-bold leading-none select-none text-foreground/[0.04]"
                  style={{ fontSize: "clamp(5rem, 8vw, 9rem)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* ── MOBILE / TABLET: vertical stack ──────────────────── */}
      <div
        ref={mobileRef}
        className="lg:hidden px-6 md:px-12 pt-10 pb-14"
      >
        <div className="flex items-center gap-4 mb-6">
          <span className="w-8 h-[1px] bg-current opacity-25 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] opacity-65">
            [ 04 &mdash; {sectionLabel} ]
          </span>
        </div>
        <h3 className="font-display font-bold text-4xl md:text-6xl leading-[0.88] tracking-tight mb-10">
          {heading} <span className="italic">{headingItalic}</span>
        </h3>
        <div className="flex flex-col divide-y divide-foreground/10">
          {steps.map((step, i) => (
            <article key={step.id} className="py-8 first:pt-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] opacity-35 mb-4">
                {stepLabel} {step.id}
              </p>
              <h4 className="font-display font-bold text-2xl mb-3 leading-tight">{step.title}</h4>
              <p className="font-mono text-sm text-foreground/60 leading-relaxed">{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
