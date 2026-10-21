import type { InlineKeyboard, ReplyMarkup } from './types';

const API = 'https://api.telegram.org';
const MAX_RETRY_WAIT_S = 5;

export class TelegramError extends Error {
  constructor(
    public readonly method: string,
    public readonly code: number,
    public readonly description: string,
    public readonly retryAfter?: number,
  ) {
    super(`telegram ${method} ${code}: ${description}`);
  }
}

interface ApiReply<T> {
  ok: boolean;
  result?: T;
  error_code?: number;
  description?: string;
  parameters?: { retry_after?: number };
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

function stripStyles(body: Record<string, unknown>): Record<string, unknown> {
  const markup = body.reply_markup as InlineKeyboard | undefined;
  if (!markup || !('inline_keyboard' in markup)) return body;
  return {
    ...body,
    reply_markup: {
      inline_keyboard: markup.inline_keyboard.map((row) =>
        row.map(({ style: _style, ...rest }) => rest),
      ),
    },
  };
}

async function post<T>(method: string, body: Record<string, unknown>): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('telegram not configured');
  const res = await fetch(`${API}/bot${token}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  let data: ApiReply<T>;
  try {
    data = (await res.json()) as ApiReply<T>;
  } catch {
    throw new TelegramError(method, res.status, 'non-JSON response');
  }
  if (!data.ok || data.result === undefined) {
    throw new TelegramError(
      method,
      data.error_code ?? res.status,
      data.description ?? 'unknown',
      data.parameters?.retry_after,
    );
  }
  return data.result;
}

/**
 * Calls a Bot API method. Honors a 429 retry_after once (when short), and retries a
 * 400 once without button `style` in case a client/server rejects it.
 */
export async function tgCall<T = true>(method: string, body: Record<string, unknown>): Promise<T> {
  try {
    return await post<T>(method, body);
  } catch (err) {
    if (err instanceof TelegramError) {
      if (err.code === 429 && err.retryAfter !== undefined && err.retryAfter <= MAX_RETRY_WAIT_S) {
        await sleep(err.retryAfter * 1000 + 100);
        return post<T>(method, body);
      }
      if (err.code === 400 && /style/i.test(err.description)) {
        return post<T>(method, stripStyles(body));
      }
    }
    throw err;
  }
}

export interface SendOptions {
  disable_notification?: boolean;
  reply_markup?: ReplyMarkup;
  reply_to_message_id?: number;
}

const NO_PREVIEW = { is_disabled: true };

export function sendHtml(chatId: number | string, text: string, opts: SendOptions = {}) {
  const { reply_to_message_id, ...rest } = opts;
  return tgCall<{ message_id: number }>('sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    link_preview_options: NO_PREVIEW,
    ...rest,
    ...(reply_to_message_id ? { reply_parameters: { message_id: reply_to_message_id } } : {}),
  });
}

/** Edits in place. "message is not modified" is treated as success. */
export async function editHtml(
  chatId: number | string,
  messageId: number,
  text: string,
  reply_markup?: InlineKeyboard,
): Promise<void> {
  try {
    await tgCall('editMessageText', {
      chat_id: chatId,
      message_id: messageId,
      text,
      parse_mode: 'HTML',
      link_preview_options: NO_PREVIEW,
      reply_markup,
    });
  } catch (err) {
    if (err instanceof TelegramError && /not modified/i.test(err.description)) return;
    throw err;
  }
}

export function answerCallback(id: string, text?: string, showAlert = false): Promise<unknown> {
  return tgCall('answerCallbackQuery', {
    callback_query_id: id,
    ...(text ? { text: text.slice(0, 200) } : {}),
    ...(showAlert ? { show_alert: true } : {}),
  });
}

export function deleteMessage(chatId: number, messageId: number): Promise<unknown> {
  return tgCall('deleteMessage', { chat_id: chatId, message_id: messageId });
}
