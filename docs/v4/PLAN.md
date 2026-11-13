# Teacher Bek v4: improvement plan

Source: the self-review written as the Awwwards jury would score it (2026-11-12). That review estimated about 6.5 / 10, honourable-mention level. The goal is 7.5+, the level where sites start winning Site of the Day.
Prototype: `docs/v4/proto2/` (EN + VI). Each item is ticked only after it has been checked in screenshots at 390 px and 1440 px, in both languages.

Last update: 2026-11-12 (round 2) — cover, all page turns, handwriting that grows up, notebook objects, frozen→open headings, Classes + Approach on paper, fixes, checks.

Status key: `[ ]` to do · `[~]` in progress · `[x]` done · `[!]` blocked (needs something from Bek)

## Decided already
- [x] Remove every mention of online classes: site, FAQ (EN + VI), build guide, `llms.txt` (2026-11-12)
- [x] Never state a class-size number; story starts at age 5; first person only; no ila or public schools; no sound
- [x] No new photos available. Use only `public/class.jpg` and `public/og-image.jpg`

## 1 · One world: the child's notebook (biggest item)
- [x] 1.1 The story happens inside a single notebook. A page turn (3D, scroll-driven) moves from one age to the next — *all 8 hand-offs: cover→6, 6→9, 9→11, 11→12, 12→14, 14→15, 15→17, 17→About (the approach link moved below the room so 15 turns straight into 17)*
- [x] 1.2 The notebook ages with the child: pencil and a crowded grammar table at 6, neater writing at 9–12, confident pen at 17. Same paper, different hand — *each page has a heading written stroke by stroke: kid print in pencil at 6 and 9 (“Unit 1 · to be”, “My week”), a steadier pen at 11–14 (“a / an / the”, “Past simple”, “My room”), cursive at 15–17 (“Present perfect”, “Free writing”). They stay in English on the VI pages: it is the student’s English notebook*
- [x] 1.3 Existing scenes become things in the notebook: the bag taped onto a page, the door as a fold-out flap, the dogs doodled in the margin, the key sentences written by the student, the sketchbook, note and stopwatch as page inserts — *bag taped down when it lands, door is a flap cut along a dashed line, dogs are pencil doodles, the two key sentences are taped index cards, sketchbook and stopwatch are taped inserts*
- [x] 1.4 The ink-blot silence and the pen-written answer at 17 stay as the two big moments, now inside the notebook
- [x] 1.5 A page counter in the notebook corner ("page 3 / 9") replaces the header age — *header shows "Page n / 9"; every page has a handwritten page number*
- [x] 1.6 About and the room become the last pages: the portrait taped in as a photo (uncropped), the classroom photo pinned in with a pushpin

## 2 · Frozen → open as the signature
- [x] 2.1 Every scene heading arrives narrow and heavy, then opens up as you read it (scroll-driven) — *the heading arrives heavy and narrow; its last phrase opens wide and light as it reaches the middle of the screen. Height is reserved, so nothing below it jumps*
- [x] 2.2 The same behaviour on Classes and Approach headings, so it reads as one system

## 3 · Hand-drawn quality
- [~] 3.1 Variable-width ink lines (pressure) instead of uniform strokes — *handwriting: every stroke has its own pressure; drawings: uneven edge from the ink filter. True tapering strokes in the drawings not done*
- [x] 3.2 Paper texture and a slight ink bleed, generated in code (no image files) — *SVG noise paper + an ink filter (slight wobble and bleed) on drawings and handwriting*
- [x] 3.3 Real letter-by-letter handwriting for the pen moments, using a single-stroke font so the pen actually writes each letter — *Hershey single-stroke fonts (OFL), subset to the letters the site writes: 6 KB gzipped*
- [~] 3.4 Redraw the icon-like drawings (clock, key, glass, window, cards, plant) in the new hand style — *re-inked: every line now has a second, lighter pen pass plus the ink filter. The shapes themselves are unchanged; a real redraw is still open*
- [x] 3.5 Fix: the stop-motion wobble cancels the flipped dogs; the wobble runs non-stop and costs battery (run it only while in view)
- [x] 3.6 Fix: room sketch lines don't match the real table in the photo; trace them properly — *re-traced on the 1536 × 1024 photo: room box, window, table and legs, blue chair, TV, both shelves, whiteboards, basket, stepping stones*

## 4 · Pacing and orientation
- [x] 4.1 Shorten every pinned scene (about 180–250 % of the screen height, down from up to 440 %) — *cover 200, 9→250, 11→250, 12→190, 15→230, 17→200. Two stay longer on purpose: age 6 at 330 (the silence plays in real time) and age 14 at 340 (three sideways panels)*
- [x] 4.2 A visible sense of progress: notebook page count, plus a thin progress line on the page edge

## 5 · Opening hook
- [~] 5.1 Opening: the notebook cover opens on load (replaces the loose big B) — *the hero is now the cover, with a Vietnamese-style school label (nhãn vở) that fills itself in on load: you / 5 – 17 / Bek (VI: em). The cover opens on the first scroll, not by itself; opening it automatically would take the page away before anyone reads the headline*
- [x] 5.2 Pulling "why" is obvious without reading a hint, and pulling it far enough tears into the first page — *the why gives a small pull by itself after 2.6 s (three times at most, stops once touched); pulling it past 60 % opens the cover; Enter or Space on the why does the same*

## 6 · Brand
- [!] 6.1 Logo: waiting for 1–2 logos Bek likes (any field)
- [!] 6.2 Palette: waiting for 1–2 websites whose colours feel right, plus one word for the feeling
- [x] 6.3 Meanwhile: the notebook world sets a provisional palette (paper, pencil grey, ink, one accent) that is easy to swap — *four tokens: `--nb-paper` #FFFDF8, `--pencil` #4A4A52, `--pen` #2B47B5 (ballpoint blue for the student's writing), `--accent` = why-blue*

## 7 · Portrait without new photos
- [x] 7.1 Soften the studio feel by art direction only: taped into the notebook like a school photo, with a hand-written caption beside it (never over the face). Uncropped, still protected

## 8 · Classes and Approach inside the same world
- [~] 8.1 Classes: the timetable as a notebook page, the age picker as a pencil on the page margin ruler, the free week as a slip tucked into the notebook — *every section is a numbered paper page with a handwritten heading; the first page turns like a cover; the ticket is taped in. The timetable itself is still the drawn bar week, not rewritten as a notebook timetable*
- [~] 8.2 Approach: five reasons as five annotated notebook pages, each with its own drawing and page turn — *on paper, numbered, cover turn into the reasons, handwritten “Five reasons”. The five keep their five different arrivals instead of five page turns (turns on all five felt repetitive)*

## 9 · Craft defects (from the review)
- [x] 9.1 Notebook writing got small after the fit-to-screen change; make it big without overflowing — *desktop: the page itself is now the notebook, writing is full-size; phone: 9 short rows on 12 lines, auto-fitted to the width*
- [x] 9.2 Pen still mostly glides; it should write (covered by 3.3)
- [x] 9.3 Door rule text revealed from below looks like a glitch — *now word by word, left to right*
- [x] 9.4 Dogs wrap unevenly on phones — *2 × 2 grid*

## 10 · Usability, accessibility, performance
- [x] 10.1 Keyboard alternative for every drag interaction (pull "why", flick tags out of the bag, tear the ticket, drag into the gap) — *why: Enter/Space; tags, word options, ticket: Enter/Space*
- [x] 10.2 Reduced-motion pass, page by page, both languages — *finished states: all handwriting written, counter at 212, silence shown as text, dogs visible, no stacked layers, no overflow*
- [~] 10.3 Real mid-range Android test: frame rate per scene, then cut whatever stutters — *no device here. Stand-in: phone viewport with the CPU slowed 4×, every scene ≥ 117 fps on the main thread, no frame over 50 ms. Paint cost of the ink filter can only be judged on a real phone; `?lite` turns it off*
- [x] 10.4 Weight check against the build-guide budget (fonts, scripts, SVG) — *measured, and over budget: own JS on the story page ≈ 30 KB gz (budget 14), CSS ≈ 20 KB gz (budget 20), fonts 254 KB in 4 files (budget 110 KB, one file). The budget was written for the type-only design; it needs a decision at port time*

## 11 · Content
- [!] 11.1 Vietnamese read by Bek or a native reader (list of flagged lines in the agent reports)
- [!] 11.2 Social proof: only real parent or student words used with permission; nothing invented
- [x] 11.3 Make the research notes easier to find without turning them into a lecture — *a “Field notes” list in every footer: one line per study, each opens its note card*

## Later (after approval of the prototype)
- [ ] Port to the Next.js site on branch `v4-ask-me-why` following `docs/plans/2026-11-11-v4-build-guide.md`, and update that guide to match this prototype
