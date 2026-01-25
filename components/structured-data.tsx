export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "English with Confidence",
    "description": "Professional English language instruction for Vietnamese, Chinese, and Russian speakers",
    "url": "https://englishwithconfidence.com",
    "logo": "https://englishwithconfidence.com/logo.png",
    "sameAs": [
      "https://wa.me/1234567890",
      "https://t.me/your_telegram"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Online"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "availableLanguage": ["English", "Vietnamese", "Chinese", "Russian"]
    }
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "English with Confidence Instructor",
    "jobTitle": "English Teacher",
    "description": "TEFL and TESOL certified English teacher with 10+ years of experience",
    "knowsLanguage": ["en", "vi", "zh", "ru"],
    "hasCredential": [
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "TEFL Certification"
      },
      {
        "@type": "EducationalOccupationalCredential",
        "credentialCategory": "TESOL Certification"
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Professional English Language Courses",
    "description": "Personalized one-on-one English lessons for all levels",
    "provider": {
      "@type": "Organization",
      "name": "English with Confidence"
    },
    "coursePrerequisites": "None - courses available for all levels from A1 to C2",
    "educationalLevel": "All Levels",
    "inLanguage": ["en"],
    "availableLanguage": ["vi", "zh", "ru"],
    "offers": {
      "@type": "Offer",
      "category": "Online Course",
      "availability": "https://schema.org/InStock"
    }
  };

  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "English Language Lessons",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
    </>
  );
}
