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
      <main className="min-h-screen bg-[#FDFBF7] dark:bg-black transition-colors duration-500">
        <Header />

        {/* Hero Section */}
        <section className="pt-32 pb-16 md:pb-24 bg-[#FDFBF7] dark:bg-black transition-colors duration-500">
          <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[11px] font-medium tracking-[0.1em] uppercase text-[#C4A84D] dark:text-[#ECD06F]">
                  {t('title')}
                </span>
                <div className="h-px w-16 bg-foreground/20 dark:bg-white/20" />
              </div>
              <h1 className="font-sans text-[clamp(36px,5vw,64px)] font-normal text-foreground dark:text-white leading-[1.1] tracking-[-0.01em] mb-6">
                {t('title')}
              </h1>
              <p className="text-lg md:text-xl text-foreground/50 dark:text-white/50 leading-relaxed">
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
