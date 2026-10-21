import type { LeadStatus } from '../leads/types';
import { LEAD_STATUSES, isLeadStatus } from '../leads/types';
import type { SheetLeadRow } from '../leads/sheet';
import { leadButtonLabel, pageCount } from './format';
import { strings } from './strings';
import type { ButtonStyle, InlineButton, InlineKeyboard, ReplyKeyboard } from './types';

/* ------------------------------------------------------------------ scopes */

export type ListScope =
  | { kind: 'status'; status: LeadStatus | 'all' }
  | { kind: 'today' }
  | { kind: 'search'; query: string };

export type StatsPeriod = 't' | 'p' | 'a';

export type Callback =
  | { t: 'list'; scope: ListScope; page: number }
  | { t: 'view'; id: string; scope: ListScope; page: number }
  | { t: 'status'; id: string; status: LeadStatus; scope: ListScope; page: number }
  | { t: 'note'; id: string; scope: ListScope; page: number }
  | { t: 'stats'; period: StatsPeriod }
  | { t: 'noop' };

export const CALLBACK_MAX_BYTES = 64;
const ID_RE = /^[A-Za-z0-9_-]{1,40}$/;
const STATUS_CODE: Record<LeadStatus, string> = { new: 'n', contacted: 'c', trial: 't', enrolled: 'e', lost: 'l' };
const CODE_STATUS: Record<string, LeadStatus> = { n: 'new', c: 'contacted', t: 'trial', e: 'enrolled', l: 'lost' };
const SCOPE_CODE_ALL = 'a';
const SCOPE_CODE_TODAY = 'd';
const SCOPE_CODE_SEARCH = 'q';

const byteLength = (s: string): number => new TextEncoder().encode(s).length;

/** Trims a search query so `l:q:<page>:<query>` fits in 64 bytes. */
export function fitQuery(query: string, max = 48): string {
  let q = query.trim();
  while (byteLength(q) > max) q = Array.from(q).slice(0, -1).join('');
  return q;
}

function scopeToken(scope: ListScope): string {
  if (scope.kind === 'today') return SCOPE_CODE_TODAY;
  if (scope.kind === 'search') return SCOPE_CODE_SEARCH;
  return scope.status === 'all' ? SCOPE_CODE_ALL : STATUS_CODE[scope.status];
}

function tokenToScope(code: string, query = ''): ListScope | null {
  if (code === SCOPE_CODE_ALL) return { kind: 'status', status: 'all' };
  if (code === SCOPE_CODE_TODAY) return { kind: 'today' };
  if (code === SCOPE_CODE_SEARCH) return { kind: 'search', query };
  const status = CODE_STATUS[code];
  return status ? { kind: 'status', status } : null;
}

/** Context suffix carried by card buttons so "Back" returns to the same list page, e.g. "c2". */
function ctx(scope: ListScope, page: number): string {
  return `${scopeToken(scope)}${Math.min(Math.max(page, 1), 99)}`;
}

function parseCtx(s: string | undefined): { scope: ListScope; page: number } {
  const m = /^([a-z])(\d{1,2})$/.exec(s ?? '');
  // Search queries do not fit in card buttons, so "back" from a search result opens All.
  const scope = m && m[1] !== SCOPE_CODE_SEARCH ? tokenToScope(m[1]) : null;
  return scope && m ? { scope, page: Number(m[2]) } : { scope: { kind: 'status', status: 'all' }, page: 1 };
}

export const cb = {
  list(scope: ListScope, page: number): string {
    const f =
      scope.kind === 'today' ? 'today' : scope.kind === 'search' ? 'q' : scope.status;
    const base = `l:${f}:${page}`;
    return scope.kind === 'search' ? `${base}:${fitQuery(scope.query, CALLBACK_MAX_BYTES - base.length - 1)}` : base;
  },
  view: (id: string, scope: ListScope, page: number) => `v:${id}:${ctx(scope, page)}`,
  status: (id: string, status: LeadStatus, scope: ListScope, page: number) =>
    `s:${id}:${STATUS_CODE[status]}:${ctx(scope, page)}`,
  note: (id: string, scope: ListScope, page: number) => `a:${id}:${ctx(scope, page)}`,
  stats: (p: StatsPeriod) => `m:${p}`,
  noop: 'x',
};

/** Defensive parser: returns null for anything malformed. */
export function parseCallback(data: string | undefined): Callback | null {
  if (!data || byteLength(data) > CALLBACK_MAX_BYTES) return null;
  if (data === cb.noop) return { t: 'noop' };
  const [kind, a, b, c] = data.split(':');
  switch (kind) {
    case 'l': {
      const page = Number(b);
      if (!Number.isInteger(page) || page < 1 || page > 999) return null;
      if (a === 'q') {
        const query = data.split(':').slice(3).join(':');
        return query ? { t: 'list', scope: { kind: 'search', query }, page } : null;
      }
      if (a === 'today') return { t: 'list', scope: { kind: 'today' }, page };
      if (a === 'all' || isLeadStatus(a)) return { t: 'list', scope: { kind: 'status', status: a }, page };
      return null;
    }
    case 'v':
    case 'a': {
      if (!a || !ID_RE.test(a)) return null;
      return { t: kind === 'v' ? 'view' : 'note', id: a, ...parseCtx(b) };
    }
    case 's': {
      // New format s:<id>:<code>:<ctx>. Legacy messages used s:<code>:<id>.
      if (a && ID_RE.test(a) && b && CODE_STATUS[b] && a.length > 1) {
        return { t: 'status', id: a, status: CODE_STATUS[b], ...parseCtx(c) };
      }
      if (a && CODE_STATUS[a] && b && ID_RE.test(b)) {
        return { t: 'status', id: b, status: CODE_STATUS[a], ...parseCtx(undefined) };
      }
      return null;
    }
    case 'm':
      return a === 't' || a === 'p' || a === 'a' ? { t: 'stats', period: a } : null;
    default:
      return null;
  }
}

/* --------------------------------------------------------------- keyboards */

export function mainKeyboard(): ReplyKeyboard {
  const m = strings.menu;
  return {
    keyboard: [[{ text: m.new }, { text: m.leads }, { text: m.stats }], [{ text: m.search }, { text: m.help }]],
    is_persistent: true,
    resize_keyboard: true,
    input_field_placeholder: strings.placeholder,
  };
}

/** Vietnamese numbers typed as 0xxxxxxxxx become 84xxxxxxxxx for Zalo / WhatsApp. */
export function contactDigits(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('0') ? `84${digits.slice(1)}` : digits;
}

const STATUS_STYLE: Partial<Record<LeadStatus, ButtonStyle>> = { enrolled: 'success', lost: 'danger' };

export function leadKeyboard(
  lead: { id: string; phone: string; status: string },
  scope: ListScope = { kind: 'status', status: 'all' },
  page = 1,
): InlineKeyboard {
  const rows: InlineButton[][] = [];
  const digits = contactDigits(lead.phone);
  const contact: InlineButton[] = [];
  const phone = lead.phone.trim();
  if (phone && phone.length <= 256) contact.push({ text: strings.btn.copyPhone, copy_text: { text: phone } });
  if (digits.length >= 8) {
    contact.push({ text: strings.btn.zalo, url: `https://zalo.me/${digits}` });
    contact.push({ text: strings.btn.whatsapp, url: `https://wa.me/${digits}` });
  }
  if (contact.length) rows.push(contact);

  const statusButtons = LEAD_STATUSES.map((s): InlineButton => {
    const current = lead.status === s;
    const style: ButtonStyle | undefined = current ? 'primary' : STATUS_STYLE[s];
    return {
      text: `${current ? '✓ ' : ''}${strings.statusLabel[s]}`,
      callback_data: cb.status(lead.id, s, scope, page),
      ...(style ? { style } : {}),
    };
  });
  rows.push(statusButtons.slice(0, 3), statusButtons.slice(3));
  const back: ListScope = scope.kind === 'search' ? { kind: 'status', status: 'all' } : scope;
  rows.push([
    { text: strings.btn.addNote, callback_data: cb.note(lead.id, scope, page) },
    { text: strings.btn.back, callback_data: cb.list(back, back === scope ? page : 1) },
  ]);
  return { inline_keyboard: rows };
}

const TABS: { status: LeadStatus | 'all'; label: string }[] = [
  ...LEAD_STATUSES.map((s) => ({ status: s, label: strings.statusLabel[s] })),
  { status: 'all', label: strings.all },
];

export function listKeyboard(scope: ListScope, rows: SheetLeadRow[], page: number, total: number, now = Date.now()): InlineKeyboard {
  const kb: InlineButton[][] = [];
  if (scope.kind === 'status') {
    const tabs = TABS.map((t): InlineButton => ({
      text: `${scope.status === t.status ? '✓ ' : ''}${t.label}`,
      callback_data: cb.list({ kind: 'status', status: t.status }, 1),
      ...(scope.status === t.status ? { style: 'primary' as const } : {}),
    }));
    kb.push(tabs.slice(0, 3), tabs.slice(3));
  }
  for (const r of rows) {
    kb.push([{ text: leadButtonLabel(r, now), callback_data: cb.view(r.id, scope, page) }]);
  }
  const pages = pageCount(total);
  if (pages > 1) {
    kb.push([
      page > 1
        ? { text: '◀︎', callback_data: cb.list(scope, page - 1) }
        : { text: '·', callback_data: cb.noop },
      { text: `${page}/${pages}`, callback_data: cb.noop },
      page < pages
        ? { text: '▶︎', callback_data: cb.list(scope, page + 1) }
        : { text: '·', callback_data: cb.noop },
    ]);
  }
  if (scope.kind !== 'status') {
    kb.push([{ text: `📋 ${strings.all}`, callback_data: cb.list({ kind: 'status', status: 'all' }, 1) }]);
  }
  return { inline_keyboard: kb };
}

export function statsKeyboard(current: StatsPeriod): InlineKeyboard {
  const t = strings.stats;
  const items: [StatsPeriod, string][] = [['t', t.thisMonth], ['p', t.lastMonth], ['a', t.allTime]];
  return {
    inline_keyboard: [
      items.map(([p, label]) => ({
        text: `${p === current ? '✓ ' : ''}${label}`,
        callback_data: cb.stats(p),
        ...(p === current ? { style: 'primary' as const } : {}),
      })),
    ],
  };
}
