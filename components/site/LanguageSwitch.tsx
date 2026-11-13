"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface LanguageSwitchProps {
  locale: string;
  targetLocale: string;
  className?: string;
  /** cursor label (data-cur) */
  cursor?: string;
  ariaLabel?: string;
  children: ReactNode;
}

/**
 * Switches EN ⇄ VI on the same path. A plain <a> on purpose: the other locale is a different document
 * (lang, layout, messages), so the runtime's page transition does a full load to it, as the prototype did.
 */
export function LanguageSwitch({ locale, targetLocale, className, cursor, ariaLabel, children }: LanguageSwitchProps) {
  const pathname = usePathname();
  const rest = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "");
  return (
    <a
      href={`/${targetLocale}${rest}`}
      className={className}
      lang={targetLocale}
      hrefLang={targetLocale}
      data-cur={cursor}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
