import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const isDev = process.env.NODE_ENV === 'development';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // Blog and community hub removed (2026-10-22): send old URLs to the home page
      { source: '/:locale(en|vi|zh|ru)/blog', destination: '/:locale', permanent: true },
      { source: '/:locale(en|vi|zh|ru)/blog/:slug*', destination: '/:locale', permanent: true },
      { source: '/:locale(en|vi|zh|ru)/community', destination: '/:locale', permanent: true },
      { source: '/blog/:slug*', destination: '/', permanent: true },
      { source: '/community', destination: '/', permanent: true },
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
  transpilePackages: ['framer-motion'],
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
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 'unsafe-eval' is required in dev mode for Next.js webpack HMR and source maps.
              // It is intentionally omitted from production builds.
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com https://challenges.cloudflare.com`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://www.google-analytics.com https://www.googletagmanager.com",
              "font-src 'self' data:",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com",
              "frame-src https://www.google.com https://challenges.cloudflare.com",
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

export default withNextIntl(nextConfig);
