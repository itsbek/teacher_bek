"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getVisitorId } from "@/lib/visitor-id";

gsap.registerPlugin(ScrollTrigger);

interface TeachEntry {
  id: string;
  name: string;
  topic: string;
  explanation: string;
  date: string;
  featured: boolean;
}

interface Props {
  featured: TeachEntry | null;
}

type Status = "idle" | "sending" | "success" | "error";

export function TeachSomeone({ featured }: Props) {
  const t = useTranslations("community");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [topic, setTopic] = useState("");
  const [explanation, setExplanation] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt] = useState(() => Date.now());

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".teach-reveal",
        { y: 28, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !explanation.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "teach", name: name.trim(), topic: topic.trim(), explanation: explanation.trim(), website: "", formStartedAt: startedAt, visitorId: getVisitorId() }),
      });
      const json = await res.json();
      if (json.success) { setStatus("success"); setName(""); setTopic(""); setExplanation(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
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

        <div className="teach-reveal" style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.38, marginBottom: "1rem" }}>
            — {t("teachEyebrow")}
          </p>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(48px, 7vw, 96px)", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase" }}>
            {t("teachHeading")}<br />
            <em style={{ fontStyle: "italic", opacity: 0.5 }}>{t("teachHeadingItalic")}</em>
          </h2>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.4vw, 17px)", opacity: 0.45, marginTop: "1.25rem", maxWidth: 500, lineHeight: 1.6 }}>
            {t("teachSubtitle")}
          </p>
        </div>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr clamp(280px, 38%, 500px)", gap: "clamp(3rem, 6vw, 6rem)", alignItems: "start" }}
          className="teach-main-grid"
        >
          {/* LEFT — featured explanation or empty state */}
          <div className="teach-reveal">
            {featured ? (
              <>
                <p style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.38, marginBottom: "1.5rem" }}>
                  ★ {t("teachFeaturedLabel")}
                </p>
                <div style={{ display: "inline-block", background: "#C85C3F", color: "#fff", padding: "3px 14px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
                  {featured.topic}
                </div>
                <blockquote style={{ margin: 0, borderLeft: "3px solid hsl(var(--background) / 0.22)", paddingLeft: "clamp(1.25rem, 2.5vw, 2rem)" }}>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.7vw, 21px)", lineHeight: 1.7, opacity: 0.85, marginBottom: "1.25rem" }}>
                    {featured.explanation}
                  </p>
                  <footer style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(13px, 1.2vw, 15px)", letterSpacing: "0.1em", textTransform: "uppercase", opacity: 0.4 }}>
                    — {featured.name}
                  </footer>
                </blockquote>
              </>
            ) : (
              <div style={{ borderTop: "1px solid hsl(var(--background) / 0.1)", borderBottom: "1px solid hsl(var(--background) / 0.1)", padding: "clamp(3rem, 5vw, 4rem) 0" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(28px, 4vw, 52px)", letterSpacing: "-0.03em", textTransform: "uppercase", opacity: 0.14, marginBottom: "0.75rem" }}>
                  {t("teachEmptyHeading")}
                </p>
                <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.2vw, 15px)", opacity: 0.32 }}>
                  {t("teachEmptyText")}
                </p>
              </div>
            )}
          </div>

          {/* RIGHT — form */}
          <div className="teach-reveal">
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(18px, 2.2vw, 26px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
              {t("teachFormHeading")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", opacity: 0.32, marginBottom: "2rem" }}>
              {t("reviewNote")}
            </p>
            {status === "success" ? (
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 18px)", opacity: 0.65 }}>{t("submitSuccess")}</p>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div className="field-line teach-field">
                  <input type="text" placeholder={t("teachNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required maxLength={60} />
                </div>
                <div className="field-line teach-field">
                  <input type="text" placeholder={t("teachTopicPlaceholder")} value={topic} onChange={e => setTopic(e.target.value)} maxLength={200} />
                </div>
                <div className="field-line teach-field">
                  <textarea placeholder={t("teachExplanationPlaceholder")} value={explanation} onChange={e => setExplanation(e.target.value)} required maxLength={2000} rows={6} style={{ resize: "none" }} />
                </div>
                <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} readOnly />
                {status === "error" && (
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#E88C73" }}>{t("submitError")}</p>
                )}
                <button type="submit" disabled={status === "sending"} style={{ alignSelf: "flex-start", background: "hsl(var(--background))", color: "hsl(var(--foreground))", border: "none", padding: "clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 40px)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.18em", textTransform: "uppercase", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity 0.2s" }}>
                  {status === "sending" ? t("submitting") : t("submitButton")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) { .teach-main-grid { grid-template-columns: 1fr !important; } }
        .teach-field input, .teach-field textarea { color: hsl(var(--background)); }
        .teach-field { border-bottom-color: hsl(var(--background) / 0.2) !important; }
        .teach-field:focus-within { border-bottom-color: hsl(var(--background) / 0.7) !important; }
        .teach-field input::placeholder, .teach-field textarea::placeholder { color: hsl(var(--background)); opacity: 0.25; }
      `}</style>
    </section>
  );
}
