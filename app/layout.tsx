import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["200", "300", "400", "500", "600"],
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-accent",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://englishwithconfidence.com'),
  title: {
    default: "Master English with Confidence | Professional English Teacher",
    template: "%s | English with Confidence"
  },
  description: "Personalized one-on-one English lessons for Vietnamese, Chinese, and Russian speakers. Achieve fluency faster with proven methods from a certified TEFL/TESOL teacher with 10+ years experience.",
  keywords: ["English teacher", "English lessons", "learn English", "TEFL", "TESOL", "Vietnamese learners", "Chinese learners", "Russian learners", "business English", "online English tutor"],
  authors: [{ name: "English with Confidence" }],
  creator: "English with Confidence",
  publisher: "English with Confidence",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://englishwithconfidence.com",
    siteName: "English with Confidence",
    title: "Master English with Confidence | Professional English Teacher",
    description: "Personalized one-on-one English lessons for Vietnamese, Chinese, and Russian speakers.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "English with Confidence"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Master English with Confidence",
    description: "Personalized English lessons with a certified teacher",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cormorantGaramond.variable} ${outfit.variable} ${jetBrainsMono.variable} font-sans antialiased`}>
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
        {children}
      </body>
    </html>
  );
}
