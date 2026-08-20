import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';

const CONTACT_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'hello@teacherbek.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const contactFormSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(6).max(30),
  email: z.string().email().max(200).optional().or(z.literal('')),
  message: z.string().max(2000).optional().default(''),
  consent: z.boolean().refine((val) => val === true, { message: 'Consent is required' }),
  forWhom: z.string().max(100).optional(),
  level: z.string().max(100).optional(),
  goal: z.string().max(100).optional(),
  website: z.string().optional(),
  formStartedAt: z.number().int().optional(),
});

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const MIN_FORM_FILL_MS = 1500;
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

/* ─────────────────────────────────────────────────────────────
   NOTIFICATION EMAIL  — sent to the teacher
───────────────────────────────────────────────────────────── */
function buildNotificationEmail(d: {
  name: string; phone: string; email?: string;
  forWhom?: string; level?: string; goal?: string; message?: string;
}): string {
  const field = (label: string, value?: string) => value ? `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #ebebeb;width:110px;vertical-align:middle">
        <span style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">${label}</span>
      </td>
      <td style="padding:11px 0 11px 20px;border-bottom:1px solid #ebebeb;vertical-align:middle">
        <span style="font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:17px;font-weight:700;letter-spacing:0.01em;color:#0f0f0f">${value}</span>
      </td>
    </tr>` : '';

  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body{margin:0;padding:0;background:#e8e8e8;}
    @media(max-width:620px){
      .wrap{padding:0!important;}
      .card{width:100%!important;}
      .hpad{padding-left:24px!important;padding-right:24px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" class="wrap" style="background:#e8e8e8;padding:40px 20px">
<tr><td align="center">
<table width="580" class="card" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;">

  <!-- ── HEADER ── -->
  <tr>
    <td class="hpad" style="background:#0f0f0f;padding:36px 44px 0;">
      <p style="margin:0 0 20px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.35)">teacherbek.com &nbsp;·&nbsp; ${date}</p>
      <h1 style="margin:0;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:64px;font-weight:800;line-height:0.88;letter-spacing:-0.02em;color:#ffffff;text-transform:uppercase">New<br>Inquiry.</h1>
    </td>
  </tr>

  <!-- ── SENDER BAND ── -->
  <tr>
    <td class="hpad" style="background:#0f0f0f;padding:24px 44px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px">
            <p style="margin:0;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:32px;font-weight:800;letter-spacing:-0.01em;color:#ffffff;text-transform:uppercase">${d.name}</p>
            <p style="margin:6px 0 0;font-family:'Courier New',Courier,monospace;font-size:14px;color:rgba(255,255,255,0.7);letter-spacing:0.04em">${d.phone}</p>
            ${d.email ? `<p style="margin:2px 0 0;font-family:'Courier New',Courier,monospace;font-size:12px;color:rgba(255,255,255,0.45);letter-spacing:0.04em">${d.email}</p>` : ''}
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ── DETAILS ── -->
  <tr>
    <td class="hpad" style="padding:32px 44px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        ${field('For whom', d.forWhom)}
        ${field('Level',    d.level)}
        ${field('Goal',     d.goal)}
      </table>
    </td>
  </tr>

  <!-- ── MESSAGE ── -->
  ${d.message ? `
  <tr>
    <td class="hpad" style="padding:8px 44px 32px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-left:3px solid #0f0f0f;padding:16px 20px;background:#f7f7f7;">
            <p style="margin:0 0 8px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Message</p>
            <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.7;color:#333;white-space:pre-wrap">${d.message}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>` : ''}

  <!-- ── CTA ── -->
  <tr>
    <td class="hpad" style="padding:0 44px 44px;">
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

  <!-- ── FOOTER ── -->
  <tr>
    <td class="hpad" style="padding:20px 44px;border-top:1px solid #ebebeb;">
      <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#bbb">
        Teacher Bek &nbsp;·&nbsp; Phú Nhuận, Ho Chi Minh City &nbsp;·&nbsp;
        <a href="https://teacherbek.com" style="color:#bbb;text-decoration:none;">teacherbek.com</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────
   CONFIRMATION EMAIL  — sent to the student
───────────────────────────────────────────────────────────── */
function buildConfirmationEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,700;0,800;1,700&display=swap" rel="stylesheet">
  <style>
    body{margin:0;padding:0;background:#e8e8e8;}
    @media(max-width:620px){
      .wrap{padding:0!important;}
      .card{width:100%!important;}
      .hpad{padding-left:24px!important;padding-right:24px!important;}
    }
  </style>
</head>
<body style="margin:0;padding:0;background:#e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" class="wrap" style="background:#e8e8e8;padding:40px 20px">
<tr><td align="center">
<table width="580" class="card" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;">

  <!-- ── HEADER ── -->
  <tr>
    <td class="hpad" style="background:#0f0f0f;padding:36px 44px 32px;">
      <p style="margin:0 0 20px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.35)">Teacher Bek &nbsp;·&nbsp; Phú Nhuận, Ho Chi Minh City</p>
      <h1 style="margin:0;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:64px;font-weight:800;line-height:0.88;letter-spacing:-0.02em;color:#ffffff;text-transform:uppercase">Got it,<br><em style="font-style:italic;color:rgba(255,255,255,0.75)">${name}.</em></h1>
    </td>
  </tr>

  <!-- ── BODY ── -->
  <tr>
    <td class="hpad" style="padding:36px 44px 28px;">
      <p style="margin:0 0 20px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.75;color:#333;">
        Your message landed — I'll get back to you <strong>within 24 hours</strong>.<br>
        In the meantime feel free to reach me directly:
      </p>

      <!-- contact strip -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
        <tr>
          <td style="background:#f7f7f7;border-left:3px solid #0f0f0f;padding:20px 24px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding-bottom:10px;">
                  <p style="margin:0 0 2px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Zalo &amp; WhatsApp</p>
                  <a href="https://wa.me/84353885757" style="font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:26px;font-weight:800;color:#0f0f0f;text-decoration:none;letter-spacing:0.03em;">+84 353 88 5757</a>
                </td>
              </tr>
              <tr>
                <td>
                  <p style="margin:0 0 2px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Email</p>
                  <a href="mailto:hello@teacherbek.com" style="font-family:'Courier New',Courier,monospace;font-size:13px;color:#0f0f0f;text-decoration:none;">hello@teacherbek.com</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.75;color:#999;">
        TESOL &amp; PGCE certified &nbsp;·&nbsp; Max 10 students per class &nbsp;·&nbsp; Free trial class
      </p>
    </td>
  </tr>

  <!-- ── SIGN OFF ── -->
  <tr>
    <td class="hpad" style="padding:0 44px 40px;">
      <table cellpadding="0" cellspacing="0">
        <tr>
          <td style="border-top:1px solid #ebebeb;padding-top:24px;">
            <p style="margin:0 0 4px;font-family:'Barlow Condensed',Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#0f0f0f;text-transform:uppercase;letter-spacing:-0.01em;">— Teacher Bek</p>
            <a href="https://teacherbek.com" style="font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#aaa;text-decoration:none;">teacherbek.com</a>
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
    const validated = contactFormSchema.parse(body);

    if (validated.website && validated.website.trim().length > 0) {
      return NextResponse.json({ success: true, message: 'Thank you! I will be in touch within 24 hours.' }, { status: 200 });
    }

    if (validated.formStartedAt && Date.now() - validated.formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: 'Please take a moment before submitting.' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[contact] RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    const name    = sanitise(validated.name);
    const phone   = sanitise(validated.phone);
    const email   = validated.email ? sanitise(validated.email) : '';
    const message = sanitise(validated.message ?? '');

    const { error: notifyError } = await getResend().emails.send({
      from:    'Teacher Bek Website <noreply@teacherbek.com>',
      to:      CONTACT_EMAIL,
      replyTo: email || undefined,
      subject: `New inquiry from ${name}`,
      html:    buildNotificationEmail({
        name, phone, email: email || undefined,
        forWhom: validated.forWhom ?? undefined,
        level:   validated.level   ?? undefined,
        goal:    validated.goal    ?? undefined,
        message,
      }),
    });

    if (notifyError) {
      console.error('[contact] notification send failed:', JSON.stringify(notifyError));
      return NextResponse.json({ error: 'Failed to send message. Please try again or contact me directly.' }, { status: 500 });
    }

    if (email) {
      const { error: confirmError } = await getResend().emails.send({
        from:    'Teacher Bek <hello@teacherbek.com>',
        to:      email,
        subject: 'Got your message — Teacher Bek',
        html:    buildConfirmationEmail(name),
      });

      if (confirmError) {
        console.warn('[contact] confirmation send failed (non-fatal):', JSON.stringify(confirmError));
      }
    }

    return NextResponse.json({ success: true, message: 'Thank you! I will be in touch within 24 hours.' }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: error.issues }, { status: 400 });
    }
    console.error('[contact] error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again later.' }, { status: 500 });
  }
}
