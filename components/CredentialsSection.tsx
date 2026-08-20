"use client";

import React, { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const credentialKeys = ["tesol", "pgce", "delta"] as const;

export function CredentialsSection() {
  const t = useTranslations("about.credentials");
  const classroomT = useTranslations("about.classroom");
  const reduceMotion = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      rowRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reduceMotion]);

  const featureKeys = [
    { labelKey: "cctv", descKey: "cctvDesc" },
    { labelKey: "comfort", descKey: "comfortDesc" },
    { labelKey: "materials", descKey: "materialsDesc" },
    { labelKey: "safety", descKey: "safetyDesc" },
  ] as const;

  return (
    <section
      ref={sectionRef}
      id="credentials"
      className="relative py-[clamp(2.5rem,4.5vw,4.5rem)] px-6 md:px-12 lg:px-24 overflow-hidden"
      style={{ scrollMarginTop: "5rem" }}
    >
      <div className="max-w-[1920px] mx-auto">
        {/* Section Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-6 lg:mb-10">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-10 h-[1px] bg-current opacity-30" />
              <span className="text-[13px] uppercase tracking-[0.22em] opacity-60">
                [ 06 &mdash; {t("title")} ]
              </span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-tight">
              {t("title")}{" "}
              <span className="italic opacity-50">&amp; {classroomT("title")}</span>
            </h2>
          </div>
        </div>

        {/* Qualifications */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-current/10 bg-current/10 mb-8">
          {credentialKeys.map((key, i) => (
            <div
              key={key}
              ref={(el) => { rowRefs.current[i] = el; }}
              className="bg-card p-8 md:p-10"
            >
              <span className="text-[13px] uppercase tracking-[0.2em] opacity-60 block mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-xl md:text-2xl font-bold mb-3">
                {t(key)}
              </h3>
              <p className="text-sm leading-relaxed opacity-60">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>

        {/* Classroom Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {featureKeys.map((point, i) => (
            <div
              key={point.labelKey}
              ref={(el) => { rowRefs.current[i + 3] = el; }}
              className="group border-t-2 border-current/15 hover:border-current pt-8 pb-10 pr-8 lg:pr-12 transition-all duration-500"
            >
              <span className="text-[13px] tracking-[0.2em] opacity-40 block mb-6">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="text-[13px] uppercase tracking-[0.18em] opacity-60 mb-3 group-hover:opacity-70 transition-opacity duration-300">
                {classroomT(`features.${point.labelKey}`)}
              </p>
              <p className="font-display text-[1.05rem] leading-snug opacity-65 group-hover:opacity-100 group-hover:pl-1 transition-all duration-500">
                {classroomT(`features.${point.descKey}`)}
              </p>
            </div>
          ))}
        </div>

        {/* Address */}
        <div className="mt-6 pt-5 border-t border-current/10">
          <p className="font-mono text-sm opacity-50">
            {classroomT("address")}
          </p>
        </div>
      </div>
    </section>
  );
}
