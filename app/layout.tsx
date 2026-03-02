import type { Metadata } from "next";
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
  metadataBase: new URL('https://englishwithconfidence.com'),
  title: {
    default: "Giáo viên tiếng Anh tại TP.HCM | English Teacher in Ho Chi Minh City",
    template: "%s | English Teacher HCMC"
  },
  description: "Giáo viên tiếng Anh tại Gò Vấp, Phú Nhuận, Bình Thạnh. 3 năm kinh nghiệm tại ILA Vietnam, Blue Sky Academy. Dạy kèm tiếng Anh cho trẻ em và người lớn. English teacher in Ho Chi Minh City with experience at ILA Vietnam and Blue Sky Academy.",
  keywords: [
    "giáo viên tiếng Anh Gò Vấp",
    "dạy tiếng Anh Phú Nhuận",
    "học tiếng Anh Bình Thạnh",
    "gia sư tiếng Anh TPHCM",
    "dạy kèm tiếng Anh quận Gò Vấp",
    "lớp tiếng Anh cho trẻ em",
    "giáo viên bản ngữ tiếng Anh",
    "học tiếng Anh tại nhà TPHCM",
    "English teacher Ho Chi Minh",
    "English tutor Saigon",
    "English teacher Ho Chi Minh City",
    "English lessons Go Vap",
    "English tutor Phu Nhuan",
    "English classes Binh Thanh",
    "ILA Vietnam teacher",
    "Blue Sky Academy English",
    "private English lessons HCMC",
    "English for kids Saigon",
    "learn English Ho Chi Minh",
    "native English teacher Vietnam"
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
    url: "https://englishwithconfidence.com",
    siteName: "Teacher Bek",
    title: "Giáo viên tiếng Anh tại TP.HCM | English Teacher Ho Chi Minh City",
    description: "Giáo viên tiếng Anh kinh nghiệm tại Gò Vấp, Phú Nhuận, Bình Thạnh. Dạy kèm cho trẻ em và người lớn.",
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
      'max-snippet': -1,
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
              "@type": "EducationalOrganization",
              "name": "Teacher Bek",
              "description": "Small-group English lessons in Ho Chi Minh City",
              "url": "https://englishwithconfidence.com",
              "sameAs": [
                "https://www.linkedin.com",
                "https://www.instagram.com"
              ],
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ho Chi Minh City",
                "addressRegion": "Ho Chi Minh",
                "addressCountry": "VN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 10.8231,
                "longitude": 106.6297
              },
              "areaServed": [
                { "@type": "City", "name": "Go Vap District, Ho Chi Minh City" },
                { "@type": "City", "name": "Phu Nhuan District, Ho Chi Minh City" },
                { "@type": "City", "name": "Binh Thanh District, Ho Chi Minh City" }
              ],
              "serviceType": ["English Language Teaching", "Private English Lessons", "English Tutoring"],
              "contactPoint": [{
                "@type": "ContactPoint",
                "contactType": "customer support",
                "email": "hello@teacherbek.com",
                "availableLanguage": ["English", "Vietnamese", "Chinese", "Russian"]
              }],
              "priceRange": "$$",
              "knowsLanguage": ["en", "vi", "zh", "ru"]
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
      </body>
    </html>
  );
}
