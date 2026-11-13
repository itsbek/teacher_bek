import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";
import { LegalPage } from "@/components/site/LegalPage";

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
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      effective={t("effective")}
      intro={t("intro")}
      shortTitle={t("shortTitle")}
      short={[t("short.0"), t("short.1"), t("short.2"), t.rich("short.3", rich)]}
      sections={[
        { title: t("collected.title"), lead: t("collected.lead"), items: t.raw("collected.items") as string[] },
        { title: t("purpose.title"), text: t("purpose.text") },
        { title: t("retention.title"), text: t("retention.text") },
        { title: t("sharing.title"), lead: t("sharing.lead"), items: t.raw("sharing.items") as string[] },
        { title: t("rights.title"), text: t.rich("rights.text", rich) },
        { title: t("updates.title"), text: t("updates.text") },
      ]}
    />
  );
}
