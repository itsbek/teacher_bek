import type { Breadcrumb, ErrorEvent } from '@sentry/browser';

/* Privacy scrubbing shared by the browser and server Sentry setups. Pure functions, no SDK imports
   (types only), so this file adds nothing to any bundle on its own. */

const SENSITIVE_HEADERS = new Set([
  'cookie',
  'set-cookie',
  'authorization',
  'proxy-authorization',
  'x-telegram-bot-api-secret-token',
  'x-forwarded-for',
  'x-real-ip',
  'x-vercel-forwarded-for',
]);

/** Runs of digits (with + space . - ( ) separators) containing at least 8 digits: phone numbers. */
const PHONE_RUN = /\+?\d[\d\s().-]{6,}\d/g;

export function maskPhones(text: string): string {
  return text.replace(PHONE_RUN, (m) => (m.replace(/\D/g, '').length >= 8 ? '[phone]' : m));
}

/** Removes the query string (and fragment) from a URL or path. */
export function stripQuery(url: string): string {
  return url.replace(/[?#].*$/, '');
}

const FORM_TARGET = /\b(input|textarea|select|form|button)\b/i;

/** Returns null to drop the breadcrumb. */
export function scrubBreadcrumb(b: Breadcrumb): Breadcrumb | null {
  const cat = b.category ?? '';
  if (cat === 'ui.input' || cat === 'console') return null;
  if (cat.startsWith('ui.') && FORM_TARGET.test(b.message ?? '')) return null;
  const out: Breadcrumb = { ...b };
  if (typeof out.message === 'string') out.message = maskPhones(out.message);
  if (out.data) {
    const data: Record<string, unknown> = { ...out.data };
    for (const k of ['url', 'from', 'to']) {
      if (typeof data[k] === 'string') data[k] = stripQuery(data[k] as string);
    }
    delete data.request_body_size;
    delete data.body;
    out.data = data;
  }
  return out;
}

export function scrubEvent<T extends ErrorEvent>(event: T): T {
  if (event.request) {
    const req = event.request;
    delete req.data;
    delete req.cookies;
    delete req.query_string;
    if (req.url) req.url = stripQuery(req.url);
    if (req.headers) {
      const headers: Record<string, string> = {};
      for (const [k, v] of Object.entries(req.headers)) {
        if (!SENSITIVE_HEADERS.has(k.toLowerCase())) headers[k] = v;
      }
      req.headers = headers;
    }
  }
  if (event.user) event.user = {}; // no IP, id, email, username
  delete event.extra;
  if (typeof event.message === 'string') event.message = maskPhones(event.message);
  if (event.logentry?.message) event.logentry.message = maskPhones(event.logentry.message);
  for (const ex of event.exception?.values ?? []) {
    if (typeof ex.value === 'string') ex.value = maskPhones(ex.value);
  }
  if (event.breadcrumbs) {
    event.breadcrumbs = event.breadcrumbs.map(scrubBreadcrumb).filter((b): b is Breadcrumb => b !== null);
  }
  return event;
}
