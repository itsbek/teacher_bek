"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function StudentStrip() {
  const t = useTranslations("studentStrip");
  const locale = useLocale();
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  const liveActions = [
    t("action1"),
    t("action3"),
    t("action4"),
  ];

  useEffect(() => {
    if (reduceMotion || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".strip-reveal",
        { y: 24, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 82%", once: true },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={ref}
      style={{
        background: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.25rem, 4vw, 2rem)",
        borderTop: "1px solid hsl(var(--background) / 0.08)",
      }}
      aria-label="Student community"
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Eyebrow */}
        <p
          className="strip-reveal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.38,
            marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
          }}
        >
          — {t("eyebrow")}
        </p>

        {/* Two-column layout: 55/45 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr clamp(280px, 42%, 560px)",
            gap: "clamp(3rem, 7vw, 7rem)",
            alignItems: "center",
          }}
          className="strip-main-grid"
        >
          {/* LEFT — heading + subtitle + CTA */}
          <div>
            <h2
              className="strip-reveal"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(48px, 7.5vw, 108px)",
                letterSpacing: "-0.04em",
                lineHeight: 0.9,
                textTransform: "uppercase",
                marginBottom: "clamp(1.5rem, 3vw, 2.5rem)",
              }}
            >
              {t("heading")}<br />
              <em style={{ fontStyle: "italic", opacity: 0.5 }}>
                {t("headingItalic")}
              </em>
            </h2>

            <p
              className="strip-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(15px, 1.5vw, 19px)",
                lineHeight: 1.6,
                opacity: 0.55,
                maxWidth: 440,
                marginBottom: "1rem",
              }}
            >
              {t("subtitle")}
            </p>

            <p
              className="strip-reveal"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(11px, 1vw, 13px)",
                lineHeight: 1.6,
                opacity: 0.3,
                maxWidth: 380,
                borderLeft: "2px solid hsl(var(--background) / 0.2)",
                paddingLeft: "0.875rem",
                marginBottom: "clamp(2rem, 4vw, 3rem)",
              }}
            >
              {t("note")}
            </p>

            <Link
              href={`/${locale}/community`}
              className="strip-reveal"
              style={{
                display: "inline-block",
                background: "hsl(var(--background))",
                color: "hsl(var(--foreground))",
                padding: "clamp(14px, 1.8vw, 20px) clamp(28px, 3.5vw, 52px)",
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(12px, 1.1vw, 14px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                textDecoration: "none",
                transition: "opacity 0.25s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              {t("cta")} →
            </Link>
          </div>

          {/* RIGHT — action list */}
          <div className="strip-reveal">
            {/* Live now */}
            <div style={{ marginBottom: "1rem" }}>
              {liveActions.map((action, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.875rem",
                    padding: "0.7rem 0",
                    borderBottom: "1px solid hsl(var(--background) / 0.07)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      background: "#B85337",
                      color: "#fff",
                      padding: "2px 8px",
                      flexShrink: 0,
                      lineHeight: 1.6,
                    }}
                  >
                    →
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "clamp(13px, 1.2vw, 16px)",
                      lineHeight: 1.5,
                    }}
                  >
                    {action}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .strip-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
