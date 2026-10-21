import type { ChannelOutcome, Lead, SubmitResult } from './types';
import { appendLeadToSheet, isSheetConfigured } from './sheet';
import { isEmailConfigured, sendLeadEmail } from './email';
import { isTelegramConfigured, notifyTelegram } from './telegram';

async function run(
  id: string,
  name: string,
  configured: boolean,
  fn: () => Promise<void>,
): Promise<ChannelOutcome> {
  if (!configured) return 'skipped';
  try {
    await fn();
    console.warn(`[leads] ${id} ${name}: ok`);
    return 'ok';
  } catch (err) {
    console.error(`[leads] ${id} ${name}: failed -`, err instanceof Error ? err.message : 'unknown');
    return 'failed';
  }
}

/**
 * Saves the lead to the Google Sheet, then notifies by email and Telegram in parallel.
 * Succeeds when at least one configured channel succeeded.
 */
export async function submitLead(lead: Lead): Promise<SubmitResult> {
  const sheet = await run(lead.id, 'sheet', isSheetConfigured(), () => appendLeadToSheet(lead));
  const [email, telegram] = await Promise.all([
    run(lead.id, 'email', isEmailConfigured(), () => sendLeadEmail(lead)),
    run(lead.id, 'telegram', isTelegramConfigured(), () => notifyTelegram(lead)),
  ]);
  const ok = [sheet, email, telegram].includes('ok');
  if (!ok) console.error(`[leads] ${lead.id} NO channel succeeded`, { sheet, email, telegram });
  return { ok, channels: { sheet, email, telegram } };
}
