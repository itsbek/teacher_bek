/**
 * POST /api/revalidate
 *
 * Busts the blog cache on every push to the content repo.
 *
 * GitHub webhook setup (itsbek/teacher-blog-content):
 *   Settings → Webhooks → Add webhook
 *   Payload URL  : https://your-domain.com/api/revalidate
 *   Content type : application/json          ← must be this, not form-urlencoded
 *   Secret       : value of REVALIDATE_SECRET in Vercel env vars
 *   Events       : Just the push event
 *
 * Manual trigger:
 *   curl -X POST https://your-domain.com/api/revalidate \
 *        -H "Authorization: Bearer YOUR_REVALIDATE_SECRET"
 */

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHmac, createHash, timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest();
}

export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;

  if (!secret) {
    console.error('[revalidate] REVALIDATE_SECRET env var is not set in Vercel.');
    return NextResponse.json(
      { error: 'REVALIDATE_SECRET not configured.' },
      { status: 503 },
    );
  }

  const githubEvent = req.headers.get('x-github-event');
  const githubSig   = req.headers.get('x-hub-signature-256');

  if (githubSig) {
    // ── GitHub webhook path ──────────────────────────────────────────────
    const body     = await req.text();
    const expected = 'sha256=' + createHmac('sha256', secret).update(body).digest('hex');

    console.log(`[revalidate] GitHub event="${githubEvent}" sig_match=${githubSig === expected}`);

    if (
      githubSig.length !== expected.length ||
      !timingSafeEqual(Buffer.from(githubSig), Buffer.from(expected))
    ) {
      console.error('[revalidate] Signature mismatch — check that the webhook secret in GitHub matches REVALIDATE_SECRET in Vercel.');
      return NextResponse.json({ error: 'Invalid signature.' }, { status: 401 });
    }

    // GitHub sends a ping when the webhook is first created — acknowledge it
    // without revalidating so the initial delivery shows green in GitHub UI.
    if (githubEvent === 'ping') {
      console.log('[revalidate] GitHub ping received — webhook is connected.');
      return NextResponse.json({ ok: true, message: 'Webhook connected.' });
    }

  } else {
    // ── Bearer token path (manual / curl) ───────────────────────────────
    const auth  = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

    if (!timingSafeEqual(sha256(token), sha256(secret))) {
      console.error('[revalidate] Bearer token mismatch.');
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  revalidateTag('blog');
  console.log('[revalidate] blog tag revalidated at', new Date().toISOString());

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
