/**
 * Google Drive blog source.
 *
 * Folder layout expected in Drive (share the root folder with the service account):
 *
 *   teacher-blog/          ← GOOGLE_DRIVE_BLOG_FOLDER_ID
 *     en/                  ← one subfolder per locale
 *       slug-one.md
 *       slug-two.md
 *     vi/
 *       slug-one.md
 *
 * Each .md file contains standard frontmatter + markdown body.
 * Google Docs (.gdoc) are also supported — they are exported as plain text.
 *
 * Set these environment variables to enable Drive mode:
 *   GOOGLE_DRIVE_CLIENT_EMAIL
 *   GOOGLE_DRIVE_PRIVATE_KEY
 *   GOOGLE_DRIVE_BLOG_FOLDER_ID
 */

import { google } from 'googleapis';
import { unstable_cache } from 'next/cache';

// ─── Constants ─────────────────────────────────────────────────────────────

/** Locales accepted by the routing config. Used to validate before building Drive queries. */
const ALLOWED_LOCALES = new Set(['en', 'vi', 'zh', 'ru']);

// ─── Auth ──────────────────────────────────────────────────────────────────

function getDriveClient() {
  const email = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const key   = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!email || !key) return null;

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, '\n'), // Render escaped newlines from env vars
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });

  return google.drive({ version: 'v3', auth });
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface DriveFile {
  id: string;
  name: string;
  content: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

/**
 * Find the Drive folder ID for a given locale subfolder name.
 * Returns null if the subfolder doesn't exist.
 */
async function getLocaleFolderId(
  parentId: string,
  locale: string,
): Promise<string | null> {
  const drive = getDriveClient();
  if (!drive) return null;

  const res = await drive.files.list({
    q: `'${parentId}' in parents and name = '${locale}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
    fields: 'files(id, name)',
    pageSize: 1,
  });

  return res.data.files?.[0]?.id ?? null;
}

/**
 * Download a single file's text content from Drive.
 * Handles both .md files (media download) and Google Docs (text/plain export).
 */
async function downloadFileContent(fileId: string, mimeType: string): Promise<string> {
  const drive = getDriveClient();
  if (!drive) return '';

  if (mimeType === 'application/vnd.google-apps.document') {
    // Export Google Doc as plain text
    const res = await drive.files.export(
      { fileId, mimeType: 'text/plain' },
      { responseType: 'text' },
    );
    return String(res.data);
  }

  // Download .md or any text file directly
  const res = await drive.files.get(
    { fileId, alt: 'media' },
    { responseType: 'text' },
  );
  return String(res.data);
}

/**
 * Fetch all markdown files from the locale subfolder of the blog Drive folder.
 * Returns raw { id, name, content } objects — parsing happens in blog.ts.
 */
async function fetchLocaleFilesFromDrive(
  parentFolderId: string,
  locale: string,
): Promise<DriveFile[]> {
  const drive = getDriveClient();
  if (!drive) return [];

  const folderId = await getLocaleFolderId(parentFolderId, locale);
  if (!folderId) return [];

  // List .md files and Google Docs in the locale folder
  const res = await drive.files.list({
    q: [
      `'${folderId}' in parents`,
      `trashed = false`,
      `(mimeType = 'text/plain' or mimeType = 'application/vnd.google-apps.document')`,
    ].join(' and '),
    fields: 'files(id, name, mimeType)',
    pageSize: 100,
    orderBy: 'name',
  });

  const files = res.data.files ?? [];

  const results = await Promise.all(
    files.map(async (file) => {
      if (!file.id || !file.name || !file.mimeType) return null;
      const content = await downloadFileContent(file.id, file.mimeType);
      return { id: file.id, name: file.name, content } satisfies DriveFile;
    }),
  );

  return results.filter((f): f is DriveFile => f !== null);
}

// ─── Cached public API ─────────────────────────────────────────────────────

const REVALIDATE_SECONDS = Number(process.env.BLOG_CACHE_REVALIDATE_SECONDS ?? 3600);

/**
 * Cached wrapper around fetchLocaleFilesFromDrive.
 * Cache is shared across requests and tagged with 'blog' for on-demand revalidation.
 * In development mode (no Drive creds) this returns [] immediately.
 */
export const getDrivePostFiles = unstable_cache(
  async (locale: string): Promise<DriveFile[]> => {
    // Validate locale before it can reach any Drive query string.
    if (!ALLOWED_LOCALES.has(locale)) {
      console.warn(`[drive] Rejected unknown locale "${locale}".`);
      return [];
    }

    const rootFolderId = process.env.GOOGLE_DRIVE_BLOG_FOLDER_ID;
    if (!rootFolderId) return [];

    try {
      return await fetchLocaleFilesFromDrive(rootFolderId, locale);
    } catch (err) {
      console.error(`[drive] Failed to fetch blog posts for locale "${locale}":`, err);
      return [];
    }
  },
  ['drive-blog-posts'],
  {
    revalidate: REVALIDATE_SECONDS,
    tags: ['blog'],
  },
);

/** True when the Drive integration is configured via environment variables. */
export function isDriveConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_DRIVE_CLIENT_EMAIL &&
    process.env.GOOGLE_DRIVE_PRIVATE_KEY &&
    process.env.GOOGLE_DRIVE_BLOG_FOLDER_ID,
  );
}
