import type { Metadata } from "next";
import { ServicesPageClient } from "@/components/pages/ServicesPageClient";
import { JsonLd } from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "English Services",
    description: "Explore small-group English programs for students, teens, and adults.",
    path: "/services",
  });
}

export default function ServicesPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Small-Group English Lessons",
    provider: {
      "@type": "EducationalOrganization",
      name: "Teacher Bek",
      url: "https://englishwithconfidence.com",
    },
    areaServed: {
      "@type": "City",
      name: "Ho Chi Minh City",
    },
    availableChannel: [
      {
        "@type": "ServiceChannel",
        serviceUrl: "https://englishwithconfidence.com/en/services",
        serviceLocation: {
          "@type": "Place",
          name: "Phu Nhuan, Ho Chi Minh City",
        },
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <ServicesPageClient />
    </>
  );
}
