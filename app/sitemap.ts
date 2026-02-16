import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getBlogPosts } from '@/lib/blog'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://englishwithconfidence.com'
  const primaryRoutes = ['', '/about', '/services', '/faq', '/blog', '/privacy', '/terms'];

  // Main pages for each locale
  const mainPages = routing.locales.flatMap((locale) =>
    primaryRoutes.map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '/blog' ? ('daily' as const) : ('weekly' as const),
      priority: route === '' ? 1.0 : route === '/blog' ? 0.9 : 0.8,
    }))
  )

  // Blog posts for each locale
  const blogPosts = routing.locales.flatMap((locale) => {
    const posts = getBlogPosts(locale)
    return posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  })

  return [...mainPages, ...blogPosts]
}
