/* Student notes: messages from students (past and present) to the teacher.
   Every note reaches the teacher on Telegram and is kept in the "Student notes" tab of the leads sheet.
   A note the student allowed on the wall waits as "pending" until the teacher taps "Put on the wall". */
import { callSheet, guardCell, isSheetConfigured } from '../leads/sheet';
import { sendHtml } from '../telegram/api';
import { adminChatIds, isTelegramConfigured } from '../telegram/config';
import { cut, esc } from '../telegram/format';
import type { InlineKeyboard } from '../telegram/types';

export type NoteStatus = 'private' | 'pending' | 'shown' | 'hidden';

export interface StudentNote {
  id: string;
  createdAt: string;
  status: NoteStatus;
  name: string;
  studied?: string;
  message: string;
  locale: string;
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

/* ── Telegram ─────────────────────────────────────────────────────────── */

export const WALL_CB = { show: 'w', hide: 'x' } as const;

export function noteKeyboard(id: string): InlineKeyboard {
  return {
    inline_keyboard: [
      [
        { text: '📌 Put on the wall', callback_data: `w:${id}:${WALL_CB.show}`, style: 'success' },
        { text: '🔒 Keep private', callback_data: `w:${id}:${WALL_CB.hide}` },
      ],
    ],
  };
}

export function noteText(n: Pick<StudentNote, 'name' | 'studied' | 'message' | 'status'>, decided?: 'shown' | 'hidden'): string {
  const head = n.status === 'private' ? '✉️ <b>Note from a student</b> (just for you)' : '✉️ <b>Note from a student</b> (may go on the wall)';
  const lines = [
    head,
    '',
    `<b>${esc(cut(n.name, 80))}</b>${n.studied ? ` · ${esc(cut(n.studied, 80))}` : ''}`,
    '',
    esc(cut(n.message, 3000)),
  ];
  if (decided === 'shown') lines.push('', '📌 <i>On the wall now.</i>');
  if (decided === 'hidden') lines.push('', '🔒 <i>Kept private.</i>');
  return lines.join('\n');
}

async function notifyNote(n: StudentNote): Promise<void> {
  const markup = n.status === 'pending' ? noteKeyboard(n.id) : undefined;
  const results = await Promise.allSettled(
    adminChatIds().map((chatId) => sendHtml(chatId, noteText(n), { reply_markup: markup, disable_notification: false })),
  );
  if (!results.some((r) => r.status === 'fulfilled')) throw new Error('telegram send failed');
}

/* ── Sheet ────────────────────────────────────────────────────────────── */

async function storeNote(n: StudentNote): Promise<void> {
  await callSheet('noteAppend', {
    note: {
      ...n,
      name: guardCell(n.name),
      studied: n.studied ? guardCell(n.studied) : '',
      message: guardCell(n.message),
    },
  });
}

/** Saves and notifies in parallel; succeeds when at least one configured channel worked. */
export async function submitNote(n: StudentNote): Promise<boolean> {
  const [sheet, tg] = await Promise.allSettled([
    isSheetConfigured() ? storeNote(n) : Promise.reject(new Error('sheet off')),
    isTelegramConfigured() ? notifyNote(n) : Promise.reject(new Error('telegram off')),
  ]);
  if (sheet.status === 'rejected') console.error('[notes] sheet:', sheet.reason instanceof Error ? sheet.reason.message : 'unknown');
  if (tg.status === 'rejected') console.error('[notes] telegram:', tg.reason instanceof Error ? tg.reason.message : 'unknown');
  return sheet.status === 'fulfilled' || tg.status === 'fulfilled';
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
