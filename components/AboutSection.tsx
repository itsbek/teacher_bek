"use client";

import React, { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { SplitHeading } from "@/components/ui/split-heading";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function AboutSection() {
  const t       = useTranslations("about");
  const tFooter = useTranslations("footer");
  const reduceMotion = useReducedMotion();
  const sectionRef    = useRef<HTMLElement>(null);
  const bodyRef       = useRef<HTMLDivElement>(null);
  const pullRef       = useRef<HTMLParagraphElement>(null);
  const mobilePullRef = useRef<HTMLParagraphElement>(null);
  const imageWrapRef  = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const classroomRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number | null>(null);

  const handleImageMouseMove = useCallback((e: MouseEvent) => {
    if (reduceMotion || !imageWrapRef.current || !imageInnerRef.current) return;
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const rect = imageWrapRef.current!.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width  - 0.5;
      const cy = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to(imageInnerRef.current, {
        x: cx * 14,
        y: cy * 10,
        rotateY: cx * 4,
        rotateX: -cy * 3,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, [reduceMotion]);

  const handleImageMouseLeave = useCallback(() => {
    if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    gsap.to(imageInnerRef.current, {
      x: 0, y: 0, rotateY: 0, rotateX: 0,
      duration: 0.8, ease: "power3.out", overwrite: "auto",
    });
  }, []);

  useEffect(() => {
    const el = imageWrapRef.current;
    if (!el || reduceMotion) return;
    el.addEventListener("mousemove", handleImageMouseMove);
    el.addEventListener("mouseleave", handleImageMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleImageMouseMove);
      el.removeEventListener("mouseleave", handleImageMouseLeave);
    };
  }, [handleImageMouseMove, handleImageMouseLeave, reduceMotion]);

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (bodyRef.current) {
        gsap.fromTo(bodyRef.current,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2,
            scrollTrigger: { trigger: bodyRef.current, start: "top 85%", once: true } }
        );
      }
      // Animate both mobile and desktop pull quote refs independently
      [pullRef.current, mobilePullRef.current].filter(Boolean).forEach((el) => {
        gsap.fromTo(el,
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true } }
        );
      });
      if (imageWrapRef.current) {
        gsap.fromTo(imageWrapRef.current,
          { opacity: 0, x: 24 },
          { opacity: 1, x: 0, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: imageWrapRef.current, start: "top 80%", once: true } }
        );
      }
      if (classroomRef.current) {
        gsap.fromTo(classroomRef.current,
          { clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" },
          { clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.4, ease: "power3.inOut",
            scrollTrigger: { trigger: classroomRef.current, start: "top 82%", once: true } }
        );
        const inner = classroomRef.current.querySelector(".cls-inner");
        if (inner) {
          gsap.fromTo(inner,
            { scale: 1.08, x: "3%" },
            { scale: 1, x: "0%", duration: 1.6, ease: "power3.out",
              scrollTrigger: { trigger: classroomRef.current, start: "top 82%", once: true } }
          );
        }
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ scrollMarginTop: "5rem", background: "var(--gradient-section-copper), hsl(var(--background))", color: "hsl(var(--foreground))" }}
    >

      {/* ── META BAR — matches hero label style ───────────────── */}
      <div
        className="flex items-center justify-between px-6 md:px-10 lg:px-16 py-3"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.07)" }}
      >
        <div className="flex items-center gap-4">
          <span className="w-8 h-[1px] bg-foreground/25 shrink-0" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-foreground/65">
            [ 02 &mdash; {t("label")} ]
          </span>
        </div>
        <span className="hidden md:block font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/55">
          {tFooter("city")}, {tFooter("country")}
        </span>
      </div>

      {/* ── MOBILE PORTRAIT ───────────────────────────────────── */}
      <div className="md:hidden relative w-full">
        <Image
          src="/images/teacher-profile.webp"
          alt="Teacher Bek — English teacher in Ho Chi Minh City"
          width={533} height={800} sizes="100vw"
          draggable={false}
          style={{ width: "100%", height: "auto", display: "block",
            filter: "brightness(0.88) contrast(1.06) saturate(0.82)", WebkitTouchCallout: "none", userSelect: "none" }}
          priority
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent 50%, hsl(var(--background) / 0.6) 72%, hsl(var(--background)) 88%)" }}
          aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-5">
          <h2
            className="font-display font-bold uppercase text-foreground overflow-visible"
            style={{ fontSize: "clamp(3.5rem, 18vw, 6rem)", lineHeight: 0.85, letterSpacing: "-0.04em", margin: 0 }}
          >
            {t("title")}
          </h2>
        </div>
      </div>

      {/* ── MOBILE CONTENT ────────────────────────────────────── */}
      <div
        className="md:hidden"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.07)" }}
      >
        <div className="px-6 pt-6 pb-5 flex flex-col" style={{ gap: "0.75rem" }}>
          <p className="font-mono text-foreground/65 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)", margin: 0 }}>
            {t("story.p1")}
          </p>
          <p className="font-mono text-foreground/65 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 3.5vw, 1rem)", margin: 0 }}>
            {t("story.p2")}
          </p>
        </div>
        <div className="px-6 pb-8" style={{ borderTop: "1px solid hsl(var(--foreground) / 0.07)", paddingTop: "clamp(20px, 5vw, 28px)" }}>
          <blockquote style={{ margin: 0, padding: 0, position: "relative", paddingLeft: "clamp(1rem, 4vw, 1.5rem)" }}>
            <span aria-hidden="true" className="font-display font-bold absolute left-0 leading-none" style={{ fontSize: "clamp(1.8rem, 6vw, 2.8rem)", top: "-0.05em", color: "#C85C3F", opacity: 0.75 }}>&ldquo;</span>
            <p
              ref={mobilePullRef}
              className="font-display italic text-foreground/80"
              style={{ fontSize: "clamp(1.1rem, 4.5vw, 1.35rem)", lineHeight: 1.4, letterSpacing: "-0.02em", fontWeight: 300, margin: 0, opacity: 0.65 }}
            >
              {t("story.pull")}
            </p>
          </blockquote>
        </div>
      </div>

      {/* ── DESKTOP: TEXT + PORTRAIT ──────────────────────────── */}
      <div
        className="hidden md:flex"
        style={{ borderBottom: "1px solid hsl(var(--foreground) / 0.07)", alignItems: "stretch" }}
      >
        {/* LEFT — text column */}
        <div
          className="flex flex-col justify-between px-10 lg:px-16 py-12 lg:py-16"
          style={{ flex: "1 1 0", borderRight: "1px solid hsl(var(--foreground) / 0.07)" }}
        >
          {/* TOP — heading + body caption */}
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(2rem, 3.5vw, 4rem)" }}>
            <h2
              className="font-display font-bold uppercase text-foreground overflow-visible"
              style={{ fontSize: "clamp(5rem, 13vw, 12rem)", lineHeight: 0.82, letterSpacing: "-0.045em", margin: 0 }}
            >
              <SplitHeading delay={0.15} stagger={0.055}>{t("title")}</SplitHeading>
            </h2>

            <div ref={bodyRef} className="flex flex-col" style={{ gap: "0.75rem" }}>
              <p className="font-mono text-foreground/65 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)", margin: 0 }}>
                {t("story.p1")}
              </p>
              <p className="font-mono text-foreground/65 leading-relaxed" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)", margin: 0 }}>
                {t("story.p2")}
              </p>
            </div>
          </div>

          {/* BOTTOM — pull quote as typographic blockquote */}
          <div style={{ borderTop: "1px solid hsl(var(--foreground) / 0.08)", paddingTop: "clamp(1.5rem, 3vw, 2.5rem)" }}>
            <blockquote style={{ margin: 0, padding: 0, position: "relative", paddingLeft: "clamp(1.25rem, 2.5vw, 2rem)" }}>
              <span aria-hidden="true" className="font-display font-bold absolute left-0 leading-none" style={{ fontSize: "clamp(1.8rem, 2.8vw, 3rem)", top: "-0.1em", color: "#C85C3F", opacity: 0.75 }}>&ldquo;</span>
              <p
                ref={pullRef}
                className="font-display italic text-foreground/80"
                style={{ fontSize: "clamp(1.2rem, 1.8vw, 1.8rem)", lineHeight: 1.4, letterSpacing: "-0.02em", fontWeight: 300, margin: 0, opacity: 0.65 }}
              >
                {t("story.pull")}
              </p>
            </blockquote>
          </div>
        </div>

        {/* RIGHT — portrait at natural ratio */}
        <div
          ref={imageWrapRef}
          style={{ flexShrink: 0, width: "clamp(260px, 36vw, 480px)", perspective: "800px", overflow: "hidden" }}
        >
          <div ref={imageInnerRef} style={{ willChange: "transform" }}>
            <Image
              src="/images/teacher-profile.webp"
              alt="Teacher Bek — English teacher in Ho Chi Minh City"
              width={533} height={800} sizes="36vw"
              draggable={false}
              style={{ width: "100%", height: "auto", display: "block",
                filter: "brightness(0.85) contrast(1.08) saturate(0.82)", WebkitTouchCallout: "none", userSelect: "none" }}
              priority
            />
          </div>
        </div>
      </div>

      {/* ── CLASSROOM IMAGE ───────────────────────────────────── */}
      <div
        ref={classroomRef}
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(300px, 42vw, 560px)" }}
        aria-label="Teacher Bek's classroom"
      >
        <div className="cls-inner absolute inset-0">
          <Image
            src="/images/classroom.webp"
            alt="The classroom — colourful chairs around a central table, ambient warm lighting"
            fill sizes="100vw"
            className="object-cover"
            draggable={false}
            style={{ objectPosition: "center 45%", filter: "brightness(1.0) contrast(1.05) saturate(1.1)", WebkitTouchCallout: "none", userSelect: "none" }}
          />
        </div>
        <div className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ height: "18%", background: "linear-gradient(to bottom, hsl(var(--background)) 0%, transparent 100%)" }}
          aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{ height: "22%", background: "linear-gradient(to top, hsl(var(--background)) 0%, transparent 100%)" }}
          aria-hidden="true" />
        <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 pb-3 pointer-events-none">
          <span style={{ width: 20, height: 1, background: "hsl(var(--foreground))", opacity: 0.16, display: "block" }} aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/60">
            {t("classroom.address")}
          </span>
          <span style={{ width: 20, height: 1, background: "hsl(var(--foreground))", opacity: 0.16, display: "block" }} aria-hidden="true" />
        </div>
      </div>

    </section>
  );
}
