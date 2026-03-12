"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { getVisitorId } from "@/lib/visitor-id";
import type { StudentPost } from "@/lib/community";

// ── Types ──────────────────────────────────────────────────────────────────────

type Tab      = "wall" | "teach";
type WallType = "writing" | "learned" | "video";
type Status   = "idle" | "sending" | "success" | "error";

interface LearnedEntry {
  id: string; name: string; learned: string; date: string;
}
interface VideoEntry {
  id: string; name: string; url: string; caption: string; date: string; featured?: boolean;
}
interface TeachEntry {
  id: string; name: string; topic: string; explanation: string; date: string; featured: boolean;
}

interface WallEntry {
  id: string;
  name: string;
  type: WallType;
  // writing
  title?: string;
  level?: string;
  content?: string;
  driveLink?: string;
  feedback?: string;
  // video
  url?: string;
  caption?: string;
  date: string;
}

export interface CommunityHubProps {
  writingEntries: StudentPost[];
  learnedEntries: LearnedEntry[];
  videoEntries:   VideoEntry[];
  featuredTeach:  TeachEntry | null;
}

const INITIAL_SHOW = 6;
const LOAD_STEP    = 6;

// ── Helpers ────────────────────────────────────────────────────────────────────

function parseVideoUrl(url: string): { platform: "youtube" | "drive" | null; ytId?: string } {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return { platform: "youtube", ytId: yt[1] };
  if (/drive\.google\.com|docs\.google\.com/.test(url)) return { platform: "drive" };
  return { platform: null };
}

function isValidVideoUrl(url: string): boolean {
  return parseVideoUrl(url).platform !== null;
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Shared submit ──────────────────────────────────────────────────────────────

async function submitCommunity(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/community/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, visitorId: getVisitorId() }),
    });
    return !!(await res.json()).success;
  } catch { return false; }
}

// ── Shared UI ──────────────────────────────────────────────────────────────────

function SubmitBtn({ status, label, sendingLabel }: { status: Status; label: string; sendingLabel: string }) {
  const busy = status === "sending";
  return (
    <button type="submit" disabled={busy} style={{
      alignSelf: "flex-start",
      background: "hsl(var(--foreground))",
      color: "hsl(var(--background))",
      border: "none",
      padding: "clamp(11px, 1.3vw, 15px) clamp(22px, 2.8vw, 36px)",
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      fontSize: "clamp(11px, 1vw, 12px)",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      cursor: busy ? "not-allowed" : "pointer",
      opacity: busy ? 0.55 : 1,
      transition: "opacity 0.2s",
    }}>
      {busy ? sendingLabel : label}
    </button>
  );
}

function EmptyState({ heading, text }: { heading: string; text: string }) {
  return (
    <div style={{ padding: "clamp(2rem, 4vw, 3.5rem) 0", gridColumn: "1 / -1" }}>
      <p className="op-ghost" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px, 3.5vw, 44px)", letterSpacing: "-0.03em", textTransform: "uppercase", marginBottom: "0.6rem" }}>
        {heading}
      </p>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.2vw, 15px)", opacity: 0.4 }}>
        {text}
      </p>
    </div>
  );
}

// ── Wall Card ──────────────────────────────────────────────────────────────────

function WallCard({ entry, t }: { entry: WallEntry; t: ReturnType<typeof useTranslations> }) {
  const parsed      = entry.url ? parseVideoUrl(entry.url) : null;
  const ytThumbnail = parsed?.platform === "youtube" && parsed.ytId
    ? `https://img.youtube.com/vi/${parsed.ytId}/hqdefault.jpg`
    : null;

  if (entry.type === "video") {
    return (
      <article style={{
        border: "1px solid hsl(var(--foreground) / 0.09)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}>
        {/* Thumbnail / Drive placeholder */}
        {ytThumbnail ? (
          <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative", paddingBottom: "56.25%", overflow: "hidden", background: "#000", flexShrink: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ytThumbnail} alt="" loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.88 }} />
            <span style={{
              position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
              background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)",
            }}>
              <span style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M5 3.5L13 8L5 12.5V3.5Z" fill="#0f0f0f" />
                </svg>
              </span>
            </span>
          </a>
        ) : (
          <a href={entry.url} target="_blank" rel="noopener noreferrer" style={{ display: "flex", height: 140, alignItems: "center", justifyContent: "center", background: "hsl(var(--foreground) / 0.05)", flexShrink: 0, textDecoration: "none", gap: "0.6rem" }}>
            <svg width="20" height="20" viewBox="0 0 87.3 78" fill="none" aria-hidden="true">
              <path d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3L38 52H6.6c0 5.2 1.3 10 3.85 14.85l-3.85 6.65c-2.3-4.2-3.85-8.8-3.85-13.5V51.5C2.75 40.75 10.2 32 19.7 28.8L6.6 51.5z" fill="#0066DA" />
              <path d="M43.65 25L29.7 0C28.35.8 27.2 1.9 26.4 3.3l-19.8 34.2A25.16 25.16 0 0 0 2.75 51.5H43.65L43.65 25z" fill="#00AC47" />
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c1.55-2.7 2.45-5.75 2.45-9v-1.5a26.38 26.38 0 0 0-3.85-13.5L65.4 51.5H84.6z" fill="#EA4335" />
              <path d="M43.65 25v26.5H84.6a25.87 25.87 0 0 0-3.85-13.5L57.6 0c-1.35-.8-2.9-1.25-4.6-1.25A12.42 12.42 0 0 0 43.65 25z" fill="#00832D" />
              <path d="M43.65 51.5H6.6a26.38 26.38 0 0 0 3.85 13.5l19.8 11.45c1.35.8 2.9 1.25 4.6 1.25A12.42 12.42 0 0 0 43.65 51.5z" fill="#2684FC" />
              <path d="M43.65 78c-6.9 0-12.45-5.55-12.45-12.45V63c0-6.9 5.55-12.45 12.45-12.45s12.45 5.55 12.45 12.45v2.55C56.1 72.45 50.55 78 43.65 78z" fill="#FFBA00" />
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.45 }}>
              {t("videoOpenDrive")}
            </span>
          </a>
        )}

        {/* Card body */}
        <div style={{ padding: "clamp(1rem, 1.8vw, 1.4rem)", display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {entry.name}
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.3, marginLeft: "auto", flexShrink: 0 }}>
              {t("wallTypeVideo")}
            </span>
          </div>
          {entry.caption && (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", lineHeight: 1.65, opacity: 0.65, flex: 1, marginBottom: "0.85rem" }}>
              {entry.caption}
            </p>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            <span className="op-faint" style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
              {fmt(entry.date)}
            </span>
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(9px, 0.8vw, 10px)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "inherit",
                opacity: 0.55,
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
            >
              {parsed?.platform === "youtube" ? "▶ Watch" : "↗ Open"} →
            </a>
          </div>
        </div>
      </article>
    );
  }

  // Text card (writing | learned)
  const accent = entry.type === "writing" ? "#C85C3F" : "hsl(var(--foreground) / 0.28)";

  if (entry.type === "writing") {
    return (
      <article style={{
        borderLeft: `2px solid ${accent}`,
        paddingLeft: "clamp(0.85rem, 1.5vw, 1.25rem)",
        paddingTop: "clamp(1rem, 1.8vw, 1.4rem)",
        paddingBottom: "clamp(1rem, 1.8vw, 1.4rem)",
        paddingRight: "clamp(0.75rem, 1.2vw, 1rem)",
        borderBottom: "1px solid hsl(var(--foreground) / 0.07)",
        display: "flex",
        flexDirection: "column",
        gap: "0.65rem",
      }}>
        {/* Level + type badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          {entry.level && (
            <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.38, border: "1px solid hsl(var(--foreground) / 0.18)", padding: "1px 6px" }}>
              {entry.level}
            </span>
          )}
          <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.26, marginLeft: "auto" }}>
            {t("wallTypeWriting")}
          </span>
        </div>
        {/* Title */}
        {entry.title && (
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(15px, 1.5vw, 20px)", letterSpacing: "-0.02em", lineHeight: 1.1, textTransform: "uppercase", margin: 0 }}>
            {entry.title}
          </h3>
        )}
        {/* Teacher feedback */}
        {entry.feedback && (
          <div style={{ borderLeft: "2px solid hsl(var(--foreground) / 0.15)", paddingLeft: "0.75rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.38, marginBottom: "0.25rem" }}>
              {t("writingFeedbackLabel")}
            </p>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(11px, 1vw, 13px)", lineHeight: 1.7, opacity: 0.62, margin: 0 }}>
              {entry.feedback}
            </p>
          </div>
        )}
        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", gap: "0.5rem" }}>
          <span className="op-faint" style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {fmt(entry.date)}
          </span>
          {entry.driveLink && (
            <a
              href={entry.driveLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(9px, 0.8vw, 10px)", letterSpacing: "0.18em", textTransform: "uppercase", color: "inherit", opacity: 0.55, textDecoration: "none", transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.55")}
            >
              {t("writingViewWork")} →
            </a>
          )}
        </div>
      </article>
    );
  }

  // Learned card — shows name + typed content
  return (
    <article style={{
      borderLeft: `2px solid ${accent}`,
      paddingLeft: "clamp(0.85rem, 1.5vw, 1.25rem)",
      paddingTop: "clamp(1rem, 1.8vw, 1.4rem)",
      paddingBottom: "clamp(1rem, 1.8vw, 1.4rem)",
      paddingRight: "clamp(0.75rem, 1.2vw, 1rem)",
      borderBottom: "1px solid hsl(var(--foreground) / 0.07)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(11px, 1vw, 13px)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {entry.name}
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.26, marginLeft: "auto", flexShrink: 0 }}>
          {t("wallTypeReflection")}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(12px, 1.1vw, 14px)", lineHeight: 1.7, opacity: 0.62, flex: 1 }}>
        {entry.content}
      </p>
      <span className="op-faint" style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", display: "block", marginTop: "0.75rem" }}>
        {fmt(entry.date)}
      </span>
    </article>
  );
}

// ── Wall Panel ─────────────────────────────────────────────────────────────────

function WallPanel({ writingEntries, learnedEntries, videoEntries, t }: {
  writingEntries: StudentPost[];
  learnedEntries: LearnedEntry[];
  videoEntries:   VideoEntry[];
  t: ReturnType<typeof useTranslations>;
}) {
  const [wallType,    setWallType]   = useState<WallType>("writing");
  const [name,        setName]       = useState("");
  const [level,       setLevel]      = useState("");
  const [title,       setTitle]      = useState("");
  const [driveLink,   setDriveLink]  = useState("");
  const [driveLinkErr,setDriveLinkErr] = useState(false);
  const [content,     setContent]    = useState("");
  const [videoUrl,    setVideoUrl]   = useState("");
  const [caption,     setCaption]    = useState("");
  const [wordCount,   setWordCount]  = useState(0);
  const [urlError,    setUrlError]   = useState(false);
  const [status,      setStatus]     = useState<Status>("idle");
  const [startedAt]                  = useState(() => Date.now());
  const [honeypot,    setHoneypot]   = useState("");
  const [visible,     setVisible]    = useState(INITIAL_SHOW);

  const MAX_WORDS = 200;
  const overLimit = wallType === "learned" && wordCount > MAX_WORDS;

  const DRIVE_RE = /drive\.google\.com|docs\.google\.com/i;
  const isValidDriveLink = (url: string) => { try { return DRIVE_RE.test(new URL(url).hostname); } catch { return false; } };

  const handleContent = (val: string) => {
    setContent(val);
    setWordCount(val.trim() ? val.trim().split(/\s+/).length : 0);
  };

  const switchType = (t: WallType) => {
    setWallType(t);
    setContent(""); setWordCount(0); setVideoUrl(""); setCaption(""); setUrlError(false);
    setDriveLink(""); setDriveLinkErr(false); setHoneypot("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;

    if (wallType === "video") {
      if (!videoUrl.trim() || !isValidVideoUrl(videoUrl.trim())) { setUrlError(true); return; }
      if (!caption.trim()) return;
      setStatus("sending");
      const ok = await submitCommunity({ type: "video", name: name.trim(), url: videoUrl.trim(), caption: caption.trim(), website: honeypot, formStartedAt: startedAt });
      if (ok) { setStatus("success"); setName(""); setVideoUrl(""); setCaption(""); }
      else setStatus("error");
      return;
    }

    if (wallType === "writing") {
      if (!name.trim() || !driveLink.trim()) return;
      if (!isValidDriveLink(driveLink.trim())) { setDriveLinkErr(true); return; }
      setStatus("sending");
      const ok = await submitCommunity({ type: "writing", name: name.trim(), level: level.trim(), title: title.trim(), driveLink: driveLink.trim(), website: honeypot, formStartedAt: startedAt });
      if (ok) { setStatus("success"); setName(""); setLevel(""); setTitle(""); setDriveLink(""); }
      else setStatus("error");
      return;
    }

    // learned
    if (!name.trim() || !content.trim() || overLimit) return;
    setStatus("sending");
    const ok = await submitCommunity({ type: "learned", name: name.trim(), learned: content.trim(), website: honeypot, formStartedAt: startedAt });
    if (ok) { setStatus("success"); setName(""); setContent(""); setWordCount(0); }
    else setStatus("error");
  };

  // Merge all entry types, newest first
  const allEntries: WallEntry[] = [
    ...writingEntries.map(e => ({
      id: e.slug, name: e.name, type: "writing" as WallType,
      title: e.title, level: e.level, date: e.date,
      driveLink: e.driveLink, feedback: e.feedback,
    })),
    ...learnedEntries.map(e => ({
      id: e.id, name: e.name, type: "learned" as WallType,
      content: e.learned, date: e.date,
    })),
    ...videoEntries.map(e => ({
      id: e.id, name: e.name, type: "video" as WallType,
      url: e.url, caption: e.caption, date: e.date,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const visibleEntries = allEntries.slice(0, visible);
  const remaining      = allEntries.length - visible;
  const hasMore        = remaining > 0;

  return (
    <div className="hub-panel">
      {/* ── Left: the wall grid ──────────────────────────── */}
      <div className="hub-content">
        {allEntries.length === 0 ? (
          <div className="wall-grid">
            <EmptyState heading={t("wallEmptyHeading")} text={t("wallEmptyText")} />
          </div>
        ) : (
          <>
            <div className="wall-grid">
              {visibleEntries.map(entry => (
                <WallCard key={entry.id} entry={entry} t={t} />
              ))}
            </div>

            {hasMore && (
              <div style={{ marginTop: "clamp(1.5rem, 3vw, 2.5rem)", display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <button
                  onClick={() => setVisible(v => v + LOAD_STEP)}
                  style={{
                    background: "none",
                    border: "1px solid hsl(var(--foreground) / 0.2)",
                    padding: "0.65rem clamp(1.25rem, 2.5vw, 2rem)",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "clamp(10px, 0.9vw, 11px)",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "hsl(var(--foreground))",
                    cursor: "pointer",
                    opacity: 0.7,
                    transition: "opacity 0.2s, border-color 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderColor = "hsl(var(--foreground) / 0.6)"; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = "0.7"; e.currentTarget.style.borderColor = "hsl(var(--foreground) / 0.2)"; }}
                >
                  {t("wallLoadMore")} ({remaining})
                </button>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.28 }}>
                  {t("wallShowing", { visible: visible, total: allEntries.length })}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Right: submission form (sticky) ──────────────── */}
      <div className="hub-form">
        <p className="form-heading">{t("wallFormHeading")}</p>

        {/* Type toggle */}
        <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.1rem" }}>
          {(["writing", "learned", "video"] as WallType[]).map(type => (
            <button
              key={type}
              type="button"
              onClick={() => switchType(type)}
              style={{
                flex: 1,
                padding: "0.5rem 0.25rem",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(9px, 0.8vw, 10px)",
                letterSpacing: "0.13em",
                textTransform: "uppercase",
                fontWeight: wallType === type ? 700 : 400,
                background: wallType === type ? "hsl(var(--foreground))" : "none",
                color: wallType === type ? "hsl(var(--background))" : "hsl(var(--foreground))",
                border: "1px solid hsl(var(--foreground) / 0.22)",
                cursor: "pointer",
                transition: "background 0.18s, color 0.18s",
              }}
            >
              {type === "writing" ? t("wallTypeWriting") : type === "learned" ? t("wallTypeReflection") : t("wallTypeVideo")}
            </button>
          ))}
        </div>

        <p className="review-note">{t("reviewNote")}</p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {status === "success" ? (
            <>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.3vw, 16px)", lineHeight: 1.65, color: "#3a7a3a", marginBottom: "0.85rem" }}>
                {wallType === "video" ? t("videoSuccessMsg") : t("wallSuccessMsg")}
              </p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, opacity: 0.38, lineHeight: 1.6 }}>
                {t("wallShareNudge")}
              </p>
            </>
          ) : status === "error" ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#C85C3F" }}>{t("submitError")}</p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", minHeight: "340px" }}>

              {/* Row 1: name — always */}
              <div>
                <div className="field-line">
                  <input type="text" placeholder={t("writingNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required maxLength={60} />
                </div>
                {wallType === "writing" && (
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.28, marginTop: "0.3rem" }}>
                    {t("writingNamePrivate")}
                  </p>
                )}
              </div>

              {/* Row 2: always rendered to prevent height jump */}
              <div style={{ visibility: wallType === "learned" ? "hidden" : "visible", pointerEvents: wallType === "learned" ? "none" : "auto" }}>
                {wallType === "writing" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }} className="form-name-level">
                    <div className="field-line">
                      <input type="text" placeholder={t("writingTitlePlaceholder")} value={title} onChange={e => setTitle(e.target.value)} maxLength={120} />
                    </div>
                    <div className="field-line">
                      <input type="text" placeholder={t("writingLevelPlaceholder")} value={level} onChange={e => setLevel(e.target.value)} maxLength={60} />
                    </div>
                  </div>
                )}
                {(wallType === "video" || wallType === "learned") && (
                  <div className="field-line" style={{ borderColor: urlError ? "#C85C3F" : undefined, visibility: wallType === "learned" ? "hidden" : "visible" }}>
                    <input type="url" placeholder={t("videoUrlPlaceholder")} value={videoUrl} onChange={e => { setVideoUrl(e.target.value); setUrlError(false); }} required={wallType === "video"} maxLength={500} />
                  </div>
                )}
              </div>

              {/* Row 3: Drive link (writing) or textarea (learned / video caption) */}
              {wallType === "writing" ? (
                <div>
                  <div className="field-line" style={{ borderColor: driveLinkErr ? "#C85C3F" : undefined }}>
                    <input
                      type="url"
                      placeholder={t("writingDriveLinkPlaceholder")}
                      value={driveLink}
                      onChange={e => { setDriveLink(e.target.value); setDriveLinkErr(false); }}
                      required
                      maxLength={500}
                    />
                  </div>
                  {driveLinkErr && (
                    <p style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#C85C3F", marginTop: "0.3rem" }}>
                      {t("writingDriveLinkError")}
                    </p>
                  )}
                  {!driveLinkErr && driveLink && isValidDriveLink(driveLink) && (
                    <p style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#3a7a3a", opacity: 0.8, marginTop: "0.3rem" }}>
                      ✓ Google Drive
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <div className="field-line">
                    <textarea
                      placeholder={wallType === "video" ? t("videoCaptionPlaceholder") : t("learnedPlaceholder")}
                      value={wallType === "video" ? caption : content}
                      onChange={e => wallType === "video" ? setCaption(e.target.value) : handleContent(e.target.value)}
                      required
                      maxLength={wallType === "video" ? 500 : 3000}
                      style={{ resize: "none", height: "120px" }}
                    />
                  </div>
                  <div style={{ height: "18px", display: "flex", alignItems: "center", marginTop: "0.25rem" }}>
                    {wallType === "learned" && (
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: overLimit ? "#C85C3F" : "inherit", opacity: overLimit ? 1 : 0.3, marginLeft: "auto", transition: "color 0.2s, opacity 0.2s" }}>
                        {wordCount} / {MAX_WORDS}
                      </span>
                    )}
                    {wallType === "video" && urlError && (
                      <span style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "#C85C3F" }}>{t("videoUrlError")}</span>
                    )}
                    {wallType === "video" && !urlError && videoUrl && isValidVideoUrl(videoUrl) && (
                      <span style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase", color: "#3a7a3a", opacity: 0.8 }}>
                        ✓ {parseVideoUrl(videoUrl).platform === "youtube" ? "YouTube" : "Google Drive"}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Honeypot — off-screen, invisible to humans, attractive to bots */}
              <div className="honey-trap" aria-hidden="true">
                <input type="text" name="phone" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
              </div>

              <SubmitBtn status={overLimit ? "sending" : status} label={t("submitButton")} sendingLabel={t("submitting")} />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Teach Panel ────────────────────────────────────────────────────────────────

function TeachPanel({ featured, t }: { featured: TeachEntry | null; t: ReturnType<typeof useTranslations> }) {
  const [name, setName]             = useState("");
  const [topic, setTopic]           = useState("");
  const [explanation, setExpl]      = useState("");
  const [status, setStatus]         = useState<Status>("idle");
  const [startedAt]                 = useState(() => Date.now());
  const [honeypot, setHoneypot]     = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !explanation.trim() || status === "sending") return;
    setStatus("sending");
    const ok = await submitCommunity({ type: "teach", name: name.trim(), topic: topic.trim(), explanation: explanation.trim(), website: honeypot, formStartedAt: startedAt });
    if (ok) { setStatus("success"); setName(""); setTopic(""); setExpl(""); }
    else setStatus("error");
  };

  return (
    <div className="hub-panel">
      <div className="hub-content">
        {featured ? (
          <>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#C85C3F", marginBottom: "1rem" }}>
              ★ {t("teachFeaturedLabel")}
            </p>
            <span style={{ display: "inline-block", background: "hsl(var(--foreground))", color: "hsl(var(--background))", padding: "2px 12px", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
              {featured.topic}
            </span>
            <blockquote style={{ margin: 0, borderLeft: "3px solid hsl(var(--foreground) / 0.15)", paddingLeft: "clamp(1rem, 2vw, 1.5rem)" }}>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.5vw, 18px)", lineHeight: 1.7, opacity: 0.85, marginBottom: "1rem" }}>
                {featured.explanation}
              </p>
              <footer style={{ fontFamily: "var(--font-display)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.4 }}>
                — {featured.name}
              </footer>
            </blockquote>
          </>
        ) : (
          <EmptyState heading={t("teachEmptyHeading")} text={t("teachEmptyText")} />
        )}
      </div>

      <div className="hub-form">
        <p className="form-heading">{t("teachFormHeading")}</p>
        <p className="review-note">{t("reviewNote")}</p>
        {status === "success" ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(14px, 1.3vw, 16px)", lineHeight: 1.65, color: "#3a7a3a" }}>{t("submitSuccess")}</p>
        ) : status === "error" ? (
          <p style={{ fontFamily: "var(--font-sans)", fontSize: 13, color: "#C85C3F" }}>{t("submitError")}</p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div className="field-line">
              <input type="text" placeholder={t("teachNamePlaceholder")} value={name} onChange={e => setName(e.target.value)} required maxLength={60} />
            </div>
            <div className="field-line">
              <input type="text" placeholder={t("teachTopicPlaceholder")} value={topic} onChange={e => setTopic(e.target.value)} maxLength={200} />
            </div>
            <div className="field-line">
              <textarea placeholder={t("teachExplanationPlaceholder")} value={explanation} onChange={e => setExpl(e.target.value)} required maxLength={2000} rows={6} style={{ resize: "none" }} />
            </div>
            <div className="honey-trap" aria-hidden="true">
              <input type="text" name="phone" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
            </div>
            <SubmitBtn status={status} label={t("submitButton")} sendingLabel={t("submitting")} />
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────

export function CommunityHub({ writingEntries, learnedEntries, videoEntries, featuredTeach }: CommunityHubProps) {
  const t           = useTranslations("community");
  const locale      = useLocale();
  const [activeTab, setActiveTab] = useState<Tab>("wall");

  const tabs: { key: Tab; label: string }[] = [
    { key: "wall",  label: t("tabWall") },
    { key: "teach", label: t("tabTeach") },
  ];

  return (
    <section
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        padding: "clamp(4rem, 8vw, 8rem) clamp(1.25rem, 4vw, 2rem)",
        borderTop: "1px solid hsl(var(--foreground) / 0.08)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* ── Tab bar ──────────────────────────────────── */}
        <div
          role="tablist"
          aria-label="Community sections"
          style={{ display: "flex", borderBottom: "1px solid hsl(var(--foreground) / 0.1)", marginBottom: "clamp(2.5rem, 5vw, 4.5rem)" }}
        >
          {tabs.map(({ key, label }) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={active}
                onClick={() => setActiveTab(key)}
                style={{
                  flexShrink: 0, background: "none", border: "none",
                  borderBottom: active ? "2px solid #C85C3F" : "2px solid transparent",
                  marginBottom: "-1px",
                  padding: "clamp(0.75rem, 1.5vw, 1.1rem) clamp(1rem, 2.5vw, 2rem)",
                  fontFamily: "var(--font-display)",
                  fontWeight: active ? 700 : 400,
                  fontSize: "clamp(11px, 1vw, 13px)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "hsl(var(--foreground))",
                  opacity: active ? 1 : 0.4,
                  cursor: "pointer",
                  transition: "opacity 0.2s, border-color 0.2s",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* ── Active panel ─────────────────────────────── */}
        <div role="tabpanel">
          {activeTab === "wall" && (
            <WallPanel
              writingEntries={writingEntries}
              learnedEntries={learnedEntries}
              videoEntries={videoEntries}
              t={t}
            />
          )}
          {activeTab === "teach" && <TeachPanel featured={featuredTeach} t={t} />}
        </div>

        {/* ── Bottom CTA — editorial strip ─────────────── */}
        <div
          style={{
            marginTop: "clamp(4rem, 8vw, 7rem)",
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            padding: "clamp(3rem, 6vw, 5rem) clamp(1.5rem, 4vw, 3rem)",
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: "clamp(2rem, 5vw, 4rem)",
            alignItems: "center",
          }}
          className="join-cta-grid"
        >
          <div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", opacity: 0.38, marginBottom: "clamp(0.75rem, 1.5vw, 1rem)" }}>
              — {t("joinCtaEyebrow")}
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(36px, 5.5vw, 72px)", letterSpacing: "-0.03em", lineHeight: 0.92, textTransform: "uppercase", margin: "0 0 clamp(1rem, 2vw, 1.5rem)" }}>
              {t("joinCtaHeading")}<br />
              <em style={{ fontStyle: "italic", opacity: 0.5 }}>{t("joinCtaHeadingItalic")}</em>
            </h2>
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "clamp(13px, 1.3vw, 16px)", opacity: 0.5, lineHeight: 1.65, maxWidth: 460, margin: 0 }}>
              {t("joinCta")}
            </p>
          </div>
          <Link
            href={`/${locale}#contact`}
            style={{
              display: "inline-block",
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
              padding: "clamp(14px, 1.8vw, 20px) clamp(28px, 3.5vw, 52px)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(11px, 1vw, 13px)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "opacity 0.25s",
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            {t("joinCtaLink")} →
          </Link>
        </div>
      </div>

      <style>{`
        /* ── Hub shell ─────────────────────────────────── */
        .hub-panel {
          display: grid;
          grid-template-columns: 1fr clamp(240px, 32%, 400px);
          gap: clamp(2.5rem, 6vw, 6rem);
          align-items: start;
        }
        .hub-content { min-width: 0; }
        .hub-form {
          position: sticky;
          top: calc(var(--nav-h, 4rem) + 1.5rem);
        }
        .form-heading {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: clamp(18px, 2vw, 24px);
          letter-spacing: -0.02em;
          text-transform: uppercase;
          margin: 0 0 0.4rem 0;
        }
        .review-note {
          font-family: var(--font-sans);
          font-size: clamp(11px, 1vw, 13px);
          opacity: 0.38;
          line-height: 1.55;
          margin: 0 0 1.5rem 0;
        }

        /* ── Wall card grid ────────────────────────────── */
        .wall-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: clamp(0.75rem, 1.5vw, 1.25rem);
          align-items: start;
        }

        /* ── Responsive ────────────────────────────────── */
        @media (max-width: 1100px) {
          .wall-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 820px) {
          .hub-panel { grid-template-columns: 1fr !important; }
          .hub-form {
            position: static;
            border-top: 1px solid hsl(var(--foreground) / 0.08);
            padding-top: clamp(1.5rem, 3vw, 2.5rem);
          }
          .wall-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 560px) {
          .wall-grid { grid-template-columns: 1fr !important; }
          .form-name-level { grid-template-columns: 1fr !important; }
        }
        /* ── Honeypot ───────────────────────────────── */
        .honey-trap {
          position: absolute;
          left: -9999px;
          top: -9999px;
          width: 1px;
          height: 1px;
          opacity: 0;
          overflow: hidden;
          pointer-events: none;
        }
        /* ── Join CTA ───────────────────────────────── */
        @media (max-width: 640px) {
          .join-cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
