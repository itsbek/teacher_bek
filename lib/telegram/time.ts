import { strings } from './strings';

const TZ = 'Asia/Ho_Chi_Minh';
const VN_OFFSET_MS = 7 * 3600_000; // Vietnam has no DST

const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: TZ,
  day: 'numeric',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

/** "21 Oct, 19:42" in Ho Chi Minh time; '' for an invalid date. */
export function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const p = Object.fromEntries(parts.formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.day} ${p.month}, ${p.hour}:${p.minute}`;
}

/** "just now", "12m ago", "2h ago", "3d ago"; '' when unknown or in the future. */
export function relativeTime(iso: string, now: number = Date.now()): string {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return '';
  const mins = Math.floor((now - t) / 60_000);
  if (mins < 0) return '';
  if (mins < 1) return strings.time.now;
  if (mins < 60) return `${mins}${strings.time.min}`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}${strings.time.hour}`;
  return `${Math.floor(hours / 24)}${strings.time.day}`;
}

/** Compact variant for list buttons: "2h", "3d". */
export function shortAge(iso: string, now: number = Date.now()): string {
  return relativeTime(iso, now).replace(/ ago$/, '').replace('just now', 'now');
}

/** Start of a Ho Chi Minh calendar month as an ISO string. offset 0 = this month, -1 = last month. */
export function monthStartIso(offset: number, now: number = Date.now()): string {
  const local = new Date(now + VN_OFFSET_MS);
  const ms = Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + offset, 1) - VN_OFFSET_MS;
  return new Date(ms).toISOString();
}

export function startOfTodayIso(now: number = Date.now()): string {
  const local = new Date(now + VN_OFFSET_MS);
  const ms = Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) - VN_OFFSET_MS;
  return new Date(ms).toISOString();
}

export function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`;
  const h = Math.floor(mins / 60);
  if (h < 24) return `${h}h ${mins % 60}m`;
  return `${Math.floor(h / 24)}d ${h % 24}h`;
}

export function monthLabel(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { timeZone: TZ, month: 'short', year: 'numeric' }).format(
    new Date(iso),
  );
}
