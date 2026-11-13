import { captureException, init } from '@sentry/browser';
import { browserOptions } from './browser-config';

/* The only module that imports the browser SDK, with named imports so the bundler can tree-shake the
   rest (Replay, Feedback, tracing, profiling). Loaded via dynamic import from ErrorMonitor. */
export function startBrowserSentry(dsn: string, queued: readonly { e: unknown; m: string }[]): void {
  init(browserOptions(dsn));
  for (const q of queued) captureException(q.e instanceof Error ? q.e : new Error(q.m));
}
