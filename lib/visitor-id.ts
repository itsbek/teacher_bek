/**
 * Stable visitor ID — persists in localStorage across sessions on the same browser.
 *
 * This is NOT a tracking cookie. It is used solely for:
 *   - Identifying mischievous/repeated submissions so Teacher Bek can spot patterns
 *   - Per-device rate limiting on community form submissions
 *
 * The ID is included in the notification email sent to the teacher.
 * It is never stored server-side, never shared with third parties.
 */

const STORAGE_KEY = 'tbk_vid';

/**
 * Returns the visitor's stable ID.
 * Creates and stores one on first call.
 * Falls back to a one-time random ID if localStorage is unavailable (private browsing, etc.).
 */
export function getVisitorId(): string {
  if (typeof window === 'undefined') return '';

  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id || !isValidUuid(id)) {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    // localStorage blocked (strict privacy mode) — generate a session-only ID
    return crypto.randomUUID();
  }
}

function isValidUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}
