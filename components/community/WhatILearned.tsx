"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getVisitorId } from "@/lib/visitor-id";

interface LearnedEntry {
  id: string;
  name: string;
  learned: string;
  date: string;
}

interface Props {
  entries: LearnedEntry[];
}

type Status = "idle" | "sending" | "success" | "error";

export function WhatILearned({ entries }: Props) {
  const t = useTranslations("community");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [learned, setLearned] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".learned-reveal",
        { x: -18, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.75, stagger: 0.07, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !learned.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "learned", name: name.trim(), learned: learned.trim(), website: "", formStartedAt: startedAt, visitorId: getVisitorId() }),
      });
      const json = await res.json();
      if (json.success) { setStatus("success"); setName(""); setLearned(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        padding: "clamp(4rem, 8vw, 9rem) clamp(1.25rem, 4vw, 2rem)",
        borderTop: "1px solid hsl(var(--foreground) / 0.08)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        <div
          style={{ display: "grid", gridTemplateColumns: "clamp(220px, 38%, 480px) 1fr", gap: "clamp(2rem, 5vw, 5rem)", alignItems: "end", marginBottom: "clamp(3rem, 6vw, 5rem)" }}
          className="learned-header-grid"
        >
          <div className="learned-reveal">
            <p style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.45, marginBottom: "1rem" }}>
              — {t("learnedEyebrow")}
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase" }}>
              {t("learnedHeading")}
            </h2>
          </div>
          <p className="learned-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.6, opacity: 0.5, maxWidth: 380 }}>
            {t("learnedSubtitle")}
          </p>
        </div>

        {/* Empty state OR feed */}
        {entries.length === 0 ? (
          <div
            className="learned-reveal"
            style={{ borderTop: "1px solid hsl(var(--foreground) / 0.08)", borderBottom: "1px solid hsl(var(--foreground) / 0.08)", padding: "clamp(3rem, 5vw, 4rem) 0" }}
          >
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em", textTransform: "uppercase", opacity: 0.12, marginBottom: "0.75rem" }}>
              {t("learnedEmptyHeading")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.2vw, 15px)", opacity: 0.38 }}>
              {t("learnedEmptyText")}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {entries.map((entry, i) => (
              <div
                key={entry.id}
                className="learned-reveal"
                style={{
                  display: "grid",
                  gridTemplateColumns: "clamp(36px, 4vw, 56px) 1fr clamp(48px, 7vw, 80px)",
                  gap: "clamp(1rem, 2vw, 2rem)",
                  alignItems: "start",
                  padding: "clamp(1.25rem, 2.5vw, 2rem) 0",
                  borderBottom: "1px solid hsl(var(--foreground) / 0.07)",
                }}
              >
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(26px, 3.5vw, 44px)", letterSpacing: "-0.03em", lineHeight: 1, opacity: 0.1, paddingTop: "0.1rem" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.4vw, 17px)", lineHeight: 1.65, marginBottom: "0.5rem" }}>
                    {entry.learned}
                  </p>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.35 }}>
                    — {entry.name}
                  </span>
                </div>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.28, textAlign: "right", paddingTop: "0.3rem" }}>
                  {formatDate(entry.date)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Form */}
        <div className="learned-reveal" style={{ marginTop: "clamp(2.5rem, 5vw, 4rem)", borderTop: "1px solid hsl(var(--foreground) / 0.08)", paddingTop: "clamp(2rem, 4vw, 3.5rem)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px, 2.5vw, 28px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {t("learnedFormHeading")}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", opacity: 0.38, marginBottom: "2rem" }}>
            {t("reviewNote")}
          </p>
          {status === "success" ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 18px)", opacity: 0.65 }}>{t("submitSuccess")}</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div className="field-line">
                <input type="text" placeholder={t("learnedNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required maxLength={60} />
              </div>
              <div className="field-line">
                <textarea placeholder={t("learnedPlaceholder")} value={learned} onChange={e => setLearned(e.target.value)} required maxLength={500} rows={3} style={{ resize: "none" }} />
              </div>
              <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} readOnly />
              {status === "error" && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#C85C3F" }}>{t("submitError")}</p>
              )}
              <button type="submit" disabled={status === "sending"} style={{ alignSelf: "flex-start", background: "hsl(var(--foreground))", color: "hsl(var(--background))", border: "none", padding: "clamp(10px, 1.2vw, 14px) clamp(20px, 2.5vw, 36px)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.18em", textTransform: "uppercase", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {status === "sending" ? t("submitting") : t("submitButton")}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) { .learned-header-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </section>
  );
}
