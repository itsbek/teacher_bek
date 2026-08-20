import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const CONTACT_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'hello@teacherbek.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const pricingLeadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(30),
  program: z.string().max(100).optional(),
  website: z.string().optional(),
  formStartedAt: z.number().int().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MIN_FORM_FILL_MS = 1000;
const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_WINDOW_MS = 60_000;

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

function buildNotificationEmail(d: { name: string; phone: string; program?: string }): string {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#e8e8e8;padding:40px 20px">
<tr><td align="center">
<table width="580" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;">
  <tr>
    <td style="background:#0f0f0f;padding:36px 44px 0;">
      <p style="margin:0 0 20px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.35)">teacherbek.com &nbsp;·&nbsp; ${date}</p>
      <h1 style="margin:0;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:56px;font-weight:800;line-height:0.88;letter-spacing:-0.02em;color:#ffffff;text-transform:uppercase">Pricing<br>Request.</h1>
    </td>
  </tr>
  <tr>
    <td style="background:#0f0f0f;padding:24px 44px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px">
            <p style="margin:0;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:32px;font-weight:800;letter-spacing:-0.01em;color:#ffffff;text-transform:uppercase">${d.name}</p>
            <p style="margin:6px 0 0;font-family:'Courier New',Courier,monospace;font-size:14px;color:rgba(255,255,255,0.7);letter-spacing:0.04em">${d.phone}</p>
            ${d.program ? `<p style="margin:6px 0 0;font-family:'Courier New',Courier,monospace;font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.04em">Interested in: ${d.program}</p>` : ''}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 44px 44px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="background:#0f0f0f;">
            <a href="https://zalo.me/${d.phone.replace(/[^\d]/g, '')}"
               style="display:inline-block;padding:14px 32px;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#ffffff;text-decoration:none;">
              Message ${d.name} on Zalo &rarr;
            </a>
          </td>
        </tr>
      </table>
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
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const validated = pricingLeadSchema.parse(body);

    if (validated.website && validated.website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (validated.formStartedAt && Date.now() - validated.formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: 'Please take a moment before submitting.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[pricing-lead] RESEND_API_KEY is not set');
      // Pricing still reveals client-side even if the notification email fails to configure.
      return NextResponse.json({ success: true }, { status: 200 });
    }

    const name = sanitise(validated.name);
    const phone = sanitise(validated.phone);
    const program = validated.program ? sanitise(validated.program) : undefined;

    const { error } = await getResend().emails.send({
      from:    'Teacher Bek Website <noreply@teacherbek.com>',
      to:      CONTACT_EMAIL,
      subject: `New pricing request from ${name}`,
      html:    buildNotificationEmail({ name, phone, program }),
    });

    if (error) {
      console.error('[pricing-lead] notification send failed:', JSON.stringify(error));
      // Still return success — the visitor already sees pricing client-side either way.
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: error.issues }, { status: 400 });
    }
    console.error('[pricing-lead] error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
