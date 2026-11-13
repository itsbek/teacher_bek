/* Server-side reporting of lead delivery failures. Safe no-op without SENTRY_DSN, and the SDK is only
   loaded when a failure actually happens. Never receives the lead payload: only the channel name and the
   error message (phone-like digit runs are masked again by the scrubber before sending). */

export type LeadChannel = 'sheet' | 'telegram';

export async function reportLeadDeliveryFailure(channel: LeadChannel, err: unknown): Promise<void> {
  if (!process.env.SENTRY_DSN) return;
  try {
    const Sentry = await import('@sentry/nextjs');
    const message = err instanceof Error ? err.message : 'unknown';
    Sentry.withScope((scope) => {
      scope.setTag('area', 'lead-delivery');
      scope.setTag('channel', channel);
      scope.setFingerprint(['lead-delivery', channel]);
      Sentry.captureException(new Error(`Lead delivery failed via ${channel}: ${message}`));
    });
    await Sentry.flush(2000);
  } catch {
    /* monitoring must never affect lead handling */
  }
}
