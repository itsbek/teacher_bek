/**
 * POST /api/revalidate
 *
 * Busts the blog cache so the site picks up new/edited posts without
 * waiting for the hourly TTL to expire.
 *
 * Supports two callers:
 *
 * 1. GitHub webhook (recommended)
 *    — Set the webhook secret to your REVALIDATE_SECRET value in GitHub.
 *    — GitHub sends X-Hub-Signature-256: sha256=<hmac> on every push.
 *    — Payload URL: https://your-domain.com/api/revalidate
 *    — Content type: application/json
 *    — Events: Just the "push" event
 *
 * 2. Manual / script call
 *    curl -X POST https://your-domain.com/api/revalidate \
 *         -H "Authorization: Bearer YOUR_REVALIDATE_SECRET"
 *
 * Generate a secret:  openssl rand -hex 32
 * Add it to Vercel:   REVALIDATE_SECRET=<value>
 */

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, createHash, timingSafeEqual } from 'crypto';

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'Revalidation is not configured (REVALIDATE_SECRET missing).' },
      { status: 503 },
    );
  }

  const githubSig = req.headers.get('x-hub-signature-256');

  if (githubSig) {
    // ── GitHub webhook path ──────────────────────────────────────────────
    // GitHub computes: sha256=HMAC-SHA256(secret, rawBody)
    const body = await req.text();
    const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');

    if (
      githubSig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(githubSig), Buffer.from(expected))
    ) {
      return NextResponse.json({ error: 'Invalid GitHub signature.' }, { status: 401 });
    }
  } else {
    // ── Bearer token path (manual / script) ─────────────────────────────
    const auth  = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!timingSafeEqual(sha256(token), sha256(secret))) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  revalidateTag('blog');

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
