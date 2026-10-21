import { TelegramError, answerCallback, sendHtml } from './api';
import { isAdminId, isTelegramConfigured } from './config';
import { handleCallback, handleMessage } from './handlers';
import { parseCallback } from './keyboards';
import { strings } from './strings';
import type { TgUpdate } from './types';

function logError(where: string, err: unknown): void {
  // Never log message bodies or tokens, only the error text.
  console.error(`[telegram] ${where}:`, err instanceof Error ? err.message : 'unknown');
}

async function safely(where: string, fn: () => Promise<unknown>): Promise<void> {
  try {
    await fn();
  } catch (err) {
    logError(where, err);
  }
}

/**
 * Routes one update. Checks admin on every update and never throws:
 * failures are logged and, where possible, reported to the admin.
 */
export async function handleUpdate(update: TgUpdate): Promise<void> {
  if (!isTelegramConfigured()) return;

  const cbq = update.callback_query;
  if (cbq) {
    const chatId = cbq.message?.chat.id;
    const admin = isAdminId(cbq.from.id) && (chatId === undefined || isAdminId(chatId));
    if (!admin) return safely('callback refusal', () => answerCallback(cbq.id, strings.refusal, true));
    const parsed = parseCallback(cbq.data);
    if (!parsed) return safely('callback parse', () => answerCallback(cbq.id, strings.toastBad));
    try {
      await handleCallback(cbq, parsed);
    } catch (err) {
      logError('callback', err);
      await safely('callback error toast', () => answerCallback(cbq.id, strings.sheetError, true));
    }
    return;
  }

  const msg = update.message;
  if (!msg) return;
  const admin = isAdminId(msg.chat.id) && msg.chat.type === 'private' && isAdminId(msg.from?.id);
  if (!admin) return safely('refusal', () => sendHtml(msg.chat.id, strings.refusal));
  try {
    await handleMessage(msg);
  } catch (err) {
    logError('message', err);
    if (!(err instanceof TelegramError)) {
      await safely('error notice', () => sendHtml(msg.chat.id, strings.sheetError));
    }
  }
}
