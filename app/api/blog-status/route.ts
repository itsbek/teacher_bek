/**
 * GET /api/blog-status?secret=YOUR_REVALIDATE_SECRET
 *
 * Diagnostic endpoint — checks whether GitHub blog integration is working.
 * Protected by REVALIDATE_SECRET so it's not publicly readable.
 */

import { NextRequest, NextResponse } from 'next/server';
import { isGithubConfigured } from '@/lib/github';
import { getBlogPosts } from '@/lib/blog';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const provided = req.nextUrl.searchParams.get('secret');

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const configured = isGithubConfigured();
  const envVars = {
    GITHUB_TOKEN: !!process.env.GITHUB_TOKEN,
    GITHUB_BLOG_REPO: process.env.GITHUB_BLOG_REPO ?? null,
  };

  if (!configured) {
    return NextResponse.json({
      ok: false,
      configured,
      envVars,
      posts: [],
      error: 'GitHub integration not configured — GITHUB_TOKEN or GITHUB_BLOG_REPO missing in Vercel env vars.',
    });
  }

  try {
    const posts = await getBlogPosts('en');
    return NextResponse.json({
      ok: true,
      configured,
      envVars,
      postCount: posts.length,
      posts: posts.map(p => ({ slug: p.slug, title: p.title, date: p.date, draft: p.draft })),
    });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      configured,
      envVars,
      posts: [],
      error: String(err),
    });
  }
}
