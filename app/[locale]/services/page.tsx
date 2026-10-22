import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "English Services",
    description: "Explore small-group English programs for children and teens aged 5–17.",
    path: "/services",
  });
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  permanentRedirect(`/${locale}#programs`);
}
