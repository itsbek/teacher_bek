# English Teacher Portfolio - Project Context

## Project Overview
English teaching portfolio website for a teacher based in Ho Chi Minh City (Gò Vấp, Phú Nhuận, Bình Thạnh districts). Target audience: Vietnamese families, Chinese speakers, Russian speakers seeking English lessons for children and adults.

**Design Philosophy**: AWWWARDS-level luxury editorial design with brutalist sophistication. Ultra-premium visual experience while maintaining professional teaching service messaging.

## Tech Stack
- **Framework**: Next.js 15.5.9 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS + Custom CSS
- **Fonts**: Lora (display), Source Sans 3 (body), JetBrains Mono (accent)
- **Internationalization**: next-intl (EN, VI, ZH, RU)
- **Animation**: Framer Motion + GSAP with ScrollTrigger
- **Theme**: next-themes (light/dark mode)
- **Analytics**: Google Analytics via gtag

## Architecture

### Directory Structure
```
/app
  /[locale]         # Internationalized routes
    /blog           # Blog posts (markdown-based)
  /api              # API routes (newsletter)
  globals.css       # Base styles + theme system
  awwwards-luxury.css # Premium design overrides
  layout.tsx        # Root layout with fonts & metadata

/components
  header.tsx        # Navigation, language switcher, theme toggle
  hero.tsx          # Hero section with GSAP parallax
  courses.tsx       # Course offerings
  testimonials.tsx  # Student reviews
  faq.tsx           # Frequently asked questions
  contact.tsx       # Contact form
  footer.tsx        # Footer with social links
  client-layout.tsx # Client-side wrapper (cursor, scroll progress)
  /blog             # Blog-related components

/lib
  analytics.ts      # GA4 event tracking
  blog.ts           # Blog post utilities

/messages
  en.json, vi.json, zh.json, ru.json  # i18n translations
```

### Key Pages
- `/` - Main landing page (Hero, Courses, Testimonials, FAQ, Contact)
- `/[locale]/blog` - Blog listing and individual posts
- All pages support EN, VI, ZH, RU locales via next-intl

## Design System - AWWWARDS Luxury Level

### Typography Scale
- **Display (H1)**: clamp(56px, 9vw, 140px) - Lora 700 weight
- **Heading (H2)**: clamp(42px, 6vw, 96px) - Lora 700 weight
- **Subheading (H3)**: clamp(32px, 4vw, 64px) - Lora 600 weight
- **Body**: clamp(16px, 1.2vw, 20px) - Source Sans 300 weight
- **Accent**: JetBrains Mono 400-500 weight

### Color System
**Light Mode**:
- Background: #FDFCF8 (warm cream)
- Text: #0F0F11 (near black)
- Accent: #C85C3F (copper/terracotta)
- Gold: #B8956A (warm metallic)

**Dark Mode**:
- Background: #0A0A0C (deep charcoal)
- Text: #F5F1E8 (warm white)
- Accent: #E88C73 (lighter copper)
- Gold: #D4B896 (lighter gold)

### Layout Principles
- **Spacing**: clamp(60px, 10vw, 160px) vertical rhythm
- **Grids**: Asymmetric 60/40 splits, avoid symmetry
- **Sections**: Seamless connections, no gaps between sections
- **Containers**: Full-bleed backgrounds with contained content (max-w-7xl)

### Visual Effects
- **Glass Morphism**: backdrop-filter: blur(20px) on header/cards
- **Noise Texture**: SVG noise overlay at 3% opacity on body::before
- **Gradients**: Multi-stop radial/linear gradients for depth
- **Animations**: Staggered reveals (150ms delays), cubic-bezier(0.25, 0.46, 0.45, 0.94)

## Code Style & Conventions

### TypeScript
- Strict mode enabled, no `any` types
- Use proper type imports: `import type { Metadata } from "next"`
- Define interfaces for component props
- Prefer named exports over default exports

### React/Next.js
- Use async Server Components by default
- Client Components only when needed (mark with `"use client"`)
- Destructure params in async functions: `const { locale } = await params`
- Use Metadata API for SEO in layouts/pages

### CSS/Styling
- Tailwind utility classes preferred
- Custom CSS in awwwards-luxury.css for design system overrides
- Use CSS variables for theme values
- clamp() for fluid typography and spacing
- BEM naming for custom classes if needed

### i18n
- All user-facing text must use `useTranslations()` or `getTranslations()`
- Keys must exist in ALL locale files (en.json, vi.json, zh.json, ru.json)
- Never hardcode display text in components

### Animations
- GSAP for scroll-triggered parallax effects
- Framer Motion for component transitions
- CSS transitions for hover states
- Always use reduced-motion queries for accessibility

## Development Workflow

### Commands
```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript validation
```

### Git Workflow
- Main branch: `main`
- Commit messages: Conventional commits format
- Co-author: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

### Testing
- Test all locales (EN, VI, ZH, RU) after content changes
- Verify light/dark theme toggle
- Check mobile responsiveness
- Validate form submissions
- Test GSAP animations on scroll

## Critical Requirements

### DO
✅ Use frontend-design skill for UI/UX transformations
✅ Preserve ALL existing functionality when styling
✅ Test translation keys exist before using `useTranslations()`
✅ Maintain seamless section connections
✅ Use CSS-only transformations when possible (avoid component changes)
✅ Follow AWWWARDS design principles: extreme scale contrast, asymmetric layouts, atmospheric depth
✅ Verify Vietnamese character support in fonts

### DON'T
❌ Break language switcher, theme toggle, or navigation
❌ Use inappropriate language (professional teaching service tone only)
❌ Create gaps between sections
❌ Use rounded corners or boxed layouts (brutalist aesthetic)
❌ Add template-looking designs (avoid generic aesthetics)
❌ Modify components when CSS can achieve the goal
❌ Forget to add Co-Author attribution in commits

## MCP Servers

### Context7
Used for fetching up-to-date documentation for:
- Next.js 15 App Router API
- React 19 features
- Framer Motion latest syntax
- GSAP ScrollTrigger patterns
- Tailwind CSS v4 utilities

Usage: When implementing new features or debugging, query Context7 for latest API documentation to avoid hallucinated or outdated code patterns.

### shadcn MCP
Used for UI component exploration and installation.
- Search for components before building custom ones
- View implementation examples
- Get installation commands

### GSAP Master MCP
Used for advanced animation patterns.
- Expert-level GSAP implementation
- ScrollTrigger optimization
- Performance-critical animation debugging

## SEO & Analytics

### Focus Keywords
Vietnamese: "giáo viên tiếng Anh Gò Vấp", "dạy tiếng Anh Phú Nhuận", "học tiếng Anh Bình Thạnh"
English: "English teacher Ho Chi Minh City", "English lessons Go Vap", "ILA Vietnam teacher"

### Analytics Events
Track via `lib/analytics.ts`:
- Page views
- Form submissions
- CTA button clicks
- Language switches
- Theme toggles

### Schema Markup
LocalBusiness schema included in root layout for Vietnamese local SEO targeting Gò Vấp, Phú Nhuận, Bình Thạnh districts.

## Performance Targets
- Lighthouse Score: 95+ (all categories)
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- Font loading: swap strategy with preload hints

## Accessibility
- WCAG 2.1 AA compliance
- Semantic HTML structure
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support for animations

---

## Design Resources

For AWWWARDS-level inspiration, reference:
- [Awwwards Typography Examples](https://www.awwwards.com/websites/typography/)
- [Typography-Heavy Design Patterns](https://www.awwwards.com/typography-heavy-design.html)
- Design trends: Dynamic typography, variable fonts, mixed typefaces, asymmetric grids, chromatic mash-ups

## Quick Reference

When asked to improve UI/UX:
1. Always use frontend-design skill
2. Apply CSS-only transformations first
3. Preserve all functionality (translations, forms, navigation)
4. Follow AWWWARDS luxury aesthetic documented above
5. Test all 4 locales after changes
