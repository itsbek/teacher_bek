# P2a.8 reviewer pass (2026-10-22)

Profile for every number: 390x844, DPR 2.6, touch, CPU 6x, Slow 4G (150 ms RTT, 1.6 Mbps), headless Chromium, plain `python3 -m http.server` (no compression, so the numbers are pessimistic for production). Screenshots and scripts: `scratchpad/p2a/review/` (`measure.js`, `first-*.png`, `full-*-390.png`, `full-*-1440.png`, `mo/`).

## Before / after

| Metric (home) | Before (VI) | After VI | After EN | Budget |
|---|---|---|---|---|
| Font bytes | 483,604 (6 files) | **167,627** (3 files) | **167,627** (3 files) | <= 180 KB |
| LCP | 1,804-1,880 ms | **1,628 ms** (1,588 at 4x) | **1,620 ms** | <= 1,800 ms |
| CLS | 0.1197 | **0.0002** | **0.0061** | <= 0.05 |
| Total transferred | 802,719 B | **374,934 B** | 374,934 B | first view <= 450 KB |
| Requests | 15 | 11 | 11 | <= 25 |

Other pages (VI/EN), fonts 167,627 B each: answer-key LCP 1.25 s CLS 0; form-sheet 1.27 s / 0.0001; programme 1.27 s / <= 0.0009; 404 1.24 s / 0.0001; index 1.25 s / 0.011. RU (specimen page) loads 3 extra Cyrillic files = +82,664 B (~83 KB). Cyrillic never loads on VI/EN.

## Fixes made

1. Fonts
   - Cause of the Cyrillic loads: the Cyrillic `unicode-range`s included `U+0300-036F, U+2000-206F, U+20AC`, which overlap latin-vi (curly quotes, dashes). No Cyrillic text exists on VI/EN pages. Ranges are now Cyrillic-only.
   - Playfair italic is a static instance (opsz 72, wght 400): 147 KB -> 40.9 KB (Cyrillic 64 KB -> 19 KB). Features trimmed to kern/liga/ccmp/mark/mkmk/locl.
   - Playfair roman pinned to wght 500 (opsz still variable): 127 KB -> 73.8 KB. The survey showed all Playfair text is weight 500 except `.brand` (600, now 500) and `.fold b`/`.grp` (fixed), so no faux bold.
   - Inter italic files and `@font-face` deleted; `em, i` reset to `font-style: normal` in base.css. Only `playfair-latin-vi.woff2` is preloaded (all pages, both motion pages).
   - The "ink settles" opsz/wght animation is gone: `pen.js` `writeIn` is now clip-path handwriting reveal + a 0.55 -> 1 opacity soak over `--dur-settle`. `--fvs-accent` is `normal`; `--fvs-accent-from`, `--wdth-display-xl` and all italic `font-variation-settings` removed. `motion/hero-correction.html`, level-ladder, answer-key-unfold verified (no errors, pen overlay and "really" render).
   - Fallback metrics re-tuned for wght 500 and display opsz: `Playfair Fallback` 92.2%, new `Playfair Fallback XL` 89.9% (opsz 1200 hero/numerals), new italic fallback (Georgia Italic, 86.5%).
2. CLS. Layout-shift attribution showed the 0.10 shift came from the Playfair swap re-wrapping the hero H1 ("o Phu Nhuan" jumped from line 2 to line 1, ~0.10), plus the italic and Cyrillic swaps. Fixes: the headline tail is now `<span class="nb">` (nowrap) so the wrap cannot change; better fallback metrics; fewer, smaller fonts. EN residual 0.006 is the age pills re-wrapping when Inter 600 replaces Arial (not fixed; under budget).
3. LCP. The 113 KB `classroom.webp` (and other below-fold images) loaded eagerly and competed with render-blocking CSS: all non-hero images now `loading="lazy" decoding="async"`. Total weight 803 -> 375 KB. LCP is the hero sentence text.
4. Contrast: `.stage` tint 16% -> 14% (fg-soft 4.63:1); room-plan free ring opacity .55 -> .8 and stroke 2 (3.94:1 light, 4.23:1 dark); turnstile border now fg at 55% (3.96:1). `contrast.mjs` updated and report regenerated: 42/42 text pairs and 10/10 non-text pairs pass.
5. Visual
   - (a) Margin line vs hero glyphs: sentence blocks (`.hero__sentence`, `.phero__sent`, `.e404__sent`) now sit above the rule with a paper-coloured text-shadow halo, so the red hairline breaks cleanly around "I"/"E" instead of striking through them. Verified at 4x in light and dark.
   - (b) Face above the fold on mobile: the portrait is a 102 px cut-out in the sentence row, bleeding off the right edge and hanging below the sentence block (plan §4.1), the "Good!" mark shifted left of it, proof list full width. No height added except 8 px on `.hero__why`; H1 and sub still in the first 844 px above the sticky bar. No glyph is covered.
   - (c) Cheap/template check (§1.3): hero, problem, method, proof read editorial and square-cornered. Not fixed, listed below.
6. Consistency: all 5 motion pages now load `base.css` before `motion.css`; duplicated reset/body/focus rules removed from `motion.css`. Drift vs before: only line breaks (base's `text-wrap: pretty` / `balance`) in a few paragraphs, nothing structural.
7. REVAMP_PLAN §5.1 fonts row updated ("<= 180 KB per VI/EN page; RU pages add ~83 KB Cyrillic; Playfair italic static", ~83 KB measured, brief said ~90).

## Remaining issues

- Portrait is the grey-backdrop placeholder photo, not a real cut-out; the offset red frame is the stand-in for the cut-out edge.
- Level Ladder slider: the 48 px black square thumb on the track reads heavy/unfinished next to the fine type; candidate for a pen-circle thumb.
- Placeholder tags (`OWNER:`, `CONFIRM`, `temp`) are everywhere on purpose; they dominate screenshots.
- "Tap me" hand label + temp tag under the hero add clutter on mobile; remove when real handwriting lands.
- Frame budget on a real 4-core Android still untested; the tier logic sends it to `lite`.
- Lab server has no gzip/brotli; production will be faster. CSS (100 KB raw, 66 KB components.css) is still render-blocking; critical-CSS split recommended at build.
- Playfair has no check mark: UI checks stay SVG or Inter.
- The first mobile paint still flags a shift attributed to "recent input" in emulation; real layout is stable (verified with rAF timeline), so it is not counted.

## Owner review guide

Open on a phone (or 390 px devtools), light then dark, VI then EN (header switch).
1. `pages/index.html` - map of all screens.
2. `pages/home.html` - the main page. Look at: the hero sentence correction and the face next to it; the red margin line; the problem band; the method (green chapter); the level ladder; the testimonials; the room; the seat map; the FAQ; the footer wordmark. Judge feel and type, not copy.
3. `pages/programme.html`, then `pages/form-sheet.html` (the "Hold a seat" sheet states), then `pages/answer-key.html` (what the parent receives), then `pages/404.html`.
4. `motion/index.html` - the four signature interactions; try `?tier=lite` and reduced motion.
5. `tokens/specimen.html` - colour, type in EN/VI/RU/ZH.

Placeholder: all photos (teacher portrait, classroom), the handwriting marks (author-drawn stand-ins for your own hand), prices, schedule windows, group sizes, testimonials, ratings, address/map, and every item tagged `OWNER`/`CONFIRM`/`temp`. Not placeholder: layout, type, colour, motion and component behaviour.
