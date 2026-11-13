/** Thin typed wrapper around Plausible's custom events. Safe no-op when the script is missing or blocked. */
type PlausibleFn = (event: string, options?: { props?: Record<string, string> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  try {
    window.plausible(event, props ? { props } : undefined);
  } catch {
    /* analytics must never break the page */
  }
}
