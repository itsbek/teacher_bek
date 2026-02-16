# SOTY Benchmark Scorecard (2026-02-15)

## Scoring Model
- Weighting uses Awwwards criteria: Design 40%, Usability 30%, Creativity 20%, Content 10%.
- Reference: https://www.awwwards.com/awards-of-the-day/

## Current Score (post-implementation)
- Design: 7.9 / 10 -> 3.16 weighted
- Usability: 8.1 / 10 -> 2.43 weighted
- Creativity: 7.6 / 10 -> 1.52 weighted
- Content: 8.0 / 10 -> 0.80 weighted
- Total: 7.91 / 10

## Target Score
- 9.3+ across all weighted dimensions.

## Evidence-Based Requirements

### Performance and Technical Quality
- Core Web Vitals optimization and stable rendering:
  - https://web.dev/articles/lcp
  - https://web.dev/articles/cls
  - https://web.dev/articles/inp

### Accessibility Baseline
- WCAG 2.2 must-pass behavior:
  - https://www.w3.org/TR/WCAG22/
- Focus appearance (keyboard UX):
  - https://www.w3.org/WAI/WCAG22/Understanding/focus-appearance.html
- Reduced motion support:
  - https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion

### SEO and AI-SEO
- Google Search quality and technical essentials:
  - https://developers.google.com/search/docs/fundamentals/seo-starter-guide
  - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Structured data and rich result quality:
  - https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
  - https://developers.google.com/search/docs/appearance/structured-data/faqpage

### UI/UX and Conversion Heuristics
- Usability heuristics:
  - https://www.nngroup.com/articles/ten-usability-heuristics/
- Form conversion and friction controls:
  - https://baymard.com/research/checkout-usability

## Remaining Work to Reach 9.3+
- Build bespoke art-directed transitions per route (home/about/services/faq/blog) with route-level choreography.
- Replace remaining stock imagery with brand-owned art direction assets.
- Add advanced interaction details: intent-aware CTA states, sticky contextual prompts, and high-contrast micro-feedback at every click path.
- Run Lighthouse + manual WCAG keyboard pass for all locales and remediate every failing item.
- Add analytics-based funnel diagnostics: landing -> section depth -> CTA click -> form completion -> submit.

## Completion Gate
- No page below 9.0 in internal rubric.
- Lighthouse targets: Perf >= 90, Accessibility >= 95, Best Practices >= 95, SEO >= 95 on key routes.
- Manual pass: keyboard-only complete journey from home to form submit in all locales.
