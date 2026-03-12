/**
 * Student writing data layer.
 *
 * Mirrors the blog data layer (lib/blog.ts) but for student-submitted writing.
 *
 * Source priority:
 *   1. GitHub  — GITHUB_BLOG_REPO/community/*.md  (production)
 *   2. Local   — content/community/*.md           (dev fallback)
 *
 * Files named with uppercase or underscores (STUDENT_GUIDE.md, README.md)
 * are silently skipped — safe to keep guides alongside posts.
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getGithubCommunityFiles, isGithubConfigured } from './github';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface StudentPost {
  slug: string;
  name: string;        // first name — kept private, used only by teacher
  level: string;       // Beginner | Intermediate | Advanced
  date: string;        // YYYY-MM-DD
  title: string;
  excerpt: string;     // 1–2 sentences shown in listing card
  content?: string;    // legacy: typed text. New entries use driveLink instead.
  driveLink?: string;  // Google Drive (or Docs) view link
  feedback?: string;   // teacher's published feedback / improvement notes
  wordCount?: number;
  featured?: boolean;
}

// ─── Constants ─────────────────────────────────────────────────────────────

const CONTENT_PATH = path.join(process.cwd(), 'content/community');

/** Only process lowercase-kebab-case filenames. Ignores GUIDE.md, README.md, _draft.md, etc. */
const isStudentFile = (name: string) => /^[a-z][a-z0-9-]*\.md$/.test(name);

// ─── Parsing ───────────────────────────────────────────────────────────────

function parseStudentPost(raw: string, fallbackSlug: string): StudentPost | null {
  let parsed: matter.GrayMatterFile<string>;

  try {
    parsed = matter(raw);
  } catch {
    console.warn(`[community] Frontmatter parse error in "${fallbackSlug}" — skipping.`);
    return null;
  }

  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content.trim();

  const slug      = String(data.slug    ?? fallbackSlug.replace(/\.md$/i, ''));
  const name      = String(data.name    ?? '');
  const level     = String(data.level   ?? 'Intermediate');
  const date      = String(data.date    ?? '');
  const title     = String(data.title   ?? '');
  const driveLink = data.driveLink ? String(data.driveLink) : undefined;
  const feedback  = data.feedback  ? String(data.feedback)  : undefined;
  // excerpt: explicit > derive from content (legacy) > blank
  const excerpt   = String(data.excerpt ?? (content ? content.slice(0, 160).replace(/\n/g, ' ').trim() + '…' : ''));

  // slug, name, date, title are always required; content OR driveLink must exist
  if (!slug || !name || !date || !title || (!content && !driveLink)) {
    console.warn(`[community] Post "${fallbackSlug}" is missing required fields — skipping.`);
    return null;
  }

  const draft     = data.draft     === true;
  const featured  = data.featured  === true;
  const wordCount = data.wordCount ? Number(data.wordCount) : undefined;

  if (draft) return null;

  return {
    slug, name, level, date, title, excerpt,
    ...(content   ? { content }   : {}),
    ...(driveLink ? { driveLink } : {}),
    ...(feedback  ? { feedback }  : {}),
    ...(wordCount ? { wordCount } : {}),
    ...(featured  ? { featured }  : {}),
  };
}

// ─── Local source ──────────────────────────────────────────────────────────

function readLocalPosts(): StudentPost[] {
  if (!fs.existsSync(CONTENT_PATH)) return [];

  return fs
    .readdirSync(CONTENT_PATH)
    .filter(isStudentFile)
    .map((file) => {
      const raw = fs.readFileSync(path.join(CONTENT_PATH, file), 'utf-8');
      return parseStudentPost(raw, file);
    })
    .filter((p): p is StudentPost => p !== null);
}

// ─── GitHub source ─────────────────────────────────────────────────────────

async function readGithubPosts(): Promise<StudentPost[]> {
  const files = (await getGithubCommunityFiles()).filter((f) => isStudentFile(f.name));

  return files
    .map((f) => parseStudentPost(f.content, f.name))
    .filter((p): p is StudentPost => p !== null);
}

// ─── Sorting ───────────────────────────────────────────────────────────────

function sortByDate(posts: StudentPost[]): StudentPost[] {
  return [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

// ─── Public API ────────────────────────────────────────────────────────────

/** Return all published student posts, newest first. */
export async function getCommunityPosts(): Promise<StudentPost[]> {
  const posts = isGithubConfigured()
    ? await readGithubPosts()
    : readLocalPosts();

  return sortByDate(posts);
}

/** Return a single post by slug. */
export async function getCommunityPost(slug: string): Promise<StudentPost | undefined> {
  const posts = await getCommunityPosts();
  return posts.find((p) => p.slug === slug);
}

/** Return posts marked featured: true. */
export async function getFeaturedCommunityPosts(): Promise<StudentPost[]> {
  const posts = await getCommunityPosts();
  return posts.filter((p) => p.featured);
}
