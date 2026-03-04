import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import type { Metadata } from "next";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  const nav = await getTranslations("nav");

  const links = [
    { href: `/${locale}#about`,    label: nav("about")     },
    { href: `/${locale}#programs`, label: nav("services")  },
    { href: `/${locale}/blog`,     label: nav("blog_link") },
    { href: `/${locale}#contact`,  label: nav("contact")   },
  ];

  return (
    <>
      <VanguardNavigation />

      <main
        className="min-h-[100dvh] flex flex-col justify-center bg-background text-foreground"
        style={{ paddingTop: "var(--nav-h)" }}
      >
        {/* ── Noise texture overlay — matches site body::before ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 px-[var(--gutter)] mx-auto w-full max-w-7xl py-[var(--section-lg)]">

          {/* ── Giant 404 watermark ── */}
          <div
            aria-hidden="true"
            className="font-display font-bold uppercase leading-none select-none pointer-events-none mb-8"
            style={{
              fontSize: "clamp(8rem, 28vw, 32rem)",
              letterSpacing: "-0.05em",
              opacity: 0.06,
              lineHeight: 0.85,
            }}
          >
            {t("heading")}
          </div>

          {/* ── Content ── */}
          <div className="mt-[-2rem] md:mt-[-4rem] flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-16">

            {/* Left — label + body */}
            <div className="max-w-lg">
              <p
                className="font-mono uppercase tracking-[0.22em] opacity-40 mb-4"
                style={{ fontSize: "0.6875rem" }}
              >
                {t("label")}
              </p>
              <p
                className="font-display font-bold uppercase leading-[1.05]"
                style={{
                  fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                }}
              >
                {t("body")}
              </p>
            </div>

            {/* Right — CTA */}
            <div className="flex flex-col items-start md:items-end gap-6 shrink-0">
              <Link
                href={`/${locale}`}
                className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 font-mono text-[0.75rem] uppercase tracking-[0.18em] hover:opacity-80 transition-opacity duration-300"
              >
                {t("cta")}
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                >
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>

          {/* ── Quick links ── */}
          <div className="mt-16 md:mt-20 border-t border-foreground/10 pt-10">
            <p
              className="font-mono uppercase tracking-[0.22em] opacity-35 mb-6"
              style={{ fontSize: "0.6875rem" }}
            >
              {t("hint")}
            </p>
            <nav
              aria-label="Suggested pages"
              className="flex flex-wrap gap-x-0 gap-y-0"
            >
              {links.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-center gap-2 pr-8 py-2 font-mono text-[0.75rem] uppercase tracking-[0.1em] opacity-45 hover:opacity-90 transition-opacity duration-300 text-foreground no-underline"
                >
                  <span
                    aria-hidden="true"
                    className="text-[0.625rem] opacity-40"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {link.label}
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill="none"
                    aria-hidden="true"
                    className="opacity-0 group-hover:opacity-50 group-hover:translate-x-px group-hover:-translate-y-px transition-all duration-300"
                  >
                    <path d="M1 7L7 1M7 1H3M7 1V5" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </Link>
              ))}
            </nav>
          </div>

        </div>
      </main>

      <VanguardFooter />
    </>
  );
}
