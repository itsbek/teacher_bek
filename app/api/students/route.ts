import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { clientIp, isAllowedOrigin, rateLimit } from '@/lib/leads/guard';
import { submitNote, type StudentNote } from '@/lib/students/notes';

export const runtime = 'nodejs';

const schema = z.object({
  name: z.string().trim().min(1).max(60),
  studied: z.string().trim().max(80).optional(),
  message: z.string().trim().min(2).max(1200),
  wall: z.boolean().optional().default(false),
  locale: z.string().max(10).optional(),
  website: z.string().optional(), // honeypot
  formStartedAt: z.number().int().optional(),
});

const MAX_BODY_BYTES = 8 * 1024;
const fail = (code: string, status: number) => NextResponse.json({ ok: false, code }, { status });
const clean = (s: string | undefined): string => (s ?? '').replace(/<[^>]*>/g, '').trim();

export async function POST(request: NextRequest) {
  try {
    if (!isAllowedOrigin(request)) return fail('FORBIDDEN', 403);
    if (!(request.headers.get('content-type') || '').includes('application/json')) return fail('INVALID', 415);
    if (!rateLimit('notes', clientIp(request))) return fail('RATE_LIMITED', 429);
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

    const note: StudentNote = {
      id: crypto.randomUUID().replace(/-/g, '').slice(0, 20),
      createdAt: new Date().toISOString(),
      status: v.wall ? 'pending' : 'private',
      name: clean(v.name),
      studied: clean(v.studied) || undefined,
      message: clean(v.message),
      locale: v.locale === 'vi' ? 'vi' : 'en',
    };
    if (!note.name || note.message.length < 2) return fail('INVALID', 400);
    const ok = await submitNote(note);
    return ok ? NextResponse.json({ ok: true }) : fail('DELIVERY_FAILED', 502);
  } catch (err) {
    console.error('[notes] unexpected:', err instanceof Error ? err.message : 'unknown');
    return fail('DELIVERY_FAILED', 500);
  }
}
