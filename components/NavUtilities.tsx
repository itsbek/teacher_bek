"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useAppStore, type FontSize } from "@/lib/store";

const LANGUAGES = [
  { code: "en", label: "EN", name: "English" },
  { code: "vi", label: "VI", name: "Tiếng Việt" },
  { code: "zh", label: "ZH", name: "中文" },
  { code: "ru", label: "RU", name: "Русский" },
] as const;

const FONT_SIZES: { size: FontSize; px: number; label: string }[] = [
  { size: "sm", px: 12, label: "A−" },
  { size: "md", px: 15, label: "A" },
  { size: "lg", px: 18, label: "A+" },
];

export function NavUtilities() {
  const locale = useLocale();
  const pathname = usePathname();
  const { fontSize, setFontSize } = useAppStore();

  const [langOpen, setLangOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });
  const langBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const localizedPath = (newLocale: string) =>
    pathname.replace(/^\/(en|vi|zh|ru)(?=\/|$)/, `/${newLocale}`) || `/${newLocale}`;

  const openLang = useCallback(() => {
    if (langBtnRef.current) {
      const rect = langBtnRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
    setLangOpen((v) => !v);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!langOpen) return;
    const close = (e: MouseEvent) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [langOpen]);

  const currentLang = LANGUAGES.find((l) => l.code === locale);

  return (
    <>
      {/* ── Desktop utility bar — sibling of mix-blend-mode nav, same visual row ── */}
      <div
        className="hidden lg:flex items-center gap-4"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          zIndex: 10001,
          padding: "20px clamp(1.25rem, 4vw, 4rem)",
          mixBlendMode: "difference",
          color: "#efefef",
          pointerEvents: "auto",
        }}
        aria-label="Utility controls"
      >
        {/* Font size — A− A A+ */}
        <div
          className="flex items-center gap-[2px]"
          role="group"
          aria-label="Font size"
          style={{ gap: "1px" }}
        >
          {FONT_SIZES.map(({ size, px, label }) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              aria-pressed={fontSize === size}
              aria-label={`Font size ${size}`}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: px,
                fontWeight: 700,
                lineHeight: 1,
                padding: "4px 6px",
                opacity: fontSize === size ? 1 : 0.3,
                transition: "opacity 0.2s",
                letterSpacing: "-0.02em",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "inherit",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Divider */}
        <span style={{ width: 1, height: 14, background: "currentColor", opacity: 0.2, display: "block" }} aria-hidden="true" />

        {/* Language dropdown trigger */}
        <button
          ref={langBtnRef}
          onClick={openLang}
          aria-expanded={langOpen}
          aria-haspopup="listbox"
          aria-label={`Language: ${currentLang?.name ?? locale.toUpperCase()}`}
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 13,
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            opacity: 0.7,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "inherit",
            display: "flex",
            alignItems: "center",
            gap: 5,
            transition: "opacity 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.7")}
        >
          {currentLang?.label ?? locale.toUpperCase()}
          <span
            style={{
              display: "inline-block",
              fontSize: 8,
              transition: "transform 0.2s",
              transform: langOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        {/* Divider */}
        <span style={{ width: 1, height: 14, background: "currentColor", opacity: 0.2, display: "block" }} aria-hidden="true" />

        {/* Theme toggle */}
        <ThemeToggle />
      </div>

      {/* ── Language dropdown — rendered via portal to escape blend-mode compositing ── */}
      {langOpen && mounted && createPortal(
        <div
          role="listbox"
          aria-label="Select language"
          style={{
            position: "fixed",
            top: dropdownPos.top,
            right: dropdownPos.right,
            zIndex: 10002,
            background: "hsl(var(--background))",
            border: "1px solid hsl(var(--foreground) / 0.12)",
            minWidth: 160,
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          }}
        >
          {LANGUAGES.map((lang) => (
            <Link
              key={lang.code}
              href={localizedPath(lang.code)}
              role="option"
              aria-selected={locale === lang.code}
              onClick={() => setLangOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 16px",
                fontFamily: "var(--font-sans)",
                fontSize: 13,
                textDecoration: "none",
                color: "hsl(var(--foreground))",
                opacity: locale === lang.code ? 1 : 0.55,
                fontWeight: locale === lang.code ? 600 : 400,
                borderBottom: "1px solid hsl(var(--foreground) / 0.06)",
                transition: "opacity 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = "1";
                (e.currentTarget as HTMLElement).style.background = "hsl(var(--foreground) / 0.04)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.opacity = locale === lang.code ? "1" : "0.55";
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 11 }}>
                {lang.label}
              </span>
              <span style={{ opacity: 0.7 }}>{lang.name}</span>
              {locale === lang.code && (
                <span style={{ marginLeft: "auto", opacity: 0.4, fontSize: 10 }}>✓</span>
              )}
            </Link>
          ))}
        </div>,
        document.body
      )}
    </>
  );
}
