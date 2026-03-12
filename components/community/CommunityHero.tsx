"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";

export function CommunityHero() {
  const t = useTranslations("community");
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduceMotion || !heroRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-appear",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: "power4.out", delay: 0.1 }
      );
    }, heroRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={heroRef}
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "clamp(7rem, 14vw, 11rem) clamp(1.25rem, 4vw, 2rem) clamp(5rem, 9vw, 8rem)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}>

        <p
          className="hero-appear"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.4,
            marginBottom: "1.5rem",
          }}
        >
          — {t("studentDirectEyebrow")}
        </p>

        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: "clamp(64px, 11vw, 152px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.88,
            textTransform: "uppercase",
            marginBottom: "clamp(2.5rem, 5vw, 4.5rem)",
          }}
        >
          <span className="hero-appear" style={{ display: "block" }}>
            {t("studentDirectHeading")}
          </span>
          <span
            className="hero-appear"
            style={{ display: "block", fontStyle: "italic", opacity: 0.5 }}
          >
            {t("studentDirectHeadingItalic")}
          </span>
        </h1>

        <div
          className="hero-appear"
          style={{
            borderTop: "1px solid hsl(var(--foreground) / 0.12)",
            paddingTop: "clamp(1.75rem, 3.5vw, 3rem)",
            display: "flex",
            alignItems: "flex-start",
            gap: "clamp(2rem, 4vw, 4rem)",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(15px, 1.6vw, 20px)",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: 0,
            }}
          >
            {t("studentDirectSubtitle")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(12px, 1.1vw, 14px)",
              lineHeight: 1.65,
              opacity: 0.4,
              borderLeft: "2px solid hsl(var(--foreground) / 0.25)",
              paddingLeft: "1rem",
              maxWidth: 360,
              margin: 0,
              flexShrink: 0,
            }}
          >
            {t("reviewNote")}
          </p>
        </div>

      </div>
    </section>
  );
}
