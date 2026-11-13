import type { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://teacherbek.com'
const ROUTES = ['', '/classes', '/approach', '/students', '/privacy', '/terms']
const LAST_UPDATED = new Date('2026-11-12')

export default function sitemap(): MetadataRoute.Sitemap {
  return routing.locales.flatMap((locale) =>
    ROUTES.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: LAST_UPDATED,
      alternates: {
        languages: {
          en: `${BASE_URL}/en${route}`,
          vi: `${BASE_URL}/vi${route}`,
        },
      },
    }))
  )
}
