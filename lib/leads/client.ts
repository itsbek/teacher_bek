'use client';

import { useEffect, useRef, useState } from 'react';
import type { LeadErrorCode, LeadUtm } from './types';

export const ZALO_URL = 'https://zalo.me/84353885757';
export const PHONE_DISPLAY = '+84 353 88 5757';
export const PHONE_TEL = 'tel:+84353885757';

export type ClientErrorCode = LeadErrorCode | 'NETWORK';

/** Maps a server code to a key under the `leads` translation namespace. */
export function errorKeyFor(code: ClientErrorCode): string {
  switch (code) {
    case 'DELIVERY_FAILED': return 'errorDelivery';
    case 'RATE_LIMITED': return 'errorRateLimited';
    case 'INVALID': return 'errorInvalid';
    case 'SPAM': return 'errorSpam';
    case 'CAPTCHA': return 'errorCaptcha';
    default: return 'errorNetwork';
  }
}

export function collectLeadContext(): { page: string; referrer: string; utm?: LeadUtm } {
  const url = new URL(window.location.href);
  const get = (k: string) => url.searchParams.get(k) || undefined;
  const utm: LeadUtm = {
    source: get('utm_source'),
    medium: get('utm_medium'),
    campaign: get('utm_campaign'),
    term: get('utm_term'),
    content: get('utm_content'),
  };
  const hasUtm = Object.values(utm).some(Boolean);
  return { page: url.origin + url.pathname, referrer: document.referrer, utm: hasUtm ? utm : undefined };
}

export type PostLeadResult<T = undefined> = { ok: true; data: T | undefined } | { ok: false; code: ClientErrorCode };

export async function postLead<T = undefined>(endpoint: string, payload: Record<string, unknown>): Promise<PostLeadResult<T>> {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, ...collectLeadContext() }),
    });
    const data = (await res.json().catch(() => ({}))) as { ok?: boolean; code?: ClientErrorCode; pricing?: T };
    if (res.ok && data.ok) return { ok: true, data: data.pricing };
    return { ok: false, code: data.code ?? 'DELIVERY_FAILED' };
  } catch {
    return { ok: false, code: 'NETWORK' };
  }
}

/* ── Cloudflare Turnstile (plain script tag, explicit render) ───────────── */
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id?: string) => void;
}
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = SCRIPT_SRC;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { scriptPromise = null; reject(new Error('turnstile load failed')); };
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * Renders a Turnstile widget into `containerRef` once `active` is true.
 * Entirely inert when NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set.
 */
export function useTurnstile(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [token, setToken] = useState('');
  const enabled = Boolean(SITE_KEY);

  useEffect(() => {
    if (!enabled || !active) return;
    let cancelled = false;
    loadTurnstile()
      .then(() => {
        const el = containerRef.current;
        if (cancelled || !el || !window.turnstile || widgetId.current) return;
        widgetId.current = window.turnstile.render(el, {
          sitekey: SITE_KEY,
          theme: 'auto',
          callback: (t: string) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
        });
      })
      .catch(() => { /* widget unavailable: server decides whether to accept */ });
    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) window.turnstile.remove(widgetId.current);
      widgetId.current = undefined;
      setToken('');
    };
  }, [enabled, active]);

  const reset = () => {
    setToken('');
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  };

  return { containerRef, token, enabled, reset };
}
