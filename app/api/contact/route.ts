import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10),
  consent: z.boolean().refine((val) => val === true),
});

// Simple rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimitMap.get(ip);

  if (!limit || now > limit.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 }); // 1 minute window
    return true;
  }

  if (limit.count >= 3) {
    // Max 3 requests per minute
    return false;
  }

  limit.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    // Rate limiting check
    if (!rateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // In production, you would:
    // 1. Send email using Resend, SendGrid, or similar service
    // 2. Store in database with consent timestamp
    // 3. Send notification to admin

    // For now, log the submission (remove in production)
    console.log('Contact form submission:', {
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || 'Not provided',
      message: validatedData.message.substring(0, 50) + '...',
      consent: validatedData.consent,
      timestamp: new Date().toISOString(),
      ip: ip,
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TODO: Implement actual email sending
    // Example with Resend:
    // const { data, error } = await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: process.env.CONTACT_EMAIL || 'your@email.com',
    //   subject: `New Contact Form Submission from ${validatedData.name}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${validatedData.name}</p>
    //     <p><strong>Email:</strong> ${validatedData.email}</p>
    //     <p><strong>Phone:</strong> ${validatedData.phone || 'Not provided'}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${validatedData.message}</p>
    //     <p><strong>Consent:</strong> ${validatedData.consent ? 'Given' : 'Not given'}</p>
    //     <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
    //   `,
    // });

    return NextResponse.json(
      { success: true, message: 'Thank you for your message! I will get back to you within 24 hours.' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
