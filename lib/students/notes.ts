/* Student notes: messages from students (past and present) to the teacher.
   Every note reaches the teacher on Telegram and is kept in the "Student notes" tab of the leads sheet.
   A note the student allowed on the wall waits as "pending" until the teacher taps "Put on the wall". */
import { callSheet, callSheetRaw, guardCell, isSheetConfigured } from '../leads/sheet';
import { sendHtml } from '../telegram/api';
import { adminChatIds, isTelegramConfigured } from '../telegram/config';
import { cut, esc } from '../telegram/format';
import type { InlineKeyboard } from '../telegram/types';

export type NoteStatus = 'private' | 'pending' | 'shown' | 'hidden';

/** Who sent it: kept for spam control (cooldown, blocking) and shown only to the teacher, never on the wall. */
export interface NoteSender {
  deviceId: string;
  ip: string;
  uaKey: string;
  device: string; // "iPhone · iOS 18.1"
  browser: string; // "Zalo app"
  place: string; // "Ho Chi Minh City, VN"
  lang?: string;
  tz?: string;
  screen?: string;
  referrer?: string;
}

export interface StudentNote {
  id: string;
  createdAt: string;
  status: NoteStatus;
  name: string;
  studied?: string;
  message: string;
  locale: string;
  sender?: NoteSender;
}

/** What the wall shows: never the status or anything the student did not write. */
export interface WallNote {
  id: string;
  createdAt: string;
  name: string;
  studied?: string;
  message: string;
}

const str = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
const unguard = (t: string): string => (/^'[=+\-@\t\r]/.test(t) ? t.slice(1) : t);

/** Hours between two notes from the same device (NOTES_COOLDOWN_HOURS, default 6). */
export const COOLDOWN_HOURS = Math.max(0, Number(process.env.NOTES_COOLDOWN_HOURS ?? 6) || 0);

/* ── Telegram ─────────────────────────────────────────────────────────── */

export const WALL_CB = { show: 'w', hide: 'x' } as const;

export function noteKeyboard(id: string, forWall: boolean): InlineKeyboard {
  const block = { text: '🚫 Block this device', callback_data: `k:${id}`, style: 'danger' as const };
  return {
    inline_keyboard: forWall
      ? [
          [
            { text: '📌 Put on the wall', callback_data: `w:${id}:${WALL_CB.show}`, style: 'success' },
            { text: '🔒 Keep private', callback_data: `w:${id}:${WALL_CB.hide}` },
          ],
          [block],
        ]
      : [[block]],
  };
}

const ordinal = (n: number): string => {
  const s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export function noteText(n: StudentNote, previous = 0): string {
  const head = n.status === 'private' ? '✉️ <b>Note from a student</b> (just for you)' : '✉️ <b>Note from a student</b> (may go on the wall)';
  const lines = [
    head,
    '',
    `<b>${esc(cut(n.name, 80))}</b>${n.studied ? ` · ${esc(cut(n.studied, 80))}` : ''}`,
    '',
    esc(cut(n.message, 3000)),
  ];
  const w = n.sender;
  if (w) {
    lines.push(
      '',
      '<b>Sender</b>',
      `📱 ${esc(w.device)} · ${esc(w.browser)}`,
      `📍 ${esc(w.place || 'unknown place')} · IP <code>${esc(w.ip || '?')}</code>`,
      `🆔 device <code>${esc(w.deviceId.slice(0, 8))}</code> · ${ordinal(previous + 1)} note from this device`,
      `🌐 ${esc([w.lang, w.tz, w.screen].filter(Boolean).join(' · ') || 'no browser details')}`,
    );
    if (w.referrer) lines.push(`↩️ came from ${esc(cut(w.referrer, 120))}`);
  }
  return lines.join('\n');
}

async function notifyNote(n: StudentNote, previous: number): Promise<void> {
  const markup = noteKeyboard(n.id, n.status === 'pending');
  const results = await Promise.allSettled(
    adminChatIds().map((chatId) => sendHtml(chatId, noteText(n, previous), { reply_markup: markup, disable_notification: false })),
  );
  if (!results.some((r) => r.status === 'fulfilled')) throw new Error('telegram send failed');
}

/* ── Sheet + limits ───────────────────────────────────────────────────── */

export type SubmitResult =
  | { ok: true }
  | { ok: false; code: 'COOLDOWN'; retryAt: string }
  | { ok: false; code: 'BLOCKED' }
  | { ok: false; code: 'DELIVERY_FAILED' };

/* Fallback when the sheet is not reachable: per-instance memory (resets on a cold start, better than nothing). */
const recent = new Map<string, number>();
function memoryCooldown(n: StudentNote): string | null {
  const now = Date.now(),
    win = COOLDOWN_HOURS * 3600_000;
  for (const [k, t] of recent) if (now - t > win) recent.delete(k);
  const keys = [n.sender?.deviceId, n.sender ? `${n.sender.ip}|${n.sender.uaKey}` : ''].filter(Boolean) as string[];
  const last = Math.max(0, ...keys.map((k) => recent.get(k) ?? 0));
  if (win > 0 && last && now - last < win) return new Date(last + win).toISOString();
  keys.forEach((k) => recent.set(k, now));
  return null;
}

/**
 * The sheet decides first (cooldown and block list, under the script lock, so it holds across every server),
 * then the teacher is told. A refused note never reaches Telegram.
 */
export async function submitNote(n: StudentNote): Promise<SubmitResult> {
  let previous = 0;
  let stored = false;
  if (isSheetConfigured()) {
    try {
      const s = n.sender;
      const reply = await callSheetRaw('noteAppend', {
        cooldownHours: COOLDOWN_HOURS,
        note: {
          id: n.id,
          createdAt: n.createdAt,
          status: n.status,
          locale: n.locale,
          name: guardCell(n.name),
          studied: n.studied ? guardCell(n.studied) : '',
          message: guardCell(n.message),
          deviceId: s?.deviceId ?? '',
          ip: s?.ip ?? '',
          uaKey: s?.uaKey ?? '',
          device: s ? guardCell(s.device) : '',
          browser: s ? guardCell(s.browser) : '',
          place: s ? guardCell(s.place) : '',
          details: s ? guardCell(JSON.stringify({ lang: s.lang, tz: s.tz, screen: s.screen, referrer: s.referrer })) : '',
        },
      });
      if (!reply.ok && reply.error === 'cooldown') return { ok: false, code: 'COOLDOWN', retryAt: str(reply.retryAt) };
      if (!reply.ok && reply.error === 'blocked') return { ok: false, code: 'BLOCKED' };
      if (!reply.ok) throw new Error(`sheet error: ${str(reply.error)}`);
      previous = Number(reply.previous) || 0;
      stored = true;
    } catch (err) {
      console.error('[notes] sheet:', err instanceof Error ? err.message : 'unknown');
    }
  }
  if (!stored) {
    const retryAt = memoryCooldown(n);
    if (retryAt) return { ok: false, code: 'COOLDOWN', retryAt };
  }
  if (!isTelegramConfigured()) return stored ? { ok: true } : { ok: false, code: 'DELIVERY_FAILED' };
  try {
    await notifyNote(n, previous);
    return { ok: true };
  } catch (err) {
    console.error('[notes] telegram:', err instanceof Error ? err.message : 'unknown');
    return stored ? { ok: true } : { ok: false, code: 'DELIVERY_FAILED' };
  }
}

/** Blocks the device that sent a note (from Telegram) and takes the note off the wall. */
export async function blockNoteDevice(id: string): Promise<boolean> {
  const data = await callSheet('noteBlock', { id, at: new Date().toISOString() });
  return Boolean(data.note);
}

/** Teacher's decision from Telegram. Returns the note as stored. */
export async function setNoteStatus(id: string, status: 'shown' | 'hidden'): Promise<StudentNote | null> {
  const data = await callSheet('noteSet', { id, status, at: new Date().toISOString() });
  const raw = data.note as Record<string, unknown> | undefined;
  if (!raw) return null;
  return {
    id: str(raw.id),
    createdAt: str(raw.createdAt),
    status,
    name: unguard(str(raw.name)),
    studied: unguard(str(raw.studied)) || undefined,
    message: unguard(str(raw.message)),
    locale: str(raw.locale),
  };
}

/** Approved notes for the wall, newest first. Empty when the sheet is not configured or unreachable. */
export async function wallNotes(limit = 60): Promise<WallNote[]> {
  if (!isSheetConfigured()) return [];
  try {
    const data = await callSheet('notesShown', { limit });
    const list = Array.isArray(data.notes) ? (data.notes as Record<string, unknown>[]) : [];
    return list
      .map((r) => ({
        id: str(r.id),
        createdAt: str(r.createdAt),
        name: unguard(str(r.name)),
        studied: unguard(str(r.studied)) || undefined,
        message: unguard(str(r.message)),
      }))
      .filter((n) => n.id && n.message);
  } catch (err) {
    console.error('[notes] wall:', err instanceof Error ? err.message : 'unknown');
    return [];
  }
}
