import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardFooter } from '@/components/VanguardFooter';
import { BlogPost } from '@/components/blog/blog-post';
import { getBlogPost, getBlogPosts } from '@/lib/blog';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  const allPosts = getBlogPosts(locale);
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      <VanguardNavigation />
      <main className="min-h-screen bg-background text-foreground pt-32 selection:bg-black selection:text-white antialiased">
        {/* Texture Layer */}
        <div className="noise-layer" />

        <BlogPost post={post} locale={locale} relatedPosts={relatedPosts} />

        <VanguardFooter />
      </main>
    </>
  );
}
