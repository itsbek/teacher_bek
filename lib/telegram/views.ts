import type { LeadStatus } from '../leads/types';
import { getLead, getStats, listLeads, searchLeads, type LeadPage, type SheetStats } from '../leads/sheet';
import { clampPage, esc, formatLeadCard, formatStats, PAGE_SIZE, type CardLead } from './format';
import { leadKeyboard, listKeyboard, statsKeyboard, type ListScope, type StatsPeriod } from './keyboards';
import { strings } from './strings';
import { monthLabel, monthStartIso, startOfTodayIso } from './time';
import type { View } from './types';

function scopeTitle(scope: ListScope): string {
  if (scope.kind === 'today') return strings.today;
  if (scope.kind === 'search') return '';
  return scope.status === 'all' ? strings.all : strings.statusLabel[scope.status];
}

function fetchPage(scope: ListScope, page: number): Promise<LeadPage> {
  const offset = (page - 1) * PAGE_SIZE;
  if (scope.kind === 'search') return searchLeads(scope.query, offset, PAGE_SIZE);
  if (scope.kind === 'today') return listLeads({ from: startOfTodayIso(), offset, limit: PAGE_SIZE });
  const statuses: LeadStatus[] = scope.status === 'all' ? [] : [scope.status];
  return listLeads({ statuses, offset, limit: PAGE_SIZE });
}

/** A page of leads with filter tabs and pagination. Out-of-range pages are clamped. */
export async function listView(scope: ListScope, requestedPage: number): Promise<View> {
  let page = Math.max(1, requestedPage);
  let data = await fetchPage(scope, page);
  const clamped = clampPage(page, data.total);
  if (clamped !== page) {
    page = clamped;
    data = await fetchPage(scope, page);
  }
  let text: string;
  if (scope.kind === 'search') {
    text =
      data.total === 0
        ? strings.searchEmpty(esc(scope.query))
        : strings.searchTitle(esc(scope.query), data.total);
  } else {
    text = strings.listTitle(scopeTitle(scope), data.total);
    if (data.total === 0) text += `\n\n${strings.listEmpty}`;
  }
  return { text, reply_markup: listKeyboard(scope, data.leads, page, data.total) };
}

export function cardView(lead: CardLead, scope: ListScope, page: number, banner = false): View {
  return { text: formatLeadCard(lead, { banner }), reply_markup: leadKeyboard(lead, scope, page) };
}

export async function leadCardView(id: string, scope: ListScope, page: number): Promise<View | null> {
  const lead = await getLead(id);
  return lead ? cardView(lead, scope, page) : null;
}

const EMPTY_STATS: SheetStats = {
  month: '', total: 0, counts: {}, byProgram: {}, byLocale: {}, avgResponseMinutes: null, responseSamples: 0,
};

export async function statsView(period: StatsPeriod): Promise<View> {
  const thisStart = monthStartIso(0);
  const lastStart = monthStartIso(-1);
  const prevStart = monthStartIso(-2);
  let title: string;
  let cur: SheetStats;
  let prev: SheetStats | undefined;
  if (period === 'a') {
    title = strings.stats.allTime;
    cur = await getStats({ all: true });
  } else if (period === 't') {
    title = `${strings.stats.thisMonth} (${monthLabel(thisStart)})`;
    [cur, prev] = await Promise.all([
      getStats({ from: thisStart }),
      getStats({ from: lastStart, to: thisStart }),
    ]);
  } else {
    title = `${strings.stats.lastMonth} (${monthLabel(lastStart)})`;
    [cur, prev] = await Promise.all([
      getStats({ from: lastStart, to: thisStart }),
      getStats({ from: prevStart, to: lastStart }),
    ]);
  }
  return { text: formatStats(title, { ...EMPTY_STATS, ...cur }, prev), reply_markup: statsKeyboard(period) };
}
