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
    // Lead with "English classes" — 10× higher search volume than "English teacher"
    title: "English Classes Ho Chi Minh City | Native Teacher | HCMC",
    description: "Small-group English classes in Phú Nhuận, HCMC. Max 10 students. Native teacher, TESOL & PGCE certified. Kids from age 6, teens & IELTS prep. Near Tân Sơn Nhất airport. Free trial week.",
    ogLocale: "en_US",
    keywords: [
      // Primary — highest volume local
      "English classes Ho Chi Minh City",
      "English classes near me Saigon",
      "English lessons Ho Chi Minh City",
      "English school Ho Chi Minh City",
      "English language school HCMC",
      "English classes Phu Nhuan",
      "English classes Go Vap",
      "English classes Binh Thanh",
      // Children — high parental intent
      "English classes for kids Ho Chi Minh City",
      "English for children Saigon",
      "English school for kids HCMC",
      "kids English class Phu Nhuan",
      "English lessons for children Ho Chi Minh",
      // Teens & IELTS
      "IELTS preparation Ho Chi Minh City",
      "IELTS classes Saigon",
      "IELTS tutor HCMC",
      "English for teenagers HCMC",
      // Native teacher / small group differentiator
      "native English teacher Ho Chi Minh City",
      "small group English class HCMC",
      "English tutor Saigon",
      "private English class HCMC",
      // Competitor category — language schools HCMC
      "language school Ho Chi Minh City",
      "language school Phu Nhuan",
      "English language center HCMC",
      // Location signals
      "English class near Tan Son Nhat airport",
      "English teacher Golden Mansion Phu Nhuan",
      // Credentials
      "TESOL certified English teacher Vietnam",
      "certified English teacher Ho Chi Minh",
      // Online
      "online English classes Vietnam",
      "online English lessons HCMC",
    ],
  },
  vi: {
    // Lead with "lớp tiếng Anh" — what Vietnamese parents actually search
    title: "Lớp Tiếng Anh Phú Nhuận · Giáo Viên Nước Ngoài | TPHCM",
    description: "Lớp tiếng Anh nhóm nhỏ tối đa 10 học sinh tại Phú Nhuận, TPHCM. Giáo viên nước ngoài bản ngữ chứng chỉ TESOL. Trẻ em từ 6 tuổi, thiếu niên & luyện thi IELTS. Học thử 1 tuần miễn phí.",
    ogLocale: "vi_VN",
    keywords: [
      // HIGH VOLUME — general class searches (most searched terms in VN)
      "lớp tiếng Anh TPHCM",
      "trung tâm tiếng Anh TPHCM",
      "học tiếng Anh TPHCM",
      "lớp tiếng Anh nhóm nhỏ",
      "tiếng Anh giao tiếp TPHCM",
      "trung tâm Anh ngữ TPHCM",
      "lớp Anh văn TPHCM",
      // NEAR ME — "gần đây" equivalents (critical for Maps)
      "lớp tiếng Anh gần đây",
      "trung tâm tiếng Anh gần nhà",
      "giáo viên tiếng Anh gần đây",
      "lớp tiếng Anh gần Phú Nhuận",
      "lớp tiếng Anh quanh đây",
      // DISTRICT — Phú Nhuận (primary)
      "lớp tiếng Anh Phú Nhuận",
      "trung tâm tiếng Anh Phú Nhuận",
      "giáo viên tiếng Anh Phú Nhuận",
      "gia sư tiếng Anh Phú Nhuận",
      "trung tâm ngoại ngữ Phú Nhuận",
      // DISTRICT — Gò Vấp
      "lớp tiếng Anh Gò Vấp",
      "trung tâm tiếng Anh Gò Vấp",
      "gia sư tiếng Anh Gò Vấp",
      "dạy kèm tiếng Anh Gò Vấp",
      "trung tâm Anh ngữ Gò Vấp",
      // DISTRICT — Bình Thạnh & adjacent
      "lớp tiếng Anh Bình Thạnh",
      "lớp tiếng Anh Tân Bình",
      "lớp tiếng Anh quận 3",
      // CHILDREN — highest parental intent
      "lớp tiếng Anh cho trẻ em TPHCM",
      "học tiếng Anh cho bé",
      "lớp tiếng Anh thiếu nhi TPHCM",
      "dạy tiếng Anh cho trẻ từ 6 tuổi",
      "lớp tiếng Anh trẻ em Phú Nhuận",
      "lớp tiếng Anh trẻ em Gò Vấp",
      "lớp Anh văn thiếu nhi TPHCM",
      "cho con học tiếng Anh ở đâu TPHCM",
      "học tiếng Anh từ mấy tuổi",
      // TEENS
      "lớp tiếng Anh thiếu niên TPHCM",
      "tiếng Anh cho học sinh trung học",
      // IELTS
      "luyện thi IELTS TPHCM",
      "luyện thi IELTS Phú Nhuận",
      "khóa học IELTS TPHCM",
      "ôn thi IELTS Sài Gòn",
      "lớp IELTS nhóm nhỏ TPHCM",
      // NATIVE TEACHER — key differentiator
      "học tiếng Anh với người nước ngoài",
      "giáo viên bản ngữ tiếng Anh TPHCM",
      "giáo viên nước ngoài dạy tiếng Anh",
      "thầy giáo tiếng Anh người nước ngoài TPHCM",
      // LANGUAGE SCHOOL CATEGORY — same terms as ILA / Apollo / VUS
      "trung tâm Anh ngữ uy tín TPHCM",
      "Anh văn giao tiếp TPHCM",
      "lớp tiếng Anh chất lượng cao",
      "lớp tiếng Anh sĩ số nhỏ",
      // CREDENTIALS
      "giáo viên tiếng Anh chứng chỉ TESOL TPHCM",
      // LOCATION
      "lớp tiếng Anh 119 Phổ Quang",
      "học tiếng Anh gần sân bay Tân Sơn Nhất",
      // ONLINE
      "lớp tiếng Anh online TPHCM",
      "học tiếng Anh online với người nước ngoài",
    ],
  },
  zh: {
    // Lead with "英语课程" (English courses) — higher search volume than "英语教师"
    title: "胡志明市英语培训班 · 外籍TESOL教师 · 小班教学 · 富润郡",  // ~30 display chars ✓
    description: "胡志明市富润郡小班英语课程，最多10名学生。外籍母语教师，TESOL及PGCE认证。儿童（6岁起）、青少年及雅思备考。近新山一机场。免费试课一周。",
    ogLocale: "zh_CN",
    keywords: [
      // High volume — Chinese speakers in HCMC
      "胡志明市英语培训班",
      "胡志明市英语课程",
      "西贡英语班",
      "富润郡英语课程",
      "小班英语胡志明市",
      "外籍英语教师胡志明市",
      "英语语言学校胡志明",
      // Children
      "胡志明市儿童英语课",
      "越南儿童英语培训",
      "英语幼儿班胡志明",
      // IELTS
      "雅思备考胡志明市",
      "雅思培训越南",
      // Differentiators
      "母语外教英语课越南",
      "最多10人英语小班",
      "TESOL认证英语教师越南",
      // Online
      "在线英语课越南",
      "网上英语培训胡志明",
    ],
  },
  ru: {
    // Lead with "курсы английского" (English courses)
    title: "Курсы английского в Хошимине · Малые группы · Фу Ньюан",
    description: "Курсы английского в малых группах (макс. 10 чел.) в районе Фу Ньюан, Хошимин. Носитель языка, сертификаты TESOL и PGCE. Дети от 6 лет, подростки, подготовка к IELTS. Первая неделя бесплатно.",
    ogLocale: "ru_RU",
    keywords: [
      // High volume — Russian expat community
      "курсы английского Хошимин",
      "школа английского Хошимин",
      "английский язык Хо Ши Мин",
      "уроки английского Хошимин",
      "языковые курсы Хошимин",
      // Children
      "английский для детей Хошимин",
      "английский для детей Вьетнам",
      "детские курсы английского Сайгон",
      // IELTS
      "подготовка к IELTS Хошимин",
      "курсы IELTS Вьетнам",
      // Differentiators
      "носитель языка английский Вьетнам",
      "малые группы английского Хошимин",
      "репетитор английского Хошимин",
      "TESOL преподаватель английского Вьетнам",
      // Online
      "онлайн английский Вьетнам",
      "онлайн уроки английского Хошимин",
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
  absolute = false,
}: {
  locale: string;
  title: string;
  description: string;
  keywords?: string[];
  path: string;
  ogLocale?: string;
  absolute?: boolean;
}): Metadata {
  const fullPath = `/${locale}${path}`;
  return {
    title: absolute ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `${SITE_URL}${fullPath}`,
      languages: buildLocaleAlternates((loc) => `${SITE_URL}/${loc}${path}`),
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
