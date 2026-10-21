export type LeadSource = 'contact' | 'pricing';
export type LeadStatus = 'new' | 'contacted' | 'trial' | 'enrolled' | 'lost';

export const LEAD_STATUSES: readonly LeadStatus[] = ['new', 'contacted', 'trial', 'enrolled', 'lost'];

export interface LeadUtm {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  source: LeadSource;
  locale: string;
  name: string;
  phone: string;
  email?: string;
  program?: string;
  forWhom?: string;
  level?: string;
  goal?: string;
  message?: string;
  consentText?: string;
  consentAt?: string;
  page?: string;
  referrer?: string;
  utm?: LeadUtm;
  status: LeadStatus;
}

export type ChannelOutcome = 'ok' | 'failed' | 'skipped';

export interface SubmitResult {
  ok: boolean;
  channels: { sheet: ChannelOutcome; email: ChannelOutcome; telegram: ChannelOutcome };
}

/** Machine codes returned to the browser by the lead API routes. */
export type LeadErrorCode =
  | 'DELIVERY_FAILED'
  | 'RATE_LIMITED'
  | 'INVALID'
  | 'SPAM'
  | 'CAPTCHA'
  | 'FORBIDDEN';

export function isLeadStatus(v: unknown): v is LeadStatus {
  return typeof v === 'string' && (LEAD_STATUSES as readonly string[]).includes(v);
}

export interface LeadNote {
  at: string;
  text: string;
}

export interface LeadHistoryEntry {
  status: LeadStatus;
  at: string;
}

/** A lead as stored in the Sheet: the submitted fields plus bot-managed data. */
export interface StoredLead extends Lead {
  updatedAt?: string;
  notes: LeadNote[];
  history: LeadHistoryEntry[];
}
