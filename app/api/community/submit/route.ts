import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { createHash } from 'crypto';

const CONTACT_EMAIL = process.env.CONTACT_NOTIFY_EMAIL || 'hello@teacherbek.com';

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const communitySubmitSchema = z.object({
  type: z.enum(['writing', 'vocab', 'learned', 'teach', 'video']),
  name: z.string().min(1).max(60),
  // Writing — submits a Google Drive link, not raw text
  title:     z.string().max(120).optional(),
  level:     z.string().max(60).optional(),
  driveLink: z.string().max(500).optional(),
  // Vocab
  sentence:    z.string().max(500).optional(),
  // Learned
  learned:     z.string().max(500).optional(),
  // Teach
  topic:       z.string().max(200).optional(),
  explanation: z.string().max(2000).optional(),
  // Video
  url:     z.string().max(500).optional(),
  caption: z.string().max(500).optional(),
  // Anti-spam
  website:       z.string().optional(),
  formStartedAt: z.number().int().optional(),
  // Device fingerprint
  visitorId: z.string().max(36).optional(),
});

// ─── Rate limiting ───────────────────────────────────────────────────────────
//
// Three independent layers:
//   1. IP — 5 submissions per 60 seconds  (burst protection / bot bursts)
//   2. Visitor ID — 5 submissions per 24 hours  (per-device daily cap)
//   3. Content hash — reject identical text resubmitted within 60 minutes
//
// Note: Vercel serverless instances are stateless between cold starts.
// These maps are per-instance. They catch most abuse in practice.

type RateEntry = { count: number; resetTime: number };

const ipRateMap       = new Map<string, RateEntry>();
const visitorRateMap  = new Map<string, RateEntry>();
const contentHashMap  = new Map<string, number>(); // hash → timestamp

const IP_MAX        = 5;
const IP_WINDOW_MS  = 60_000;         // 1 minute
const VID_MAX       = 5;
const VID_WINDOW_MS = 24 * 60 * 60_000; // 24 hours
const HASH_TTL_MS   = 60 * 60_000;      // 1 hour

const MIN_FORM_FILL_MS = 2500; // must spend at least 2.5s on the form

function checkRateLimit(map: Map<string, RateEntry>, key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = map.get(key);
  if (!entry || now > entry.resetTime) {
    map.set(key, { count: 1, resetTime: now + windowMs });
    return true; // allowed
  }
  if (entry.count >= max) return false; // blocked
  entry.count++;
  return true;
}

function isDuplicateContent(text: string): boolean {
  const hash = createHash('sha256').update(text.toLowerCase().trim()).digest('hex');
  const now = Date.now();

  // Purge expired hashes occasionally to prevent unbounded growth
  if (contentHashMap.size > 500) {
    for (const [h, ts] of contentHashMap) {
      if (now - ts > HASH_TTL_MS) contentHashMap.delete(h);
    }
  }

  if (contentHashMap.has(hash) && now - contentHashMap.get(hash)! < HASH_TTL_MS) {
    return true; // duplicate
  }
  contentHashMap.set(hash, now);
  return false;
}

// ─── Bot signals ─────────────────────────────────────────────────────────────

const BLOCKED_UA_PATTERNS = [
  /headlesschrome/i,
  /phantomjs/i,
  /selenium/i,
  /webdriver/i,
  /puppeteer/i,
  /playwright/i,
  /python-requests/i,
  /curl\//i,
  /httpx/i,
  /axios/i,
  /node-fetch/i,
  /go-http-client/i,
  /java\//i,
  /\bbot\b/i,
  /crawler/i,
  /spider/i,
  /scrapy/i,
];

function isLikelyBot(ua: string | null): boolean {
  if (!ua || ua.trim().length < 10) return true;
  return BLOCKED_UA_PATTERNS.some((p) => p.test(ua));
}

// ─── Sanitise ────────────────────────────────────────────────────────────────

function sanitise(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/g, '').trim();
}

// ─── Email ───────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  writing: 'Student Writing',
  vocab:   'Vocabulary Challenge',
  learned: 'What I Learned',
  teach:   'Teach Someone Else',
  video:   'Video Response',
};

interface EmailData {
  validated: z.infer<typeof communitySubmitSchema>;
  ip: string;
  ua: string;
  visitorId: string;
}

function buildNotificationEmail({ validated, ip, ua, visitorId }: EmailData): string {
  const date      = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const typeLabel = TYPE_LABELS[validated.type] ?? validated.type;
  const vidShort  = visitorId ? visitorId.slice(-12).toUpperCase() : 'UNKNOWN';

  const field = (label: string, value?: string) =>
    value ? `<tr>
      <td style="padding:10px 0;border-bottom:1px solid #ebebeb;width:130px;vertical-align:top;white-space:nowrap">
        <span style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">${label}</span>
      </td>
      <td style="padding:10px 0 10px 16px;border-bottom:1px solid #ebebeb;vertical-align:top">
        <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0f0f0f;white-space:pre-wrap">${value}</span>
      </td>
    </tr>` : '';

  const driveRow = validated.type === 'writing' && validated.driveLink
    ? `<tr>
        <td style="padding:10px 0;border-bottom:1px solid #ebebeb;width:130px;vertical-align:top;white-space:nowrap">
          <span style="font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Drive Link</span>
        </td>
        <td style="padding:10px 0 10px 16px;border-bottom:1px solid #ebebeb;vertical-align:top">
          <a href="${validated.driveLink}" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:14px;color:#C85C3F;word-break:break-all">${validated.driveLink}</a>
        </td>
      </tr>`
    : '';

  const contentRows = [
    field('Name',        validated.name),
    validated.type === 'writing'  ? field('Level',       validated.level)       : '',
    validated.type === 'writing'  ? field('Title',       validated.title)       : '',
    driveRow,
    validated.type === 'vocab'    ? field('Sentence',    validated.sentence)    : '',
    validated.type === 'learned'  ? field('Learned',     validated.learned)     : '',
    validated.type === 'teach'    ? field('Topic',       validated.topic)       : '',
    validated.type === 'teach'    ? field('Explanation', validated.explanation) : '',
    validated.type === 'video'    ? field('Video URL',   validated.url)         : '',
    validated.type === 'video'    ? field('Caption',     validated.caption)     : '',
  ].join('');

  const forensicRows = [
    field('Device ID',  vidShort),
    field('IP Address', ip),
    field('User Agent', ua.slice(0, 120)),
    field('Submitted',  date),
  ].join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&display=swap" rel="stylesheet">
  <style>
    body{margin:0;padding:0;background:#e8e8e8;}
    @media(max-width:620px){.wrap{padding:0!important;}.card{width:100%!important;}.hpad{padding-left:24px!important;padding-right:24px!important;}}
  </style>
</head>
<body style="margin:0;padding:0;background:#e8e8e8;">
<table width="100%" cellpadding="0" cellspacing="0" class="wrap" style="background:#e8e8e8;padding:40px 20px">
<tr><td align="center">
<table width="580" class="card" cellpadding="0" cellspacing="0" style="max-width:580px;width:100%;background:#ffffff;">

  <tr>
    <td class="hpad" style="background:#0f0f0f;padding:36px 44px 32px;">
      <p style="margin:0 0 16px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.28em;text-transform:uppercase;color:rgba(255,255,255,0.35)">teacherbek.com · Community · ${date}</p>
      <h1 style="margin:0;font-family:'Barlow Condensed',Georgia,serif;font-size:52px;font-weight:800;line-height:0.9;letter-spacing:-0.02em;color:#ffffff;text-transform:uppercase">New<br>${typeLabel}.</h1>
    </td>
  </tr>

  <!-- Content -->
  <tr>
    <td class="hpad" style="padding:28px 44px 8px;">
      <p style="margin:0 0 12px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Submission</p>
      <table width="100%" cellpadding="0" cellspacing="0">${contentRows}</table>
    </td>
  </tr>

  <!-- Forensic info -->
  <tr>
    <td class="hpad" style="padding:28px 44px 8px;background:#f7f7f7;">
      <p style="margin:0 0 12px;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#aaa">Device &amp; Origin</p>
      <table width="100%" cellpadding="0" cellspacing="0">${forensicRows}</table>
    </td>
  </tr>

  <tr>
    <td class="hpad" style="padding:20px 44px 36px;background:#f7f7f7;">
      <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:9px;letter-spacing:0.18em;text-transform:uppercase;color:#bbb">
        If the Device ID repeats across unwanted submissions, the same browser/device is responsible.
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    // Content-type guard
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 415 });
    }

    // Bot detection — check user agent before parsing body
    const ua = request.headers.get('user-agent') ?? '';
    if (isLikelyBot(ua)) {
      // Silently succeed — don't reveal detection
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Extract IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';

    // Layer 1: IP rate limit
    if (!checkRateLimit(ipRateMap, ip, IP_MAX, IP_WINDOW_MS)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
    }

    const body = await request.json();
    const validated = communitySubmitSchema.parse(body);

    // Honeypot — silent success to not tip off bots
    if (validated.website && validated.website.trim().length > 0) {
      return NextResponse.json({ success: true }, { status: 200 });
    }

    // Speed trap — humans take at least 2.5 seconds to fill a form
    if (validated.formStartedAt && Date.now() - validated.formStartedAt < MIN_FORM_FILL_MS) {
      return NextResponse.json({ success: true }, { status: 200 }); // silent
    }

    // Layer 2: Visitor ID rate limit (24-hour daily cap per device)
    const visitorId = validated.visitorId ?? ip; // fall back to IP if no visitor ID
    if (!checkRateLimit(visitorRateMap, visitorId, VID_MAX, VID_WINDOW_MS)) {
      return NextResponse.json(
        { error: "You've submitted a lot today — come back tomorrow!" },
        { status: 429 }
      );
    }

    // Layer 3: Content deduplication (same submission = spam/bot retry)
    const submissionText = [
      validated.driveLink, validated.sentence, validated.learned, validated.explanation,
    ].filter(Boolean).join(' ');

    if (submissionText && isDuplicateContent(submissionText)) {
      // Silent success — they might be retrying a legitimate submission
      return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[community] RESEND_API_KEY is not set');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 500 });
    }

    // Sanitise all string fields
    const sanitised: z.infer<typeof communitySubmitSchema> = {
      ...validated,
      name:        sanitise(validated.name),
      title:       validated.title       ? sanitise(validated.title)       : undefined,
      level:       validated.level       ? sanitise(validated.level)       : undefined,
      driveLink:   validated.driveLink   ? sanitise(validated.driveLink)   : undefined,
      sentence:    validated.sentence    ? sanitise(validated.sentence)    : undefined,
      learned:     validated.learned     ? sanitise(validated.learned)     : undefined,
      topic:       validated.topic       ? sanitise(validated.topic)       : undefined,
      explanation: validated.explanation ? sanitise(validated.explanation) : undefined,
      url:         validated.url         ? sanitise(validated.url)         : undefined,
      caption:     validated.caption     ? sanitise(validated.caption)     : undefined,
    };

    const typeLabel = TYPE_LABELS[validated.type] ?? validated.type;

    const { error: notifyError } = await getResend().emails.send({
      from:    'Teacher Bek Community <noreply@teacherbek.com>',
      to:      CONTACT_EMAIL,
      subject: `Community: ${typeLabel} from ${sanitised.name}`,
      html:    buildNotificationEmail({ validated: sanitised, ip, ua, visitorId }),
    });

    if (notifyError) {
      console.error('[community] notification failed:', JSON.stringify(notifyError));
      return NextResponse.json({ error: 'Failed to send. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid form data', details: error.issues }, { status: 400 });
    }
    console.error('[community] error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
