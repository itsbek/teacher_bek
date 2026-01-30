1. TYPOGRAPHY AS THE HERO ELEMENT
Replace your Playfair Display hierarchy with kinetic editorial typography
Prompt for Developer:

    "Transform the Hero section into a dynamic typographic stage. Use Variable Font (like 'Fraunces' or 'Satoshi Variable') to create weight/width animations on scroll.
    Technical Requirements:

        Implement ** SplitType.js** to break each headline into lines/words/chars
        Create a staggered reveal: Characters fade in with y: 100% → 0% masked overflow, each char delayed by 0.02s using Framer Motion variants
        Add hover kinetic typography: When user hovers over the H1, letters subtly increase weight (wght axis 400→700) and spread (tracking increases) using CSS variable font animations
        Scroll-linked morphing: As user scrolls down, the Hero headline doesn't just fade—it compresses vertically (scaleY 1→0.8) and gets clipped by a diagonal mask, creating a 'wiping to next chapter' effect
        Use negative leading (-5% to -10%) on massive display text for that editorial magazine look"

Awwards Parallel: Check K72's website or Locomotive's typographic hero treatments.
2. THE "TEACHER'S CURSOR" SYSTEM
Replace standard cursor with contextual, morphing interaction
Prompt for Developer:

    "Build a custom cursor system that behaves like a teacher's red pen/highlighter:
    States:

        Default: Small circle (12px) with mix-blend-mode: difference inverting colors beneath it
        Text Hover: Morphs into a vertical I-beam with a reading highlight—as you hover over paragraph text, the cursor creates a subtle yellow/glow backdrop behind the current word (using JS to track text nodes and wrap spans)
        Button Hover: Expands to 60px and magnetically snaps to button centers with spring physics (stiffness: 150, damping: 15)
        Section Transition: When scrolling between sections, cursor briefly becomes a 'page turn' icon (SVG morph)
        Draw Mode: Holding left-click for 0.5s activates 'annotation mode'—cursor leaves a fading ink trail (SVG path following mouse with 0.1s delay) then snaps back

    Technical: Use useEffect with mouseenter listeners on text nodes. Don't use CSS-only :hover for the text highlight—use JS to calculate exact word position and animate a pseudo-element."

Why this wins: SOTY sites have cursor narratives (igloo.inc's custom cursor follows their 3D, yours follows the "teaching" metaphor).
3. SCROLL PHYSICS AS STORYTELLING
Replace standard scroll with "page-turning classroom book" physics
Prompt for Developer:

    "Implement Lenis smooth scroll with custom velocity-based transforms that mimic riffling through a textbook:
    Scroll Behaviors:

        Velocity Skew: transform: skewY(clamp(-3deg, velocity * 0.5deg, 3deg)) applied to the entire main container—when scrolling fast, content leans in direction of scroll (creates momentum sensation)
        Parallax Layers:
            Background elements move at 0.2x speed
            Text content at 1.0x (normal)
            Floating 'margin notes' (decorative elements) at 1.5x speed (foreground)
        Section Snap-points: After 60% scroll through Hero, gently snap to the Courses section (CSS scroll-snap-type: y proximity) but with bezier easing (snap feels "heavy" like a book page settling)
        Progress Bar as Bookmark: Replace scrollbar with a vertical bookmark ribbon on the right—golden/shimmering that unfurls as you scroll down, with chapter markers (Hero, Courses, Testimonials) as embossed tabs

    Critical Detail: Add scroll-direction awareness—when scrolling UP, all entrance animations play in reverse (exit animations) so the site feels reversible, not just one-way."

Tool: @studio-freight/lenis + Framer Motion useScroll + useVelocity.
4. MICRO-INTERACTION OBSESSION SYSTEM
Every clickable element must have "physical" response
Prompt for Developer:

    "Audit every interactive element and add secondary motion:
    Buttons (CTAs):

        Magnetic hover: Button moves 20% toward cursor position within 30px radius (use onMouseMove calculating relative X/Y, transform translate)
        Liquid fill: On hover, background doesn't just change color—a circular ripple expands from cursor entry point to fill button (CSS clip-path animation or pseudo-element scale)
        Click compression: On mousedown, button squishes vertically (scaleY: 0.9) with spring physics, then rebounds
        Sound trigger: Prepare onMouseEnter audio hooks (pencil scratch WAV file at 20% volume—see Section 7)

    Course Cards:

        3D Tilt: On hover, card rotatesX/Y toward cursor (max 10deg) using perspective: 1000px + transform rotate
        Gloss reflection: A white gradient sweeps diagonally across card on hover (::before with translateX animation)
        Image parallax: Card image scales 1.1x and moves opposite to cursor (parallax within card boundaries)
        Dropdown cascade: When opening FAQ accordions, items don't just slide—they stagger in from above with overshoot easing (back.out(1.7))

    Text Links:

        Strikethrough reveal: Underline draws from left to right (width 0%→100%), then second line draws OVER it in different color (double underline effect)
        Letter scramble: On hover, link text briefly scrambles (A→@→A) using a letter-substitution algorithm before resolving"

Why this matters: SOTY jury checks if you "cared about the details." Bruno Simon's portfolio won because even the page titles animate when you brake the car .
5. ASYMMETRIC EDITORIAL LAYOUT
Break the centered-container / 12-column grid
Prompt for Designer:

    "Redesign the layout system to use broken grid / magazine spread architecture:
    Hero Section:

        60/40 asymmetric split: Left side massive typography (bleeding off viewport), right side photo with text wrap (text flows around circular mask image)
        Use CSS shape-outside: circle(50%) to make text conform to image contours
        Negative space: Massive padding (20vh) above headline, but 0px below—creates 'dropping into content' tension

    Course Section:

        Horizontal scroll gallery (not vertical stack): Cards arranged on a horizontal axis, scroll vertically to move horizontally (scroll-jacking section—use with caution but effectively)
        Or overlapping planes: Course cards overlap by 40px, staggered z-index with slight rotation (-2deg, 0deg, +2deg) like scattered flashcards on a desk
        Prices 'floating' detached from cards, positioned absolute with connecting SVG lines (diagram aesthetic)

    Testimonials:

        Full-bleed section with parallax window: Background moves at 0.5x, quote text at 1x, attribution at 1.2x
        Pull quote treatment: Key phrase is extracted and displayed in 8rem italic text, positioned absolute overlapping the card boundary

    Typography Scale:

        4XL headline: 15vw (viewport width) on desktop, breaking container bounds
        Body: 1.25rem (larger than standard 16px—premium feel)
        Line height in headlines: 0.85 (tight, editorial)"

Reference: Study Locomotive's asymmetric hero or Moooi's broken grids.
6. CONTENT CHOREOGRAPHY & REVEALS
Don't show everything at once—create narrative pacing
Prompt for Developer:

    "Implement staged content revelation using Intersection Observer + Framer Motion:
    The 'Curtain' System:

        Every section wrapper has overflow: hidden on Y-axis
        Content enters with y: 100px, opacity: 0, filter: blur(10px) → y: 0, opacity: 1, blur(0)
        Blur creates 'focusing' sensation as if user is waking up to the content
        Trigger at 15% viewport entry (threshold: 0.15)

    Text Reveal Patterns:

        Lines from baseline: Each line of text reveals with clip-path: inset(100% 0 0 0) → inset(0 0 0 0) (revealing from bottom up, like rising text)
        Word masking: Words slide up from behind a mask (overflow hidden container)
        Typewriter with difference: Main headlines use 'decoding' effect—starts as random characters, resolves to correct text over 0.8s (like The Matrix but refined)

    Image Loads:

        Don't fade in—use clip-path wipe: Circle expands from center (0%) to full (150%), or diagonal sweep
        Color to B&W to Color: Images load desaturated, color fills in on scroll progress within viewport

    Stagger Rules:

        Container: 0ms
        Title: 200ms delay
        Subtitle: 350ms
        Body: 500ms
        CTAs: 650ms
        This creates waterfall attention, forcing eye movement down the hierarchy"

7. IMMERSIVE AUDIO LAYER
The secret weapon 99% of sites ignore
Prompt for Developer:

    "Add a subtle audio design system (muted by default, toggle in corner):
    UI Sounds (80-200ms duration, -20dB volume):

        Hover over text: Pencil scratch or paper rustle (ASMR-quality, triggers nostalgia of school)
        Button hover: Soft 'pop' or page flick
        Scroll trigger: When new section enters, subtle 'whoosh' or bell chime (not annoying—more like wind)
        Language switch: Mechanical keyboard click or globe spin sound
        Success states: Form submission makes 'stamp' sound (like grading paper)

    Technical Implementation:

        Use Tone.js or basic Web Audio API
        AudioContext must resume on first user interaction (browser policy)
        Implement spatial audio for 3D cursor position (optional but impressive—sound pans L/R based on cursor X position)
        Always respect prefers-reduced-motion (disable audio if detected)
        Mute toggle: Elegant mini-player in corner with waveform visualization (even if muted, shows you're "listening")

    Psychological Effect: Audio + haptic (on mobile) creates "premium app" feel vs "static website""

Example: Some AirPods Pro landing pages use scroll-based audio—yours would be the teaching equivalent.
8. ADVANCED THEME SYSTEM
Beyond light/dark—emotional modes
Prompt for Developer:

    "Extend the theme toggle to 3 emotional learning modes:
    Mode 1: 'Focus Mode' (Default)

        Warm sepia tones (#F5F1E6 background, #2C1810 text)
        High contrast for readability
        'Paper texture' overlay (subtle noise PNG at 3% opacity)
        Serif typography dominant (academic feel)

    Mode 2: 'Exam Mode' (High Contrast)

        Stark black/white (accessibility-first)
        All animations disabled or minimized
        Timer displayed in header (coutdown to "exam")
        No decorative elements—pure information density

    Mode 3: 'Story Mode' (Immersive)

        Dark charcoal (#1a1a1a) with 'chalkboard' aesthetic
        Handwritten font accents for headers (Google Fonts: 'Caveat' or 'Indie Flower')
        Cursor becomes 'chalk' (white, textured, leaves fading trail)
        Background ambient 'dust particles' floating (CSS canvas or simple divs with blur)
        Soundtrack: Quiet library ambience

    Technical: Use CSS variables extensively. Theme switch triggers morphing animation (circular clip-path reveal from toggle button position)."

9. PERFORMANCE OPTIMIZATION FOR SOTY
The jury checks mobile performance ruthlessly
Prompt for Developer:

    "Achieve 95+ Lighthouse while running all these animations:
    Critical Optimizations:

        GPU Acceleration: All scroll/position animations must use transform and opacity only. Avoid top/left/width/height animations (layout thrashing)
        Will-change strategy: Add will-change: transform only during active scroll/hover states, remove after (memory management)
        Frame rate capping: Use requestAnimationFrame but throttle to 30fps on battery saver mode or mobile
        Variable font loading: Preload only the specific axes needed (wght, wdth) not entire font families
        Intersection Observer threshold: Don't run RAF calculations when section is out of viewport (pause animations)
        Debounced resize: Recalculate layout metrics only 200ms after resize ends

    Mobile-specific:

        Disable 'Velocity Skew' on mobile (too heavy)
        Reduce cursor size to 8px max on touch devices
        Replace 'Text Scramble' with simple fade on low-power mode detection
        Serve lighter image formats (WebP/AVIF) with blur-up placeholders"

10. THE "AWWWARDS SUBMISSION" POLISH
Specific details jury notices
Prompt for PM/Designer:

    "Before submission:

        Custom 404 page: Creative 'class dismissed' or 'lost in the library' concept with animation (jury checks error pages)
        Loading State: Custom skeleton screens that look like lined paper with pencil sketch animations, not generic pulse
        Social Preview: Custom Open Graph image showing the asymmetric layout hero, not just logo
        Footer Easter Egg: Hidden interaction (like clicking the logo 3 times activates 'teacher's pet mode' with confetti)
        Keyboard Navigation: Full accessibility with visible focus rings that animate (Outline draws itself around focused elements)
        Right-click menu: Custom context menu fitting the 'educational theme' (options: 'Take Notes', 'Bookmark', 'Ask Teacher')"