import type { Lead, LeadStatus } from './types';

const TIMEOUT_MS = 8000;

export function isSheetConfigured(): boolean {
  return Boolean(process.env.LEADS_SHEET_WEBHOOK_URL && process.env.LEADS_SHEET_SECRET);
}

interface SheetReply {
  ok?: boolean;
  error?: string;
  leads?: SheetLeadRow[];
  stats?: SheetStats;
}

export interface SheetLeadRow {
  id: string;
  createdAt: string;
  status: string;
  name: string;
  phone: string;
  program?: string;
  source?: string;
  locale?: string;
}

export interface SheetStats {
  month: string;
  total: number;
  counts: Record<string, number>;
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

export async function appendLeadToSheet(lead: Lead): Promise<void> {
  await callSheet('append', { lead });
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await callSheet('update', { id, status, updatedAt: new Date().toISOString() });
}

export async function listLeads(limit: number): Promise<SheetLeadRow[]> {
  const data = await callSheet('list', { limit, statuses: ['new', 'contacted'] });
  return data.leads ?? [];
}

export async function getStats(): Promise<SheetStats> {
  const data = await callSheet('stats', {});
  if (!data.stats) throw new Error('sheet error: no stats');
  return data.stats;
}
