import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { StructuredData } from '@/components/structured-data';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardHero } from '@/components/VanguardHero';
import { VanguardLexicon } from '@/components/VanguardLexicon';
import { VanguardJournal } from '@/components/VanguardJournal';
import { VanguardMarquee } from '@/components/VanguardMarquee';
import { VanguardSignature } from '@/components/VanguardSignature';
import { VanguardFooter } from '@/components/VanguardFooter';
import { VanguardInquiry } from '@/components/VanguardInquiry';
import { TrustSection } from '@/components/TrustSection';
import { ConversionStrip } from '@/components/ConversionStrip';
import { getBlogPosts } from '@/lib/blog';
import { buildPageMetadata } from '@/lib/seo';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "English Teacher in Ho Chi Minh City",
    description: "Small-group English lessons for students, parents, and professionals in Ho Chi Minh City.",
    path: "",
  });
}

/**
 * KINETIC VANGUARD - Landing Page
 * Avant-Garde Modernist Redesign
 */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = getBlogPosts(locale).slice(0, 2);
  const t = await getTranslations({ locale, namespace: 'methodology' });

  // Methodology steps from translations — no hardcoded English
  const methodSteps = (t.raw('steps') as Array<{ id: string; title: string; description: string }>);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-foreground focus:text-background focus:px-4 focus:py-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-foreground"
      >
        Skip to main content
      </a>
      <StructuredData />
      <VanguardNavigation />

      <main id="main-content" className="bg-background text-foreground min-h-screen">
        {/* BEAT 01: ELITE INTRODUCTION */}
        <section id="hero" style={{ scrollMarginTop: '5rem' }}>
          <VanguardHero />
        </section>

        {/* BEAT 02: BRAND ESSENCE & PHILOSOPHY
            Note: VanguardSignature manages its own vertical padding — no section-space-lg wrapper needed */}
        <section id="signature" className="relative z-10" style={{ scrollMarginTop: '5rem' }}>
          <VanguardSignature />
        </section>

        {/* BEAT 02b: TRUST & SAFETY */}
        <TrustSection />

        {/* BEAT 03: SYSTEMIC CURRICULUM
            VanguardLexicon has no internal vertical padding — section-space-lg provides it */}
        <section id="lexicon" className="section-space-lg" style={{ scrollMarginTop: '5rem' }}>
          <VanguardLexicon />
        </section>

        {/* BEAT 05: INTELLECTUAL DEPTH (JOURNAL) */}
        <section className="section-space-lg bg-black text-white" id="journal" style={{ scrollMarginTop: '5rem' }}>
          <VanguardJournal initialArticles={articles} />
        </section>

        <ConversionStrip />

        {/* BEAT 04: OUTCOME FRAMEWORK — i18n */}
        <section
          id="methodology"
          className="section-space-lg border-t border-foreground/10 bg-foreground/[0.02] px-6 md:px-12 lg:px-24"
          style={{ scrollMarginTop: '5rem' }}
        >
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-4">
              <p className="text-xs uppercase tracking-[0.25em] font-mono text-foreground/55 mb-5">
                {t('sectionLabel')}
              </p>
              <h3 className="font-display text-4xl md:text-6xl leading-[0.9] headline-balance">
                {t('heading')} <span className="italic">{t('headingItalic')}</span>
              </h3>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
              {methodSteps.map((item) => (
                <article key={item.id} className="bg-background p-8 md:p-10">
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/45 mb-4">
                    {t('stepLabel')} {item.id}
                  </p>
                  <h4 className="font-display text-3xl mb-3">{item.title}</h4>
                  <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BEAT 06: CONVERSION & LOCATION PROTOCOL */}
        <section
          id="contact"
          className="section-space-lg border-t border-foreground/5 bg-background text-foreground"
          style={{ scrollMarginTop: '5rem' }}
        >
          <VanguardInquiry />
        </section>

        {/* BEAT 07: TRUST LOOP */}
        <section
          className="py-10 lg:py-14 overflow-hidden border-t border-foreground/5 bg-black"
          aria-label="Credentials and certifications"
        >
          <VanguardMarquee />
        </section>

      </main>

      <VanguardFooter />
    </>
  );
}
