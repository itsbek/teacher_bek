import { NextResponse, type NextRequest } from 'next/server';
import { getStats, isSheetConfigured, listLeads, updateLeadStatus } from '@/lib/leads/sheet';
import {
  STATUS_LABEL,
  adminChatIds,
  parseCallbackData,
  tgCall,
  leadKeyboard,
  withStatusLine,
} from '@/lib/leads/telegram';

interface TgChat { id: number }
interface TgMessage { message_id: number; chat: TgChat; text?: string }
interface TgCallback { id: string; data?: string; message?: TgMessage }
interface TgUpdate { message?: TgMessage; callback_query?: TgCallback }

const HELP = [
  'Teacher Bek lead bot',
  '',
  '/leads - last 10 open leads (new / contacted)',
  '/stats - lead counts by status this month',
  '/help - this message',
  '',
  'New leads arrive here automatically. Tap a status button under a lead to update the Google Sheet.',
].join('\n');

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function reply(chatId: number, text: string): Promise<void> {
  await tgCall('sendMessage', { chat_id: chatId, text, disable_web_page_preview: true });
}

async function handleCommand(chatId: number, text: string): Promise<void> {
  const cmd = text.trim().split(/[\s@]/)[0].toLowerCase();
  if (cmd === '/start' || cmd === '/help') return reply(chatId, HELP);
  if (cmd !== '/leads' && cmd !== '/stats') return reply(chatId, HELP);
  if (!isSheetConfigured()) return reply(chatId, 'The Google Sheet is not connected yet, so there is no data to show.');

  if (cmd === '/leads') {
    const rows = (await listLeads(10)).slice(0, 10);
    if (rows.length === 0) return reply(chatId, 'No open leads. 🎉');
    const lines = rows.map((r, i) => {
      const status = STATUS_LABEL[r.status as keyof typeof STATUS_LABEL] ?? r.status;
      return `${i + 1}. ${r.name} - ${r.phone}\n   ${status}${r.program ? ` - ${r.program}` : ''} - ${r.createdAt.slice(0, 10)}`;
    });
    return reply(chatId, lines.join('\n'));
  }

  const stats = await getStats();
  const lines = [`Leads in ${stats.month}: ${stats.total}`];
  for (const key of ['new', 'contacted', 'trial', 'enrolled', 'lost'] as const) {
    lines.push(`${STATUS_LABEL[key]}: ${stats.counts[key] ?? 0}`);
  }
  return reply(chatId, lines.join('\n'));
}

async function handleCallback(cb: TgCallback): Promise<void> {
  const parsed = cb.data ? parseCallbackData(cb.data) : null;
  if (!parsed || !cb.message) {
    await tgCall('answerCallbackQuery', { callback_query_id: cb.id });
    return;
  }
  try {
    await updateLeadStatus(parsed.id, parsed.status);
  } catch (err) {
    console.error('[telegram] status update failed:', err instanceof Error ? err.message : 'unknown');
    await tgCall('answerCallbackQuery', {
      callback_query_id: cb.id,
      text: 'Could not update the sheet. Try again.',
      show_alert: true,
    });
    return;
  }
  const phoneLine = cb.message.text?.match(/^Phone: (.*)$/m)?.[1] ?? '';
  try {
    await tgCall('editMessageText', {
      chat_id: cb.message.chat.id,
      message_id: cb.message.message_id,
      text: withStatusLine(cb.message.text ?? '', parsed.status),
      reply_markup: leadKeyboard({ id: parsed.id, phone: phoneLine }),
      disable_web_page_preview: true,
    });
  } catch {
    // "message is not modified" when the same status is tapped twice - harmless.
  }
  await tgCall('answerCallbackQuery', {
    callback_query_id: cb.id,
    text: STATUS_LABEL[parsed.status],
  });
}

export async function POST(request: NextRequest) {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET;
  const given = request.headers.get('x-telegram-bot-api-secret-token') ?? '';
  if (!expected || !constantTimeEqual(given, expected)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  let update: TgUpdate;
  try {
    update = (await request.json()) as TgUpdate;
  } catch {
    return NextResponse.json({ ok: true });
  }

  const chatId = update.message?.chat.id ?? update.callback_query?.message?.chat.id;
  if (chatId === undefined || !adminChatIds().includes(String(chatId))) {
    // Silently ignore anyone who is not the owner.
    return NextResponse.json({ ok: true });
  }

  try {
    if (update.callback_query) await handleCallback(update.callback_query);
    else if (update.message?.text?.startsWith('/')) await handleCommand(chatId, update.message.text);
  } catch (err) {
    console.error('[telegram] handler error:', err instanceof Error ? err.message : 'unknown');
  }
  // Always 200 so Telegram does not retry.
  return NextResponse.json({ ok: true });
}
