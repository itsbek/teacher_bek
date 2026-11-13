import type { Instrumentation } from 'next';

/* Sentry for server route handlers only (/api/contact, /api/pricing-lead, /api/telegram).
   Entirely inert unless SENTRY_DSN is set. The SDK lives in instrumentation-node.ts behind a
   NEXT_RUNTIME check so it stays out of the edge (middleware) bundle. */
export async function register(): Promise<void> {
  const dsn = process.env.SENTRY_DSN;
  if (process.env.NEXT_RUNTIME === 'nodejs' && dsn) {
    const { initServerSentry } = await import('./instrumentation-node');
    initServerSentry(dsn);
  }
}

export const onRequestError: Instrumentation.onRequestError = async (err, request, context) => {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.SENTRY_DSN) {
    const { captureRouteError } = await import('./instrumentation-node');
    await captureRouteError(err, request, context);
  }
};
