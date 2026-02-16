# Typography Standardization Audit (2026-02-16)

## Goal
Move typography control to one global style source (`app/globals.css`) and remove per-component ad-hoc text sizing.

## Completed in this pass
- Added unified global type utilities in `app/globals.css`:
  - `.type-display`
  - `.type-title-lg`
  - `.type-title-md`
  - `.type-title-sm`
  - `.type-body`
  - `.type-body-lg`
  - `.type-label`
  - `.type-label-tight`
  - `.type-meta`
- Standardized blog templates to global typography:
  - `components/blog/BlogHero.tsx`
  - `components/blog/VanguardBlogList.tsx`
  - `components/blog/blog-post.tsx`
- Standardized core page clients:
  - `components/pages/FaqPageClient.tsx`
  - `components/pages/ServicesPageClient.tsx`
  - `components/pages/AboutPageClient.tsx`
- Standardized key home content sections:
  - `components/VanguardJournal.tsx`
  - `components/VanguardLexicon.tsx`

## Remaining Variance (Needs Next Normalization Pass)

### P1 - Active primary routes still with ad-hoc text sizing
- `components/VanguardHero.tsx`
- `components/VanguardInquiry.tsx`
- `components/VanguardServiceGlimpse.tsx`
- `components/VanguardSignature.tsx`
- `components/VanguardFooter.tsx`
- `app/[locale]/page.tsx`
- `app/[locale]/privacy/page.tsx`
- `app/[locale]/terms/page.tsx`

### P2 - Alternate/legacy design systems (separate style language)
- `components/hero-awwwards.tsx`
- `components/about-awwwards.tsx`
- `components/navigation-awwwards.tsx`
- `components/newsletter-enhanced.tsx`
- `components/testimonials.tsx`
- `components/trial-cta.tsx`
- `components/hero.tsx`
- `components/about.tsx`
- `components/blog/blog-list.tsx`
- `app/globals-kinetic.css`
- `app/globals-old-backup.css`

## Recommendation
- Keep one typography system for all primary pages (`Vanguard*` + `components/pages/*`) using only global type utility classes.
- Treat Awwwards/kinetic/legacy components as either:
  - fully migrated to the same type classes, or
  - isolated into explicit “experimental” routes only.
