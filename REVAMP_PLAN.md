# teacherbek.com — Creative Direction, Audit & Build Plan

> v2 · prepared 2026-10-21 · read-only audit of repo (`main` @ `d3f7e81` + 18 uncommitted files) and live https://teacherbek.com.
> Research by sub-agents (Sonnet/Haiku) on 2026-10-20/21: 7 Awwwards Site-of-the-Year sites + 12 award-winning education/personal/service sites opened, scrolled, screenshotted and measured in headless Chromium; live-site teardown (~70 screenshots); font coverage verified against foundry pages and Google Fonts metadata; package versions via `npm view`. Raw evidence: session scratchpad (`soty/`, `sotd/`, `teardown/`, `type/`).

---

## 0. One-page summary

### The concept — **"The Red Pen"**
The whole site is a teacher's page in the middle of being marked: a real mistake on screen, the teacher's own red-pen handwriting correcting it, and the student's English getting better as you scroll. It sells the one thing parents actually pay for — *the mistake fixed, the confidence gained* — and makes it feel physical, warm and personal rather than "agency dark mode". It is built from type, paper, ink and real classroom photography (no WebGL needed), so it stays fast on a ₫3-million Android phone.

### The 5 biggest problems today
| # | Problem | Evidence |
|---|---|---|
| 1 | **First 5 seconds sell nothing.** Mobile hero = giant "ENGLISH", a lone grey "that", ~280 px of empty cream, then stats. No face, no child, no age, no price cue. H1 is English on VI/ZH/RU. | `teardown/m-en-00.png`, `m-zh-hero.png` |
| 2 | **Leads can vanish.** Submissions are only emailed (nothing stored); pricing gate reports "success" even if the email fails; honeypot is wired wrong (`website: ""` hard-coded). | `app/api/pricing-lead/route.ts`; `VanguardInquiry.tsx:247` |
| 3 | **Things are visibly broken.** Mobile menu **can't be closed** (X is covered by a `z-10` sibling, `VanguardNavigation.tsx:~327`); contact map shows **"API KEY REQUIRED"** watermarks (Carto tiles); the Zalo bubble covers content on every screen; empty "Reads" band. | `teardown/m-en-20.png`, `i-menu*`; Semrush Site Audit corroborates broken links, invalid schema and double h1 (§2.3) |
| 4 | **Slow on a real phone.** Slow 4G + 4× CPU: LCP **2.6–3.8 s**, ~760 KB, **40–43 font files**, ~270 KB JS, three animation libraries. | throttled run 2026-10-20 |
| 5 | **Looks like a design-studio portfolio, not a place you'd trust with your 8-year-old.** 11–15 px grey tracked caps everywhere (~2.5–3:1 contrast), only two photos, no children/class in action, jargon ("acquisition through structured play"), programmes arrive at screen 7 of 24. | teardown §Typography/§Imagery |

### Decisions the owner must make
1. **Approve "The Red Pen"** (or pick B "Ten Seats" / C "Voices", §3).
2. **Pricing:** show a public "from ₫X/month" and gate the full sheet + booking (recommended) — or gate everything? Real prices per programme (§Questions).
3. **Content commitments:** a half-day photo/video shoot, 5–10 named testimonials with written consent, a sample of your handwriting (for the red-pen strokes).
4. **Seat counts:** are you willing to keep "seats left per group" truthful (update once a week)? It's a signature feature; it must never be fake.
5. **Platform & budget:** rebuild on Astro + Cloudflare (recommended, ~$1–5/mo) vs. stay on Next.js + Vercel Pro ($20/mo); optional paid font (~$40–150, quote needed).

---

## Questions for owner

| # | Question | Blocks |
|---|---|---|
| Q1 | Real price per programme (Young Learners 6–10, Teens 11–17, IELTS, English for Work)? Currently all show "from 1,990,000 VND/month"; schema says the same for every course. | Pricing sheet, schema |
| Q2 | Trial offer: free **week** or discounted first **month**? (site says both). What happens in the trial, exactly? | Hero, CTA copy |
| Q3 | Schedule per group (site: weekdays 19:30–21:00, weekends 14:00–20:00; schema: Mon/Wed/Sat/Sun). Max per group still 10? How many seats are free per group right now? | Seat map |
| Q4 | Which claims are provable: "2,000+ students", "15+ schools", "ILA Vietnam", "MBA candidate", TESOL, PGCE, DELTA (credentials list shows 3)? | Proof section, schema |
| Q5 | Is `RESEND_API_KEY` set in Vercel, `teacherbek.com` verified in Resend, and does `hello@teacherbek.com` receive mail? Any form leads in the last 3 months? | Phase 0 |
| Q6 | Where should leads reach you first: Zalo, phone call, email? Do you have a Zalo Official Account? Is the business registered in Vietnam (needed for Zalo ZNS messages)? | Lead pipeline |
| Q7 | Testimonials: are the 5 current ones (Linh N., Minh T., Sarah K., Hoa P., David R.) real and consented? Can you get photos/video and full first names? Google Business Profile + reviews? | Proof |
| Q8 | Photo/video: can we shoot a real class? Parents' written consent for children's faces (PDPL)? Budget for a local photographer (half day)? | Imagery |
| Q9 | Will you write ~10 words/phrases by hand in red pen on paper (we scan and vectorise)? | Signature interactions |
| Q10 | Which languages bring students? Who reviews ZH and RU copy? OK to launch VI + EN first? | Scope |
| Q11 | Address public & permanent (Golden Mansion 1, 119 Phổ Quang, Phú Nhuận)? Still serving Gò Vấp / Bình Thạnh? | Local SEO |
| Q12 | Budget: one-off build budget and acceptable monthly cost? Paid font OK? | Stack, type |
| Q13 | Brand name: keep "Teacher Bek"? Want a Vietnamese tagline/name? | Identity |
| Q14 | Hours/month you can give to content (testimonials, photos, guides)? | Blog decision |
| Q15 | Do you use WhatsApp? If not, remove it (the `wa.me/84353885757` link returns 429 in Semrush and sits in footer, form and contact email). | Phase 0 link cleanup |

---

# 1. DESIGN RESEARCH

## 1.1 Sites studied (opened, scrolled, measured 2026-10-20)

Metrics: headless Chromium, desktop unless noted; transfer = bytes over load + scroll. SOTY years from Awwwards winners page (2025 renders) and badge listings (2023–24 via search; marked where unverified).

### Site of the Year winners
| Site | Award | Concept | Type | Motion / signature | Perf (transfer · JS · LCP) | Mobile | Borrow |
|---|---|---|---|---|---|---|---|
| **Lando Norris** landonorris.com (OFF+BRAND) | SOTY + Users' Choice 2025 | Scrapbook of a life on topographic paper | Mona Sans Variable + Brier serif; serif/sans word swaps in one headline | Lenis + GSAP; background colour flips per chapter; hand-drawn slash "ON TRACK / OFF TRACK"; first-person quote + signature | 7.1 MB · 578 KB · 1.2 s | Separately designed, 2-col archive grid | Colour-chapter sections, **handwriting + signature as authorship**, captioned dated photos |
| **Messenger** messenger.abeto.co | Developer SOTY 2025 | Toon courier game on a tiny planet | No DOM text | Full 3D world, ogg SFX | 5.7 MB · 508 KB · n/a | Adapts, unreadable to crawlers | A single playful "Begin" moment only |
| **Igloo Inc** igloo.inc | SOTY + Dev SOTY 2024 | Sci-fi arctic HUD | No web fonts, virtual scroll | Camera flight, point clouds, audio | 15 MB (mobile too) | Heavy | Avoid — wrong for local service |
| **Don't Board Me** dontboardme.com | SOTY (badge listed 2024) | In-home dog care, illustrated, pink | Bayon condensed + Neue Montreal | Lenis + GSAP + Lottie; character cursor; ball-bounce gate preloader (desktop LCP 7.6 s) | **1.6 MB** · 522 KB · 7.6 s d / 3.9 s m | Excellent: sticky MENU/BOOK, full-width price cards "from $30" | **Best template for a local service**: one idea, illustration-as-brand, prices as cards, sticky Book — minus the gate |
| **Opal Tadpole** opalcamera.com | SOTY (badge listed 2024; page now an essay) | Product essay over workshop video | Die Grotesk only | Barba transitions, HLS video | 162 MB · 1.3 MB · 2.8 s | — | A plain-text manifesto; never autoload video |
| **Lusion** lusion.co | SOTY/Dev 2023 badge (may be a newer version) | Studio site as its own demo | Aeonik sentence case + mono labels | 000→100 counter preloader; "Play reel" card expands to full-bleed; mute toggle | 10.9 MB · 522 KB · 0.75 s | Well adapted | Card-expands-to-video; h1 paints behind loader (good LCP) |
| **Noomo** noomoagency.com | SOTY 2023 (Users' Choice claim unverified) | Giant word swaps over 3D objects | Neue Machina caps | GSAP pinning, three.js | 9 MB desktop → **1.5 MB mobile** | Drops WebGL entirely, same hierarchy | **Graceful degradation model** |

### Education · personal brand · service (SOTD / Honorable Mention, 2024–2026)
| Site | Award | What makes it work | Perf | Lead capture | Borrow |
|---|---|---|---|---|---|
| **Duck English** duck.school/en | SOTD 2024-01-26 | Language school; hand-drawn mascot, acid-lime stickers, high-contrast serif display 90 px, text on curved paths, eyes follow cursor | 1.0 MB · 510 KB · 5.0 s d / 1.5 s m | "Get in touch" + Telegram, "we guarantee results" | Character + one loud accent + messenger-first contact |
| **Quaker School at Horsham** quakerschool.org | HM 2026-09-15 | Full-bleed classroom video, cream → butter-yellow chapters, Season Mix serif 226 px −1% | 11.7 MB (video) · 1.2 MB · 1.8 s | Persistent "Inquire" pill | Real classroom footage, short emotional H1 ("Seen & valued"), one persistent CTA |
| **Namaha Healthcare** namaha.healthcare | HM 2026-08-07 | Cream + terracotta, serif with one italic accent word | 4.8 MB · 245 KB · 1.5 s | "Book an appointment" in nav; **call card inside mobile hero** | Closest palette to ours; contact card in the hero |
| **Twofold Therapy** twofoldny.com | HM 2026-08-02 | Sepia double-exposure photos, almost no UI | 6.0 MB · 245 KB | Contact link | Restraint; one consistent photo grade |
| **Don't-miss counter-examples**: Jesper Landberg (SOTD 2026-09-29, 34.5 MB, hijacked scroll), Huy Phan (SOTD 2026-10-14, HCMC designer, virtual scroll, sound), SkyClinics (HM 2026-07-14, 23.9 MB, particles + sound), The Performance Lab (HM 2026-08-01, promo modal + cookie banner over hero) | | Award-winning but wrong for a local teacher | | | |
| **Papumba** papumba.com | HM 2026-05-09 | Kids' learning; illustrated world, Plus Jakarta 128 px −5% | 4.0 MB · 464 KB · 1.1 s | "Try it free" + trust line "EdTech Award Winners" | Proof line in hero |
| **Trevor Noah** trevornoah.com | SOTD 2026-09-03 | Torn-paper cut-out portrait, Die Grotesk 361 px | 9.5 MB · 7.5 s d | Pinned "Get Tickets" | **Cut-out portrait on paper** |
| **Aardvark Book Club** aardvarkbookclub.com | SOTD 2026-08-30 | Handwritten annotations over product, sticky sign-up pill | 50 MB | Sticky pill | **Marginalia handwriting** |
| Refs (not awarded): **Preply** (real tutor photo + stat overlays, free level test lead magnet), **Duolingo** (one unmistakable CTA, 2.2 MB JS — too heavy) | | | | | Free level test as lead magnet |

## 1.2 Repeatable patterns behind the winners

| Pattern | Seen on | Cost | Use here? |
|---|---|---|---|
| **One idea, executed everywhere** (scrapbook, dog care, courier) | Lando, Don't Board Me, Messenger | Free (it's thinking) | **Yes — the Red Pen** |
| Huge display type, negative tracking, 2 families max (+ tiny labels) | all | Fonts only | Yes |
| Serif/sans swap or italic accent word inside one headline | Lando, Namaha, Quaker | Free | Yes |
| **Handwriting/marginalia as authorship** (signature, slashes, notes) | Lando, Aardvark, Duck | SVG paths, ~2–10 KB | **Yes — core** |
| Background colour flips per chapter | Lando, Don't Board Me, Quaker | CSS | Yes (paper → blackboard → paper) |
| Real people, consistent grade | Quaker, Twofold, Lando | Shoot cost | Yes |
| Branded preloader as first brand moment | all 7 SOTY | Often kills LCP (DBM 7.6 s) | **No gate** — the hero *is* the brand moment, painted at first frame |
| Lenis smooth scroll + GSAP ScrollTrigger | Lando, DBM, Quaker, Papumba | ~5 KB + ~45 KB | Lenis desktop only; GSAP deferred |
| Pinned scroll scenes / word swaps | Noomo, Lando | Medium | One pinned scene (Method) on desktop only |
| Card expands into full-bleed video | Lusion | Low (Flip) | Yes (teacher intro) |
| Persistent single CTA pill with specific label | Quaker, Trevor, DBM, Namaha | Free | **Yes** — "Hold a seat" |
| Separate mobile design, not shrunk | DBM, Namaha, Noomo | Design time | Yes |
| Custom cursor | DBM (character), Papumba | Low | Desktop only, subtle |
| Sound | Messenger, Igloo, Lusion, SkyClinics | Medium | **No** (see §3.9) |
| WebGL/3D | Igloo, Messenger, Lusion, Noomo | 9–15 MB | **No** — doesn't earn it here |

Key measured insight: **JS was not what made winners heavy (0.3–0.9 MB everywhere); images, 3D assets and video were.** Award-level is reachable with type, SVG and well-compressed photography.

## 1.3 Tells that look cheap / dated → avoid
1. Cookie wall or promo modal over the first screen (Abadir, Performance Lab).
2. Preloader gate that delays content (DBM desktop 7.6 s LCP).
3. 10–12 px light-grey micro-text carrying real content (teacherbek today, Huy).
4. Wide-tracked caps applied to Vietnamese and Chinese (teacherbek ZH hero).
5. Fade-up-on-every-element reveals; text caught half-transparent mid-scroll (teacherbek m-en-14/17).
6. Centred hero + stock-ish photo + two equal buttons (Preply-style template).
7. Rounded card grids with soft drop shadows; pill-everything.
8. Gradient blobs / frosted glass as the only idea (SkyClinics).
9. Marquees and tickers (teacherbek footer, Trevor).
10. Scroll hijacking / virtual scroll on a content site (Huy, Jesper).
11. Floating chat bubbles colliding with content (teacherbek Zalo bubble).
12. "Coming soon" / empty sections (teacherbek "Reads").
13. Third-party map with watermark or default pin (teacherbek).
14. Unverifiable round-number stats ("2,000+", "15+") with no source.
15. Disabled-looking primary buttons (teacherbek "SEND MESSAGE", pricing submit).
16. Lock icons and "unlock" language on prices — reads as a paywall.
17. Default system fonts or one sans at 16 px everywhere.
18. Sound toggles on a local service site.
19. Multi-MB pages for a single-page marketing site (Aardvark 50 MB).
20. AI-generated or stock "happy classroom" imagery.

## 1.4 Things that look expensive → do
1. One concept carried into every detail (404, emails, form, favicon).
2. Display type at 120–220 px with −1 to −3% tracking and optical sizing.
3. One italic or serif "accent word" per headline, used sparingly.
4. Hand-made marks (the owner's real handwriting, not a script font).
5. Duotone base + one accent colour, with strict usage rules.
6. Colour fields as chapters, with hard edges between them.
7. Art-directed photography in one grade; real people, real room.
8. Deliberate emptiness that *frames* something (not dead space).
9. One persistent CTA with a specific verb ("Hold a seat", not "Contact").
10. Micro-copy with a voice ("Seen & valued", "We guarantee results").
11. Proof inside the hero (numbers, faces, one quote).
12. Mobile layout composed for a thumb, not reflowed desktop.
13. Mask reveals and Flip transitions instead of fades.
14. Lean, native-feeling pages (Twofold 245 KB JS, DBM 1.6 MB).
15. Captions with dates/places on photos — documentary feel.
16. Tabular numerals and real typographic details (proper quotes, en dashes, hanging punctuation).
17. A 404 and empty states that are as designed as the home page.
18. Branded transactional emails that match the site.
19. Instant, honest feedback on every tap (≤ 100 ms).
20. Restraint: fewer, bigger moments.

---

# 2. AUDIT OF THE CURRENT SITE

## 2.1 Visual & UX teardown (blunt)

**First 5 seconds (m-en-00, mobile).** Cream screen. Top: `[ 01 — SMALL GROUPS · PHÚ NHUẬN · IELTS · ON…` in 11 px grey tracked caps, clipped off the right edge. Then **ENGLISH** in black condensed caps, then a grey italic *"that"* — the cycling phrase hasn't arrived after 2 s, so the headline reads unfinished. Then ~280 px of nothing with a faint pink smear. Then a 3-column stat box (2,000+ / 3 / 15+). Then a terracotta MESSAGE ON ZALO button, two underlined text links, three outline pills, and the blue Zalo bubble sitting on top of "ACCEPTING STUD…". **A Vietnamese mother learns: "an English teacher, contact via Zalo". She doesn't learn: who, for which age, where exactly, how much, is it safe.** No face until scroll 2.

| Area | Verdict | Evidence |
|---|---|---|
| Typography | Display scale is strong (Barlow Condensed is the best thing visually). Everything else is 11–15 px grey tracked caps — labels, FAQ questions, consent, hours — ~2.5–3:1 contrast. Tracking ruins Vietnamese diacritic stacks and Chinese (`小班授课 · 富润区` spaced like Latin). Russian falls back to a system font. | m-en-14, m-zh-hero, m-ru-hero |
| Colour | Cream/black/terracotta is disciplined but cold; long dark zone (sections 2–6) feels heavy; secondary info grey-on-grey. | d-en-05 |
| Spacing | Hero void; uneven dead gaps; classroom photo leaves a white strip on the right; desktop "How you learn" pin leaves ~60% blank; Community block has 32 px margin vs 64 px elsewhere. | m-en-02, d-en-08, d-en-12 |
| Imagery | Two photos total. Portrait is stiff/corporate. Classroom photo (rainbow wall, "Let's Learn & Play") is the best asset. No children, no teaching in action, no proof photos. Map shows "API KEY REQUIRED". | m-en-01, m-en-20 |
| Motion | Lenis, clip-path menu wipe, staggered reveals are decent; but the hero phrase starts blurred and late; text often caught half-faded; desktop programme cards "ghost". | hero-t800, d-en-05 |
| Navigation | **Mobile menu cannot be closed** (X under a sibling, Escape ignored). Hamburger 32 px. Theme toggle hidden in menu. Zalo bubble overlaps content on every screen. No sticky bottom CTA. | i-menu, VanguardNavigation.tsx:~327 |
| Hierarchy & CTAs | Programmes (why parents came) appear at screen 7/24. "Free week" ×6 without saying what happens in it. "SEE PRICING 🔒" ×4 = paywall feeling. Decision-point CTAs are the weakest: "REQUEST DETAILS" tiny grey link, "SEND MESSAGE" looks disabled, "GO TO YOUR SPACE" grey on black. | m-en-08, m-en-20, m-en-21 |
| Copy | Confident in places ("Not grammar drills. Not passive exposure."), but jargon for parents ("acquisition through structured play", "examiner-criteria strategy"); no "after 3 months your child can…". H1 untranslated on VI/ZH/RU; VI has English "ASK A QUESTION". | m-vi montage |
| Pricing gate | Black square panel "[ UNLOCK PRICING ] See pricing in 10 seconds." Submit renders dim brown (looks disabled), X is a 24 px hairline, no "ask on Zalo instead". | i-pricing-modal |
| Form | Underline fields, #CCC placeholders nearly invisible, 12 px caps consent wall, ~9 interactions. | i-form-focus |
| Dark mode | Desktop dark hero is the best-looking state on the site. Mobile toggle state unverified. | d-dark-hero |

**Keep:** condensed display type at scale; the warm classroom photo; single terracotta accent; Zalo-first full-width mobile CTA; specific testimonials (age + district) and plainly stated ages/schedules.

## 2.2 Everything else (brief, severity-rated)

| Area | Sev | Finding |
|---|---|---|
| Stack | M | Next 15.5.12 (latest 16.4.2), next-intl 3.26.5 (4.14.9), Tailwind 3.4.19 (4.3.3), framer-motion 11 (motion 14.4.0). **Three animation stacks** (Framer 25 files + GSAP + Lenis + split-type, unmaintained since 2023). |
| Dead code | M | Unused deps: react-hook-form, @hookform/resolvers, @types/leaflet, @radix-ui/react-slot, cva, shadcn. ~17 unused components (TrustSection, protected-image, 5 community, 3 page clients, 6 ui). `/api/newsletter` has no UI. 6 stale docs; `claude.md`/`CLAUDE.md` case clash. |
| Hosting | M | Vercel (hkg1). **Hobby plan is non-commercial only** (vercel.com/legal/terms §4) — verify plan. |
| Performance | **H** | Slow 4G + 4× CPU: LCP 3.78 s (/en), 2.64 s (/vi); FCP = LCP (render-blocked by fonts/CSS); 758–782 KB; 40–43 font files; ~272 KB JS; hero rendered twice (~1,100 DOM nodes, 2 `<h1>`). CLS 0 ✓. PSI API was over quota — re-run with key. |
| Lead form | **H** | Flow: form → `/api/contact` or `/api/pricing-lead` → in-memory rate limit + time-trap + (broken) honeypot → **one Resend email** to `CONTACT_NOTIFY_EMAIL` (default hello@teacherbek.com) → English-only reply. **Nothing stored.** Pricing route returns success even when email isn't sent. `RESEND_API_KEY` absent locally; `.env.local.example` names the wrong var (`CONTACT_EMAIL`). No Turnstile; serverless rate limit ineffective. |
| SEO | M | `llms.txt` lists **wrong domain** (englishwithconfidence.com) and non-pages; 2 h1s; thin `/community` + empty `/blog` in sitemap; sitemap has no hreflang, fake `lastmod`; no x-default in HTML; duplicate JSON-LD graphs, same price on all courses, `byDay` contradicts FAQ, SearchAction for non-existent search. ✓ SSR, canonicals, localized home titles. |
| AI search | M | No plain "fast facts" entity block; FAQ only source of answers; no Google Business Profile signal. All AI crawlers allowed ✓. Google says no special AI files needed (developers.google.com/search/docs/appearance/ai-features, checked 2026-10-20). |
| Accessibility | M | Contrast failures (labels at 40–65% opacity); 46 tap targets < 44 px; menu trap (keyboard + touch); status not announced; skip link targets missing on subpages. ✓ reduced-motion mostly respected, focus-visible, font-size toggle. |
| Security | M | HSTS (no includeSubDomains), CSP with `script-src 'unsafe-inline'`, no origin check on POST APIs (email-flood risk vs Resend's 100/day free cap). |
| Privacy | **H** | GA4 loads without consent; privacy/terms English-only, omit phone, children, processors (Vercel/Resend/Google), retention. Vietnam PDPL (Law 91/2025/QH15, Decree 356/2025) in force since 2026-01-01 — requires clear, unbundled, recorded consent (law-firm summary: tilleke.com, checked 2026-10-20; **confirm with a Vietnamese lawyer**). |
| Analytics | M | UA-style events, no `generate_lead`, Zalo/phone clicks untracked, possible double page_views, no funnel. |
| Blog | **H** | 0 local posts; homepage "Reads" depends on runtime GitHub fetch → empty band "New articles are on their way". **Pause → replace with 4–6 evergreen Guides.** |
| Community | **H** | 5 submission types, all data files `[]`, requires hand-editing JSON + redeploy. **Remove**, 301 to home. |

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

---

# 5. STACK (checked 2026-10-20/21)

| Layer | Pick (exact version) | Why | Browser cost | Alternative |
|---|---|---|---|---|
| Framework | **Astro 7.4.1** | Static HTML by default, JS only in islands; built-in i18n routing; perfect for a marketing site | ~0 KB baseline | Next.js 16.4.2 + next-intl 4.14.9 (React runtime ~100 KB+) |
| Adapter/host | **@astrojs/cloudflare 14.4.1** on Cloudflare Workers (static assets + 1 function for the lead API) | Free tier, commercial OK, HCMC + Hanoi PoPs | — | Vercel Pro $20/mo (Hobby is non-commercial) |
| CSS | **Tailwind CSS 4.3.3** via **@tailwindcss/vite 4.3.3** + CSS custom properties for tokens | No runtime JS | 0 KB | Vanilla CSS |
| Islands | **Preact 11.0.1** via **@astrojs/preact 6.1.0** — only for the form sheet + Level Ladder | Tiny React-compatible | ~4–5 KB | Vanilla TS custom elements |
| Animation | **GSAP 3.15.0** (core + ScrollTrigger + SplitText + DrawSVG + Flip — all in the public npm package, verified in tarball; "no charge" standard licence, not MIT) | Industry standard; plugins now free | core 26.7 KB gz + plugins ≈ **45–55 KB, deferred** after LCP | CSS scroll-driven animations (`animation-timeline`, ~88% support) + `motion` 14.4.0 mini `animate()` |
| Smooth scroll | **Lenis 1.3.27**, fine-pointer desktop only | Matches SOTY feel; native on touch | 5.3 KB, desktop only | None (native) |
| Page transitions | **Native View Transitions** (cross-document, Chrome 126+/Safari 18.2+, ~89%) | Zero JS | 0 KB | Swup 4.10.0 + @swup/astro 1.8.0 (9 KB) |
| 3D/shaders | **None** | Measured: WebGL is what makes winners 9–15 MB; nothing here needs it | 0 | ogl 1.0.11 (33 KB) only for a future paper-fold shader, if ever |
| Lottie/Rive | **None** — handwriting is SVG + DrawSVG | — | 0 | @lottiefiles/dotlottie-web 0.81.0 (32 KB) |
| Validation | **Valibot 1.5.0** (client + server) | Tree-shakes to ~2–4 KB | ~3 KB | Zod 4.6.7 server-only |
| Spam | **Cloudflare Turnstile** (free, unlimited) | Invisible for most humans | loaded only when form sheet opens | hCaptcha |
| Email | **Resend 6.34.1** (free 3,000/mo, 100/day) | Already in use | server only | Brevo |
| Lead storage | **Cloudflare D1** (free tier) as source of truth + **HubSpot Free CRM** (1,000 contacts) *or* Google Sheet mirror — owner choice (Q6) | Lead is saved before anything else | server | Airtable |
| CMS | **Keystatic** (`@keystatic/core` 0.6.9, `@keystatic/astro` 6.0.0) in GitHub mode | Owner edits testimonials, seats, prices, guides in a friendly UI; content stays in git; $0 | 0 KB public | Decap CMS 3.17.1 |
| Booking | **Cal.com** free (1 user) link from Answer Key | Trial slot in one tap | link-out | Calendly free |
| Analytics | **Cloudflare Web Analytics** (cookieless) + **GA4 + Consent Mode v2** only after consent, for lead events | Privacy-first baseline + funnel | ~1 KB; GA after consent | Plausible (paid) |
| Perf monitoring | **web-vitals 6.2.3** → GA4 (after consent) / CF | Field LCP/INP/CLS | 3.3 KB | Vercel Speed Insights |
| SEO | Hand-written `<head>` component + `schema-dts` 2.1.0 (types only) + **@astrojs/sitemap 3.7.4** | Full control | 0 KB | astro-seo 1.2.0 |
| Images | Astro `<Picture>` + **sharp 0.35.5** (build) | AVIF/WebP srcset | 0 KB | — |

Dropped deliberately: Framer Motion/`motion` (duplicate of GSAP), split-type (stale 2023), Barba (stale 2024), Howler (stale 2023), curtainsjs (stale 2024), three.js (180 KB).

## 5.1 Performance budget (hard, enforced in CI)

| Metric | Budget (mobile, Slow 4G + 4× CPU lab / field p75) | Today |
|---|---|---|
| LCP | **≤ 1.8 s lab / ≤ 2.5 s field** | 2.6–3.8 s |
| INP | ≤ 200 ms field (lab TBT ≤ 150 ms) | unknown |
| CLS | ≤ 0.05 | 0 |
| JS before LCP | **≤ 15 KB** (Lenis desktop, inline bootstrap) | ~272 KB |
| JS total home (incl. deferred GSAP + Preact form) | **≤ 90 KB** gz | — |
| Fonts | ≤ 4 files, ≤ 120 KB | 40–43 files |
| Home first view weight | **≤ 450 KB** (excl. video) · full scroll ≤ 1.5 MB | 600–780 KB |
| Video | 0 KB until tapped (A) / ≤ 1.5 MB loop on Wi-Fi only (B) | — |
| Requests first view | ≤ 25 | 70–74 |
| Lighthouse mobile | Perf ≥ 95 · A11y 100 · BP 100 · SEO 100 | not measured (PSI quota) |

**Techniques:** text-based LCP (hero sentence) painted from HTML; handwriting as inline SVG (no request); GSAP loaded via `requestIdleCallback` after LCP; islands `client:visible`; images AVIF with exact `sizes`; one grain texture; no third-party script before consent; fonts subset + preload 1.

**Device tiers (decided once at boot, stored on `<html data-tier>`):**
| Tier | Condition | Experience |
|---|---|---|
| **Full** | fine pointer, no reduced motion, no Save-Data, `hardwareConcurrency ≥ 6` | Lenis, cursor, pinned Method, all pen animations, Video B loop |
| **Touch** (default mobile) | coarse pointer or 4–5 cores | Native scroll, pen animations, Flip, swipe decks; no pin, no cursor, video poster only |
| **Lite** | `prefers-reduced-motion`, Save-Data, ≤ 4 cores or `deviceMemory ≤ 2` (Chromium hint only) | Final states static, no GSAP loaded at all, no video, no grain; identical content |

---

# 6. LEAD CAPTURE · SEO · AI SEARCH

## 6.1 Lead capture ("Hold a seat")
**Form = bottom sheet (mobile) / side sheet (desktop), 3 steps, progress shown as pen ticks ✓✓○:**
1. **Who's learning?** chips: "My child 6–10 / 11–17", "Me (adult)", "IELTS" (pre-selected from context: seat tapped, programme page, Level Ladder).
2. **What matters most?** chips (speaking confidence / school grades / IELTS band / work) + optional preferred days.
3. **Where should I send your answer key?** Parent's name, Zalo/phone (`+84` helper, auto-format), optional email; **unticked** consent checkbox with plain-language PDPL notice per locale; invisible Turnstile.
- Micro-interactions: chip select = pen circle draws around chip (240 ms); valid field = small ✓ in margin; error = pen writes the hint in the margin + `aria-live`. Submit button: "Get my answer key →" (never looks disabled; shows what's missing instead).
- Always visible: "Prefer to chat? Zalo me" link.

**Pipeline (lead API, Cloudflare Worker):**
```
POST → Turnstile verify → Valibot validate → origin check → rate limit (D1/KV, per IP+phone)
     → INSERT lead into D1 (+ consent text version, locale, source, UTM)   ← must succeed, else 503 + Zalo fallback
     → async: mirror to HubSpot/Sheet · notify teacher (Resend email + Telegram/Zalo bot ping with one-tap "Zalo this parent" link)
     → response: token → /answer-key/[token] (localized price sheet + Cal.com trial booking + seat held 48 h)
     → if email given: localized confirmation email (same Answer Key)
```
**Follow-up (manual on Zalo first; automate later):** ≤ 1 h personal message/call (business hours) → Day 1 price sheet + map + parking → Day 3 one testimonial/video from a similar family → Day 7 "your seat in [group] is still free — hold it?" → Day 30 check-in, then stop. Lead status tracked in CRM: new → contacted → trial booked → trial done → enrolled / lost (reason).

**Events (GA4 names, after consent; key event ★):** `hero_correction_tap`, `ladder_change` (programme), `seat_tap` (group), `form_open` (source), `form_step` (1–3), `form_error` (field), `generate_lead` ★ (programme, age band, locale), `answer_key_view`, `book_trial_click` ★, `zalo_click` (location), `phone_click`, `video_play` (A/B), `language_switch`.

## 6.2 SEO & AI search
- **Locales:** `/vi/` (default, `x-default` → `/vi/`), `/en/`, `/zh/`, `/ru/`; 301 all old URLs.
- **Metadata per page & locale** (title ≤ 60, description ≤ 155), e.g.:
  - Home VI: "Lớp tiếng Anh nhóm nhỏ Phú Nhuận · Giáo viên nước ngoài | Teacher Bek"
  - Young Learners VI: "Tiếng Anh cho bé 6–10 tuổi tại Phú Nhuận · Tối đa 10 bé/lớp"
  - IELTS EN: "IELTS Preparation in Phu Nhuan · Small Groups | Teacher Bek"
  - Per-locale OG image (corrected sentence on paper).
- **Schema (one `@graph`, stable `@id`s):** `EducationalOrganization` + `LocalBusiness` (address, geo, `openingHoursSpecification`, telephone, `areaServed` with Wikidata Q1854 HCMC ✓, `sameAs` GBP/FB/IG/TikTok/LinkedIn), `Person` (verified credentials only), `Course` ×4 with real `offers` and `hasCourseInstance` (schedule), `BreadcrumbList`, `Article` for guides. **No FAQPage** for rich results (Google stopped showing them 2026-05-07) and **no self-serving AggregateRating** (ineligible per Google review-snippet docs, updated 2026-09-08). FAQ stays as visible text.
- **Entity signals:** identical NAP everywhere; Google Business Profile (category "English language school"), weekly photo, review requests after month 1; Facebook page + Zalo OA linked both ways; local directories.
- **AI answers:** a "Fast facts" block on home and each programme (who, ages, group size, schedule, area, price range, how to book) in every language; guides answer one question in the first two sentences.
- **robots.txt:** allow Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User; training bots (GPTBot, ClaudeBot, Google-Extended, Applebot-Extended — the last unverified) = owner's choice, default allow.
- **llms.txt:** rewrite with correct domain and real URLs (low priority — no major engine confirmed to use it; Google says it's not needed).
- **Guides (launch 4–6, VI + EN):** "Học tiếng Anh ở Phú Nhuận giá bao nhiêu (2026)?", "Lớp nhóm nhỏ hay học 1 kèm 1 cho bé?", "Bé mấy tuổi nên bắt đầu học IELTS?", "Checklist chọn trung tâm tiếng Anh cho con", "How we report progress to parents", "The 10 mistakes Vietnamese learners make (and how we fix them)" — the last one doubles as the hero mistake library.
- **Analytics setup:** Cloudflare Web Analytics; GA4 property with Consent Mode v2 (default denied), key events ★; Search Console + Bing Webmaster owned by the owner; monthly Looker Studio one-pager (visits → form opens → leads → trials → enrolled).

---

# 7. WHAT YOU HAVEN'T THOUGHT OF

| Item | What a top agency would include |
|---|---|
| Proof production | Testimonial collection kit (WhatsApp/Zalo script + consent form in VI), 3 short parent video clips, before/after work samples (with consent) |
| Photo/video shoot | Shot list §3.5, consent forms for every child/parent, usage rights from photographer |
| Handwriting asset | Scan session: owner writes 20 marks/words ×3 takes; vectorised; style sheet |
| Booking | Cal.com trial slots synced to owner's calendar; reminder SMS/Zalo the day before |
| Multilingual ops | One translation source; native review for ZH/RU; per-locale OG images; Vietnamese is primary, not English |
| Legal | PDPL-compliant privacy notice ×4 languages, consent log, children's data clause, processor list, retention (e.g. 24 months), data request contact; terms for trial/refunds; lawyer review |
| Cookie consent | Small bottom banner (not a wall), "Accept analytics / Only essential"; GA blocked until accepted; Cloudflare analytics needs no consent |
| 404 & empty states | Designed (§4.2); "no seats" state; offline state; form failure → Zalo fallback |
| Accessibility | WCAG 2.2 AA: target size, focus not obscured (sticky bar!), contrast, captions on video, reduced motion, keyboard-operable seat map and slider, accessibility statement |
| Emails | Branded notification + confirmation templates in 4 languages |
| Monitoring | Uptime check on home + lead API; daily synthetic "test lead" flagged `test=true`; alert to owner's Telegram/Zalo if the lead API fails |
| Backups | D1 nightly export; CRM monthly CSV; git is the content backup |
| Ownership | Domain, Cloudflare, Resend, GA, GBP, Search Console under the owner's email with 2FA; a one-page "keys & accounts" doc |
| Who updates what | Owner via Keystatic: seats (weekly, 1 min), testimonials, prices, schedule, guides. Developer: quarterly dependency update + Lighthouse check (~1–2 h) |
| Ongoing cost | §8.4 |
| Launch marketing | Zalo OA broadcast to current parents, GBP post, Facebook groups for Phú Nhuận parents, QR poster at the classroom door |
| Awwwards submission | Submit after launch with case-study page; fee ~$50–60 per submission (verify on awwwards.com at the time) |

---

# 8. EXECUTION

## 8.1 Phased roadmap (developer-agent instructions)
> Rules: branch per phase; never break the live lead flow; each phase ends with acceptance criteria met on a preview URL; Lite tier must always work.

**Model allocation rules (owner wants cheaper models; Opus is never used):**
- Default = **Haiku**. Escalate to **Sonnet** only when a task needs design judgment, multi-file architecture, or debugging.
- Owner-only tasks (answers, shoot, handwriting, testimonials, approvals) are marked **Owner**; the model that prepares the materials is named in brackets.
- A **Sonnet reviewer pass** (diff review against the phase's acceptance list) closes every phase.
- Run independent Haiku tasks in parallel (separate branches/worktrees or disjoint files); Sonnet tasks that touch shared files run sequentially.
- Every agent must run the phase's acceptance checks relevant to its task and report pass/fail with evidence (command output, URL, screenshot path) before the step is closed.

**Phase 0 — Fix the live site (1–2 days, before anything else)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P0.1 | Ask owner to commit or discard the 18 uncommitted files | Owner (Haiku prepares `git status` summary) | Only the owner can decide what to keep |
| P0.2 | Fix mobile menu close (stacking order / z-index of the close button in `components/VanguardNavigation.tsx`; Escape and back close it) | Sonnet | Stacking-context debugging, a11y behaviour |
| P0.3 | Replace the Carto map with a static image + "Open in Google Maps" link | Haiku | Mechanical swap, well specified |
| P0.4a | Verify production env (`RESEND_API_KEY`, `CONTACT_NOTIFY_EMAIL`, Resend domain) | Owner (Haiku prepares checklist) | Needs owner's Vercel/Resend access |
| P0.4b | `/api/pricing-lead` must not report success on failure; persist leads (Sheet/HubSpot) before emailing; read the honeypot's real value; add Turnstile | Sonnet | Lead-pipeline logic across several files |
| P0.5a | Rewrite `public/llms.txt` (correct domain, real URLs) | Haiku | Static text file |
| P0.5b | Hide empty "Reads" band | Haiku | Remove/conditional render |
| P0.6 | Run PSI with API key for /vi and /en (mobile + desktop); save to `docs/audits/2026-10-psi-baseline.json` | Haiku | Run tool and report |
| P0.7 | Semrush fix: remove `wa.me/84353885757` links (`VanguardFooter.tsx:71`, `VanguardInquiry.tsx:515`, `app/api/contact/route.ts:216`) unless Q15 = yes; fix footer zalo.me link labelled `t("telegram")` (`VanguardFooter.tsx:70`) | Haiku | Link and label fix, file:line known |
| P0.8 | Semrush fix: exactly one `<h1>`, shared by mobile and desktop hero (`VanguardHero.tsx:116` and `:316`) | Sonnet | Restructures the dual-layout hero without breaking either |
| P0.9 | Semrush fix: remove `/community` and `/blog` from `app/sitemap.ts` PRIMARY_ROUTES; 301 the `/about`, `/services`, `/faq` stubs | Haiku | Config edit |
| P0.10 | Re-run Semrush Site Audit after Phase 0 deploy to get a fresh crawl (current data is 2026-03-11); record Site Health, errors, warnings | Haiku | Run and report |
| P0.11 | Reviewer pass on the Phase 0 diff vs acceptance list | Sonnet | Diff review |
- **Accept:** menu closes by X, Escape, back; map has no watermark; 4 test leads (one per locale) stored + emailed; forced email failure still stores the lead and shows Zalo fallback; PSI baseline saved; no `wa.me` links unless Q15 = yes; footer label matches its link; exactly one `<h1>` per page on all locales (DOM check); sitemap lists only live indexable routes; fresh Semrush crawl saved with 0 sitemap-orphan and 0 multiple-H1 findings.

**Phase 1 — Content & assets (owner-heavy, 1–2 weeks; can overlap Phase 2a)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P1.1 | Answer Q1–Q15 | Owner (Haiku prepares a one-page answer form) | Only the owner knows |
| P1.2 | Copy deck (VI master + EN) | Sonnet | Voice, parent-language copywriting |
| P1.3 | Mistake library (10 sentences per age band) + FAQ drafts | Sonnet | Linguistic judgment |
| P1.4 | Photo/video shoot per §3.5 with consents | Owner (Haiku prepares shot list + VI consent form template) | Physical task |
| P1.5 | Select, grade, convert photos to AVIF/WebP at srcset sizes | Haiku | Mechanical image conversion |
| P1.6 | Handwriting: owner writes 20 marks ×3 takes | Owner (Haiku prepares the sheet) | Owner's hand is the asset |
| P1.7 | Scan → vectorise to SVG set, optimise paths | Haiku | Scripted trace, spec-driven |
| P1.8 | Collect testimonials with written consent | Owner (Haiku prepares Zalo script + consent form) | Owner relationship |
| P1.9 | ZH/RU translation drafts | Sonnet | Nuanced translation |
| P1.10 | ZH/RU native review and sign-off | Owner | Needs a native reviewer |
| P1.11 | Enter approved content into repo/CMS files | Haiku | Copy-paste from signed-off deck |
| P1.12 | Reviewer pass: content vs Q answers (§8.2 content truth) | Sonnet | Judgment |
- **Accept:** signed-off copy in VI/EN (ZH/RU or deferred), 25+ graded photos, 2 videos, 20 SVG marks, ≥ 5 consented testimonials.

**Phase 2a — Design system & prototypes (1–2 weeks)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P2a.1 | Tokens (colour, type, spacing, motion) as CSS variables; tune type scale | Sonnet | Design-system judgment |
| P2a.2 | Contrast check of every token pair; report | Haiku | Script and report |
| P2a.3 | Font subsetting (Playfair v2, Inter) + fallback metrics (`size-adjust`) | Haiku | Well-specified tooling |
| P2a.4 | Mobile-first hi-fi designs (390 px): hero, Level Ladder, seat map, form sheet steps, Answer Key, 404; then desktop 1440 | Sonnet | Page composition |
| P2a.5 | Motion prototypes: hero correction, Level Ladder Flip, seat tap → sheet, Answer Key unfold | Sonnet | Signature interactions |
| P2a.6 | Test prototypes on low-end Android (60 fps) and render the VI/RU test string in both fonts; report | Haiku | Run checks and report |
| P2a.7 | Owner approves designs | Owner | Approval |
| P2a.8 | Reviewer pass on tokens and prototypes | Sonnet | Visual QA vs designs |
- **Accept:** owner approves designs; prototypes run at 60 fps on a ≤ 4-core Android; VI diacritics and RU render in both fonts with no fallback glyphs (test string: "Tiếng Việt: ặ ẫ ỗ ữ ự ợ đ — Русский: Щёлкнуть").

**Phase 2b — Build (2–3 weeks)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P2b.1a | Scaffold Astro 7.4.1 + Tailwind 4.3.3 + @astrojs/cloudflare 14.4.1 + @astrojs/sitemap 3.7.4 + @astrojs/preact 6.1.0; i18n routes | Haiku | Versions and config fully specified |
| P2b.1b | Tier detection script (inline, < 1 KB) | Sonnet | Device-capability logic |
| P2b.2 | Keystatic 0.6.9 collections: programmes, groups (seats, schedule, updatedAt), testimonials, mistakes, FAQs, guides, settings | Sonnet | Schema design across the site |
| P2b.3 | Build pages §4.2 and sections §4.1 as static components (exactly one `<h1>` per page, no duplicated hero DOM) | Sonnet | Composition and responsive design |
| P2b.4 | Islands: FormSheet, LevelLadder (Preact) | Sonnet | Interactive UX, accessibility |
| P2b.5 | Motion layer: GSAP 3.15.0 lazy module (+ScrollTrigger, SplitText, DrawSVG, Flip); Lenis 1.3.27 for Full tier; View Transitions CSS | Sonnet | Animation craft |
| P2b.6a | Lead API Worker + D1 schema (`leads`, `consents`) + Turnstile + origin check + rate limit + Answer Key route (noindex) | Sonnet | Pipeline architecture, failure modes |
| P2b.6b | Resend templates ×4 + teacher ping | Haiku | Fill spec'd templates with approved copy |
| P2b.7a | SEO: head component, hreflang + x-default, sitemap with alternates and real lastmod, robots.txt, OG images per locale, 301 map from old URLs | Haiku | Spec'd config |
| P2b.7b | One JSON-LD `@graph` on the Google-documented field whitelist (see rules below) | Haiku | Field cleanup from a spec |
| P2b.8 | Legal pages (privacy, terms) per shipped locale, plain language, ≥ 300 words | Sonnet | Legal-adjacent drafting |
| P2b.9 | Lawyer review of PDPL notice, consent wording, legal pages | Owner | Needs a Vietnamese lawyer |
| P2b.10a | Consent banner + GA4 Consent Mode v2 architecture | Sonnet | Privacy/analytics architecture |
| P2b.10b | Wire events §6.1 + web-vitals + Cloudflare Web Analytics | Haiku | Spec'd event list |
| P2b.11 | CI: `astro check`, lint, Lighthouse CI with §5.1 budgets (fail on regression), link check, axe, plus Semrush-derived gates (rules below) | Haiku | Config from a spec |
| P2b.12 | Enter approved content into Keystatic | Haiku | Content entry |
| P2b.13 | Debug performance until budgets pass | Sonnet | Perf debugging |
| P2b.14 | Reviewer pass on the build diff vs acceptance list | Sonnet | Diff review |
- **Rules added from Semrush (§2.3), enforced in CI or build:**
  - **Schema whitelist:** only Google-documented fields (Course + `hasCourseInstance` + `offers`); no `courseWorkload`, `instructor`, `courseSchedule`, `category`, `serviceType`; one compact `@graph`. Rich Results Test + schema validator on every locale; CI fails on any unlisted field.
  - **robots:** never disallow `/_next/`, `/_astro/`, static assets, JS/CSS or images.
  - **Legal pages:** ≥ 300 words per shipped locale; no empty or sub-100-word index pages (no blog index without posts).
  - **hreflang:** emitted only for locales whose page is actually translated; untranslated pages get no hreflang + `noindex`. A locale ships only when its privacy/terms are translated.
  - **Text/HTML ratio:** CI check ≥ 10% on content pages (compact JSON-LD, no duplicated DOM).
  - **Title length:** rendered `<title>` ≤ 60 chars including suffix, every locale and page (CI check).
  - **Link checker:** all internal and external links; treat HTTP 429 as warn-and-retry, not failure.
  - **Headings:** exactly one `<h1>` per page, same element for mobile and desktop.
  - **Sitemap:** generated only from live indexable routes.
- **Accept:** all budgets pass in Lighthouse CI; end-to-end lead test on preview in 4 locales; Lite tier verified; zero axe violations; schema gate, title-length, text/HTML and link-check jobs green; Rich Results Test valid for every shipped locale.

**Phase 3 — Launch (2–3 days)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P3.1 | DNS to Cloudflare | Owner (Haiku prepares step-by-step runbook) | Owner holds the registrar |
| P3.2 | HSTS `includeSubDomains`; verify 301 map from old sitemap, report any 404 | Haiku | Config + scripted check |
| P3.3 | Submit sitemap to Search Console and Bing | Owner (Haiku prepares instructions) | Owner owns the accounts |
| P3.4 | Update GBP, Zalo OA, social links | Owner (Haiku prepares the NAP/link list) | Owner owns the accounts |
| P3.5 | Synthetic test-lead monitor + uptime alerts on | Haiku | Spec'd config |
| P3.6 | Fresh Semrush Site Audit on production; report vs §8.2 targets | Haiku | Run and report |
| P3.7 | Reviewer pass: launch checklist | Sonnet | Diff and config review |
- **Accept:** no 404s from old sitemap; first real lead stored + notified; Search Console clean after 7 days; Semrush Site Health ≥ 95%, 0 errors.

**Phase 4 — Polish & grow (ongoing)**
| Step | Task | Model | Why that model |
|---|---|---|---|
| P4.1 | Monthly: update seats + testimonials | Owner (Haiku prepares reminder + Keystatic checklist) | Truthful seat data is the owner's |
| P4.2 | Monthly: write one guide | Sonnet | Editorial quality, SEO |
| P4.3 | Monthly: funnel review report | Haiku | Pull metrics and report |
| P4.4 | Monthly: one A/B (hero mistake set or CTA copy) | Sonnet | Hypothesis and copy judgment |
| P4.5 | Quarterly: dependency updates + Lighthouse + Semrush re-crawl | Haiku | Routine, reported |
| P4.6 | Submit to Awwwards after 2–4 weeks of stable data | Owner (Sonnet writes the case-study page) | Owner's account and fee |

## 8.2 Design QA checklist
Tags show who executes each item: [Haiku] runs checks and reports, [Sonnet] judges, [Owner] decides or supplies devices/truth.
- [ ] **[Sonnet] Motion feel:** every animation uses the motion tokens; no text ever visible half-faded for > 300 ms; sequences ≤ 900 ms; pen strokes look hand-paced (not linear); 60 fps on low-end Android (Chrome Performance panel, no long tasks > 50 ms during scroll).
- [ ] **[Sonnet] Pixel fidelity:** build overlaid on designs at 390 and 1440 px — type sizes ±1 px, spacing tokens only, margin line aligned, no orphaned words in headlines (use `text-wrap: balance`).
- [ ] **[Owner] Real devices** (Haiku prepares the test script and logs results): low-end Android (≤ 4 GB RAM, Chrome), mid iPhone (Safari), iPad, Zalo in-app browser, Facebook in-app browser; light + dark; VI/EN/ZH/RU.
- [ ] **[Haiku] Mobile:** no horizontal scroll at 320/360/390/414; all targets ≥ 44 px; sticky bar never covers focused input (WCAG 2.4.11); safe-area insets respected.
- [ ] **[Haiku] Lighthouse (PSI, mobile):** Perf ≥ 95, A11y 100, BP 100, SEO 100 on home + one programme page, every locale.
- [ ] **[Haiku] Throttled lab:** LCP ≤ 1.8 s, JS before LCP ≤ 15 KB, first view ≤ 450 KB.
- [ ] **[Haiku] Form test:** each locale; each step's errors; invalid phone; Turnstile fail; email provider down (lead still stored + fallback); D1 down (503 + Zalo fallback); duplicate submit; rate limit; Answer Key link opens on another phone.
- [ ] **[Haiku] Tiers:** reduced motion = static complete content; Save-Data = no GSAP/video/grain; keyboard-only can use slider, seat map, sheet, menu.
- [ ] **[Haiku] SEO:** Rich Results Test valid; hreflang validator clean (only translated locales); one h1 per page; canonical/OG correct per locale.
- [ ] **[Haiku] Semrush re-crawl:** Site Health ≥ 95%, 0 errors; 0 invalid structured data, 0 blocked internal resources, 0 broken links (429 excluded), 0 orphaned sitemap pages, 0 hreflang mismatches, 0 multiple-H1; every title ≤ 60 chars; no page under 300 words (legal) or 10% text-to-HTML ratio.
- [ ] **[Haiku] Consent:** no GA request before acceptance (network panel); consent stored with each lead.
- [ ] **[Owner] Content truth** (Sonnet cross-checks against Q answers): every number, credential and testimonial traceable to owner confirmation.
- [ ] **[Sonnet] Final visual QA** of all pages vs approved designs, light + dark, VI/EN (+ ZH/RU if shipped).

## 8.3 Risks & trade-offs
| Risk | Mitigation |
|---|---|
| Award visuals vs speed | Type/SVG/photo concept, no WebGL; GSAP after LCP; CI budgets block regressions; tiers |
| Concept feels childish to adults/IELTS | Editorial Playfair at extreme opsz, restraint, adult programme pages use fewer marks |
| Content bottleneck (photos, consents, handwriting, testimonials) | Phase 1 starts day 1; build with placeholders but **no launch without real proof** |
| Seat map becomes dishonest | Auto-hide counts if `updatedAt` > 14 days |
| Gated pricing loses price-shoppers | Public "from" price; gate the full sheet + booking; Zalo alternative always visible |
| 4 languages × every change | VI + EN at launch; ZH/RU when reviewed (Q10) |
| Rebuild loses rankings | Same domain, 301 map, more indexable pages at launch |
| Free-tier limits change (Resend 100/day, HubSpot) | D1 as source of truth; monthly cost review |
| PDPL interpretation | Lawyer review of notice + consent wording |
| GSAP licence is "no charge" proprietary, not MIT | Acceptable for this use; CSS fallback exists for every effect |

## 8.4 Effort & running costs

**Effort (agency-equivalent; developer agent + owner):**
| Phase | Design/dev | Owner |
|---|---|---|
| 0 Fix live site | 1–2 days | 1 h |
| 1 Content & assets | — | 10–20 h + shoot day |
| 2a Design system & prototypes | 1–2 weeks | 3–5 h reviews |
| 2b Build | 2–3 weeks | 3–5 h |
| 3 Launch | 2–3 days | 2 h |
| **Total** | **~5–7 weeks elapsed** | **~20–30 h** |

**Running costs (checked 2026-10-20/21):**
| Item | Monthly |
|---|---|
| Cloudflare Workers/Pages + D1 + Turnstile + Web Analytics (free tiers) | $0 |
| Domain `.com` (~$10.1–10.5/yr at Cloudflare Registrar, third-party tracker) | ~$1 |
| Resend free (3,000/mo, 100/day) | $0 |
| HubSpot Free CRM / Google Sheet | $0 |
| Cal.com free | $0 |
| Keystatic (GitHub mode) | $0 |
| Fonts (Playfair v2 + Inter, OFL) | $0 (optional PP Neue Montreal one-off ~$40–150, quote needed) |
| Zalo OA (free basic; paid tiers/ZNS pricing unverified) | $0–16 |
| **Total** | **≈ $1–20 / month** (Vercel Pro alternative adds $20) |
| One-off, owner to quote | Photographer half-day; lawyer review; optional Awwwards submission fee |

---

### Appendix — sources (all checked 2026-10-20/21)
- Awwwards winners 2025: https://www.awwwards.com/annual-awards/winners · SOTY listing: https://www.awwwards.com/websites/sites_of_the_year/ · per-site award pages awwwards.com/sites/<slug> (SOTD/HM dates above).
- Versions: `npm view` — astro 7.4.1, @astrojs/cloudflare 14.4.1, @astrojs/sitemap 3.7.4, @astrojs/preact 6.1.0, preact 11.0.1, tailwindcss & @tailwindcss/vite 4.3.3, gsap 3.15.0 (plugins verified in tarball), lenis 1.3.27, motion 14.4.0, ogl 1.0.11, three 0.186.1, swup 4.10.0, @swup/astro 1.8.0, @keystatic/core 0.6.9, @keystatic/astro 6.0.0, valibot 1.5.0, zod 4.6.7, resend 6.34.1, web-vitals 6.2.3, sharp 0.35.5, schema-dts 2.1.0, next 16.4.2, next-intl 4.14.9. Sizes: bundlephobia gzip.
- GSAP licence: https://gsap.com/community/standards-and-licensing/ · Core Web Vitals: https://web.dev/articles/vitals · WCAG 2.2: https://www.w3.org/TR/WCAG22/ · View transitions & scroll-driven support: caniuse.com · Google AI features: https://developers.google.com/search/docs/appearance/ai-features · FAQ rich results: https://developers.google.com/search/docs/appearance/structured-data/faqpage · Review snippets: https://developers.google.com/search/docs/appearance/structured-data/review-snippet · Crawlers: https://developers.openai.com/api/docs/bots, https://docs.perplexity.ai/guides/bots, Anthropic support 8896518 · Turnstile: https://developers.cloudflare.com/turnstile/plans/ · Resend: https://resend.com/pricing · HubSpot: https://www.hubspot.com/pricing/crm · Cal.com: https://cal.com/pricing · Vercel: https://vercel.com/legal/terms, https://vercel.com/pricing · Cloudflare VN PoPs: https://blog.cloudflare.com/ten-new-data-centers/ · PDPL summary: https://www.tilleke.com/insights/vietnams-new-personal-data-protection-law-a-closer-look/ · Fonts: Google Fonts metadata API; Playfair v2 GitHub README; Pangram Pangram PP Neue Montreal spec page.
- **Unverified (confirm before relying on):** Zalo OA/ZNS official pricing; PP Neue Montreal web licence price; Applebot-Extended docs; 2023–2024 SOTY category assignments; Awwwards submission fee; PDPL penalty figures; production env vars.
