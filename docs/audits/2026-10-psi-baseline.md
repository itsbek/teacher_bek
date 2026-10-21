# PageSpeed Insights Baseline (2026-10-21)

**Status: quota exceeded.** All PSI API calls returned HTTP 429 (daily quota limit reported as 0 for the project). No PSI scores are available yet. Raw status is in `docs/audits/2026-10-psi-baseline.json`.

Next step: create a PageSpeed Insights API key (see `docs/setup/phase-0-owner-checklist.md`, step 6), then rerun.

## Existing lab numbers (headless Chromium, 2026-10-20)

Profile: mobile, Slow 4G, 4x CPU throttle.

| Page | TTFB | FCP | LCP | CLS | Total weight | JS | Font files |
|------|------|-----|-----|-----|--------------|----|------------|
| /en  | 506 ms | 3784 ms | 3784 ms | 0 | 758 KB | 272 KB | 40 |
| /vi  | 172 ms | 2640 ms | 2640 ms | 0 | 782 KB | n/a | 43 |

LCP target from CLAUDE.md is under 2.5 s. Both pages are above it in this profile.
