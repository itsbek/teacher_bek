import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardFooter } from '@/components/VanguardFooter';
import { VanguardBlogList } from '@/components/blog/VanguardBlogList';
import { BlogHero } from '@/components/blog/BlogHero';
import { getBlogPosts } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "Blog",
    description: "Insights on English learning, teaching strategy, and communication growth.",
    path: "/blog",
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getBlogPosts(locale);

  return (
    <>
      <VanguardNavigation />

      <main className="min-h-screen bg-background text-foreground pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        {/* Editorial Hero */}
        <BlogHero />

        {/* Elite Blog List */}
        <VanguardBlogList posts={posts} locale={locale} />

        <VanguardFooter />
      </main>
    </>
  );
}
