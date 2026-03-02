"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

/** Map browser locale prefixes → our supported locale codes */
const BROWSER_TO_LOCALE: Record<string, string> = {
  vi: "vi",
  zh: "zh",
  ru: "ru",
  en: "en",
};

/** Offer text written in the TARGET language so users can actually read it */
const MESSAGES: Record<string, { offer: string; yes: string; dismiss: string }> = {
  vi: {
    offer: "Trang này có phiên bản tiếng Việt.",
    yes: "Xem bằng tiếng Việt",
    dismiss: "Bỏ qua",
  },
  zh: {
    offer: "此网站提供中文版本。",
    yes: "切换到中文",
    dismiss: "忽略",
  },
  ru: {
    offer: "Этот сайт доступен на русском языке.",
    yes: "Перейти на русский",
    dismiss: "Не сейчас",
  },
};

export function LanguageSuggestion() {
  const locale = useLocale();
  const pathname = usePathname();
  const [suggested, setSuggested] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Never show if already dismissed this session
    if (sessionStorage.getItem("lang-offer-dismissed")) return;

    const browserLang = navigator.language || "";
    // Try full tag (e.g. "zh-TW"), then prefix (e.g. "zh")
    const mapped =
      BROWSER_TO_LOCALE[browserLang] ??
      BROWSER_TO_LOCALE[browserLang.split("-")[0]];

    // Only offer if the mapped locale is different from the current one
    // and we actually have a message for it (i.e. don't offer "en" → already shown in English)
    if (mapped && mapped !== locale && MESSAGES[mapped]) {
      setSuggested(mapped);
      // Small delay so the page settles before banner slides in
      const t = setTimeout(() => setVisible(true), 1800);
      return () => clearTimeout(t);
    }
  }, [locale]);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("lang-offer-dismissed", "1");
    setTimeout(() => setSuggested(null), 400); // wait for exit transition
  };

  if (!suggested) return null;
  const msg = MESSAGES[suggested];
  if (!msg) return null;

  const targetPath =
    pathname.replace(/^\/(en|vi|zh|ru)(?=\/|$)/, `/${suggested}`) ||
    `/${suggested}`;

  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed",
        bottom: "clamp(1rem, 3vw, 1.5rem)",
        left: "clamp(1rem, 3vw, 1.5rem)",
        right: "clamp(1rem, 3vw, 1.5rem)",
        maxWidth: 420,
        zIndex: 9500,
        background: "hsl(var(--foreground))",
        color: "hsl(var(--background))",
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
        transition: "opacity 0.35s, transform 0.35s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* Message */}
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 13,
          lineHeight: 1.45,
          flex: 1,
          margin: 0,
        }}
      >
        {msg.offer}
      </p>

      {/* Switch link */}
      <Link
        href={targetPath}
        onClick={dismiss}
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          textDecoration: "none",
          color: "inherit",
          whiteSpace: "nowrap",
          opacity: 0.85,
          border: "1px solid currentColor",
          padding: "5px 10px",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
      >
        {msg.yes}
      </Link>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        aria-label={msg.dismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "inherit",
          opacity: 0.45,
          padding: 4,
          display: "flex",
          alignItems: "center",
          transition: "opacity 0.15s",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.45")}
      >
        <X size={15} />
      </button>
    </div>
  );
}
