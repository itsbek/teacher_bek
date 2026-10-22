import type { Lead, LeadHistoryEntry, LeadNote, LeadStatus } from '../leads/types';
import { LEAD_STATUSES, isLeadStatus } from '../leads/types';
import type { SheetLeadRow, SheetStats } from '../leads/sheet';
import { strings } from './strings';
import { formatMinutes, formatTime, relativeTime, shortAge } from './time';

export const TG_LIMIT = 4096;

/** Escapes user-supplied text for Telegram HTML parse mode. */
export function esc(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function cut(input: string, max: number): string {
  const chars = Array.from(input);
  return chars.length <= max ? input : `${chars.slice(0, Math.max(0, max - 1)).join('')}…`;
}

/** Card input: a Lead plus whatever bot-managed data is known. */
export interface CardLead extends Lead {
  notes?: LeadNote[];
  history?: LeadHistoryEntry[];
}

const statusOf = (v: string): LeadStatus => (isLeadStatus(v) ? v : 'new');

export function statusEmoji(v: string): string {
  return strings.statusEmoji[statusOf(v)];
}

/** "Young Learners" -> "YL"; legacy values such as "ielts" still display as "Ielts". */
export function programShort(program: string | undefined): string {
  const words = (program ?? '').split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  if (words.length === 0) return '';
  if (words.length === 1) return cut(words[0].charAt(0).toUpperCase() + words[0].slice(1), 6);
  return words.slice(0, 3).map((w) => w.charAt(0).toUpperCase()).join('');
}

export function languageLabel(locale: string): string {
  return strings.language[locale] ?? `🌐 ${esc(cut(locale, 12))}`;
}

function when(iso: string): string {
  const abs = formatTime(iso);
  const rel = relativeTime(iso);
  return rel ? `${abs} (${rel})` : abs;
}

export interface CardOptions {
  banner?: boolean;
}

interface Budget {
  message: number;
  noteChars: number;
  notes: number;
}

function buildCard(lead: CardLead, banner: boolean, budget: Budget): string {
  const messageBudget = budget.message;
  const f = strings.field;
  const lines: string[] = [];
  if (banner) lines.push(strings.banner, '');
  lines.push(`${statusEmoji(lead.status)} <b>${esc(cut(lead.name || '—', 100))}</b> · ${strings.statusLabel[statusOf(lead.status)]}`);
  lines.push('');
  if (lead.program) lines.push(`📚 ${f.programme}: ${esc(cut(lead.program, 100))}`);
  const who = [lead.forWhom, lead.level].filter(Boolean).join(' · ');
  if (who) lines.push(`👤 ${f.who}: ${esc(cut(who, 200))}`);
  if (lead.goal) lines.push(`🎯 ${f.goal}: ${esc(cut(lead.goal, 200))}`);
  lines.push(`${languageLabel(lead.locale).replace(/^(\S+) (.*)$/u, `$1 ${f.language}: $2`)}`);
  lines.push(`📥 ${f.source}: ${strings.source[lead.source]}`);
  lines.push(`🕒 ${f.received}: ${when(lead.createdAt)}`);
  lines.push('');
  if (lead.phone) lines.push(`📞 <code>${esc(cut(lead.phone, 40))}</code>`);
  if (lead.message && messageBudget > 0) {
    lines.push('', `💬 <b>${f.message}</b>`, `<blockquote expandable>${esc(cut(lead.message, messageBudget))}</blockquote>`);
  }
  const notes = budget.notes > 0 ? (lead.notes ?? []).slice(-budget.notes) : [];
  if (notes.length) {
    lines.push('', `📝 <b>${f.notes}</b>`);
    for (const n of notes) lines.push(`• ${formatTime(n.at)} — ${esc(cut(n.text, budget.noteChars))}`);
  }
  const history = (lead.history ?? []).slice(-3);
  if (history.length) {
    lines.push('', `🕘 <b>${f.history}</b>`);
    for (const h of history) lines.push(`${statusEmoji(h.status)} ${strings.statusLabel[h.status]} · ${formatTime(h.at)}`);
  }
  return lines.join('\n');
}

/**
 * Lead card as Telegram HTML, guaranteed to fit in one message. When over the limit it degrades
 * in order: shorter message, shorter notes, fewer notes. Text is cut before escaping, so entities
 * and tags are never split.
 */
export function formatLeadCard(lead: CardLead, opts: CardOptions = {}): string {
  const banner = opts.banner === true;
  const budget: Budget = { message: lead.message ? Array.from(lead.message).length : 0, noteChars: 300, notes: 5 };
  let text = buildCard(lead, banner, budget);
  for (let i = 0; text.length > TG_LIMIT && i < 60; i++) {
    if (budget.message > 0) budget.message = Math.max(0, budget.message - Math.max(50, text.length - TG_LIMIT));
    else if (budget.noteChars > 40) budget.noteChars = Math.floor(budget.noteChars / 2);
    else if (budget.notes > 0) budget.notes -= 1;
    else break;
    text = buildCard(lead, banner, budget);
  }
  if (text.length > TG_LIMIT) {
    // Pathological input (e.g. every field maxed with "<"): fall back to a minimal card.
    const min: CardLead = { ...lead, goal: undefined, forWhom: undefined, level: undefined, program: undefined, message: undefined, notes: [], history: [] };
    text = buildCard(min, banner, { message: 0, noteChars: 0, notes: 0 });
  }
  return text;
}

/** One-line label for a list button: "🟡 Linh · YL · 2h". Plain text (buttons are not HTML). */
export function leadButtonLabel(row: SheetLeadRow, now: number = Date.now()): string {
  const bits = [cut(row.name || '—', 22), programShort(row.program), shortAge(row.createdAt, now)].filter(Boolean);
  return `${statusEmoji(row.status)} ${bits.join(' · ')}`;
}

export const PAGE_SIZE = 6;

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function clampPage(page: number, total: number): number {
  return Math.min(Math.max(1, Math.floor(page) || 1), pageCount(total));
}

function delta(cur: number, prev: number | undefined, suffix: string): string {
  if (prev === undefined) return '';
  const d = cur - prev;
  if (d === 0) return ` · = ${suffix}`;
  return ` · ${d > 0 ? '▲ +' : '▼ −'}${Math.abs(d)} ${suffix}`;
}

function pct(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

function breakdown(map: Record<string, number>, label: (k: string) => string, top = 5): string[] {
  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, top)
    .map(([k, n]) => `${label(k)} ${n}`);
}

export function formatStats(title: string, cur: SheetStats, prev?: SheetStats): string {
  const t = strings.stats;
  const enrolled = cur.counts.enrolled ?? 0;
  const conv = pct(enrolled, cur.total);
  const prevConv = prev ? pct(prev.counts.enrolled ?? 0, prev.total) : undefined;
  const lines = [`${t.title} · ${esc(title)}`, ''];
  lines.push(`👥 ${t.total}: <b>${cur.total}</b>${delta(cur.total, prev?.total, t.vs)}`);
  lines.push(
    `🎓 ${t.conversion}: <b>${conv}%</b> (${enrolled}/${cur.total})${prevConv !== undefined ? ` · was ${prevConv}%` : ''}`,
  );
  lines.push(
    `⏱ ${t.response}: <b>${cur.avgResponseMinutes === null ? t.none : formatMinutes(cur.avgResponseMinutes)}</b>${cur.responseSamples ? ` (${cur.responseSamples})` : ''}`,
  );
  lines.push('', `<b>${t.byStatus}</b>`);
  for (const s of LEAD_STATUSES) {
    lines.push(`${strings.statusEmoji[s]} ${strings.statusLabel[s]} · ${cur.counts[s] ?? 0}`);
  }
  const prog = breakdown(cur.byProgram, (k) => esc(cut(k, 24)));
  if (prog.length) lines.push('', `<b>${t.byProgramme}</b>`, prog.join('  ·  '));
  const lang = breakdown(cur.byLocale, (k) => strings.flag[k] ?? esc(cut(k, 8)));
  if (lang.length) lines.push('', `<b>${t.byLanguage}</b>`, lang.join('  ·  '));
  return lines.join('\n');
}
