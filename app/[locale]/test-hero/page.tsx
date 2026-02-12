import { HeroAwwwards } from '@/components/hero-awwwards';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function TestHeroPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="snap-y snap-mandatory h-screen overflow-y-scroll">
      <HeroAwwwards />

      {/* Test section below to verify scroll snap */}
      <section className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 snap-start">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Section Below Hero</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Scroll to test parallax effects
          </p>
        </div>
      </section>
    </main>
  );
}
