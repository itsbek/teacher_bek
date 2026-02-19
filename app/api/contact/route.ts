import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  message: z.string().max(2000).optional().default(''),
  consent: z.boolean().refine((val) => val === true, { message: 'Consent is required' }),
  forWhom: z.enum(['My Child', 'Myself', '']).optional(),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Not Sure', '']).optional(),
  goal: z.enum(['IELTS Score', 'Speaking Confidence', 'School Grades', 'Work English', '']).optional(),
  website: z.string().optional(), // honeypot — bots fill this
  formStartedAt: z.number().int().optional(),
});

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MIN_FORM_FILL_MS = 1500;
const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_WINDOW_MS = 60_000; // 1 minute

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) return false;

  entry.count++;
  return true;
}

// Sanitise string fields — strip HTML tags to prevent stored XSS
function sanitise(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function POST(request: NextRequest) {
  try {
    // Only accept JSON
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    // Rate limiting by IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = contactFormSchema.parse(body);

    // Honeypot: bots fill hidden "website" field — silently accept to avoid revealing the check
    if (validated.website && validated.website.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: 'Thank you! I will be in touch within 24 hours.' },
        { status: 200 }
      );
    }

    // Speed trap: sub-1.5 s submissions are automated
    if (validated.formStartedAt && Date.now() - validated.formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(
        { error: 'Please take a moment before submitting.' },
        { status: 400 }
      );
    }

    // Sanitise user-supplied strings
    const name = sanitise(validated.name);
    const email = sanitise(validated.email);
    const message = sanitise(validated.message ?? '');

    // TODO: integrate Resend / SendGrid here
    // Example:
    // await resend.emails.send({
    //   from: 'no-reply@teacherbek.com',
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `New inquiry from ${name}`,
    //   html: `<p><strong>Name:</strong> ${name}</p>
    //          <p><strong>Email:</strong> ${email}</p>
    //          <p><strong>For:</strong> ${validated.forWhom}</p>
    //          <p><strong>Level:</strong> ${validated.level}</p>
    //          <p><strong>Goal:</strong> ${validated.goal}</p>
    //          <p><strong>Message:</strong> ${message}</p>`,
    // });

    console.log('[contact] submission from', { name, email, forWhom: validated.forWhom, level: validated.level, goal: validated.goal });

    return NextResponse.json(
      { success: true, message: 'Thank you! I will be in touch within 24 hours.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('[contact] error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
