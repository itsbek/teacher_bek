"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

const STORAGE_KEY = "exit-intent-dismissed-at";
const COOLDOWN_MS = 1000 * 60 * 60 * 24; // 24h


export function ExitIntentModal() {
  const locale  = useLocale();
  const t       = useTranslations("exitIntent");
  const [isOpen, setIsOpen] = useState(false);
  const dismissedRef        = useRef(false);
  const removeListenerRef   = useRef<(() => void) | undefined>(undefined);

  const shouldShow = useMemo(() => {
    if (typeof window === "undefined") return false;
    const dismissedAt = localStorage.getItem(STORAGE_KEY);
    if (!dismissedAt) return true;
    const elapsed = Date.now() - Number(dismissedAt);
    return Number.isFinite(elapsed) && elapsed > COOLDOWN_MS;
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const activateTimer = setTimeout(() => {
      const onMouseOut = (event: MouseEvent) => {
        if (event.clientY <= 0 && !event.relatedTarget && !dismissedRef.current) {
          setIsOpen(true);
        }
      };
      document.addEventListener("mouseout", onMouseOut);
      removeListenerRef.current = () => document.removeEventListener("mouseout", onMouseOut);
    }, 2_000);

    return () => {
      clearTimeout(activateTimer);
      removeListenerRef.current?.();
    };
  }, [shouldShow]);

  const close = () => {
    dismissedRef.current = true;
    removeListenerRef.current?.();
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-lg p-4 flex items-center justify-center">
      <div className="w-full max-w-xl border border-white/8 bg-[#0a0a0a] text-white p-10 md:p-14 shadow-2xl relative overflow-hidden">
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/3 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <p className="text-[13px] tracking-[0.25em] font-medium uppercase text-white/40 mb-6">
            [ {t("tag")} ]
          </p>
          <h2 className="font-display text-4xl md:text-5xl tracking-tighter mb-5 leading-[0.95]">
            {t("heading")}
          </h2>
          <p className="text-white/50 text-lg mb-10 font-light leading-relaxed">
            {t("body")}
          </p>

          <div className="flex flex-wrap gap-3">
            {/* Zalo — primary branded CTA */}
            <a
              href="https://zalo.me/84353885757"
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="inline-flex items-center gap-3 px-5 py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-white border border-[#0068FF]/60 hover:border-[#0068FF] hover:bg-[#0068FF]/10 transition-all duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/icons/zalo.svg" width={28} height={28} alt="" aria-hidden="true" className="block rounded-[13px] overflow-hidden" />
              {t("zalo")}
            </a>

            {/* Inquiry */}
            <a
              href={`/${locale}#contact`}
              className="px-6 py-3.5 border border-white/25 text-[13px] font-semibold uppercase tracking-[0.2em] hover:border-white/60 hover:bg-white/5 transition-all duration-300"
              onClick={close}
            >
              {t("inquiry")}
            </a>

            {/* Dismiss */}
            <button
              type="button"
              onClick={close}
              className="px-6 py-3.5 text-[13px] uppercase tracking-[0.2em] text-white/35 hover:text-white/70 transition-colors duration-300"
            >
              {t("dismiss")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
