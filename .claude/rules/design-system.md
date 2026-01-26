# Design System Rules - AWWWARDS Luxury Editorial

## Visual Hierarchy Principles

### Typography Contrast Philosophy
Create extreme contrast between display and body typography:
- Display text: Maximum weight (700), maximum scale (56-140px)
- Body text: Minimum weight (300), refined scale (16-20px)
- NO medium weights - only extremes (300, 600, 700)

### Spacing Rhythm
All vertical spacing must use fluid clamp() values:
- Section padding: clamp(60px, 10vw, 160px)
- Component gaps: clamp(40px, 6vw, 80px)
- Element margins: clamp(20px, 3vw, 40px)

### Color Application Rules
**Light Mode**:
- Backgrounds: Always warm neutrals (#FDFCF8, #FFF8F0, #F8F5EE)
- Text: High contrast (#0F0F11 for primary, #3A3A3D for secondary)
- Accents: Copper (#C85C3F) for CTAs, Gold (#B8956A) for highlights

**Dark Mode**:
- Backgrounds: Deep charcoals (#0A0A0C, #111113)
- Text: Warm off-white (#F5F1E8, #D4D1C8)
- Accents: Lighter copper (#E88C73), brighter gold (#D4B896)

## Layout System

### Grid Patterns
- **Asymmetric 60/40 Split**: Never use 50/50 symmetry
- **Offset Grids**: Shift content blocks by 1-2 grid columns
- **Full-Bleed Backgrounds**: Extend color/images edge-to-edge, contain text at max-w-7xl

### Section Flow
Sections MUST flow seamlessly:
```css
main > section {
  margin: 0;
  padding-top: clamp(60px, 10vw, 120px);
  padding-bottom: clamp(60px, 10vw, 120px);
}

main > section:first-of-type {
  padding-top: 0;
}
```

### Z-Index Hierarchy
```
100: Fixed header
90: Modal overlays
80: Dropdown menus
70: Sticky elements
60: Tooltips
50: Elevated cards
1-10: Content layers
-1: Background decorations
```

## Visual Effects Standards

### Glass Morphism
Apply to floating elements only (header, cards):
```css
backdrop-filter: blur(20px) saturate(180%);
background: rgba(253, 252, 248, 0.7);
border: 1px solid rgba(255, 255, 255, 0.2);
```

### Atmospheric Depth
Layer multiple effects for depth:
1. Base gradient background
2. Radial spotlight overlays (opacity: 0.15)
3. Noise texture (opacity: 0.03)
4. Glass morphism elements
5. Subtle shadows (0 2px 20px rgba(0,0,0,0.05))

### Gradient Construction
Multi-stop gradients only:
```css
/* Hero backgrounds */
background: linear-gradient(135deg,
  #FDFCF8 0%,
  #FFF8F0 50%,
  #FFF3E8 100%
);

/* Accent overlays */
background: radial-gradient(
  circle at 30% 50%,
  rgba(200, 92, 63, 0.15) 0%,
  transparent 50%
);
```

## Animation Standards

### Timing Functions
- Default transitions: cubic-bezier(0.25, 0.46, 0.45, 0.94)
- Bouncy entrances: cubic-bezier(0.34, 1.56, 0.64, 1)
- Smooth exits: cubic-bezier(0.4, 0, 0.2, 1)

### Stagger Delays
Sequential animations must stagger by 150ms:
```css
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 150ms; }
.item:nth-child(3) { animation-delay: 300ms; }
```

### Scroll-Triggered Effects
All scroll animations via GSAP ScrollTrigger:
- start: "top 80%" (trigger near viewport entry)
- end: "bottom 20%" (complete before exit)
- scrub: false (discrete animations, not continuous)

### Hover State Rules
Typography hover effects:
```css
h1:hover, h2:hover, a:hover {
  letter-spacing: 0.02em;
  transition: letter-spacing 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

Button hover effects:
```css
button::before {
  content: '';
  position: absolute;
  background: var(--gradient-gold);
  transform: translateX(-100%);
  transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

button:hover::before {
  transform: translateX(0);
}
```

## Component Design Patterns

### Cards
- NO rounded corners (use sharp edges for brutalist aesthetic)
- Glass morphism background
- 1px subtle border
- Generous padding: clamp(30px, 4vw, 60px)
- Shadow: 0 2px 30px rgba(0, 0, 0, 0.05)

### Buttons
- Primary: Copper gradient background (#C85C3F to #D47A5E)
- Secondary: Outline with 1px border
- Minimum height: 48px (touch-friendly)
- Padding: 16px 32px
- Font: Source Sans 600 weight
- Hover: Gradient slide effect from left

### Forms
- Input height: 56px (generous touch targets)
- Border: 1px solid with low opacity
- Focus state: Accent color border + subtle glow
- Labels: Source Sans 300 weight, 14px
- Error states: Red accent (#E63946) with icon

### Navigation
- Fixed header with glass morphism
- Logo: Left-aligned
- Nav links: Right-aligned, Source Sans 400 weight
- Mobile menu: Full-screen overlay with stagger animations
- Active state: Underline with accent color

## Responsive Breakpoints

```
sm: 640px   # Mobile landscape
md: 768px   # Tablet portrait
lg: 1024px  # Tablet landscape / small desktop
xl: 1280px  # Desktop
2xl: 1536px # Large desktop
```

### Mobile-First Approach
Always write base styles for mobile, then enhance for larger screens:
```css
/* Mobile first */
.hero-title {
  font-size: 56px;
}

/* Enhance for desktop */
@media (min-width: 1024px) {
  .hero-title {
    font-size: 140px;
  }
}
```

## Performance Optimization

### Font Loading
- Use `display: swap` for all font-face declarations
- Preload critical fonts in layout.tsx
- Subset fonts to required glyphs

### Image Optimization
- Use Next.js Image component with priority for above-fold images
- WebP format with fallbacks
- Lazy load below-fold images
- Blur placeholder for smooth loading

### Animation Performance
- Animate only transform and opacity (GPU-accelerated)
- Use will-change sparingly
- Disable animations on low-end devices via @media (prefers-reduced-motion)

### CSS Performance
- Minimize !important usage (only for design system overrides)
- Avoid deep nesting (max 3 levels)
- Use CSS custom properties for theme values
- Extract repeated values to variables

## Accessibility Requirements

### Color Contrast
- Text on light backgrounds: minimum 7:1 ratio (AAA)
- Text on dark backgrounds: minimum 7:1 ratio (AAA)
- Interactive elements: minimum 4.5:1 ratio (AA)

### Focus States
All interactive elements must have visible focus indicators:
```css
button:focus-visible,
a:focus-visible {
  outline: 2px solid var(--color-accent-luxury);
  outline-offset: 2px;
}
```

### Reduced Motion
Respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
