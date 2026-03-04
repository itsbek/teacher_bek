/**
 * GitHub blog source.
 *
 * Repo layout expected (create subfolders per locale):
 *
 *   your-blog-repo/
 *     en/
 *       my-first-post.md
 *       another-post.md
 *     vi/
 *       my-first-post.md
 *     zh/
 *     ru/
 *
 * Each .md file contains standard frontmatter + markdown body.
 *
 * Required environment variables:
 *   GITHUB_TOKEN       — fine-grained PAT, "Contents: Read-only" on the blog repo
 *   GITHUB_BLOG_REPO   — e.g. "yourusername/teacher-blog-content"
 */

import { unstable_cache } from 'next/cache';

// ─── Constants ─────────────────────────────────────────────────────────────

const ALLOWED_LOCALES = new Set(['en', 'vi', 'zh', 'ru']);
const REVALIDATE_SECONDS = Number(process.env.BLOG_CACHE_REVALIDATE_SECONDS ?? 3600);

// ─── Types ─────────────────────────────────────────────────────────────────

export interface GithubFile {
  name: string;
  content: string;
}

// ─── Auth ──────────────────────────────────────────────────────────────────

function apiHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Helpers ───────────────────────────────────────────────────────────────

type GithubEntry = { name: string; path: string; type: string };
type GithubFileResponse = { content: string; encoding: string };

/**
 * Fetch all .md files from a locale subfolder in the GitHub repo.
 * Uses the Contents API — works for both public and private repos.
 */
async function fetchLocaleFilesFromGithub(
  repo: string,
  locale: string,
): Promise<GithubFile[]> {
  // Step 1: list files in the locale folder
  const listRes = await fetch(
    `https://api.github.com/repos/${repo}/contents/${locale}`,
    { headers: apiHeaders() },
  );

  if (listRes.status === 404) return []; // folder doesn't exist yet
  if (!listRes.ok) {
    throw new Error(`[github] List error ${listRes.status} for "${repo}/${locale}"`);
  }

  const entries = (await listRes.json()) as GithubEntry[];
  const mdFiles = entries.filter((e) => e.type === 'file' && e.name.endsWith('.md'));

  // Step 2: fetch each file's content (base64-encoded in the API response)
  const results = await Promise.all(
    mdFiles.map(async (file) => {
      const fileRes = await fetch(
        `https://api.github.com/repos/${repo}/contents/${file.path}`,
        { headers: apiHeaders() },
      );
      if (!fileRes.ok) return null;

      const data = (await fileRes.json()) as GithubFileResponse;
      if (data.encoding !== 'base64') return null;

      // GitHub wraps base64 in line breaks — strip them before decoding
      const content = Buffer.from(data.content.replace(/\n/g, ''), 'base64').toString('utf-8');
      return { name: file.name, content } satisfies GithubFile;
    }),
  );

  return results.filter((f): f is GithubFile => f !== null);
}

// ─── Cached public API ─────────────────────────────────────────────────────

/**
 * Cached wrapper around fetchLocaleFilesFromGithub.
 * Shared across requests, tagged with 'blog' for on-demand revalidation.
 * Returns [] immediately when env vars are not set (local dev without creds).
 */
export const getGithubPostFiles = unstable_cache(
  async (locale: string): Promise<GithubFile[]> => {
    if (!ALLOWED_LOCALES.has(locale)) {
      console.warn(`[github] Rejected unknown locale "${locale}".`);
      return [];
    }

    const repo = process.env.GITHUB_BLOG_REPO;
    if (!repo) return [];

    try {
      return await fetchLocaleFilesFromGithub(repo, locale);
    } catch (err) {
      console.error(`[github] Failed to fetch posts for locale "${locale}":`, err);
      return [];
    }
  },
  ['github-blog-posts'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['blog'],
  },
);

/** True when the GitHub integration is configured via environment variables. */
export function isGithubConfigured(): boolean {
  return Boolean(
    process.env.GITHUB_TOKEN &&
    process.env.GITHUB_BLOG_REPO,
  );
}
