# Render and motion performance QA (P2a.6)

Scope: prototypes in `design/motion/` and `design/pages/home.html`, fonts in `design/fonts/`.
Run: headless Chromium (Playwright 1.59.1), local static server on `127.0.0.1` (port 8765, stopped at the end).
Scripts and raw output: `scratchpad/p2a/qa/` (`fonts-test.js`, `clip-check.js`, `perf.js`, `fontlist.js`, `results.json`, `perf-results.json`).
Screenshots: `scratchpad/p2a/qa/fonts/` (`pf-n-120@2x.png`, `pf-i-120@2x.png`, `pf-n-48@2x.png`, `in-n-16@2x.png`, `pf-n-120-padded@2x.png`, `fonts-test-full@2x.png`, `home-en-h1@2x.png`, `home-vi-h1@2x.png`).

Summary: fonts PASS. Home page FAILS the CLS and font-byte budgets and is at the LCP limit. Prototype frame times look good under emulation, but the device-class claim (<= 4 cores) is not tested. Nothing was run on a real device.

## A. Font rendering

Test string: `Tiếng Việt: ặ ẫ ỗ ữ ự ợ đ — Русский: Щёлкнуть`. Platform fonts come from CDP `CSS.getPlatformFontsForNode`. Every glyph must come from a web font.

| Element | Requested family | Size / style | Platform fonts used (glyph count) | Result |
|---|---|---|---|---|
| pf-n-16 | Playfair | 16px normal | Playfair 5pt SemiExpanded Light (45, web) | PASS |
| pf-n-48 | Playfair | 48px normal | Playfair 5pt SemiExpanded Light (45, web) | PASS |
| pf-n-120 | Playfair | 120px normal | Playfair 5pt SemiExpanded Light (44, web) | PASS |
| pf-i-16 | Playfair | 16px italic | Playfair 5pt SemiExpanded Light (44, web) | PASS |
| pf-i-48 | Playfair | 48px italic | Playfair 5pt SemiExpanded Light (44, web) | PASS |
| pf-i-120 | Playfair | 120px italic | Playfair 5pt SemiExpanded Light (43, web) | PASS |
| in-n-16 | Inter | 16px normal | Inter (45, web) | PASS |
| in-n-48 | Inter | 48px normal | Inter (45, web) | PASS |
| in-i-16 | Inter | 16px italic | Inter (45, web) | PASS |
| in-i-48 | Inter | 48px italic | Inter (45, web) | PASS |
| home h1, `?lang=en` | Playfair (via `--font-display`) | 56.32px | Playfair 5pt SemiExpanded Light (24, web) | PASS |
| home first p, `?lang=en` | Inter (via `--font-text`) | 14px | Inter (28, web) | PASS |
| home h1, default vi | Playfair | 56.32px | Playfair 5pt SemiExpanded Light (24, web) | PASS |
| home first p, default vi | Inter | 14px | Inter (28, web) | PASS |

Notes:
- The name "Playfair 5pt SemiExpanded Light" is the variable font's default instance name in the file. It is a web font (`isCustomFont` true), not a system font. The "Playfair Fallback" (Georgia) and "Inter Fallback" (Arial) faces were `unloaded` the whole time, so no fallback glyph was used.
- Glyph counts differ by 1–2 between sizes (45 vs 43–44). The string is identical; this is probably shaping or ligature differences by size, and it does not change which font is used.
- The "Playfair" name check is a prefix match, since the internal family name differs from the CSS family.

### Diacritic clipping

- At 120px with `--lh-display-xl` (0.9 from `tokens/tokens.css`), the marks on ế, ệ, ẫ, ỗ, ữ, ự, ợ and the Cyrillic Щё render complete. The element-only crop of pf-n-120 looked tight at the top edge, so I re-shot it with 40–60px padding (`pf-n-120-padded@2x.png`). The acute on ế and the tildes on ẫ/ỗ/ữ are fully inside the glyph box, with no clipping.
- The 120px element's `scrollHeight` is 255 against a 245 `clientHeight`. The overflow is the descender of the second line (y, ц), not the marks. `overflow` is visible, so nothing is cut.
- Italic 120px (`pf-i-120@2x.png`) renders the same marks cleanly.
- Inter 16/48 shows no clipping.

## B. Motion performance (emulated low-end Android)

Profile: viewport 390x844, DPR 2.6, isMobile, hasTouch, CPU throttle 6x (CDP `Emulation.setCPUThrottlingRate`), network Slow 4G (150 ms RTT, 1.6 Mbps down, 750 kbps up). The home page also ran at 4x, which matches REVAMP_PLAN §5.1.

Frame timing uses rAF deltas. The host runs rAF at about 120 Hz (median delta 8.3–8.4 ms), so "frames > 16.7 ms" is the 60 fps test. Frames > 33.4 ms count as dropped.

Caveat: the tier logic in `motion/tier.js` assigns `lite` when `hardwareConcurrency <= 4`, and `lite` skips the animation entirely. The host reports 14 cores, so every prototype ran in the `touch` tier, which is the animated path. The emulation did not spoof core count. A real 4-core device would run the lite (static) path. That path has no animation to measure.

| Prototype | Tier | Trigger / window | Frames | > 16.7 ms | > 33.4 ms | Longest | Median | LCP (ms) | CLS |
|---|---|---|---|---|---|---|---|---|---|
| hero-correction | touch | load, 6 s window | 1008 | 2 | 0 | 25.2 ms | 8.4 ms | 696 | 0.0002 |
| level-ladder | touch | 3x ArrowRight, 1.2 s apart | 616 | 1 | 0 | 20.8 ms | 8.3 ms | 836 | 0.0005 |
| seat-to-sheet | touch | scroll in, click free seat | 368 | 1 | 0 | 32.1 ms | 8.4 ms | 760 | 0.0002 |
| answer-key-unfold | touch | submit click | 487 | 1 | 1 | 58.9 ms | 8.3 ms | 788 | 0.0004 |

Notes:
- The prototype LCP values are from the whole page load, and the same for CLS.
- The 58.9 ms frame in answer-key-unfold occurs at the 3D unfold start. It is one frame and is the only frame over 33 ms in any prototype.
- Transfer per prototype: hero 473 KB (font 351 KB), ladder 570 KB (font 419 KB), seats 346 KB (font 180 KB), answer-key 474 KB (font 351 KB).

## Home page (`design/pages/home.html`, default vi)

| Metric | Measured (4x CPU) | Measured (6x CPU) | Budget (REVAMP_PLAN §5.1 / brief) | Result |
|---|---|---|---|---|
| LCP | 1840 ms | 1880 ms | ≤ 1800 ms lab | FAIL (about 40–80 ms over) |
| FCP | 1840 ms | 1880 ms | n/a | n/a |
| CLS | 0.1197 | 0.1197 | ≤ 0.05 | FAIL |
| Font bytes (6 files) | 483,604 B (484 KB) | same | ≤ ~180 KB per VI/EN page | FAIL (2.7x budget) |
| Total transferred (whole page load) | 802,719 B (803 KB) | same | first view ≤ 450 KB; full ≤ 1.5 MB | total OK, first view not split out |
| Requests | 15 | 15 | ≤ 25 first view | PASS |
| Long tasks | 1 | 2 | n/a | n/a |

Font files loaded on home: playfair-latin-vi 127,558 B; playfair-italic-latin-vi 147,562 B; playfair-cyrillic 68,737 B; playfair-italic-cyrillic 64,329 B; inter-latin-vi 52,625 B; inter-cyrillic 22,793 B. Note that `fonts/README.md` and REVAMP_PLAN §4 specify max 4 woff2 files at ≤ 120 KB. Eight files totaling 562 KB ship, and six of them load on this page. Both the Playfair italic and the Cyrillic subsets are fetched on a VI page, so the unicode-range splits are not keeping the VI page small.

CLS of 0.12 is above budget and was not traced to a source in this run. The likely candidates are the font swap and the size-adjusted fallbacks, but I did not verify that. Run a `layout-shift` attribution before fixing.

## C. Phase 2a acceptance items

1. **Prototypes run at 60 fps on a <= 4-core Android** — NOT CONFIRMED (emulation only, not a real device).
   - Emulated touch tier (animated path) showed no sustained jank: median frame 8.3–8.4 ms, at most 2 frames > 16.7 ms per run, one frame of 58.9 ms.
   - This is not evidence for a ≤ 4-core device. The emulation did not set `hardwareConcurrency` to 4, and on such a device the tier logic would select `lite` (static, no animation), so the animated path is not what a 4-core device would run.
   - Real-device check still needed: low-end Android, Chrome, Performance panel.

2. **VI diacritics and RU render in both fonts with no fallback glyphs** — PASS.
   - All 10 test rows (Playfair normal/italic at 16/48/120 px, Inter normal/italic at 16/48 px) resolve only to the web fonts.
   - Home h1 and first paragraph resolve to Playfair/Inter in both `?lang=en` and vi.
   - No diacritic clipping at 120px with the display line-height.

## Recommended follow-up (not done here)

- Fonts: drop the italic Cyrillic and Playfair italic subsets from the VI-first path, or load them only when italic Cyrillic is present. Bring the page under ~180 KB of fonts.
- CLS: attribute the 0.12 shift on home (`layout-shift` entries with sources) and fix before the budget can pass.
- LCP: 1840 ms at 4x CPU is just over budget. Re-test after the font reduction.
- Repeat the prototype run with `hardwareConcurrency` spoofed to 4 under `?tier=full` to get a worst-case animated number, then run on a real device.
