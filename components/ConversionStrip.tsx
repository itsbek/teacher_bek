"use client";

import { useRef, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { trackCTAClick } from "@/lib/analytics";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ConversionStrip() {
  const t = useTranslations("cta");
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Scale reveal: entire section scales from 0.9 → 1.0 with opacity scrubbed
      gsap.fromTo(
        sectionRef.current,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: true,
          },
        }
      );

      // Heading wipe: clip-path from left to right, scrubbed
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { clipPath: "inset(0 100% 0 0)" },
          {
            clipPath: "inset(0 0% 0 0)",
            ease: "none",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 85%",
              end: "top 45%",
              scrub: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="px-6 md:px-10 lg:px-16 py-16 md:py-20 border-y border-foreground/10 bg-background relative overflow-hidden"
    >
      {/* Subtle dot grid */}
      <div className="dot-grid opacity-50" />

      <div className="max-w-[1920px] mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — Copy */}
          <div className="lg:col-span-8">
            <p className="font-sans text-[12px] uppercase tracking-[0.22em] opacity-50 font-light mb-5">
              {t("heading")}
            </p>
            <h2
              ref={headingRef}
              className="font-display font-bold uppercase leading-[0.92]"
              style={{ fontSize: "clamp(1.8rem, 4vw, 4rem)", letterSpacing: "-0.04em" }}
            >
              {t("subtitle").split('.')[0]}.{" "}
              <span className="opacity-45 font-light">{t("headingItalic")}</span>
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-3 mt-7">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="font-sans text-[13px] uppercase tracking-[0.14em] opacity-60 font-light flex items-center gap-2"
                >
                  <span className="opacity-50" aria-hidden="true">—</span>
                  {t(`checklist_${i}` as Parameters<typeof t>[0])}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — CTA + Phone */}
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end lg:justify-center gap-5">
            <a
              href="https://zalo.me/84353885757"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick("strip", "phone_call")}
              className="group flex flex-col items-start lg:items-end"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] opacity-50 font-light mb-1">
                {t("phoneLabel")}
              </span>
              <span
                className="font-display font-bold leading-none tracking-tight text-foreground group-hover:opacity-60 transition-opacity duration-300"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.6rem)", letterSpacing: "-0.04em" }}
              >
                +84 353 88 5757
              </span>
            </a>
            <a
              href="#contact"
              onClick={() => trackCTAClick("strip", "free_assessment")}
              className="inline-flex items-center justify-center gap-3 w-full lg:w-auto border border-foreground/60 px-7 py-4 font-sans text-[13px] uppercase tracking-[0.2em] font-light hover:bg-foreground hover:text-background transition-all duration-500"
              style={{ transitionTimingFunction: "var(--transition-main)" }}
            >
              {t("button")}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
