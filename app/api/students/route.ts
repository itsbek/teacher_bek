import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { clientIp, isAllowedOrigin, rateLimit } from '@/lib/leads/guard';
import { COOLDOWN_HOURS, submitNote, type StudentNote } from '@/lib/students/notes';
import { describeUA, hasBadWords, uaKey } from '@/lib/students/guard';

export const runtime = 'nodejs';

const opt = (max: number) => z.string().trim().max(max).optional();
const schema = z.object({
  name: z.string().trim().min(1).max(60),
  studied: opt(80),
  message: z.string().trim().min(2).max(1200),
  wall: z.boolean().optional().default(false),
  locale: z.string().max(10).optional(),
  website: z.string().optional(), // honeypot
  formStartedAt: z.number().int().optional(),
  // the browser's own details (all optional; used only to recognise a device and shown only to the teacher)
  deviceId: z.string().regex(/^[a-f0-9-]{16,40}$/i).optional(),
  tz: opt(60),
  lang: opt(40),
  screen: opt(30),
  model: opt(60),
  referrer: opt(300),
});

const MAX_BODY_BYTES = 8 * 1024;
const COOKIE = 'bek_dev';
const ID_RE = /^[a-f0-9-]{16,40}$/i;
const fail = (code: string, status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, code, ...extra }, { status });
const clean = (s: string | undefined): string => (s ?? '').replace(/<[^>]*>/g, '').trim();

function place(req: NextRequest): string {
  const h = (k: string) => {
    const v = req.headers.get(k);
    try {
      return v ? decodeURIComponent(v) : '';
    } catch {
      return v ?? '';
    }
  };
  return [h('x-vercel-ip-city'), h('x-vercel-ip-country-region'), h('x-vercel-ip-country')].filter(Boolean).join(', ');
}

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) return fail('FORBIDDEN', 403);
    if (!(request.headers.get('content-type') || '').includes('application/json')) return fail('INVALID', 415);
    const ip = clientIp(request);
    if (!rateLimit('notes', ip)) return fail('RATE_LIMITED', 429);
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return fail('INVALID', 413);
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return fail('INVALID', 400);
    }
    const parsed = schema.safeParse(body);
    if (!parsed.success) return fail('INVALID', 400);
    const v = parsed.data;
    // bots: look successful, keep nothing
    if (v.website && v.website.trim()) return NextResponse.json({ ok: true });
    if (v.formStartedAt && Date.now() - v.formStartedAt < 2500) return fail('SPAM', 400);

    const name = clean(v.name),
      studied = clean(v.studied),
      message = clean(v.message);
    if (!name || message.length < 2) return fail('INVALID', 400);
    if (hasBadWords(name, studied, message)) return fail('WORDS', 422);

    // one device id per browser: the cookie wins, the browser's stored copy is the fallback (cookies off / cleared)
    const fromCookie = request.cookies.get(COOKIE)?.value;
    const deviceId = (fromCookie && ID_RE.test(fromCookie) ? fromCookie : v.deviceId) || crypto.randomUUID();
    const ua = request.headers.get('user-agent') ?? '';
    const d = describeUA(ua, v.model);

    const note: StudentNote = {
      id: crypto.randomUUID().replace(/-/g, '').slice(0, 20),
      createdAt: new Date().toISOString(),
      status: v.wall ? 'pending' : 'private',
      name,
      studied: studied || undefined,
      message,
      locale: v.locale === 'vi' ? 'vi' : 'en',
      sender: {
        deviceId,
        ip: ip === 'unknown' ? '' : ip,
        uaKey: await uaKey(ua),
        device: `${d.device} · ${d.os}`,
        browser: d.browser,
        place: place(request),
        lang: v.lang || request.headers.get('accept-language')?.split(',')[0] || undefined,
        tz: v.tz,
        screen: v.screen,
        referrer: v.referrer,
      },
    };
    const result = await submitNote(note);
    const res = result.ok
      ? NextResponse.json({ ok: true, cooldownHours: COOLDOWN_HOURS })
      : result.code === 'COOLDOWN'
        ? fail('COOLDOWN', 429, { retryAt: result.retryAt })
        : result.code === 'BLOCKED'
          ? // a blocked device is not told: it looks sent, and nothing reaches the teacher
            NextResponse.json({ ok: true, cooldownHours: COOLDOWN_HOURS })
          : fail('DELIVERY_FAILED', 502);
    res.cookies.set(COOKIE, deviceId, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 400 });
    return res;
  } catch (err) {
    console.error('[notes] unexpected:', err instanceof Error ? err.message : 'unknown');
    return fail('DELIVERY_FAILED', 500);
  }
}
