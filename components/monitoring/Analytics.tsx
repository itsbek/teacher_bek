"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pageView, track } from "@/lib/analytics";

/* One page_view per route (the first load included), sent after Next has set the new <title>.
   Plus the clicks GA4's enhanced measurement cannot see: phone and Zalo links, and the language switch. */
export function Analytics({ locale }: { locale: string }) {
  const pathname = usePathname();

  useEffect(() => {
    // the title is updated in the same commit; wait a moment so the event carries the new one.
    // pageView() itself drops repeats of the same address.
    const id = setTimeout(pageView, 60);
    return () => clearTimeout(id);
  }, [pathname]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) track("contact_click", { method: "phone", link_text: a.textContent?.trim().slice(0, 60) });
      else if (/^https?:\/\/(www\.)?zalo\.me\//i.test(href)) track("contact_click", { method: "zalo" });
      else if (href.startsWith("mailto:")) track("contact_click", { method: "email" });
      else if (a.hasAttribute("hreflang") && a.getAttribute("hreflang") !== locale) {
        track("language_switch", { from_language: locale, to_language: a.getAttribute("hreflang") ?? "" });
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [locale]);

  return null;
}
