import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

// ISR: re-render at most once per hour as a fallback.
// GitHub webhook (/api/revalidate) triggers immediate revalidation on push.
export const revalidate = 3600;
import { notFound } from 'next/navigation';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardFooter } from '@/components/VanguardFooter';
import { BlogPost } from '@/components/blog/blog-post';
import { getBlogPost, getBlogPosts } from '@/lib/blog';
import { SITE_URL, buildLocaleAlternates } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPost(locale, slug);

  if (!post) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const path = `/blog/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `${SITE_URL}/${locale}${path}`,
      languages: buildLocaleAlternates((loc) => `${SITE_URL}/${loc}${path}`),
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url: `${SITE_URL}/${locale}${path}`,
      images: post.image
        ? [{ url: post.image, alt: post.title }]
        : [{ url: "/images/teacher-profile.jpg", alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image] : ["/images/teacher-profile.jpg"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getBlogPost(locale, slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getBlogPosts(locale);
  const relatedPosts = allPosts
    .filter(p => p.slug !== slug && p.category === post.category)
    .slice(0, 2);

  return (
    <>
      <VanguardNavigation />
      <main className="min-h-screen bg-background text-foreground pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <BlogPost post={post} locale={locale} relatedPosts={relatedPosts} />
      </main>
      <VanguardFooter />
    </>
  );
}
