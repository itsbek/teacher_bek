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
  const seo = getPageSeo(locale, "privacy");
  return buildPageMetadata({ locale, title: seo.title, description: seo.description, path: "/privacy" });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacy" });
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
            <h2>{t("collected.title")}</h2>
            <p>{t("collected.lead")}</p>
            <ul>
              {(t.raw("collected.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t("purpose.title")}</h2>
            <p>{t("purpose.text")}</p>
          </section>

          <section>
            <h2>{t("retention.title")}</h2>
            <p>{t("retention.text")}</p>
          </section>

          <section>
            <h2>{t("sharing.title")}</h2>
            <p>{t("sharing.lead")}</p>
            <ul>
              {(t.raw("sharing.items") as string[]).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>{t("rights.title")}</h2>
            <p>{t.rich("rights.text", rich)}</p>
          </section>

          <section>
            <h2>{t("updates.title")}</h2>
            <p>{t("updates.text")}</p>
          </section>
        </div>
      </main>
    </>
  );
}
