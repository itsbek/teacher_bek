import { setRequestLocale, getTranslations } from 'next-intl/server';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardFooter } from '@/components/VanguardFooter';
import { VanguardBlogList } from '@/components/blog/VanguardBlogList';
import { BlogHero } from '@/components/blog/BlogHero';
import { getBlogPosts } from '@/lib/blog';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getBlogPosts(locale);
  const t = await getTranslations('blog');

  return (
    <>
      <VanguardNavigation />

      <main className="min-h-screen bg-background text-foreground pt-32 selection:bg-black selection:text-white antialiased">
        {/* Texture Layer */}
        <div className="noise-layer" />

        {/* Editorial Hero */}
        <BlogHero />

        {/* Elite Blog List */}
        <VanguardBlogList posts={posts} locale={locale} />

        <VanguardFooter />
      </main>
    </>
  );
}
