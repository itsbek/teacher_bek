export function StructuredData() {
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Teacher Bek",
    url: "https://englishwithconfidence.com",
    inLanguage: ["en", "vi", "zh", "ru"],
  };

  const catalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "English Lesson Programs",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Young Learners English (Ages 6-10)" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "Teens English (Ages 11-17)" },
      },
      {
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: "IELTS and Professional English Lessons" },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
    </>
  );
}
