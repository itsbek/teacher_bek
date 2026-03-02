import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { StructuredData } from '@/components/structured-data';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardHero } from '@/components/VanguardHero';
import { VanguardLexicon } from '@/components/VanguardLexicon';
import { VanguardJournal } from '@/components/VanguardJournal';
import { VanguardMarquee } from '@/components/VanguardMarquee';
import { VanguardFooter } from '@/components/VanguardFooter';
import { VanguardInquiry } from '@/components/VanguardInquiry';
import { AboutSection } from '@/components/AboutSection';
import { CredentialsSection } from '@/components/CredentialsSection';
import { DarkZoneWrapper } from '@/components/DarkZoneWrapper';
import { ConversionStrip } from '@/components/ConversionStrip';
import { FAQ } from '@/components/faq';
import { MethodologySteps } from '@/components/MethodologySteps';
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
 * Single-Page Landing — AWWWARDS Luxury Editorial
 *
 * Section order:
 * §1 Hero (#hero) — light zone
 * §2-6 Dark Zone: About, Programs, Methodology, Credentials, Journal
 * §7 ConversionStrip — light zone
 * §8 FAQ (#faq) — light zone
 * §9 Contact (#contact) — light zone
 * §10 Marquee — dark strip
 */
export default async function Home({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const articles = (await getBlogPosts(locale)).slice(0, 2);
  const t = await getTranslations({ locale, namespace: 'methodology' });

  const methodSteps = (t.raw('steps') as Array<{ id: string; title: string; description: string }>);

  return (
    <>
      <StructuredData />
      <VanguardNavigation />

      <main id="main-content" className="bg-background text-foreground min-h-screen">
        {/* §1: HERO — Light zone */}
        <section id="hero" style={{ scrollMarginTop: '5rem' }}>
          <VanguardHero />
        </section>

        {/* §2-6: DARK ZONE — dramatic light→dark transition */}
        <DarkZoneWrapper>
          {/* §2: ABOUT */}
          <AboutSection />

          {/* §3: PROGRAMS */}
          <section id="programs" style={{ scrollMarginTop: '5rem' }}>
            <VanguardLexicon />
          </section>

          {/* §4: METHODOLOGY */}
          <section
            id="methodology"
            className="section-md border-t border-current/10 px-6 md:px-12 lg:px-20"
            style={{ scrollMarginTop: 'var(--nav-h)' }}
          >
            <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-8 items-start">
              <div className="col-span-12 lg:col-span-4">
                <div className="flex items-center gap-4 mb-5">
                  <span className="w-8 h-[1px] bg-current opacity-30 shrink-0" />
                  <span className="text-[13px] uppercase tracking-[0.22em] opacity-45">[ 04 &mdash; {t('sectionLabel')} ]</span>
                </div>
                <h3 className="font-display text-4xl md:text-6xl leading-[0.9] headline-balance">
                  {t('heading')} <span className="italic">{t('headingItalic')}</span>
                </h3>
              </div>
              <MethodologySteps>
                {methodSteps.map((item) => (
                  <article key={item.id} className="bg-card p-8 md:p-10 border border-current/10">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-45 mb-4">
                      {t('stepLabel')} {item.id}
                    </p>
                    <h4 className="font-display text-3xl mb-3">{item.title}</h4>
                    <p className="opacity-70 leading-relaxed">{item.description}</p>
                  </article>
                ))}
              </MethodologySteps>
            </div>
          </section>

          {/* §5: CREDENTIALS */}
          <CredentialsSection />

          {/* §6: JOURNAL */}
          <section id="journal" className="section-md border-t border-current/10" style={{ scrollMarginTop: 'var(--nav-h)' }}>
            <VanguardJournal initialArticles={articles} />
          </section>
        </DarkZoneWrapper>

        {/* §7: CONVERSION STRIP — Light zone */}
        <ConversionStrip />

        {/* §8: FAQ — Light zone */}
        <FAQ />

        {/* §9: CONTACT — Light zone */}
        <section
          id="contact"
          className="section-lg border-t border-foreground/5 bg-background text-foreground"
          style={{ scrollMarginTop: 'var(--nav-h)' }}
        >
          <VanguardInquiry />
        </section>

        {/* §10: MARQUEE */}
        <section
          className="py-10 lg:py-14 overflow-hidden border-t border-foreground/5 bg-foreground"
          aria-label="Credentials and certifications"
        >
          <VanguardMarquee />
        </section>

      </main>

      <VanguardFooter />
    </>
  );
}
