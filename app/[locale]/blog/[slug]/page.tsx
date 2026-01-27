import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogPost } from '@/components/blog/blog-post';
import { Newsletter } from '@/components/newsletter';
import { getBlogPost, getBlogPosts, getAllSlugs } from '@/lib/blog';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];

  for (const locale of routing.locales) {
    const slugs = getAllSlugs(locale);
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getBlogPost(locale, slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

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
      <main className="min-h-screen">
        <Header />
        <BlogPost post={post} locale={locale} relatedPosts={relatedPosts} />
        <Newsletter />
        <Footer />
      </main>
    </>
  );
}
