import { Header } from '@/components/header';
import { Hero } from '@/components/hero';
import AboutSection from '@/components/about';
import { Courses } from '@/components/courses';
import { Testimonials } from '@/components/testimonials';
import { FAQEnhanced } from '@/components/faq-enhanced';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';
import { StructuredData } from '@/components/structured-data';
import { NewsletterEnhanced } from '@/components/newsletter-enhanced';
import { TrialCTA } from '@/components/trial-cta';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  title: 'AWWWARDS Showcase | English Teacher Portfolio',
  description: 'AWWWARDS-level design showcase featuring living typography, archaeological effects, and cinematic animations.',
};

/**
 * AWWWARDS SHOWCASE PAGE
 *
 * Demonstrates the complete Lingua Noir design system with enhanced components:
 * - Archaeological effects (wax drips, crack underlines, tobacco smoke)
 * - Living typography with 3D tilt
 * - Telegraph-style inputs
 * - Liquid reveal animations
 * - Oxidized copper glows
 * - Mechanical interactions
 *
 * "Bergman meets Blade Runner in an English tea room"
 */
export default async function AWWWARDSShowcase({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <StructuredData />
      <main className="min-h-screen bg-[#FDFBF7] dark:bg-black transition-colors duration-500">
        {/* Navigation with glass morphism */}
        <Header />

        {/* Hero: Living typography with 3D letter tilt, fluid smoke, magnetic buttons */}
        <Hero />

        {/* About: Animated paragraphs, image reveals, smoke tendrils */}
        <AboutSection />

        {/* Courses: 3D tilt cards, WebGL metaballs, shine effects */}
        <Courses />

        {/* Testimonials: Carousel with chromatic effects */}
        <Testimonials />

        {/* Trial CTA */}
        <TrialCTA />

        {/* FAQ Enhanced: Liquid reveals, crack underlines, wax drips */}
        <FAQEnhanced />

        {/* Newsletter Enhanced: Telegraph inputs, tobacco smoke, oxidized copper */}
        <NewsletterEnhanced />

        {/* Contact: Telegraph layout with copper accents */}
        <Contact />

        {/* Footer: Large typography, social glows */}
        <Footer />
      </main>
    </>
  );
}
