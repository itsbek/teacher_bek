import type { Metadata } from "next";
import localFont from "next/font/local";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ErrorMonitor } from "@/components/monitoring/ErrorMonitor";
import { Analytics } from "@/components/monitoring/Analytics";
import { GA_ID } from "@/lib/analytics";
import { NotebookRuntime } from "@/components/notebook/NotebookRuntime";
import type { CoreStrings, NoteText } from "@/lib/notebook/core";
import { routing } from "@/i18n/routing";
/* Order matters (same cascade as the prototype): brand → pages → story → notebook. story.css only
   styles story markup, except a few rules scoped with :root:has(#hero). */
import "../../styles/brand.css";
import "../../styles/pages.css";
import "../../styles/story.css";
import "../../styles/notebook.css";

const archivo = localFont({
  src: "../../public/fonts/archivo-vf.woff2",
  weight: "300 800",
  style: "normal",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Arial Narrow", "Arial", "sans-serif"],
  variable: "--font-archivo",
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});

const newsreader = localFont({
  src: [
    { path: "../../public/fonts/newsreader-vf.woff2", weight: "300 500", style: "normal" },
    { path: "../../public/fonts/newsreader-italic-vf.woff2", weight: "300 500", style: "italic" },
  ],
  display: "swap",
  preload: true,
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
  variable: "--font-newsreader",
});

const hand = localFont({
  src: "../../public/fonts/patrickhand.woff2",
  weight: "400",
  style: "normal",
  display: "swap",
  preload: false,
  fallback: ["Comic Sans MS", "cursive"],
  variable: "--font-hand",
});

/* Runs before first paint (same as the prototype's head script): js / reduced motion / lite tier, the
   arrival half of a cross-locale page transition, and the preloader — home page only, once per visit. */
const BOOT = `(function(){var d=document.documentElement,q=location.search,ss;try{ss=sessionStorage}catch(e){}
var rm=matchMedia('(prefers-reduced-motion: reduce)').matches||/[?&]rm\\b/.test(q);
var c=navigator.connection||{};var lite=/[?&]lite\\b/.test(q)||c.saveData||(navigator.deviceMemory||8)<=4||(navigator.hardwareConcurrency||8)<=4;
d.classList.add('js');if(rm)d.classList.add('rm');if(lite)d.classList.add('lite');
var home=/^\\/(en|vi)\\/?$/.test(location.pathname);
if(ss&&ss.getItem('bek-arrive')){ss.removeItem('bek-arrive');if(!rm)d.classList.add('arriving')}
else if(home&&!rm&&!(ss&&ss.getItem('bek-loaded'))&&!/[?&]noload\\b/.test(q))d.classList.add('loading');})();`;

/* Google Analytics 4. Page views are sent by <Analytics /> on each route change (send_page_view: false), so
   client navigations count once, with the right title. Google signals and ad personalisation are off.
   Hits from localhost and Vercel previews carry debug_mode: they show in DebugView, never in reports. */
const gaInit = (locale: string) =>
  `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());` +
  `var h=location.hostname,dev=h==='localhost'||h==='127.0.0.1'||/\\.vercel\\.app$/.test(h);` +
  `var c={send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,site_language:'${locale}'};if(dev)c.debug_mode=true;` +
  `gtag('config','${GA_ID}',c);`;

/* Queues errors from first paint until the lazy Sentry SDK is ready (see components/monitoring/ErrorMonitor).
   Only emitted when NEXT_PUBLIC_SENTRY_DSN is set. */
const QUEUE_SCRIPT = `(function(){var q=window.__sq=[];function a(e,m){if(q.length<20)q.push({e:e,m:m})}
function f(ev){a(ev.error,String(ev.message||'error'))}function r(ev){var x=ev.reason;a(x,String(x&&x.message||x||'unhandledrejection'))}
addEventListener('error',f);addEventListener('unhandledrejection',r);
window.__sqOff=function(){removeEventListener('error',f);removeEventListener('unhandledrejection',r)}})();`;
const SENTRY_ON = Boolean(process.env.NEXT_PUBLIC_SENTRY_DSN);

export const metadata: Metadata = {
  metadataBase: new URL("https://teacherbek.com"),
  title: {
    default: "Teacher Bek",
    template: "%s",
  },
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

  if (!routing.locales.some((l) => l === locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "site" });
  const nb = await getTranslations({ locale, namespace: "notebook" });
  const strings: CoreStrings = {
    menu: t("menu.open"),
    close: t("menu.close"),
    fieldNote: nb("fieldNote"),
    cursor: nb.raw("cursor") as Record<string, string>,
    notes: nb.raw("notes") as Record<string, NoteText>,
  };

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${newsreader.variable} ${hand.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {SENTRY_ON && <script dangerouslySetInnerHTML={{ __html: QUEUE_SCRIPT }} />}
      </head>
      <body>
        {SENTRY_ON && <ErrorMonitor />}
        <NotebookRuntime strings={strings} />
        <a className="vh skip" href="#main">
          {t("skipLink")}
        </a>
        <Header locale={locale} />
        {children}
        <Footer locale={locale} />
        <Script id="ga-init" strategy="afterInteractive">
          {gaInit(locale)}
        </Script>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Analytics locale={locale} />
      </body>
    </html>
  );
}
