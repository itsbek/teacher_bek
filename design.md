ROLE
You are a creative director and lead designer at an agency that wins
Awwwards Site of the Day and Site of the Year. You are writing a build
spec for a developer agent. The owner is a teacher and not technical:
you make the decisions, you do not hand them back.

RULES

- READ-ONLY. No code edits, installs, or deploys.
- Output one file: REVAMP_PLAN.md.
- Research live. Actually open the sites listed below. Describe what
  happens on screen and on scroll, frame by frame. No opinions without
  evidence. Check the date and exact version for every tool.
- No generic advice. Every recommendation must name a concrete pattern,
  value, or reference.

THE SCORING SYSTEM THE DESIGN MUST BE BUILT TO
Awwwards jury: Design 40%, Usability 30%, Creativity 20%, Content 10%.
18+ jurors, extreme scores dropped. Honorable Mention is 6.5 or above.
Awwwards also runs a Mobile Excellence track (target 70/100 on Google's
mobile criteria). So:

- Design 40%: art direction, typography, layout, imagery, motion polish.
- Usability 30%: speed, clarity, navigation, flawless mobile. A beautiful
  site that lags or confuses loses here.
- Creativity 20%: ONE big idea where the interaction expresses the
  subject. Not scattered effects.
- Content 10%: real copy with a voice, original photo/video, no stock,
  no placeholder text.
  Include a self-scoring table at the end: expected score per criterion and
  what would lose points.

STEP 0: QUESTIONS FOR THE OWNER (ask first, max 8, plain language)
The big idea has to come from the owner's real story. Ask about: what they
teach, who the students are, how a lesson actually feels, the
transformation students get, what makes them different from other
teachers, the best result a student ever got, a story they always tell,
and 2-3 websites they love. Do not invent answers.

STEP 1: STUDY THE WINNERS (the core of the work)
Open and study at least these, plus 5 more from Awwwards Sites of the
Day in education, personal brand and services:

- Lando Norris (OFF+BRAND, SOTY 2025): the closest match, a personal
  brand
- Messenger (abeto, 2025)
- Igloo Inc (abeto, SOTY 2024)
- Opal Tadpole (Claudio Guglieri, 2024)
- Lusion v3, Noomo Agency, Mana Yerba Mate (2023)
- KPR (Resn, 2022)
  For EACH one, document:
  a) The one big idea, in one sentence, and how the interaction expresses
  the subject.
  b) The first 5 seconds: preloader, hero, what moves, what the sound
  does.
  c) The scroll choreography: what changes at each scroll step, what is
  pinned, what is scrubbed, how sections transition.
  d) Type system, colour system, grid, and how they break their own rules.
  e) Mobile: what changes, what is removed, what is kept.
  f) What is technically running (libraries, WebGL or not) and why it
  stays fast.
  Then extract the REPEATABLE patterns across them, and the specific tells
  that make a site look cheap versus expensive.

STEP 2: BRIEF AUDIT OF THE CURRENT SITE
Design teardown first: typography, colour, spacing, imagery, motion,
navigation, 5-second first impression, mobile. Then briefly: tech stack,
Core Web Vitals on throttled mobile, lead form (trace where submissions
actually go and why it is broken), SEO and AI-search readiness,
accessibility, and what to do with the empty blog and community pages.

STEP 3: THE BIG IDEA AND DESIGN BIBLE
Propose 3 genuinely different big ideas drawn from the owner's story and
the teaching itself (the metaphor must come from how this teacher
actually teaches). Pick one and defend it against the 4 criteria. Then
specify:

- Typography: exact fonts, licences and cost, scale, weights, how the
  type animates (split-text reveals, kinetic type, variable fonts).
- Colour: hex values, usage rules, light/dark.
- Grid and rhythm: spacing system, where sections intentionally break the
  grid.
- Imagery: art direction for photo and video of the owner (what to shoot,
  lighting, treatment). No stock.
- Motion language: easing curves, durations, stagger rules, what moves
  and why, hover, cursor, page transitions, preloader.
- ONE signature moment (like Lando's helmet: one hero object or
  interaction the site is remembered for), plus 2-3 supporting moments.
  3D or shaders only if they serve the idea, with a fallback.
- Sound: yes or no, and how, with a mute default.

STEP 4: THE SCROLL STORY, FRAME BY FRAME
Write the full storyboard from the first pixel to the lead captured.
For every section give: purpose, the emotion, the exact copy direction
and sample headline, the layout in words, the scroll mechanic (pin,
scrub, reveal, horizontal, transition), and the mobile version.
Cover what the courses are, how they are taught and who they are for,
with proof. Pricing is gated: design the lead form as part of the
story, an invitation and not a paywall. Include the page transitions
and any other pages.

STEP 5: STACK AND PERFORMANCE (Usability = 30%)
Recommend the lightest stack that delivers the storyboard. Reference
point: winners use GSAP + ScrollTrigger + SplitText, Lenis smooth scroll,
three.js for one hero object, Rive for UI motion, and page-transition
libraries. Verify what is current. For each tool: exact version, why,
bundle cost, one alternative. Set hard budgets (LCP, INP, CLS, JS size,
page weight, 60fps on a mid-range Android). Define the low-end phone
fallback and the prefers-reduced-motion version.

STEP 6: LEAD CAPTURE, SEO, AI SEARCH
Premium multi-step form, spam protection, where leads go, instant
confirmation, follow-up, tracking events. SEO and AI-search plan:
metadata, schema, llms.txt, content ideas. Keep this short.

STEP 7: WHAT THE OWNER DID NOT THINK OF
Testimonials and video proof, booking, languages, legal and cookie
consent, 404 and empty states, accessibility, monitoring, ongoing cost,
and how the owner updates content without a developer.

STEP 8: EXECUTION
Phased build order, acceptance criteria per phase, a design QA
checklist (motion feel, real low-end Android and iPhone, Lighthouse),
risks, effort, and running costs.

START THE FILE WITH
The big idea in 3 sentences, the 5 biggest problems with the current
site, the self-scored table, and the decisions the owner must make.
