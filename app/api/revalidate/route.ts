/**
 * POST /api/revalidate
 *
 * Bust the blog cache so the site picks up new/edited Google Drive posts
 * without waiting for the hourly TTL to expire.
 *
 * Usage — call this from a Google Apps Script trigger after saving a post,
 * or manually from any HTTP client:
 *
 *   curl -X POST https://your-domain.com/api/revalidate \
 *        -H "Authorization: Bearer YOUR_REVALIDATE_SECRET"
 *
 * Set REVALIDATE_SECRET in your environment variables.
 * The value can be any long random string — generate one with:
 *   openssl rand -hex 32
 */

import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'crypto';

/** Hash a string so both sides of timingSafeEqual are always the same length. */
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

  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';

  // Use timing-safe comparison to prevent timing-based secret enumeration.
  const authorized = timingSafeEqual(sha256(token), sha256(secret));
  if (!authorized) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  revalidateTag('blog');

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
