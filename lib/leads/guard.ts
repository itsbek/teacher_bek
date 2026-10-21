import type { NextRequest } from 'next/server';

/* ── Origin / Referer same-site check ───────────────────────────────────── */
const ALLOWED_HOSTS = new Set(['teacherbek.com', 'www.teacherbek.com', 'localhost', '127.0.0.1']);

function hostAllowed(hostname: string): boolean {
  return ALLOWED_HOSTS.has(hostname) || hostname.endsWith('.vercel.app');
}

export function isAllowedOrigin(request: NextRequest): boolean {
  const raw = request.headers.get('origin') || request.headers.get('referer');
  if (!raw) return false;
  try {
    return hostAllowed(new URL(raw).hostname);
  } catch {
    return false;
  }
}

/* ── In-memory rate limit (per server instance; resets on cold start) ───── */
const buckets = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS = 3;
const WINDOW_MS = 60_000;

export function rateLimit(bucket: string, ip: string): boolean {
  const now = Date.now();
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now > v.resetTime) buckets.delete(k);
  }
  const key = `${bucket}:${ip}`;
  const entry = buckets.get(key);
  if (!entry || now > entry.resetTime) {
    buckets.set(key, { count: 1, resetTime: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

export function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/* ── Cloudflare Turnstile ───────────────────────────────────────────────── */
export function isTurnstileEnabled(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

/** Returns true when the token is valid. Fails open only if Cloudflare itself is unreachable. */
export async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip !== 'unknown') form.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(5000),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.warn('[leads] turnstile verification unreachable, allowing:', err instanceof Error ? err.message : 'unknown');
    return true;
  }
}
