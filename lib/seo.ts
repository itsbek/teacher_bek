import type { Metadata } from "next";

export const SITE_URL = "https://teacherbek.com";

type SeoLocale = "en" | "vi";

export type PageKey = "home" | "classes" | "approach" | "privacy" | "terms";

interface PageSeo {
  title: string;
  description: string;
}

const OG_LOCALE: Record<SeoLocale, string> = { en: "en_US", vi: "vi_VN" };

const PAGES: Record<SeoLocale, Record<PageKey, PageSeo>> = {
  en: {
    home: {
      title: "English Teacher in Ho Chi Minh City | Teacher Bek",
      description:
        "Teacher Bek teaches English to ages 5–17 in small groups at his own classroom in Phú Nhuận, Ho Chi Minh City. The reason first, then the rule. First week free.",
    },
    classes: {
      title: "English Classes in Phú Nhuận for Ages 5–17 | Teacher Bek",
      description:
        "Small-group English classes in Phú Nhuận, Ho Chi Minh City: Young Learners 5–10 and Teens 11–17. Twice a week, near Gò Vấp and Bình Thạnh. First week free.",
    },
    approach: {
      title: "Why-First English Teaching: The Method | Teacher Bek",
      description:
        "How I teach English: the reason before the rule, light cognitive load, safe mistakes and recall through play, each with its research. Classes in Phú Nhuận.",
    },
    privacy: {
      title: "Privacy Policy | Teacher Bek",
      description:
        "How Teacher Bek collects, uses and protects the details you share through the chat: what is stored, which services process it, and how to ask for deletion.",
    },
    terms: {
      title: "Terms of Service | Teacher Bek",
      description:
        "Terms for using the Teacher Bek website and booking English classes in Phú Nhuận: scope of services, confirmation, cancellations, acceptable use and contact.",
    },
  },
  vi: {
    home: {
      title: "Giáo viên tiếng Anh Phú Nhuận | Thầy Bek",
      description:
        "Thầy Bek dạy tiếng Anh nhóm nhỏ cho các bạn 5–17 tuổi tại lớp học riêng ở Phú Nhuận, TP.HCM. Giải thích lý do trước khi học quy tắc. Tuần đầu miễn phí.",
    },
    classes: {
      title: "Học tiếng Anh Phú Nhuận cho trẻ 5–17 tuổi | Thầy Bek",
      description:
        "Lớp tiếng Anh nhóm nhỏ tại Phú Nhuận, TP.HCM, gần Gò Vấp và Bình Thạnh: Young Learners 5–10 tuổi, Teens 11–17 tuổi. Mỗi tuần hai buổi, tuần đầu miễn phí.",
    },
    approach: {
      title: "Dạy tiếng Anh bằng câu hỏi “vì sao” | Thầy Bek",
      description:
        "Cách thầy Bek dạy tiếng Anh: hiểu lý do trước khi học quy tắc, học nhẹ nhàng, được phép sai và ôn bằng trò chơi, kèm nghiên cứu. Lớp học tại Phú Nhuận, TP.HCM.",
    },
    privacy: {
      title: "Chính sách bảo mật | Thầy Bek",
      description:
        "Thầy Bek thu thập, sử dụng và bảo vệ thông tin bạn gửi qua khung chat ra sao: dữ liệu nào được lưu, dịch vụ nào xử lý và cách yêu cầu xóa dữ liệu.",
    },
    terms: {
      title: "Điều khoản dịch vụ | Thầy Bek",
      description:
        "Điều khoản khi dùng trang web Thầy Bek và đăng ký lớp tiếng Anh tại Phú Nhuận: phạm vi dịch vụ, xác nhận, hủy lịch, sử dụng hợp lệ và cách liên hệ.",
    },
  },
};
function toSeoLocale(locale: string): SeoLocale {
  return locale === "vi" ? "vi" : "en";
}

export function getPageSeo(locale: string, page: PageKey): PageSeo {
  return PAGES[toSeoLocale(locale)][page];
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const loc = toSeoLocale(locale);
  const url = `${SITE_URL}/${loc}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${SITE_URL}/en${path}`,
        vi: `${SITE_URL}/vi${path}`,
        "x-default": `${SITE_URL}/en${path}`,
      },
    },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[loc],
      alternateLocale: [OG_LOCALE[loc === "en" ? "vi" : "en"]],
      url,
      siteName: "Teacher Bek",
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    other: {
      "tdm-reservation": "1",
      "tdm-policy": `${SITE_URL}/.well-known/tdmrep.json`,
    },
  };
}
