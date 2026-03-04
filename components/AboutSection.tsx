"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── helpers ─────────────────────────────────────────────── */
function WrapWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <React.Fragment key={i}>
          <span
            className="word-wrap"
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <span className="abt-word" style={{ display: "block" }}>
              {word}
            </span>
          </span>
          {i < text.split(" ").length - 1 && "\u00a0"}
        </React.Fragment>
      ))}
    </>
  );
}

export function AboutSection() {
  const t            = useTranslations("about");
  const reduceMotion = useReducedMotion();
  const sectionRef   = useRef<HTMLElement>(null);
  const headingRef   = useRef<HTMLHeadingElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const classroomRef = useRef<HTMLDivElement>(null);
  const quoteRef     = useRef<HTMLParagraphElement>(null);


  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;
      const ms = (desktop: string) => isMobile ? "top 98%" : desktop;

      const words = headingRef.current?.querySelectorAll(".abt-word");
      if (words?.length) {
        gsap.fromTo(words,
          { y: "105%", opacity: 0 },
          {
            y: "0%", opacity: 1,
            duration: 0.9, stagger: 0.07, ease: "power3.out",
            scrollTrigger: { trigger: headingRef.current, start: ms("top 82%"), once: true },
          }
        );
      }

      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current,
          { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.3, ease: "power3.inOut",
            scrollTrigger: { trigger: imageWrapRef.current, start: ms("top 78%"), once: true },
          }
        );
        const inner = imageWrapRef.current.querySelector(".img-inner");
        if (inner) {
          gsap.fromTo(inner,
            { scale: 1.08 },
            {
              scale: 1, duration: 1.5, ease: "power3.out",
              scrollTrigger: { trigger: imageWrapRef.current, start: ms("top 78%"), once: true },
            }
          );
        }
      }

      if (classroomRef.current) {
        gsap.fromTo(classroomRef.current,
          { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          {
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.4, ease: "power3.inOut",
            scrollTrigger: { trigger: classroomRef.current, start: ms("top 82%"), once: true },
          }
        );
        const inner = classroomRef.current.querySelector(".cls-inner");
        if (inner) {
          gsap.fromTo(inner,
            { scale: 1.08, x: "3%" },
            {
              scale: 1, x: "0%", duration: 1.6, ease: "power3.out",
              scrollTrigger: { trigger: classroomRef.current, start: ms("top 82%"), once: true },
            }
          );
        }
      }

      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current,
          { y: 28, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: { trigger: quoteRef.current, start: ms("top 84%"), once: true },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>(".abt-reveal").forEach((el) => {
        gsap.fromTo(el,
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.7, ease: "power2.out",
            scrollTrigger: { trigger: el, start: ms("top 88%"), once: true },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ scrollMarginTop: "5rem", background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
    >

      {/* ── META BAR ─────────────────────────────────────────── */}
      <div
        className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-4"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.08)" }}
      >
        <div className="flex items-center gap-4">
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.5 }}>
            {t("label")}
          </span>
          <span style={{ width: 28, height: 1, background: "hsl(var(--foreground))", opacity: 0.15, display: "block" }} aria-hidden="true" />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.35 }}>02</span>
        </div>
        <span className="hidden md:block" style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.2em", opacity: 0.35 }}>
          Ho Chi Minh City, Vietnam
        </span>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOBILE HERO ROW  (< md)
          Full portrait — no crop. Gradient darkens bottom half.
          Heading + quote overlaid on the dark zone.
      ══════════════════════════════════════════════════════════ */}
      <div
        className="md:hidden relative w-full overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          maxHeight: "78vh",
          minHeight: "420px",
          borderBottom: "1px solid hsl(var(--foreground) / 0.08)",
        }}
      >
        <Image
          src="/images/teacher-profile.webp"
          alt="Teacher Bek — English teacher in Ho Chi Minh City"
          fill
          sizes="100vw"
          className="object-cover object-top"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          style={{
            filter: "brightness(0.88) contrast(1.06) saturate(0.82)",
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
          priority
        />

        {/* Gradient: face clear top 18%, darkens to solid by 60% */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 35%, hsl(var(--background) / 0.55) 62%, hsl(var(--background)) 80%)",
          }}
          aria-hidden="true"
        />

        {/* Text overlaid on the dark zone */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              fontSize: "clamp(2.6rem, 12vw, 3.8rem)",
              color: "hsl(var(--foreground))",
              margin: 0,
              marginBottom: 20,
            }}
            aria-label={t("title")}
          >
            {t("title")}
          </h2>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontStyle: "italic",
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              fontSize: "clamp(1.05rem, 4.8vw, 1.35rem)",
              color: "hsl(var(--foreground))",
              opacity: 0.72,
              margin: 0,
              marginBottom: 14,
            }}
          >
            {t("intro")}
          </p>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.28em",
              opacity: 0.38,
              margin: 0,
              color: "hsl(var(--foreground))",
            }}
          >
            Bek · {t("label")}
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          DESKTOP HERO ROW  (md+)
          Left content 65% | portrait 35% — unchanged.
      ══════════════════════════════════════════════════════════ */}
      <div
        className="hidden md:grid grid-cols-1 lg:grid-cols-[65fr_35fr]"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.08)" }}
      >

        {/* LEFT: dense content stack, top-aligned */}
        <div
          className="flex flex-col justify-start px-6 md:px-10 lg:px-16 pt-10 pb-0 lg:pb-0"
          style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.08)", gap: 0 }}
        >
          <h2
            ref={headingRef}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              textTransform: "uppercase",
              lineHeight: 0.88,
              letterSpacing: "-0.03em",
              fontSize: "clamp(3.2rem, 7.5vw, 9rem)",
              margin: 0,
              marginBottom: "clamp(18px, 2.5vw, 32px)",
            }}
            aria-label={t("title")}
          >
            <WrapWords text={t("title")} />
          </h2>

          <div
            style={{
              borderTop: "1px solid hsl(var(--foreground) / 0.1)",
              paddingTop: "clamp(20px, 2.5vw, 34px)",
              paddingBottom: "clamp(20px, 3vw, 40px)",
              flex: 1,
            }}
          >
            <p
              ref={quoteRef}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontStyle: "italic",
                lineHeight: 0.93,
                letterSpacing: "-0.03em",
                fontSize: "clamp(1.5rem, 3.8vw, 4.5rem)",
                opacity: 0.72,
                margin: 0,
                marginBottom: 20,
              }}
            >
              {t("intro")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.38, margin: 0 }}>
              Bek · {t("label")}
            </p>
          </div>
        </div>

        {/* RIGHT: portrait — natural 533:800 ratio */}
        <div
          className="overflow-hidden"
          style={{ borderLeft: "1px solid hsl(var(--foreground) / 0.08)" }}
        >
          <div
            ref={imageWrapRef}
            className="relative w-full"
            style={{ aspectRatio: "533 / 800" }}
          >
            <div className="img-inner absolute inset-0">
              <Image
                src="/images/teacher-profile.webp"
                alt="Teacher Bek — English teacher in Ho Chi Minh City"
                fill
                sizes="35vw"
                className="object-cover"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                style={{
                  objectPosition: "center top",
                  filter: "brightness(0.85) contrast(1.08) saturate(0.82)",
                  WebkitTouchCallout: "none",
                  userSelect: "none",
                }}
                priority
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── STORY + PHILOSOPHY ───────────────────────────────── */}
      <div
        className="grid grid-cols-1 md:grid-cols-2"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.08)" }}
      >
        {/* Story */}
        <div className="px-6 md:px-10 lg:px-16 py-5 md:py-8 lg:py-10 border-b md:border-b-0 border-foreground/[0.08]">
          <p className="abt-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.45, margin: 0, marginBottom: 16 }}>
            {t("story.title")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 14px)" }}>
            {(["p1", "p2", "p3"] as const).map((key) => (
              <p
                key={key}
                className="abt-reveal"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 300,
                  lineHeight: 1.65,
                  opacity: 0.72,
                  fontSize: "clamp(0.9375rem, 1.3vw, 1rem)",
                  margin: 0,
                }}
              >
                {t(`story.${key}`)}
              </p>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div
          className="px-6 md:px-10 lg:px-16 py-5 md:py-8 lg:py-10 border-t md:border-t-0 md:border-l border-foreground/[0.08]"
        >
          <p className="abt-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.45, margin: 0, marginBottom: 16 }}>
            {t("philosophy.title")}
          </p>
          <p
            className="abt-reveal"
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 300,
              lineHeight: 1.65,
              opacity: 0.72,
              fontSize: "clamp(0.9375rem, 1.3vw, 1rem)",
              margin: 0,
            }}
          >
            {t("philosophy.description")}
          </p>
          <div className="abt-reveal" style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid hsl(var(--foreground) / 0.08)" }}>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", opacity: 0.38, margin: 0, marginBottom: 8 }}>
              {t("locationLabel")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.55, fontWeight: 300, lineHeight: 1.6, margin: 0, marginTop: 8 }}>
              {t("classroom.address")}
            </p>
          </div>
        </div>
      </div>

      {/* ── CLASSROOM IMAGE ──────────────────────────────────── */}
      <div
        ref={classroomRef}
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(260px, 52vw, 680px)" }}
        aria-label="Teacher Bek's classroom"
      >
        <div className="cls-inner absolute inset-0">
          <Image
            src="/images/classroom.webp"
            alt="The classroom — colourful chairs around a central table, ambient warm lighting"
            fill
            sizes="100vw"
            className="object-cover"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            style={{
              objectPosition: "center 45%",
              filter: "brightness(1.0) contrast(1.05) saturate(1.1)",
              WebkitTouchCallout: "none",
              userSelect: "none",
            }}
          />
        </div>
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: "10%", background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)" }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: "22%", background: "linear-gradient(to top, hsl(var(--background)) 0%, hsl(var(--background) / 0.6) 50%, transparent 100%)" }}
          aria-hidden="true"
        />
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 pb-4 pointer-events-none">
          <span style={{ width: 22, height: 1, background: "hsl(var(--foreground))", opacity: 0.16, display: "block" }} aria-hidden="true" />
          <span style={{ fontFamily: "var(--font-sans)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.3em", opacity: 0.4, color: "hsl(var(--foreground))" }}>
            {t("classroom.address")}
          </span>
          <span style={{ width: 22, height: 1, background: "hsl(var(--foreground))", opacity: 0.16, display: "block" }} aria-hidden="true" />
        </div>
      </div>


    </section>
  );
}
