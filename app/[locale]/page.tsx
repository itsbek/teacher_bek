import { setRequestLocale } from 'next-intl/server';
import { StructuredData } from '@/components/structured-data';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardHero } from '@/components/VanguardHero';
import { VanguardLexicon } from '@/components/VanguardLexicon';
import { VanguardJournal } from '@/components/VanguardJournal';
import { VanguardMarquee } from '@/components/VanguardMarquee';
import { VanguardSignature } from '@/components/VanguardSignature';
import { VanguardFooter } from '@/components/VanguardFooter';
import { VanguardServiceGlimpse } from '@/components/VanguardServiceGlimpse';
import { VanguardInquiry } from '@/components/VanguardInquiry';
import { getBlogPosts } from '@/lib/blog';

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * KINETIC VANGUARD - Landing Page
 * Avant-Garde Modernist Redesign
 */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = getBlogPosts(locale).slice(0, 4);

  return (
    <>
      <StructuredData />
      <VanguardNavigation />

      {/* Texture Layer */}
      <div className="noise-layer bg-noise" />

      <main className="bg-background text-foreground min-h-screen">
        {/* BEAT 01: ELITE INTRODUCTION */}
        <VanguardHero />

        {/* BEAT 02: BRAND ESSENCE & PHILOSOPHY */}
        <div className="py-24 lg:py-60 relative z-10">
          <VanguardSignature />
        </div>

        {/* BEAT 03: TAILORED FRAMEWORKS (OFFERINGS) */}
        <div className="py-24 lg:py-60 bg-[#f4f4f0]/30 dark:bg-vanguard-carbon/5 border-y border-foreground/5">
          <VanguardServiceGlimpse />
        </div>

        {/* BEAT 04: SYSTEMIC CURRICULUM */}
        <div className="py-24 lg:py-60">
          <VanguardLexicon />
        </div>

        {/* BEAT 05: INTELLECTUAL DEPTH (JOURNAL) */}
        <div className="py-24 lg:py-60 bg-black text-white">
          <VanguardJournal initialArticles={articles} />
        </div>

        {/* BEAT 06: CONVERSION & LOCATION PROTOCOL */}
        <div className="py-24 lg:py-60 border-t border-foreground/5 bg-background text-foreground">
          <VanguardInquiry />
        </div>

        {/* BEAT 07: TRUST LOOP */}
        <section className="py-24 lg:py-40 overflow-hidden border-t border-foreground/5 bg-black">
          <VanguardMarquee />
        </section>
      </main>

      <VanguardFooter />
    </>
  );
}
