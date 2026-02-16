import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/AboutPageClient";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "About Teacher Bek",
    description: "Learn about Teacher Bek's teaching background, credentials, and small-group English lesson approach.",
    path: "/about",
  });
}

export default function AboutPage() {
  return <AboutPageClient />;
}
