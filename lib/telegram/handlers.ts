import { addLeadNote, getLead, isSheetConfigured, updateLeadStatus } from '../leads/sheet';
import { TelegramError, answerCallback, deleteMessage, editHtml, sendHtml } from './api';
import { esc, cut } from './format';
import {
  fitQuery,
  mainKeyboard,
  type Callback,
  type ListScope,
} from './keyboards';
import { strings } from './strings';
import type { TgCallbackQuery, TgMessage, View } from './types';
import { cardView, leadCardView, listView, statsView } from './views';

const ALL: ListScope = { kind: 'status', status: 'all' };
const NEW: ListScope = { kind: 'status', status: 'new' };

/** Edits the message in place; if Telegram refuses (message gone/too old) sends a fresh one. */
async function present(chatId: number, messageId: number | undefined, view: View): Promise<void> {
  if (messageId !== undefined) {
    try {
      await editHtml(chatId, messageId, view.text, view.reply_markup);
      return;
    } catch (err) {
      if (!(err instanceof TelegramError) || err.code !== 400) throw err;
    }
  }
  await sendHtml(chatId, view.text, { reply_markup: view.reply_markup });
}

async function sheetGuard(chatId: number): Promise<boolean> {
  if (isSheetConfigured()) return true;
  await sendHtml(chatId, strings.sheetOff);
  return false;
}

/* --------------------------------------------------------------- commands */

export async function showStart(chatId: number): Promise<void> {
  await sendHtml(chatId, strings.welcome, { reply_markup: mainKeyboard() });
}

export async function showHelp(chatId: number): Promise<void> {
  await sendHtml(chatId, strings.help, { reply_markup: mainKeyboard() });
}

export async function showList(chatId: number, scope: ListScope): Promise<void> {
  if (!(await sheetGuard(chatId))) return;
  await present(chatId, undefined, await listView(scope, 1));
}

export async function showStats(chatId: number): Promise<void> {
  if (!(await sheetGuard(chatId))) return;
  await present(chatId, undefined, await statsView('t'));
}

export async function askSearch(chatId: number): Promise<void> {
  await sendHtml(chatId, strings.searchPrompt, {
    reply_markup: { force_reply: true, input_field_placeholder: strings.searchPlaceholder },
  });
}

export async function runSearch(chatId: number, raw: string): Promise<void> {
  const query = fitQuery(raw);
  if (!query) return askSearch(chatId);
  if (!(await sheetGuard(chatId))) return;
  await present(chatId, undefined, await listView({ kind: 'search', query }, 1));
}

type Command = (chatId: number, args: string) => Promise<void>;

export const COMMANDS: Record<string, Command> = {
  start: (c) => showStart(c),
  help: (c) => showHelp(c),
  new: (c) => showList(c, NEW),
  leads: (c) => showList(c, ALL),
  today: (c) => showList(c, { kind: 'today' }),
  stats: (c) => showStats(c),
  search: (c, args) => (args ? runSearch(c, args) : askSearch(c)),
};

const MENU: Record<string, string> = {
  [strings.menu.new]: 'new',
  [strings.menu.leads]: 'leads',
  [strings.menu.stats]: 'stats',
  [strings.menu.search]: 'search',
  [strings.menu.help]: 'help',
};

/** "/Leads@MyBot foo" -> { name: "leads", args: "foo" }. */
export function parseCommand(text: string): { name: string; args: string } | null {
  const m = /^\/([A-Za-z0-9_]+)(?:@\w+)?(?:\s+([\s\S]*))?$/.exec(text.trim());
  return m ? { name: m[1].toLowerCase(), args: (m[2] ?? '').trim() } : null;
}

/* ------------------------------------------------------------------ notes */

const REF_RE = /ref (\S+) (\d+) (\S+)/;

function notePromptText(name: string, id: string, cardMessageId: number, ctxToken: string): string {
  return `${strings.notePrompt(esc(cut(name, 60)))}\n\n<i>ref ${esc(id)} ${cardMessageId} ${ctxToken}</i>`;
}

async function askNote(cb: TgCallbackQuery, chatId: number, id: string, scope: ListScope, page: number): Promise<void> {
  const lead = await getLead(id);
  if (!lead) return void (await answerCallback(cb.id, strings.leadMissing, true));
  await answerCallback(cb.id, strings.toastNote);
  const token = `${scope.kind === 'status' ? (scope.status === 'all' ? 'a' : scope.status[0]) : scope.kind === 'today' ? 'd' : 'a'}${page}`;
  await sendHtml(chatId, notePromptText(lead.name, id, cb.message?.message_id ?? 0, token), {
    reply_markup: { force_reply: true, input_field_placeholder: strings.notePlaceholder },
  });
}

function scopeFromToken(token: string): { scope: ListScope; page: number } {
  const page = Math.max(1, Number(token.slice(1)) || 1);
  const code = token[0];
  if (code === 'd') return { scope: { kind: 'today' }, page };
  const map: Record<string, ListScope> = {
    n: NEW,
    c: { kind: 'status', status: 'contacted' },
    t: { kind: 'status', status: 'trial' },
    e: { kind: 'status', status: 'enrolled' },
    l: { kind: 'status', status: 'lost' },
  };
  return { scope: map[code] ?? ALL, page };
}

/** Handles a reply to a note prompt. Returns false when the reply is not a note reply. */
export async function handleNoteReply(msg: TgMessage, prompt: TgMessage): Promise<boolean> {
  const ref = REF_RE.exec(prompt.text ?? '');
  if (!ref || !(prompt.text ?? '').startsWith('📝')) return false;
  const chatId = msg.chat.id;
  const text = (msg.text ?? '').trim();
  if (!text) {
    await sendHtml(chatId, strings.noteEmpty);
    return true;
  }
  if (!(await sheetGuard(chatId))) return true;
  const [, id, cardId, token] = ref;
  const lead = await addLeadNote(id, cut(text, 1000));
  const { scope, page } = scopeFromToken(token);
  const view = cardView(lead, scope, page);
  const messageId = Number(cardId);
  await Promise.allSettled([
    messageId > 0 ? editHtml(chatId, messageId, view.text, view.reply_markup) : sendHtml(chatId, view.text, { reply_markup: view.reply_markup }),
    deleteMessage(chatId, prompt.message_id),
  ]);
  await sendHtml(chatId, strings.noteSaved(esc(cut(lead.name, 60))), { reply_to_message_id: msg.message_id });
  return true;
}

/* ------------------------------------------------------------------ messages */

export async function handleMessage(msg: TgMessage): Promise<void> {
  const chatId = msg.chat.id;
  const text = (msg.text ?? '').trim();
  if (!text) return;

  const prompt = msg.reply_to_message;
  if (prompt?.from?.is_bot && prompt.text && !parseCommand(text)) {
    if (prompt.text === strings.searchPrompt) return runSearch(chatId, text);
    if (await handleNoteReply(msg, prompt)) return;
  }

  const cmd = parseCommand(text);
  const name = cmd?.name ?? MENU[text];
  const run = name ? COMMANDS[name] : undefined;
  if (run) return run(chatId, cmd?.args ?? '');
  await showHelp(chatId);
}

/* ----------------------------------------------------------------- callbacks */

export async function handleCallback(cb: TgCallbackQuery, parsed: Callback): Promise<void> {
  const chat = cb.message?.chat.id;
  const messageId = cb.message?.message_id;
  if (parsed.t === 'noop') return void (await answerCallback(cb.id));
  if (chat === undefined) return void (await answerCallback(cb.id, strings.toastBad, true));

  switch (parsed.t) {
    case 'list': {
      const [view] = await Promise.all([listView(parsed.scope, parsed.page), answerCallback(cb.id)]);
      return present(chat, messageId, view);
    }
    case 'view': {
      const view = await leadCardView(parsed.id, parsed.scope, parsed.page);
      if (!view) return void (await answerCallback(cb.id, strings.leadMissing, true));
      await Promise.all([answerCallback(cb.id), present(chat, messageId, view)]);
      return;
    }
    case 'status': {
      const lead = await updateLeadStatus(parsed.id, parsed.status);
      const label = strings.statusLabel[parsed.status];
      await Promise.all([
        answerCallback(cb.id, strings.toastStatus(label)),
        present(chat, messageId, cardView(lead, parsed.scope, parsed.page)),
      ]);
      return;
    }
    case 'note':
      return askNote(cb, chat, parsed.id, parsed.scope, parsed.page);
    case 'stats': {
      const [view] = await Promise.all([statsView(parsed.period), answerCallback(cb.id)]);
      return present(chat, messageId, view);
    }
  }
}
