"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, X } from "lucide-react";
import { trackCTAClick, event as trackEvent } from "@/lib/analytics";

const UNLOCK_KEY = "pricing-unlocked";

type Program = { key: string; title: string; price: string };

export function PricingGateModal({
  isOpen,
  onClose,
  programs,
}: {
  isOpen: boolean;
  onClose: () => void;
  programs: Program[];
}) {
  const t = useTranslations("pricingGate");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [formStartedAt] = useState(() => Date.now());

  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Skip the gate if this visitor already unlocked pricing this session
  useEffect(() => {
    if (isOpen && typeof window !== "undefined" && sessionStorage.getItem(UNLOCK_KEY)) {
      setRevealed(true);
    }
  }, [isOpen]);

  // Focus trap + Escape key
  useEffect(() => {
    if (!isOpen) return;
    previousFocusRef.current = document.activeElement as HTMLElement;
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
    dialog.querySelector<HTMLElement>(focusableSelector)?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key !== "Tab") return;
      const focusables = dialog.querySelectorAll<HTMLElement>(focusableSelector);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, onClose]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || name.trim().length < 2 || phone.trim().length < 6) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/pricing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          website: "",
          formStartedAt,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to submit.");
      }
      trackEvent({ action: "pricing_unlock", category: "conversion", label: "pricing_gate" });
      sessionStorage.setItem(UNLOCK_KEY, "1");
      setRevealed(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, name, phone, formStartedAt]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] bg-black/80 backdrop-blur-lg p-4 flex items-center justify-center">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="pricing-gate-title"
        className="w-full max-w-lg border border-white/8 bg-[#0a0a0a] text-white p-8 md:p-12 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label={t("closeLabel")}
          className="absolute top-5 right-5 z-10 text-white/40 hover:text-white transition-colors duration-200"
        >
          <X size={18} />
        </button>

        <div className="relative z-10">
          {!revealed ? (
            <>
              <p className="text-[12px] tracking-[0.25em] font-medium uppercase text-white/40 mb-5">
                [ {t("eyebrow")} ]
              </p>
              <h2 id="pricing-gate-title" className="font-display text-3xl md:text-4xl tracking-tight mb-4 leading-[0.95]">
                {t("heading")}
              </h2>
              <p className="text-white/50 mb-8 font-light leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}>
                {t("body")}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

                <div>
                  <label htmlFor="pg-name" className="block font-sans text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">
                    {t("nameLabel")}
                  </label>
                  <input
                    id="pg-name"
                    type="text"
                    required
                    value={name}
                    placeholder={t("namePlaceholder")}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-2.5 text-white placeholder:text-white/25 font-sans font-light"
                    style={{ fontSize: "1rem" }}
                  />
                </div>

                <div>
                  <label htmlFor="pg-phone" className="block font-sans text-[11px] uppercase tracking-[0.2em] text-white/50 mb-2">
                    {t("phoneLabel")}
                  </label>
                  <input
                    id="pg-phone"
                    type="tel"
                    required
                    value={phone}
                    placeholder={t("phonePlaceholder")}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-white/20 focus:border-white outline-none py-2.5 text-white placeholder:text-white/25 font-sans font-light"
                    style={{ fontSize: "1rem" }}
                  />
                </div>

                {error && <p className="text-red-400 text-[13px] font-sans">{error}</p>}

                <button
                  type="submit"
                  disabled={isSubmitting || name.trim().length < 2 || phone.trim().length < 6}
                  className="mt-2 inline-flex items-center justify-center gap-2 px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase disabled:opacity-30 disabled:cursor-not-allowed transition-opacity duration-300"
                  style={{ background: "#B85337", color: "#fff" }}
                >
                  {isSubmitting ? t("submittingButton") : t("submitButton")}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </button>

                <p className="text-white/30 text-[11px] font-sans leading-relaxed">
                  {t("privacyNote")}
                </p>
              </form>
            </>
          ) : (
            <>
              <p className="text-[12px] tracking-[0.25em] font-medium uppercase text-white/40 mb-5">
                [ {t("successEyebrow")} ]
              </p>
              <h2 className="font-display text-3xl md:text-4xl tracking-tight mb-4 leading-[0.95]">
                {t("successHeading")}
              </h2>
              <p className="text-white/50 mb-8 font-light leading-relaxed" style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem)" }}>
                {t("successBody")}
              </p>

              <div className="flex flex-col divide-y divide-white/10 border-y border-white/10 mb-8">
                {programs.map((p) => (
                  <div key={p.key} className="flex items-center justify-between py-4">
                    <span className="font-sans text-[13px] uppercase tracking-[0.1em] text-white/70">{p.title}</span>
                    <span className="font-display font-bold text-lg text-white">{p.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <a
                  href="https://zalo.me/84353885757?text=Xin%20ch%C3%A0o%2C%20t%C3%B4i%20mu%E1%BB%91n%20%C4%91%C4%83ng%20k%C3%BD%20tu%E1%BA%A7n%20h%E1%BB%8Dc%20th%E1%BB%AD%20mi%E1%BB%85n%20ph%C3%AD"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { trackCTAClick("pricing_gate", "zalo_book_trial"); onClose(); }}
                  className="inline-flex items-center gap-2 px-6 py-4 text-[12px] font-bold tracking-[0.2em] uppercase transition-opacity duration-300 hover:opacity-90"
                  style={{ background: "#B85337", color: "#fff" }}
                >
                  {t("zaloCta")}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-4 text-[12px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors duration-300"
                >
                  {t("closeLabel")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
