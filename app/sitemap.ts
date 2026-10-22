import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://teacherbek.com'
// Only canonical pages with real content — redirect stubs (/about, /services, /faq) are excluded
const PRIMARY_ROUTES = ['', '/privacy', '/terms']
// Fixed date for static pages (not build time) so lastModified stays stable across builds
const LAST_UPDATED = new Date('2026-10-22')

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    PRIMARY_ROUTES.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: LAST_UPDATED,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1.0 : 0.8,
    }))
  )
}
