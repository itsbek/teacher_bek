"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { StudentPost } from "@/lib/community";
import { getVisitorId } from "@/lib/visitor-id";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  entries: StudentPost[];
}

type Status = "idle" | "sending" | "success" | "error" | "invalid-link";

const DRIVE_RE = /drive\.google\.com|docs\.google\.com/i;

function isValidDriveLink(url: string): boolean {
  try {
    return DRIVE_RE.test(new URL(url).hostname);
  } catch {
    return false;
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

// ── Published card ─────────────────────────────────────────────────────────────

function WritingCard({ entry, index }: { entry: StudentPost; index: number }) {
  const t = useTranslations("community");
  const isFirst = index % 3 === 0;

  return (
    <article
      className="writing-reveal"
      style={{
        borderLeft: isFirst ? "none" : "1px solid hsl(var(--background) / 0.1)",
        borderTop: "1px solid hsl(var(--background) / 0.1)",
        padding: "clamp(1.75rem, 3vw, 2.75rem)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "1.1rem",
      }}
    >
      {/* Left accent bar */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 3, height: "100%", background: "#C85C3F", opacity: 0.55 }} />

      {/* Level badge */}
      <span style={{
        fontFamily: "var(--font-display)",
        fontSize: 9,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        opacity: 0.4,
        border: "1px solid hsl(var(--background) / 0.22)",
        padding: "2px 8px",
        alignSelf: "flex-start",
        lineHeight: 1.8,
      }}>
        {entry.level}
      </span>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-display)",
        fontWeight: 800,
        fontSize: "clamp(20px, 2.2vw, 30px)",
        letterSpacing: "-0.02em",
        lineHeight: 1.05,
        textTransform: "uppercase",
        margin: 0,
      }}>
        {entry.title}
      </h3>

      {/* Teacher feedback */}
      {entry.feedback && (
        <div style={{
          borderLeft: "2px solid #C85C3F",
          paddingLeft: "0.875rem",
          opacity: 0.72,
        }}>
          <p style={{
            fontFamily: "var(--font-display)",
            fontSize: 9,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.55,
            marginBottom: "0.35rem",
          }}>
            {t("writingFeedbackLabel")}
          </p>
          <p style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(12px, 1.1vw, 14px)",
            lineHeight: 1.7,
            margin: 0,
          }}>
            {entry.feedback}
          </p>
        </div>
      )}

      {/* Footer: view button + date */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: "1rem" }}>
        {entry.driveLink && (
          <a
            href={entry.driveLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(10px, 0.9vw, 12px)",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              textDecoration: "none",
              background: "hsl(var(--background) / 0.1)",
              color: "hsl(var(--background))",
              padding: "6px 16px",
              transition: "background 0.2s",
              border: "1px solid hsl(var(--background) / 0.18)",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "hsl(var(--background) / 0.2)")}
            onMouseLeave={e => (e.currentTarget.style.background = "hsl(var(--background) / 0.1)")}
          >
            {t("writingViewWork")} →
          </a>
        )}
        <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.22, marginLeft: "auto" }}>
          {formatDate(entry.date)}
        </span>
      </div>
    </article>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export function WritingWall({ entries }: Props) {
  const t = useTranslations("community");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [title, setTitle] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".writing-reveal",
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.85, stagger: 0.08, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !driveLink.trim()) return;

    if (!isValidDriveLink(driveLink.trim())) {
      setStatus("invalid-link");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "writing",
          name: name.trim(),
          level: level.trim(),
          title: title.trim(),
          driveLink: driveLink.trim(),
          website: "",
          formStartedAt: startedAt,
          visitorId: getVisitorId(),
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        setName(""); setLevel(""); setTitle(""); setDriveLink("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      style={{
        background: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
        padding: "clamp(4rem, 8vw, 9rem) clamp(1.25rem, 4vw, 2rem)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div className="writing-reveal" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4, marginBottom: "1.25rem" }}>
            — {t("writingEyebrow")}
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase" }}>
            {t("writingHeading")}<br />
            <em style={{ fontStyle: "italic", opacity: 0.55 }}>{t("writingHeadingItalic")}</em>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.3vw, 16px)", opacity: 0.42, marginTop: "1.25rem", maxWidth: 480, lineHeight: 1.65 }}>
            {t("writingSubtitle")}
          </p>
        </div>

        {/* Published entries grid */}
        {entries.length === 0 ? (
          <div
            className="writing-reveal"
            style={{ borderTop: "1px solid hsl(var(--background) / 0.1)", borderBottom: "1px solid hsl(var(--background) / 0.1)", padding: "clamp(3rem, 5vw, 4rem) 0" }}
          >
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em", textTransform: "uppercase", opacity: 0.14, marginBottom: "0.75rem" }}>
              {t("writingEmptyHeading")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.2vw, 15px)", opacity: 0.32 }}>
              {t("writingEmptyText")}
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }} className="writing-card-grid">
            {entries.map((entry, i) => (
              <WritingCard key={entry.slug} entry={entry} index={i} />
            ))}
          </div>
        )}

        {/* Submission form */}
        <div
          className="writing-reveal"
          style={{ marginTop: "clamp(3rem, 6vw, 5rem)", borderTop: "1px solid hsl(var(--background) / 0.1)", paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2.8vw, 34px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {t("writingFormHeading")}
          </p>

          {status === "success" ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 18px)", opacity: 0.65, marginTop: "1rem" }}>
              {t("writingSuccessMsg")}
            </p>
          ) : (
            <>
              {/* How-to steps */}
              <ol style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", opacity: 0.45, lineHeight: 1.85, paddingLeft: "1.25em", margin: "0 0 2rem", maxWidth: 560 }}>
                {[t("writingStep1"), t("writingStep2"), t("writingStep3"), t("writingStep4")].map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>

              <form onSubmit={handleSubmit} style={{ maxWidth: 680, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {/* Name + level row */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }} className="form-two-col">
                  <div>
                    <div className="field-line writing-field">
                      <input
                        type="text"
                        placeholder={t("writingNamePlaceholder")}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                        maxLength={60}
                      />
                    </div>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.28, marginTop: "0.4rem" }}>
                      {t("writingNamePrivate")}
                    </p>
                  </div>
                  <div className="field-line writing-field">
                    <input
                      type="text"
                      placeholder={t("writingLevelPlaceholder")}
                      value={level}
                      onChange={e => setLevel(e.target.value)}
                      maxLength={60}
                    />
                  </div>
                </div>

                {/* Title */}
                <div className="field-line writing-field">
                  <input
                    type="text"
                    placeholder={t("writingTitlePlaceholder")}
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={120}
                  />
                </div>

                {/* Drive link */}
                <div>
                  <div className="field-line writing-field">
                    <input
                      type="url"
                      placeholder={t("writingDriveLinkPlaceholder")}
                      value={driveLink}
                      onChange={e => { setDriveLink(e.target.value); if (status === "invalid-link") setStatus("idle"); }}
                      required
                      maxLength={500}
                    />
                  </div>
                  {status === "invalid-link" && (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#E88C73", marginTop: "0.4rem" }}>
                      {t("writingDriveLinkError")}
                    </p>
                  )}
                </div>

                {/* Honeypot */}
                <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} readOnly />

                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#E88C73" }}>{t("submitError")}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  style={{
                    alignSelf: "flex-start",
                    background: "hsl(var(--background))",
                    color: "hsl(var(--foreground))",
                    border: "none",
                    padding: "clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 40px)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(11px, 1vw, 13px)",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: status === "sending" ? "not-allowed" : "pointer",
                    opacity: status === "sending" ? 0.45 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {status === "sending" ? t("submitting") : t("submitButton")}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .writing-card-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 580px) { .writing-card-grid { grid-template-columns: 1fr !important; } .form-two-col { grid-template-columns: 1fr !important; } }
        .writing-field input { color: hsl(var(--background)); }
        .writing-field { border-bottom-color: hsl(var(--background) / 0.2) !important; }
        .writing-field:focus-within { border-bottom-color: hsl(var(--background) / 0.65) !important; }
        .writing-field input::placeholder { color: hsl(var(--background)); opacity: 0.25; }
      `}</style>
    </section>
  );
}
