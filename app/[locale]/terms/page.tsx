import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

const rich = {
  zalo: (chunks: React.ReactNode) => (
    <a href="https://zalo.me/84353885757" target="_blank" rel="noopener noreferrer">
      {chunks}
    </a>
  ),
  phone: (chunks: React.ReactNode) => <a href="tel:+84353885757">{chunks}</a>,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const seo = getPageSeo(locale, "terms");
  return buildPageMetadata({ locale, title: seo.title, description: seo.description, path: "/terms" });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms" });
  return (
    <>
      <main id="main">
        <div>
          <header>
            <p>{t("eyebrow")}</p>
            <h1>{t("title")}</h1>
            <p>{t("effective")}</p>
            <p>{t("intro")}</p>
          </header>

          <section>
            <h2>{t("scope.title")}</h2>
            <p>{t("scope.text")}</p>
          </section>

          <section>
            <h2>{t("booking.title")}</h2>
            <p>{t("booking.text")}</p>
          </section>

          <section>
            <h2>{t("client.title")}</h2>
            <ul>
              {(t.raw("client.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t("cancel.title")}</h2>
            <p>{t("cancel.text")}</p>
          </section>

          <section>
            <h2>{t("use.title")}</h2>
            <p>{t("use.text")}</p>
          </section>

          <section>
            <h2>{t("liability.title")}</h2>
            <p>{t("liability.text")}</p>
          </section>

          <section>
            <h2>{t("contact.title")}</h2>
            <p>{t.rich("contact.text", rich)}</p>
          </section>
        </div>
      </main>
    </>
  );
}
