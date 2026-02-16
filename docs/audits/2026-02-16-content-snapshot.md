# Content Snapshot & Relevance Audit (2026-02-16)

## Scope
- Route inventory reviewed: `/[locale]`, `/[locale]/about`, `/[locale]/services`, `/[locale]/faq`, `/[locale]/blog`, `/[locale]/blog/[slug]`, plus global nav/footer.
- Locale files reviewed: `messages/en.json`, `messages/vi.json`, `messages/zh.json`, `messages/ru.json`.
- Focus: copy relevance to English-teaching services, clarity, conversion support, and translation consistency.

## Snapshot (By Rendered Route)

### Home (`/[locale]`)
- Hero: headline + subline + CTA + trust badges.
- Signature: teaching approach statement and 4-step method card.
- Service glimpse: 4 program cards with links to services anchors.
- Lexicon: extended program section with descriptions and contact CTA.
- Journal: latest blog post listing + archive CTA.
- Outcome framework: 3-step progression blocks.
- Inquiry: contact form, map, schedule, location details.
- Marquee: single-line moving trust statement.

### About (`/[locale]/about`)
- Personal positioning headline.
- Proof grid (students, languages, response window, mentorship format).
- Philosophy and approach section.
- Method steps.
- Timeline/milestones.
- Closing CTA to contact.

### Services (`/[locale]/services`)
- Services hero + trust signals.
- Decision guide by learner type.
- Program detail blocks (image, summary, features, CTA).
- Enrollment CTA and program matching statement.

### FAQ (`/[locale]/faq`)
- FAQ hero.
- Concern tag chips.
- 4-question accordion.
- Closing conversion CTA.

### Blog index (`/[locale]/blog`)
- Blog hero.
- Category filter + article rows.
- Conversion blocks to inquiry.

### Blog post (`/[locale]/blog/[slug]`)
- Post hero + metadata.
- Conversion strip.
- Content body.
- Related posts.

### Global
- Navigation menu labels, language toggles, theme/audio controls.
- Footer headline, contact channels, quick links, legal links, location.

## Audit Findings
- `Critical`: Core visible copy in many rendered sections was previously misaligned with the actual service (overly abstract "intellectual/protocol" language).
- `Critical`: Some locale keys in RU/ZH/VI contained stale English labels and mixed brand voice.
- `Major`: Program naming was inconsistent between home, services, and structured data.
- `Major`: CTA language reduced clarity (e.g., terms like "protocol", "admission") and reduced conversion intent.

## Fixes Applied
- Rewrote high-visibility copy to practical English-learning messaging in:
  - `components/VanguardHero.tsx`
  - `components/VanguardSignature.tsx`
  - `components/VanguardServiceGlimpse.tsx`
  - `components/VanguardLexicon.tsx`
  - `components/VanguardJournal.tsx`
  - `components/VanguardInquiry.tsx`
  - `components/pages/AboutPageClient.tsx`
  - `components/pages/ServicesPageClient.tsx`
  - `components/pages/FaqPageClient.tsx`
  - `components/blog/BlogHero.tsx`
  - `components/blog/VanguardBlogList.tsx`
  - `components/blog/blog-post.tsx`
  - `components/VanguardFooter.tsx`
- Updated locale consistency issues in:
  - `messages/ru.json`
  - `messages/zh.json`
  - `messages/vi.json`
- Updated FAQ schema wording to match current FAQ content:
  - `app/[locale]/faq/page.tsx`
- Updated service schema names for SEO consistency:
  - `components/structured-data.tsx`

## Remaining Follow-ups
- Remaining legacy message namespaces (`services`, `vault`, etc.) may still contain old-brand wording if older components are reintroduced.
- Full translation parity can be improved further by moving more hardcoded component strings into `next-intl` keys.
