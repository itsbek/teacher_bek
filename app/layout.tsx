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
    // Vietnamese — local high-intent
    "giáo viên tiếng Anh Phú Nhuận",
    "giáo viên tiếng Anh Gò Vấp",
    "gia sư tiếng Anh Bình Thạnh",
    "dạy tiếng Anh TPHCM",
    "lớp tiếng Anh nhóm nhỏ Sài Gòn",
    "luyện thi IELTS Phú Nhuận",
    "giáo viên bản ngữ tiếng Anh TPHCM",
    "lớp tiếng Anh cho trẻ em từ 6 tuổi",
    "học tiếng Anh 119 Phổ Quang",
    "tiếng Anh tối đa 10 học sinh",
    "học tiếng Anh gần sân bay Tân Sơn Nhất",
    "trung tâm tiếng Anh Phú Nhuận",
    "giáo viên TESOL TPHCM",
    // English — local + global
    "English teacher Phu Nhuan",
    "English teacher Ho Chi Minh City",
    "English tutor Saigon",
    "English lessons Go Vap",
    "English classes Binh Thanh",
    "TESOL certified English teacher Vietnam",
    "native English teacher Ho Chi Minh",
    "English for kids Saigon",
    "IELTS preparation Ho Chi Minh City",
    "small group English lessons HCMC",
    "English teacher ILA Vietnam",
    "certified English teacher Vietnam",
    // Chinese — expat community HCMC
    "胡志明市英语教师",
    "TESOL认证英语教师越南",
    "小班英语课程胡志明",
    "儿童英语课程胡志明市",
    "雅思备考胡志明",
    // Russian — expat/diaspora
    "учитель английского Хошимин",
    "английский для детей Вьетнам",
    "TESOL преподаватель английского Вьетнам",
    "малые группы английского Сайгон",
  ],
  authors: [{ name: "Teacher Bek" }],
  creator: "Teacher Bek",
  publisher: "Teacher Bek",
  alternates: {
    languages: {
      'en': '/en',
      'vi': '/vi',
      'zh': '/zh',
      'ru': '/ru',
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Mobile browser chrome: matches page bg color in light/dark */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f7f7" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#101010" />
        {/* Preconnect to Google Fonts CDN — shaves 100-300ms off font load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["EducationalOrganization", "LocalBusiness"],
              "@id": "https://teacherbek.com/#organization",
              "name": "Teacher Bek",
              "alternateName": ["Teacher Bek English", "Lớp Tiếng Anh Teacher Bek"],
              "description": "Small-group English lessons in Ho Chi Minh City. TESOL & PGCE certified. Maximum 10 students per class. Programs for children (ages 6+), teens, and IELTS preparation.",
              "url": "https://teacherbek.com",
              "telephone": "+84353885757",
              "email": "hello@teacherbek.com",
              "priceRange": "$$",
              "currenciesAccepted": "VND",
              "paymentAccepted": "Cash, Bank Transfer",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "119 Phổ Quang, Golden Mansion 1",
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
                { "@type": "AdministrativeArea", "name": "Phú Nhuận District, Ho Chi Minh City" },
                { "@type": "AdministrativeArea", "name": "Gò Vấp District, Ho Chi Minh City" },
                { "@type": "AdministrativeArea", "name": "Bình Thạnh District, Ho Chi Minh City" },
                { "@type": "AdministrativeArea", "name": "Ho Chi Minh City, Vietnam" }
              ],
              "serviceType": [
                "English Language Teaching",
                "Small-Group English Lessons",
                "IELTS Preparation",
                "English for Children",
                "English for Teenagers",
                "Online English Lessons"
              ],
              "maximumAttendeeCapacity": 10,
              "employee": {
                "@id": "https://teacherbek.com/#teacher-bek"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+84353885757",
                "email": "hello@teacherbek.com",
                "availableLanguage": ["English", "Vietnamese", "Russian", "Uzbek"],
                "contactOption": "TollFree"
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
