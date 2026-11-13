import type { BrowserOptions } from '@sentry/browser';
import { scrubBreadcrumb, scrubEvent } from './scrub';

/* Loaded only inside the lazy chunk, after load + idle. Errors only: no tracing, no Replay, no Feedback. */

const IN_APP = /Zalo|FBAN|FBAV|FB_IAB|FBIOS/i;
const NETWORK_MSG = /Failed to fetch|NetworkError|Load failed|Network request failed/i;

export function browserOptions(dsn: string): BrowserOptions {
  return {
    dsn,
    release: process.env.NEXT_PUBLIC_SENTRY_RELEASE || undefined,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENV || process.env.NODE_ENV,
    tracesSampleRate: 0,
    sampleRate: 1,
    // no PII, cookies, headers, bodies or query strings
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
    maxBreadcrumbs: 20,
    // errors only: no release-health session ping on every page view
    integrations: (defaults) => defaults.filter((i) => i.name !== 'BrowserSession'),
    ignoreErrors: [
      /ResizeObserver loop/,
      /turnstile/i,
      /Java object is gone/,
      /window\.webkit\.messageHandlers/,
      /zaloJSV2|ZaloJavaScriptInterface/,
      /__gCrWeb/,
      /extension:\/\//,
    ],
    denyUrls: [
      /^chrome-extension:\/\//i,
      /^moz-extension:\/\//i,
      /^safari-(web-)?extension:\/\//i,
      /extensions\//i,
      /^webkit-masked-url:/i,
      /challenges\.cloudflare\.com/i,
      /plausible\.io/i,
    ],
    beforeBreadcrumb: (b) => scrubBreadcrumb(b),
    beforeSend: (event) => {
      const frames = (event.exception?.values ?? []).flatMap((v) => v.stacktrace?.frames ?? []);
      // Errors from scripts injected by in-app browsers: none of our own files in the stack.
      if (IN_APP.test(navigator.userAgent) && frames.length > 0) {
        const ours = frames.some((f) => (f.filename ?? '').includes('/_next/') || (f.filename ?? '').startsWith(location.origin));
        if (!ours) return null;
      }
      // Failed requests to the analytics host.
      const msg = event.exception?.values?.[0]?.value ?? event.message ?? '';
      if (NETWORK_MSG.test(msg)) {
        const last = [...(event.breadcrumbs ?? [])].reverse().find((b) => b.category === 'fetch' || b.category === 'xhr');
        if (typeof last?.data?.url === 'string' && last.data.url.includes('plausible.io')) return null;
      }
      return scrubEvent(event);
    },
  };
}
