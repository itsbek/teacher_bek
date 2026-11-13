# Teacher Bek — brand system (v5 prototype, 2026-11-12)

Files: `docs/v4/proto2/brand/` — `mark.svg` (light), `mark-dark.svg` (dark), `favicon.svg`. The animated version is built in code: `js/core.js` (`markSVG()`), used in the preloader, header hover, menu and page transition.

## The mark
A capital **B** drawn in one ink stroke. Its waist curls inward like the hook of a question mark, and the letter stands on the question's dot. Every lesson starts with a question, and Bek is the one who asks it back. (Revised 2026-11-12: the first version read as an R.)

- Stroke: 6.5 units on a 64 × 84 grid, round caps and joins.
- Dot: blue `#0071E3` on light grounds, yellow `#FFC93C` on dark or blue grounds.
- Lockup: mark + wordmark ("*teacher*" in Newsreader italic 300, "**Bek**" in Archivo 800 at 62 % width), 10 px gap, wordmark aligned to the mark's centre.
- Clear space: the height of the dot × 3 on all sides. Minimum size: mark 20 px tall; lockup 28 px tall.
- Never: outline the mark, add effects, recolour the stroke blue, set it on a photo, or crop it.

## Colour
| Role | Hex | Use |
|---|---|---|
| Paper | `#FFFFFF` | main ground |
| Mist | `#F5F5F7` | alternate ground for scenes |
| Ink | `#1D1D1F` | text, drawings |
| Ink 2 / Grey | `#424245` / `#6E6E73` | secondary text (both pass 4.5:1 on white) |
| Why blue (primary) | `#0071E3` | every action, links, "why" moments |
| Sky | `#E8F1FD` | quiet blue fills |
| Aha yellow (secondary) | `#FFC93C` / soft `#FFF4D1` | highlights and the moment something is understood; never text on white |
| Right / wrong | `#248A3D` / `#D70015` | feedback only |

**Why these, and how strong the evidence is.** Colour-psychology findings are weaker and more context-dependent than marketing usually claims (Elliot & Maier, 2014, review in *Annual Review of Psychology* — **VERIFY**). What I rely on:
- **Blue for action and trust.** In brand-personality studies, blue is most associated with competence and trustworthiness (Labrecque & Milne, 2012, *Journal of the Academy of Marketing Science* — **VERIFY**). One consistent action colour also makes every next step easy to find.
- **Warm yellow only for "aha" moments.** Its job is salience. An item that looks different from its surroundings is noticed and remembered more (the isolation effect; von Restorff, 1933). Yellow is kept rare so it keeps that effect.
- **A neutral, Apple-clean base** keeps the type and drawings in charge.
- None of this guarantees more enquiries. Measure them with the analytics plan in the build guide.

## Type
| Role | Family | Settings |
|---|---|---|
| Structure, headlines, the frozen→open idea | **Archivo** variable (wdth 62–125, wght 300–800) | frozen: 62 % / 800 · open: 125 % / 300 |
| Bek's voice, quotes, the student's own words | **Newsreader** (roman + italic, wght 300–500) | 20–34 px, line-height 1.35 |
| Margin notes, pencil marks, handwriting moments | **Patrick Hand** | 20–28 px; never as a signature |

All three are open-licence (SIL OFL) and cover every Vietnamese character (checked 2026-11-12). Total ~254 KB, and only Archivo is preloaded.

## Illustration
- **Style:** single-line ink drawings, hand-authored as SVG in `js/ink.js`, 2.4-unit stroke (scaled to size), round caps.
- **Subjects:** objects and scenes only (notebook, pen, school bag, door, dog, sketchbook, note, stopwatch, clock, bird, window, key, glass, eraser, card box, plant, ruler, ticket). People appear only as real photographs. No faces are drawn.
- **Motion:** every drawing draws itself from one scroll value (`--k` 0→1), and each stroke has its own time window.
- **Colour:** ink by default. Blue marks the thing that matters in the drawing; yellow appears only at an "aha".

## Motion
- Easing: `release` cubic-bezier(.16,1,.3,1) for arrivals, `settle` (.65,0,.35,1) for state changes, `pop` (.34,1.56,.64,1) for tactile feedback.
- Every scrubbed effect reverses smoothly when scrolling up. Nothing that plays in real time (the hesitation, the stopwatch) depends on scroll speed.
- Reduced motion shows the finished state of every scene. The low-end tier drops the heavier layers.
