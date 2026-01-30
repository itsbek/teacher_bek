import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import AboutSection from '@/components/about';
import { Courses } from '@/components/courses';
import { Testimonials } from '@/components/testimonials';
import { FAQ } from '@/components/faq';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { StructuredData } from '@/components/structured-data';
import { Newsletter } from '@/components/newsletter';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData />
      <main className="min-h-screen">
        <Header />
        <Hero />
        <AboutSection />
        <Courses />
        <Testimonials />
        <Newsletter />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
