import type { MetadataRoute } from 'next'

const SEARCH_AND_ANSWER_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Googlebot',
  'Bingbot',
  'Applebot',
  'DuckDuckBot',
]

const TRAINING_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Bytespider',
  'meta-externalagent',
  'FacebookBot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'Diffbot',
  'Omgilibot',
  'ImagesiftBot',
  'Timpibot',
  'AI2Bot',
  'PanguBot',
  'Amazonbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: '/api/' },
      { userAgent: SEARCH_AND_ANSWER_AGENTS, allow: '/', disallow: '/api/' },
      { userAgent: TRAINING_CRAWLERS, disallow: '/' },
    ],
    sitemap: 'https://teacherbek.com/sitemap.xml',
  }
}
