import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3;
const MIN_FORM_FILL_MS = 1200;

const newsletterSchema = z.object({
  email: z.string().email().max(200),
  subscriberType: z.enum(['student', 'parent', 'teacher']),
  website: z.string().optional(), // honeypot
  formStartedAt: z.number().int().optional(),
});

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function getSuccessMessage(subscriberType: string): string {
  switch (subscriberType) {
    case 'student':  return "Welcome! Check your inbox for learning tips and resources.";
    case 'parent':   return "Thanks for joining! You'll receive tips to support your child's English journey.";
    case 'teacher':  return "Great to have you! Look out for teaching strategies and resources.";
    default:         return "Thanks for subscribing! Check your inbox soon.";
  }
}

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const parsed = newsletterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request data.' }, { status: 400 });
    }

    const { email, subscriberType, website, formStartedAt } = parsed.data;

    // Honeypot — silent success
    if (website && website.trim().length > 0) {
      return NextResponse.json({ success: true, message: getSuccessMessage(subscriberType) });
    }

    // Speed trap — silent success, don't reveal detection
    if (formStartedAt && Date.now() - formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ success: true, message: getSuccessMessage(subscriberType) });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[newsletter] RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    if (!process.env.RESEND_AUDIENCE_ID) {
      console.error('[newsletter] RESEND_AUDIENCE_ID is not set');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const resend = getResend();

    // Add contact to Resend audience — persists across deploys/cold starts
    const { error: contactError } = await resend.contacts.create({
      email: email.toLowerCase(),
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });

    if (contactError) {
      // Resend returns a validation error if the contact already exists
      const msg = typeof contactError === 'object' && 'message' in contactError
        ? String((contactError as { message: string }).message)
        : JSON.stringify(contactError);

      if (msg.toLowerCase().includes('already exists') || msg.toLowerCase().includes('duplicate')) {
        return NextResponse.json({ error: 'This email is already subscribed.' }, { status: 400 });
      }

      console.error('[newsletter] contact create failed:', msg);
      return NextResponse.json({ error: 'Failed to subscribe. Please try again.' }, { status: 500 });
    }

    console.log('[newsletter] new subscriber:', { type: subscriberType, date: new Date().toISOString() });

    return NextResponse.json({ success: true, message: getSuccessMessage(subscriberType) });

  } catch (error) {
    console.error('[newsletter] error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred. Please try again.' }, { status: 500 });
  }
}
