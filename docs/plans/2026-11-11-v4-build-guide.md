# teacherbek.com v4 — Build Guide: "Ask me why."

Date: 2026-11-11 · Owner: Bek · Audience: the executor model that builds the site.

**How to read this.** Every decision is made here. The executor builds exactly what is written, in the order in §10, and stops to ask Bek whenever something is missing or contradictory. Items marked **VERIFY** are claims Bek must check before launch; the executor leaves them in place and lists them at each checkpoint.

## Build progress

Branch `v4-ask-me-why`, worktree `/Volumes/personal/code/teacher-v4` (created from `main`; `design-v3` left untouched).

| Step | Status | Notes |
|---|---|---|
| 1. Inventory | ✅ Done 2026-11-11 | Findings in "Step 1 findings" below |
| 2. Strip + empty shell | ✅ Done 2026-11-11 | EN/VI only; 23 packages removed; header, footer, stub pages; tsc, lint, build pass; all pages static |
| Checkpoint A | ✅ Approved 2026-11-11 (ai.txt deleted; lead-route change OK; hosting = Vercel) | Shell JS 102 KB shared, 107 KB per page (limit 110). Redirects verified: `/zh`, `/ru/*` → `/en/*`, `/services` → `/classes`. Font screenshots: `docs/v4/checkpoint-a/`. Open questions: ai.txt, lead-route change, hosting |
| 3. Tokens and type | ✅ Done 2026-11-11 | `styles/tokens.css`, `base.css`, `type.css`, `site.css`; header and footer styled; specimen at `/{locale}/type-test` (noindex, delete at step 11) |
| Checkpoint B | ❌ Rejected 2026-11-11 ("plain and dull") | Revised art direction prototyped in `docs/v4/proto/` (night/vermilion/bone stages, letter-proximity hero, flood wipe, fit-to-width "distance"). §3 is rewritten only after Bek approves the prototype |
| Prototype v2 | ⏸ Waiting for Bek | Bek: "more smooth, colours that don't feel like AI slop, richer interaction". v2: notebook palette (vở ô ly paper, mực tím ink, highlighter yellow), Lenis smooth wheel scrolling, ink-rise and highlighter wipes, flick-away answers (Beat 3), drag-into-gap (Beat 5), word-by-word own-words reveal (Beat 8), classroom photo parallax (Beat 10). Files: `docs/v4/proto/` |
| Prototype v3 | ⏸ Waiting for Bek | Bek: "a lot better"; asked for filler words instead of dots and a Site-of-the-Year-level world. v3 adds: designed preloader (count to 2,500 → "why?"), scroll-typed hesitation (uhm / I… uh… / errr / hmm / ummmmm, with ghost fillers), generative ink (tangled knot at 8 → travelling loops at 12 and 17), tactile cursor with labels + magnetic controls, field-note tags with sources, Beats 6 and 9, footer, cross-document page transitions to `classes.html`, reduced-motion and low-end tiers. Served at `http://localhost:8790/docs/v4/proto/` |
| Prototype v4 | ⏸ Waiting for Bek | Bek's v3 notes: classes/approach looked the same and were hard to find; field-note tags overlapped; hesitation too long and silent; scrolling up felt like a mirror; footer references poor; palette not premium; transitions not mind-blowing. v4: lacquer palette (sơn mài: lacquer black, eggshell, cinnabar, gold leaf made in code); WebGL ground with poured edges between scenes and cursor sheen; forward-only scenes (no rewind on scroll-up); shorter hesitation with synthesised voice (uhm / uh / errr / ummm), ticks, whooshes, bells, opt-in from the preloader; always-visible header (Classes, Approach, Sound, Menu), full-screen menu, chapter index, in-story doors; footnote markers → index cards; Approach page with five whys, tilting cards and a card catalogue; Classes page with age numerals, ten seats, weekly schedule, free week, FAQ; red footer. Snapshot of v3 in `docs/v4/proto-v3/` |
| Prototype v5 | ⏸ Waiting for Bek | Bek rejected v4's lacquer colours, synthesised sounds, flickering edges, invisible cursor and non-reversing scroll. Bek chose: **Apple-clean palette** (#FFFFFF / #F5F5F7, ink #1D1D1F, grey #6E6E73, accent #0071E3) and **real children's voice clips from free libraries** (any free licence, credited). v5: palette applied to all pages; WebGL layer, grain, gold leaf and all synthesised effects removed; clean straight transitions; cursor always visible (dark on light); every scene scrubs forward and reverses smoothly; hesitation uses 5 Freesound clips (credits in `docs/v4/proto/sounds/CREDITS.md` and the footer) |
| Prototype v6 | ⏸ Waiting for Bek | From Bek's v5 notes: wall = individual words popping from unique directions/sizes (no repeated lists); voices denoised and played in real time (never scroll-speed); "why" blue + heavier + underline; semantic colour (wrong = red, right = green); real 10-second word-count timer; distance scene readable from frame one; "native" removed everywhere (site + guide); type scale raised (min 13px labels, 16px captions); menu = fade; EN/VI switch in header with full Vietnamese pages (`*.vi.html`, draft for native review) |
| Prototype v7 | ⏸ Waiting for Bek | From Bek's v6 notes: each scene now has its own treatment (black silence, blue flood, sideways panels at 14, black "distance", growing sentence at 17, photo opening to full width); first person everywhere; ila and public schools removed; all sound and the sound choice removed; opener auto-plays in ~2 s; fillers are 18 different words with 8 different entrances; left chapter index replaced by an "Age 8 / 17" marker in the header; FAQ no longer boxed; tighter spacing; Vietnamese regenerated to match |
| Prototype v8 | ⏸ Waiting for Bek | Wall captions on solid plates; recall fillers ("what's the word…", "it's on the tip of my tongue…") instead of hmmm; story from age 5 with odometer age bridges between scenes; only the silence scene is black; room copy speaks to students and parents; protected portrait; class-size number removed; new Classes page (age dial, live Ho Chi Minh City clock with next class, ticket, FAQ); new Approach page (five-card deck, no card catalogue); blue full-screen menu with always-visible titles |
| Prototype v8.1 | ⏸ Waiting for Bek | About rebuilt (head-and-shoulders square crop beside the heading, beliefs as three steady columns, hover changes colour only); wall captions in one frosted card, scrubbed smoothly; hesitation wraps on phones; Vietnamese pages load their translations again (broken since sound removal), child hesitates in Vietnamese, cursor labels translated |
| Prototype v9 | ⏸ Waiting for Bek | "teacher Bek•" logo (header + footer, swaps its two type states on hover); readability raised (greys #515154, labels 15px); new moments: pull-the-why spring, wall implosion into the silence, age-17 word swarm, scroll-speed lean on big headings; footer slogan replaced by a chat contact flow on every page (who / age / name / Zalo number / note / consent → send animation → Open Zalo + copy message; real build POSTs to /api/contact → Telegram) |
| Prototype v10 (full rebuild) | ⏸ Waiting for Bek | Correction brief 2026-11-12: everything visual rebuilt in `docs/v4/proto2/` (EN + VI). New brand system (`docs/v4/brand.md`, `proto2/brand/*.svg`): B-into-question-mark mark, Archivo + Newsreader + Patrick Hand, Apple-clean base + why-blue + aha-yellow. Single-line ink illustrations drawn by scroll (`proto2/js/ink.js`). New preloader, page transition, cursor states, menu, and a distinct signature per scene. Portrait shown uncropped at its native 2:3. |
| Improvement plan | 🔄 Round 2 done 2026-11-12 | Live checklist: `docs/v4/PLAN.md`. 29 items done; 6 partial (3.1, 3.4, 5.1, 8.1, 8.2, 10.3); 4 blocked on Bek (logo, palette, VI read, real testimonials). New files: `css/notebook.css`, `js/notebook.js`, `js/write.js`, `js/strokes.js` (subset; full set `strokes.full.js`). Weight is over the §7 budget (own JS ≈ 30 KB gz, fonts 254 KB): needs a decision before the port. |
| Old prototypes | 🗑 Removed 2026-11-13 | v1–v4 prototypes (`docs/v4/proto/`, `docs/v4/proto-v3/`) were superseded by `docs/v4/proto2/` and removed from the repo (never committed). |
| Next.js port | ✅ Done 2026-11-12 (not committed) | Prototype ported: `lib/notebook/*` (core, story, classes, approach, pages, ink, write, strokes, content), `components/notebook/*`, `components/site/{Header,Footer,Chat,…}`, `styles/{brand,notebook,story,pages}.css`, messages `site/notebook/story/classes/approach/chat/leads` (EN = VI keys). Chat posts to `/api/contact`. Routes about/faq/type-test removed (301 → `/#about`, `/classes#faq`). Footer: no references list, no “no AI” line. tsc, lint, build pass; screenshots match prototype. Leftover public files unreferenced (kept): `public/images/*`, `public/assets/icons/zalo.svg`, `public/sw.js`. |
| 4. Static story | ⏳ | |
| 5. Engine and rail | ⏳ | |
| 6. Beat motion | ⏳ | |
| 7. Lead form | ⏳ | |
| 8. Supporting pages, SEO | ⏳ | |
| 9. Vietnamese | ⏳ | |
| 10. Analytics and monitoring | ⏳ | |
| 11. Acceptance run | ⏳ | |

### Step 1 findings

- **Font (VERIFY resolved):** Archivo variable has `wght` 100–900 and `wdth` 62–125, and covers every Vietnamese test glyph. Subset to Latin + Vietnamese, axes limited to wght 300–800 / wdth 62–125 → `public/fonts/archivo-vf.woff2`, **103 KB** (budget 110 KB). OFL licence at `public/fonts/OFL.txt`. Loaded with `next/font/local` (`adjustFontFallback: 'Arial'` generates the size-adjust/ascent overrides).
- **Hosting:** Vercel (the lead guard allows `*.vercel.app`, `.env.local.example` refers to Vercel env vars). To confirm with Bek.
- **`public/sw.js`:** an empty placeholder that only claims clients, so stale registrations stop 404ing. Harmless; kept.
- **`public/ai.txt`:** deleted (Bek, 2026-11-11). The only domain anywhere is `teacherbek.com`.
- **Privacy/terms** list `hello@teacherbek.com`. Bek confirmed 2026-11-11: no email is in use. Replace with phone/Zalo in step 8; no email address anywhere on the site.
- **Lead pipeline:** leads go to **both a Google Sheet and Telegram** (`lib/leads/submit.ts`); the privacy page must say so. The route accepts **JSON only** and has no "child's age" field, so two small changes to `lib/leads/handler.ts` are needed for §4 Beat 10 (no-JS form POST and the age field). **Approved by Bek 2026-11-11.** The Sheet stays as a second channel.
- **`CLAUDE.md`** describes the old design system (Lora, cream/copper, Tailwind, GSAP). It is superseded by this guide for v4 and should be rewritten when v4 merges.
- **Step 3 refinement (from the font test):** Frozen display text needs `word-spacing: 0.12em`; at wdth 62 and −0.03em tracking the word gaps nearly close.
- **Step 2 additions:** `eslint.config.mjs` created (the repo had none). `lib/telegram/strings.ts` keeps a Russian label in the bot's own language menu; it is not on the website and was left alone.
- **Removed beyond the §6 list:** `@vercel/speed-insights` (extra client JS; Core Web Vitals come from `web-vitals` → Plausible per §9.9).

### Step 3 findings (Checkpoint B)

Measured contrast (WCAG): ink/paper 17.16 · graphite/paper 4.99 · why/paper 3.68 (large text only, as specified) · why-deep/paper 5.07 · ink/why-tint 14.10 · evening-text/evening 15.42 · evening-text at 72%/evening 8.34 · why/evening 4.52 · graphite/why-tint 4.10 (**rule: never put graphite text on a swipe**).

Rules added from the specimen: the Frozen state is used only at ≥ 20px (at 13–14px it is illegible); the swipe is 0.55em tall so it reads; "5–17" is joined so it never breaks across lines. No horizontal overflow at 390 or 1440 in EN or VI.

**Fixed inputs (from Bek, 2026-11-11).**

| Item | Decision |
|---|---|
| Characters or mascots | None. Typography only. |
| Languages | English and Vietnamese. Chinese and Russian are removed. |
| Stack | Stays Next.js (App Router), same repo, same domain `https://teacherbek.com`. |
| ila | **Not mentioned anywhere** (owner, 2026-11-11, reversing the earlier "name it once"). No ila, no public schools, in copy, schema or profiles. |
| Class facts | As already stated in the repo (listed in §0.1). |
| Lead delivery | The existing Telegram bot (`lib/leads`, `lib/telegram`). No email. |
| Photos | Only `public/class.jpg` (1536×1024) and `public/og-image.jpg` (533×800 portrait). Nothing in `media/`. No audio, no video. |
| Claims | English teacher (owner removed "native" 2026-11-11: "not all natives are great teachers"), 4 years, about 2,500 students, ila and public schools, TESOL, PGCE. Nothing else. |
| Class size | Groups take up to 12 students, but **no number is ever stated** on the site; say "small groups" (owner, 2026-11-11). The story starts at age 5 (students as young as 5). |
| Portrait | `public/og-image.jpg` shown as a protected background (no `<img>`, no right-click/drag/long-press, hidden in print). Screenshots cannot be blocked by any website; this only deters casual saving. |
| Voice | Bek always speaks in first person ("I" / "mình"); never third person in running text (owner, 2026-11-11). |
| Sound | None. No audio, no sound toggle, no sound choice on entry (owner, 2026-11-11). |
| About Bek | Kept short. No biography, origin, other languages or hobbies anywhere. |
| Offer | Group classes in Bek's own classroom only. **No online classes** (owner, 2026-11-12). No one-to-one lessons, no home visits. |

### 0.1 Fact sheet (the only facts the site may state)

- Public name: **Teacher Bek** (Vietnamese: **Thầy Bek**). First-person copy says "I'm Bek".
- English teacher, based in Phú Nhuận, Ho Chi Minh City, Vietnam. Never describe Bek as "native" / "bản ngữ" (owner decision, 2026-11-11).
- Four years of teaching; about 2,500 students in total, from about age 3 to teens.
- Teaches at ila and in public schools; teaches small groups in the evenings in a private classroom.
- Qualifications: TESOL, PGCE.
- Classroom: Golden Mansion 1, 119 Phổ Quang, Phú Nhuận. In person only; never mention online classes.
- Classes: group only, maximum 10 students. Young Learners ages 5–10; Teens ages 11–17. Students aged 5 to 17 only.
- Format: twice a week, 90 minutes plus a 15-minute break. Weekdays 19:30–21:00; weekends 14:00–20:00 (GMT+7).
- First week free. No contract; month to month.
- Room: CCTV, private restroom, air conditioning.
- Phone / Zalo: +84 353 88 5757.

**Must not appear:** any mention of Uzbek, Russian, Tashkent, Uzbekistan, "seven languages", where Bek is from, or other languages Bek speaks (delete these from `messages/*.json`, `components/structured-data.tsx`, `app/[locale]/layout.tsx`, `components/pages/AboutPageClient.tsx`, schema `knowsLanguage`, and anywhere else a search finds them); one-to-one lessons, private tutoring, "gia sư", teaching at students' homes; biography, hobbies, personal history; MBA, "15+ schools", BlueSky, the four existing testimonials, star ratings, prices, the pricing gate, the exit-intent popup, the marquee, the loading screen.

**Classroom observation rule.** "About 8 in 10 students say they are burnt out" appears once (Beat 3), always with the sentence that it is Bek's own classroom observation and not research. It never appears in metadata, schema, FAQ answers, or `llms.txt`.

---

## 1. Creative concept

**The idea: type that holds its breath, then breathes out.**

The whole site is set in one variable typeface with a width axis and a weight axis. Language taught as theory is shown in the typeface's **frozen** state: narrow, heavy, tight, grey, stacked in tables. Language that has been understood is shown in the **open** state: wide, light, loose, with one warm colour. The moment between the two is always the same small word: **why?**

The reader does to the page what Bek does in a lesson. They meet a rule that looks like a wall, ask why, and watch the wall relax into something a person could say.

**Why it fits.** Bek's philosophy is that explaining why a piece of language exists lets students build their own understanding. The concept makes that literal and repeatable: the visitor does not read about the method, they experience three real "whys" (a/the, wrong answers, the past form as distance) and feel the relief each time.

**How it sustains.**

- **One mechanism, three scales.** A word opens (hero), a rule opens (Beat 4), three chapters of grammar open into one idea (Beat 7).
- **The height chart.** A thin vertical rail on the left edge with pencil-like tick marks, like the marks families draw on a door frame. It is the scroll indicator, and it carries the story's age from 8 to 17.
- **The bookend.** The question "Tell me about your week" is asked twice. At 11 the answer is a tired list. At 17 it is a sentence the student owns.
- **Field notes.** Research appears as short margin notes in a teacher's voice, one per beat, never as a lecture.
- **Material honesty.** One font file, two photographs, no other images, no WebGL, no sound. This is the craft statement and the performance strategy at once.

---

## 2. Narrative arc (home page)

| # | Beat | Rail age | Emotion to produce | Research note |
|---|---|---|---|---|
| 1 | Hook: "Ask me why." | — | Curiosity; a small smile | — |
| 2 | The Wall | 8 | Recognition, with humour at the absurd pile | Sweller, 1988 (cognitive load) |
| 3 | The Speaking Test | 11 | A light "oh"; then relief | Edmondson, 1999 (psychological safety) |
| 4 | The Turn: a / the | 12 | The "aha" | Craik & Tulving, 1975 (depth of processing) |
| 5 | Wrong Answers Welcome | 13 | Play, delight | Roediger & Karpicke, 2006 (retrieval practice) |
| 6 | Same Task, Three Ways | 14 | Feeling seen | Wood, Bruner & Ross, 1976 (scaffolding) |
| 7 | Distance | 15–16 | The big release; "why did nobody say this?" | Lewis, 1986 (pedagogical grammar, **VERIFY**) |
| 8 | Their Own Words | 17 | Pride, hope | Ryan & Deci, 2000 (self-determination) |
| 9 | Who's Talking | — | Trust | — |
| 10 | The Room | — | Calm; an open door, no push | — |

Tension rises through Beats 2–3 (type gets denser, greyer), turns at Beat 4, and each later beat is lighter and wider than the one before. Beat 7 is the peak. Beats 9–10 are still and quiet.

### 2.1 Research register (exact claims allowed)

Each note uses only the wording below. Full citations are listed on `/approach` and in the home footer "Sources" list.

1. **Sweller, J. (1988).** "Cognitive load during problem solving: Effects on learning." *Cognitive Science*, 12(2). Claim: working memory is limited, and overloading it leaves little capacity for learning.
2. **Edmondson, A. (1999).** "Psychological safety and learning behavior in work teams." *Administrative Science Quarterly*, 44(2). Claim: teams whose members felt safe to speak up and admit mistakes showed more learning behaviour. State that the study was of work teams, not classrooms.
3. **Craik, F. I. M., & Tulving, E. (1975).** "Depth of processing and the retention of words in episodic memory." *Journal of Experimental Psychology: General*, 104(3). Claim: words processed for meaning were remembered better than words processed for appearance or sound.
4. **Roediger, H. L., & Karpicke, J. D. (2006).** "Test-enhanced learning." *Psychological Science*, 17(3). Claim: students who practised recalling a text remembered more of it a week later than students who re-read it.
5. **Wood, D., Bruner, J. S., & Ross, G. (1976).** "The role of tutoring in problem solving." *Journal of Child Psychology and Psychiatry*, 17(2). Claim: introduced "scaffolding" — the tutor adjusts help to what the learner can nearly do alone.
6. **Ryan, R. M., & Deci, E. L. (2000).** "Self-determination theory and the facilitation of intrinsic motivation, social development, and well-being." *American Psychologist*, 55(1). Claim: motivation is sustained when people feel autonomy, competence and relatedness.
7. **Lewis, M. (1986).** *The English Verb.* Language Teaching Publications. **VERIFY** (title, year, and that it presents past forms as "remoteness"). This is a teaching view of grammar, not an experiment; the note must say so.

Not used, and why: Krashen's affective filter (a contested hypothesis), Bloom's "2 sigma" (later studies found smaller effects, and Bek teaches groups), any percentage or effect size (none are quoted, so none can be wrong).

**VERIFY for all seven:** volume and issue numbers. Author, year, title and the claim wording are stated with confidence.

---

## 3. Art direction

### 3.1 Palette

| Token | Hex | Role |
|---|---|---|
| `paper` | `#F7F7F4` | Page background, Beats 1–9 |
| `ink` | `#141414` | Primary text |
| `graphite` | `#6B6B66` | Frozen type, notes, secondary text (≥ 4.5:1 on paper) |
| `line` | `#D9D8D2` | Rail, rules, table lines |
| `why` | `#E8452C` | The single accent: open words, the "why?" chip. Only for text ≥ 24px or non-text marks |
| `why-deep` | `#C2371F` | Accent for text below 24px and for links (≥ 4.5:1 on paper) |
| `why-tint` | `#FFD9CF` | Highlight swipe behind a word; never as text |
| `evening` | `#1A1714` | Background of Beat 10 and the footer |
| `evening-text` | `#F2EEE6` | Text on `evening` |

Rules: no gradients, no shadows, no second accent, no dark-mode toggle (remove `next-themes`). The executor measures every text/background pair with a contrast checker and reports the ratios at Checkpoint B.

### 3.2 Type system

**One family: Archivo (variable), by Omnibus-Type, SIL Open Font License.** Axes used: `wght` 300–800, `wdth` 62–125. Roman only; no italic file. Self-hosted WOFF2, subset to Latin + Vietnamese, axis ranges limited to the values above at subset time. **VERIFY:** Archivo's variable build has both axes at these ranges and covers all Vietnamese diacritics. The executor tests this at Checkpoint A with the string `Tiếng Anh ở Phú Nhuận, Gò Vấp, Bình Thạnh — ưỡng ẫ ỷ ợ ữ` and stops if any glyph falls back.

Fallback stack: `"Archivo", "Arial Narrow", Arial, sans-serif`, with `size-adjust`, `ascent-override` and `descent-override` tuned so the hero H1 moves by less than 2px on font swap. `font-display: swap`. Preload the single font file.

| Style | Size | wght | wdth | Line-height | Tracking |
|---|---|---|---|---|---|
| Display (hero H1) | clamp(44px, 9.5vw, 148px) | 800 | 62 | 0.92 | −0.03em |
| H2 (beat headline) | clamp(32px, 5.2vw, 80px) | 700 | 75 | 1.0 | −0.02em |
| H3 | clamp(22px, 2.2vw, 32px) | 650 | 90 | 1.15 | −0.01em |
| Story line | clamp(20px, 1.9vw, 28px) | 400 | 100 | 1.35 | 0 |
| Body | 17px (≥1024px: 18px) | 400 | 100 | 1.55 | 0 |
| Field note | 14px | 500 | 88 | 1.45 | 0.01em |
| Label | 13px, sentence case | 600 | 88 | 1.3 | 0.04em |

**The two states** (applied to any element; everything between is interpolated):

| | wdth | wght | Tracking | Colour |
|---|---|---|---|---|
| Frozen | 62 | 800 | −0.02em | `graphite` |
| Open | 125 | 300 | +0.01em | `ink`, key word in `why` |

Vietnamese headlines get line-height +0.08 over the table values so stacked diacritics never clip. No all-caps anywhere except the frozen grammar tables.

### 3.3 Grid and spacing

- Desktop (≥ 1024px): 12 columns, 24px gutters, side margins clamp(32px, 5vw, 96px). The rail lives in column 1. Story text starts at column 3. Field notes sit in columns 10–12.
- Tablet (640–1023px): 8 columns, 20px gutters, 32px margins. Field notes drop inline under their sentence.
- Mobile (< 640px): 4 columns, 16px gutters, 20px margins. The rail is a 2px line 8px from the left edge with the age label at the top-left under the header.
- Measure: story lines max 34ch; body max 62ch.
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 72, 112, 168. No other values.
- Corners: radius 0 everywhere, except chips (`why?`, answer options, the three-way switch), which are full pills.

### 3.4 Tone of voice

First person, short sentences, concrete nouns, dry warmth. One light joke per beat at most. Never guilt ("your child is falling behind"), never hype ("unlock", "transform", "guaranteed"), never exclamation marks outside quoted student speech. Vietnamese addresses parents as "ba mẹ", refers to students as "các bạn nhỏ" / "các bạn", and Bek as "thầy Bek" / "mình".

---

## 4. Section-by-section specification (home, `/en` and `/vi`)

English copy below is final. The Vietnamese copy is produced in Build Step 9 and must be approved by Bek before it ships.

**Shared mechanics.** Each pinned beat is a tall section containing a `position: sticky` stage of 100svh. The scroll engine writes one number, `--p` (0 to 1), onto the section; all visuals are CSS functions of `--p`. All story text is real HTML in the server response. Purely decorative repeats (the flood of table rows, the scattered "dog" words) are created by client JS inside `aria-hidden` containers and never exist in the server HTML.

**Field note component.** A small block: label "Field note", one or two sentences, then "— Author, year". It fades and slides 12px into place when its sentence crosses 60% of viewport height. Markup is an `<aside>` containing a `<cite>`.

### Header (all pages)

- Left: wordmark "Bek" (Label style, links to locale home). Right: "Classes", "Approach", language switch "VI / EN".
- 56px tall, `paper` at 92% opacity with no blur, fixed. Hides on scroll down after 200px, returns on scroll up (240ms).
- Skip link "Skip to content" as first focusable element.

### Beat 1 — Hook

- **Purpose:** state the idea in one sentence; give search engines the entity in the first screen.
- **Copy.** Eyebrow: "Bek · English teacher · Phú Nhuận, Ho Chi Minh City". H1: "English makes sense when someone tells you **why**." Under it (Story line): "I teach children and teenagers. This page follows one of them, from eight to seventeen." Cue: "Scroll. We start at age eight."
- **Layout:** 100svh. H1 spans columns 2–11, bottom-aligned 112px above the fold. Eyebrow top-left under the header.
- **Visual:** H1 in Frozen state. The word "why" alone moves to Open and `why` colour, pushing its line wider.
- **Scroll:** not pinned. As the hero leaves, the rail draws down from the top (scaleY 0→1) and the label "8" arrives.
- **Interaction:** hovering or tapping "why" makes it close and reopen once (400ms).
- **SEO role:** the page's only H1; eyebrow carries name, profession and place as plain text.

### Beat 2 — The Wall (age 8)

- **Purpose:** show what theory-first teaching feels like, with humour.
- **Copy.** H2: "At eight, English arrives like this." Table rows (real text, 7 rows): "I AM · YOU ARE · HE IS · SHE IS · IT IS · WE ARE · THEY ARE". Lines appearing in order: "A table." / "Then another one." / "Learn it by Friday." / "Nobody mentions what it's for." Counter label: "Things to memorise:" followed by a number. Final small line, centred: "…" with the caption "— an eight-year-old, when asked to speak".
- **Field note:** "Working memory is small. Fill it with unconnected items and there is little room left to learn. — John Sweller, 1988"
- **Layout:** pinned, section height 280vh. Table in columns 3–9, Frozen state, uppercase.
- **Visual and scroll:** `--p` 0–0.6: decorative rows (verb tables: "GO WENT GONE", "BE WAS BEEN", and so on, from a fixed list of 40 real irregular verbs) stream in from below; the whole block scales from 1 to 0.34 so the screen becomes a grey texture of rules. The counter runs 7 → 212 (a playful count, clearly not a statistic; do not add a unit or source). `--p` 0.6–1: the texture holds, and "…" blinks at 1Hz.
- **Row count:** 120 decorative rows on the full tier, 40 on the lite tier. Only `transform` and `opacity` animate.
- **Transition out:** the texture slides up as one block at scroll speed; "…" stays on screen 20vh longer than everything else.
- **SEO role:** H2 plus four plain sentences; none of the decorative rows are in the HTML.

### Beat 3 — The Speaking Test (age 11)

- **Purpose:** acknowledge burnout once, lightly, then release it.
- **Copy.** H2: "In speaking tests I ask one easy question." Question (Display size, Open state): "Tell me about your week." Answers, stacked, Frozen: "School." / "Extra maths." / "Extra English." / "Homework." / "Sleep, I think." Caption under the stack: "A composite of answers I hear. Not one student's words." Then: "About eight in ten of my students tell me some version of this. That is not research. It is what I hear in my own classroom." Release line (H3): "So I don't add to the pile. I take something off it." Last line: "First rule of my room: wrong answers are welcome."
- **Field note:** "In a study of work teams, the ones where people felt safe to admit mistakes learned more. Those were adults in a factory. I see the same thing in eleven-year-olds. — Amy Edmondson, 1999"
- **Layout:** not pinned; normal flow, columns 3–9, 168px above and below.
- **Visual:** each answer enters as its line crosses 70% viewport height (triggered, 400ms, 40ms stagger). When the release line enters, the five answers ease from wght 800 to 300 and drift 24px down with opacity to 0.35 over 700ms: the pile gets lighter. The question stays at full strength.
- **SEO role:** contains the only statement of the observation, with its disclaimer adjacent in the same paragraph.

### Beat 4 — The Turn: a / the (age 12)

- **Purpose:** the first "why". The visitor feels the method work on them.
- **Copy.** H2: "Here is a rule." Frozen block: "USE A BEFORE SINGULAR COUNTABLE NOUNS. USE THE FOR SPECIFIC NOUNS." Line: "Correct. Also useless to a twelve-year-old." Chip button: "why?" Resolved text (Open): "**a** means one of many. I haven't told you which." / "**the** means you already know which one I mean." Demo caption: "Pick a dog. Any dog." After picking: "Now it's **the** dog. You made it specific." Closing: "That's the whole rule. You can't un-know it now."
- **Field note:** "People remember words far better when they think about what the words mean than when they attend to how the words look or sound. — Craik & Tulving, 1975"
- **Layout:** pinned, 300vh. Rule block columns 3–10. Demo field fills the stage behind the text.
- **Visual and scroll:** `--p` 0–0.35: the rule sits Frozen; the chip pulses once. `--p` 0.35–0.6 (or immediately on pressing the chip, which scrolls the page to `--p` 0.6 over 700ms): the rule block's wdth and wght scrub from Frozen to Open and the two resolved sentences replace it by crossfade. `--p` 0.6–1: twelve copies of the word "dog" (decorative, graphite, 40% opacity, varied sizes 20–64px, fixed seeded positions) appear with a small "a" beside a random one that changes every 900ms.
- **Interaction:** tapping, clicking, or keyboard-activating any "dog" locks it: it swells to wdth 125, turns `why`, gets the `why-tint` swipe, and its article becomes "the". The others dim to 20%. Each "dog" is a real `<button>` with the accessible name "dog" inside a group labelled "Pick a dog".
- **Transition out:** the chosen "the dog" stays pinned 15vh longer, then leaves.
- **SEO role:** a plain-text explanation of a/the that is quotable on its own.

### Beat 5 — Wrong Answers Welcome (age 13)

- **Purpose:** show that play and guessing are the practice.
- **Copy.** H2: "Once the why lands, they start guessing. Good." Sentence: "Yesterday I ___ to school." Chips: "goed", "went", "wented". Response to "goed": "Smart mistake. You used the rule for regular verbs. English just forgot to be regular here." Response to "wented": "Even smarter. You knew it was irregular and added the rule anyway." Response to "went": "Yes. And notice you had to pull it out of your head. That pull is the practice." Line: "We don't re-read lists. We play them back."
- **Field note:** "Students who practised recalling what they had read remembered more a week later than students who read it again. — Roediger & Karpicke, 2006"
- **Layout:** not pinned. Sentence at Display size, columns 2–11; chips below; response in an `aria-live="polite"` region.
- **Visual:** the chosen chip flies into the gap (400ms, the "pop" ease). Wrong answers never turn red and never shake; they sit in the gap in `graphite` while the response shows, then return to the row. "went" lands in `why` and the sentence moves to Open.
- **SEO role:** H2 and the retrieval-practice sentence.

### Beat 6 — Same Task, Three Ways (age 14)

- **Purpose:** show personalisation as a concrete act.
- **Copy.** H2: "Same task. Three students. Three ways in." Task line: "Describe your room." Switch labels: "The one who draws", "The quiet one", "The one who has to win". Versions: (1) "Draw it badly. Then tell me everything I'd get wrong about it." (2) "Write three true things and one lie. I'll try to catch the lie." (3) "Sixty seconds. I'm counting your words. Go." Caption: "Composite students. Real tactics."
- **Field note:** "Good tutoring adjusts the help to what this learner can almost do alone. The researchers called it scaffolding. — Wood, Bruner & Ross, 1976"
- **Layout:** not pinned. Switch is a three-option radio group above one large text block (Display size at 70%), columns 2–11. All three versions are in the HTML as a list; with JS, one shows at a time.
- **Visual:** each version has its own axis setting: (1) wdth 125 / wght 300, (2) wdth 62 / wght 500, (3) wdth 100 / wght 800. Switching morphs the axes over 700ms while the words crossfade at the midpoint.
- **Interaction:** arrow keys move between options; on first view it auto-advances once through all three (1.8s each), then stops for good.
- **SEO role:** a plain statement of personalised teaching with three examples.

### Beat 7 — Distance (ages 15–16)

- **Purpose:** the peak. Three chapters of grammar become one idea.
- **Copy.** H2: "By fifteen there are three more chapters." Three Frozen blocks with labels: "PAST SIMPLE — I wanted to ask you something." / "SECOND CONDITIONAL — If I had wings, I'd fly." / "POLITE REQUESTS — Could you open the window?" Line: "Three chapters. Three tests. One why." The word: "distance". Three resolved lines: "Distance in time: it's over." / "Distance from reality: it isn't true." / "Distance between people: I'm being polite." Closing: "The past form was never only about the past."
- **Field note:** "This is a teacher's way of seeing grammar, not an experiment. I borrowed it from Michael Lewis's book The English Verb, 1986." (**VERIFY**)
- **Layout:** pinned, 340vh. Three blocks in columns 2–5, 5–8, 8–11 (stacked on mobile).
- **Visual and scroll:** `--p` 0–0.3: blocks arrive one by one. `--p` 0.3–0.55: they slide together until they overlap into one grey slab. `--p` 0.55–0.85: the slab fades and the word "distance" appears at Display size and spreads: wdth 62→125 and letter-spacing −0.02em→ the value that makes the word span the full content width (compute once on resize). The word enacts its meaning. `--p` 0.85–1: the three resolved lines rise beneath it, 40ms stagger.
- **Transition out:** "distance" stays stretched and scrolls away naturally.
- **SEO role:** quotable explanation tying three grammar topics to one concept.

### Beat 8 — Their Own Words (age 17)

- **Purpose:** resolution; the bookend closes.
- **Copy.** H2: "Same question, six years later." Question: "Tell me about your week." Answer (Display size at 60%, Open): "Honestly? It was a lot. But I've started climbing. I'm terrible at it, and I love it." Caption: "A composite. Every part of it is something a student has said to me." Line: "No table in sight. Just a seventeen-year-old with something to say, and the English to say it."
- **Field note:** "People keep going when they feel three things: I chose this, I can do this, I belong here. — Ryan & Deci, 2000"
- **Layout:** pinned, 220vh, columns 2–11.
- **Visual and scroll:** the "…" from Beat 2 appears first, alone, in the same position. As `--p` runs 0.1–0.8 the answer is revealed word by word (opacity only, tied to scroll, so it reads at the visitor's pace). "a lot", "I've started" and "the" hold a `why-tint` swipe: the whys they learned are inside their own sentence. The rail reaches its top mark; the label reads "17".
- **SEO role:** closes the narrative in plain text.

### Beat 9 — Who's Talking

- **Purpose:** trust, in as few words as possible. This is the only place on the home page that talks about Bek, and it stays this short.
- **Copy.** H2: "I'm Bek." Paragraph: "An English teacher in Ho Chi Minh City. Four years, about 2,500 students, TESOL and PGCE. By day I teach at ila and in public schools. In the evenings I teach small groups in my own classroom in Phú Nhuận." H3: "Three things I believe". List: "Learning should feel like play, not like one more task." / "Every piece of language exists for a reason. I teach the reason first." / "The same lesson should reach different students in different ways." No link to `/about` from here.
- **Layout:** not pinned. Portrait in columns 2–4, text in columns 6–11. On mobile the portrait sits above the text at 160px wide, left-aligned.
- **Visual:** `og-image.jpg` at a maximum display width of 266px (its pixels allow no more at 2×), natural colour, no filter, no overlay, no text over it, radius 0. Used once on this page. Checkpoint question for Bek: is a higher-resolution original available?
- **SEO role:** the canonical entity description; matches Person schema word for word.

### Beat 10 — The Room

- **Purpose:** the quiet invitation.
- **Copy.** H2: "If you'd like your child to learn this way". Paragraph: "There's a room in Phú Nhuận with one long table. Small groups, never more than ten. Twice a week, ninety minutes with a break in the middle." Facts list: "Young Learners: ages 5–10" / "Teens: ages 11–17" / "Weekdays 19:30–21:00 · Weekends 14:00–20:00" / "Golden Mansion 1, 119 Phổ Quang, Phú Nhuận" / "The first week is free, so your child can see how it feels. No contract after that; it's month to month." Links: "Read about the classes →" (`/classes`). Primary action: "Message me on Zalo". Form heading: "Or leave a note". Fields: "Your name", "Phone or Zalo", "Your child's age" (select, 5–17), "Anything you'd like me to know" (optional). Consent checkbox: "I agree that Bek may use these details to reply to me. See the privacy note." Button: "Send". Success: "Got it. I'll reply within a day." Failure: "That didn't send. Zalo will reach me right away."
- **Layout:** background changes from `paper` to `evening` across the last 30vh of Beat 9 (scrubbed). Photo in columns 2–8, text and form in columns 9–12; stacked on mobile with the photo at full content width, 3:2.
- **Visual:** `class.jpg`, natural colour, no filter, no text over it. Served as AVIF and WebP at 640, 960 and 1536 widths, lazy-loaded, with width and height set.
- **Interaction:** the form posts to the existing `/api/contact` route and the existing Telegram delivery. The child's name is never asked. The form works without JS as a normal POST.
- **SEO role:** NAP and class facts in plain text; internal link to `/classes`.

### Footer

On `evening`. Contents: name and one-line description (§9.5), address, phone, Zalo, the "Sources" list (the seven citations, full text, visible), links to all pages, language switch, privacy and terms. No social icons unless the profile URLs already in `lib/seo.ts` are confirmed live by Bek.

### Supporting pages (plain, fast, static; no pinned scenes)

Each uses the same type system, one column of text (columns 3–9), and at most one axis flourish: the H1's key word opens on load.

- **`/classes`** — H1 "Small-group English classes in Phú Nhuận". H2s: "Young Learners, ages 5–10", "Teens, ages 11–17", "When and where", "The first week", "How to start". Facts only from §0.1.
- **`/approach`** — H1 "Why-first teaching". H2s: "Explain the reason before the rule", "Keep the load light", "Let wrong answers in", "Practise by recalling, not re-reading", "One task, many ways in", "Sources". Each section opens with a two-sentence answer, then one paragraph, then the citation.
- **`/about`** — H1 "About Bek". Exactly three things and nothing more: the Beat 9 paragraph, the three beliefs, and the classroom address. Maximum 120 words. No biography, timeline, origin, languages or hobbies. It exists so search engines have one page that states who the teacher is; it is linked from the footer only.
- **`/faq`** — H1 "Questions parents ask". Eight Q&As (§9.4).
- **`/privacy`, `/terms`** — existing content, updated to remove pricing, GA4 and email delivery, and to describe Telegram delivery and Plausible.

---

## 5. Motion system

- **Easing.** `release`: cubic-bezier(0.16, 1, 0.3, 1) for anything opening. `settle`: cubic-bezier(0.65, 0, 0.35, 1) for crossfades and background changes. `pop`: cubic-bezier(0.34, 1.56, 0.64, 1) for chips only.
- **Durations (ms).** 120 (hover, focus), 240 (small fades), 400 (triggered entrances), 700 (axis morphs), 1100 (load sequence total cap). No other values.
- **Stagger.** 40ms per item, maximum 12 items; longer lists animate as one block.
- **Scrubbed vs triggered.** Scrubbed (tied to `--p`): Beats 2, 4, 7, 8, the rail, the paper-to-evening change. Triggered once on entry: everything else. Nothing replays on scrolling back up except scrubbed scenes.
- **Scroll.** Native scrolling only. No smooth-scroll library, no wheel interception, no scroll snapping. On pointer devices the engine eases `--p` toward its target by 12% of the remaining distance per frame; on touch devices `--p` is set directly.
- **Engine.** One `requestAnimationFrame` loop, running only while a pinned beat is on screen (gated by IntersectionObserver). It reads scroll position once per frame and writes one custom property per active section. Illustration of the only write it performs:

```
p = clamp((scrollY - section.top) / (section.height - viewportHeight), 0, 1)
section.style.setProperty('--p', p)
```

- **Axis animation rule.** Any element whose `wdth` or `wght` animates sits in a box of fixed height with `contain: layout paint`. Never more than 60 glyphs animate axes at once.
- **Cursor.** The native cursor, always. No custom cursor, no magnetic effects: most visitors are on touch, and a custom cursor costs interaction latency for nothing.
- **Hover and focus.** Links: underline grows from the left in 240ms. Chips: wdth 100→112 in 120ms. Focus ring: 2px `why-deep`, 2px offset, on every interactive element.
- **Page load (home).** The H1 is in the HTML and visible from first paint (it is the LCP element; it is never hidden). When the font is ready, or at 600ms, whichever is first: eyebrow fades in (240ms); at +200ms "why" opens (700ms, `release`); at +900ms the scroll cue fades in.
- **Page transitions.** Ordinary navigation. The incoming page's `main` fades from opacity 0 and 8px lower to rest in 400ms (`release`). No outgoing animation, no overlay, no library.

---

## 6. Technical architecture

**Stack.** Next.js 15 App Router (Bek's decision), TypeScript strict, React Server Components for all content, static generation for every page, `next-intl` for `en` and `vi`. Styling is plain CSS: one tokens file plus CSS Modules per section. Hosting stays where it is today (**VERIFY**: the repo includes `@vercel/speed-insights`, which suggests Vercel; the executor confirms with Bek at Checkpoint A).

**Client JavaScript, complete list.** (1) the scroll engine and tier detection, (2) the interactions for Beats 4, 5, 6, (3) form enhancement, (4) analytics calls, (5) the lazy error monitor. Each is a small client component loaded where used. Beats below the fold load their script when within 1.5 viewports.

**Remove from `package.json`:** `gsap`, `@gsap/react`, `lenis`, `framer-motion`, `split-type`, `leaflet`, `react-leaflet`, `@types/leaflet`, `zustand`, `next-themes`, `lucide-react`, `react-hook-form`, `@hookform/resolvers`, `resend`, `@radix-ui/react-slot`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tailwindcss`, `tailwindcss-animate`, `autoprefixer`, `shadcn`, and Google Analytics. Keep `zod` (server-side validation) and `next-intl`.

**Must not be used:** WebGL, three.js, canvas, Lottie, Rive, video, audio, icon fonts, any animation library, any smooth-scroll library, any UI kit, any CSS framework, Google Fonts' hosted CSS, any third-party script other than Plausible and (only on form focus, only if the existing lead guard requires it) Cloudflare Turnstile.

**File structure (new or changed).**

```
app/[locale]/page.tsx            home: ten beat components in order
app/[locale]/{classes,approach,about,faq,privacy,terms}/page.tsx
app/[locale]/opengraph-image.tsx share card (per locale)
app/sitemap.ts  app/robots.ts
components/story/Beat01Hook … Beat10Room, Rail, FieldNote
components/site/Header, Footer, LeadForm
lib/story/engine.ts  lib/story/tier.ts
lib/analytics.ts  lib/monitor.ts  lib/seo.ts  lib/schema.ts
styles/tokens.css  styles/base.css
messages/en.json  messages/vi.json
public/fonts/archivo-vf.woff2  public/llms.txt
```

**Existing code.** `lib/leads/*`, `lib/telegram/*`, `app/api/contact`, `app/api/telegram` are reused unchanged. `app/api/pricing-lead` is left in place but nothing links to or calls it. `design/v3/` and `media/` are not touched. `public/sw.js`: the executor reads it and reports what it does at Checkpoint A before changing anything. `public/ai.txt` is not a recognised standard; the executor shows Bek its contents and deletes it only on approval.

**Asset loading.** One font file, preloaded. Critical CSS inlined by Next. Portrait and classroom photo lazy-loaded with explicit dimensions. No other assets exist.

---

## 7. Performance budget (hard numbers)

Measured on the production build, home page, Lighthouse mobile preset (simulated slow 4G, 4× CPU slowdown), median of five runs.

| Metric | Budget |
|---|---|
| Initial JS (compressed transfer, including Next.js and React) | ≤ 125 KB |
| Own client code inside that | ≤ 14 KB |
| Analytics script | ≤ 3 KB |
| Lazy JS after idle (error monitor, web-vitals) | ≤ 35 KB, never before `load` + idle |
| CSS total | ≤ 20 KB |
| Font | ≤ 110 KB, one file |
| HTML (home) | ≤ 45 KB |
| Total transfer to first render | ≤ 320 KB |
| Total transfer, full scroll to footer | ≤ 600 KB |
| LCP | ≤ 2.0 s |
| CLS | ≤ 0.02 |
| INP (field, 75th percentile) | ≤ 150 ms |
| Total Blocking Time (lab) | ≤ 150 ms |
| Lighthouse Performance / Accessibility / Best Practices / SEO | ≥ 95 / 100 / 100 / 100 |
| Frame rate in pinned beats, mid-range Android (test device: any phone at 4× CPU throttle in Chrome DevTools) | ≥ 55 fps average, no frame over 50 ms |

Honest note: Next.js and React alone are roughly 100 KB of that JS (**VERIFY** by measuring the empty shell at Checkpoint A). That floor is the price of keeping the stack. If the empty shell exceeds 110 KB, the executor stops and reports.

**Tiers.** *Full*: everything above. *Lite*: chosen when `prefers-reduced-data` or Save-Data is on, or `deviceMemory` ≤ 4, or `hardwareConcurrency` ≤ 4, or when the average frame time over the first 60 frames of the first pinned beat exceeds 22 ms. In Lite, axis values do not scrub; they switch between Frozen and Open with a 400ms transition at `--p` 0.5, the wall uses 40 rows, and the "dog" field uses 6 words.

**Lazy-loading rules.** Beat scripts: within 1.5 viewports. Photos: native lazy loading. Error monitor and web-vitals: after `load` and an idle callback (2s timeout). Turnstile: on first focus inside the form.

---

## 8. Accessibility and resilience

- **No-JS is the base state.** The server HTML and default CSS render every beat as a normal, readable, unpinned section in its resolved (Open) state, with all copy visible, all three versions of Beat 6 listed, all Beat 5 responses listed as a short definition list, and the form working as a standard POST. A small inline script adds a `js` class to `<html>`; only under that class do sections become tall, stages sticky, and initial states Frozen. This is also why there is no cloaking: crawlers and visitors receive the same text in the same order.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the page behaves as in no-JS (unpinned, resolved), interactions still work, and state changes are instant or a 120ms fade. The rail still tracks progress.
- **Semantics.** One `<h1>` per page; beats are `<section>` elements labelled by their H2; heading order never skips; field notes are `<aside>`; the rail is `aria-hidden` and a visually hidden line at the start of each beat states the age ("Age 8"). Decorative repeats are `aria-hidden` and not focusable, except the pickable "dog" buttons.
- **Keyboard.** Everything reachable in DOM order. The "why?" chip, dog buttons, answer chips and three-way switch operate with Enter/Space; the switch also with arrow keys. Pinned beats never trap focus; focusing an element inside a pinned beat scrolls it to its resolved position.
- **Screen readers.** Beat 5 responses and form status use `aria-live="polite"`. The language switch has `lang` attributes on each option. Vietnamese pages set `lang="vi"`.
- **Contrast.** Body and notes ≥ 4.5:1; large display text ≥ 3:1; `why` (#E8452C) is never used for text below 24px on `paper`.
- **Touch.** Targets ≥ 44×44px with ≥ 8px between them. No hover-only content. No horizontal scrolling at 360px. Uses `svh` units so mobile browser bars do not cause jumps.
- **Zoom.** Readable and unbroken at 200% zoom and with 320px viewport width.

---

## 9. Discovery, analytics and monitoring

### 9.1 Architecture decision

**One immersive home page per language, plus five plain supporting pages.** The home page carries the story and the brand queries. The supporting pages each answer one search intent in direct, quotable prose, because a single scroll story cannot rank for "classes", "method", "about" and "FAQ" intents at once and AI systems cite pages that answer a question plainly.

| URL (both `/en/…` and `/vi/…`) | Targets | H1 |
|---|---|---|
| `/` | Brand; "English teacher Phú Nhuận / Ho Chi Minh City" | English makes sense when someone tells you why. |
| `/classes` | Class and age-group queries, local intent | Small-group English classes in Phú Nhuận |
| `/approach` | "Why"-based teaching, method, research | Why-first teaching |
| `/about` | Entity queries: "who is Teacher Bek" | About Bek |
| `/faq` | Long-tail parent questions | Questions parents ask |
| `/privacy`, `/terms` | — (indexable, low priority) | — |

- **Root.** `/` redirects to `/vi` when the browser's first language is Vietnamese, otherwise to `/en`. `x-default` points to `/en`.
- **Canonicals.** Every page is self-canonical, absolute, no trailing slash, non-www.
- **Hreflang.** Every page lists `en`, `vi` and `x-default` alternates, reciprocally, in the HTML head and in the sitemap.
- **Redirects (permanent).** `/zh/*` and `/ru/*` → the matching `/en/*` path; `/{locale}/services` → `/{locale}/classes`; existing blog and community redirects stay.
- **Sitemap.** All 14 URLs with hreflang alternates and real `lastmod` dates. No priority or changefreq.
- **Robots.** Allow everything except `/api/`. Explicit `Allow: /` groups for: `Googlebot`, `Bingbot`, `OAI-SearchBot`, `ChatGPT-User`, `GPTBot`, `PerplexityBot`, `Perplexity-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Amazonbot`. Reason: these fetch pages for AI search answers or training; the site has nothing private and wants to be quoted. `Google-Extended` governs Gemini use only; Google Search and AI Overviews use `Googlebot`. **VERIFY** the current user-agent names against each vendor's documentation at launch.
- **Internal links.** Header and footer link to all supporting pages. Beat 10 → `/classes`; each field note's author name → the matching section of `/approach`. Every supporting page ends with one link back to the story and one to `/classes`.

**Titles and descriptions.**

| Page | English title / description | Vietnamese title / description |
|---|---|---|
| Home | Bek — English Teacher in Phú Nhuận, Ho Chi Minh City / "Bek is an English teacher for children and teens in Phú Nhuận, Ho Chi Minh City. Small groups, and the reason behind every rule before anything is memorised." | Thầy Bek — Giáo viên tiếng Anh tại Phú Nhuận, TP.HCM / "Thầy Bek dạy tiếng Anh cho học sinh 5–17 tuổi tại Phú Nhuận, TP.HCM. Lớp nhóm nhỏ tối đa 10 bạn, luôn giải thích “vì sao” trước khi học thuộc." |
| Classes | Small-Group English Classes, Ages 5–17, Phú Nhuận \| Bek / "English classes for ages 5–10 and 11–17 in Phú Nhuận, Ho Chi Minh City. Maximum 10 students, twice a week, first week free." | Lớp tiếng Anh nhóm nhỏ cho trẻ 5–17 tuổi tại Phú Nhuận \| Thầy Bek / "Lớp tiếng Anh cho trẻ 5–10 và 11–17 tuổi tại Phú Nhuận, TP.HCM. Tối đa 10 học sinh, 2 buổi mỗi tuần, học thử tuần đầu miễn phí." |
| Approach | Why-First English Teaching: Method and Research \| Bek / "How Bek teaches English: the reason before the rule, light cognitive load, safe mistakes, and recall through play. With sources." | Dạy tiếng Anh bằng câu hỏi “vì sao” \| Thầy Bek / "Cách thầy Bek dạy tiếng Anh: hiểu lý do trước khi học quy tắc, học nhẹ nhàng, được phép sai và ôn bằng trò chơi. Có dẫn nguồn nghiên cứu." |
| About | About Bek — English Teacher in Ho Chi Minh City / "Bek is an English teacher in Ho Chi Minh City: four years, about 2,500 students, TESOL and PGCE qualified." | Về thầy Bek — Giáo viên tiếng Anh tại TP.HCM / "Thầy Bek là giáo viên tiếng Anh tại TP.HCM: bốn năm giảng dạy, khoảng 2.500 học sinh, có chứng chỉ TESOL và PGCE." |
| FAQ | English Classes in Phú Nhuận: Questions Parents Ask \| Bek / "Ages, class size, schedule, location and the free first week: plain answers about Bek's English classes." | Câu hỏi thường gặp về lớp tiếng Anh của thầy Bek / "Độ tuổi, sĩ số, lịch học, địa điểm và tuần học thử miễn phí: câu trả lời ngắn gọn về lớp tiếng Anh của thầy Bek." |

All Vietnamese text above is a draft for Bek's native-reader review.

### 9.2 Target queries (priority order)

| # | Intent (examples) | Page |
|---|---|---|
| 1 | giáo viên tiếng Anh Phú Nhuận; lớp tiếng Anh Phú Nhuận | `/vi`, `/vi/classes` |
| 2 | lớp tiếng Anh cho trẻ em Phú Nhuận / TP.HCM; tiếng Anh thiếu nhi | `/vi/classes` |
| 3 | lớp tiếng Anh nhóm nhỏ TP.HCM; lớp tiếng Anh cho học sinh cấp 2 | `/vi/classes` |
| 4 | English teacher Phu Nhuan; English teacher Ho Chi Minh City | `/en` |
| 5 | English classes for kids / teens Ho Chi Minh City | `/en/classes` |
| 6 | Teacher Bek; thầy Bek tiếng Anh | home, `/about` |
| 7 | giáo viên tiếng Anh TP.HCM; English teacher Ho Chi Minh City | home, `/classes` |
| 7b | lớp tiếng Anh gần Gò Vấp / Bình Thạnh (families travelling to the Phú Nhuận classroom) | `/vi/classes`, `/vi/faq` |
| 8 | con sợ nói tiếng Anh; con học tiếng Anh không hứng thú; child afraid to speak English | `/approach`, `/faq` |
| 9 | why-based / understanding-first / personalised English lessons | `/approach` |
| 10 | học thử tiếng Anh miễn phí Phú Nhuận | `/vi/classes` |

Honest note: queries 1–5 are contested by large language centres with far more links and reviews. The realistic first wins are 6–10 and the Google Maps results for 1–2 through the Business Profile.

### 9.3 Structured data (JSON-LD, server-rendered, one graph per page)

- **Person** (all pages; `@id` `https://teacherbek.com/#bek`): name "Bek"; alternateName ["Teacher Bek", "Thầy Bek"]; jobTitle "English teacher"; no `knowsLanguage`, no `nationality`, no `birthPlace`; description (§9.5, exact); image (portrait URL); url; telephone; knowsAbout ["English language teaching", "Teaching English to young learners"]; hasCredential (two entries: "TESOL", "PGCE", each an EducationalOccupationalCredential with name only); worksFor (Organization, name "ila Vietnam", no logo, no URL claims beyond the name); address (locality "Ho Chi Minh City", region "Phú Nhuận", country "VN"); sameAs (only profile URLs Bek confirms).
- **Local business** (home, `/classes`; type `["LocalBusiness","EducationalOrganization"]`, **VERIFY** it passes the Schema Markup Validator; `@id` `…/#classroom`): name "Teacher Bek"; description; url; telephone; address (streetAddress "Golden Mansion 1, 119 Phổ Quang", locality, region, country); geo (latitude/longitude — ask Bek, do not guess); openingHoursSpecification (Mon–Fri 19:30–21:00; Sat–Sun 14:00–20:00); areaServed ["Phú Nhuận", "Gò Vấp", "Bình Thạnh"]; founder → the Person; image (classroom photo). No `priceRange`, no `aggregateRating`, no `review`.
- **Course** ×2 (`/classes`): name; description; provider → the business; educationalLevel; typicalAgeRange ("5-10", "11-17"); inLanguage "en"; hasCourseInstance (courseMode "onsite", courseWorkload "PT3H per week", location → the business); offers (one Offer, category "Free trial week", no price).
- **FAQPage** (`/faq` only): the eight Q&As, identical to the visible text. Honest note: since August 2023 Google shows FAQ rich results only for government and health sites; the markup is kept because it is accurate and machine-readable, not for a rich result.
- **Article** (`/approach`): headline; author → the Person; datePublished; dateModified; citation (the seven sources as CreativeWork entries with name, author, datePublished).
- **WebSite** (home): name "Teacher Bek"; url; inLanguage ["en","vi"]; publisher → the Person.
- **BreadcrumbList** (every supporting page).

### 9.4 AI-search readiness

- **Answer-first writing.** On supporting pages every H2 is followed immediately by a one-or-two-sentence answer that makes sense with no surrounding context and names its subject ("Bek's classes have at most ten students", never "They have…"). Details follow. Numbers are written as digits. Dates are absolute.
- **FAQ (final English text).**
  1. *Where are the classes held?* Bek's classroom is at Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, Ho Chi Minh City. Families come from Phú Nhuận, Gò Vấp and Bình Thạnh.
  2. *What ages does Bek teach privately?* Students aged 5 to 17, in two groups: Young Learners (5–10) and Teens (11–17).
  3. *How big are the classes?* Every class is a small group of at most 10 students, so each student speaks in every session.
  4. *When are classes?* Twice a week for 90 minutes plus a 15-minute break. Weekday classes run 19:30–21:00; weekend classes run between 14:00 and 20:00.
  5. *Can my child try a class first?* Yes. The first week is free.
  6. *Is there a contract?* No. After the free week, classes run month to month.
  7. *What are Bek's qualifications?* Bek holds TESOL and PGCE qualifications, has taught for four years, and has taught about 2,500 students at ila, in public schools and privately.
  8. *What does "why-first" teaching mean?* Bek explains what a piece of language is for before asking students to remember it, then has them use it in games and conversation.
- **llms.txt.** Keep `public/llms.txt`, rewritten: the entity description, the fact sheet, and the 14 URLs with one-line summaries. Honest note: it is a 2024 community proposal; no major AI provider has confirmed that it affects retrieval or ranking, and Google has said it does not use it (**VERIFY**). It costs nothing and helps agents that do fetch it. Do not expect a measurable effect.
- **What is and is not in Bek's control.** In control: crawlable text, consistent entity facts, schema, speed, profiles, honest reviews. Not in control: whether any AI assistant recommends Bek. Assistants draw heavily on Google and Bing indexes, Maps listings and third-party mentions, so §9.6 matters as much as the site.

### 9.5 Entity consistency

Use these strings verbatim everywhere (site, schema, `llms.txt`, Google Business Profile, Bing Places, social bios):

- **Name:** Teacher Bek (Vietnamese profiles: Thầy Bek)
- **Short description (EN):** "Teacher Bek is an English teacher in Phú Nhuận, Ho Chi Minh City, who teaches small-group classes for ages 5–17 and explains the why behind the language before anything is memorised."
- **Short description (VI, draft):** "Thầy Bek là giáo viên tiếng Anh tại Phú Nhuận, TP.HCM, dạy lớp nhóm nhỏ cho học sinh 5–17 tuổi và luôn giải thích “vì sao” trước khi học thuộc."
- **Address:** Golden Mansion 1, 119 Phổ Quang, Phú Nhuận, Ho Chi Minh City
- **Phone:** +84 353 88 5757

**VERIFY (address format):** Ho Chi Minh City reorganised its districts into wards in mid-2025. Parents still search "Phú Nhuận", so the copy keeps it, but Bek should confirm the current official ward name for 119 Phổ Quang and use the format Google Maps shows for the listing.

### 9.6 Off-site signals (Bek does these; the executor only prepares the texts)

1. **Google Business Profile.** Name "Teacher Bek" (no keywords added). Primary category "English language school"; no secondary category (**VERIFY** the exact category name in the dashboard). Address, hours and phone as §9.5. Description: the short description plus class facts. Photos: the classroom photo and portrait only. Website: `https://teacherbek.com/vi`.
2. **Google Search Console.** Verify the domain property by DNS, submit the sitemap, check the hreflang and indexing reports after launch and after the ZH/RU redirects.
3. **Bing Webmaster Tools.** Import from Search Console, submit the sitemap, create a Bing Places listing with identical details. Bing's index feeds Microsoft Copilot and is one of the sources behind ChatGPT search.
4. **Profiles.** One Facebook page and one Zalo Official Account or personal Zalo, each with the exact name, description, address and link. Add only live profiles to `sameAs`.
5. **Reviews.** Ask parents of private-class students, in person, after a term, with a printed QR code to the Google review form. No incentives, no scripts, no review-gating. Ask them not to include the child's full name or photos. Reply to every review without naming the child.
6. **Mentions.** Legitimate sources only: local parent Facebook groups where self-introduction is allowed, a listing on any directory of English teachers in Ho Chi Minh City that Bek already qualifies for, guest answers on parenting forums under Bek's real name.
7. **ila boundaries.** Do not use ila's name in the Business Profile, titles, descriptions or ads. No ila logo, classroom photos, materials or student work. Do not ask ila students' parents for reviews or enrolments. Bek should check the employment contract for outside-work and name-use clauses before launch.
8. **Minors.** No student names, faces, voices, schoolwork or identifiable stories anywhere, including review replies and social posts.

### 9.7 Language

Bilingual, English and Vietnamese, as separate URLs with full hreflang. Vietnamese is the search language of the parents; English is the subject being taught and the language of design juries. Slugs stay in English for both locales (simpler, and the slug has little ranking weight).

### 9.8 Social sharing

- One share card per locale, generated at build time from code with Next's image-response route: 1200×630, `paper` background, the line "English makes sense when someone tells you **why**." in Archivo (Frozen, with "why" Open in `why`), and "Teacher Bek · Phú Nhuận, Ho Chi Minh City" in Label style bottom-left. No photo.
- Tags on every page: `og:title`, `og:description`, `og:url`, `og:type`, `og:image` with width, height and alt, `og:locale` and `og:locale:alternate`, `twitter:card` = `summary_large_image`.
- Checkpoint for Bek: `public/og-image.jpg` is currently the default share image (`lib/seo.ts`). The portrait file keeps its name and is used only in Beat 9 and `/about`; share images move to the generated route.

### 9.9 Analytics

**Plausible Analytics (hosted, EU).** Why not GA4: GA4 sets cookies and collects identifiers, which would require a consent banner for an audience that includes parents of minors; its script is many times larger; and its reports are more than a one-person site needs. Plausible is cookieless, stores no personal data and no persistent identifier, and its script is about 1–3 KB (**VERIFY** size and current price on plausible.io).

- **Consent approach.** No cookies and no personal data in analytics, so no cookie banner. The privacy page says so in one paragraph. The lead form is the only place personal data is collected: it has an unticked consent checkbox, collects the parent's name and phone and the child's age only, and the privacy page states purpose, storage (Telegram message to Bek), retention (deleted on request or after 12 months) and contact for deletion.
- **Vietnam rules.** Decree 13/2023/NĐ-CP on personal data protection has applied since 1 July 2023, and a Personal Data Protection Law was passed in 2025 with effect from 1 January 2026 (**VERIFY** both, and the rules on children's data, with a local adviser). This guide is not legal advice. The design choice that keeps risk low is collecting no data about a child beyond an age.
- **Event plan** (names exact; props in brackets):

| Event | Fires when |
|---|---|
| `Beat Reached` [beat: 1–10, locale] | A beat's top crosses 50% of the viewport, once per page view |
| `Story Complete` [locale, seconds] | Beat 10 reached |
| `Why Pressed` [beat] | The "why?" chip is pressed (not when resolved by scroll) |
| `Dog Picked` | First pick in Beat 4 |
| `Answer Chosen` [option] | Each chip choice in Beat 5 |
| `Way Switched` [option] | Manual switch in Beat 6 |
| `Language Switched` [to] | Language switch used |
| `Zalo Click` [placement] | Any Zalo link |
| `Phone Click` [placement] | Any `tel:` link |
| `Classes Link` [from] | Any link to `/classes` |
| `Form Started` | First focus in the form |
| `Form Sent` | Server confirms delivery |
| `Form Failed` [reason] | Any failure |
| `Outbound Link` | Automatic (Plausible outbound-links option) |
| `Web Vital` [metric: LCP/CLS/INP, rating: good/needs-improvement/poor, tier: full/lite] | Once per metric per page view, via the `web-vitals` library, loaded after idle |

No event carries a name, phone number, message text or child's age.

### 9.10 Error monitoring

**Sentry**, errors only, under these rules:

- **Weight.** The browser SDK counts against the lazy-JS budget (≤ 35 KB with web-vitals; **VERIFY** by measuring). It is never in the initial bundle. A tiny inline listener queues `error` and `unhandledrejection` events from first paint; after `load` plus idle, the SDK is dynamically imported, initialised, and the queue is replayed. If the SDK appears in any initial chunk in the bundle report, the executor stops and reports.
- **Client configuration.** Errors only: tracing off (`tracesSampleRate` 0), Session Replay not installed, feedback widget not installed, error sample rate 1.0 (traffic is low). `sendDefaultPii` false.
- **Scrubbing.** Before sending: drop request bodies, cookies, query strings, and all form field values; remove input-related breadcrumbs; mask anything matching a phone-number pattern; do not send IP addresses (also disable IP storage in the Sentry project settings).
- **Ignored noise.** Browser-extension errors, `ResizeObserver loop` messages, errors from in-app browsers' injected scripts (Zalo, Facebook), network errors from the analytics host.
- **Server.** The Sentry Next.js SDK for route handlers only (`/api/contact`, `/api/telegram`), with the same scrubbing; lead payloads are never attached.
- **Releases and source maps.** Release = git commit SHA. Source maps uploaded at build and not served publicly. Environments: `production`, `preview`.
- **Alerts (email to Bek).** (1) Any error in `/api/contact` or Telegram delivery: immediately, every time — a lost lead is the only costly failure. (2) Any new issue in production: once. (3) Any issue above 10 events in an hour.

### 9.11 Weekly dashboard (8 metrics)

| Metric | Action it triggers |
|---|---|
| 1. Visitors by locale | If Vietnamese is under half, put effort into the Business Profile and Vietnamese mentions |
| 2. Story completion (Story Complete ÷ visitors to home) | Below 25%: find the beat with the biggest drop (metric 3) and shorten it |
| 3. Largest beat-to-beat drop | Cut that beat's pinned height by 25% or simplify it |
| 4. Contacts (Zalo Click + Phone Click + Form Sent) | The one outcome number; compare with messages actually received |
| 5. Form Failed count | Anything above 0: check Sentry and the Telegram bot the same day |
| 6. Share of "good" LCP and INP on mobile | Below 90%: move more visitors to the lite tier or cut the heaviest beat |
| 7. Search Console: impressions and clicks for the query groups in §9.2 | No impressions for a group after 8 weeks: strengthen that page's answer text |
| 8. New Sentry issues | Fix, or add to the ignore list with a written reason |

---

## 10. Executor instructions

**Do not deviate.** Build what this guide specifies, with the copy, values and names given. Do not add sections, effects, dependencies, copy, facts, colours or fonts. Do not "improve" wording. If anything is ambiguous, missing, contradictory, or fails a checkpoint, stop and ask Bek; never choose on your own. Do not commit, push or deploy unless Bek asks. Work on a new branch `v4-ask-me-why` created from `main`; leave `design-v3` and its uncommitted changes untouched.

1. **Inventory.** Read `CLAUDE.md` (note: its design section is superseded by this guide), `lib/leads`, `lib/telegram`, `lib/seo.ts`, `i18n/`, `middleware.ts`, `next.config.ts`, `public/sw.js`, `public/ai.txt`. Report anything that conflicts with this guide.
2. **Strip.** Search the whole repo for every "must not appear" item in §0.1 and delete each occurrence, then list what was deleted. Remove ZH and RU locales and messages, add their redirects, remove the dependencies listed in §6 and all components that used them. Build an empty shell with header, footer and the font.
   **Checkpoint A (stop, report to Bek):** empty-shell JS size; font file size and the Vietnamese test string rendered in Frozen and Open states at 390px and 1440px; hosting confirmed; what `sw.js` does; contents of `ai.txt`.
3. **Tokens and type.** Implement §3 exactly. Build one internal test page showing every type style in both states, EN and VI.
   **Checkpoint B:** screenshots of the test page; measured contrast ratios for every pair.
4. **Static story.** Build all ten beats and the footer as server-rendered, unpinned, resolved HTML with final English copy. No client JS yet. This is the no-JS version and must already look finished.
   **Checkpoint C:** screenshots at 360, 390, 768, 1440; Lighthouse; JS disabled.
5. **Engine and rail.** Add the `js` class, the scroll engine, tier detection and the rail. Pin Beats 2, 4, 7, 8.
6. **Beat motion,** in this order: 1, 2, 4, 7, 8, then 3, 5, 6, 9–10. After each, check frame rate under 4× CPU throttle.
   **Checkpoint D (after Beat 7):** screen recording of Beats 1–7 on desktop and throttled mobile; frame-time numbers.
7. **Lead form.** Wire to the existing route and Telegram delivery. Send one test lead and confirm with Bek that it arrived.
8. **Supporting pages,** metadata, schema, sitemap, robots, `llms.txt`, share cards.
   **Checkpoint E:** validator output for every schema block; list of all titles and descriptions with character counts.
9. **Vietnamese.** Translate all copy following §3.4. Check every headline for clipping and line breaks at 360px. Do not reuse English line breaks.
   **Checkpoint F (blocking):** Bek, or a native reader Bek chooses, approves the Vietnamese copy.
10. **Analytics and monitoring.** Add Plausible, the event plan, web-vitals, Sentry with the lazy loader. Trigger a test error and each event once.
11. **Full acceptance run** (§11). Report every item as pass or fail with evidence, list every open VERIFY, and stop.

---

## 11. Acceptance checklist (pass/fail)

**Performance**
- [ ] Every number in the §7 table met; Lighthouse reports attached (home EN, home VI, `/classes`).
- [ ] Bundle report shows no Sentry, web-vitals or below-fold beat code in initial chunks.
- [ ] Exactly one font request; no requests to third-party hosts before interaction except Plausible.
- [ ] Pinned beats hold ≥ 55 fps average under 4× CPU throttle; lite tier activates when forced.

**Behaviour**
- [ ] With JS disabled: all copy of all ten beats visible in order, form submits, no blank areas.
- [ ] With reduced motion: no pinning, no scrubbing, all interactions work.
- [ ] Keyboard only: every interactive element reachable and operable; focus always visible; no trap.
- [ ] No horizontal scroll at 320, 360, 390, 768, 1024, 1440, 1920.
- [ ] Scrolling is never intercepted; browser back and forward restore position.
- [ ] `/zh` and `/ru` URLs return permanent redirects to `/en` paths.
- [ ] A test lead arrives in Telegram; a forced failure shows the failure text and fires `Form Failed`.

**Visual, per beat**
- [ ] 1: H1 visible at first paint; only "why" is Open and coloured; H1 shifts < 2px on font swap.
- [ ] 2: decorative rows absent from page source; counter ends at 212; "…" outlasts the wall.
- [ ] 3: observation sentence and its disclaimer are in the same paragraph; answers lighten on the release line.
- [ ] 4: chip and scroll both resolve the rule; picking a dog changes "a" to "the"; the buttons have accessible names.
- [ ] 5: no red, no shake; each chip gives its exact response; responses are announced.
- [ ] 6: three versions, three axis settings, auto-advance runs once only.
- [ ] 7: "distance" spans the full content width at `--p` 0.85 at every tested width, in both languages.
- [ ] 8: answer reveals with scroll; three highlights present; rail label reads 17.
- [ ] 9: portrait ≤ 266px wide, unfiltered, nothing overlapping it.
- [ ] 10: background reaches `evening`; photo unfiltered; no prices; child's name not requested.
- [ ] Only two image files are requested across the entire site (plus generated share cards).
- [ ] No text overlaps, clipped diacritics, or orphaned single words in headlines, EN and VI.

**Content**
- [ ] Every fact on the site appears in §0.1; none of the "must not appear" items exist anywhere, including metadata and `llms.txt`.
- [ ] Every research note matches §2.1 wording, has author and year, and links to `/approach`.
- [ ] Every composite is labelled as a composite.

**SEO and structured data**
- [ ] One H1 per page; heading order valid.
- [ ] Canonical, hreflang (en, vi, x-default) and Open Graph tags present and correct on all 14 URLs.
- [ ] Sitemap lists 14 URLs with alternates; robots matches §9.1.
- [ ] Schema Markup Validator: zero errors on every page; Rich Results Test: zero errors.
- [ ] The text returned to a plain HTTP fetch of each page contains its full copy.
- [ ] Share cards render correctly in a link-preview debugger for EN and VI.

**Analytics and monitoring**
- [ ] Each event in §9.9 observed once in Plausible with the right props; no personal data in any event.
- [ ] A test error thrown in production mode appears in Sentry with the release SHA, readable stack trace, and no form values, phone numbers or IP.
- [ ] The `/api/contact` failure alert delivers an email.

---

## 12. Honest risk notes

| Risk | Why it is real | Fallback (decided now) |
|---|---|---|
| Animating font width causes reflow and dropped frames on phones | Variable-axis changes are not GPU-composited | The lite tier (two states with a transition) becomes the default for all touch devices if Checkpoint D shows under 55 fps |
| Archivo lacks an axis range or a Vietnamese glyph | Font details are stated from memory | Stop at Checkpoint A; Bek chooses between a narrower range or another OFL variable family with width and weight axes and Vietnamese coverage |
| Next.js's JS floor eats the budget | Framework plus React is about 100 KB before any feature | The budget already assumes it; if the shell exceeds 110 KB, stop and report rather than cut features silently |
| A purely typographic site may fall short of Site of the Year | Recent winners are mostly large studio productions with film, 3D or sound; this site has one font and two photos | Aim for Site of the Day first (§13). The craft is in the axis motion, the "distance" moment and the speed. Do not add spectacle to compensate; if Bek later allows more of his own footage, revise the guide rather than improvise |
| Pinned beats feel long on mobile | 280–340vh of pinned scroll each | If analytics shows the largest drop inside a pinned beat, cut its height by 25%; Beat 2 first |
| The story page ranks poorly for class queries | Narrative copy is thin on keywords | That is the job of `/classes`, `/approach` and `/faq`; never stuff the story |
| Local rankings and AI recommendations may not come | Large centres dominate; AI answers cannot be controlled | Expect brand and long-tail wins first; the Business Profile and honest reviews are the main lever |
| Removing ZH and RU loses existing traffic from those pages | Indexed URLs disappear | Permanent redirects to English; watch Search Console for 8 weeks |
| The portrait is only 533px wide | Limits its display size to 266px | Bek supplies the original file if one exists; otherwise the size limit stays |
| Research wording drifts into overclaiming | Summaries get "improved" in editing | Only the §2.1 wording is allowed; no numbers or effect sizes |
| ila objects to being named | Employment contracts often restrict name use | Replace with "an international English centre" in copy and remove `worksFor` from schema |
| Legal statements are out of date | Vietnam's data rules changed in 2025–2026 | Collect the minimum; have a local adviser check the privacy page before launch |

**Open VERIFY list for Bek:** Archivo axes and Vietnamese coverage · journal volume/issue numbers · Lewis (1986) · hosting provider · JS sizes (Next shell, Sentry, Plausible, web-vitals) · AI crawler user-agent names · `LocalBusiness` + `EducationalOrganization` validation · Google Business Profile category names · current ward name for the address · Vietnam data-protection references · llms.txt usage statements · Plausible pricing · contract terms on naming ila.

---

## 13. Awwwards submission plan

**What can and cannot be promised.** No guide can guarantee an award. Site of the Year is decided by the Awwwards jury from the year's top-scoring winners, and the Storytelling page is a tagged collection of awarded sites, not a ranked league with a "number 1" (**VERIFY** both on awwwards.com). What is in Bek's control is earning the highest possible jury score, and the route there is fixed: Honorable Mention → Site of the Day → Site of the Month → Site of the Year nominee.

**How this guide maps to the score.**

| Criterion | Weight | What earns it here |
|---|---|---|
| Design | 40% | One typeface used as the entire visual language; strict grid; one accent; the paper-to-evening change |
| Usability | 30% | Native scroll, no hijacking, full keyboard and no-JS paths, the §7 numbers, a mobile version that is the same story and not a cut-down one |
| Creativity | 20% | The frozen-to-open mechanism; "pick a dog"; the word "distance" stretching to enact itself; the "…" that returns as a sentence |
| Content | 10% | Real copy, real whys a visitor learns, sourced research, no filler |

**Submission rules for the executor and Bek.**

1. Submit only after every item in §11 passes and Bek has scrolled the full story on a real mid-range Android phone and an iPhone.
2. Submit the English URL, `https://teacherbek.com/en`.
3. Tags: Storytelling, Typography, Scrolling, Animation, Education (**VERIFY** the tag names offered in the submission form).
4. Also enter the Developer Award and Mobile Excellence where the form offers them (**VERIFY** availability and fees); the performance and accessibility work is aimed at both.
5. Credit line: design and concept by Bek; state honestly in the description that the site was built with AI assistance if the form asks about tools.
6. Prepare three captures made by screen-recording the live site (no mock-ups): the hero "why" opening, the a/the "pick a dog" moment, and the "distance" stretch.
7. Do not change the site during the judging window except to fix defects.
