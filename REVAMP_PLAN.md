# teacherbek.com — Creative Direction, Audit & Build Plan

> **v3 · 2026-10-22.** Authoritative structure: `design.md`. Research: 13 award sites studied frame by frame (§1), current-site audit (§2), owner story answers (Step 0, answered 2026-10-22). Decisions are made in this document; the owner only approves or overrides the short list in §0.

> **v3 status (2026-10-22).** The "Red Pen" concept is dead (owner: "truly shitty"). Step 0 is **answered**. Steps 3–8 below are now written against the owner's real story. Phases 0–1 (live-site repairs, lead pipeline, owner kits, first copy deck) remain valid but the copy deck and mistake library were written for Red Pen and must be reworked for the new idea (Phase 1, task P1.2b). The Phase 2a Red Pen design folder is archived and is not a starting point. **Scope change from the owner on 2026-10-22:** adult programmes (IELTS, English for Work) are dropped; Bek does not teach children under 5 in private classes. v1 audience = **children 5–17 and their parents**, two programmes: **Young Learners 5–10** and **Teens 11–17**, one price.

---

## 0. One-page summary

### The big idea — **"Hello! How are you today?"** (3 sentences)
Every one of Bek's lessons starts the same way: a greeting, and every child saying how they are today. The website starts the same way: the first screen says hello in Bek's voice and asks the visitor to finish one sentence, "I am ___.", with a feeling word (happy, tired, hungry, excited, shy, okay); the word drops into the sentence, the page takes on that feeling's colour, and Bek answers like a teacher would. Everything after that is the lesson continuing: a circle where every child talks, a ladder of sentences from age 5 to 17, honest proof, a warm room, a free first week, and a final "See you in class" form that is just the next turn in the conversation.

### The 5 biggest problems with the current site
| # | Problem | Evidence |
|---|---|---|
| 1 | **No idea, no voice in the first 5 seconds.** Mobile hero = giant "ENGLISH", a faint grey cycling word, ~280 px of empty cream, then a stats box. No face, no child, no age, no price cue, no sound of a teacher. It reads as a design-studio portfolio, not a teacher you would trust with a 7-year-old. | `teardown/m-en-00.png` (§2.1) |
| 2 | **It sells the wrong audience.** IELTS and English for Work (adults), four languages, an empty blog and a community hub dilute a teacher whose real students are children 5–17 and whose real promise is "speak better, read and listen better, no magic". | Step 0 S2/S4, Q14 |
| 3 | **The warm part is invisible.** Parents choose Bek for home warmth, more talk time and a fair price (S5). The site shows two photos, no room, no children's voices, a price gate that reads as a paywall, jargon ("acquisition through structured play"). | §2.1 Imagery, Copy, Pricing gate |
| 4 | **Slow and heavy on a real phone.** Slow 4G + 4x CPU: LCP 2.6-3.8 s, ~760 KB, 40-43 font files, ~270 KB JS, three animation libraries. | §2.2 Core Web Vitals |
| 5 | **Trust and compliance gaps.** Price gate reads as a paywall; no consent record per lead; GA4 before consent; privacy/terms English-only and silent about children's data (PDPL); invalid schema (44 items, §2.3). Lead loss was fixed in Phase 0; the rest stands. | §2.2, §2.3 |

### Self-scored (expected jury score /10, before submission; detail in §9)
| Criterion | Weight | Expected | Weighted | What loses points |
|---|---|---|---|---|
| Design | 40% | **7.8** | 3.12 | Photography is owner-shot on a phone: if light/composition are weak, imagery caps the score. Warm/soft style is a risk of looking "kids' app" instead of premium. |
| Usability | 30% | **8.0** | 2.40 | Any jank on mid-range Android; audio/Flip interaction failing on in-app browsers (Zalo, Facebook); form friction. |
| Creativity | 20% | **7.6** | 1.52 | The greeting is simple. If the reply copy or the colour/type response feels generic, jurors read it as "a mood picker". Execution must make it feel inevitable. |
| Content | 10% | **6.8** | 0.68 | Depends on owner supply: recorded voice, real photos, anonymised testimonials, the 5-year-old result told plainly. Placeholders would cost the whole criterion. |
| **Total** | 100% | | **7.72** | Honorable Mention (>= 6.5) is the realistic floor; Site of the Day (reference SOTDs scored 7.5-8.25, §1.6) is possible, not promised. |

### Decisions the owner must make (plain language)
1. **Approve the big idea** ("Hello! How are you today?", §3) or say what to change.
2. **Record your voice once** (about 1 hour, phone, quiet room): "Hello! How are you today?", six feeling words, "See you soon!". The site's signature moment depends on it. If you decline, the site works without sound (§3.8).
3. **Photos and video** of the room and your hands, children only with written parent consent (otherwise hands, backs, shoes by the door). Shot list in §3.5.
4. **Confirm facts I cannot invent:** group size (old copy says max 10), what happens in the free week, class times for 5-6 year olds (old weekday slot 19:30-21:00 is late), reply time promise, whether credentials may be named (TESOL, PGCE, DELTA).
5. **Platform:** move from Next.js on Vercel to Astro on Cloudflare (recommended, $0/month, faster; leads code is reused) or stay (Vercel Pro $20/month). §5.
6. **Look:** v3 is warm and rounded (pills, soft corners), not the old brutalist square look. Confirm you are happy to retire "no rounded corners" from `CLAUDE.md`.
7. **Adults:** confirm IELTS / English for Work are gone from the site (done in this plan per your 2026-10-22 message); existing adult enquiries are answered on Zalo, not on the site.

---

## Step 0 — Questions for the owner (story)

**Status: Answered 2026-10-22.** The big idea in §3 is built only from these answers.

| # | Question | Owner's answer (verbatim) | Meaning used in this plan |
|---|---|---|---|
| S1 | What do you teach? | "English" | One subject, said plainly. No skill menu. |
| S2 | Who are your students? | "anyone from 2 y.o. to teens" | **Updated by owner, same day:** no private classes under 5. v1 = children **5-17** and their parents. Adult programmes dropped. |
| S3 | How does a lesson feel / first 10 minutes? | "greet, share how they are etc." | Every lesson starts with a greeting and each child saying how they are. **This is the big idea.** The "etc." (what follows) is not known: marked `[OWNER]` wherever it matters. |
| S4 | What changes after 3 months? | "speak better, read and listen and understand better — no magic promises" | Three verbs only: speak, read, listen. No guarantees, no band scores, no "fluent in 90 days". |
| S5 | Why you, not a centre? | "parents requested me a lot, cheaper, home warmth and more talk time for students" | The four reasons on the page (§4, F6). Cheaper = said in words on the page; the figure is revealed only in the personal answer after the form; no competitor prices quoted. |
| S6 | Best result? | "a 5 y.o. can read basic words, speaks correct English mostly naturally, loves learning" | The proof story (§4, F5), told as one student's result, not a promise. |
| S7 | Story you always tell? | "skip, I don't tell" | **No personal life story** anywhere (no "Tashkent to HCMC" timeline). Bek is shown by what he does, not where he came from. |
| S8 | Websites you love? | not answered | Taste calibrated from the studied sites (§1); the owner reviews at Phase 2a. |

---

## Operational questions (Q1–Q15)

> Separate from the Step 0 story questions above: these are logistics (prices, schedule, claims, accounts, consent) and still apply.

| # | Question | Blocks | Answer (2026-10-22) |
|---|---|---|---|
| Q1 | Real price per programme? | Pricing sheet, schema | **Same price for every programme: 2,990,000 VND/month regular; first month 1,990,000 VND (1,000,000 off) after a free trial week.** |
| Q2 | Trial offer? | Hero, CTA copy | **1 free week**, then first month 1,990,000 VND, then 2,990,000 VND/month. What happens in the free week: not stated `[OWNER]`. |
| Q3 | Schedule per group (site: weekdays 19:30–21:00, weekends 14:00–20:00; schema: Mon/Wed/Sat/Sun). Max per group still 10? How many seats are free per group right now? | Seat map | Weekday classes all at the same time (current 19:30–21:00). Weekend schedule unchanged (14:00–20:00). Seat counts not given. |
| Q4 | Which claims are provable: "2,000+ students", "15+ schools", "ILA Vietnam", "MBA candidate", TESOL, PGCE, DELTA (credentials list shows 3)? | Proof section, schema | Claims and credentials are provable; documents will not be published. |
| Q5 | Is `RESEND_API_KEY` set in Vercel, `teacherbek.com` verified in Resend, and does `hello@teacherbek.com` receive mail? Any form leads in the last 3 months? | Phase 0 | No mails needed. Resend not required. |
| Q6 | Where should leads reach you first: Zalo, phone call, email? Do you have a Zalo Official Account? Is the business registered in Vietnam (needed for Zalo ZNS messages)? | Lead pipeline | Leads go to Google Sheets and Telegram (no email). |
| Q7 | Testimonials: are the 5 current ones (Linh N., Minh T., Sarah K., Hoa P., David R.) real and consented? Can you get photos/video and full first names? Google Business Profile + reviews? | Proof | Testimonials anonymised (role + context only, no names or initials). |
| Q8 | Photo/video: can we shoot a real class? Parents' written consent for children's faces (PDPL)? Budget for a local photographer (half day)? | Imagery | Owner will make the videos himself, later. Photo and child-consent part not answered. |
| Q9 | Will you write ~10 words/phrases by hand in red pen on paper (we scan and vectorise)? | Signature interactions | OK (handwriting in red pen). |
| Q10 | Which languages bring students? Who reviews ZH and RU copy? OK to launch VI + EN first? | Scope | Launch with VI + EN only; ZH/RU deferred (Cyrillic no longer required). |
| Q11 | Address public & permanent (Golden Mansion 1, 119 Phổ Quang, Phú Nhuận)? Still serving Gò Vấp / Bình Thạnh? | Local SEO | Yes: address public and permanent. |
| Q12 | Budget: one-off build budget and acceptable monthly cost? Paid font OK? | Stack, type | Budget OK. Paid font not explicitly answered. |
| Q13 | Brand name: keep "Teacher Bek"? Want a Vietnamese tagline/name? | Identity | Keep "Teacher Bek"; no Vietnamese brand name. |
| Q14 | Hours/month you can give to content (testimonials, photos, guides)? | Blog decision | 0 hours/month: remove blog, guides and community. |
| Q15 | Do you use WhatsApp? If not, remove it (the `wa.me/84353885757` link returns 429 in Semrush and sits in footer, form and contact email). | Phase 0 link cleanup | Remove WhatsApp. |

**Implications of the answers (2026-10-22, incl. the owner update of the same day)**

- **Audience and programmes:** children **5-17** and their parents. Two programmes: **Young Learners 5-10** and **Teens 11-17**. Bek does not teach under 5 in private classes. **IELTS and English for Work (adult programmes) are dropped** from the site, schema, FAQ, forms and `llms.txt`; adult enquiries are answered on Zalo.
- **One price:** 2,990,000 VND/month for every child and both programmes; **first month 1,990,000 VND** (1,000,000 off) after the **free trial week**. **The price is gated (owner brief, `design.md` Step 4):** visitors learn what, how and who without seeing any price; the figures are revealed only in the personalised answer after the "See you in class" form. The **free week stays public** as the hook (it is not a price). The figures appear in no public HTML, no JSON-LD, no `llms.txt`, no OG image and no sitemap.
- **Schedule copy:** weekday classes all at one time (current 19:30-21:00; `[OWNER]` confirm for ages 5-6); weekends unchanged (14:00-20:00). No seat counts, so no seat map.
- **Credentials:** text only, provable claims only (TESOL, PGCE, DELTA); no documents published.
- **No email channel:** leads go to Google Sheets and Telegram only. Resend removed.
- **Testimonials:** anonymised to role + context (no names or initials). Reviews on the Google Business Profile follow Google's policy: do not present site testimonials as Google reviews, no incentives.
- **Videos:** the owner shoots them himself, later, on a phone (spec in §3.5). Launch does not depend on them.
- **Languages:** VI + EN at launch; ZH/RU deferred (routes 301).
- **Brand:** keep "Teacher Bek".
- **Content:** blog, guides and community removed (0 h/month). Telegram bot is also the owner's content tool (§7).
- **WhatsApp:** removed everywhere; Zalo and phone stay.
- **Story constraints (Step 0):** no personal life story (S7); no magic promises (S4).
- **Still open:** paid font not needed (v3 uses OFL fonts); photo and child consent (Q8) not answered; group size, free-week content, times for 5-6 year olds, reply time promise.


---

# 1. DESIGN RESEARCH — frame-by-frame study of the winners (Step 1)

Study run 2026-10-22 (headless Chromium, desktop 1440 and mobile 390; frames at 0.3–5 s and per scroll step). Raw frames: session scratchpad `v3/A–D`.

**Evidence caveats (read before trusting a number).**
- Captured on **software GL (SwiftShader)**, several sites in parallel: LCP, long tasks and 3D rendering are pessimistic or partly missing (Igloo, Messenger, Lando's 3D head were not fully rendered). Byte and request counts are reliable.
- **Opal Tadpole**: the 2024 page no longer exists (live URL is now a different essay). Evidence = Awwwards' 4 official screen-recording clips + Wayback DOM/network facts (preloader never cleared in headless replay). **Opal mobile was not observed.**
- **Mana Yerba Mate** live site is the **2026** version (footer 2026); **Noomo** live site is newer than 2023; **Lusion** live is still the v3 hero. Treat choreography as "the same system, current build".
- Awwwards annual-award roles for 2023–24 (SOTY / Users' Choice / Developer) are partly search-derived; only SOTD/HM dates and scores below were read from awwwards.com pages.
- Quaker School and Namaha are **Honorable Mentions**, not SOTDs.

## 1.1 Awards (verification status)

| Site | Award | Status |
|---|---|---|
| Lando Norris (OFF+BRAND) | SOTD 2025-11-17; **SOTY + Users' Choice 2025** | SOTD on site page; SOTY on winners page — verified |
| Messenger (abeto) | SOTD 2025-11-10; Developer SOTY 2025 | SOTD verified; Developer SOTY from winners page (earlier notes) |
| Igloo Inc (abeto + Bureaux) | SOTD 2024-07-23; SOTY 2024 | SOTD verified; SOTY via Awwwards X post |
| Opal Tadpole (Claudio Guglieri / Ingamana) | SOTD 2024-01-11, 7.52 | Verified (earlier plan said SOTY: not verified, dropped) |
| Lusion v3 | SOTD 2023-10-02, 8.25 | SOTD verified; "SOTY/Developer 2023" badge unverified |
| Noomo Agency | SOTD 2023-09-21, 7.72 | SOTD verified; "Users' Choice 2023" is Noomo's own claim |
| Mana Yerba Mate | SOTD 2023-03-13, 8.03; Developer 7.8 | Verified; "SOTY 2023 nominee" snippet not verified |
| KPR (Resn) | SOTD 2022-12-26, 7.98; Developer 7.61; SOTM Dec 2022 | Verified on site page; SOTY 2023 per press, unverified |
| Duck English | SOTD 2024-01-26 | Verified |
| Don't Board Me | SOTD 2024-03-11 | Verified |
| Trevor Noah | SOTD 2026-09-03 | Verified |
| Quaker School at Horsham | **HM** 2026-09-15 | Verified |
| Namaha Healthcare | **HM** 2026-08-07 | Verified |

## 1.2 Summary matrix (measured)

| Site | Transfer (d / m) | JS | LCP | CLS | WebGL | Sound | Mobile approach |
|---|---|---|---|---|---|---|---|
| Lando Norris | 7.0 / 8.3 MB, 117–132 req | 417 KB | 1.2 s / 1.15 s | 0 | Yes, few moments (3 .glb, KTX2) | None | Re-designed |
| Messenger | 5.1 / 2.8 MB | 73 KB | n/a | n/a | Whole site (three + Draco + KTX2) | Music + SFX, no mute | Same scene, lighter assets |
| Igloo | 14.4 MB both | 133 KB | ~2 s; long tasks 5.5–6.2 s | n/a | Whole site | Wind/beeps, no mute | Same scene, nothing removed |
| Opal Tadpole | n/a (162 MB live essay, different page) | 1 bundle | 4.7 s via proxy (not meaningful) | n/a | No (16 `<video>` + 8 canvases) | None | Not observed |
| Lusion v3 | 12.5 / 8.8 MB | 522 KB (4 scripts) | 0.75 s (text behind loader) | 0.0002 | Yes (three.js) | Plays after first gesture, MUTE toggle | Re-composed, WebGL kept |
| Noomo | 29.0 / **1.5 MB** | 910 KB, 33–37 req | 3.8 s text (software GL) | 1.0 (font swap + canvas) | Desktop only | None | Canvas and video dropped |
| Mana Yerba Mate | ~7.5 MB d, 374 req | bundled | 2.06 s d | 0.003 | WebGL2 | None | 1 column |
| KPR | ~150–165 MB (may be inflated) | Nuxt | 6.7 s d / 5.9 s m | 0.63 | WebGL2 + 19 webm | After gate, on | Full-screen menu |
| Duck English | 1.1 MB, 258 req (92 scripts) | 510 KB | 3.3 s d | 0.18 d | No | n/a | Keeps everything |
| Quaker School | 24.2 / 7.7 MB | Next + Lenis | 3.9 s d | n/a | No (HLS video) | n/a | Video becomes card |
| Namaha | 4.9 MB, 65 req | GSAP | 3.6 s d | 0 | No | n/a | Excellent, call card first |
| Trevor Noah | 9.9 MB, 96 req | Webflow | 1.4 s d | n/a | 3 contexts | n/a | Strong |
| Don't Board Me | 2.0 MB, 55 req | Nuxt, no Lenis | 7.6 s d (gate) / 3.9 s m | 0.31 m | No | n/a | Excellent |

## 1.3 Site-by-site (a big idea · b first 5 s · c scroll · d type/colour/grid/rules broken · e mobile · f tech and why fast)

### Lando Norris — closest match (personal brand)
- **a)** Personal brand as a paper-and-ink scrapbook of a life; "ON TRACK / OFF TRACK" splits the person in two; real objects (signature, helmets, captioned photos) carry the idea.
- **b)** Solid lime (~#D2FF00) with tiny "LOAD NORRIS" (mobile: lime "LN" glyph) → ~2.5 s cream #FDFCF8 with grey topographic contours and drifting blobs, "next race" ticket bottom-left → wordmark top-left by 3.5 s; lime STORE pill + bordered burger. Loader self-dismisses under 2.5 s, not a gate. No sound.
- **c)** Hero shrinks into an inset framed card on dark olive #282C20 → giant lime SIGNATURE drawn **scrubbed by scroll** → centred manifesto in bold caps with serif-italic swapped words → olive→grey, cut-out photos drift at different parallax speeds with dated captions ("MIAMI GP, 2024") + serif quote → cream + contours, monochrome photos until featured → giant ON/OFF TRACK with hand-scribbled lime overstrike → full-bleed portrait wipes up → near-black #111112 "HELMETS / HALL OF FAME", staggered 4-col grid, lime serial captions. **Section background colour carries every transition.**
- **d)** Mona Sans Variable 200–900 (caps 700 headings, body 14–16.7 px) + Brier serif 700 for accent words: the serif-in-sans word swap is the rule-breaker. Palette #D2FF00 / #FDFCF8 / #282C20 / #F4F4ED / #111112. Grid: free collage, then a strict 4-col. Native cursor.
- **e)** Re-designed, not shrunk: stacked centred wordmark, single column collage alternating L/R at 35–70% width, ON/OFF TRACK side by side and smaller, mobile-only lime "tap" button; signature and manifesto kept, fewer photos.
- **f)** Webflow + Lenis + Rive (.riv) + WebGL2; desktop 7.0 MB (images 4.6 MB, 3 .glb with Draco 1.8 MB, **JS 417 KB**), mobile 8.3 MB (KTX2 textures 4.7 MB); 2 font files ~191 KB. Fast (LCP 1.2 s, CLS 0) because the loader hides decode, JS is small and WebGL appears in a few moments only.

### Messenger (abeto)
- **a)** A toy planet you hold; hand-drawn world, blocky MES/SEN/GER logotype and a wooden "BEGIN" plank. The site *is* the game.
- **b)** White → hand-drawn envelope + "LOADING" → teal #66C2BE skewed wipe → planet rises. AudioContext running; 2.3 MB music plus SFX (letters, button-turn, runes) and biome ambiences; **no DOM mute toggle**.
- **c)** No scroll (document 900 px); BEGIN did not advance under software GL.
- **d)** No DOM text at all. Colour from the illustration (teal, yellow plank).
- **e)** Same scene portrait, smaller mp3, low-poly Draco.
- **f)** three + Draco + KTX2; JS 73 KB; 5.1 MB desktop / 2.8 MB mobile. Fast because JS is tiny and assets are compressed — but **no h1/text means invisible to crawlers and screen readers.**

### Igloo Inc (abeto + Bureaux)
- **a)** The company site is a snowy expedition; scroll flies a camera past igloo → crystal → ring, each stop one product idea.
- **b)** Flat blue-grey #A0A5B1 + tiny ASCII progress bar → wireframe igloo → glowing wireframe + point-cloud burst → full scene; HUD labels in IBM Plex Mono drawn via GPU textures. Wind, room tone, beeps via AudioContext; no DOM toggle.
- **c)** Virtual scroll (document 900 px; wheel drives the camera): lid blocks light → pull back into fog with chromatic fringing → floating ice shards ("IP" carved) with HUD leader lines → ice-segment ring assembles. Cursor nudges the scene.
- **d)** No web fonts; monospace HUD; icy palette.
- **e)** Same vertical scene, nothing removed.
- **f)** 14.4 MB on both devices, JS 133 KB, long tasks 5.5–6.2 s, LCP ~2 s (pseudo-element). **Not a speed model; wrong for a local service.**

### Opal Tadpole (2024 original; Awwwards clips + Wayback)
- **a)** A product ad as a calm editorial scroll where the product *is* the type: tiny looping video tiles sit inline in the sentence, a colour swatch flips the whole page light/dark. The page behaves like the product (tiny, tappable, mutes).
- **b)** Pure black, white script "Tadpole" draws in (~160 px) → cuts to a full-bleed 4K loop: hand holding the tiny webcam, left-aligned light-weight headline "A new species of webcam" (~36 px). Sticky top-right white card "Tadpole / $175 / Order now". No sound.
- **c)** Video scrolls away to white; a 56 px paragraph goes from 15% grey to black **word by word, scrubbed**, with 100×100 px looping video tiles inline between words → black section "Tap To Mute" with isometric wireframe assembling, yellow accent #FFDB01, counters 45 / 47 / 8 → swatch click swaps page white↔black and the product clip. The sticky card persists for the whole 21,752 px page; 16 videos.
- **d)** Roobert 300–700 only; paragraph 56 px, tight tracking; labels 10–12 px caps. Colours #000, #fff, one accent #FFDB01, dark #0a0a0a. 12-col grid with a 200 px left margin for the paragraph. Rule-broken: images inside a sentence; light weights; one page that is light and dark at once.
- **e)** Not observed.
- **f)** React + Tailwind, one bundle, 16 mp4 loops (0.1–0.6 MB each, not HLS) + 8 scrub canvases, no three/GSAP detected. Cheap *only* because the clips are short loops.

### Lusion v3
- **a)** The studio site is its own proof of work: a physics "toy box" of 3D jacks you can push with the cursor — the interaction says "we make 3D that reacts".
- **b)** Black, white Aeonik counter "000" bottom-left → bar fills at 1.5 s → ~3.5 s "100" and a pixel "L" → page revealed at ~8 s (software GL) on lavender #f0f1fa with a rounded jack card; pill nav "LET'S TALK" + "MENU". No gate; the **h1 paints behind the loader (LCP 0.75 s)**. Audio files (1.3 MB) preloaded, plays after first gesture, DOM **MUTE** toggle.
- **c)** Virtual scroll (document 900 px, steps ≈ 40% viewport): card shrinks → "Bold Ideas, Brought to Life" 144 px with the first line indented, paragraph scrubbed grey→black word by word → phone-screens card → giant "PLAY REEL" card expands to full-bleed video → 2-col "Featured Work" cards that rotate slightly into place, mono-caps tags → footer turns black with a 3D tunnel and astronauts. Header fixed throughout.
- **d)** Aeonik 400/500 (never bold), IBM Plex Mono labels; heading 144 px at −2%; colours #f0f1fa / #000 / #11141c / electric blue #1a2ffb. 12-col, 72 px margin, visible "+" crosshair ticks as grid. Rules broken: huge light-weight type, indented first line, header overprinting content, rounded cards.
- **e)** Headline moves above the card (23 px), card becomes a full-height portrait, nav collapses to wordmark + dots, work grid 1 column, WebGL kept; 8.8 MB vs 12.5 MB.
- **f)** three.js (webgl2) + custom scroll, 4 scripts 522 KB, 6 font files 185 KB, images 6.2 MB. Fast because LCP is text and heavy assets load behind a deliberate loader; CLS 0.0002.

### Noomo Agency
- **a)** Every project is a sculpture on a pixel-cross plinth under one giant word; scroll is a gallery walk.
- **b)** Periwinkle #C9D2E7 with a pixel wordmark whose o's morph (0.3–1.5 s) → by 3.5 s hero: 3 lines of 62 px NeueMachina caps "WHERE YOUR STORY / MEETS CREATIVE / TECHNOLOGY" with stretched word gaps, two chrome pixel shards, "SCROLL" chevron. Showreel autoplays muted; no sound toggle; no gate.
- **c)** Native scroll, 24,340 px: hero text and shards drift at different rates (scrubbed) → each case is a **pinned (~2000 px) giant word** (IMMERSIVE / INTERACTIVE / BESPOKE / ENTERPRISE, ~130 px) with a 3D object rotating through it, then the camera pushes in → manifesto in two asymmetric columns → testimonials as floating glass cards → contact with underline fields and budget chips. Background never flips colour; a fixed WebGL canvas sits behind DOM text.
- **d)** NeueMachina 400 caps (62 / 120 px), NeueRoman 14 px caps UI; ink #0a0a14 on #C9D2E7; colour only from the 3D objects; dark pill buttons. 40 px margins, 12-col, empty middle. Rules broken: justified caps with stretched gaps, 3D over type, round pills against brutal caps.
- **e)** **Canvas removed entirely**; plinths become static images; same hierarchy, stacked; page 10,991 px vs 24,340; vinyl-disc carousel replaces showreel.
- **f)** Nuxt + GSAP + three.js; desktop 29.0 MB (showreel 20.4 MB, models 6.2 MB) vs **mobile 1.5 MB**; CLS 1.0 (font swap + canvas) is a flaw. **Graceful degradation is the model.**

### Mana Yerba Mate
- **a)** The product is the interface: a WebGL 3D can is the protagonist; the page is a sequence of flavour "moods", one flat colour each.
- **b)** Cream #FEF7E6 with one tall orange-red bar loader → ~9 s green #ACD084 hero: can ringed by flat illustrated flowers/leaves/cloud; pill CTA "Melon & Mint" with prev/next swaps flavour. No sound. LCP 2.06 s, CLS 0.003.
- **c)** Damped wheel (~48 px/event): can tilts and slides while illustration layers parallax → green→cream **curved edge with pop-top and fizz bubbles** → skewed 81 px headline "MANA ? YERBA MATÉ ? WHAT ARE WE TALKING ABOUT?" over a tilted white card → 3 full-bleed flavour photos (green / yellow / blue) → rotated word-by-word "YOU WOULD DRINK IT" in pastel→red gradient letters → footer is a **playable mascot game** ("Press Space to jump").
- **d)** Neue Montreal 300/400/500 only; display 233 px, headings 57–81 px, body 15–19 px. Palette #FEF7E6, #2B3D73, #FFD372, #ACD084, #195E1C, ink #0E0E0E. Rule-breaking: tilted text and cards, playful footer, pill UI 40 px.
- **e)** One column, hamburger, can centred over a larger illustration, features as stacked green label bars over tilted white cards.
- **f)** WebGL2 (2 contexts desktop, 4 mobile), bundled JS, 374 req, ~7.5 MB, 3 font files. Expressive but light: one family, three weights, few heavy assets.

### KPR (Resn)
- **a)** An in-universe HUD: sound-gated entry, framed terminal, crosshair cursor, a fictional world explored through painted scenes.
- **b)** White "LOADING 0%→66%" at 3.5 s, rotating path text "KPRVERSE.COM/KPCO/AREA-SCAN/…", circular **"CLICK TO ENABLE SOUND"** gate → full-bleed purple character, stacked "KEEP. PROTECT. REIMAGINE." in heavy white grotesque, mono labels 01K/02P/03R, inset HUD frame, crosshair. Sound on after the gate (AudioContext).
- **c)** Lavender notched-corner mask wipes → misty painted landscape layers with grid lines, GPS coordinates and point cloud → lavender "10,000 UNIQUE DIGITAL COLLECTIBLES" + curved card carousel → "THE KEEP" full-bleed painting → angular clip-path images; nav indicator follows the section.
- **d)** ABC Whyte Variable (wdth 125, wght ≤ 950, Inktrap), mono labels, negative tracking. Palette lavender #6D64A3 + white/black + lime ~#C0FF50. 1 px framed grid, cut corners, mono microcopy as texture.
- **e)** Full-screen black menu, huge white caps, lime current item.
- **f)** Nuxt, 1 WebGL2 canvas, 19 webm videos, custom smooth scroll; ~581 req, ~150–165 MB; LCP 6.7 s d / 5.9 s m; CLS 0.63. **Slow by design (gate hides it) — not a speed model.**

### Duck English (SOTD)
- **a)** A mascot school that guarantees results; the duck is the brand and the contact point.
- **b)** Pale circle with googly eyes + drifting grey didone numerals; hero not visible by 5 s on desktop (cheap tell). Eyes follow the cursor.
- **c)** "The School You Deserve" + lime sticker pills (QUACK / RESULT / CLICK ON ME) → crowned duck scrubs in and **shrinks into the headline "Master Your English" inline between words** → huge arc/circle section edges → "True Stories Of Our Students" **pinned horizontal track of tilted white cards** (serif initial, photo, quote; active card turns lime) → CTA.
- **d)** Kudryashev Display 400 (90 px d / 48 px m) + tiny Open Sans caps (6–8 px labels: too small). #F2F1EC / ink #202023 / lime #E1FF01 as the only accent.
- **e)** Keeps everything, including arc text "We guarantee results".
- **f)** Nuxt, custom scroll, no GSAP/Lenis/WebGL; 1.1 MB but 258 requests (92 scripts); LCP 3.3 s d, CLS 0.18. Lead: lime "CONTACT US" pill, email/Telegram, no form, no prices; named testimonials with photos.

### Quaker School at Horsham (HM)
- **a)** "Seen & valued": real children on video plus giant type.
- **b)** Full-screen colour wash butter→coral→mauve→blue with a small swapping photo → full-bleed HLS video hero, "Seen & valued" bottom-left.
- **c)** Video **shrinks into a floating card inside the 226 px word "Everyday"** with orbiting thumbnails and a "Watch now" chip → calm 65 px lede → butter panel with rounded top corner slides over (pull-quote + photo pairs) → parallax photo → 4-col hairline list → sage events panel → "Pathways" 3 coloured cards.
- **d)** Season Mix 226 px d / 60 px m, −1%; Season Sans 18.6 px. #F9F9F0, #1C1C1C, butter #FFDC7E, sage, coral.
- **e)** Very good; video becomes a card.
- **f)** Next + Lenis + HLS, no WebGL; 24.2 MB d / 7.7 MB m (video, no mobile reduction on desktop); LCP 3.9 s. Persistent "Inquire" pill; open-house card; no prices.

### Namaha Healthcare (HM)
- **a)** "Because care should always feel *personal*" — warmth through photography, cream and terracotta, one italic word per headline.
- **b)** Hairline monogram draws in; full-bleed hands→newborn crossfade with 4 frosted terracotta "Call us…" cards.
- **c)** Cream with a floating italic word → building photo rises with "Seven decades…" → "Women's health *at our core*" over a botanical line drawing → 4 tall specialty tiles sideways → terracotta testimonial slab → accordion "We are here to *help you*".
- **d)** Victorserif 500 + italic accent, Geist 14 px body. #FFFBF6 / #503333 / #A05941.
- **e)** Excellent; the "Call us" card comes first on mobile.
- **f)** Webflow + GSAP/ScrollTrigger; 4.9 MB, 65 req; CLS 0; LCP 3.6 s d. "Call to book" card in the hero, visible pricing link. **Closest palette to ours.**

### Trevor Noah (SOTD)
- **a)** The name is the interface and the face is the mascot: a torn-paper cut-out head spilling objects of his work (mic, book, YouTube, brain, heart).
- **b)** Pink counter 0→100, then the head **peels like a sticker at ~3.5 s**; eyes follow the cursor. A cookie box covers the hero (cheap tell).
- **c)** Portrait huge then lifts → "Finding the extraordinary in the ordinary" scales in → media cards + floating props → torn-paper edge navy→charcoal → "About This Guy" sticker bubble → hairline list with pink dates → tear → quote → 3D books. Hover spawns pill labels on objects.
- **d)** Die Grotesk D 700 at 361 px d / 170 px m; body 19 px. #1D2440 navy / #F9FCF4 / #FF9BB4 pink / #6F7BA9.
- **e)** Strong; stacked, same cut-out.
- **f)** Webflow, 3 WebGL contexts; 9.9 MB, 96 req; LCP 1.4 s d. Pinned "Get Tickets" pill.

### Don't Board Me (SOTD)
- **a)** Play before you enter: an illustrated dog-care service where a bounce-the-ball gate is the first handshake.
- **b)** Desktop ball-bounce gate (LCP 7.6 s: cheap tell); mobile "Loading 91%". Hero: huge hand-drawn dog with red lead, "A TIRED DOG IS A HAPPY DOG!".
- **c)** Native scroll: dog slides up with pink and white ball shapes → "Our Services" at 360 px+ → rotating circular service glyphs + BOOK NOW → "How it works?" **4 numbered tilted cards stacking** (form → contacted → first meeting → service) → centred testimonial quote + hairline timeline → page turns blue "Have questions?" + phone + **pricing table with real prices** (walk from $30; 2×/wk $224/mo; 3×/wk $312/mo "most popular"; "breaks down to $26–28 per walk").
- **d)** Bayon condensed + Neue Montreal 14 px. #E33529 / #F2C4CC / cream / #2B6786.
- **e)** Excellent: sticky MENU/BOOK, full-width price cards. CLS 0.31 on mobile (bad).
- **f)** Nuxt, no WebGL or Lenis; 2.0 MB, 55 req. **Best template for a local service: one idea, illustration as brand, prices shown plainly, process in 4 steps — minus the gate.**

## 1.4 Repeatable patterns

| Pattern | Seen on | Cost |
|---|---|---|
| **One idea, executed everywhere** (scrapbook, courier game, dog care, mascot) | Lando, Messenger, Don't Board Me, Duck | Free |
| **Branded first beat that hides loading** (lime block + label; envelope; counter; sticker peel; monogram draw; colour wash) — 1.5–4 s, hero text painted behind | Lando, Messenger, Lusion, Trevor, Namaha, Quaker | Low; gate only if skippable |
| **One loud accent colour** on a calm ground | Lando lime, Duck #E1FF01, Opal #FFDB01, Lusion #1a2ffb, Trevor pink | Free |
| **Background colour carries the transition** (chapter fields, curved/torn/notched edges) | Lando, Mana, Trevor, Quaker, KPR | CSS |
| **ONE scrubbed signature move tied to the subject** | Lando signature drawn; Duck shrinks into headline; Quaker video→"Everyday"; DBM stacking cards | Medium |
| **Scrubbed word-by-word grey→ink paragraph** | Lusion, Opal | Low (GSAP SplitText or CSS) |
| **Real objects/hands/handwriting as authorship** (signature, scribble, captions with dates) | Lando, Opal (hand), Aardvark-style marginalia | SVG 2–10 KB |
| **Serif/italic accent word inside a sans (or vice versa) headline** | Lando, Namaha, Quaker, Duck | Free |
| **Giant type, 1–3 words per line (170–361 px mobile-to-desktop), often light weight, −1 to −3% tracking** | Trevor, Quaker, Mana, Lusion, Noomo | Fonts only |
| **Tiny mono/caps labels carry detail**, visible grid cues ("+" ticks, HUD frame, serial captions) | Lusion, KPR, Lando, Igloo | Free |
| **Persistent single pill CTA with a specific label** + phone/messenger fallback | Quaker "Inquire", Trevor "Get Tickets", DBM "Book now", Namaha "Call to book", Duck "Contact us" | Free |
| **Process as numbered steps and prices in plain sight** | Don't Board Me | Free |
| **Separate mobile composition; expensive layer dropped, hierarchy kept** | Noomo (1.5 MB), Lando, Lusion, Namaha, DBM | Design time |
| **Playful but cheap interactions**: eyes follow cursor, hover-spawned labels, footer mini-game | Duck, Trevor, Mana | Low |
| **Text stays in the DOM** (indexable, accessible, LCP = text) | Lando, Lusion, Noomo, Namaha | Free |

Measured insight: JS was **not** what made winners heavy (73–910 KB across the set); **video, 3D models and uncompressed images were** (Noomo 29 MB desktop vs 1.5 MB mobile; Quaker 24 MB; KPR 150 MB). Lando, DBM, Duck and Namaha show award-level work at 1–7 MB.

## 1.5 Cheap vs expensive tells

| Looks cheap (avoid) | Cite | Looks expensive (do) | Cite |
|---|---|---|---|
| Cookie box or promo modal over the first screen | Trevor Noah | One concept carried into every detail (404, form, favicon, emails) | Lando, DBM |
| Preloader gate that delays content for 5+ s with an empty hero | DBM desktop 7.6 s, Duck, Namaha d | Short branded intro, h1 painted behind it, LCP under 2 s | Lusion 0.75 s, Lando 1.2 s |
| Hero layout shift (font swap, canvas) | Duck CLS 0.18, DBM mobile 0.31, Noomo 1.0, KPR 0.63 | CLS ≈ 0 with metric-matched fallback fonts | Lando 0, Namaha 0, Mana 0.003 |
| 6–14 px low-contrast labels carrying real content | Duck (6–8 px), Namaha body 14 px, current teacherbek | Tiny labels only for decoration; body 15–19 px, 19 px on hero-adjacent text | Mana, Trevor |
| Tracked caps on Vietnamese or Chinese | current teacherbek (ZH, VI) | Sentence case, light-to-regular weight at huge size | Lusion, Opal |
| Fade-up on every element; text caught half-transparent | current teacherbek | One scrubbed signature move; calm sections between | Lando, Quaker |
| Gradient blobs / frosted glass as the only idea | SkyClinics, Namaha cards (decorative) | Hand-made marks and real photography | Lando, Opal |
| Multi-MB or multi-hundred-request pages with no mobile reduction | Quaker 24 MB, Duck 258 req, KPR | Drop the expensive layer on mobile | Noomo 1.5 MB |
| Sound gate or sound with no mute | KPR, Messenger, Igloo | Muted by default, user-started, visible MUTE | Lusion |
| Scroll hijacking on a content site | Lusion/Igloo virtual scroll (text unreachable to assistive tech) | Native scroll + Lenis only where it helps | Noomo, DBM |
| Floating bubbles over content; stale/empty sections; map with a watermark | current teacherbek | One persistent pill CTA, never overlapping text | Quaker, DBM |
| Stock or AI "happy classroom" photos; unverifiable round stats | generic | Real people in one consistent grade; dated captions | Lando, Quaker |
| Locked price / paywall wording | current teacherbek | Prices plain, tied to a process; invitation not gate | Don't Board Me |
| No text in DOM (invisible to Google and screen readers) | Messenger, Igloo | Real text, one h1 | Lando, Namaha |

## 1.6 Awwwards scoring system (the design is built to this)

| | |
|---|---|
| **Weights** | **Design 40% · Usability 30% · Creativity 20% · Content 10%** — verified on https://www.awwwards.com/about-evaluation/ (2026-10-22) |
| **Jury** | 18+ jurors; the 3 scores furthest from the average are dropped — verified (same page) |
| **Thresholds** | Honorable Mention **≥ 6.5**; Developer Award **> 7**; Site of the Day has no published numeric cut-off — verified (same page) |
| **Mobile Excellence** | Minimum **75/100** per an Awwwards search snippet (page not opened); brief and a third-party blog say 70 — **unverified; target ≥ 80 to be safe** |
| **Reference scores** | Lusion v3 8.25, Mana 8.03, KPR 7.98, Noomo 7.72, Opal 7.52 (SOTD pages, read 2026-10-22) |
| **Submission fee** | ~$65 (DEV Community, undated) — unverified; check at submission time |
| **Tool facts for Step 5** | Versions, gzip sizes, Rive pricing (Free / Cadet $9 / Voyager $32 / Enterprise $120 per seat/mo; runtimes MIT) and three.js notes: scratchpad `v3/E/report.md` (checked 2026-10-22) |

---

# 2. AUDIT OF THE CURRENT SITE (Step 2)

**What Phase 0 already fixed** (commit `bd33133`, 2026-10): mobile menu now closable (44 px close button, Escape, focus trap); single localized sr-only h1 (double h1 gone); contact map replaced by a static address card (no Carto "API KEY REQUIRED"); wrong-domain `llms.txt` rewritten; sitemap trimmed to live routes with fixed `lastmod`; stub redirects; empty "Reads" band hidden; footer Zalo label; **lead pipeline rebuilt** (see §2.2). **Still true:** Phase 0 was defect repair, not redesign — every design finding below (typography, colour, spacing, imagery, copy, hero emptiness, pricing gate, performance) was not touched and stands until re-measured. Items I could not re-check after Phase 0 are marked *re-verify*.

## 2.1 Design teardown (blunt; source: live site 2026-10-21, ~70 screenshots)

**5-second first impression (mobile, 390 px).** Cream screen; an 11 px grey tracked-caps eyebrow clipped at the right edge; giant condensed **ENGLISH**; a faint grey italic *"that"* (the cycling phrase has not arrived after 2 s, so the headline reads unfinished); ~280 px of empty cream; a 3-column stat box (2,000+ / 3 / 15+); a terracotta Zalo button; the Zalo bubble over the text. A Vietnamese mother learns "an English teacher, contact via Zalo". She does not learn who, which age, where exactly, how much, or whether it is safe. **No face, no child, no classroom, no price cue.** H1 stays English on VI/ZH/RU (Phase 0 made a localized sr-only h1; the visual headline is *re-verify*).

| Area | Verdict | Evidence |
|---|---|---|
| Typography | Barlow Condensed display is the best thing on the site (−0.04em, strong scale). Everything else is 11–15 px grey tracked caps at ~2.5–3:1 contrast: labels, FAQ questions (#666 caps), consent, hours. Tracking wrecks Vietnamese diacritic stacks and Chinese (`小班授课 · 富润区` spaced like Latin). Russian falls back to a system font; long RU CTAs wrap to two underlined lines. | m-en-14, m-zh-hero, m-ru-hero, m-en-17 |
| Colour | Cream/black/one terracotta is disciplined but cold; terracotta only on the hero CTA, so no warmth; long dark zone (sections 2–6) is heavy; dark and light bands muddle identity. Dark mode desktop hero is the best state. | d-en-05, d-dark-hero |
| Spacing | Hero void; uneven dead gaps (170 px per one-line facility row); classroom photo leaves a white strip; desktop "How you learn" pin ~60% blank; Community block at 32 px margin vs 64 px elsewhere. | m-en-00/11/14, d-en-02/08/12 |
| Imagery | Two photos. Portrait stiff and corporate; classroom photo (rainbow wall, "Let's Learn & Play") is the best asset but small and mis-cropped. No children or teaching in action, no certificates, no testimonial faces or video. | m-en-01/02 |
| Motion | Lenis + clip-path menu wipe are decent; hero phrase starts blurred and late; text caught half-faded mid-scroll; desktop programme cards "ghost" (look disabled); reduced-motion untested. | hero-t800, d-en-05/06 |
| Navigation | 32 px hamburger (below 44 px); theme toggle only inside the menu; Zalo bubble overlaps content on every screen; no sticky bottom CTA. (Menu trap: **fixed in Phase 0**.) | i-menu |
| Hierarchy and CTAs | Programmes (why parents came) arrive at screen ~7 of 24. "Free week" ×6 without saying what happens in it; "SEE PRICING 🔒" ×4 reads as a paywall; weakest CTAs at decision points ("REQUEST DETAILS" tiny grey link; "SEND MESSAGE" looks disabled). | m-en-08/20/21 |
| Copy | Confident in places ("Not grammar drills. Not passive exposure."), jargon for parents ("acquisition through structured play", "examiner-criteria strategy"); no "after 3 months your child can…"; Reads/Community filler. | — |
| Pricing gate | Black square modal "[ UNLOCK PRICING ]"; submit looks disabled, X is a 24 px hairline, no "ask on Zalo instead". Price-first Vietnamese parents bounce. | i-pricing-modal |
| Mobile | Single column, full-width primary CTA, 36 px phone link: good. Sticky glass header overlaps text mid-fade; 24 screens long with six stacked testimonials before any programme; no sticky CTA bar. | m-en-00..23 |

**Keep:** condensed display type at scale; the warm classroom photo; single terracotta accent; Zalo-first mobile CTA; specific testimonials (age + district); plainly stated ages and schedules.

## 2.2 Everything else (brief, severity-rated)

| Area | Sev | Finding (status after Phase 0) |
|---|---|---|
| Stack | M | Next 15.5.12 (latest 16.4.2), next-intl 3.26.5 (4.14.9), Tailwind 3.4.19 (4.3.3), framer-motion 11 (motion 14.4.0). **Three animation stacks** (Framer + GSAP + Lenis + unmaintained split-type). Unused deps (react-hook-form, cva, shadcn, leaflet types) and ~17 unused components. Vercel **Hobby is non-commercial** — verify plan. |
| Core Web Vitals (throttled mobile: Slow 4G, 4× CPU, 2026-10-20) | **H** | LCP 3.78 s (/en), 2.64 s (/vi); FCP = LCP (render-blocked by fonts/CSS); 758–782 KB; 40–43 font files; ~272 KB JS; hero rendered twice (~1,100 DOM nodes). CLS 0 ✓. **Re-verify** after Phase 0 (map/Leaflet dropped, h1 deduped); PSI was over quota — re-run with a key. |
| Lead form (traced) | M (was **H**) | **Was:** form → email only, nothing stored, pricing route returned success even when the email failed, broken honeypot. **Now:** shared `lib/leads` pipeline → **Google Sheet + Telegram** (Resend email removed: Q5/Q6) (owner-only bot with lead status buttons, `/leads`, `/stats`), working honeypot, time trap, optional **Turnstile**, origin check, localized errors with Zalo fallback; never reports success when no channel delivered. **Remaining:** confirm env vars live (Q5), no consent record per lead, no confirmation message to the parent, form still ~9 interactions, GA `generate_lead` event. |
| SEO | M | Phase 0 fixed llms.txt, sitemap and stubs. **Still open:** duplicate JSON-LD graphs and 44 invalid items (Semrush §2.3), same price on every course, `byDay` contradicts FAQ, no hreflang in sitemap, no x-default in HTML, `/community` and `/blog` thin. ✓ SSR, canonicals, localized home titles. |
| AI search | M | No plain "fast facts" entity block; FAQ is the only answer source; no Google Business Profile signal. All AI crawlers allowed ✓ (Semrush AI Search Health 100%). Google says no special AI files needed (developers.google.com/search/docs/appearance/ai-features, checked 2026-10-20). |
| Accessibility | M | Contrast failures (labels at 40–65% opacity); 46 tap targets under 44 px; status not announced; skip-link targets missing on subpages. Menu trap fixed. ✓ reduced-motion mostly respected, focus-visible, font-size toggle. |
| Security/Privacy | H | GA4 loads without consent; privacy/terms English-only, omit phone, children, processors, retention. Vietnam PDPL (Law 91/2025/QH15, Decree 356/2025) in force since 2026-01-01 — **confirm with a Vietnamese lawyer**. CSP still has `script-src 'unsafe-inline'`. |
| Blog | **H** | 0 local posts; empty band hidden in Phase 0. **Decided (Q14: 0 h/month):** blog and guides dropped. Remove `/blog` from nav, sitemap and routes; 301 to the programmes. No empty blog and no guides at launch. |
| Community | **H** | 5 submission types, all data files `[]`, publishing needs JSON edits and a redeploy; distracting for new parents. **Decided (Q14: 0 h/month):** community dropped. Remove from nav, sitemap and routes now; 301 to home at the rebuild. Not revived unless the owner later commits weekly time. |

## 2.3 Semrush Site Audit (crawl 2026-03-11, report 2026-10-21)

Report generated 2026-10-21, but all crawl data is from **2026-03-11 13:58**, so some findings may be stale; a fresh crawl runs after Phase 0 (§8.1 P0.10). **Site Health 89% · AI Search Health 100% (0 pages blocked for AI bots) · 21 pages crawled (17 with issues, 2 redirects) · 44 errors · 363 warnings · 22 notices.** `llms.txt` passes Semrush checks but lists the wrong domain (§2.2).

| # | Severity | Issue | Count | Cause (file:line) | Fix | Plan phase/§ |
|---|---|---|---|---|---|---|
| 1 | Error | Invalid structured data | 44 items | Course fields `courseWorkload`, `instructor`, `courseSchedule`, `category` (`components/structured-data.tsx:66-145`, layout JSON-LD); `serviceType` on Organization/LocalBusiness on every page | One compact `@graph`, only Google-documented Course fields (Course + `hasCourseInstance` + `offers`); validate every locale in Rich Results Test + schema validator; CI gate | P2b.7b, §6.2 |
| 2 | Warning | Internal resources blocked in robots.txt (JS/CSS/`_next`/images) | 316 | Live robots.txt is `Allow: /` + `Disallow: /api/` (static file removed in `ce5fd2f`), so likely stale | Re-crawl; rule: never disallow `/_next/`, `/_astro/`, static assets, images | P0.10, P2b rules |
| 3 | Warning | Broken external links | 16 | `https://wa.me/84353885757` returns 429 at `VanguardFooter.tsx:71`, `VanguardInquiry.tsx:515`, `app/api/contact/route.ts:216`; footer zalo.me link labelled `t("telegram")` at `VanguardFooter.tsx:70` | Remove wa.me unless owner uses WhatsApp (Q15); fix label; new site: link checker in CI, 429 = warn-and-retry | P0.7, P2b.11 |
| 4 | Warning | Low word count | 12 pages | Blog indexes 33-67 words; privacy ~178; terms ~183 | No empty blog index; legal pages ≥ 300 words per shipped locale | P0.9, P2b.8 |
| 5 | Warning | Low text-to-HTML ratio | 16 pages | Home 0.04, privacy 0.02, blog 0.01 (bloated JSON-LD, duplicated hero DOM) | Compact JSON-LD, no duplicated hero DOM, real copy; QA target ≥ 10% on content pages | P2b.3, P2b.11, §8.2 |
| 6 | Warning | Title too long | 3 pages | Old title "English Teacher Phú Nhuận, HCMC · TESOL & PGCE · 2,000+ Students · Teacher Bek · Phú Nhuận"; template suffix `app/[locale]/layout.tsx:41` | Rendered title ≤ 60 chars incl. suffix, all locales; CI check | P2b.7a, §6.2 |
| 7 | Notice | Orphaned sitemap pages | 12 | `/about`, `/services`, `/faq` x4 locales | Sitemap generated only from live indexable routes; 301 the stubs; remove `/community` and `/blog` from `app/sitemap.ts` PRIMARY_ROUTES now | P0.9, P2b.7a |
| 8 | Notice | hreflang language mismatch | 6 | `/ru` and `/zh` privacy and terms, `/vi/terms`, `/zh/blog` render English | A locale ships only when its legal pages are translated; until then no hreflang + `noindex` on untranslated pages | P2b.7a, P2b.8 |
| 9 | Notice | More than one H1 | 4 pages | `components/VanguardHero.tsx:116` (`motion.h1`) and `:316` (`h1`), mobile + desktop duplicate | Exactly one h1 shared by mobile and desktop | P0.8, P2b.3, §4.1 |
| 10 | Info | `llms.txt` wrong domain | 1 | `public/llms.txt` | Rewrite (already planned) | P0.5a |

---

---

# 3. THE BIG IDEA AND DESIGN BIBLE (Step 3)

## 3.0 Why "Red Pen" failed (so v3 does not repeat it)

| Why it was "truly shitty" | Evidence in the rejected build | What v3 does instead |
|---|---|---|
| **Cautious, type-only.** Playfair + paper + one red colour: safe, nothing a juror would screenshot. | Phase 2a pages were text on cream | Colour, sound, variable-type motion and the visitor's own input are the material. Lando (§1.3) is a scrapbook of objects; Mana is flat colour moods; DBM is one illustrated gag. Winners commit. |
| **Doodles instead of a subject.** Red-pen strokes, ticks and arrows decorate; they do not express teaching. | Handwriting overlay on every section | The visitor does what a student does in the first minute of class: answers "how are you?". Interaction **is** the subject (Duck: the mascot shrinks into the headline; Quaker: video into the word "Everyday"). |
| **Placeholder tags.** `[OWNER: photo]` boxes where people should be. | Hero cut-out "not shot (Q8)" | Launch never depends on a photo that does not exist. Every section has a typographic or sound version that is complete on its own; photography and video upgrade it (§3.5, §4 "launch fallback" column). |
| **No real people.** Not one face, hand, voice. | Two stock-feeling photos | Bek's real voice is the hero (user-started); real hands and room; anonymised but real parent words. |
| **No single big idea.** Correction + seat map + level ladder + answer key = four ideas. | §3.7 listed 5 signature interactions | One idea, one signature moment, three supporting moments, all variations of "hello, how are you". |
| **No moment people remember.** | none | The "I am ___." drop (§3.9). |

## 3.1 Three big ideas

| | **A. "Hello! How are you today?"** (chosen) | B. "Talk Time" | C. "First Words" |
|---|---|---|---|
| One line | The site greets you the way Bek greets every child, and the answer changes the page. | A lesson is an hour in which the children do most of the talking; the page is that hour. | Letters become words become sentences: scroll watches a child grow into English from 5 to 17. |
| Metaphor | The first ten minutes of class (S3: "greet, share how they are"). | Speech bubbles filling a circle of chairs; the teacher's bubble is the smallest. | The alphabet assembling itself; reading as a finger under a line of words. |
| Mood | Warm, funny, tactile, sunny; a living room with a window, not a school | Lively, busy, noisy-in-a-good-way | Calm, bookish, proud |
| Signature interaction | Finish "I am ___." with a feeling word; it flies into the sentence, the page floods with that colour, Bek replies; the sentence later shrinks into the header | Scroll-scrubbed circle: bubbles appear child by child; student bubbles outgrow the teacher's | Scroll-scrubbed type: letters on a baseline arrange into a word, then a sentence that grows with age |
| Why it fits Bek | It is literally his lesson opening (S3), works for every age 5-17 and the parent holding the phone, needs no personal story (S7), and says "warm home" (S5) before any copy does | Maps to S5 "more talk time for students" | Maps to S6 (the 5-year-old who reads) and S4 (speak, read, listen) |
| Risks | Looks like a mood-picker gimmick if the reply copy is flat; needs Bek's real voice to feel human; must never block the page | Talk time is a **number claim** the owner has not given (no data); busy visuals invite jank; hard to make SEO-readable; reads as generic "chat bubbles" | Reads as a children's ABC site, which cheapens the Teens programme; the strongest proof (one 5-year-old) is one story only; type-only again = the Red Pen mistake |
| Award potential | High: one idea, expressed by interaction (the Creativity criterion), cheap to run | Medium: strong concept, but numbers cannot be shown honestly | Medium: pretty, not ownable |

**Chosen: A.** B and C are not discarded: B becomes the supporting moment "The circle" (F3, no numbers, just turns), and C becomes the supporting moment "The ladder" (F4: one sentence grows from age 5 to 17) and the reading-underline in the proof (F5).

## 3.2 Defence of A against the four criteria

| Criterion | Argument | Evidence from §1 |
|---|---|---|
| **Design 40%** | Giant soft-serif type (to 176 px) against a calm paper ground, six saturated mood fields that carry every section change (no gradient blobs), one accent word in italic per headline. Tactile because colour and type respond to a touch. | Background colour carries transitions: Lando, Mana, Trevor, Quaker (§1.4). Giant 1-3 words per line: Trevor 361 px, Quaker 226 px, Mana 233 px. Serif/italic accent word: Lando, Namaha, Quaker. One loud accent on calm ground: Lando lime, Duck lime. |
| **Usability 30%** | The hero is **text in the DOM** (LCP = the h1), the interaction is 6 buttons large enough for a 5-year-old's thumb, no content is gated (only the price sits behind a 3-step, under-a-minute invitation, with a Zalo alternative that gives the same answer), CTA is persistent but never overlaps. The loader is <= 1.6 s and skippable. Mobile is its own composition (words in the thumb zone). | LCP text behind loader: Lusion 0.75 s; CLS 0: Lando, Namaha; loader self-dismisses <2.5 s, not a gate: Lando; mobile redesigned not shrunk: Noomo 1.5 MB, DBM, Namaha "call card first"; persistent single pill CTA: Quaker, Trevor, DBM. Avoid: gate 7.6 s (DBM d), cookie box over hero (Trevor). |
| **Creativity 20%** | One idea, and the interaction **expresses the subject**: a speaking class begins with a spoken greeting and a sentence the child completes. It is not an effect on top of a service site; it is the service's first minute. The sentence follows the visitor (header chip) and returns on the form, the thank-you page and the 404. | "One idea executed everywhere": Lando scrapbook, DBM play-before-you-enter, Duck mascot into headline, Opal product-as-type (§1.4). Closest cousin: DBM's bounce-the-ball gate (a handshake), minus the gate. |
| **Content 10%** | Copy has a voice (a teacher at the door: warm, short, no jargon). The voice is Bek's real voice. The proof is one specific, honestly bounded story (the 5-year-old) plus anonymised parent words. No stock, no stat inflation. The owner's own photos and phone videos, dated captions. | Dated captions and real objects: Lando. Named/real people: Duck, Quaker. No-stock rule: §1.5. |

## 3.3 Typography

**Rule (from `type/report.md`, memory):** one family per role, each natively covering Vietnamese; never a per-glyph fallback (it mixed weights inside one word on the old site). Cyrillic is no longer required (launch is VI + EN), which opens the shortlist.

| Role | Font | Verified | Licence / cost | Why |
|---|---|---|---|---|
| Display | **Fraunces** (variable: `opsz` 9-144, `wght` 100-900, `SOFT` 0-100, `WONK` 0-1; roman + italic) | Google Fonts metadata 2026-10-22: subsets latin, latin-ext, **vietnamese**; axes as listed | OFL, **$0** | "Soft" old-style serif with a warm, slightly wonky character: warm without being childish, premium without being cold. The `SOFT` and `wght` axes let each feeling word *behave* (see 3.3, type motion). Replaces Barlow Condensed (cold, no personality for this idea). |
| Text and UI | **Be Vietnam Pro** (static 400, 600; latin + vietnamese) | Google Fonts metadata: subsets latin, latin-ext, vietnamese; designed for Vietnamese | OFL, **$0** | Already the live body font (continuity), best-in-class Vietnamese tone-mark spacing, friendly geometry. Two weights only to stay light. |
| Option (not default) | **Bricolage Grotesque** variable (`opsz` 12-96, `wdth` 75-100, `wght` 200-800; VN verified) | metadata | OFL, $0 | If Phase 2a shows Fraunces too ornamental in Teens context, swap display to Bricolage (more contemporary), keep Be Vietnam Pro for text. Decide in Phase 2a with real VI headlines, not now. |
| English "handwriting" | **Bek's real handwriting**, only ~12 English marks/words (see 3.9: reply "Me too!", "See you soon!", his signature) as inline SVG | n/a | free | Used in exactly two places (reply and goodbye). **Never for Vietnamese**, never a script font, no doodles/ticks/arrows (that was Red Pen). Optional: if the owner will not write them, the site loses nothing. |
| Vietnamese guard | Fraunces headings in VI use `line-height >= 1.08` (EN 0.92-1.0); stacked tone marks clip at 0.92 | design rule | n/a | Verify in Phase 2a with the test string `Tiếng Việt: ặ ẫ ỗ ữ ự ợ đ ế ộ` at every size in both fonts. |

**Files and weight.** Fraunces roman: subset latin + latin-ext (needed for "Phú Nhuận" ranges) + vietnamese, axes limited to `wght` 300-800, `opsz` 24-144 (auto), `SOFT` 0-100, `WONK` 0-1 (instance with fonttools, `pyftsubset`). Fraunces italic: static instance (`opsz` 72, `wght` 400, `SOFT` 100). Be Vietnam Pro 400 and 600. Self-hosted woff2, `font-display: swap`, preload **one** file (Fraunces roman latin+vi), size-adjusted fallbacks (`size-adjust`, `ascent-override`) to keep CLS ~0. **Budget <= 200 KB for the whole family set**; actual Fraunces size must be measured in Phase 2a (not yet measured: the Phase 2a Playfair review got 167 KB for 3 files, a similar target). If roman exceeds 120 KB, drop `WONK` and `opsz` range first, then italic.

**Scale (360 to 1440 px, fluid).**
| Token | clamp() | Font and settings | Use |
|---|---|---|---|
| `display-xl` | `clamp(3.5rem, 15vw, 11rem)` (56 to 176 px) | Fraunces `wght` 600, `SOFT` 100, `opsz` 144, tracking -0.03em, lh 0.92 EN / 1.08 VI | Hero "Hello!", chapter openers, ages on programme pages |
| `display-l` | `clamp(2.5rem, 9vw, 7rem)` | Fraunces 600, `SOFT` 80, tracking -0.02em, lh 0.98 EN / 1.1 VI | Section headlines |
| `display-m` | `clamp(2rem, 5vw, 4rem)` | Fraunces 500; accent word Fraunces italic | Quotes, the figures in the personal answer, sub-headlines |
| `title` | `clamp(1.25rem, 2vw, 1.75rem)` | Be Vietnam Pro 600, lh 1.25 | Card titles, steps |
| `body-l` | `clamp(1.125rem, 1.4vw, 1.375rem)` | Be Vietnam Pro 400, lh 1.55 | Lead paragraphs |
| `body` | `1.0625rem` mobile / `1.125rem` desktop | Be Vietnam Pro 400, lh 1.6 | Copy; never < 16 px |
| `label` | `0.8125rem` (13 px) | Be Vietnam Pro 600, sentence case in VI, uppercase + 0.04em only in EN | Eyebrows, captions; never carry required info |
| `num` | per context | Fraunces lining figures (`font-variant-numeric: lining-nums`; check `tnum` in Phase 2a) | Prices, ages, times |

Accent rule: one italic word per headline (Lando, Namaha, Quaker, §1.4), e.g. "Every lesson starts with *hello*."

**How the type animates (and never breaks Vietnamese).**
- Headlines: GSAP **SplitText by lines (mask) and words**; never by characters in Vietnamese (splits stacked diacritics). Each line rises 100% to 0 inside its mask: 800 ms, `--ease-out`, 60 ms word stagger, whole sequence <= 900 ms.
- **Feeling words are English** (Latin, no stacked marks), so these alone may split by characters. Each word has its own variable-font personality on reveal (all axes animated via `font-variation-settings`, GPU-cheap because only that one word moves):
  | Word | Personality | Axes and motion |
  |---|---|---|
  | happy | lifts | `wght` 400 to 700, `SOFT` 100, y -8 px, `back.out(2)` 600 ms |
  | tired | sags | `wght` 300, y +6 px, letters drop 2 px each in sequence, 1200 ms slow ease |
  | hungry | stretches | `wght` 800, letter-spacing +0.04em, 700 ms |
  | excited | bounces | `wght` 900, `WONK` 1, scale 1.12 and settle, `elastic.out(1, 0.5)` 900 ms |
  | shy | shrinks then grows | `opsz` 9, scale 0.85 to 1, `wght` 400 to 500, 900 ms |
  | okay | steady | `wght` 500, no overshoot, 500 ms |
- Scrubbed paragraph (F2): words go from 18% ink to 100% ink as you scroll (Lusion, Opal, §1.4), CSS `animation-timeline: view()` first, GSAP only as fallback.
- `prefers-reduced-motion`: final states, no axis animation, instant colour change with a 150 ms cross-fade.

## 3.4 Colour

Verified contrast (computed 2026-10-22, WCAG relative luminance): `ink` on `paper` 15.7:1; `ink-soft` on `paper` 6.2:1; `cta` with white text 5.4:1 and on paper 5.1:1; every mood tint with `ink` text >= 6.7:1; evening text on evening ground 16.0:1.

| Token | Light "Morning" | Dark "Evening lamp" | Rule |
|---|---|---|---|
| `--paper` | `#FFF8EA` | `#1E1612` | Page ground (default) |
| `--paper-2` | `#F6EBD3` | `#2A1F18` | Alternate bands, FAQ rows |
| `--ink` | `#2A1B14` | `#FFF1DC` | All text |
| `--ink-soft` | `#6B5A4E` | `#C9B8A6` | Secondary text only |
| `--cta` | `#C2391F` | `#FF8A6B` (text on it: `#2A1B14`, 7.2:1) | **Only** primary buttons, focus ring, links on hover. <= 5% of a screen |
| `--mood` (live) | one of six tints, default `sun` | same tints | **Large fields only** (hero ground, chapter bands, active ladder stop, final form ground). Never as text on paper (contrast 1.5-2.3:1). Text on a mood field is always `--ink`. |

| Feeling | `--mood` | Hex | Ink contrast |
|---|---|---|---|
| happy (default) | sun | `#FFC83D` | 10.7:1 |
| tired | dusk | `#9DB4DB` | 7.9:1 |
| hungry | tangerine | `#F59A5B` | 7.6:1 |
| excited | berry | `#FF7A9E` | 6.7:1 |
| shy | lilac | `#C9B8EE` | 9.2:1 |
| okay | sage | `#A8D5A2` | 10.0:1 |

- **How colour changes the page:** on pick, a circle of `--mood` expands (clip-path) from the word to cover the hero in 700 ms; later chapters use `--mood` on their fields; the mood persists in `sessionStorage` (wrapped in try/catch) and in a header chip. No pick = `sun`. Dark mode uses the same tints on the same fields (ink text), with paper turning to the evening ground between fields.
- Light is default (parents browse by day, warmth); dark follows `prefers-color-scheme` with a toggle in the menu.
- Hard rule: **no gradients, no blobs, no glass.** Flat fields with edges that are curved (like Mana's pop-top edge) or straight; the Red Pen's paper grain is dropped (saves a request).
- Retired from `CLAUDE.md`: "no rounded corners". v3 uses pill buttons (999 px) and 28 px card radius, because the idea is warmth. Update `CLAUDE.md` in Phase 2a.

## 3.5 Imagery (owner-shot, phone-first; no stock, ever)

**Principles.** One light (window daylight), one grade, real hands and real objects (Lando uses real objects with dated captions, §1.3). **Children's faces only with written parent consent** (PDPL, §7); otherwise hands, backs of heads, shoes by the door, drawings, a name card. No AI people, no thumbs-up poses, no blurred faces (reads as a crime report). Launch **never** waits on photos: each frame has a typographic version (§4).

**Phone video spec (owner shoots later; Q8).**
| Item | Spec |
|---|---|
| Orientation | Vertical 9:16 for anything shown on mobile/hero strips; horizontal 16:9 only for the room wide shot |
| Capture | 1080x1920, 30 fps, phone on a stack of books or cheap tripod, lock exposure/focus, wipe the lens, airplane mode on |
| Light | Window light from the side, curtains half open, **overhead tubes off**; no flash; no backlit windows behind faces |
| Sound | Record audio separately for voice (see 3.8); room tone 10 s for each clip |
| Length | 5-8 s loops (muted); one 20-30 s "a lesson begins" clip (with captions) |
| Delivery | Original files to the build team; build exports H.264 + AV1, 720 px, <= 1.2 MB per loop, poster AVIF, never autoplay on Save-Data |

**Shot list (half a day; also a photo set of 25+).**
| # | Shot | Used in |
|---|---|---|
| 1 | Bek saying "Hello! How are you today?" to the camera, head and shoulders, smiling, eye-level (audio recorded separately too) | F1 poster, F11 goodbye, OG image |
| 2 | Hands only: Bek's finger and a child's finger under a line of words | F5 proof |
| 3 | Backs of heads around the table, one child raising a hand | F3 circle |
| 4 | Shoes in a row at the door | F7 room (home warmth) |
| 5 | The table: books, pencils, a name card, tea mug; window in frame | F7 |
| 6 | Whiteboard/flashcards with today's words, hand writing | F3, F4 |
| 7 | The building entrance and street (Phổ Quang) | F7 map |
| 8 | With consent: one child reading aloud, side profile | F5 (only if consent exists) |

**Treatment.** Warm, slightly lifted blacks, +3% grain baked in the export, one LUT for everything; photos set as full-bleed bands or as rectangles with 28 px radius; **captions with date and place** in `label` style ("Thứ Tư · 19:30 · Phú Nhuận"). Image formats: AVIF + WebP via `<Picture>`, widths 480/828/1200/1920, hero poster <= 60 KB mobile.

## 3.6 Grid and rhythm

- **Grid:** desktop 12 columns, 24 px gutter, margin `clamp(20px, 5vw, 80px)`, max 1440 px. Mobile 4 columns, 16 px gutter, 20 px margin.
- **Spacing:** 4 px base; scale 4/8/12/16/24/32/48/64/96/128/192; section padding `clamp(72px, 12vw, 176px)`.
- **Rhythm:** loud / quiet alternation (one giant statement, then dense useful content); never two loud in a row. Mood fields (colour) are the "loud" rows.
- **Where it breaks the grid on purpose:** (1) the hero sentence runs to the right edge on desktop and the feeling words overhang it; (2) the ladder track is full-bleed and out of grid; (3) the "Week 1 free" line spans all 12 columns at `display-xl`; (4) in the room section, one photo bleeds past the margin on the left (Lando's L/R collage offsets).
- Buttons: pill, 56 px tall mobile; chips 48-56 px; touch targets >= 48 px (children).

## 3.7 Motion language

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals, entrances |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Page transitions, Flip |
| `--ease-soft` | `cubic-bezier(0.4, 0, 0.2, 1)` | Colour flood, hover |
| `--ease-pop` | GSAP `back.out(1.6)` / CSS `linear()` approximation | Word dropping into the slot |
| `--dur-tap` | 120 ms | Press |
| `--dur-ui` | 240 ms | Hover, menu |
| `--dur-reveal` | 800 ms | Headline lines |
| `--dur-flood` | 700 ms | Mood colour circle |
| `--dur-page` | 500 ms | Page transition |
| Stagger | words 60 ms, list items 80 ms; **any sequence <= 900 ms** | |

**What moves and why.** (1) the feeling word and the colour (the idea); (2) headline words/lines (rhythm); (3) the ladder track and the circle (scroll story, F3-F4); (4) form steps (state). Body text never animates; it is visible at first paint.

| Behaviour | Spec |
|---|---|
| **Hover (fine pointer)** | Links: underline draws left to right 240 ms. Buttons: lift 2 px, background `--cta` to darker. Feeling tiles: tint preview of their mood colour behind the word (150 ms) |
| **Cursor (fine pointer only)** | 12 px ink dot (lerp 0.18) that grows to a 72 px pill with a one-word label over interactive things: "Say it" (feeling tiles), "Play" (audio), "Drag" (ladder). Off on touch and reduced motion. |
| **Scroll** | Lenis 1.3.27 on fine-pointer desktop only (`lerp 0.1`, `autoRaf` off, driven by GSAP ticker); native scroll on touch. Two pinned scenes only (F3, F4), each <= 400 vh on desktop. |
| **Page transitions** | Native cross-document View Transitions (`@view-transition { navigation: auto; }`): old page fades/lifts 4% (250 ms) while a `--mood` coloured sheet wipes up (500 ms, `--ease-in-out`), header and mood chip persist (`view-transition-name`). Shared element: age numeral on programme cards morphs into the programme page hero. Unsupported browsers: instant navigation. |
| **Preloader (<= 1.6 s, never a gate)** | The h1 is in the DOM and painted behind it. Screen = flat `sun` field, centre "Hello" in `display-l` appears letter by letter (CSS, 60 ms stagger, 0.7 s), then the field wipes up (500 ms) to the hero. Ends on `fonts.ready` or 1.6 s, whichever first; any tap/scroll skips; repeat visits within the session skip it entirely. Lando dismisses in < 2.5 s; Lusion hides the loader behind a text LCP of 0.75 s (§1.3). |
| **Reduced motion** | No loader (instant), no scrub, no Flip; colour and word change instantly; audio stays user-started. |

## 3.8 Sound

**Yes, as a gift, never as an entry:** muted by default, never autoplays, started by a visible button (Lusion: sound starts after a gesture and has a visible MUTE; KPR/Messenger/Igloo no-mute is the cheap tell, §1.5).
- **The hero speaker button** ("Hear Bek say hello", label + 44 px icon) plays Bek's recorded "Hello! How are you today?" (about 2 s).
- Each feeling tile has a tiny speaker: plays the word ("happy") in Bek's voice (children can practise). Optional: the reply line is also spoken.
- Goodbye "See you soon!" plays on the thank-you page only when the user taps it.
- **Files:** 8 clips (greeting, six words, goodbye), Opus in `.webm`/`.m4a` fallback, about 8-15 KB each, total <= 120 KB, **not loaded until the first speaker tap/hover/focus**. Web Audio not needed: `new Audio()`.
- A persistent MUTE/ON toggle appears only after the first play. In-app browsers (Zalo, Facebook) that block audio: the button silently shows captions text instead ("Hello! How are you today?").
- If the owner does not record: the buttons are hidden, the page loses nothing (the idea is the sentence, sound is the voice).

## 3.9 The signature moment and three supporting moments

### Signature: "I am ___." (the page everyone remembers)
Frame by frame (desktop; mobile identical but words in the thumb zone):
| Time | What the visitor sees and hears |
|---|---|
| 0.0-1.6 s | Loader: sun-yellow field, "Hello" appears letter by letter, wipes up |
| 1.6-2.6 s | Hero ground `paper`. Headline words rise one by one: **"Hello!"** (`display-xl`) then **"How are you today?"** (`display-l`). Under it a sentence with a blinking underline slot: **I am ______.** The h1 text is already in the DOM (LCP) |
| 2.6-3.4 s | Six feeling words rise as large soft pills: happy · tired · hungry · excited · shy · okay (VI gloss under each in `label`). Speaker button "Hear Bek say hello" fades in |
| idle 6 s | "happy" gives one wiggle (one time only) |
| tap on a word | 0 ms: 10 ms haptic (`navigator.vibrate`, where supported); the word **FLIPs** from its pill into the slot (600 ms, `--ease-pop`); at the same moment a circle of that mood colour expands from the word and floods the hero (700 ms); the word plays its personality (3.3) |
| +900-1700 ms | Bek's reply types in under the sentence in Fraunces italic (VI or EN by locale). Examples, EN / VI: happy "Wonderful. Let's start there." / "Tuyệt! Mình bắt đầu từ niềm vui nhé." · tired "That's okay. We'll go slowly today." / "Không sao. Hôm nay mình đi chậm thôi." · hungry "Ha! Then we'll talk about food first." / "Ha! Vậy mình nói về đồ ăn trước." · excited "Great energy. Let's use it." / "Năng lượng tốt đấy. Dùng nó nào!" · shy "That's okay. You can whisper first." / "Không sao. Con thì thầm cũng được." · okay "Okay is a good place to start." / "Bình thường cũng là một khởi đầu tốt." |
| +1700 ms | One line below: "Parents can answer too, or hand the phone to your child." / "Ba mẹ cứ trả lời, hoặc đưa điện thoại cho con." Then the real hero info appears: **ages 5-17 · Phú Nhuận · "Start the free week" + "Message on Zalo"** |
| scroll 0-60 vh | The sentence "I am happy." shrinks (Flip, scrubbed) into the sticky header as a **mood chip** (like Duck's mascot shrinking into the headline, Quaker's video into "Everyday", §1.4). Tapping the chip reopens the six words; changing it re-tints every later field |
| later | The chip persists on every page (View Transitions). The form's last step says "Thanks for saying hello, [mood]" (not stored); the thank-you and 404 pages reuse the sentence ("I am lost." on the 404) |

Why it is the signature: it is the only thing on the page that **requires the visitor to speak English** (for a moment), in the voice and tone the class actually has, and it is unmistakably this teacher's. Fallbacks in 3.10.

### Supporting moments
1. **The circle (F3).** A table seen from above, six seats; scrub reveals each child's turn as a speech bubble ("I am tired." "I am happy." …); the teacher's bubble stays small. No numbers.
2. **The ladder (F4).** One sentence grows from age 5 to 16 across a horizontal track; at ages 11+ the colour flips to a new mood and the programme label changes from Young Learners to Teens.
3. **Reading underline (F5).** An underline moves word by word under "cat · hat · sit" then a short sentence, timed like a finger. It stands in for video until the owner shoots shot #2.

## 3.10 3D / shaders / Rive: decisions and fallbacks

| Tech | Decision | Reason | Fallback |
|---|---|---|---|
| three.js (0.186.1, 184.9 KB full) / R3F | **No** | The idea is typographic and vocal; WebGL is what made winners 9-15 MB (§1.4); Mana and Lando use it for one hero object, but Bek's idea has no object | n/a |
| Shaders (ogl, 34.2 KB, stale since 2025-04) | **No** | The colour flood is a CSS clip-path circle | n/a |
| Rive (2.45.0; runtimes MIT; Free $0 / Cadet $9 per seat per month) | **No in v1** | The only candidate was an animated waving hand for F11; CSS + SVG does it in 2 KB | If desired later: Rive canvas-lite, lazy on the thank-you page, static SVG fallback |
| Lottie | **No** | same | |

**Pre-decided fallback ladder for the signature (tiers, §5.3).** Full: Flip + clip-path flood + axis animation + sound. Touch: same but without the cursor; Flip via WAAPI hand-rolled (1 KB), flood via CSS. Lite/reduced-motion: tap sets word and colour instantly with a 150 ms cross-fade; no axis animation. No-JS: the sentence reads "Hello! How are you today? I am ___." and the six words are links to `#start` that work as plain anchors; the page is complete.

---

# 4. THE SCROLL STORY, FRAME BY FRAME (Step 4)

**Programme facts used (owner, 2026-10-22):** two programmes, **Young Learners 5-10** and **Teens 11-17**, one price: free trial week, first month **1,990,000 VND**, then **2,990,000 VND/month**. Weekdays at the same time every day; weekends unchanged. Group size, times for 5-6 year olds, and what "etc." follows the greeting in a lesson are **not known** and are marked `[OWNER]` in the notes column, never written as fact. Vietnamese is the master language (voice: **thầy** for Bek, **ba mẹ** for parents, **con** for the child); EN follows. All English sample headlines can be shortened to the **mobile display budget** of ~7 Vietnamese words.

**Desktop length:** about 15 viewports of normal scroll plus two pins (F3 300 vh, F4 400 vh). **Mobile length:** about 11 screens before the final form (~9,500 px), no pins.

## F0 · Loader (0-1.6 s)
| | |
|---|---|
| Purpose | Brand the first beat while hiding font load; never delay the hero text |
| Emotion | A small smile |
| Copy | "Hello" (EN on both locales; it is the lesson) |
| Layout | Full-screen `sun` field, centred `display-l` |
| Mechanic | Letters in 60 ms stagger (CSS), field wipes up 500 ms; skip on tap/scroll; skipped on repeat view in session; h1 already painted behind (Lusion pattern) |
| Mobile | Same, 80 px type |
| Launch fallback | Complete without any asset; if JS fails the overlay is removed by a 1.6 s CSS animation (`animation-fill-mode: forwards; visibility: hidden`) |

## F1 · Hello (hero, the signature) 
| | |
|---|---|
| Purpose | In 5 seconds: who (Teacher Bek), what (English classes), for whom (children 5-17), where (Phú Nhuận), and the first interaction |
| Emotion | Delight, then being welcomed |
| Copy direction | Huge greeting, one question, one sentence to finish. Info line only after the first answer, so the first screen is *only* the greeting. Sample H1 (the real DOM `h1`, visually the greeting): VI **"Xin chào! Hôm nay con thế nào?"** / EN **"Hello! How are you today?"** Below the reply: VI "Lớp tiếng Anh cho bé 5-17 tuổi · Phú Nhuận · Tuần đầu miễn phí" / EN "English classes for ages 5-17 · Phú Nhuận · First week free" |
| Layout | Desktop: greeting left-aligned across 9 of 12 columns, bleeding off the right edge; sentence slot under it; feeling pills in a row that overhangs the right margin; speaker button bottom-left; header mood chip appears after scroll. Mobile: greeting top (3 lines), sentence, then **six pills in a 2x3 grid in the thumb zone** (each >= 56 px tall), speaker button above them |
| Mechanic | Signature sequence in §3.9. Pin: none. Scrub: sentence-to-header chip, scroll 0-60 vh, `scrub: 0.6` |
| Mobile | As above, `100svh` min-height; sticky bottom bar appears after the first scroll (Zalo · Start the free week) |
| Launch fallback | Works fully without audio, photo or video |
| Notes | Parents: "you can answer too, or hand your child the phone" line is the bridge between audience (parent) and idea (child) |

## F2 · Every lesson starts with hello (manifesto)
| | |
|---|---|
| Purpose | State the method in one paragraph; connect the greeting to the real lesson (S3) |
| Emotion | Recognition, relief |
| Copy | H2 VI **"Mỗi buổi học bắt đầu bằng *xin chào*."** / EN **"Every lesson starts with *hello*."** Paragraph VI "Chào nhau. Mỗi bạn nói hôm nay mình thế nào. Rồi cả lớp học nói, học đọc, học nghe, mỗi tuần tốt hơn một chút." / EN "We say hello. Each child says how they are today. Then we learn to speak, read and listen, a little better every week." (No claim beyond S3/S4.) |
| Layout | Mood field band (`--mood`) with a 56 px paragraph left-aligned across 9 columns (Opal's 56 px paragraph, §1.3) |
| Mechanic | No pin. Words scrub 18% to 100% ink as you scroll: `start: "top 80%"`, `end: "bottom 45%"`, `scrub: true`; CSS `animation-timeline: view()` first, GSAP fallback |
| Mobile | 28 px, same scrub (cheap) |
| Launch fallback | Complete (type only) |

## F3 · The circle (how a lesson starts, talk time)
| | |
|---|---|
| Purpose | Show *how* it is taught: greeting first, every child speaks, small group (S3, S5 "more talk time") |
| Emotion | "My child would get a turn here" |
| Copy | H2 VI **"Bạn nào cũng được *nói*."** / EN **"Everyone gets a *turn*."** Beats: 1 "Hello!" 2 "Each child says how they are." 3 "Then we learn, and everyone keeps talking." Support line: "In a small group every child has more time to talk than in a big class." `[OWNER: group size; what the lesson does after the greeting; confirm "more time than a big class"]` |
| Layout | Desktop: a table seen from above, six seats around it, drawn as flat shapes in `--mood`/ink; beats as large numerals left. Mobile: a vertical stack of the three beats, the table above as a smaller figure |
| Mechanic | **Desktop pin 300 vh**, `scrub: 1`: 0-25% beat 1 (teacher's bubble "Hello!" scales in, stays small), 25-80% beat 2 (six child bubbles appear one by one: "I am happy." "I am tired." "I am hungry." …, each bubble larger than the teacher's), 80-100% beat 3 (bubbles stay; text swaps). Bubble text in Fraunces. **Mobile:** no pin; IntersectionObserver plays the same sequence once in 2.4 s via CSS animation-delay |
| Launch fallback | Typographic bubbles on flat colour; photo #3 (backs of heads) optional as a band after the scene |
| Notes | No numbers (no "70% talk time"); the picture does the claiming |

## F4 · The ladder, ages 5 to 17 (the programmes)
| | |
|---|---|
| Purpose | What the two programmes are, who they are for, what a sentence sounds like at each age; price is the same |
| Emotion | "There is a place for my child" |
| Copy | H2 VI **"Từ 5 đến 17 tuổi. Mỗi lần *một câu*."** / EN **"From 5 to 17. One sentence at a time."** Stops (age numeral at `display-xl`, example sentence, label): **5** "I can read: cat, hat, sit." · **7** "I like to read books with my mum." · **10** "Yesterday I went to the park and saw a big dog." · **13** "I think English is useful because I can talk to more people." · **16** "If I could travel anywhere, I would go to Japan." Caption: VI "Ví dụ một câu ở từng độ tuổi, không phải lời hứa." / EN "Examples of how a sentence can sound at each age. Not a promise." Programme cards after the track: **Young Learners 5-10 · Thiếu nhi** and **Teens 11-17 · Thiếu niên**, each with two lines of plain description `[OWNER: what you teach at each stage, to replace the example sentences if they do not match your classes]`, "Same price for every child" and a link to the programme page |
| Layout | Full-bleed horizontal track, each stop ~90 vw wide, numeral huge on the left, sentence at `display-m` on the right; the field colour steps through the six moods; at the 10 to 13 boundary the label changes from Young Learners to Teens |
| Mechanic | **Desktop pin 400 vh**, horizontal translate `xPercent: -(n-1)*100`, `scrub: 0.8`, `snap` to stops (duration 0.3, `ease: power1.inOut`); progress ticks bottom. **Mobile:** native horizontal scroll-snap swipe deck, 85 vw cards with the next one peeking (Duck pinned horizontal cards, Namaha tiles, §1.3), no pin |
| Launch fallback | Complete (type + colour) |

## F5 · Proof: first words, then reading
| | |
|---|---|
| Purpose | Prove it works without promising it (S4, S6) |
| Emotion | Trust, a little pride |
| Copy | H2 VI **"Năm tuổi, đã đọc được những từ đầu tiên."** / EN **"At five, reading real words."** Story (EN): "One of Bek's students began at 5. Today they read basic words, speak correct English that mostly sounds natural, and love learning. It is one child's result, not a promise: every child moves at their own speed." VI: "Một bạn học trò của thầy bắt đầu học từ năm tuổi. Hôm nay bạn đọc được những từ cơ bản, nói tiếng Anh đúng và khá tự nhiên, và rất thích học. Đây là kết quả của một bạn, không phải lời hứa: mỗi bé tiến bộ theo nhịp của riêng mình." `[OWNER: how long they studied; consent to tell it]`. Then 3 anonymised parent quotes (existing quotes, attributed by role and context only, e.g. "Parent of a 7-year-old, Phú Nhuận"; no names or initials, Q7) |
| Layout | Left 5 columns the story at `body-l` on `paper`; right 7 columns the **reading underline**: "cat · hat · sit" at `display-xl`, an underline moving word by word, then a short sentence; with shot #2 (hands under words) replacing it later. Quotes below as three rows with hairlines, each quote at `display-m` |
| Mechanic | No pin. Underline `scrub` over 120 vh tied to scroll; quotes reveal by line mask on enter |
| Mobile | Story first, underline strip 100 vw, quotes as a swipe deck |
| Launch fallback | Complete (type only) |
| Notes | Do not use "guarantee", "fluent", band scores, or before/after claims |

## F6 · Why families choose Bek
| | |
|---|---|
| Purpose | Differentiate from centres (S5) in four short reasons |
| Emotion | Conviction |
| Copy | H2 VI **"Vì sao ba mẹ chọn thầy Bek"** / EN **"Why families choose Bek"**. Reasons (title + one line): 1 **Families ask for Bek.** "Most new children come because another parent asked for him." `[OWNER: confirm wording]` · 2 **A fair price.** "The same price for every child, and cheaper than a centre. Bek shows you the exact figure after one short form." (no figure on the public page) `[OWNER: confirm the comparison you want to stand behind]` · 3 **A home, not a hall.** "Small, warm, and not rushed." · 4 **More time to talk.** "Every child speaks every lesson." (existing claim, `[CONFIRM]`) Credentials line: "TESOL · PGCE · DELTA" `[OWNER: only if you want them named; documents are not published]` |
| Layout | Sticky left title, right a list of four giant numerals (1-4) with the reason beside; hairline rules; on hover the numeral takes the `--mood` field |
| Mechanic | Reveal on enter, 80 ms stagger; no pin |
| Mobile | Stacked list, numeral above reason |
| Launch fallback | Complete |

## F7 · The room
| | |
|---|---|
| Purpose | Remove the "is it safe/where" worry; show home warmth |
| Emotion | Reassurance |
| Copy | H2 VI **"Một lớp học như ở nhà."** / EN **"A classroom that feels like home."** Address: Golden Mansion 1, 119 Phổ Quang, Phú Nhuận (Q11: public and permanent). Static map image with "Open in Google Maps" (no tile watermark) |
| Layout | Photo collage (shots 4-7) at offset widths 35-70 % alternating left/right (Lando's collage, §1.3) with dated captions; map card at the end |
| Mechanic | Parallax at 3 speeds (y -4%/-8%/-12%), clip-path reveal on enter |
| Mobile | Single column, 2-3 photos |
| Launch fallback | **Without photos:** the section shows the address as `display-l` type on a `--mood` field with the map card; no placeholders. Photos swap in on the day they exist |

## F8 · The offer: the free week (the price is revealed after the form)
| | |
|---|---|
| Purpose | Convert; the free week is the public hook; the price is the reward for sharing who is coming (an invitation, not a paywall) |
| Emotion | Easy |
| Copy | H2 VI **"Tuần đầu *miễn phí*."** / EN **"The first week is *free*."** Two nodes on a line: **Week 1: free** (drawn solid) → **After that: your personal price sheet** (dotted, continues down into F10). Sub VI "Cho thầy biết ai sẽ đến lớp, ba mẹ sẽ thấy học phí ngay trên màn hình. Ba câu hỏi, chưa đến một phút." / EN "Tell Bek who is coming and you'll see the fees right here on screen. Three questions, under a minute." Schedule line: "Weekdays: the same time every day (19:30-21:00 today). Weekends: 14:00-20:00." `[OWNER: times for children aged 5-6; what happens in the free week]`. CTA: "Start the free week and see the fees". Secondary: "Prefer to ask? Message Bek on Zalo" (Bek answers with the same sheet). **No price figure anywhere in this frame or the page HTML.** |
| Layout | A single 12-column line with "Week 1 free" at `display-xl` (breaks the grid on purpose, §3.6); the dotted continuation points down to the form |
| Mechanic | SVG stroke draws node 1 scrubbed `start: "top 70%"`, `end: "+=40%"`; the dotted line then scrubs on into F10, where it completes when the answer is revealed. **No count-up** (cheap tell) |
| Mobile | Vertical timeline, nodes stacked, CTA full-width |
| Launch fallback | Complete |

**What is behind the form (the gate, designed as an invitation):** the **price** and the personal **class sheet**. After F10 the parent sees, on screen and on Zalo, an answer for their child's age band: *Week 1: free · Month 1: 1,990,000 VND (1,000,000 off) · then 2,990,000 VND/month, the same for every child*, plus the schedule for that age, start dates for the free week, the room map and how to start. It reads as "here is your answer", never as "unlocked". Always visible beside the form: "Prefer to ask? Message Bek on Zalo", which gets the same sheet. Honest framing: the figure is one short form away.

## F9 · Questions parents ask
| | |
|---|---|
| Purpose | Remove last objections |
| Copy | 8 questions in parent language, 2-4 sentence answers (rewrite `docs/phase-1/copy/faq.md` for v3 in P1.3b). Samples: VI "Con 5 tuổi chưa biết chữ có học được không?" / EN "My child is 5 and doesn't know letters yet. Can they join?" · "Con nhút nhát, không dám nói thì sao?" / "What if my child is shy?" · "Tuần học thử gồm những gì?" / "What happens in the free week?" · "Học ở đâu, giờ nào?" / "Where and when?" `[OWNER supplies the real answers]` |
| Layout | Accordion rows, 20 px questions, sentence case; the plus turns into a minus |
| Mechanic | `interpolate-size` / GSAP height; no pin |
| Mobile | Same |
| Notes | Visible text only; no FAQPage markup (§6.2) |

## F10 · See you in class (the lead form as the next turn)
| | |
|---|---|
| Purpose | Capture the lead without friction; an invitation, not a paywall |
| Emotion | Momentum, warmth |
| Layout | Full `--mood` field (the visitor's own colour). Desktop: form 7 columns on the right, the greeting echo on the left (`display-xl` "See you in class."). Mobile: full-screen bottom sheet when opened from the sticky bar, inline here |
| Steps (3, progress as three dots; each step is one screen, one question, 48-56 px chips) | 1 **"Hello! Who is coming to class?"** chips: 5-6 · 7-8 · 9-10 · 11-13 · 14-17 (+ "another child") 2 **"How is English for them today?"** chips: Just starting · Knows some, shy to speak · Speaks, wants more · Needs help with school English (+ optional note) 3 **"Where should Bek say hello back?"** parent's name · Zalo or phone · best time to message · optional start day (chips Mon-Sun) · **unticked** consent with the plain-language notice · invisible Turnstile. Button: "Start the free week" (never looks disabled; shows what's missing) |
| Copy | VI step titles: "Xin chào! Ai sẽ đến lớp?" · "Hôm nay tiếng Anh của con thế nào?" · "Thầy nhắn lại cho ba mẹ ở đâu?" Always visible: "Prefer to chat? Message on Zalo" |
| Confirmation (instant, on the same screen, no email) | Field collapses; headline "Thank you! I'm happy." in the visitor's mood colour; **the price reveal** (the dotted line from F8 completes and draws the nodes in 900 ms: Week 1 free · Month 1: 1,990,000 VND · then 2,990,000 VND/month; no count-up); Bek's line "I'll message you on Zalo [OWNER: within how many hours]"; the class sheet (schedule for their age band, the room map, "what to bring" `[OWNER]`); the speaker "See you soon!". The figures arrive in the `/api/lead` response and are rendered client-side; they are not in the page HTML |
| Child data | Age band only. **No child name, no photo, no school.** |

## F11 · Footer: goodbye
| | |
|---|---|
| Purpose | Close the conversation; navigation and legal |
| Copy | Giant "See you soon!" (`display-xl`, in the visitor's mood) · address, phone **+84 353 88 5757**, Zalo, language switch VI/EN, Privacy, Terms |
| Mechanic | Bek's handwritten "See you soon!" SVG draws on enter (optional asset) |
| Mobile | Stacked; phone is a 56 px `tel:` button |

## 4.1 Persistent UI
- **Header:** wordmark "Teacher Bek" (left), mood chip, VI/EN switch, Menu. On mobile: wordmark + chip + menu (48 px buttons). Header never overlaps focused inputs (WCAG 2.4.11).
- **Sticky bottom bar (mobile, after the first scroll):** left "Zalo" icon+label, right "Start the free week" pill. Replaces the old floating Zalo bubble; hides while an input is focused and on the form sheet; 64 px + safe-area.
- **Menu:** full-screen sheet with the same mood field; links in `display-l`; close button top-right 48x48 and Escape; focus trap (already fixed in Phase 0).

## 4.2 Pages
| Page | Experience |
|---|---|
| `/vi/` `/en/` Home | F0-F11 |
| `/vi/lop-hoc/thieu-nhi` · `/en/classes/young-learners` (5-10) | Hero = the age numeral "5-10" at `display-xl` morphing in from the home card (view transition); one sentence per age with audio; what a lesson looks like (greeting, turn, learn); schedule line; 3 FAQs; form prefilled for 5-6/7-8/9-10 |
| `/vi/lop-hoc/thieu-nien` · `/en/classes/teens` (11-17) | Same template, `display-xl` "11-17", sample sentences for 13 and 16; teen-friendly copy (no "bé") |
| `/vi/gioi-thieu` · `/en/about` (optional, Phase 2b) | Not a story page (S7): Bek's method in his words, credentials as text, the room; skip if copy is thin |
| `/…/welcome` | Thank-you, **price reveal** and class sheet after F10 (noindex, not in sitemap; the figures are served only with a valid lead token, not in static HTML); reachable from the Zalo message too; contains the audio goodbye |
| `/…/privacy` · `/…/terms` | Plain-language, per shipped locale, >= 300 words each (§2.3 #4) |
| 404 | "Hello! This page isn't in class today. How are you?" with the six words **plus "lost"**; tapping any word shows "Okay. Let's go home." and the home button turns the page into that mood |
| Empty / error states | Form error: inline, under the field, human sentence, `aria-live="polite"`; all channels down: "Something went wrong. Message Bek on Zalo" with the Zalo link; offline: "No signal. Call +84 353 88 5757" |

**Removed from v1:** `/blog`, `/guides`, `/community`, ZH/RU, IELTS and English-for-Work pages (301 to home or the matching programme).

## 4.3 Page transitions
Native cross-document View Transitions only (`@view-transition { navigation: auto; }` in CSS): 500 ms mood sheet wipe + 250 ms fade, header and chip persistent, the programme age numeral shared between card and page. Unsupported browsers: instant navigation. No JS router, no Swup, no Barba. Reduced motion: 150 ms cross-fade.

---

# 5. STACK AND PERFORMANCE (Step 5; versions checked 2026-10-22, `v3/E/report.md`)

## 5.1 Decision: Astro on Cloudflare, not Next

| Question | Decision and reason |
|---|---|
| Stay on Next.js 15.5 / Vercel or rebuild? | **Rebuild the front end in Astro 7.4.2; keep the lead code.** The new site is almost entirely static content plus three small pieces of JS (the greeting, the scenes, the form). Next ships a React runtime (>= 100 KB) for pages that need none of it; the budget in §5.2 (<= 10 KB JS before LCP) is not realistic on Next + next-intl + three animation libraries (§2.2). Vercel Hobby is non-commercial; Pro is $20/month. Cloudflare Workers is free for this traffic and has Ho Chi Minh City / Hanoi points of presence (Cloudflare blog, "ten-new-data-centers"). |
| What is reused? | `lib/leads/{sheet,submit,telegram,types}.ts` and `lib/telegram/*` are `fetch`-based (Google Sheet via webhook URL + secret, Telegram Bot API) and port with small edits: swap `NextRequest/NextResponse` for `Request/Response` in `guard.ts` and the route handlers; replace the in-memory `rateLimit` (does not survive Workers) with Cloudflare's rate-limiting binding or a KV counter; keep `zod` server-side. Env vars: `LEADS_SHEET_WEBHOOK_URL`, `LEADS_SHEET_SECRET`, Telegram token/admin ids, Turnstile secret. |
| Risk of rebuild | Medium (2-3 weeks); mitigated because the content is small, the lead pipeline is not rewritten, and the old site stays live until the Phase 3 DNS switch. If the owner prefers zero migration risk: stay on Next 15.5, drop framer-motion, split-type and the unused 17 components, accept LCP ~2 s (not recommended; costs Usability points). |

## 5.2 Stack table

| Layer | Pick (exact version) | Why | Browser cost (gz) | One alternative |
|---|---|---|---|---|
| Framework | **Astro 7.4.2** (static, i18n routing `vi` default, `en`) | HTML first, JS only where used; native i18n | ~0 KB | Next.js 16.4.2 + next-intl 4.14.9 |
| Host | **@astrojs/cloudflare 14.4.2** on Workers (static assets + 3 functions: `/api/lead`, `/api/telegram`, `/api/settings`) | Free, commercial OK, fast in VN | server | Vercel Pro ($20/mo) |
| CSS | **Tailwind CSS 4.3.3** via `@tailwindcss/vite` + CSS variables for tokens | Zero runtime | 0 KB | Plain CSS |
| Interactive islands | **Preact 11.0.1** + **@astrojs/preact 6.1.0**, only for the form and the mood chooser state | Smallest React-shaped runtime | ~4-5 KB | Vanilla TS custom elements (no runtime) |
| Animation | **GSAP 3.15.0**: core 27.35 KB + ScrollTrigger + SplitText + Flip (all in the public npm package; "no charge" licence, not MIT) | Industry standard, same stack the winners use (§1) | ~55 KB total, **loaded after LCP via `requestIdleCallback`** | CSS `animation-timeline` (scroll-driven, ~88% support) + WAAPI hand-rolled Flip |
| Smooth scroll | **Lenis 1.3.27**, fine-pointer desktop only | Lando-grade feel | 5.46 KB | Native scroll |
| Page transitions | **Native View Transitions** (cross-document; Chrome 126+, Safari 18.2+, ~89%) | 0 KB, no router | 0 KB | Swup 4.10.0 (+9 KB) or @unseenco/taxi 2.0.0 |
| 3D / shaders / Rive | **None** (§3.10) | Idea is type + colour + voice | 0 | three 0.186.1 (184.9 KB), Rive 2.45.0 |
| Audio | `HTMLAudioElement`, Opus/m4a, lazy | No library | 0 KB | Howler (stale) |
| Validation | **Valibot 1.5.0** client, **zod 4.6.7** kept server-side (existing) | Tree-shaken ~3 KB client | ~3 KB | Zod client (larger) |
| Spam | **Cloudflare Turnstile** (managed/invisible), loaded when the form is first focused | Free, unlimited | loaded on demand | hCaptcha |
| Lead store | **Google Sheet** (Apps Script webhook, existing) + **Telegram** (existing); no D1, no email | Owner's decision; zero new accounts | server | Airtable |
| Settings (price, schedule, status) | **Cloudflare KV** `settings` key, edited by the owner via the existing Telegram bot (`/set price 2990000`). Price keys are returned **only** inside the `/api/lead` response; the public `/api/settings` (schedule, status, free-week on/off) never contains them | Owner changes a number in 10 s, no developer, no CMS | 0 KB (`/api/settings` ~300 B, cached 5 min) | Keystatic 0.6.9 (dropped: 0 h/month) |
| Analytics | **Cloudflare Web Analytics** (cookieless) + **GA4 with Consent Mode v2**, only after consent | Funnel with privacy | ~1 KB; GA after consent | Plausible (paid) |
| Field perf | **web-vitals 6.2.3** (3.3 KB) to GA4 after consent / CF | Field LCP/INP/CLS | 3.3 KB | Vercel Speed Insights |
| Images | Astro `<Picture>` + **sharp 0.35.5** at build, AVIF/WebP | Exact `srcset` | 0 | Cloudflare Images |
| Sitemap/SEO | **@astrojs/sitemap 3.7.4**; hand-written `<head>`; `schema-dts 2.1.0` (types only) | Full control | 0 | astro-seo 1.2.0 |

Dropped on purpose: framer-motion/`motion`, split-type, Barba, Howler (stale), ogl, three.js, Keystatic, Cal.com (booking is done on Zalo, §7), D1, Resend.

## 5.3 Hard budgets (enforced in CI; mobile = Slow 4G + 4x CPU lab, field = p75)

| Metric | Budget | Today |
|---|---|---|
| LCP | **<= 1.8 s lab / <= 2.5 s field** (LCP element = the h1 text) | 2.6-3.8 s |
| INP | **<= 200 ms field** (target 150 ms; lab TBT <= 150 ms) | unmeasured |
| CLS | **<= 0.05** (target ~0) | 0 |
| JS before LCP | **<= 10 KB** gz (inline hero script ~2 KB, tier detect < 1 KB, View Transition CSS) | ~272 KB |
| JS total home | **<= 110 KB** gz (GSAP set ~55, Lenis 5.5 desktop only, Preact form ~5, hero ~3, web-vitals 3.3, rest) | — |
| Fonts | **<= 200 KB** total (Fraunces roman + italic + Be Vietnam Pro 400/600), 4 files | 40-43 files |
| First view | **<= 450 KB** excluding video; **<= 25 requests** | 600-780 KB / 70-74 |
| Full scroll | <= 2.5 MB with photos; video loops <= 1.2 MB each, tier Full on Wi-Fi only | — |
| Audio | 0 KB until the first speaker interaction; <= 120 KB in total | — |
| Frame rate | **60 fps scroll and signature animation on a mid-range Android** (<= 4 GB RAM, Chrome 120+); no long task > 50 ms during scroll | — |
| Lighthouse (mobile, PSI) | Perf >= 95 · A11y 100 · BP 100 · SEO 100 | not measured |
| Awwwards Mobile Excellence | **>= 80/100** (stated minimum 70-75, unverified, §1.6) | — |

**Techniques:** h1 text painted from HTML; hero script inlined; everything animated is `transform`/`opacity`/`clip-path`, with `will-change` only during the animation; the six colour fields are CSS variables on `<html>` (one repaint, no JS per frame); GSAP and Lenis loaded on idle; islands `client:visible`; images AVIF with exact `sizes`; Turnstile loaded on first form focus; no third-party script before consent; fonts subset and one preload.

**Tiers (decided once at boot, stored on `<html data-tier>`).**
| Tier | Condition | Experience |
|---|---|---|
| **Full** | fine pointer, no reduced motion, no Save-Data, `hardwareConcurrency >= 6` | Lenis, cursor, pinned F3/F4, axis animation, video loops |
| **Touch** (default mobile) | coarse pointer or 4-5 cores | Native scroll, signature with WAAPI Flip + CSS flood, swipe decks, no pins, no video autoplay |
| **Lite** | `prefers-reduced-motion`, Save-Data, <= 4 cores or `deviceMemory <= 2` | Final states, no GSAP loaded at all, instant colour change, no video, same content |

**Reduced-motion version (WCAG 2.3.3):** the greeting still works (tap, word, colour in 150 ms cross-fade); scenes F3/F4 render as static stacked content; no loader; no cursor; audio still user-started.

## 5.4 Testing devices

Real low-end Android (<= 4 GB RAM, Chrome), mid iPhone (Safari), iPad, **Zalo in-app browser** and **Facebook in-app browser** (where most Vietnamese parents open links; Web Audio/Autoplay/View Transitions differ there), desktop Chrome/Safari/Firefox. The signature must work in the in-app browsers or degrade to the Lite behaviour.

---

# 6. LEAD CAPTURE, SEO, AI SEARCH (Step 6)

## 6.1 Lead capture

| Item | Decision |
|---|---|
| Form | The 3-step conversation F10 (age band · how English is today · where to reach). Same markup in the inline form, the sticky-bar sheet, and the programme pages (prefilled). |
| Spam | Honeypot (fixed), time trap, Cloudflare Turnstile (managed), origin check, rate limit (CF binding). Already built in `lib/leads/guard.ts`; port per §5.1. |
| Where leads go | `POST /api/lead` → validate → **Google Sheet row** (source of truth; consent text version, locale, UTM, mood picked optional) → **Telegram card** to the owner (existing bot with status buttons, `/leads`, `/stats`). Never reports success unless at least one channel stored it; if both fail: 503 and the Zalo fallback is shown. No email (Q5/Q6), no WhatsApp (Q15). |
| Instant confirmation and price reveal | On-screen (F10 confirmation, `/welcome?t=token`): the **personalised answer with the price** (1,990,000 VND first month after the free week, then 2,990,000 VND/month), class sheet, "I'll message you on Zalo", and a `zalo.me` deep link. Bek sends the same text on Zalo to parents who message first. Price lives in KV and the lead response only. |
| Follow-up | Manual, on Zalo: first message within `[OWNER: reply time]` → day 1 class sheet and start day → day 3 one parent quote → day 7 "your free week starts [day], still want it?" → stop. Lead status lives in the Telegram bot buttons (new → contacted → trial booked → enrolled / lost). |
| Events (GA4, after consent; ★ = key event) | `greeting_pick` (mood), `greeting_audio_play`, `ladder_stop` (age), `form_open` (source), `form_step` (1-3), `form_error` (field), `generate_lead` ★ (age band, locale), `price_reveal_view`, `zalo_click` (location), `phone_click`, `language_switch`, `faq_open`, `scroll_depth` (25/50/75). Cloudflare Web Analytics for the cookieless baseline. |

## 6.2 SEO and AI search (short; the owner has 0 h/month for content)

- **Locales:** `/vi/` default (`x-default`), `/en/`. 301 all old URLs; ZH/RU/blog/community 301 to home. hreflang emitted only for translated pages.
- **Metadata (title <= 60, description <= 155):** Home VI "Lớp tiếng Anh cho bé 5-17 tuổi ở Phú Nhuận | Teacher Bek"; Young Learners VI "Tiếng Anh cho bé 5-10 tuổi ở Phú Nhuận | Teacher Bek"; Teens VI "Tiếng Anh cho thiếu niên 11-17 tuổi | Teacher Bek"; EN "English Classes for Kids and Teens in Phu Nhuan | Teacher Bek". OG image per locale: the "I am happy." sentence in the mood colour.
- **Schema (one `@graph`, stable ids):** `EducationalOrganization` + `LocalBusiness` (address, geo, hours, `telephone`, `areaServed` Wikidata Q1854), `Person` (Bek, verified credentials only), `Course` ×2 (Young Learners 5-10, Teens 11-17) with `hasCourseInstance` and **no `offers` and no price anywhere in JSON-LD** (the price is gated; the live site currently exposes it in JSON-LD, which must be removed, task P2b.8b), `BreadcrumbList`. **No FAQPage** (no rich results since 2026-05-07) and **no self-serving AggregateRating** (ineligible; Google review-snippet docs). Only Google-documented fields (§2.3 #1).
- **Entity signals:** identical NAP everywhere, Google Business Profile (English language school; real photos from the shoot; reviews requested from happy parents without incentives), Facebook/Zalo links both ways.
- **AI search:** a "Fast facts" block on home and programmes (who, ages, group size [OWNER], schedule, area, the free week, how to start; **no price**) as real text; all AI crawlers allowed (robots.txt); `llms.txt` rewritten with real URLs and the facts (low priority, not used by major engines per Google).
- **No content cluster**: no blog, no guides.

---

# 7. WHAT THE OWNER DID NOT THINK OF (Step 7)

| Item | Decision |
|---|---|
| **Testimonials and video proof, given anonymity** | Text quotes attributed by role + context ("Parent of a 7-year-old, Phú Nhuận"). Video proof without faces: 15-30 s clips of **hands and audio** (a parent's voice-over, a child reading with the camera on the page), each with written consent to use the voice. No fake "student of the month". Unreliable stats are not used. |
| **Booking** | No calendar tool: Bek confirms the free week on Zalo (he already does). The form's optional "start day" chips give the parent control. Cal.com dropped (owner is reachable on Zalo; fewer accounts). |
| **Languages** | VI + EN. VI is written first and reviewed by the owner. ZH/RU deferred (routes 301). The English greeting is the same in both locales. |
| **Legal** | Privacy and terms in VI + EN, plain language, >= 300 words; PDPL (Law 91/2025/QH15, Decree 356/2025, in force 2026-01-01 per §2.2, **confirm with a Vietnamese lawyer**): parental consent for children's data, **collect no child name/photo/school**, consent text stored with each lead, retention period (propose 24 months), processors list (Google, Telegram, Cloudflare), data-request contact. Photos/videos of children only with written consent from a parent (signed form, kept by the owner). |
| **Cookie consent** | Small bottom banner (not a wall, not over the hero fold on first paint): "Essential only / Accept analytics". GA4 blocked until accepted; Cloudflare analytics needs none. |
| **404 and empty states** | Designed (§4.2): the "I am lost." 404, form failure to Zalo, offline with phone number. |
| **Accessibility (WCAG 2.2 AA)** | The six words are a `radiogroup`-style group of buttons with visible names, `aria-live="polite"` announces "You said: happy"; Bek's reply is real text; speaker buttons are labelled "Hear the word happy"; colour is never the only signal (the word is shown); focus visible; target size >= 48 px; sticky bar never covers focused fields (2.4.11); motion off honours `prefers-reduced-motion`; audio never autoplays; contrast verified in CI (existing `design/qa/contrast.mjs`). |
| **Monitoring** | Uptime check on home + `/api/lead`; a daily synthetic test lead flagged `test=true` (Sheet row marked, Telegram silent); alert to the owner's Telegram if it fails; Cloudflare Web Analytics for traffic. |
| **Backups and ownership** | Sheet is the lead store (Google's history); monthly CSV copy by the owner; git is the content backup. Domain, Cloudflare, Google account, Telegram bot, GA, GBP, Search Console under the owner's login with 2FA; a one-page "keys & accounts" note. |
| **Running cost** | $0-2/month (see §8.4). |
| **Updating without a developer (0 h/month budget)** | The owner changes **only** the price figures (revealed after the form), "free week on/off", schedule text, and "enrolling now / waitlist" by messaging the existing Telegram bot (`/set key value` → KV → `/api/settings`, shown on the site within 5 minutes; the built page already contains the defaults so nothing shifts). Testimonials, FAQ text and photos change quarterly via the developer (git) if ever. |
| **Launch push** | Message current families on Zalo, post on the Google Business Profile, a QR poster at the classroom door. |
| **Awwwards submission** | After 2-4 weeks of stable data, with a short case-study page; fee ~$65 (unverified, check at submission). |

---

# 8. EXECUTION (Step 8)

## 8.1 Phased build

> Rules: branch per phase; never break the live lead flow; each phase ends with acceptance met on a preview URL; the Lite tier must always work. **Models:** default Haiku; Sonnet for design judgment, multi-file architecture, debugging; **Owner** for anything only the owner can do. A Sonnet reviewer pass closes every phase. Opus is not used.

### Phase 0 — Fix the live site · **DONE** (commit `bd33133`, 2026-10)
Mobile menu closable; single h1; map replaced by address card; `llms.txt` rewritten; sitemap trimmed; lead pipeline rebuilt (Google Sheet + Telegram, honeypot, Turnstile option). **In progress (another agent, 2026-10-22):** the live Next site is being updated to the new scope (adult programmes removed, ages 5-17, price 2,990,000/1,990,000, WhatsApp and blog/community removed). Not part of this plan's build. **Open item for that agent:** the live site's JSON-LD exposes the price; remove it there too (the price is gated).
- Still open from Phase 0: confirm env vars live (Sheet, Telegram, Turnstile) (Owner, Haiku prepares checklist); fresh Semrush crawl (Haiku).

### Phase 1 — Content and assets · **PARTLY DONE**
| Step | Task | Model | Status / acceptance |
|---|---|---|---|
| P1.1 | Owner answers Q1-Q15 and S1-S8 | Owner | **Done 2026-10-22** (S8 not answered) |
| P1.2 | Copy deck v1 (Red Pen) | Sonnet | Done; **obsolete** (archive) |
| P1.2b | **Rewrite copy deck for v3** from §3-§4: VI master + EN, every string with ID, max length, flag; no adult programmes, ages 5-17 | Sonnet | Accept: every F0-F11 string present, VI reviewed by owner, no `[CONFIRM]` left on facts that are shown |
| P1.3 | Mistake library, FAQ drafts v1 | Sonnet | Done; mistake library **not used** in v3; FAQ to be redone in P1.3b |
| P1.3b | Rewrite FAQ for v3 (8 questions in §4 F9) | Sonnet | Accept: owner answers each factual item |
| P1.4 | **Record voice** (greeting, 6 words, goodbye) following Haiku's script and checklist | Owner | Accept: 8 clips, quiet room, 48 kHz WAV, 3 takes each |
| P1.5 | Shoot photos and videos per §3.5 with consent forms (VI template, kit exists from `f00e6d4`) | Owner | Accept: >= 12 usable photos; videos optional (**not a launch blocker**) |
| P1.6 | Convert audio to Opus/m4a; select, grade and export images to AVIF/WebP | Haiku | Accept: audio <= 120 KB total; hero poster <= 60 KB |
| P1.7 | Handwriting: owner writes "See you soon!", "Me too!" and a signature ×3 (**optional**), vectorise to SVG | Owner → Haiku | Accept: 3 SVGs < 5 KB each, or skipped |
| P1.8 | Collect anonymised testimonials with consent | Owner (Haiku prepares Zalo script + consent form) | Accept: >= 3 quotes (role + context) |
| P1.9 | Tell the 5-year-old story: owner's facts (how long studied, consent) | Owner | Accept: three facts + written parent consent |
| P1.10 | Reviewer pass: content vs Q/S answers | Sonnet | Accept: every number, claim, credential traceable |

### Phase 2a — Design v2 and prototypes · **NOT STARTED** (v1 Red Pen rejected)
| Step | Task | Model | Acceptance |
|---|---|---|---|
| P2a.1 | Tokens (§3.3-3.7) as CSS variables; subset Fraunces and measure bytes; VI diacritic test | Sonnet | Fonts <= 200 KB; test string renders without clipping at every size |
| P2a.2 | Contrast check of every token pair (reuse `design/qa/contrast.mjs`) | Haiku | All text pairs >= 4.5:1 |
| P2a.3 | **Signature prototype** (hero, six words, flood, reply, chip) on a single HTML page | Sonnet | 60 fps on a low-end Android; works in Zalo/Facebook in-app browsers; no-JS and reduced-motion versions |
| P2a.4 | Hi-fi mobile 390 then desktop 1440 for F0-F11 + programme page + welcome + 404 | Sonnet | Owner approves; no placeholder tags; each frame complete without photos |
| P2a.5 | Scene prototypes: F3 circle, F4 ladder (pin + snap), F8 price line | Sonnet | 60 fps; pin lengths as §4 |
| P2a.6 | Run prototypes on devices, report | Haiku (Owner supplies devices) | Report with fps traces |
| P2a.7 | **Owner approves design** | Owner | Written yes |
| P2a.8 | Reviewer pass | Sonnet | Matches this document |

### Phase 2b — Build · **NOT STARTED**
| Step | Task | Model | Acceptance |
|---|---|---|---|
| P2b.1 | Scaffold Astro 7.4.2 + Tailwind 4.3.3 + Cloudflare 14.4.2 + Preact + sitemap; i18n | Haiku | Builds; `vi` default |
| P2b.2 | Tier detect + token CSS + fonts | Sonnet | CLS <= 0.05 |
| P2b.3 | Static sections F0-F11, one `h1`, VI + EN | Sonnet | No duplicated DOM; text/HTML >= 10% |
| P2b.4 | Hero island (inline script, WAAPI Flip, flood, audio) | Sonnet | Signature matches §3.9 timings |
| P2b.5 | Motion layer: GSAP 3.15.0 lazy (+ScrollTrigger, SplitText, Flip), Lenis on Full tier, View Transitions | Sonnet | F2 scrub, F3 and F4 pins per §4 |
| P2b.6 | Form island (Preact, Valibot), Turnstile on focus, `/welcome` | Sonnet | 3 steps, errors accessible |
| P2b.7 | Port `lib/leads` and `lib/telegram` to Workers (`/api/lead`, `/api/telegram`, `/api/settings`, `/set` command, KV) | Sonnet | Test lead lands in Sheet + Telegram; both down → 503 + Zalo fallback |
| P2b.8 | SEO: head, hreflang, sitemap, robots, OG images, 301 map, JSON-LD whitelist | Haiku | Rich Results Test valid; no unlisted fields |
| P2b.8b | **Remove the price from every public surface** (the live site exposes it in JSON-LD): no figure in static HTML, JSON-LD (`Course.offers`), `llms.txt`, meta/OG, sitemap, FAQ text; price served only via the `/api/lead` response and `/welcome?t=token`; CI greps `dist/` for `2.990.000`, `2,990,000`, `2990000`, `1.990.000`, `1,990,000`, `1990000` | Haiku | Zero matches in `dist/` and rendered HTML of all pages; reveal still works end to end |
| P2b.9 | Legal pages VI + EN | Sonnet | >= 300 words each |
| P2b.10 | Lawyer review of notice and consent | Owner | Signed off |
| P2b.11 | Consent banner + GA4 Consent Mode v2; events §6.1 | Sonnet / Haiku | No GA request before consent |
| P2b.12 | CI: astro check, lint, Lighthouse CI with §5.3 budgets, axe, link check, title length, text ratio | Haiku | Fails on regression |
| P2b.13 | Enter approved content | Haiku | Matches deck |
| P2b.14 | Debug performance until budgets pass | Sonnet | §5.3 green |
| P2b.15 | Reviewer pass | Sonnet | Diff vs this document |

### Phase 3 — Launch · **NOT STARTED**
| Step | Task | Model | Acceptance |
|---|---|---|---|
| P3.1 | DNS to Cloudflare | Owner (Haiku writes the runbook) | Site live |
| P3.2 | 301 map checked; HSTS | Haiku | No 404 from old sitemap |
| P3.3 | Search Console + Bing sitemap submit; GBP update | Owner (Haiku prepares) | Submitted |
| P3.4 | Synthetic lead monitor + uptime | Haiku | Alerts tested |
| P3.5 | Semrush crawl; design QA §8.2 | Haiku / Sonnet | Site Health >= 95%, 0 errors |
| P3.6 | First real lead stored + notified | Owner | Seen in Sheet and Telegram |

### Phase 4 — Polish and grow · **ONGOING**
| Step | Task | Model |
|---|---|---|
| P4.1 | Funnel report (visits → greeting → form → lead → enrolled) monthly | Haiku |
| P4.2 | Quarterly dependency + Lighthouse + Semrush | Haiku |
| P4.3 | Submit to Awwwards after 2-4 weeks of stable data | Owner (Sonnet writes the case study) |
| P4.4 | Optional: add video proof, Rive hand, ZH/RU if the owner commits time | Sonnet |

## 8.2 Design QA checklist
- [ ] **[Sonnet] Motion feel:** every animation uses the tokens in §3.7; no text visible half-faded > 300 ms; sequences <= 900 ms; the signature has no dropped frame on a low-end Android (Chrome Performance panel, no long task > 50 ms); reply copy reads naturally in both languages.
- [ ] **[Sonnet] Pixel fidelity:** build overlaid on designs at 390 and 1440 px; type ±1 px; VI headlines do not clip tone marks (lh >= 1.08); `text-wrap: balance`.
- [ ] **[Owner + Haiku] Real devices:** low-end Android, iPhone Safari, iPad, **Zalo and Facebook in-app browsers**; light + dark; VI/EN.
- [ ] **[Haiku] Mobile:** no horizontal scroll at 320/360/390/414; targets >= 48 px; sticky bar never covers focus; safe-area insets.
- [ ] **[Haiku] Lighthouse mobile:** Perf >= 95, A11y 100, BP 100, SEO 100 on home + both programme pages, both locales.
- [ ] **[Haiku] Throttled lab:** LCP <= 1.8 s, JS before LCP <= 10 KB, first view <= 450 KB.
- [ ] **[Haiku] Awwwards Mobile Excellence:** >= 80/100 on the same test used by Awwwards (re-verify the exact tool at submission, §1.6).
- [ ] **[Haiku] Form:** each locale; each step's errors; invalid phone; Turnstile failure; Sheet down (lead still in Telegram); both down (503 + Zalo link); duplicate submit; rate limit.
- [ ] **[Haiku] Tiers:** reduced motion = complete static content; Save-Data = no GSAP/video; keyboard-only can use the six words, ladder, accordion, sheet, menu.
- [ ] **[Haiku] Price gate:** no price figure in any public HTML, JSON-LD, `llms.txt`, OG or sitemap; the reveal appears after a test lead; **SEO:** Rich Results Test valid; hreflang validator clean; one h1; canonical and OG per locale.
- [ ] **[Haiku] Consent:** no GA request before acceptance; consent stored with each lead.
- [ ] **[Owner + Sonnet] Content truth:** every number, credential, quote and the 5-year-old story traceable to owner confirmation; no child names or faces without written consent.
- [ ] **[Sonnet] Final visual QA** of all pages vs approved designs.

## 8.3 Risks and trade-offs

| Risk | Mitigation |
|---|---|
| Award visuals vs speed | Type/colour/sound idea, no WebGL; GSAP after LCP; CI budgets; tiers. The heavy asset is the owner's own photos, optimised |
| Warm/rounded look reads as "kids' app" for Teens and parents | Fraunces at large scale and flat colour keep it editorial; Teens pages use smaller bubbles, no cartoon shapes; judged at Phase 2a with real VI copy |
| The greeting is judged "just a mood picker" | Execution: Bek's real voice, the reply copy, the header chip persistence, the 404/form echoes. If the prototype (P2a.3) does not delight in testing with 3 parents, change the reply copy before changing the idea |
| Sound fails in Zalo/Facebook in-app browsers | Sound is optional; buttons degrade to text; tested in P2a.3 |
| Owner supplies no voice/photos | Every frame has a complete typographic version (§4); voice and photos are upgrades, not dependencies |
| Vietnamese diacritics clipped in Fraunces at tight line-height | VI lh >= 1.08, tested with the specimen string |
| View Transitions unsupported (older Safari/Android WebView) | Instant navigation; no loss of content |
| Claims: "cheaper than a centre", "families ask for Bek", "more time to talk" are the owner's words | Flagged `[OWNER]` in the copy deck; shown only if the owner confirms; no competitor prices quoted |
| Gated price loses price-first parents (§2.1: they leave at paywall-style gates) | Gate framed as an invitation: 3 questions, under a minute, answer instantly on screen (no email, no verification); "Prefer to ask? Zalo" returns the same sheet; the free week and "cheaper than a centre" are public hooks; track `form_open` to `generate_lead` and A/B the pitch copy in Phase 4; the owner may later choose to show the figure if drop-off is high |
| Rebuild loses rankings | Same domain, 301 map, more indexable pages; old site live until DNS switch |
| PDPL interpretation | Lawyer review; no child name or photo collected |
| GSAP is "no charge" proprietary, not MIT | Acceptable; CSS/WAAPI fallbacks exist for every effect |
| Free-tier limits change (Cloudflare, Sheets, Telegram) | Monthly cost check; Sheet is portable |

## 8.4 Effort and running costs

| Phase | Design/dev | Owner |
|---|---|---|
| 0 Fix live site | done | 1 h left |
| 1 Content and assets | 2-3 days (copy v3, FAQ) | ~8-12 h incl. 1 h voice, 1 shoot afternoon, testimonials |
| 2a Design v2 and prototypes | 1.5-2 weeks | 3-4 h of reviews |
| 2b Build | 2.5-3 weeks | 2-3 h |
| 3 Launch | 2-3 days | 2 h |
| **Total** | **~6-8 weeks elapsed** | **~15-22 h** |

| Item | Monthly |
|---|---|
| Cloudflare Workers + KV + Turnstile + Web Analytics (free tiers) | $0 |
| Domain `.com` (~$10/yr, unverified third-party tracker) | ~$1 |
| Google Sheet, Telegram bot | $0 |
| Fonts (Fraunces, Be Vietnam Pro, OFL) | $0 |
| Zalo OA (optional, unverified) | $0-16 |
| **Total** | **~$1-2/month** (Vercel Pro alternative: $20) |
| One-off, owner to quote | Lawyer review of the privacy/consent text; Awwwards fee (~$65, unverified); optional photographer (not needed if the owner shoots) |

---

# 9. SELF-SCORING (final, detailed)

Scores are what a jury might give **after build**, assuming this plan is executed and the owner supplies the voice and photos. Weighted total = 0.40·D + 0.30·U + 0.20·C + 0.10·T.

| Criterion (weight) | Expected /10 | What earns points | What would lose points | Mitigation |
|---|---|---|---|---|
| **Design (40%)** | **7.8** | Giant soft-serif type with a real accent-word rule (§1.4: Lando, Namaha, Quaker); flat colour fields as the transition engine (Lando, Mana); the visitor's colour carried through the page; consistent grade on owner photos; calm space between loud frames; VI typography done right (rarely seen on award sites) | Weak phone photography; palette tipping into "kids' app"; Vietnamese clipping; rounded shapes overused; sections that feel templated | Photo spec + one LUT (§3.5); Phase 2a tests with Teens copy; VI test string; limit radius to buttons/cards; every frame has a distinct layout (no repeated card grid) |
| **Usability (30%)** | **8.0** | LCP = h1 text <= 1.8 s; CLS ~0; no content gate (only the price sits behind a 3-step, instant-answer form with a Zalo alternative); persistent but non-overlapping CTA; 48 px targets; the signature is skippable and optional; mobile composed separately; accessible (WCAG 2.2) | Jank on mid-range Android; audio/Flip failing in Zalo/Facebook browsers; a pinned scene trapping scroll; **the price gate or form friction reading as a paywall** | Hard CI budgets (§5.3); tiers; pins desktop only; in-app browser tests (§5.4); 3-step form with always-visible Zalo escape |
| **Creativity (20%)** | **7.6** | One idea (a lesson starting) expressed by the interaction itself, not added effects (§3.2); a signature moment (§3.9) with voice, colour, type-axis personality; the idea follows through to header chip, form, thank-you, 404 | Judges decide it is "a simple mood picker"; the idea fades after the hero | Reply copy and Bek's voice are the craft; echoes in 5 places; supporting moments F3/F4/F5 are variations, not new ideas; test with parents before building more |
| **Content (10%)** | **6.8** | Real voice (Bek's), real room, honest bounded proof (the 5-year-old), anonymised but real parent quotes, a clear free-week offer and process, no stock, no placeholders, no fake stats | Thin media at launch; owner declines voice/photos; unsubstantiated claims; copy in VI weaker than EN | Typographic version of every frame; owner decisions in §0 (voice, photos, claims); copy deck reviewed by the owner in VI; add shots after launch |
| **Weighted total** | | **7.72 / 10** | | Honorable Mention (>= 6.5) is likely; Site of the Day (reference SOTDs 7.5-8.25, §1.6) is possible if media quality is strong; **no award is promised** |

---

### Appendix — sources and versions (checked 2026-10-22 unless stated)
- Awwwards evaluation (weights, jury, thresholds): https://www.awwwards.com/about-evaluation/ · per-site award pages `awwwards.com/sites/<slug>`.
- npm (2026-10-22, `v3/E/report.md`): astro 7.4.2, @astrojs/cloudflare 14.4.2, tailwindcss and @tailwindcss/vite 4.3.3, gsap 3.15.0 (27.35 KB gz core), lenis 1.3.27 (5.46 KB), three 0.186.1 (184.9 KB), @rive-app/* 2.45.0, swup 4.10.0, @unseenco/taxi 2.0.0, next 16.4.2; from the 2026-10-20/21 pass: @astrojs/preact 6.1.0, preact 11.0.1, @astrojs/sitemap 3.7.4, valibot 1.5.0, zod 4.6.7, web-vitals 6.2.3, sharp 0.35.5, schema-dts 2.1.0, next-intl 4.14.9, @keystatic/core 0.6.9.
- Fonts: Google Fonts metadata (`fonts.google.com/metadata/fonts`, 2026-10-22): Fraunces axes SOFT 0-100, WONK 0-1, opsz 9-144, wght 100-900, subsets incl. vietnamese; Bricolage Grotesque opsz 12-96, wdth 75-100, wght 200-800, vietnamese; Be Vietnam Pro latin/latin-ext/vietnamese. Contrast values computed 2026-10-22.
- GSAP licence: https://gsap.com/community/standards-and-licensing/ · Core Web Vitals: https://web.dev/articles/vitals · WCAG 2.2: https://www.w3.org/TR/WCAG22/ · View Transitions and scroll-driven animation support: caniuse.com · Google AI features: https://developers.google.com/search/docs/appearance/ai-features · FAQ rich results: https://developers.google.com/search/docs/appearance/structured-data/faqpage · Review snippets: https://developers.google.com/search/docs/appearance/structured-data/review-snippet · Turnstile: https://developers.cloudflare.com/turnstile/plans/ · Rive pricing: https://rive.app/pricing · PDPL summary: https://www.tilleke.com/insights/vietnams-new-personal-data-protection-law-a-closer-look/.
- **Unverified (confirm before relying on):** Mobile Excellence minimum (70 vs 75), Awwwards submission fee, Zalo OA pricing, PDPL penalty figures, production env vars, Fraunces subset byte size (measure in P2a.1).

---

# Archived: Red Pen direction (rejected 2026-10-22)

> Moved here unchanged from §3 and §4 of v2. Not current; do not build from it. Any cross-references inside (for example to §3.9 or §4.1) point to this archive.

# 3. CREATIVE CONCEPT

## 3.1 Three big ideas

| | **A. The Red Pen** ★ | B. Ten Seats | C. Voices |
|---|---|---|---|
| One line | *Every great sentence started as a mistake.* | *Ten chairs. One teacher. Is one of them your child's?* | *Hear the difference three months makes.* |
| Metaphor | The marked page: a mistake, a correction, a gold star. Feedback is love. | The small room: the classroom as a stage with exactly ten seats. | The voice: English is something you *speak*; the site is built around real recorded sentences. |
| Mood | Warm, witty, tactile, editorial — a beautiful exercise book. Paper, ink, red pen, chalk. | Intimate, architectural, calm — a theatre seen from above, warm wood, spotlight. | Cinematic, emotional, documentary — black, waveforms, close-up faces. |
| Signature | Mistakes on screen get corrected in the teacher's own handwriting as you scroll. | Top-down seat map per group; seats fill as you scroll; tap a free seat to hold it. | Before/after audio of students (with consent); waveform scrubbing. |
| Why it suits a teacher | It *demonstrates the product* (correction, feedback, progress) in every interaction; personal (his handwriting); funny in any language. | Turns the real USP (max 10) into honest scarcity; strong conversion. | Most emotional proof possible. |
| Risks | Must not feel childish for IELTS adults → editorial type + restraint. | Needs truthful seat data weekly; less "story". | Needs consented recordings of minors (PDPL), sound on a service site, heavy media; can't be skimmed silently on a bus. |
| Award potential | High: original, ownable, crafted, light. | Medium-high. | High but fragile and heavy. |

**Recommendation: A "The Red Pen"**, absorbing B's seat map as one of its signature interactions (honest scarcity + the lead moment). C's audio idea becomes an optional later addition (one before/after clip, tap-to-play, adults only).

## 3.2 Design bible — Typography

Hard rule (verified): each family must natively include Vietnamese (stacked tones ặ ỗ ữ) **and** Cyrillic — no per-glyph fallback (the project has already seen that look broken). Chinese pages use the system CJK serif/sans for whole runs.

| Role | Font | Source / licence / cost (checked 2026-10-21) | Why |
|---|---|---|---|
| Display | **Playfair v2** (variable: wght 300–900, wdth 87.5–112.5, **opsz 5–1200**) | Google Fonts / GitHub, OFL, **$0**. VN with stacked marks + Cyrillic listed in project README. Note: *Playfair* (v2), not *Playfair Display*. | The opsz axis to 1200 gives razor-thin, high-contrast hairlines at 200 px — the "expensive editorial" look of Quaker/Namaha — and a sturdier cut at 24 px. Italic for the accent word. |
| Text & UI | **Inter** (variable: wght 100–900, opsz 14–32) | Google Fonts, OFL, **$0**; VN + Cyrillic in metadata. | Neutral, superb hinting on cheap Android screens, tabular numerals for prices/schedules. |
| Upgrade option | **PP Neue Montreal** (Pangram Pangram) for text | VN + Russian listed on foundry spec page. Web licence "from $40" per weight by pageviews — **get a quote**; estimate $40–150 unverified. | More character than Inter; only premium family confirmed with both scripts. |
| Handwriting | **The owner's real red-pen handwriting** — ~20 words/marks scanned and vectorised to SVG paths (✓, ✗, circle, caret ^, underline, arrow, "Good!", "Try again", star, signature) | Free (owner's hand) | The single most ownable asset; nobody can copy it. **Never a script font.** |
| Chinese | System stack `"Songti SC","Noto Serif CJK SC","Source Han Serif SC",serif` (display), `"PingFang SC","Noto Sans CJK SC",sans-serif` (text); tracking 0; line-height 1.7 | $0 | No 5–10 MB CJK webfont. |

Ruled out (verified): Fraunces, Bricolage Grotesque, Newsreader, Be Vietnam Pro, Barlow Condensed (no Cyrillic); Instrument Serif (neither); Fontshare families (no Cyrillic); Klim/Grilli/Dinamo/Commercial (VN or Cyrillic missing or split into separate families).

**Files:** 2 variable fonts × subsets (latin+latin-ext+vietnamese combined, cyrillic separate) = **max 4 woff2, ≤ 120 KB**, self-hosted, `font-display: swap`, preload only Playfair latin. Size-adjusted fallback (`size-adjust`, `ascent-override`) to keep CLS 0.

**Scale (fluid, 360 → 1440 px):**
| Token | Size | Font / settings | Use |
|---|---|---|---|
| `display-xl` | clamp(64px, 14vw, 220px) | Playfair wght 500, opsz 1200, wdth 87.5, tracking −0.03em, lh 0.9 | Hero line, chapter openers |
| `display-l` | clamp(44px, 8vw, 128px) | Playfair 500, opsz auto, −0.02em, lh 0.95 | Section titles |
| `display-m` | clamp(32px, 5vw, 72px) | Playfair 500 / italic 400 for accent word | Programme names, quotes |
| `title` | clamp(22px, 2.4vw, 32px) | Inter 600, −0.01em | Card titles |
| `body-l` | clamp(18px, 1.4vw, 22px) | Inter 400, lh 1.55 | Lead paragraphs |
| `body` | 17px mobile / 18px desktop | Inter 400, lh 1.6 | Copy (never < 16 px) |
| `label` | 13px / 14px | Inter 600, **uppercase only for Latin**, tracking +0.04em (not 0.2em); VI/ZH/RU: sentence case, tracking 0 | Eyebrows, tags |
| `num` | as context | Inter `font-variant-numeric: tabular-nums` | Prices, times, seat counts |

**Type motion:** headings split by **lines** (GSAP SplitText, `mask: "lines"`), each line rises 100% → 0 inside its mask, 900 ms `--ease-out`, 80 ms stagger. Accent word animates **opsz 1200→72 and wght 300→500** (ink "settles") over 700 ms. Never split Vietnamese by characters (breaks stacked diacritics); split by words/lines only.

## 3.3 Design bible — Colour

| Token | Light ("Paper") | Dark ("Blackboard") | Usage rule |
|---|---|---|---|
| `--paper` | `#F5F0E6` | `#14201A` (blackboard green-black) | Page background |
| `--paper-2` | `#ECE4D4` | `#1C2B23` | Alternate chapter, cards |
| `--ink` | `#15130F` | `#EEE9DD` (chalk) | All text, rules |
| `--ink-soft` | `#5E584D` | `#B8B2A4` | Secondary text — must pass 4.5:1 on its bg (verify in Phase 1) |
| `--red-pen` | `#C8231B` | `#FF6A5C` | **Only** for corrections, handwriting, the primary CTA, focus ring. Never for body text, never decorative. ≤ 5% of any screen. |
| `--highlight` | `#F2DC4B` | `#E5CE3E` | Highlighter strokes behind one word per screen; never under long text |
| `--chalk-green` | `#22392D` | `#22392D` | The "Method" chapter background (light mode's dark chapter) |
| `--rule` | `#15130F1F` | `#EEE9DD26` | Exercise-book lines, dividers |

- Light is default (parents browse by day; warmth). Dark mode follows `prefers-color-scheme`, toggle in header; dark = "chalk on blackboard" (handwriting turns chalk-white with red accents).
- Chapters flip background with **hard edges**: Paper → Paper-2 → Chalk-green → Paper.
- Contrast: every text/bg pair ≥ 4.5:1 (large text ≥ 3:1); red-pen on paper verified before sign-off.
- Paper texture: one 6 KB tiling SVG/AVIF grain at 4% + faint ruled lines on chosen sections; disabled in Save-Data.

## 3.4 Design bible — Layout

- **Grid:** desktop 12 columns, gutter 24 px, outer margin clamp(20px, 5vw, 80px), max content 1440 px. Mobile 4 columns, gutter 16 px, margin 20 px.
- **The margin column (concept device):** like an exercise book, a vertical red hairline sits at column 2 (desktop) / 20 px from left (mobile). Annotations, numbers, handwritten notes live *in the margin*; content lives to the right. Sections break the grid by letting a photo, a giant word or a correction cross the margin line on purpose.
- **Spacing:** 4 px base; scale 4/8/12/16/24/32/48/64/96/128/192. Section padding clamp(80px, 12vw, 192px) vertical.
- **Rhythm:** alternating "loud" (one giant statement + one image) and "quiet" (dense, useful info) sections; never two loud in a row.
- **Breaking the grid deliberately:** (1) hero sentence bleeds off the right edge on desktop; (2) teacher cut-out portrait overlaps the chapter edge; (3) seat map is full-bleed; (4) testimonials sit as margin notes, rotated ±1.5°.
- Hard edges, no rounded cards, no shadows. Borders = 1 px `--rule`. Buttons: rectangular, 56 px tall mobile.

## 3.5 Design bible — Imagery & video

**Shoot list (half-day, one photographer, natural light, same lens family 35/50 mm):**
| # | Shot | Use |
|---|---|---|
| 1 | Teacher portrait at the whiteboard, mid-gesture, looking at a student (not the camera) | Hero |
| 2 | Teacher cut-out (plain backdrop, waist-up, 3 expressions: listening, laughing, pointing) | Cut-outs on paper |
| 3 | Over-the-shoulder: child's notebook, teacher's red pen correcting | Method chapter, OG image |
| 4 | Hands raised; small group circle, faces only with written consent, otherwise backs/hands | Programmes |
| 5 | Teen pair-speaking practice; adult IELTS student with timer | Programme pages |
| 6 | Room details: door/entrance, CCTV camera, AC, restroom sign, shoe rack, books, name cards | Safety chapter |
| 7 | Building exterior + street (Phổ Quang) at golden hour | Visit / map |
| 8 | Parent pickup moment, teacher talking to a parent | Proof |
| 9 | **Video A:** 60 s teacher intro to camera (EN, VI subtitles burned in + captions file) | Card-expands-to-video |
| 10 | **Video B:** 20 s silent loop of a real lesson (no faces without consent) | Method background |

- **Treatment:** warm grade (lifted blacks, slight cream highlight, +5% grain), consistent across all. Cut-outs placed on paper with a hand-drawn red outline offset 6 px. Captions in `label` style with date and place ("Thứ Tư · 19:30 · Phú Nhuận").
- **Formats:** AVIF + WebP via build, `srcset` 480/828/1200/1920, hero ≤ 60 KB mobile. Video: H.264 + AV1, 720p max, ≤ 1.5 MB loop, poster first, never autoplay on Save-Data or cellular-unknown.
- **Avoid:** stock photos, AI-generated people, blurred faces (looks like a crime report), thumbs-up poses, flags/Big Ben clichés, certificates photographed at an angle.

## 3.6 Design bible — Motion language

| Token | Value | Use |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Reveals, entrances |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Page transitions, Flip |
| `--ease-pen` | `cubic-bezier(0.45, 0.05, 0.25, 1)` | Handwriting stroke draws (fast start, slight drag at end like ink) |
| `--dur-tap` | 120 ms | Button press, chip select |
| `--dur-ui` | 240 ms | Hover, menus |
| `--dur-reveal` | 700–900 ms | Headline lines |
| `--dur-stroke` | 400–1100 ms (by path length, ~1.2 px/ms) | Red-pen draws |
| Stagger | lines 80 ms; list items 60 ms; **total sequence ≤ 900 ms** | |

**What moves and why:** only (1) the red pen — it's the teacher's voice; (2) headline lines — to give rhythm; (3) photos via mask wipe — to feel like turning a page; (4) state changes (form steps, seat selection). Body text never animates; it's visible at first paint.

| Behaviour | Spec |
|---|---|
| **Hover (desktop)** | Links: red underline draws L→R 240 ms, retracts R→L on leave. Buttons: background ink→red-pen 120 ms + 2 px nudge of the arrow. Images: 1.03 scale inside mask, 600 ms. |
| **Cursor (desktop, fine pointer only)** | Native cursor kept; a 10 px red dot follower (lerp 0.2) that grows into a small pen-nib icon over "correctable" elements. Off on touch, off on reduced motion. |
| **Scroll** | Lenis 1.3.27 on fine-pointer desktop only (`lerp 0.1`); native scroll on touch. ScrollTrigger reveals at `top 80%`, play once. One pinned scene (Method, desktop) ≤ 150 vh. |
| **Page transition** | Native cross-document View Transitions (`@view-transition { navigation: auto; }`): old page lifts 4% + fades (300 ms), new page slides from below with a red-pen underline drawing across the header (450 ms). Browsers without support: instant navigation. |
| **Loading** | **No preloader.** HTML + text paint immediately; the hero's handwriting draws once fonts are ready (`document.fonts.ready`, max wait 600 ms, then draw anyway). |
| **Reduced motion** | All end states shown immediately; handwriting rendered fully drawn; no Lenis, cursor, parallax or video autoplay; view transitions become a 150 ms cross-fade. |

## 3.7 Signature interactions (the 5 things people remember)

1. **"The Correction" hero.** A real learner mistake typeset huge: *"I very like English."* As the page settles (≤ 1.2 s), the teacher's red pen strikes "very", a caret inserts *"really"* above, and a handwritten "✓ Good!" lands in the margin → *"I really like English."* Beneath, the localized H1 (real text, SEO): VI "Lớp tiếng Anh nhóm nhỏ tại Phú Nhuận — con nói được, ba mẹ thấy được tiến bộ." (copy to be finalised). **Tap the sentence → a new common mistake appears and gets corrected** (8–10 mistakes, rotate; chosen by age group). Mobile: tap; desktop: hover pen-cursor + click. *Implementation:* HTML text + absolutely positioned SVG paths; GSAP DrawSVG (or CSS `stroke-dashoffset`) — < 10 KB.
2. **"Margin notes" proof.** Testimonials appear as parent quotes on the page with the teacher's handwritten margin notes ("Minh — 3 months, now answers in full sentences ✓"). Desktop: notes draw in as they enter the viewport. Mobile: horizontal swipe deck of note cards (scroll-snap, 85% width, next card peeks).
3. **"The Level Ladder" course explorer.** A single slider: *"How old is your learner?"* 6 → 17 → Adult. Dragging morphs one card (GSAP Flip) into the right programme: name, what a typical sentence sounds like **before** and **after 3 months** (the "after" written in, the "before" corrected), class length, schedule window, group size. Mobile: big thumb slider at the bottom of the card, 10 ms haptic tick on Android (`navigator.vibrate`) at each programme boundary.
4. **"Ten Seats" map.** Per group: a top-down drawing of the actual room with 10 chairs; taken seats inked, free seats outlined. Scroll draws the room; free seats gently pulse once. **Tap a free seat → "Hold this seat" sheet opens** (the lead form) with the group pre-filled. Data: one number per group in the CMS, edited weekly by the owner; shows "updated [date]". If not maintained → automatically hides seat counts and shows "Ask about availability". *Honesty is non-negotiable.*
5. **"The Answer Key" pricing reveal.** After the 3-step form, a folded sheet unfolds (CSS 3D, 700 ms) into the full price sheet for the chosen programme; the red pen circles the recommended plan and writes "Your trial: [date]?" with a Book button. Same sheet is emailed/Zalo'd. 404 page reuses the device: *"This page has a mistake."* — corrected to a link home.

## 3.8 Iconography & details
- Icons: 1.5 px stroke, drawn in the same pen weight as the handwriting (custom set of ~12: Zalo, phone, map pin, clock, child, adult, check, arrow, play, close, globe, sun/moon).
- Favicon: a red ✓. OG images: per language, the corrected sentence on paper.
- Emails: same paper, same pen marks, Inter text.

## 3.9 Sound
**No.** Parents browse on buses, at work, at night next to sleeping kids; studied service sites with sound (SkyClinics, Huy) gained nothing for conversion. Exception for a later phase: Teacher intro video (user-initiated, with captions) and an optional single before/after audio clip (tap to play, adults only).

---

# 4. STORYTELLING & PAGE-BY-PAGE

## 4.1 Home — scroll narrative (mobile-first; ≤ 9 mobile screens before the first form)

| # | Section | Purpose | Emotion | Copy direction | Layout (mobile → desktop) | Animation |
|---|---|---|---|---|---|---|
| 1 | **Hero: The Correction** | Who/what/where in 5 s; brand moment | Delight → "this is a real teacher" | Mistake sentence + localized H1 (who, ages, Phú Nhuận, small groups) + proof line ("Max 10 · TESOL & PGCE · since 2023 in HCMC") | Mobile: sentence top, teacher cut-out bottom-right overlapping, H1 + proof, sticky bottom bar (Zalo / Hold a seat). Desktop: sentence bleeds right across 9 cols, cut-out cols 9–12, H1 in margin column below | Pen correction ≤ 1.2 s; cut-out mask-wipes up 700 ms; text static at first paint |
| 2 | **The problem** | Recognition | "That's my child" | "Years of English class. Still won't speak." 2 lines + 3 short parent-voice bullets | Paper-2 band, giant display-l, bullets as ✗ marks in margin | Lines rise; ✗ marks draw 60 ms stagger |
| 3 | **The method** | How lessons work | Relief, clarity | 4 steps: Speak first → Practise in pairs → Correct kindly → Report to parents. Each with a 1-line concrete example | Chalk-green chapter. Mobile: vertical steps with photo #3. Desktop: pinned 150 vh, step number in margin, photo swaps per step; card "Watch a lesson" expands to Video B | Pin (desktop only); photos mask-wipe; numbers draw as handwriting |
| 4 | **Level Ladder** | What the programmes are, who they're for | "There's a place for my child" | Slider label "How old is your learner?"; per programme: who it's for / not for, before→after sentence, length, schedule window, group size, "from" price if Q1 = public | Single morphing card + slider (thumb zone); desktop: card left 7 cols, ladder scale vertical in margin | Flip morph 500 ms `--ease-in-out`; before→after correction stroke |
| 5 | **Margin notes (proof)** | Trust | "Other parents like me trust him" | 5–8 named testimonials (first name, child age, district, months studying), 1 result highlight (e.g. IELTS band — only if verified), GBP rating link | Mobile swipe deck; desktop staggered notes ±1.5° across 12 cols | Notes draw on enter |
| 6 | **Meet the teacher** | Warmth & credibility | "I'd like him to teach my child" | Short story Tashkent → HCMC; why I teach; credentials (verified only); signature | Cut-out portrait large; card "Meet Bek (60 s)" expands to Video A full-bleed (Lusion pattern) | Card → full-bleed Flip 600 ms; signature draws |
| 7 | **The room (safety)** | Remove the #1 parent fear | Safety | CCTV, AC, private restroom, pickup policy, address; photos #6/#7 | Photo grid with handwritten labels pointing at things; static map image (no tiles) + "Open in Google Maps" | Arrows draw to labels |
| 8 | **Ten Seats + invitation** | Convert | Momentum, gentle urgency | "Groups are small on purpose. Here's who has room." Seat map per group → "Hold a seat & see full prices" | Full-bleed seat map; tap seat → bottom sheet form | Room draws; free seats pulse once |
| 9 | **FAQ** | Objections | Reassurance | 8–10 questions in parent language, answers 2–4 sentences | Accordion with + → ✓ animated pen mark; 18 px questions, not caps | Height auto via `interpolate-size` / GSAP |
| 10 | **Final + footer** | Easy action | Calm | "Questions? Message me on Zalo — I reply within [hours]." Address, hours, socials, language switch | Big Zalo button, phone with `tel:`, QR for Zalo on desktop | Underline draws |

**What a visitor learns without prices:** what each programme is, who it's for/not for, how a lesson runs (4 steps + video), class size and room, schedule windows, the before→after transformation, real proof, the teacher himself. **Pricing is an invitation, not a paywall:** framed as "Hold a seat & get your answer key" — it gives something (personal price sheet, trial date, seat held 48 h) rather than taking something. Always offer "Prefer to ask? Message on Zalo" inside the sheet.

## 4.2 Pages

| Page | Experience |
|---|---|
| `/[vi|en|zh|ru]/` Home | §4.1 |
| `/…/programmes/{young-learners, teens, ielts, english-for-work}` | Hero = programme's own correction sentence; who for/not for; sample week; before→after; schedule; seats map for its groups; 3 FAQs; form pre-filled |
| `/…/method` (optional, Phase 2b) | Long-form of section 3 + Video B; good for SEO/AI answers |
| `/…/guides/{slug}` ×4–6 | Editorial article template: margin notes, pull-quote correction, related programme card at end |
| `/…/hold-a-seat` | Standalone form page (for Zalo/Facebook ads links) |
| `/…/answer-key/[token]` | Personal price sheet after submit (noindex), shareable with spouse |
| `/…/privacy`, `/…/terms` | Localized, plain-language, editorial layout |
| 404 | "This page has a mistake." → corrected to links |
| Empty/error states | Form error: pen writes "Almost — check your phone number"; offline: "No signal? Call [phone]" |

**Transitions between pages:** View Transitions as §3.6; shared element = the header pen underline and, programme card → programme page, the card image morphs (`view-transition-name: programme-{slug}`).

## 4.3 Mobile on its own terms
- **Thumb zone:** sticky **bottom bar** (64 px, safe-area aware): left "Zalo" (icon + label), right "Hold a seat" (red-pen fill). Replaces the floating bubble. Hides on scroll down within forms, reappears on scroll up.
- Menu: full-screen paper sheet, links 32 px Playfair, close button 48×48 top-right **and** at bottom of the sheet; Escape + back gesture close it.
- Hero correction: **tap** to get a new mistake (hint: small handwritten "tap me ↑").
- Level Ladder: horizontal thumb slider at card bottom, snap points, haptic tick.
- Proof: swipe deck with scroll-snap; Ten Seats: pinch-free, seats ≥ 44 px, tap opens bottom sheet (form) with drag-to-dismiss.
- No hover-dependent content; no cursor; no pinned scenes on mobile (Method becomes stacked steps).
- Inputs ≥ 48 px, 17 px text (prevents iOS zoom), `inputmode="tel"`, `autocomplete` set.

