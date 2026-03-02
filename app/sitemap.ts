import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getBlogPosts } from '@/lib/blog'

const BASE_URL = 'https://englishwithconfidence.com'
const PRIMARY_ROUTES = ['', '/about', '/services', '/faq', '/blog', '/privacy', '/terms']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Main pages for each locale
  const mainPages = routing.locales.flatMap((locale) =>
    PRIMARY_ROUTES.map((route) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '/blog' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1.0 : route === '/blog' ? 0.9 : 0.8,
    }))
  )

  // Blog posts for each locale
  const postResults = await Promise.all(
    routing.locales.map(async (locale) => {
      const posts = await getBlogPosts(locale)
      return posts.map((post) => ({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt ?? post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    })
  )

  return [...mainPages, ...postResults.flat()]
}
