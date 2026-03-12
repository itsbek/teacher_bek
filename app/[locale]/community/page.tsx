import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { VanguardNavigation } from '@/components/VanguardNavigation';
import { getCommunityPosts } from '@/lib/community';

import whatILearnedData     from '@/data/what-i-learned.json';
import teachSubmissionsData from '@/data/teach-submissions.json';
import videoSubmissionsData from '@/data/video-submissions.json';

const CommunityHero = dynamic(() => import('@/components/community/CommunityHero').then(m => ({ default: m.CommunityHero })));
const CommunityHub  = dynamic(() => import('@/components/community/CommunityHub').then(m => ({ default: m.CommunityHub })));
const VanguardMarquee = dynamic(() => import('@/components/VanguardMarquee').then(m => ({ default: m.VanguardMarquee })));
const VanguardFooter  = dynamic(() => import('@/components/VanguardFooter').then(m => ({ default: m.VanguardFooter })));

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = {
    en: 'Student Community | Teacher Bek',
    vi: 'Cộng đồng học viên | Teacher Bek',
    zh: '学生社区 | Teacher Bek',
    ru: 'Сообщество студентов | Teacher Bek',
  };
  const descs: Record<string, string> = {
    en: 'Publish your writing, use the word of the week, share what you learned, and teach someone else. Your classroom beyond walls.',
    vi: 'Đăng bài viết, dùng từ của tuần, chia sẻ điều học được và dạy lại người khác.',
    zh: '发布写作、使用本周单词、分享所学、教会别人。无墙的课堂。',
    ru: 'Публикуйте работы, используйте слово недели, делитесь открытиями и учите других.',
  };
  return {
    title: titles[locale] ?? titles.en,
    description: descs[locale] ?? descs.en,
    alternates: {
      canonical: `https://teacherbek.com/${locale}/community`,
      languages: {
        en: 'https://teacherbek.com/en/community',
        vi: 'https://teacherbek.com/vi/community',
        zh: 'https://teacherbek.com/zh/community',
        ru: 'https://teacherbek.com/ru/community',
      },
    },
  };
}

type TeachEntry   = { id: string; name: string; topic: string; explanation: string; date: string; featured: boolean };
type LearnedEntry = { id: string; name: string; learned: string; date: string };
type VideoEntry   = { id: string; name: string; url: string; caption: string; date: string; featured?: boolean };

export default async function CommunityPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const writingEntries = await getCommunityPosts();
  const learned        = whatILearnedData as LearnedEntry[];
  const teachEntries   = teachSubmissionsData as TeachEntry[];
  const featuredTeach  = teachEntries.find(e => e.featured) ?? null;
  const videoEntries   = videoSubmissionsData as VideoEntry[];

  return (
    <>
      <VanguardNavigation />
      <main id="main-content" className="bg-background text-foreground">

        <CommunityHero />
        <CommunityHub
          writingEntries={writingEntries}
          learnedEntries={learned}
          videoEntries={videoEntries}
          featuredTeach={featuredTeach}
        />

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
