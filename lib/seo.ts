import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://teacherbek.com";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

// ─── Locale-specific SEO data ──────────────────────────────────────────────
// Each locale targets its own search context:
//   vi  → Vietnamese families in Phu Nhuan / Go Vap / Binh Thanh (highest volume local)
//   zh  → Chinese-speaking expat/resident families in HCMC
//   en  → Expat families + global online searchers
//   ru  → Russian-speaking diaspora / expat community in HCMC and online
// ─────────────────────────────────────────────────────────────────────────────
const localeData: Record<string, {
  title: string;
  description: string;
  keywords: string[];
  ogLocale: string;
}> = {
  en: {
    title: "English Teacher Phú Nhuận, HCMC · TESOL & PGCE · 2,000+ Students",
    description: "Small-group English in Ho Chi Minh City. TESOL & PGCE certified. Max 10 students. Kids 6+, teens & IELTS at 119 Phổ Quang, Phú Nhuận — near Tân Sơn Nhất. Free trial week.",
    ogLocale: "en_US",
    keywords: [
      // Local HCMC — high-intent English searches
      "English teacher Phu Nhuan",
      "English teacher Ho Chi Minh City",
      "English tutor Saigon",
      "English lessons Go Vap",
      "English classes Binh Thanh",
      "English teacher near Tan Son Nhat airport",
      "small group English lessons HCMC",
      "TESOL certified English teacher Vietnam",
      "native English teacher Ho Chi Minh",
      "English for kids Saigon",
      "IELTS preparation Phu Nhuan",
      "IELTS tutor Ho Chi Minh City",
      "private English tutor HCMC",
      "English lessons for children Ho Chi Minh",
      "English teacher ILA Vietnam",
      "English teacher Golden Mansion Phu Nhuan",
      // Global / online
      "certified English teacher Vietnam",
      "online English lessons Vietnam",
      "small group English class Vietnam",
      "TESOL PGCE English teacher",
      "English fluency lessons Vietnam",
    ],
  },
  vi: {
    title: "Giáo Viên Tiếng Anh Phú Nhuận, TPHCM · TESOL & PGCE · 2.000+ Học Sinh",
    description: "Lớp tiếng Anh nhóm nhỏ (tối đa 10 học sinh) tại Phú Nhuận, Gò Vấp, Bình Thạnh. Giáo viên bản ngữ có chứng chỉ TESOL & PGCE. Trẻ em từ 6 tuổi, thiếu niên và luyện thi IELTS. Tuần học thử miễn phí.",
    ogLocale: "vi_VN",
    keywords: [
      // Phú Nhuận / district-level intent
      "giáo viên tiếng Anh Phú Nhuận",
      "lớp tiếng Anh 119 Phổ Quang",
      "tiếng Anh Golden Mansion Phú Nhuận",
      // District-level: Gò Vấp, Bình Thạnh
      "gia sư tiếng Anh Gò Vấp",
      "lớp tiếng Anh Bình Thạnh",
      "dạy kèm tiếng Anh Gò Vấp",
      // HCMC-wide searches
      "giáo viên tiếng Anh bản ngữ TPHCM",
      "gia sư tiếng Anh TPHCM",
      "lớp tiếng Anh nhóm nhỏ Sài Gòn",
      "tiếng Anh tối đa 10 học sinh",
      // Children / ages
      "lớp tiếng Anh cho trẻ em từ 6 tuổi",
      "tiếng Anh cho bé TPHCM",
      "học tiếng Anh trẻ em Gò Vấp",
      // Teens / IELTS
      "luyện thi IELTS Phú Nhuận",
      "ôn thi IELTS TPHCM",
      "tiếng Anh thiếu niên Sài Gòn",
      // Credentials / trust
      "giáo viên TESOL TPHCM",
      "thầy giáo tiếng Anh chứng chỉ TESOL PGCE",
      // Landmark / location
      "học tiếng Anh gần sân bay Tân Sơn Nhất",
      "trung tâm tiếng Anh Phú Nhuận uy tín",
    ],
  },
  zh: {
    title: "胡志明市英语教师 · TESOL认证 · 富润郡 · 2000+学生",
    description: "胡志明市富润郡小班英语课程（最多10名学生）。TESOL和PGCE认证外籍教师。儿童（6岁起）、青少年及雅思备考。119 Phổ Quang富润郡，近新山一机场。免费试课一周。",
    ogLocale: "zh_CN",
    keywords: [
      // HCMC local — Chinese community
      "胡志明市英语教师",
      "富润郡英语课程",
      "越南小班英语最多10人",
      "TESOL认证外籍英语教师越南",
      "胡志明市儿童英语课",
      "英语补习班富润郡",
      // IELTS
      "雅思备考胡志明市",
      "IELTS培训越南",
      // Global / diaspora
      "越南英语辅导",
      "外籍英语教师越南",
      "在线英语课越南",
      "英语口语课胡志明",
    ],
  },
  ru: {
    title: "Учитель английского в Хошимине · TESOL & PGCE · 2000+ учеников",
    description: "Занятия английским в малых группах в Хошимине (макс. 10 чел). Сертификаты TESOL и PGCE. Дети от 6 лет, подростки и подготовка к IELTS в районе Фу Ньюан. Пробная неделя бесплатно.",
    ogLocale: "ru_RU",
    keywords: [
      // HCMC local — Russian-speaking expat community
      "учитель английского Хошимин",
      "репетитор английского Хо Ши Мин",
      "уроки английского Фу Ньюан Вьетнам",
      "английский для детей Вьетнам",
      // IELTS
      "подготовка к IELTS Хошимин",
      "IELTS курсы Вьетнам",
      // Credentials / trust
      "TESOL сертифицированный преподаватель английского",
      "иностранный учитель английского Вьетнам",
      // Global / diaspora
      "онлайн английский Вьетнам",
      "малые группы английского Сайгон",
      "английский язык Хо Ши Мин",
      "английский для школьников Вьетнам",
    ],
  },
};

export function getLocaleMetadata(locale: string) {
  return localeData[locale] ?? localeData.en;
}

export function buildLocaleAlternates(pathnameByLocale: (locale: string) => string): Record<string, string> {
  return routing.locales.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = pathnameByLocale(locale);
    return acc;
  }, {});
}

export function buildPageMetadata({
  locale,
  title,
  description,
  keywords,
  path,
  ogLocale,
}: {
  locale: string;
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogLocale?: string;
}): Metadata {
  const fullPath = `/${locale}${path}`;
  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: fullPath,
      languages: buildLocaleAlternates((loc) => `/${loc}${path}`),
    },
    openGraph: {
      type: "website",
      locale: ogLocale ?? "en_US",
      url: `${SITE_URL}${fullPath}`,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Teacher Bek — English lessons in Ho Chi Minh City",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
