import type { Metadata } from "next";
import { FaqPageClient } from "@/components/pages/FaqPageClient";
import { JsonLd } from "@/components/JsonLd";
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

export default function FAQPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How are classes different from large language centers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Classes are capped at 10 students, with speaking practice and direct feedback in every session.",
        },
      },
      {
        "@type": "Question",
        name: "Is this suitable for children, teens, and adults?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Programs are available for young learners, teens, and adults focused on IELTS or workplace communication.",
        },
      },
      {
        "@type": "Question",
        name: "How can I start?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Submit your level and goal through the enquiry form to receive a recommended program and schedule options.",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <FaqPageClient />
    </>
  );
}
