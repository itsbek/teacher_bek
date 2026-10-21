import type { Lead } from '../leads/types';
import { sendHtml } from './api';
import { adminChatIds } from './config';
import { cardView } from './views';

/** Sends the "🔔 New lead" card (with notification sound) to every admin chat. */
export async function notifyTelegram(lead: Lead): Promise<void> {
  const view = cardView({ ...lead, notes: [], history: [] }, { kind: 'status', status: 'all' }, 1, true);
  const results = await Promise.allSettled(
    adminChatIds().map((chatId) =>
      sendHtml(chatId, view.text, { reply_markup: view.reply_markup, disable_notification: false }),
    ),
  );
  if (!results.some((r) => r.status === 'fulfilled')) {
    const first = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    throw first?.reason instanceof Error ? first.reason : new Error('telegram send failed');
  }
}
