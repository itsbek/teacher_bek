import { NextResponse, type NextRequest } from 'next/server';
import { z } from 'zod';
import { clientIp, isAllowedOrigin, rateLimit, verifyTurnstile } from './guard';
import { submitLead } from './submit';
import type { Lead, LeadErrorCode, LeadSource } from './types';

const optional = (max: number) => z.string().max(max).optional();

const baseShape = {
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(30),
  locale: z.string().max(10).optional(),
  page: optional(500),
  referrer: optional(500),
  utm: z
    .object({
      source: optional(100),
      medium: optional(100),
      campaign: optional(100),
      term: optional(100),
      content: optional(100),
    })
    .optional(),
  website: z.string().optional(), // honeypot
  formStartedAt: z.number().int().optional(),
  turnstileToken: z.string().max(4096).optional(),
};

const contactSchema = z.object({
  ...baseShape,
  email: z.string().email().max(200).optional().or(z.literal('')),
  message: z.string().max(2000).optional().default(''),
  consent: z.boolean().refine((v) => v === true),
  consentText: optional(500),
  forWhom: optional(100),
  level: optional(100),
  goal: optional(100),
});

const pricingSchema = z.object({
  ...baseShape,
  program: optional(100),
});

const MIN_FILL_MS: Record<LeadSource, number> = { contact: 1500, pricing: 1000 };
const SUPPORTED_LOCALES = ['en', 'vi', 'zh', 'ru'];

function fail(code: LeadErrorCode, status: number) {
  return NextResponse.json({ ok: false, code }, { status });
}

function sanitise(str: string | undefined): string {
  return (str ?? '').replace(/<[^>]*>/g, '').trim();
}
function opt(str: string | undefined): string | undefined {
  const v = sanitise(str);
  return v || undefined;
}

export async function handleLeadPost(request: NextRequest, source: LeadSource): Promise<NextResponse> {
  try {
    if (!isAllowedOrigin(request)) return fail('FORBIDDEN', 403);
    if (!(request.headers.get('content-type') || '').includes('application/json')) {
      return fail('INVALID', 415);
    }

    const ip = clientIp(request);
    if (!rateLimit(source, ip)) return fail('RATE_LIMITED', 429);

    const body: unknown = await request.json();
    const parsed = source === 'contact' ? contactSchema.safeParse(body) : pricingSchema.safeParse(body);
    if (!parsed.success) return fail('INVALID', 400);
    const v = parsed.data;

    // Honeypot: look successful to bots but store nothing.
    if (v.website && v.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }
    // Time trap
    if (v.formStartedAt && Date.now() - v.formStartedAt < MIN_FILL_MS[source]) {
      return fail('SPAM', 400);
    }
    if (!(await verifyTurnstile(v.turnstileToken, ip))) return fail('CAPTCHA', 400);

    const contact = 'consent' in v ? (v as z.infer<typeof contactSchema>) : undefined;
    const pricing = contact ? undefined : (v as z.infer<typeof pricingSchema>);
    const now = new Date().toISOString();

    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: now,
      source,
      locale: v.locale && SUPPORTED_LOCALES.includes(v.locale) ? v.locale : 'unknown',
      name: sanitise(v.name),
      phone: sanitise(v.phone),
      email: opt(contact?.email),
      program: opt(pricing?.program),
      forWhom: opt(contact?.forWhom),
      level: opt(contact?.level),
      goal: opt(contact?.goal),
      message: opt(contact?.message),
      consentText: contact ? opt(contact.consentText) : undefined,
      consentAt: contact ? now : undefined,
      page: opt(v.page),
      referrer: opt(v.referrer),
      utm: v.utm,
      status: 'new',
    };

    const result = await submitLead(lead);
    if (!result.ok) return fail('DELIVERY_FAILED', 502);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[${source}] unexpected error:`, err instanceof Error ? err.message : 'unknown');
    return fail('DELIVERY_FAILED', 500);
  }
}
