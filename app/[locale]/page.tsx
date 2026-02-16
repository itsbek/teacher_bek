import { setRequestLocale } from 'next-intl/server';
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
import { HomeSectionRail } from '@/components/HomeSectionRail';
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

  const articles = getBlogPosts(locale).slice(0, 4);
  const methodLoop = [
    {
      id: "01",
      title: "Assess",
      description: "Identify current speaking level, communication goals, and confidence blockers.",
    },
    {
      id: "02",
      title: "Train",
      description: "Run targeted speaking drills and correction loops with weekly structure.",
    },
    {
      id: "03",
      title: "Perform",
      description: "Apply English in real conversations, exams, interviews, and work contexts.",
    },
  ];

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:bg-foreground focus:text-background focus:px-4 focus:py-2">
        Skip to main content
      </a>
      <StructuredData />
      <VanguardNavigation />
      <HomeSectionRail />

      {/* Texture Layer */}
      <div className="noise-layer bg-noise" />

      <main id="main-content" className="bg-background text-foreground min-h-screen">
        {/* BEAT 01: ELITE INTRODUCTION */}
        <section id="hero">
          <VanguardHero />
        </section>

        {/* BEAT 02: BRAND ESSENCE & PHILOSOPHY */}
        <section id="signature" className="section-space-lg relative z-10">
          <VanguardSignature />
        </section>

        {/* BEAT 03: SYSTEMIC CURRICULUM */}
        <div className="section-space-lg">
          <VanguardLexicon />
        </div>

        {/* BEAT 05: INTELLECTUAL DEPTH (JOURNAL) */}
        <div className="section-space-lg bg-black text-white overflow-hidden" id="journal">
          <VanguardJournal initialArticles={articles} />
        </div>

        <ConversionStrip />

        <section className="section-space-lg border-t border-foreground/10 bg-foreground/[0.02] px-6 md:px-12 lg:px-24">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-4">
              <p className="text-[10px] uppercase tracking-[0.25em] font-mono text-foreground/55 mb-5">Outcome Framework</p>
              <h3 className="font-display text-4xl md:text-6xl leading-[0.9]">
                A clear path from hesitation to <span className="italic">confident fluency.</span>
              </h3>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
              {methodLoop.map((item) => (
                <article key={item.id} className="bg-background p-8 md:p-10">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/45 mb-4">Step {item.id}</p>
                  <h4 className="font-display text-3xl mb-3">{item.title}</h4>
                  <p className="text-foreground/70 leading-relaxed">{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* BEAT 06: CONVERSION & LOCATION PROTOCOL */}
        <div className="section-space-lg border-t border-foreground/5 bg-background text-foreground">
          <VanguardInquiry />
        </div>

        {/* BEAT 07: TRUST LOOP */}
        <section className="py-10 lg:py-14 overflow-hidden border-t border-foreground/5 bg-black">
          <VanguardMarquee />
        </section>

      </main>

      <VanguardFooter />
    </>
  );
}
