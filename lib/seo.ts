import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = "https://englishwithconfidence.com";
export const DEFAULT_OG_IMAGE = "/og-image.jpg";

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
  path,
}: {
  locale: string;
  title: string;
  description: string;
  path: string;
}): Metadata {
  const fullPath = `/${locale}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: fullPath,
      languages: buildLocaleAlternates((loc) => `/${loc}${path}`),
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${fullPath}`,
      title,
      description,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Teacher Bek English tutoring",
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
