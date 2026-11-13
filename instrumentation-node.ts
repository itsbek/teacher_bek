import * as Sentry from '@sentry/nextjs';
import type { Instrumentation } from 'next';
import { scrubBreadcrumb, scrubEvent } from '@/lib/sentry/scrub';

/* Node-runtime Sentry setup (route handlers only). Imported only from instrumentation.ts under a
   NEXT_RUNTIME check so it never reaches the edge/middleware bundle. */
export function initServerSentry(dsn: string): void {
  Sentry.init({
    dsn,
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
    tracesSampleRate: 0,
    sampleRate: 1,
    // no PII, cookies, headers, bodies or query strings
    dataCollection: { userInfo: false, cookies: false, httpHeaders: false, httpBodies: [], urlQueryParams: false },
    maxBreadcrumbs: 20,
    beforeSend: (event) => scrubEvent(event),
    beforeBreadcrumb: (b) => scrubBreadcrumb(b),
  });
}

export const captureRouteError: Instrumentation.onRequestError = (err, request, context) => {
  if (context.routeType !== 'route') return; // route handlers only
  Sentry.captureRequestError(err, request, context);
};
