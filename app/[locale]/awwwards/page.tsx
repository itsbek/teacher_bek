import { HeroAwwwards } from '@/components/hero-awwwards';
import { NavigationAwwwards } from '@/components/navigation-awwwards';
import { AboutAwwwards } from '@/components/about-awwwards';
import { CoursesAwwwards } from '@/components/courses-awwwards';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * AWWWARDS SOTY - Complete Redesign Preview
 *
 * Full-screen snap-scroll experience with:
 * - Living Typography Hero ✅
 * - Invisible Navigation ✅
 * - Editorial About Section ✅
 * - 3D Tilt Courses ✅
 * - Testimonials (existing component)
 * - FAQ (existing component)
 * - Contact (existing component)
 */
export default async function AwwwardsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      {/* Navigation overlay */}
      <NavigationAwwwards />

      {/* Main content with snap-scroll */}
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        {/* New AWWWARDS components */}
        <HeroAwwwards />
        <AboutAwwwards />
        <CoursesAwwwards />

        {/* Existing components (to be enhanced) */}
        <section className="snap-start">
          <Testimonials />
        </section>

        <section className="snap-start">
          <FAQ />
        </section>

        <section className="snap-start">
          <Contact />
        </section>

        <Footer />
      </main>
    </>
  );
}
