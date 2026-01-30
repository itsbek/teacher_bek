import type { Metadata } from "next";
import { Playfair_Display, Inter, Space_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CustomCursor } from "@/components/cursor";
import { SmoothScrollProvider } from "@/components/smooth-scroll";
import { BookmarkRibbon } from "@/components/bookmark-ribbon";
import { AudioProvider } from '@/components/audio-provider';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

import { ThemeProvider } from "@/components/theme-provider";

// Professional Serif Display for Headings
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

// Professional Sans for Body
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});

// Monospace accent for numbers and labels
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "700"],
});

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
  authors: [{ name: "English Teacher HCMC" }],
  creator: "English Teacher HCMC",
  publisher: "English Teacher HCMC",
  alternates: {
    languages: {
      'en': '/en',
      'vi': '/vi',
    },
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: "en_US",
    url: "https://englishwithconfidence.com",
    siteName: "English Teacher HCMC",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "English Teacher HCMC",
              "description": "Giáo viên tiếng Anh tại TP.HCM - English lessons in Go Vap, Phu Nhuan, Binh Thanh",
              "url": "https://englishwithconfidence.com",
              "telephone": "+84",
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
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className={`${playfair.variable} ${inter.variable} ${spaceMono.variable} font-sans antialiased`} suppressHydrationWarning>
        {GA_MEASUREMENT_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AudioProvider>
            <SmoothScrollProvider>
              {children}
              <CustomCursor />
            </SmoothScrollProvider>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
