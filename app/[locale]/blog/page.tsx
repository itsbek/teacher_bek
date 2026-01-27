import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { BlogList } from '@/components/blog/blog-list';
import { Newsletter } from '@/components/newsletter';
import { getBlogPosts } from '@/lib/blog';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });

  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getBlogPosts(locale);
  const t = await getTranslations('blog');

  return (
    <>
      <main className="min-h-screen">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pb-24">
          <div className="container-lg">
            <div className="max-w-3xl">
              <span className="eyebrow mb-4">{t('title')}</span>
              <h1 className="text-foreground mb-6">{t('title')}</h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <BlogList posts={posts} locale={locale} />

        {/* Newsletter Section */}
        <Newsletter />

        <Footer />
      </main>
    </>
  );
}
