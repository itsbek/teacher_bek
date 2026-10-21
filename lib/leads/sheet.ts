import type { Lead, LeadHistoryEntry, LeadNote, LeadSource, LeadStatus, StoredLead } from './types';
import { isLeadStatus } from './types';

const TIMEOUT_MS = 8000;

export function isSheetConfigured(): boolean {
  return Boolean(process.env.LEADS_SHEET_WEBHOOK_URL && process.env.LEADS_SHEET_SECRET);
}

/** Slim row used in lists. */
export interface SheetLeadRow {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  program?: string;
  source?: string;
  locale?: string;
  forWhom?: string;
}

export interface SheetStats {
  /** "YYYY-MM", a range start date, or "all". */
  month: string;
  total: number;
  counts: Record<string, number>;
  byProgram: Record<string, number>;
  byLocale: Record<string, number>;
  /** Mean minutes from submission to first status change; null when no history exists yet. */
  avgResponseMinutes: number | null;
  responseSamples: number;
}

export interface LeadPage {
  leads: SheetLeadRow[];
  total: number;
}

export interface ListOptions {
  /** Omit or [] for every status. */
  statuses?: LeadStatus[];
  /** ISO timestamps; from inclusive, to exclusive. */
  from?: string;
  to?: string;
  offset?: number;
  limit?: number;
}

export interface StatsRange {
  all?: boolean;
  from?: string;
  to?: string;
}

interface RawLead {
  id?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  status?: unknown;
  source?: unknown;
  locale?: unknown;
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  program?: unknown;
  forWhom?: unknown;
  level?: unknown;
  goal?: unknown;
  message?: unknown;
  notes?: unknown;
  history?: unknown;
}

interface SheetReply {
  ok?: boolean;
  error?: string;
  leads?: SheetLeadRow[];
  total?: number;
  lead?: RawLead;
  stats?: Partial<SheetStats>;
}

async function callSheet(action: string, payload: Record<string, unknown>): Promise<SheetReply> {
  const url = process.env.LEADS_SHEET_WEBHOOK_URL;
  const secret = process.env.LEADS_SHEET_SECRET;
  if (!url || !secret) throw new Error('sheet not configured');
  const res = await fetch(url, {
    method: 'POST',
    // text/plain avoids a CORS preflight style request; Apps Script parses the body itself.
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ secret, action, ...payload }),
    redirect: 'follow',
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`sheet HTTP ${res.status}`);
  const data = (await res.json()) as SheetReply;
  if (!data.ok) throw new Error(`sheet error: ${data.error ?? 'unknown'}`);
  return data;
}

const s = (v: unknown): string => (typeof v === 'string' ? v : v == null ? '' : String(v));
const opt = (v: unknown): string | undefined => {
  const t = s(v);
  return t ? t : undefined;
};

function toNotes(v: unknown): LeadNote[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((n: unknown) => {
    const r = n as { at?: unknown; text?: unknown } | null;
    return r && s(r.text) ? [{ at: s(r.at), text: s(r.text) }] : [];
  });
}

function toHistory(v: unknown): LeadHistoryEntry[] {
  if (!Array.isArray(v)) return [];
  return v.flatMap((h: unknown) => {
    const r = h as { at?: unknown; status?: unknown } | null;
    return r && isLeadStatus(r.status) ? [{ status: r.status, at: s(r.at) }] : [];
  });
}

/** Defensive conversion of whatever the Apps Script returned into a StoredLead. */
export function toStoredLead(raw: RawLead): StoredLead {
  const source: LeadSource = raw.source === 'pricing' ? 'pricing' : 'contact';
  return {
    id: s(raw.id),
    createdAt: s(raw.createdAt),
    updatedAt: opt(raw.updatedAt),
    source,
    locale: s(raw.locale) || 'unknown',
    name: s(raw.name),
    phone: s(raw.phone),
    email: opt(raw.email),
    program: opt(raw.program),
    forWhom: opt(raw.forWhom),
    level: opt(raw.level),
    goal: opt(raw.goal),
    message: opt(raw.message),
    status: isLeadStatus(raw.status) ? raw.status : 'new',
    notes: toNotes(raw.notes),
    history: toHistory(raw.history),
  };
}

export async function appendLeadToSheet(lead: Lead): Promise<void> {
  await callSheet('append', { lead });
}

export async function getLead(id: string): Promise<StoredLead | null> {
  try {
    const data = await callSheet('get', { id });
    return data.lead ? toStoredLead(data.lead) : null;
  } catch (err) {
    if (err instanceof Error && err.message.endsWith('lead not found')) return null;
    throw err;
  }
}

/** Changes status, records history, and returns the updated lead. */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<StoredLead> {
  const data = await callSheet('update', { id, status, updatedAt: new Date().toISOString() });
  if (!data.lead) throw new Error('sheet error: no lead returned (redeploy the Apps Script)');
  return toStoredLead(data.lead);
}

export async function addLeadNote(id: string, text: string): Promise<StoredLead> {
  const data = await callSheet('addNote', { id, text, at: new Date().toISOString() });
  if (!data.lead) throw new Error('sheet error: no lead returned (redeploy the Apps Script)');
  return toStoredLead(data.lead);
}

export async function listLeads(opts: ListOptions = {}): Promise<LeadPage> {
  const data = await callSheet('list', {
    statuses: opts.statuses ?? [],
    from: opts.from,
    to: opts.to,
    offset: opts.offset ?? 0,
    limit: opts.limit ?? 10,
  });
  const leads = data.leads ?? [];
  return { leads, total: typeof data.total === 'number' ? data.total : leads.length };
}

export async function searchLeads(query: string, offset = 0, limit = 6): Promise<LeadPage> {
  const data = await callSheet('search', { query, offset, limit });
  const leads = data.leads ?? [];
  return { leads, total: typeof data.total === 'number' ? data.total : leads.length };
}

export async function getStats(range: StatsRange = {}): Promise<SheetStats> {
  const data = await callSheet('stats', { ...range });
  const st = data.stats;
  if (!st) throw new Error('sheet error: no stats');
  return {
    month: st.month ?? '',
    total: st.total ?? 0,
    counts: st.counts ?? {},
    byProgram: st.byProgram ?? {},
    byLocale: st.byLocale ?? {},
    avgResponseMinutes: st.avgResponseMinutes ?? null,
    responseSamples: st.responseSamples ?? 0,
  };
}
