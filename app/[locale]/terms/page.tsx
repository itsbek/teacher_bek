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
  const seo = getPageSeo(locale, "terms");
  return buildPageMetadata({ locale, title: seo.title, description: seo.description, path: "/terms" });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "terms" });
  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      effective={t("effective")}
      intro={t("intro")}
      shortTitle={t("shortTitle")}
      short={[t("short.0"), t("short.1"), t("short.2"), t.rich("short.3", rich)]}
      sections={[
        { title: t("scope.title"), text: t("scope.text") },
        { title: t("booking.title"), text: t("booking.text") },
        { title: t("client.title"), items: t.raw("client.items") as string[] },
        { title: t("cancel.title"), text: t("cancel.text") },
        { title: t("use.title"), text: t("use.text") },
        { title: t("liability.title"), text: t("liability.text") },
        { title: t("contact.title"), text: t.rich("contact.text", rich) },
      ]}
    />
  );
}
