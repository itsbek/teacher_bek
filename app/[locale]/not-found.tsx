import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations("notFound");
  return (
    <main id="main">
      <h1>{t("heading")}</h1>
      <p>{t("body")}</p>
      <Link href={`/${locale}`}>{t("cta")}</Link>
    </main>
  );
}
