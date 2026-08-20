import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { StructuredData } from '@/components/structured-data';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { VanguardHero } from '@/components/VanguardHero';
import { getBlogPosts } from '@/lib/blog';
import { buildPageMetadata, getLocaleMetadata } from '@/lib/seo';

/* Below-the-fold sections — loaded after the hero paints */
const DarkZoneWrapper   = dynamic(() => import('@/components/DarkZoneWrapper').then(m => ({ default: m.DarkZoneWrapper })));
const AboutSection      = dynamic(() => import('@/components/AboutSection').then(m => ({ default: m.AboutSection })));
const VanguardLexicon   = dynamic(() => import('@/components/VanguardLexicon').then(m => ({ default: m.VanguardLexicon })));
const MethodologySteps  = dynamic(() => import('@/components/MethodologySteps').then(m => ({ default: m.MethodologySteps })));
const CredentialsSection = dynamic(() => import('@/components/CredentialsSection').then(m => ({ default: m.CredentialsSection })));
const VanguardJournal   = dynamic(() => import('@/components/VanguardJournal').then(m => ({ default: m.VanguardJournal })));
const ConversionStrip   = dynamic(() => import('@/components/ConversionStrip').then(m => ({ default: m.ConversionStrip })));
const StudentStrip      = dynamic(() => import('@/components/StudentStrip').then(m => ({ default: m.StudentStrip })));
const FAQ               = dynamic(() => import('@/components/faq').then(m => ({ default: m.FAQ })));
const VanguardInquiry   = dynamic(() => import('@/components/VanguardInquiry').then(m => ({ default: m.VanguardInquiry })));
const VanguardMarquee   = dynamic(() => import('@/components/VanguardMarquee').then(m => ({ default: m.VanguardMarquee })));
const VanguardFooter    = dynamic(() => import('@/components/VanguardFooter').then(m => ({ default: m.VanguardFooter })));

// Regenerate at most once per hour — keeps blog section fresh without a redeploy.
// On-demand revalidation via /api/revalidate still works instantly.
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getLocaleMetadata(locale);
  return buildPageMetadata({
    locale,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    path: "",
    ogLocale: seo.ogLocale,
    absolute: true,
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
            className="border-t border-current/10 relative overflow-hidden"
            style={{ scrollMarginTop: 'var(--nav-h)' }}
          >
            <MethodologySteps
              heading={t('heading')}
              headingItalic={t('headingItalic')}
              sectionLabel={t('sectionLabel')}
              stepLabel={t('stepLabel')}
              steps={methodSteps}
            />
          </section>

          {/* §5: CREDENTIALS */}
          <CredentialsSection />

          {/* §6: READS */}
          <section id="reads" className="dark section-sm bg-background text-foreground border-t border-current/10" style={{ scrollMarginTop: 'var(--nav-h)' }}>
            <VanguardJournal initialArticles={articles} />
          </section>
        </DarkZoneWrapper>

        {/* §7: CONVERSION STRIP — Light zone */}
        <ConversionStrip />

        {/* §7.5: STUDENT STRIP — For existing students */}
        <StudentStrip />

        {/* §8: FAQ — Light zone */}
        <FAQ />

        {/* §9: CONTACT — Light zone */}
        <section
          id="contact"
          className="section-md border-t border-foreground/5 bg-background text-foreground"
          style={{ scrollMarginTop: 'var(--nav-h)' }}
        >
          <VanguardInquiry />
        </section>

        {/* §10: MARQUEE */}
        <section
          className="light py-10 lg:py-14 overflow-hidden border-t border-foreground/5 bg-foreground"
          aria-label="Credentials and certifications"
        >
          <VanguardMarquee />
        </section>

      </main>

      <VanguardFooter />
    </>
  );
}
