import { NextRequest, NextResponse } from 'next/server';

// In-memory rate limiting (replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // 3 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Store subscribers (in production, use a database or email service like Mailchimp/ConvertKit)
const subscribers: Array<{
  email: string;
  subscriberType: string;
  subscribedAt: string;
  ip: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Rate limiting
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, subscriberType } = body;

    // Validation
    if (!email || !subscriberType) {
      return NextResponse.json(
        { error: 'Email and subscriber type are required.' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const validTypes = ['student', 'parent', 'teacher'];
    if (!validTypes.includes(subscriberType)) {
      return NextResponse.json(
        { error: 'Invalid subscriber type.' },
        { status: 400 }
      );
    }

    // Check for existing subscriber
    const existingSubscriber = subscribers.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'This email is already subscribed.' },
        { status: 400 }
      );
    }

    // Store subscriber
    const newSubscriber = {
      email: email.toLowerCase(),
      subscriberType,
      subscribedAt: new Date().toISOString(),
      ip,
    };

    subscribers.push(newSubscriber);

    // Log for debugging (remove in production)
    console.log('New newsletter subscriber:', {
      email: newSubscriber.email,
      type: newSubscriber.subscriberType,
      date: newSubscriber.subscribedAt,
    });

    // TODO: Integrate with email service (Mailchimp, ConvertKit, Resend, etc.)
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.contacts.create({
    //   email: email,
    //   firstName: '',
    //   unsubscribed: false,
    //   audienceId: process.env.RESEND_AUDIENCE_ID!,
    // });

    // TODO: Send welcome email
    // await resend.emails.send({
    //   from: 'English Teacher <hello@englishwithconfidence.com>',
    //   to: email,
    //   subject: 'Welcome to the Newsletter!',
    //   html: getWelcomeEmailTemplate(subscriberType),
    // });

    return NextResponse.json({
      success: true,
      message: getSuccessMessage(subscriberType),
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

function getSuccessMessage(subscriberType: string): string {
  switch (subscriberType) {
    case 'student':
      return "Welcome! Check your inbox for learning tips and resources.";
    case 'parent':
      return "Thanks for joining! You'll receive tips to support your child's English journey.";
    case 'teacher':
      return "Great to have you! Look out for teaching strategies and resources.";
    default:
      return "Thanks for subscribing! Check your inbox soon.";
  }
}

// Get subscribers (for admin purposes - protect this endpoint in production)
export async function GET(request: NextRequest) {
  // In production, add authentication here
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.ADMIN_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    total: subscribers.length,
    subscribers: subscribers.map(s => ({
      email: s.email,
      type: s.subscriberType,
      date: s.subscribedAt,
    })),
  });
}
