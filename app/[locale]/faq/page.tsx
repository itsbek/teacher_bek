import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "FAQ",
    description: "Frequently asked questions about lesson format, group size, and enrollment.",
    path: "/faq",
  });
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}#faq`);
}
