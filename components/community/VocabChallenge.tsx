"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getVisitorId } from "@/lib/visitor-id";

gsap.registerPlugin(ScrollTrigger);

interface VocabHighlight {
  name: string;
  sentence: string;
}

interface VocabSubmission {
  name: string;
  sentence: string;
}

interface VocabData {
  word: string;
  phonetic: string;
  definition: string;
  partOfSpeech: string;
  example: string;
  weekNumber: number;
  year: number;
  highlight: VocabHighlight | null;
  submissions: VocabSubmission[];
}

interface Props {
  data: VocabData;
}

type Status = "idle" | "sending" | "success" | "error";

function EmptyVocab() {
  const t = useTranslations("community");
  return (
    <div
      style={{
        padding: "clamp(3rem, 6vw, 5rem) 0",
        borderTop: "1px solid hsl(var(--foreground) / 0.08)",
        borderBottom: "1px solid hsl(var(--foreground) / 0.08)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 64px)",
          letterSpacing: "-0.03em",
          lineHeight: 0.95,
          textTransform: "uppercase",
          opacity: 0.18,
          marginBottom: "1rem",
        }}
      >
        {t("vocabEmptyHeading")}
      </p>
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(14px, 1.3vw, 16px)",
          opacity: 0.4,
        }}
      >
        {t("vocabEmptyText")}
      </p>
    </div>
  );
}

export function VocabChallenge({ data }: Props) {
  const t = useTranslations("community");
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [name, setName] = useState("");
  const [sentence, setSentence] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [startedAt] = useState(() => Date.now());

  const hasWord = data.word.trim().length > 0;

  useEffect(() => {
    if (reduceMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".vocab-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [reduceMotion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !sentence.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/community/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vocab",
          name: name.trim(),
          sentence: sentence.trim(),
          website: "",
          formStartedAt: startedAt,
          visitorId: getVisitorId(),
        }),
      });
      const json = await res.json();
      if (json.success) { setStatus("success"); setName(""); setSentence(""); }
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

        <p
          className="vocab-reveal"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          — {t("vocabEyebrow")}{hasWord && data.weekNumber > 0 ? ` · Week ${data.weekNumber}, ${data.year}` : ""}
        </p>

        {!hasWord ? (
          <EmptyVocab />
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "clamp(300px, 58%, 800px) 1fr",
              gap: "clamp(2rem, 6vw, 6rem)",
              alignItems: "start",
            }}
            className="vocab-main-grid"
          >
            {/* LEFT — Word */}
            <div className="vocab-reveal">
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  fontSize: "clamp(72px, 12vw, 180px)",
                  letterSpacing: "-0.04em",
                  lineHeight: 0.88,
                  textTransform: "uppercase",
                  marginBottom: "1.5rem",
                }}
              >
                {data.word}
              </h2>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.4vw, 17px)", opacity: 0.45, fontStyle: "italic" }}>
                  {data.phonetic}
                </span>
                {data.partOfSpeech && (
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      opacity: 0.7,
                      background: "hsl(var(--foreground))",
                      color: "hsl(var(--background))",
                      padding: "3px 10px",
                    }}
                  >
                    {data.partOfSpeech}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "clamp(16px, 1.7vw, 21px)",
                  lineHeight: 1.55,
                  marginBottom: "1.5rem",
                  borderLeft: "3px solid #C85C3F",
                  paddingLeft: "1.25rem",
                }}
              >
                {data.definition}
              </p>
              {data.example && (
                <div style={{ opacity: 0.45 }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                    {t("vocabExampleLabel")}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.3vw, 16px)", fontStyle: "italic", lineHeight: 1.6 }}>
                    &ldquo;{data.example}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT — Submissions */}
            <div className="vocab-reveal" style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {data.highlight && (
                <div style={{ background: "hsl(var(--foreground))", color: "hsl(var(--background))", padding: "clamp(1.5rem, 3vw, 2.5rem)" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.5, marginBottom: "1rem" }}>
                    ★ {t("vocabBestLabel")}
                  </p>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 18px)", lineHeight: 1.65, marginBottom: "1rem" }}>
                    &ldquo;{data.highlight.sentence}&rdquo;
                  </p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.45 }}>
                    — {data.highlight.name}
                  </p>
                </div>
              )}

              {data.submissions.length > 0 && (
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.4, marginBottom: "1rem" }}>
                    {t("vocabStudentSentences")}
                  </p>
                  {data.submissions.map((s, i) => (
                    <div key={i} style={{ padding: "1rem 0", borderBottom: "1px solid hsl(var(--foreground) / 0.08)" }}>
                      <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.2vw, 15px)", lineHeight: 1.6, marginBottom: "0.3rem" }}>
                        &ldquo;{s.sentence}&rdquo;
                      </p>
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.35 }}>
                        — {s.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submission form — always visible */}
        <div
          className="vocab-reveal"
          style={{
            marginTop: "clamp(3rem, 6vw, 5rem)",
            borderTop: "1px solid hsl(var(--foreground) / 0.08)",
            paddingTop: "clamp(2.5rem, 5vw, 4rem)",
          }}
        >
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(20px, 2.8vw, 34px)", letterSpacing: "-0.02em", textTransform: "uppercase", marginBottom: "0.5rem" }}>
            {t("vocabFormHeading")}
          </p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", opacity: 0.4, marginBottom: "2rem" }}>
            {t("reviewNote")}
          </p>
          {status === "success" ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(15px, 1.5vw, 18px)", opacity: 0.65 }}>{t("submitSuccess")}</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="field-line">
                <input type="text" placeholder={t("vocabNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required maxLength={60} />
              </div>
              <div className="field-line">
                <textarea placeholder={t("vocabSentencePlaceholder")} value={sentence} onChange={e => setSentence(e.target.value)} required maxLength={500} rows={3} style={{ resize: "none" }} />
              </div>
              <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} readOnly />
              {status === "error" && (
                <p style={{ fontFamily: "var(--font-sans)", fontSize: 14, color: "#C85C3F" }}>{t("submitError")}</p>
              )}
              <button type="submit" disabled={status === "sending"} style={{ alignSelf: "flex-start", background: "hsl(var(--foreground))", color: "hsl(var(--background))", border: "none", padding: "clamp(12px, 1.5vw, 16px) clamp(24px, 3vw, 40px)", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.18em", textTransform: "uppercase", cursor: status === "sending" ? "not-allowed" : "pointer", opacity: status === "sending" ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {status === "sending" ? t("submitting") : t("submitButton")}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .vocab-main-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
