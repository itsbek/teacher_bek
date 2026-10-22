# design/ — teacherbek.com design system (static, standalone)

Plain HTML / CSS / vanilla JS. Not part of the Next.js app. Concept: **"The Red Pen"** (see `REVAMP_PLAN.md` §3).

```
design/
  fonts/fonts.css       self-hosted Playfair v2 + Inter (+ "Playfair Fallback", "Inter Fallback")
  tokens/tokens.css     all tokens as CSS custom properties (source of truth)
  tokens/base.css       reset, element defaults, utilities (grid, chapters, margin line, grain, buttons, inputs)
  tokens/tokens.json    same tokens as JSON (for Tailwind 4 @theme / Astro later)
  tokens/specimen.html  living specimen: colour, type in EN/VI/RU/ZH, spacing, grid, controls, motion
```

## Open it
Any static server, from the repo root:

    npx serve design        # then open /tokens/specimen.html
    python3 -m http.server -d design 8000   # http://localhost:8000/tokens/specimen.html

Append `?theme=dark` to force the dark "Blackboard" theme. Header buttons toggle theme and a grid overlay.

## Using the tokens
Load in this order: `fonts/fonts.css`, `tokens/tokens.css`, `tokens/base.css`.

- Light "Paper" is default. Dark follows `prefers-color-scheme` unless `<html data-theme="light">`; `<html data-theme="dark">` forces dark.
- Set `<html lang>` correctly: `:lang(en|vi|ru|zh)` rules tune line-height, tracking, label casing and CJK stacks.
- `<html data-tier="full|touch|lite">` is set once at boot (plan §5.1). `lite` zeroes durations and removes the grain.
- Components use semantic aliases only (`--color-bg`, `--color-fg`, `--color-accent` ...), never raw hex or `--paper`/`--red-pen` directly.
- Inside `.chapter--chalk` the aliases are re-pointed to chalk colours, so the same components work on the green chapter.

## Naming rules
`--{category}-{role}[-{variant}]`, lowercase kebab: `--color-*`, `--font-*`, `--fs-*` (size), `--lh-*`, `--tracking-*`, `--fvs-*` (font-variation-settings), `--space-N` (N = px/4), `--dur-*`, `--ease-*`, `--z-*`, `--tap-*`, `--safe-*`. Raw palette names (`--paper`, `--ink`, `--red-pen` ...) exist only to be aliased. Utilities: `.t-*` type roles, `.chapter--*`, `.col-span-*`, `.btn--*`. BEM for components.

## Rules (non-negotiable)
1. Red pen is for corrections, handwriting, the primary CTA and the focus ring. Never body text, never decoration. At most 5% of any screen.
2. No border radii, no box-shadows. `--radius: 0`. Borders are 1px `--color-rule`.
3. Body text never below 16px. Labels are 13/14px but never carry essential content alone.
4. Uppercase + 0.04em tracking only on Latin-script English labels. VI, RU, ZH labels: sentence case, tracking 0.
5. Never split Vietnamese by characters; split by words or lines.
6. Display type with Vietnamese keeps line-height >= 1.02 (xl) so stacked marks (ặ ỗ ữ) never clip.
7. Chinese uses system CJK stacks for whole runs; no webfont.
8. Highlighter: one word per screen, never under long text.
9. Chapters change background with hard edges. No gradients between sections.
10. Every text/background pair >= 4.5:1 (large text >= 3:1). Body text never animates.
11. Respect `prefers-reduced-motion` and `data-tier="lite"`: end states shown at once.
12. Tap targets >= 44px; buttons 56px tall on mobile; inputs >= 48px at 17px font.

## Deviations from the plan's hex values
- `--red-pen` light `#C8231B` -> `#C52019`: the original is 4.48:1 on Paper-2 (fails AA 4.5). New: 5.1:1 on Paper, 4.6:1 on Paper-2.
- Chalk-chapter red `#FF6A5C` -> `#FF7366`: original is 4.42:1 on `#22392D`. New: 4.7:1. Dark-theme `--red-pen` stays `#FF6A5C` (6.0:1 on Blackboard).
