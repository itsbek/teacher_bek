/**
 * Blog data layer.
 *
 * Source priority:
 *   1. Google Drive  — when GOOGLE_DRIVE_* env vars are set (production)
 *   2. Local filesystem content/blog/{locale}/*.md  — always available as dev fallback
 *
 * All public functions are async to support both sources transparently.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { BlogPost, PostCategory } from './blog-types';
import { getDrivePostFiles, isDriveConfigured } from './drive';

// ─── Constants ─────────────────────────────────────────────────────────────

const CONTENT_PATH = path.join(process.cwd(), 'content/blog');

export const categories = ['all', 'teaching', 'parents', 'learning', 'stories'] as const;
export type Category = typeof categories[number];

const VALID_CATEGORIES = new Set<PostCategory>(['teaching', 'parents', 'learning', 'stories']);

// ─── Parsing ───────────────────────────────────────────────────────────────

/**
 * Parse a raw markdown string (frontmatter + body) into a BlogPost.
 * Uses gray-matter for reliable YAML frontmatter parsing.
 * Returns null if required fields are missing.
 */
function parsePost(raw: string, fallbackSlug: string): BlogPost | null {
  let parsed: matter.GrayMatterFile<string>;

  try {
    parsed = matter(raw);
  } catch {
    console.warn(`[blog] Frontmatter parse error in "${fallbackSlug}" — skipping.`);
    return null;
  }

  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content.trim();

  // Validate required fields
  const slug      = String(data.slug      ?? fallbackSlug.replace(/\.md$/i, ''));
  const title     = String(data.title     ?? '');
  const excerpt   = String(data.excerpt   ?? '');
  const author    = String(data.author    ?? 'Teacher Bek');
  const date      = String(data.date      ?? '');
  const readTime  = Number(data.readTime  ?? 5);
  const rawCat    = String(data.category  ?? '').toLowerCase();
  const category  = VALID_CATEGORIES.has(rawCat as PostCategory)
    ? (rawCat as PostCategory)
    : 'teaching';

  if (!title || !excerpt || !date || !slug) {
    console.warn(`[blog] Post "${fallbackSlug}" is missing required fields (title, excerpt, date, slug) — skipping.`);
    return null;
  }

  // Optional fields
  const image     = data.image     ? String(data.image)     : undefined;
  const featured  = data.featured  === true;
  const draft     = data.draft     === true;
  const locale    = data.locale    ? String(data.locale)    : undefined;
  const updatedAt = data.updatedAt ? String(data.updatedAt) : undefined;

  const rawTags = data.tags;
  const tags: string[] | undefined = Array.isArray(rawTags)
    ? rawTags.map(String)
    : typeof rawTags === 'string'
    ? rawTags.split(',').map((t) => t.trim()).filter(Boolean)
    : undefined;

  return {
    slug,
    title,
    excerpt,
    content,
    author,
    date,
    readTime,
    category,
    image,
    featured: featured || undefined,
    draft: draft || undefined,
    tags,
    updatedAt,
    locale,
  };
}

// ─── Local source ──────────────────────────────────────────────────────────

function readLocalPosts(locale: string): BlogPost[] {
  const localePath = path.join(CONTENT_PATH, locale);

  if (!fs.existsSync(localePath)) {
    if (locale !== 'en') return readLocalPosts('en');
    return [];
  }

  return fs
    .readdirSync(localePath)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(localePath, file), 'utf-8');
      return parsePost(raw, file);
    })
    .filter((p): p is BlogPost => p !== null && !p.draft);
}

// ─── Drive source ──────────────────────────────────────────────────────────

async function readDrivePosts(locale: string): Promise<BlogPost[]> {
  const files = await getDrivePostFiles(locale);

  if (files.length === 0 && locale !== 'en') {
    return readDrivePosts('en');
  }

  return files
    .map((f) => parsePost(f.content, f.name))
    .filter((p): p is BlogPost => p !== null && !p.draft);
}

// ─── Sorting ───────────────────────────────────────────────────────────────

function sortByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Return all published posts for the given locale, newest first. */
export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const posts = isDriveConfigured()
    ? await readDrivePosts(locale)
    : readLocalPosts(locale);

  return sortByDate(posts);
}

/** Return a single post by slug, or undefined if not found. */
export async function getBlogPost(locale: string, slug: string): Promise<BlogPost | undefined> {
  const posts = await getBlogPosts(locale);
  return posts.find((p) => p.slug === slug);
}

/** Return posts marked with `featured: true`, newest first. */
export async function getFeaturedPosts(locale: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts.filter((p) => p.featured);
}

/** Return posts in a given category. Pass 'all' or omit to get every post. */
export async function getPostsByCategory(locale: string, category: string): Promise<BlogPost[]> {
  if (category === 'all' || !category) return getBlogPosts(locale);
  const posts = await getBlogPosts(locale);
  return posts.filter((p) => p.category === category);
}

/** Return posts that share at least one tag, excluding the current slug. */
export async function getRelatedPosts(
  locale: string,
  currentSlug: string,
  currentCategory: string,
  limit = 2,
): Promise<BlogPost[]> {
  const posts = await getBlogPosts(locale);
  return posts
    .filter((p) => p.slug !== currentSlug && p.category === currentCategory)
    .slice(0, limit);
}

/** Return all slugs (for static route generation). */
export async function getAllSlugs(locale: string): Promise<string[]> {
  const posts = await getBlogPosts(locale);
  return posts.map((p) => p.slug);
}
