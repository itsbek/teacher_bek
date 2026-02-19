"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";

const STORAGE_KEY = "exit-intent-dismissed-at";
const COOLDOWN_MS = 1000 * 60 * 60 * 24; // 24h

export function ExitIntentModal() {
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  // Tracks session-level dismissal so the listener stops firing after "No Thanks"
  const dismissedRef = useRef(false);
  const removeListenerRef = useRef<(() => void) | undefined>(undefined);

  const shouldShow = useMemo(() => {
    if (typeof window === "undefined") return false;
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt) return true;
    const elapsed = Date.now() - Number(dismissedAt);
    return Number.isFinite(elapsed) && elapsed > COOLDOWN_MS;
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    // Only register after 45 seconds on page — avoids firing on load/quick visit
    const activateTimer = setTimeout(() => {
      const onMouseOut = (event: MouseEvent) => {
        if (event.clientY <= 0 && !event.relatedTarget && !dismissedRef.current) {
          setIsOpen(true);
        }
      };
      document.addEventListener("mouseout", onMouseOut);
      removeListenerRef.current = () => document.removeEventListener("mouseout", onMouseOut);
    }, 45_000);

    return () => {
      clearTimeout(activateTimer);
      removeListenerRef.current?.();
    };
  }, [shouldShow]);

  const close = () => {
    // Mark dismissed for this session AND persist for 24h cooldown
    dismissedRef.current = true;
    removeListenerRef.current?.();
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center">
      <div className="w-full max-w-xl border border-white/15 bg-[#111] text-white p-8 md:p-10">
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-4">Before You Leave</p>
        <h2 className="font-display text-4xl md:text-5xl tracking-tight mb-4">Get a Personalized English Plan</h2>
        <p className="text-white/70 mb-8">
          Share your goal and I will send a short recommended roadmap for your level and timeline.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href={`/${locale}#contact`}
            className="px-5 py-3 bg-white text-black text-sm font-semibold uppercase tracking-widest"
            onClick={close}
          >
            Start Inquiry
          </a>
          <a
            href="mailto:hello@teacherbek.com"
            className="px-5 py-3 border border-white/30 text-sm font-semibold uppercase tracking-widest"
            onClick={close}
          >
            Email Directly
          </a>
          <button
            type="button"
            onClick={close}
            className="px-5 py-3 text-sm uppercase tracking-widest text-white/60 hover:text-white"
          >
            No Thanks
          </button>
        </div>
      </div>
    </div>
  );
}
