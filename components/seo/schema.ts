import { SITE_URL } from "@/lib/seo";

export type SchemaNode = Record<string, unknown>;
type Loc = "en" | "vi";

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#bek`;
const ZALO = "https://zalo.me/84353885757";

const toLoc = (locale: string): Loc => (locale === "vi" ? "vi" : "en");
const lang = (l: Loc) => (l === "vi" ? "vi-VN" : "en");

export function ogImageUrl(locale: string, page = ""): string {
  return `${SITE_URL}/${toLoc(locale)}${page}/opengraph-image`;
}

const ADDRESS = {
  "@type": "PostalAddress",
  streetAddress: "Golden Mansion 1, 119 Phổ Quang",
  addressLocality: "Phú Nhuận",
  addressRegion: "Ho Chi Minh City",
  addressCountry: "VN",
};

const PLACE = {
  "@type": "Place",
  name: "Teacher Bek classroom, Golden Mansion 1",
  address: ADDRESS,
};

export function organizationNode(locale: string, description: string): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: "Teacher Bek",
    alternateName: "Thầy Bek",
    url: `${SITE_URL}/${l}`,
    description,
    telephone: "+84353885757",
    address: ADDRESS,
    areaServed: ["Phú Nhuận", "Gò Vấp", "Bình Thạnh", "Tân Bình"].map((name) => ({
      "@type": "AdministrativeArea",
      name: `${name}, Ho Chi Minh City`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "19:30",
        closes: "21:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "14:00",
        closes: "20:00",
      },
    ],
    sameAs: [ZALO],
    image: ogImageUrl(l),
    knowsLanguage: ["en", "vi"],
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
  };
}

export function personNode(): SchemaNode {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Bek",
    jobTitle: "English teacher",
    worksFor: { "@id": ORG_ID },
    hasCredential: ["TESOL", "PGCE"].map((name) => ({
      "@type": "EducationalOccupationalCredential",
      name,
      credentialCategory: "certificate",
    })),
  };
}

export function websiteNode(locale: string): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website-${l}`,
    url: `${SITE_URL}/${l}`,
    name: "Teacher Bek",
    inLanguage: lang(l),
    publisher: { "@id": ORG_ID },
  };
}

/** minimal org node so pages other than home are self-contained for crawlers */
export function providerNode(locale: string): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": ORG_ID,
    name: "Teacher Bek",
    url: `${SITE_URL}/${l}`,
    telephone: "+84353885757",
    address: ADDRESS,
    sameAs: [ZALO],
  };
}

export function breadcrumbNode(locale: string, items: { name: string; path: string }[]): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}/${l}${it.path}`,
    })),
  };
}

export interface CourseInput {
  id: string;
  name: string;
  ages: string;
  minAge: number;
  maxAge: number;
  description: string;
}

export function courseNode(locale: string, c: CourseInput): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": "Course",
    "@id": `${SITE_URL}/${l}/classes#${c.id}`,
    name: c.name,
    description: c.description,
    inLanguage: lang(l),
    provider: { "@id": ORG_ID },
    educationalLevel: c.ages,
    typicalAgeRange: `${c.minAge}-${c.maxAge}`,
    audience: {
      "@type": "PeopleAudience",
      audienceType: c.ages,
      suggestedMinAge: c.minAge,
      suggestedMaxAge: c.maxAge,
    },
    teaches: "English",
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "onsite",
      location: PLACE,
      instructor: { "@id": PERSON_ID },
      courseSchedule: {
        "@type": "Schedule",
        repeatFrequency: "P1W",
        duration: "PT1H30M",
      },
    },
  };
}

export function faqNode(items: { q: string; a: string }[]): SchemaNode {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
}

export function articleNode(locale: string, a: { headline: string; description: string; about: string }): SchemaNode {
  const l = toLoc(locale);
  return {
    "@type": "Article",
    "@id": `${SITE_URL}/${l}/approach#article`,
    headline: a.headline,
    description: a.description,
    inLanguage: lang(l),
    mainEntityOfPage: `${SITE_URL}/${l}/approach`,
    author: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    about: { "@type": "Thing", name: a.about },
    image: ogImageUrl(l, "/approach"),
  };
}
