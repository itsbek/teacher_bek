import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const CONTACT_EMAIL = 'hello@teacherbek.com';

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

function sanitise(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

function buildNotificationEmail(data: {
  name: string;
  email: string;
  forWhom?: string;
  level?: string;
  goal?: string;
  message?: string;
}): string {
  const row = (label: string, value: string) =>
    value ? `<tr><td style="padding:6px 0;color:#666;font-size:13px;width:120px;vertical-align:top">${label}</td><td style="padding:6px 0;font-size:13px;color:#111;vertical-align:top">${value}</td></tr>` : '';

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td>
      <table width="560" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-top:3px solid #111">
        <tr>
          <td style="padding:32px 36px 16px">
            <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#999">New inquiry · teacherbek.com</p>
            <h1 style="margin:0;font-size:22px;font-weight:700;color:#111">${data.name}</h1>
            <p style="margin:4px 0 0;font-size:14px;color:#555"><a href="mailto:${data.email}" style="color:#111">${data.email}</a></p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px 28px">
            <table cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #eee;padding-top:20px">
              ${row('For whom', data.forWhom ?? '')}
              ${row('Level', data.level ?? '')}
              ${row('Goal', data.goal ?? '')}
            </table>
            ${data.message ? `
            <div style="margin-top:20px;padding:16px;background:#f9f9f9;border-left:3px solid #111">
              <p style="margin:0;font-size:13px;color:#333;line-height:1.6;white-space:pre-wrap">${data.message}</p>
            </div>` : ''}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px;background:#f9f9f9;border-top:1px solid #eee">
            <a href="mailto:${data.email}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;padding:10px 24px">Reply to ${data.name}</a>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildConfirmationEmail(name: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:40px 20px">
    <tr><td>
      <table width="560" cellpadding="0" cellspacing="0" align="center" style="background:#ffffff;border-top:3px solid #111">
        <tr>
          <td style="padding:36px 36px 28px">
            <p style="margin:0 0 16px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:#999">Teacher Bek · Phú Nhuận, Ho Chi Minh City</p>
            <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#111">Got it, ${name}.</h1>
            <p style="margin:0;font-size:14px;color:#555;line-height:1.7">
              I've received your message and will get back to you within 24 hours.<br>
              In the meantime, feel free to message me on <a href="https://zalo.me/84353885757" style="color:#111">Zalo</a> or <a href="https://wa.me/84353885757" style="color:#111">WhatsApp</a> at <strong>+84 353 88 5757</strong>.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 36px">
            <p style="margin:0;font-size:13px;color:#999;line-height:1.6">
              — Teacher Bek<br>
              <a href="https://teacherbek.com" style="color:#999">teacherbek.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

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

    // Honeypot
    if (validated.website && validated.website.trim().length > 0) {
      return NextResponse.json(
        { success: true, message: 'Thank you! I will be in touch within 24 hours.' },
        { status: 200 }
      );
    }

    // Speed trap
    if (validated.formStartedAt && Date.now() - validated.formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json(
        { error: 'Please take a moment before submitting.' },
        { status: 400 }
      );
    }

    const name    = sanitise(validated.name);
    const email   = sanitise(validated.email);
    const message = sanitise(validated.message ?? '');

    // Send both emails concurrently
    const [notification, confirmation] = await Promise.allSettled([
      resend.emails.send({
        from: 'Teacher Bek Website <noreply@teacherbek.com>',
        to:   CONTACT_EMAIL,
        replyTo: email,
        subject: `New inquiry from ${name}`,
        html: buildNotificationEmail({
          name,
          email,
          forWhom: validated.forWhom ?? undefined,
          level:   validated.level   ?? undefined,
          goal:    validated.goal    ?? undefined,
          message,
        }),
      }),
      resend.emails.send({
        from: 'Teacher Bek <hello@teacherbek.com>',
        to:   email,
        subject: 'Got your message — Teacher Bek',
        html: buildConfirmationEmail(name),
      }),
    ]);

    if (notification.status === 'rejected') {
      console.error('[contact] notification email failed:', notification.reason);
      return NextResponse.json(
        { error: 'Failed to send message. Please try again or contact me directly.' },
        { status: 500 }
      );
    }

    if (confirmation.status === 'rejected') {
      // Non-fatal — inquiry was delivered, confirmation failed
      console.warn('[contact] confirmation email failed:', confirmation.reason);
    }

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
