import type { Metadata } from "next";
import { Barlow_Condensed, Be_Vietnam_Pro } from "next/font/google";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ThemeProvider } from "@/components/theme-provider";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ClientLayout } from "@/components/client-layout";
import { routing } from "@/i18n/routing";
import "../globals.css";

/* ── Fonts ─────────────────────────────────────────────────────────────────
   Barlow Condensed: native Vietnamese + Latin Extended coverage.
   Be Vietnam Pro:   designed for Vietnamese, replaces body mono font.
   Both declared here so the CSS variables are available everywhere.     */

const display = Barlow_Condensed({
  subsets: ["latin", "latin-ext", "vietnamese"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "600", "700", "800"],
  style: ["normal", "italic"],
});

const sans = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
});

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://teacherbek.com"),
  title: {
    default: "English Teacher Phú Nhuận · 2,000+ Students · HCMC",
    template: "%s · Teacher Bek · Phú Nhuận",
  },
  description:
    "TESOL & PGCE certified. Max 10 per class. Kids age 6+, teens & IELTS at Phổ Quang, Phú Nhuận — near Tân Sơn Nhất airport. Free trial class.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": 155,
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Enables static rendering — locale comes from URL params, not request headers
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${sans.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Browser chrome colour matches page background */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f7f7f7" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#101010" />


        {/* LocalBusiness + LanguageSchool structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LanguageSchool",
              "@id": "https://teacherbek.com/#organization",
              name: "Teacher Bek English Classes",
              alternateName: [
                "Teacher Bek",
                "Lớp Tiếng Anh Teacher Bek",
                "Teacher Bek Anh Ngữ",
              ],
              description:
                "Small-group English classes in Ho Chi Minh City. Maximum 10 students per class. Native teacher, TESOL & PGCE certified. Programs for children ages 6+, teens, and IELTS preparation. Located at 119 Phổ Quang, Phú Nhuận — near Tân Sơn Nhất airport.",
              url: "https://teacherbek.com",
              telephone: "+84353885757",
              email: "hello@teacherbek.com",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "119 Phổ Quang",
                addressLocality: "Phú Nhuận",
                addressRegion: "Ho Chi Minh City",
                addressCountry: "VN",
                postalCode: "72411",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 10.8016,
                longitude: 106.6524,
              },
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                  ],
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
              areaServed: [
                {
                  "@type": "City",
                  name: "Ho Chi Minh City",
                  sameAs: "https://www.wikidata.org/wiki/Q1854",
                },
                {
                  "@type": "AdministrativeArea",
                  name: "Phú Nhuận District",
                },
                {
                  "@type": "AdministrativeArea",
                  name: "Gò Vấp District",
                },
                {
                  "@type": "AdministrativeArea",
                  name: "Bình Thạnh District",
                },
              ],
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "English Language Programs",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Young Learners English",
                      description:
                        "English classes for children ages 6–10. Max 10 students per class.",
                    },
                    price: "1990000",
                    priceCurrency: "VND",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "Teens English",
                      description:
                        "English classes for teenagers ages 11–17. Communicative fluency focus.",
                    },
                    price: "1990000",
                    priceCurrency: "VND",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Course",
                      name: "IELTS Preparation",
                      description:
                        "IELTS exam preparation covering all four skills. Small groups, max 10 students.",
                    },
                    price: "1990000",
                    priceCurrency: "VND",
                  },
                ],
              },
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer service",
                telephone: "+84353885757",
                email: "hello@teacherbek.com",
                availableLanguage: [
                  "English",
                  "Vietnamese",
                  "Russian",
                  "Uzbek",
                ],
              },
              sameAs: [
                "https://www.linkedin.com/in/bek-boymirzaev/",
                "https://www.instagram.com/itsteacherbek",
                "https://www.facebook.com/teacherbek",
                "https://www.tiktok.com/@itsteacherbek",
              ],
            }),
          }}
        />
      </head>

      <body className="font-sans antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:bg-foreground focus:text-background focus:px-5 focus:py-3 font-sans text-[13px] uppercase tracking-[0.18em]"
        >
          Skip to main content
        </a>

        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                window.gtag = gtag;
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
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
          <NextIntlClientProvider messages={messages}>
            <SmoothScroll>
              <ClientLayout>{children}</ClientLayout>
            </SmoothScroll>
          </NextIntlClientProvider>
        </ThemeProvider>

        <SpeedInsights />
      </body>
    </html>
  );
}
