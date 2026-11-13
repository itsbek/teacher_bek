/* Google Analytics 4 (stream "Teacher Bek", https://teacherbek.com).
   - gtag is loaded in app/[locale]/layout.tsx with send_page_view: false; page views are sent by
     components/monitoring/Analytics.tsx on every route change, after the new page title is set.
   - Every helper is a safe no-op when the script is missing or blocked: analytics must never break the page. */

export const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-PJRPM312LK";

type Params = Record<string, string | number | boolean | undefined>;
type Gtag = (command: "event" | "set" | "config", nameOrParams: string | Params, params?: Params) => void;

declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/** GA4 event names: lowercase letters, digits and underscores, at most 40 characters. */
export const eventName = (event: string): string =>
  event
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40) || "event";

/** Sends one GA4 event. Use GA4's recommended names where one exists (generate_lead, …). */
export function track(event: string, params?: Params): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  try {
    window.gtag("event", eventName(event), params);
  } catch {
    /* analytics must never break the page */
  }
}

let lastView = "";

/** One page_view per URL visit: repeated calls for the same address (re-renders, effects run twice) are dropped. */
export function pageView(): void {
  const here = location.pathname + location.search;
  if (here === lastView) return;
  lastView = here;
  track("page_view", {
    page_location: location.href,
    page_path: location.pathname,
    page_title: document.title,
  });
}
