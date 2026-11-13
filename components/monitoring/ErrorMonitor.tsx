'use client';

import { useEffect } from 'react';

/* Lazy error monitor. An inline script (QUEUE_SCRIPT in the locale layout) queues error and
   unhandledrejection events from first paint. After `load` + idle (2 s timeout) this loads the browser SDK,
   initialises it and replays the queue. Rendered only when NEXT_PUBLIC_SENTRY_DSN is set. */

interface QueuedItem { e: unknown; m: string }
interface QueueWindow extends Window { __sq?: QueuedItem[]; __sqOff?: () => void }

export function ErrorMonitor() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    if (!dsn) return;
    let cancelled = false;
    const start = async () => {
      if (cancelled) return;
      try {
        const { startBrowserSentry } = await import('@/lib/sentry/browser-client');
        if (cancelled) return;
        const w = window as QueueWindow;
        w.__sqOff?.();
        const queued = w.__sq ?? [];
        w.__sq = [];
        startBrowserSentry(dsn, queued);
      } catch {
        /* monitoring must never break the page */
      }
    };
    const idle = () => {
      if (typeof requestIdleCallback === 'function') requestIdleCallback(() => void start(), { timeout: 2000 });
      else setTimeout(() => void start(), 2000);
    };
    if (document.readyState === 'complete') idle();
    else window.addEventListener('load', idle, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener('load', idle);
    };
  }, []);
  return null;
}
