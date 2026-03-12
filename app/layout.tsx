import type { Metadata } from "next";
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Display font: Barlow Condensed
   Condensed + bold like Sofia SC, but with NATIVE Vietnamese + Latin Extended support.
   No fallback needed — one font covers all characters for EN and VI. */
const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

/* Body font: Be Vietnam Pro
   Designed specifically for Vietnamese. Replaces Spline Sans Mono entirely.
   Weight 300 maintains the light editorial body aesthetic. */
const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});


const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

export const metadata: Metadata = {
  metadataBase: new URL('https://teacherbek.com'),
  title: {
    default: "English Teacher Phú Nhuận · 2,000+ Students · HCMC",
    template: "%s · Teacher Bek · Phú Nhuận"
  },
  description: "TESOL & PGCE certified. Max 10 per class. Kids age 6+, teens & IELTS at Phổ Quang, Phú Nhuận — near Tân Sơn Nhất airport. Free trial class.",
  keywords: [
    // Vietnamese — highest volume local searches
    "lớp tiếng Anh TPHCM",
    "trung tâm tiếng Anh TPHCM",
    "lớp tiếng Anh Phú Nhuận",
    "lớp tiếng Anh Gò Vấp",
    "lớp tiếng Anh gần đây",
    "trung tâm tiếng Anh gần nhà",
    "lớp tiếng Anh cho trẻ em",
    "học tiếng Anh với người nước ngoài",
    "giáo viên bản ngữ tiếng Anh TPHCM",
    "luyện thi IELTS TPHCM",
    "lớp IELTS nhóm nhỏ TPHCM",
    "tiếng Anh giao tiếp TPHCM",
    "trung tâm Anh ngữ Phú Nhuận",
    "học tiếng Anh gần sân bay Tân Sơn Nhất",
    // English — local + global
    "English classes Ho Chi Minh City",
    "English classes near me Saigon",
    "English school HCMC",
    "language school Ho Chi Minh City",
    "English for kids Saigon",
    "IELTS preparation Ho Chi Minh City",
    "small group English class HCMC",
    "native English teacher Ho Chi Minh City",
    "TESOL certified English teacher Vietnam",
    "English classes Phu Nhuan",
    "English classes Go Vap",
    // Chinese
    "胡志明市英语培训班",
    "富润郡英语课程",
    "小班英语胡志明市",
    "外籍英语教师胡志明市",
    "雅思备考胡志明市",
    // Russian
    "курсы английского Хошимин",
    "английский для детей Хошимин",
    "малые группы английского Хошимин",
    "носитель языка английский Вьетнам",
  ],
  authors: [{ name: "Teacher Bek" }],
  creator: "Teacher Bek",
  publisher: "Teacher Bek",
  alternates: {
    canonical: 'https://teacherbek.com/en',
    languages: {
      'en': 'https://teacherbek.com/en',
      'vi': 'https://teacherbek.com/vi',
      'zh': 'https://teacherbek.com/zh',
      'ru': 'https://teacherbek.com/ru',
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: "https://teacherbek.com",
    siteName: "Teacher Bek",
    title: "English Teacher Phú Nhuận · 2,000+ Students · HCMC",
    description: "TESOL & PGCE certified. Max 10 per class. Kids age 6+, teens & IELTS at Phổ Quang, Phú Nhuận — near Tân Sơn Nhất airport.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "English Teacher in Ho Chi Minh City"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "English Teacher in Ho Chi Minh City",
    description: "Dạy tiếng Anh tại Gò Vấp, Phú Nhuận, Bình Thạnh",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': 155,
    },
  },
  other: {
    'geo.region': 'VN-SG',
    'geo.placename': 'Ho Chi Minh City',
    'geo.position': '10.8231;106.6297',
    'ICBM': '10.8231, 106.6297',
  },
};

import { SmoothScroll } from "@/components/SmoothScroll";
import { getLocale } from "next-intl/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Mobile browser chrome: matches page bg color in light/dark */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f7f7" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#101010" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LanguageSchool",
              "@id": "https://teacherbek.com/#organization",
              "name": "Teacher Bek English Classes",
              "alternateName": ["Teacher Bek", "Lớp Tiếng Anh Teacher Bek", "Teacher Bek Anh Ngữ"],
              "description": "Small-group English classes in Ho Chi Minh City. Maximum 10 students per class. Native teacher, TESOL & PGCE certified. Programs for children ages 6+, teens, and IELTS preparation. Located at 119 Phổ Quang, Phú Nhuận — near Tân Sơn Nhất airport.",
              "keywords": "lớp tiếng Anh Phú Nhuận, trung tâm tiếng Anh TPHCM, English classes Ho Chi Minh City, IELTS preparation Saigon, English for kids HCMC, giáo viên nước ngoài TPHCM, small group English class",
              "url": "https://teacherbek.com",
              "telephone": "+84353885757",
              "email": "hello@teacherbek.com",
              "priceRange": "$$",
              "currenciesAccepted": "VND",
              "paymentAccepted": "Cash, Bank Transfer",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "119 Phổ Quang",
                "addressLocality": "Phú Nhuận",
                "addressRegion": "Ho Chi Minh City",
                "addressCountry": "VN",
                "postalCode": "72411"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 10.8016,
                "longitude": 106.6524
              },
              "hasMap": "https://maps.google.com/?q=119+Pho+Quang+Phu+Nhuan+Ho+Chi+Minh+City",
              "openingHoursSpecification": [
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  "opens": "19:30",
                  "closes": "21:00"
                },
                {
                  "@type": "OpeningHoursSpecification",
                  "dayOfWeek": ["Saturday", "Sunday"],
                  "opens": "14:00",
                  "closes": "20:00"
                }
              ],
              "areaServed": [
                { "@type": "City", "name": "Ho Chi Minh City", "sameAs": "https://www.wikidata.org/wiki/Q1854" },
                { "@type": "AdministrativeArea", "name": "Phú Nhuận District" },
                { "@type": "AdministrativeArea", "name": "Gò Vấp District" },
                { "@type": "AdministrativeArea", "name": "Bình Thạnh District" },
                { "@type": "AdministrativeArea", "name": "Tân Bình District" }
              ],
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "English Language Programs",
                "itemListElement": [
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Course",
                      "name": "Young Learners English",
                      "description": "English classes for children ages 6–10. Max 10 students per class."
                    },
                    "price": "1990000",
                    "priceCurrency": "VND"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Course",
                      "name": "Teens English",
                      "description": "English classes for teenagers ages 11–17. Communicative fluency focus."
                    },
                    "price": "1990000",
                    "priceCurrency": "VND"
                  },
                  {
                    "@type": "Offer",
                    "itemOffered": {
                      "@type": "Course",
                      "name": "IELTS Preparation",
                      "description": "IELTS exam preparation covering all four skills. Small groups, max 10 students."
                    },
                    "price": "1990000",
                    "priceCurrency": "VND"
                  }
                ]
              },
              "employee": {
                "@id": "https://teacherbek.com/#teacher-bek"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+84353885757",
                "email": "hello@teacherbek.com",
                "availableLanguage": ["English", "Vietnamese", "Russian", "Uzbek"]
              },
              "sameAs": [
                "https://www.linkedin.com/in/bek-boymirzaev/",
                "https://www.instagram.com/itsteacherbek",
                "https://www.facebook.com/teacherbek",
                "https://www.tiktok.com/@itsteacherbek"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          <SmoothScroll>
            {children}
          </SmoothScroll>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
