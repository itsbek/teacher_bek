import type { Lead, LeadStatus } from './types';
import { isLeadStatus } from './types';

const API = 'https://api.telegram.org';

export function isTelegramConfigured(): boolean {
  return Boolean(process.env.TELEGRAM_BOT_TOKEN && adminChatIds().length > 0);
}

export function adminChatIds(): string[] {
  return (process.env.TELEGRAM_ADMIN_CHAT_IDS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export interface InlineButton {
  text: string;
  url?: string;
  callback_data?: string;
}
export type InlineKeyboard = { inline_keyboard: InlineButton[][] };

export async function tgCall(method: string, body: Record<string, unknown>): Promise<unknown> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('telegram not configured');
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`telegram ${method} HTTP ${res.status}`);
  return res.json();
}

export const STATUS_LABEL: Record<LeadStatus, string> = {
  new: '🆕 New',
  contacted: '📞 Contacted',
  trial: '📅 Trial booked',
  enrolled: '✅ Enrolled',
  lost: '❌ Lost',
};

const CODE_TO_STATUS: Record<string, LeadStatus> = {
  c: 'contacted',
  t: 'trial',
  e: 'enrolled',
  l: 'lost',
};
export function parseCallbackData(data: string): { id: string; status: LeadStatus } | null {
  const [prefix, code, id] = data.split(':');
  if (prefix !== 's' || !id) return null;
  const status = CODE_TO_STATUS[code];
  return status && isLeadStatus(status) ? { id, status } : null;
}

/** Vietnamese numbers typed as 0xxxxxxxxx become 84xxxxxxxxx for Zalo. */
export function zaloDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `84${digits.slice(1)}` : digits;
}

export function leadKeyboard(lead: Pick<Lead, 'id' | 'phone'>): InlineKeyboard {
  const digits = zaloDigits(lead.phone);
  const rows: InlineButton[][] = [];
  if (digits.length >= 8) rows.push([{ text: '💬 Zalo', url: `https://zalo.me/${digits}` }]);
  rows.push([
    { text: 'Contacted', callback_data: `s:c:${lead.id}` },
    { text: 'Trial booked', callback_data: `s:t:${lead.id}` },
  ]);
  rows.push([
    { text: 'Enrolled', callback_data: `s:e:${lead.id}` },
    { text: 'Lost', callback_data: `s:l:${lead.id}` },
  ]);
  return { inline_keyboard: rows };
}

/** Plain text (no parse mode, so user input can never break formatting). Line 1 is always the status. */
export function formatLeadMessage(lead: Lead, status: LeadStatus = lead.status): string {
  const lines = [
    `Status: ${STATUS_LABEL[status]}`,
    `🔔 New ${lead.source === 'pricing' ? 'pricing request' : 'inquiry'}`,
    '',
    `Name: ${lead.name}`,
    // Telegram turns phone numbers into tap-to-call links automatically.
    `Phone: ${lead.phone}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.program) lines.push(`Program: ${lead.program}`);
  if (lead.forWhom) lines.push(`For: ${lead.forWhom}`);
  if (lead.level) lines.push(`Level: ${lead.level}`);
  if (lead.goal) lines.push(`Goal: ${lead.goal}`);
  lines.push(`Language: ${lead.locale}`, `Source: ${lead.source}`);
  if (lead.message) lines.push('', `Message: ${lead.message}`);
  lines.push('', `ID: ${lead.id}`);
  return lines.join('\n').slice(0, 4000);
}

export function withStatusLine(text: string, status: LeadStatus): string {
  const rest = text.startsWith('Status: ') ? text.slice(text.indexOf('\n')) : `\n${text}`;
  return `Status: ${STATUS_LABEL[status]}${rest}`;
}

export async function notifyTelegram(lead: Lead): Promise<void> {
  const text = formatLeadMessage(lead);
  const reply_markup = leadKeyboard(lead);
  const results = await Promise.allSettled(
    adminChatIds().map((chat_id) =>
      tgCall('sendMessage', { chat_id, text, reply_markup, disable_web_page_preview: true }),
    ),
  );
  if (!results.some((r) => r.status === 'fulfilled')) {
    const first = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
    throw first?.reason instanceof Error ? first.reason : new Error('telegram send failed');
  }
}
