import { Resend } from 'resend';
import type { Lead } from './types';
import {
  buildConfirmationEmail,
  buildContactNotificationEmail,
  buildPricingNotificationEmail,
} from './email-templates';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export async function sendLeadEmail(lead: Lead): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = process.env.CONTACT_NOTIFY_EMAIL || 'hello@teacherbek.com';

  const isPricing = lead.source === 'pricing';
  const { error } = await resend.emails.send({
    from: 'Teacher Bek Website <noreply@teacherbek.com>',
    to,
    replyTo: lead.email || undefined,
    subject: isPricing ? `New pricing request from ${lead.name}` : `New inquiry from ${lead.name}`,
    html: isPricing
      ? buildPricingNotificationEmail({ name: lead.name, phone: lead.phone, program: lead.program })
      : buildContactNotificationEmail({
          name: lead.name,
          phone: lead.phone,
          email: lead.email,
          forWhom: lead.forWhom,
          level: lead.level,
          goal: lead.goal,
          message: lead.message,
        }),
  });
  if (error) throw new Error(`resend: ${error.name ?? 'error'}`);

  if (!isPricing && lead.email) {
    const { error: confirmError } = await resend.emails.send({
      from: 'Teacher Bek <hello@teacherbek.com>',
      to: lead.email,
      subject: 'Got your message — Teacher Bek',
      html: buildConfirmationEmail(lead.name),
    });
    if (confirmError) console.warn(`[leads] ${lead.id} confirmation email failed (non-fatal)`);
  }
}
