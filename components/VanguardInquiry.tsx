"use client";

import React, { useMemo, useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

const LocationMap = dynamic(
  () => import("./LocationMap"),
  { ssr: false, loading: () => <div className="w-full border border-foreground/15 bg-foreground/[0.03]" style={{ height: "300px" }} /> }
);

// Only initialise Leaflet + fetch map tiles when the map is near the viewport.
// This keeps ~100KB of tile requests off the critical path.
function LazyMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { rootMargin: "300px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={containerRef}>
      {inView
        ? <LocationMap />
        : <div className="w-full border border-foreground/15 bg-foreground/[0.03]" style={{ height: "300px" }} />
      }
    </div>
  );
}
import { useTranslations } from "next-intl";
import { SplitHeading } from "@/components/ui/split-heading";
import { CheckCircle2, AlertCircle, ArrowUpRight } from "lucide-react";
import { event as trackEvent, trackContactFormSubmit, trackCTAClick } from "@/lib/analytics";
import { gsap, ScrollTrigger } from "@/lib/gsap";

type FormState = {
  name: string;
  phone: string;
  email: string;
  message: string;
  consent: boolean;
  forWhom: string;
  level: string;
  goal: string;
};

const INITIAL: FormState = {
  name: "", phone: "", email: "", message: "", consent: false,
  forWhom: "", level: "", goal: "",
};

// ── Pill selector ─────────────────────────────────────────────────────────
function PillGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <p className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-60 font-light mb-4" aria-hidden="true">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            aria-pressed={value === opt}
            onClick={() => onChange(opt)}
            className={`font-sans text-[13px] uppercase tracking-[0.14em] font-light px-4 py-2 border transition-all duration-400 ${
              value === opt
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 text-foreground/50 hover:border-foreground/50 hover:text-foreground/80"
            }`}
            style={{ transitionTimingFunction: "var(--transition-main)" }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Line field ────────────────────────────────────────────────────────────
function LineField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
  optional,
  optionalLabel,
  rows,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  optional?: boolean;
  optionalLabel?: string;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);

  const inputClass = `
    w-full bg-transparent border-none outline-none
    font-sans font-light
    text-foreground placeholder:opacity-30
    py-3 resize-none
  `;

  const fontSize = "clamp(0.9rem, 1.3vw, 1rem)";

  return (
    <div
      className="field-line"
      style={{ borderBottomColor: focused ? "hsl(var(--foreground))" : undefined }}
    >
      <label
        htmlFor={id}
        className="block font-sans text-[12px] uppercase tracking-[0.2em] opacity-60 font-light mb-2"
      >
        {label}
        {optional && <span className="opacity-50 normal-case tracking-normal ml-1">({optionalLabel ?? "optional"})</span>}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClass}
          style={{ fontSize }}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={inputClass}
          style={{ fontSize }}
        />
      )}
    </div>
  );
}

export function VanguardInquiry() {
  const t = useTranslations("inquiry");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus]     = useState<"idle" | "success" | "error">("idle");
  const [statusMsg, setStatusMsg] = useState("");
  const [form, setForm]         = useState<FormState>(INITIAL);
  const [formStartedAt]         = useState(() => Date.now());
  const formTouched             = useRef(false);
  const formSubmitted           = useRef(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);
  const infoRef    = useRef<HTMLDivElement>(null);

  const canSubmit = useMemo(() =>
    form.name.trim().length >= 2 &&
    form.phone.trim().length >= 6 &&
    form.consent &&
    (form.email.trim() === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)),
    [form]
  );

  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Form start: fire once on first interaction
  const handleFormFirstTouch = () => {
    if (formTouched.current) return;
    formTouched.current = true;
    trackEvent({ action: "form_start", category: "conversion", label: "inquiry" });
  };

  // Abandonment: fire on page hide if form was touched but not submitted
  useEffect(() => {
    const onHide = () => {
      if (formTouched.current && !formSubmitted.current) {
        const filledFields = Object.entries(form)
          .filter(([k, v]) => k !== "consent" && String(v).trim().length > 0)
          .map(([k]) => k)
          .join(",");
        trackEvent({
          action: "form_abandon",
          category: "conversion",
          label: filledFields || "untouched",
        });
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setStatus("idle");
    setStatusMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          consent: form.consent,
          forWhom: form.forWhom,
          level: form.level,
          goal: form.goal,
          website: "",
          formStartedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send message.");

      formSubmitted.current = true;
      trackContactFormSubmit(`inquiry_${form.goal}`);
      setStatus("success");
      setStatusMsg(data?.message || "Message sent.");
      setForm(INITIAL);
    } catch (err) {
      setStatus("error");
      setStatusMsg(err instanceof Error ? err.message : "Failed to send.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // GSAP animations
  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current,
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 85%", once: true } }
      );

      gsap.fromTo(formRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: formRef.current, start: "top 82%", once: true } }
      );

      gsap.fromTo(infoRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: infoRef.current, start: "top 82%", once: true } }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-background text-foreground px-6 md:px-10 lg:px-16">

      {/* ── Section header ──────────────────────────────────────────── */}
      <div
        ref={headerRef}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 mb-14 border-b border-foreground/10"
      >
        <div>
          <div className="flex items-center gap-4 mb-5">
            <span className="w-8 h-[1px] bg-foreground/30 shrink-0" />
            <span className="font-sans text-[12px] uppercase tracking-[0.22em] opacity-55 font-light">
              [ {t("sectionLabel")} ]
            </span>
          </div>
          <h2
            className="font-display font-bold uppercase leading-[0.9]"
            style={{ fontSize: "clamp(2.5rem, 7vw, 7rem)", letterSpacing: "-0.05em" }}
          >
            <SplitHeading delay={0.1} stagger={0.03}>{t("heading")}</SplitHeading>
          </h2>
        </div>
        <p className="font-sans font-light opacity-55 max-w-xs" style={{ fontSize: "clamp(0.875rem, 1.3vw, 0.95rem)" }}>
          {t("replyNote")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">

        {/* ── Form ──────────────────────────────────────────────────── */}
        <div ref={formRef} className="lg:col-span-7">

          {/* Zalo direct — primary channel, above the form */}
          <a
            href="https://zalo.me/84353885757?text=Xin%20ch%C3%A0o%2C%20t%C3%B4i%20mu%E1%BB%91n%20h%E1%BB%8Fi%20v%E1%BB%81%20l%E1%BB%9Bp%20ti%E1%BA%BFng%20Anh"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTAClick("inquiry", "zalo_primary")}
            className="group flex items-center justify-between gap-4 mb-8 px-6 py-5 border border-foreground bg-foreground text-background hover:opacity-90 transition-opacity duration-300"
          >
            <span className="font-sans text-[13px] uppercase tracking-[0.18em] font-bold">
              {t("zaloPrimary")}
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          <p className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-45 font-light mb-6">
            {t("orFormLabel")}
          </p>

          <form onSubmit={handleSubmit} onFocus={handleFormFirstTouch} className="flex flex-col gap-6">
            {/* Honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            {/* Name */}
            <LineField
              id="inq-name"
              label={t("nameLabel")}
              placeholder={t("namePlaceholder")}
              value={form.name}
              onChange={(v) => set("name", v)}
              required
            />

            {/* Phone */}
            <LineField
              id="inq-phone"
              label={t("phoneLabel")}
              type="tel"
              placeholder={t("phonePlaceholder")}
              value={form.phone}
              onChange={(v) => set("phone", v)}
              required
            />

            {/* Email */}
            <LineField
              id="inq-email"
              label={t("emailLabel")}
              type="email"
              placeholder={t("emailPlaceholder")}
              value={form.email}
              onChange={(v) => set("email", v)}
              optional
              optionalLabel={t("optional")}
            />

            {/* Selectors — optional context, not required to submit */}
            <PillGroup
              label={t("forWhomLabel")}
              options={[t("forWhomChild"), t("forWhomSelf")]}
              value={form.forWhom}
              onChange={(v) => set("forWhom", v)}
            />
            <PillGroup
              label={t("levelLabel")}
              options={[t("levelBeginner"), t("levelIntermediate"), t("levelAdvanced"), t("levelNotSure")]}
              value={form.level}
              onChange={(v) => set("level", v)}
            />
            <PillGroup
              label={t("goalLabel")}
              options={[t("goalIelts"), t("goalSpeaking"), t("goalSchool"), t("goalWork")]}
              value={form.goal}
              onChange={(v) => set("goal", v)}
            />

            {/* Message */}
            <LineField
              id="inq-message"
              label={t("messageLabel")}
              placeholder={t("messagePlaceholder")}
              value={form.message}
              onChange={(v) => set("message", v)}
              optional
              optionalLabel={t("optional")}
              rows={4}
            />

            {/* Consent */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => set("consent", e.target.checked)}
                className="mt-1 w-4 h-4 border border-foreground/30 bg-transparent cursor-pointer"
              />
              <span className="font-sans text-[13px] uppercase tracking-[0.18em] opacity-65 font-light group-hover:opacity-90 transition-opacity duration-300">
                {t("consentText")}
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="self-start flex flex-col gap-3 disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <span className="font-sans text-[13px] uppercase tracking-[0.4em] font-light opacity-80 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4">
                {isSubmitting ? t("sendingButton") : t("sendButton")}
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="none"
                  className="group-hover:translate-x-1 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </span>
              {/* Animated underline */}
              <div className="w-36 h-[1px] bg-foreground/15 relative overflow-hidden">
                <div className="absolute inset-y-0 left-0 w-0 bg-foreground group-hover:w-full transition-all duration-600" style={{ transitionTimingFunction: "var(--transition-main)" }} />
              </div>
            </button>

            {/* Status — aria-live region always rendered so screen readers register it */}
            <div aria-live="polite" aria-atomic="true">
            {status !== "idle" && (
              <div className={`flex items-center gap-3 font-sans text-[13px] ${status === "success" ? "text-green-600" : "text-red-500"}`}>
                {status === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMsg}</span>
              </div>
            )}
            </div>
          </form>
        </div>

        {/* ── Info column ───────────────────────────────────────────── */}
        <div ref={infoRef} className="lg:col-span-5 flex flex-col gap-12">

          {/* Map — Leaflet + OpenStreetMap (no Google, no API key) */}
          <LazyMap />

          {/* Hours */}
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-60 font-light mb-5">
              {t("hoursLabel")}
            </p>
            <div className="space-y-2 border border-foreground/10">
              <div className="flex items-center justify-between px-5 py-3 border-b border-foreground/10">
                <span className="font-sans text-[13px] uppercase tracking-[0.14em] opacity-60 font-light">{t("weekdays")}</span>
                <span className="font-sans text-[13px] uppercase tracking-[0.14em] opacity-60 font-light">19:30 – 21:00</span>
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <span className="font-sans text-[13px] uppercase tracking-[0.14em] opacity-60 font-light">{t("weekends")}</span>
                <span className="font-sans text-[13px] uppercase tracking-[0.14em] opacity-60 font-light">14:00 – 20:00</span>
              </div>
            </div>
          </div>

          {/* Contact info — phone first, large */}
          <div>
            <p className="font-sans text-[12px] uppercase tracking-[0.2em] opacity-60 font-light mb-5">
              {t("connectLabel")}
            </p>

            {/* Big phone CTA */}
            <a
              href="https://zalo.me/84353885757"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col mb-6 pb-6 border-b border-foreground/10"
            >
              <span className="font-sans text-[11px] uppercase tracking-[0.22em] opacity-65 font-light mb-1">
                {t("phoneChannels")}
              </span>
              <span
                className="font-display font-bold leading-none tracking-tight text-foreground group-hover:opacity-60 transition-opacity duration-300"
                style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "0.06em" }}
              >
                +84 353 88 5757
              </span>
            </a>

            <div className="flex flex-col gap-3">
              <a href="mailto:hello@teacherbek.com"
                className="link-line font-sans font-light opacity-50 hover:opacity-100 transition-opacity duration-300 flex justify-between"
                style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}>
                <span>Email</span><span>hello@teacherbek.com</span>
              </a>
              <a href="https://wa.me/84353885757" target="_blank" rel="noopener noreferrer"
                className="link-line font-sans font-light opacity-50 hover:opacity-100 transition-opacity duration-300 flex justify-between"
                style={{ fontSize: "clamp(0.8rem, 1.2vw, 0.95rem)" }}>
                <span>WhatsApp</span><span>+84 353 88 5757</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
