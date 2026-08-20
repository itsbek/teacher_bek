# Full Website Audit — teacherbek.com

**Date:** 2026-08-20
**Scope:** Sales conversion, design/UX, SEO & traffic, security, code quality, performance, accessibility, content strategy
**Goal:** Transform from a design portfolio into a lead-generating sales machine

---

## EXECUTIVE SUMMARY

The site is technically competent — solid security headers, structured data, i18n, form validation — but it is bleeding conversions and getting zero traffic because of three systemic problems:

1. **Pricing is given away for free** — no lead capture before revealing prices. Anyone can see "1,990,000 VND/month" and leave without giving you their phone number.
2. **The design reads as a developer portfolio, not a sales page** — grayscale brutalist aesthetic, monospace fonts, opacity-heavy text, and extreme whitespace create an avant-garde art-gallery feel that alienates Vietnamese parents looking for English classes for their kids.
3. **There is no traffic acquisition strategy** — no blog content, no Google Business Profile integration, no testimonials/reviews, no retargeting, and the SEO keywords exist in metadata but aren't reflected in actual page content.

The site needs to become a **lead generation machine**, not a design award submission.

---

## 1. SALES & CONVERSION FUNNEL

### 1.1 CRITICAL: Pricing Is Exposed Without Lead Capture

**Current state:** `VanguardLexicon.tsx` displays full pricing — "1,990,000 VND/month" — in a prominent banner and on every program card. Any visitor sees the price and bounces with zero contact info collected.

**Problem:** Pricing without context (a conversation, a trial, a personal assessment) triggers immediate price comparison with ILA, VUS, Apollo who charge similar or less. You lose the ability to sell the VALUE (small groups, native speaker, TESOL cert) before they hit the number.

**Fix:** → **Opus** (new modal component, form logic, API, i18n, conversion UX design)
- Remove all explicit pricing from the public-facing site
- Replace the pricing banner with a "Get Your Custom Quote" or "See Pricing" CTA that opens a gated form
- The gated form collects: **Name + Phone Number (required)**, optionally email
- After submission, reveal pricing on a thank-you page AND send it via Zalo/WhatsApp
- Every pricing-curious visitor becomes a lead you can follow up with
- Keep "Free Trial Week" messaging prominent — that's the best lead magnet

### 1.2 CRITICAL: No Phone Number Collection

**Current state:** `VanguardInquiry.tsx` contact form collects Name, Email, and optional Message. No phone number field.

**Problem:** In Vietnam, phone/Zalo is the primary communication channel. Email is almost never checked by parents. You're collecting the wrong contact method.

**Fix:** → **Sonnet** (add form field + update schema + translations)
- Add a **required Phone Number field** to the contact form (with +84 prefix default)
- Make email optional instead of required
- Make Zalo click-to-chat the PRIMARY CTA, not just a sidebar link

### 1.3 CRITICAL BUG: Contact Form Rejects Non-English Locales

**File:** `app/api/contact/route.ts`, lines 18-20

```ts
forWhom: z.enum(['My Child', 'Myself', '']).optional(),
level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Not Sure', '']).optional(),
goal: z.enum(['IELTS Score', 'Speaking Confidence', 'School Grades', 'Work English', '']).optional(),
```

These Zod enums only accept English strings. When a Vietnamese user sees pills labeled "Con tôi" / "Bản thân", the form sends the **translated** text but the Zod schema rejects it because it only allows English values.

**Impact:** Contact form submissions from VI/ZH/RU users fail silently. You're losing leads from your primary audience.

**Fix:** → **Haiku** (3 lines: `.enum([...])` → `.string().max(100)`)
- Either send locale-independent keys (not translated labels) from the frontend
- Or change `.enum()` to `.string().max(100)` and validate loosely server-side

### 1.4 HIGH: Contact Form Has Too Much Friction

**Current state:** `VanguardInquiry.tsx` lines 195-201 — form requires: Name, Email, For Whom (pill), Level (pill), Goal (pill), plus Consent checkbox. All pills must be selected before submit enables.

**Problem:** 6 required interactions is too many steps. Vietnamese parents on mobile want to tap Zalo, type "xin chào", done. The academic-style pill selectors feel like a government form.

**Fix:** → **Sonnet** (form field restructuring, validation logic)
- Reduce required fields to: **Name + Phone Number only**
- Make everything else optional
- Make the form completable in 2-3 taps on mobile
- Add a **WhatsApp/Zalo direct message button** as the primary CTA above the form

### 1.5 HIGH: No Testimonials or Social Proof

**Current state:** No testimonials section anywhere on the page. "2,000+ students" stat in hero is unverified — no actual reviews visible.

**Fix:** → **Opus** (new section from scratch — layout, animation, review schema, i18n)
- Add a **Testimonials section** between About and Programs (or between Programs and Methodology)
- Show 6-8 real parent reviews with: name, child's age, duration of study, quote
- Include both Vietnamese and international parent reviews
- Add Google Reviews integration if a Google Business Profile exists
- Consider video testimonials — even 30-second phone recordings are powerful

### 1.6 HIGH: Exit Intent Modal Is Too Generic

**Current state:** `ExitIntentModal.tsx` shows a generic "before you go" popup with Zalo and Inquiry links. Activates after only 2 seconds (line 31).

**Fix:** → **Opus** (redesign modal UX, lead magnet strategy, conversion optimization)
- Gate with a **lead magnet**: "Get FREE placement test" or "Download class schedule"
- Require phone number to access the lead magnet
- Increase activation delay to 30+ seconds (2s is too aggressive)
- Consider adding mobile exit intent (scroll-up detection) — current implementation is desktop-only

### 1.7 MEDIUM: No Urgency or Scarcity Signals

**Fix:** → **Sonnet** (add urgency UI elements to existing components)
- Add "Only X spots left" per class (if real — never fake scarcity)
- Add "Next intake: [Date]" with visible enrollment window
- Show "Currently enrolling for Q4 2026" in the hero
- Add a banner for seasonal promotions (back-to-school, Tet holiday prep)

### 1.8 MEDIUM: Loading Screen Kills Conversions

**Current state:** `LoadingScreen.tsx` shows a 1.4-second counter animation (black screen counting to 100) on first visit.

**Problem:** Every second of loading screen is a bounce. This is a portfolio technique, not a sales technique.

**Fix:** → **Haiku** (delete component + remove import)
Remove the loading screen entirely. If kept, max 400ms with no counter.

---

## 2. DESIGN & UX

### 2.1 CRITICAL: Grayscale Brutalist Aesthetic Is Wrong for the Audience

**Current state:** The entire color system is pure grayscale:
- `globals.css` lines 20-21: `--background: 0 0% 97%` / `--foreground: 0 0% 6%`
- Zero hue anywhere except the copper accent `#B85337` and ghost-level atmospheric gradients at 3-8% opacity
- No border-radius (`--radius: 0px` at line 48)
- Monospace bracketed labels like `[ 01 — HERO ]`

**Problem:** Vietnamese parents looking for English classes for their 6-year-old don't want a grayscale art gallery. They want:
- **Warmth and trust** — colors that say "safe for children"
- **Professional but approachable** — not cold and intimidating
- **Clear information** — not artistic ambiguity

**Fix:** → **Opus** (full design system overhaul — palette, tokens, light/dark, contrast audit)
- Introduce a **warm, professional color palette**:
  - Primary: Confident blue or teal (trust, education)
  - Accent: Warm gold or orange (energy, approachability)
  - Background: Clean white `#FFFFFF` or very light warm gray
- Add **strategic color** to CTAs, section backgrounds, icon accents, card borders
- Replace bracketed monospace labels with clean section headers
- Add subtle rounded corners to cards and buttons (4-8px)
- Reduce opacity-heavy text styling — too much text is barely visible

### 2.2 HIGH: Typography Is Over-Designed

**Current state:**
- Hero "English" in `VanguardHero.tsx` line 337: `clamp(6rem, 25vw, 18rem)` = **288px** on a wide screen
- Monospace-styled body text at 9-13px throughout
- ALL-CAPS everything via `text-transform: uppercase` in every `.type-*` class

**Fix:** → **Sonnet** (CSS typography adjustments, straightforward rule changes)
- Cap display sizes at ~80px max
- Use sentence case for labels and navigation
- Increase minimum text sizes — nothing below 14px for readable content
- Reduce monospace usage — reserve it for actual code or data, not UI labels

### 2.3 HIGH: Ghost Elements and Low-Opacity Text

**Current state:** `VanguardHero.tsx` lines 102-116 — ghost "01" at `opacity: 0.04`. Similar decorative elements at 3-10% opacity throughout. Body text and labels at 40-65% opacity.

**Fix:** → **Haiku** (delete decorative elements, bump opacity values)
- Remove all ghost index numbers and dot grids
- Remove the noise texture layer (line 849 globals.css — renders at 2.5% opacity, invisible)
- Set body text to 85-100% opacity
- Remove decorative grid overlays

### 2.4 HIGH: Mobile UX

**Current state:** Hero has two entirely separate DOM blocks — one for mobile (line 135), one for desktop (line 313) in `VanguardHero.tsx`. Stats text is 9-10px on mobile.

**Fix:** → **Opus** (restructure dual-DOM hero into single responsive layout — significant refactor)
- Simplify to one responsive layout
- Make the mobile hero focused: one headline, one CTA, phone number visible
- Make primary CTA a full-width Zalo button on mobile
- Remove credential pills on mobile — clutter without conversion value

### 2.5 MEDIUM: Custom Cursor — Remove It

**Current state:** `VanguardCursor.tsx` replaces system cursor with animated dot on desktop. Loaded via `client-layout.tsx` line 12.

**Fix:** → **Haiku** (delete component + remove imports)
Remove entirely. Custom cursors are a vanity feature that interferes with usability.

### 2.6 MEDIUM: Sound Effects — Remove Them

**Current state:** `AudioProvider` plays synthesized sounds on click/hover. Mute toggle in nav.

**Fix:** → **Sonnet** (trace and remove audio hooks across 6+ files)
Remove the audio system entirely. Nobody wants sounds when browsing a teacher's website.

### 2.7 MEDIUM: Navigation Is Overloaded

**Current state:** `VanguardNavigation.tsx` desktop nav contains 13+ interactive elements: Logo, 6 links, divider, A−/A/A+ font size, divider, language dropdown, divider, theme toggle, mute toggle.

**Fix:** → **Opus** (nav UX redesign — what to keep/remove, CTA placement, mobile menu)
- Remove font size controls (use browser zoom)
- Remove mute toggle (remove audio system)
- Add a **prominent CTA button** ("Book Free Trial") in the nav — currently missing
- Keep: Logo, 4-5 links, Language, Theme toggle, CTA button

---

## 3. SEO & TRAFFIC

### 3.1 CRITICAL: No Content to Rank For

**Current state:** Blog route exists (`/[locale]/blog`) but only 2 articles are fetched. `lib/seo.ts` defines 50+ keywords across 4 locales, but keywords in meta tags alone don't drive rankings.

**Fix:** → **Opus** (SEO content strategy, keyword research, bilingual writing)
- Publish 2-4 blog posts per month targeting specific keywords:
  - "Lớp tiếng Anh cho trẻ em Phú Nhuận" (Vietnamese parents — highest volume)
  - "IELTS preparation tips HCMC"
  - "How to choose an English class for your child"
  - "Best English classes in Gò Vấp / Bình Thạnh"
- Write in Vietnamese AND English
- Each post links to the contact form

### 3.2 CRITICAL: No Google Business Profile

**Problem:** For local services in Vietnam, Google Maps / Google Business Profile is the #1 discovery channel. The site has location structured data but no GBP link, no "See reviews on Google" button, no Maps embed directing to GBP.

**Fix:** → manual (GBP setup) + **Sonnet** (map swap + review schema)
- Create/verify a Google Business Profile
- Collect Google Reviews from parents (this is the #1 local SEO ranking factor)
- Replace Leaflet/OSM map with Google Maps embed linked to GBP
- Add review schema to structured data

### 3.3 HIGH: robots.txt Blocks Important Routes

**Current state:** `public/robots.txt` blocks `/en/about`, `/en/services`, `/en/faq` plus all locale variants.

**Problem:** Even if these are redirect stubs, blocking them prevents link equity flow.

**Fix:** → **Haiku** (edit robots.txt — remove disallow lines)
Either remove these routes entirely or allow crawling.

### 3.4 HIGH: No Review Schema

**Current state:** Structured data includes Course, FAQ, Person, WebSite. Missing: `Review` and `AggregateRating`.

**Fix:** → **Sonnet** (add Review/AggregateRating to structured-data.tsx)
Add review schema with real testimonials to enable star ratings in Google search results.

### 3.5 MEDIUM: OG Image Is Generic

**Current state:** Single `og-image.jpg` (62KB) for all pages and locales.

**Fix:** → **Sonnet** (Next.js OG image generation API)
- Create locale-specific OG images (Vietnamese text for `/vi/`, Chinese for `/zh/`)
- Include teacher photo, "Free Trial" badge, key credentials
- Generate dynamic OG images per blog post

### 3.6 MEDIUM: Missing og:site_name

**File:** `lib/seo.ts` — `buildPageMetadata()` sets openGraph title, description, images but not `siteName`.

**Fix:** → **Haiku** (one-line addition to `lib/seo.ts`)
Add `siteName: "Teacher Bek"` to the openGraph object.

---

## 4. SECURITY

### 4.1 GOOD — Security Headers

`next.config.ts` headers are well-configured: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP present, poweredByHeader disabled. No issues.

### 4.2 GOOD — Form Security

Contact form (`/api/contact/route.ts`) has: Zod validation, IP rate limiting (3/min), honeypot field, speed trap (1.5s minimum), HTML sanitization, content-type checking. Community API adds bot UA detection, content deduplication, visitor ID limiting. Solid.

### 4.3 MEDIUM: Rate Limiting Is In-Memory Only

**Problem:** `rateLimitMap` in API routes is a plain `Map<string, ...>` — resets on every Vercel cold start.

**Fix:** → **Sonnet** (swap Map for Vercel KV/Upstash when needed)
Acceptable for current traffic. If spam increases, move to Vercel KV or Upstash Redis. Consider adding Turnstile/hCaptcha as fallback.

### 4.4 MEDIUM: CSP Allows `unsafe-inline` for Scripts

**Current state:** `next.config.ts` line 52: `script-src 'self' 'unsafe-inline' ...` in production.

**Fix:** → **Sonnet** (nonce-based CSP setup in Next.js 15 config)
Use nonce-based CSP instead. Next.js 15 supports this via config. Moderate effort but best-practice.

### 4.5 GOOD — Revalidation Endpoint

`/api/revalidate/route.ts` uses HMAC signature verification for GitHub webhooks and timing-safe comparison for bearer tokens. Well implemented.

---

## 5. CODE QUALITY

### 5.1 HIGH: No Test Suite

**Current state:** No test files, no test framework config. Zero automated tests.

**Fix:** → **Opus** (test architecture — config, fixtures, patterns, comprehensive coverage)
- Add Vitest for unit tests (API route handlers, form validation)
- Add Playwright for E2E (form submission, language switching, navigation)
- Priority targets: API routes (100%), critical user flows (E2E)

### 5.2 HIGH: Duplicate GSAP Registration (7+ Files)

**Current state:** Every GSAP component repeats:
```ts
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}
```
Found in: VanguardHero, VanguardLexicon, VanguardInquiry, VanguardFooter, ConversionStrip, AboutSection, MethodologySteps.

**Fix:** → **Haiku** (extract registration to one file, update 7 imports)
Create `lib/gsap.ts` that registers once and re-exports `{ gsap, ScrollTrigger }`.

### 5.3 MEDIUM: Copyright Year Hardcoded

**File:** `VanguardNavigation.tsx` line 499 — mobile menu shows `© 2025` (hardcoded). Footer uses `new Date().getFullYear()` correctly.

**Fix:** → **Haiku** (one string replacement)
Use `new Date().getFullYear()` in the mobile menu too.

### 5.4 MEDIUM: Deprecated Package

`@studio-freight/lenis` in package.json is the old package name. The current package `lenis` (also installed) is the active one.

**Fix:** → **Haiku** (`npm uninstall @studio-freight/lenis`)
Remove `@studio-freight/lenis` from dependencies.

### 5.5 LOW: Dead Code — lenisRef

`client-layout.tsx` line 27 — `lenisRef` is declared and never assigned.

**Fix:** → **Haiku** (delete one line)
Remove.

---

## 6. PERFORMANCE

### 6.1 GOOD: Dynamic Imports

`app/[locale]/page.tsx` uses `next/dynamic` for all below-fold sections — good code-splitting.

### 6.2 GOOD: Image Optimization

Images use Next.js `<Image>` with WebP, `fill` + `object-cover`, and proper `sizes` attributes.

### 6.3 MEDIUM: Loading Screen Blocks FCP

`LoadingScreen.tsx` renders a fixed overlay at z-index 99999 for 1.4 seconds minimum. Blocks First Contentful Paint.

**Fix:** → **Haiku** — Remove entirely (see section 1.8).

### 6.4 MEDIUM: Too Many Client-Side Components in Root Layout

`client-layout.tsx` loads 6 dynamic components on every page: VanguardCursor, LoadingScreen, ExitIntentModal, LanguageSuggestion, ZaloFloat, TransitionCurtain.

**Fix:** → **Sonnet** (remove 3 components + add delayed loading for ExitIntentModal)
- Remove VanguardCursor, LoadingScreen, TransitionCurtain
- Lazy-load ExitIntentModal after 30s of engagement
- Keep ZaloFloat and LanguageSuggestion

### 6.5 LOW: GA4 + Clarity Both Loaded

Two analytics scripts. Clarity adds ~30KB for heatmaps.

**Fix:** → **Haiku** (remove Clarity script tag + `initClarity()` calls)
Keep GA4. Drop Clarity if not actively reviewing heatmaps.

---

## 7. ACCESSIBILITY

### 7.1 GOOD — Focus Management

Focus-visible outlines styled globally. Exit intent modal has focus trap and Escape key. Mobile menu has `role="dialog"` and `aria-modal`.

### 7.2 GOOD — Reduced Motion

`prefers-reduced-motion` respected throughout — GSAP, Framer Motion, CSS animations all check. Global CSS forces 0.01ms durations.

### 7.3 MEDIUM: Low Contrast Text (WCAG AA Failures)

Multiple text elements at 25-50% opacity fail WCAG AA (4.5:1 ratio):
- Form labels: `opacity-60 font-light` at 12px
- Stats labels: `text-foreground/50` at 9-11px
- Bracket labels: `opacity: 0.65` on light gray

**Fix:** → **Sonnet** (audit and fix contrast ratios across components)
Minimum opacity for body text: 0.75 (preferably 0.85+). No readable text below 12px.

### 7.4 MEDIUM: No Skip-to-Content Link

Memory notes say it was removed as user preference. However, skip links are WCAG 2.1 AA required.

**Fix:** → **Haiku** (add 5-line skip link component)
Re-add a visually hidden skip-to-content link (visible on `:focus`).

### 7.5 LOW: Images Block Right-Click

`onContextMenu={(e) => e.preventDefault()}` in `AboutSection.tsx` prevents right-click. Also blocks screen reader context menus.

**Fix:** → **Haiku** (delete `onContextMenu` props from 3 Image components)
Remove. Watermark images if theft is a concern.

---

## 8. CONTENT STRATEGY

### 8.1 CRITICAL: Copy Is Teacher-Centric, Not Parent-Centric

**Current state:** Content talks about the teacher — credentials, methodology, approach. Hero says "English that finally sticks" — clever but vague.

**Problem:** Parents buy outcomes for their child, not methodology. The copy needs to answer: "What will happen to MY CHILD after studying here?"

**Fix:** → **Opus** (conversion copywriting across all sections + 4 locale translations)
- Rewrite hero: "Your Child Speaks English Confidently in 3 Months"
- Rewrite programs: Lead with outcomes, not method descriptions
- Add "Results" section: before/after stories, IELTS score improvements, school grades
- Add guarantee statement: "Free trial week — no obligation if your child doesn't enjoy it"

### 8.2 HIGH: Zalo/WhatsApp Should Be the Primary Communication Channel

**Current state:** Primary CTA is "Send Inquiry" (a form). Zalo/WhatsApp are secondary sidebar links in `VanguardInquiry.tsx` lines 470-499.

**Problem:** 70%+ of parent-teacher communication in Vietnam happens via Zalo.

**Fix:** → **Sonnet** (update CTA hierarchy in 4-5 components)
- Make Zalo the **#1 CTA everywhere**: hero, programs, conversion strip, exit intent
- Use pre-filled messages: `https://zalo.me/84353885757?text=Xin chào, tôi muốn hỏi về lớp tiếng Anh`
- WhatsApp as #2 (non-Vietnamese parents)
- Email form as #3

### 8.3 MEDIUM: No Vietnamese Brand Name

Consider adding a Vietnamese-searchable brand name: "Lớp Tiếng Anh Thầy Bek" or similar that parents would search for.

---

## 9. QUICK WINS (Implement First)

### Model Guide

- **Haiku** — mechanical find-and-replace, delete lines, trivial one-file edits. No architectural judgment needed.
- **Sonnet** — single-component changes, adding fields, updating styles, writing new components from a clear spec. Understands React/Next.js well.
- **Opus** — multi-file refactors, design system overhauls, new architectural patterns, tasks requiring judgment about UX/conversion/SEO tradeoffs, and anything touching i18n across 4 locale files simultaneously.

| # | Action | Impact | Effort | Model | File(s) | Why this model |
|---|--------|--------|--------|-------|---------|----------------|
| 1 | Fix Zod enum bug (form rejects non-EN locales) | Critical | Low | **Haiku** | `app/api/contact/route.ts` | Single-line change: `.enum([...])` → `.string().max(100)` on 3 fields |
| 2 | Add phone number field (make email optional) | Critical | Low | **Sonnet** | `VanguardInquiry.tsx`, `route.ts`, 4 locale JSONs | New form field + schema update + translations in 4 locales |
| 3 | Gate pricing behind phone collection | Critical | Medium | **Opus** | `VanguardLexicon.tsx`, new modal component, `route.ts`, 4 locale JSONs | Requires designing a new gated pricing flow — modal UX, form logic, API integration, conversion strategy decisions |
| 4 | Make Zalo primary CTA in hero + conversion strip | High | Low | **Sonnet** | `VanguardHero.tsx`, `ConversionStrip.tsx` | Swap CTA hierarchy in 2 components — needs design judgment for button styling |
| 5 | Remove loading screen | High | Low | **Haiku** | `client-layout.tsx`, `LoadingScreen.tsx` | Delete component + remove import/usage — purely mechanical |
| 6 | Add testimonials section | High | Medium | **Opus** | New component, `page.tsx`, 4 locale JSONs, `structured-data.tsx` | Designing a new section from scratch — layout, animation, review schema, i18n, where to place it in the page flow |
| 7 | Fix copyright year (2025 → dynamic) | Low | Trivial | **Haiku** | `VanguardNavigation.tsx:499` | One string replacement: `2025` → `{new Date().getFullYear()}` |
| 8 | Remove custom cursor | Medium | Low | **Haiku** | `client-layout.tsx`, `VanguardCursor.tsx` | Delete component + remove import, remove `data-cursor-label` attributes across files |
| 9 | Remove audio system | Medium | Low | **Sonnet** | `client-layout.tsx`, `audio-provider.tsx`, `VanguardHero.tsx`, `VanguardNavigation.tsx`, `VanguardFooter.tsx`, `VanguardInquiry.tsx` | Touches 6+ files — needs to trace all `useAudio()` / `playSound()` calls and remove cleanly |
| 10 | Add warm accent colors | High | Medium | **Opus** | `globals.css`, multiple components | Design system overhaul — choosing a palette, applying it consistently across light/dark themes, ensuring contrast compliance |

---

## 10. RECOMMENDED PHASES

### Phase 1: Convert (Week 1-2)
- Fix Zod enum bug (leads are being lost NOW) → **Haiku**
- Gate pricing → collect phone numbers → **Opus**
- Fix contact form (phone required, email optional) → **Sonnet**
- Add testimonials section with real parent reviews → **Opus**
- Make Zalo the primary CTA everywhere → **Sonnet**
- Remove loading screen, custom cursor, audio → **Haiku** (screen/cursor), **Sonnet** (audio)

### Phase 2: Attract (Week 3-4)
- Set up Google Business Profile → manual (not code)
- Publish 4 SEO blog posts (2 Vietnamese, 2 English) → **Opus** (content strategy + SEO optimization)
- Add Google Reviews integration and schema → **Sonnet**
- Create locale-specific OG images → **Sonnet**

### Phase 3: Polish (Week 5-6)
- Introduce warm color palette (exit pure grayscale) → **Opus**
- Simplify typography (reduce extreme sizes, drop monospace labels) → **Sonnet**
- Add test suite (API routes + E2E critical paths) → **Opus** (test architecture + comprehensive coverage)
- Simplify nav (remove font size/audio toggles, add CTA button) → **Opus** (UX judgment on what to keep/cut)
- Add urgency signals (enrollment dates, spots remaining) → **Sonnet**
- Fix accessibility issues (contrast, skip link) → **Sonnet**

### Phase 4: Scale (Ongoing)
- Weekly blog content in VI + EN → **Opus** (content quality)
- Collect and showcase video testimonials → **Sonnet** (component) + manual (video collection)
- Facebook/Zalo ads targeting Phú Nhuận, Gò Vấp, Bình Thạnh parents → manual (ad platform)
- Retargeting pixel for pricing-page visitors who didn't convert → **Sonnet** (pixel integration)
- A/B test hero messaging and CTA placement → **Opus** (variant design + analysis)

---

## APPENDIX: FILE REFERENCE

| Area | Key Files |
|------|-----------|
| Main page | `app/[locale]/page.tsx` |
| Hero | `components/VanguardHero.tsx` |
| Programs/Pricing | `components/VanguardLexicon.tsx` |
| Contact form | `components/VanguardInquiry.tsx` |
| Contact API | `app/api/contact/route.ts` |
| Navigation | `components/VanguardNavigation.tsx` |
| Footer | `components/VanguardFooter.tsx` |
| CTA strip | `components/ConversionStrip.tsx` |
| About | `components/AboutSection.tsx` |
| Methodology | `components/MethodologySteps.tsx` |
| Exit intent | `components/ExitIntentModal.tsx` |
| Loading screen | `components/LoadingScreen.tsx` |
| Custom cursor | `components/VanguardCursor.tsx` |
| Client layout | `components/client-layout.tsx` |
| Newsletter API | `app/api/newsletter/route.ts` |
| Community API | `app/api/community/submit/route.ts` |
| Revalidation API | `app/api/revalidate/route.ts` |
| Design system | `app/globals.css` |
| SEO metadata | `lib/seo.ts` |
| Analytics | `lib/analytics.ts` |
| Structured data | `components/structured-data.tsx` |
| Sitemap | `app/sitemap.ts` |
| Robots | `public/robots.txt` + `app/robots.ts` |
| Next config | `next.config.ts` |
| Translations | `messages/en.json`, `vi.json`, `zh.json`, `ru.json` |
| Locale layout | `app/[locale]/layout.tsx` |
| Root layout | `app/layout.tsx` |
