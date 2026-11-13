import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { withSentryConfig } from '@sentry/nextjs/config';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

/* Direct ingest (no tunnel route): the tunnel would be a rewrite under the i18n middleware matcher and
   buys little for a low-traffic site. connect-src gets exactly the DSN's own host, and only when a DSN is set. */
function sentryHost(): string {
  try {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    return dsn ? ` https://${new URL(dsn).host}` : '';
  } catch {
    return '';
  }
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/[locale]/opengraph-image': ['./lib/og/archivo-og-800.ttf'],
    '/[locale]/twitter-image': ['./lib/og/archivo-og-800.ttf'],
    '/[locale]/classes/opengraph-image': ['./lib/og/archivo-og-800.ttf'],
    '/[locale]/classes/twitter-image': ['./lib/og/archivo-og-800.ttf'],
    '/[locale]/approach/opengraph-image': ['./lib/og/archivo-og-800.ttf'],
    '/[locale]/approach/twitter-image': ['./lib/og/archivo-og-800.ttf'],
  },
  env: {
    NEXT_PUBLIC_SENTRY_RELEASE: process.env.VERCEL_GIT_COMMIT_SHA ?? '',
    NEXT_PUBLIC_SENTRY_ENV: process.env.VERCEL_ENV ?? '',
  },
  async redirects() {
    return [
      { source: '/zh', destination: '/en', permanent: true },
      { source: '/ru', destination: '/en', permanent: true },
      { source: '/zh/:path*', destination: '/en/:path*', permanent: true },
      { source: '/ru/:path*', destination: '/en/:path*', permanent: true },
      { source: '/:locale(en|vi)/services', destination: '/:locale/classes', permanent: true },
      { source: '/:locale(en|vi)/about', destination: '/:locale#about', permanent: true },
      { source: '/:locale(en|vi)/faq', destination: '/:locale/classes#faq', permanent: true },
      // Blog and community hub removed (2026-10-22): send old URLs to the home page
      { source: '/:locale(en|vi|zh|ru)/blog', destination: '/:locale', permanent: true },
      { source: '/:locale(en|vi|zh|ru)/blog/:slug*', destination: '/:locale', permanent: true },
      { source: '/:locale(en|vi|zh|ru)/community', destination: '/:locale', permanent: true },
      { source: '/blog/:slug*', destination: '/en', permanent: true },
      { source: '/community', destination: '/en', permanent: true },
      // Redirect www → non-www (permanent 301 for SEO canonical consolidation)
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.teacherbek.com' }],
        destination: 'https://teacherbek.com/:path*',
        permanent: true,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      // ── Security headers — all routes ────────────────────────────────────
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-inline' must stay in script-src: pages are statically rendered and Next.js inlines
              // its RSC payload scripts, so a per-request nonce would force every page to render dynamically.
              // 'unsafe-eval' is required in dev mode for Next.js webpack HMR and source maps and is
              // intentionally omitted from production builds.
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://www.googletagmanager.com`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
              "font-src 'self' data:",
              `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${sentryHost()}`,
              "frame-src https://challenges.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
      // ── Long-lived cache for immutable static assets ──────────────────────
      // Next.js content-hashes these files at build time, so 1-year TTL is safe.
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Images and other public static files — 30 days, revalidatable
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' },
        ],
      },
    ];
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  telemetry: false,
  routeManifestInjection: false,
  release: { name: process.env.VERCEL_GIT_COMMIT_SHA },
  // Source maps: uploaded only with an auth token, then deleted from the build output so they are never public.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN, deleteSourcemapsAfterUpload: true },
  // The browser SDK is loaded lazily by components/monitoring/ErrorMonitor; no automatic instrumentation.
  webpack: {
    autoInstrumentMiddleware: false,
    autoInstrumentAppDirectory: false,
    autoInstrumentServerFunctions: false,
    treeshake: { removeDebugLogging: true },
  },
  // No tunnelRoute: see sentryHost().
});
