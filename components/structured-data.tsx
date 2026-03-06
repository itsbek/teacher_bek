const SITE = "https://teacherbek.com";

export function StructuredData() {
  // ── WebSite ───────────────────────────────────────────────────────────────
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}/#website`,
    name: "Teacher Bek",
    url: SITE,
    inLanguage: ["en", "vi", "zh", "ru"],
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE}/en/blog?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  // ── Person — Teacher Bek entity (critical for AI search disambiguation) ───
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE}/#teacher-bek`,
    name: "Bek Boymirzaev",
    alternateName: ["Teacher Bek", "Thầy Bek"],
    jobTitle: "English Language Teacher",
    description: "TESOL & PGCE certified English teacher based in Phú Nhuận, Ho Chi Minh City. 2,000+ students taught across 15+ schools including ILA Vietnam and BlueSky Kindergarten.",
    url: SITE,
    image: `${SITE}/images/teacher-profile.webp`,
    worksFor: { "@id": `${SITE}/#organization` },
    knowsLanguage: [
      { "@type": "Language", "name": "English" },
      { "@type": "Language", "name": "Uzbek" },
      { "@type": "Language", "name": "Russian" },
    ],
    hasCredential: [
      {
        "@type": "EducationalOccupationalCredential",
        name: "TESOL Certificate",
        description: "Teaching English to Speakers of Other Languages",
        credentialCategory: "certificate",
      },
      {
        "@type": "EducationalOccupationalCredential",
        name: "PGCE Certificate",
        description: "Postgraduate Certificate in Education",
        credentialCategory: "certificate",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/bek-boymirzaev/",
      "https://www.instagram.com/itsteacherbek",
      "https://www.facebook.com/teacherbek",
      "https://www.tiktok.com/@itsteacherbek",
    ],
  };

  // ── Courses — enables Google rich course results ──────────────────────────
  const courseSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Young Learners English (Ages 6–10)",
      description: "Small-group English for children aged 6–10. Max 10 students. Speaking from session one. Pronunciation, vocabulary, and confidence built through structured practice — not drilling.",
      provider: { "@id": `${SITE}/#organization` },
      instructor: { "@id": `${SITE}/#teacher-bek` },
      educationalLevel: "Beginner to Elementary",
      teaches: "English Language",
      courseWorkload: "PT1H30M per session, 2 sessions per week",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["Blended", "Onsite"],
        location: {
          "@type": "Place",
          name: "Golden Mansion 1",
          address: "119 Phổ Quang, Phú Nhuận, Ho Chi Minh City, Vietnam",
        },
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: ["Monday", "Wednesday", "Saturday", "Sunday"],
        },
      },
      offers: {
        "@type": "Offer",
        price: "1990000",
        priceCurrency: "VND",
        priceSpecification: { "@type": "UnitPriceSpecification", unitText: "MONTH" },
        availability: "https://schema.org/InStock",
      },
      audience: {
        "@type": "EducationalAudience",
        audienceType: "Children ages 6–10",
        educationalRole: "student",
      },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "Teens English (Ages 11–17)",
      description: "Spoken English for teenagers. Communicative fluency training that removes the internal translation delay. Real-situation practice for school, university applications, and daily life.",
      provider: { "@id": `${SITE}/#organization` },
      instructor: { "@id": `${SITE}/#teacher-bek` },
      educationalLevel: "Elementary to Advanced",
      teaches: "English Language",
      courseWorkload: "PT1H30M per session, 2 sessions per week",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["Blended", "Onsite"],
        location: {
          "@type": "Place",
          name: "Golden Mansion 1",
          address: "119 Phổ Quang, Phú Nhuận, Ho Chi Minh City, Vietnam",
        },
      },
      offers: {
        "@type": "Offer",
        price: "1990000",
        priceCurrency: "VND",
        priceSpecification: { "@type": "UnitPriceSpecification", unitText: "MONTH" },
        availability: "https://schema.org/InStock",
      },
      audience: {
        "@type": "EducationalAudience",
        audienceType: "Teenagers ages 11–17",
        educationalRole: "student",
      },
      inLanguage: "en",
    },
    {
      "@context": "https://schema.org",
      "@type": "Course",
      name: "IELTS Preparation",
      description: "Targeted IELTS prep covering all four skills: Reading, Writing, Listening, Speaking. Timed practice, direct feedback, band score projection. No passive lectures — deliberate exam strategy.",
      provider: { "@id": `${SITE}/#organization` },
      instructor: { "@id": `${SITE}/#teacher-bek` },
      educationalLevel: "Intermediate to Advanced",
      teaches: "IELTS Examination Preparation",
      courseWorkload: "PT1H per session, 2 sessions per week",
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: ["Blended", "Onsite"],
        location: {
          "@type": "Place",
          name: "Golden Mansion 1",
          address: "119 Phổ Quang, Phú Nhuận, Ho Chi Minh City, Vietnam",
        },
      },
      offers: {
        "@type": "Offer",
        price: "1990000",
        priceCurrency: "VND",
        priceSpecification: { "@type": "UnitPriceSpecification", unitText: "MONTH" },
        availability: "https://schema.org/InStock",
      },
      audience: {
        "@type": "EducationalAudience",
        audienceType: "Adults and students targeting IELTS band scores",
        educationalRole: "student",
      },
      inLanguage: "en",
    },
  ];

  // ── FAQPage — AI Overviews, Perplexity, and ChatGPT pull directly from this
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where are English classes held?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Classes are held at Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, Ho Chi Minh City — a 5-minute drive from Tân Sơn Nhất international airport. Home lessons are also available in Phú Nhuận, Gò Vấp, and Bình Thạnh.",
        },
      },
      {
        "@type": "Question",
        name: "What ages does Teacher Bek teach?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Teacher Bek teaches Young Learners aged 6–10, Teens aged 11–17, and adults preparing for IELTS or professional English. All programs run in small groups of maximum 10 students.",
        },
      },
      {
        "@type": "Question",
        name: "What qualifications does Teacher Bek have?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Teacher Bek holds a TESOL (Teaching English to Speakers of Other Languages) certificate and a PGCE (Postgraduate Certificate in Education). He has taught at ILA Vietnam, BlueSky Kindergarten, and 15+ schools across Ho Chi Minh City.",
        },
      },
      {
        "@type": "Question",
        name: "How much do English lessons cost in Ho Chi Minh City?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Programs start from 1,990,000 VND per month for the first trial month. All programs include 2 sessions per week. A free trial week is available to assess level and fit before committing.",
        },
      },
      {
        "@type": "Question",
        name: "How many students are in each class?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Maximum 10 students per class. In a 25-student class each student speaks for roughly 3 minutes per session — that is not how fluency forms. The 10-student cap means every student speaks every session.",
        },
      },
      {
        "@type": "Question",
        name: "Is there a free trial class available?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. One free week of lessons is available with no payment required. This is a genuine assessment — Teacher Bek will tell you honestly whether the program is a good fit.",
        },
      },
      {
        "@type": "Question",
        name: "Is the classroom safe for children?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The classroom at Golden Mansion 1, Phú Nhuận has 24/7 CCTV security, a private restroom, air conditioning, and mosquito control. It is parent-approved and designed specifically for child safety.",
        },
      },
      {
        "@type": "Question",
        name: "Does Teacher Bek offer online English lessons?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Online group sessions are available in addition to in-person classes at the Phú Nhuận classroom. The same maximum of 10 students applies to online sessions.",
        },
      },
    ],
  };

  const schemas = [websiteSchema, personSchema, faqSchema, ...courseSchemas];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
