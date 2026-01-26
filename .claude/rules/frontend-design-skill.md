# Frontend Design Skill Integration

## When to Use frontend-design Skill

### Automatic Triggers
The frontend-design skill should be invoked IMMEDIATELY when:
- User explicitly requests "use frontend-design skill"
- User asks to "redesign", "revamp", or "transform" UI/UX
- User references AWWWARDS-level design
- User requests visual improvements beyond simple CSS changes
- User asks to create new components with complex designs

### Manual Invocation
```
When user says: "redesign the hero section"
Action: Invoke frontend-design skill IMMEDIATELY, don't just write CSS
```

## How frontend-design Skill Works

### What It Does
- Generates production-ready React/Next.js components
- Creates distinctive, creative designs (not generic AI aesthetics)
- Follows modern design trends (2026)
- Outputs fully-styled components with inline Tailwind
- Considers UX best practices and accessibility

### What It Doesn't Do
- Doesn't preserve existing functionality by default (must specify)
- Doesn't automatically integrate with i18n (must add)
- Doesn't follow project conventions unless instructed

## Integration with This Project

### Critical Instructions for frontend-design Skill

When invoking, ALWAYS provide this context:
```
"Create [component/design] with these requirements:
- Next.js 15 App Router
- TypeScript
- Tailwind CSS using project colors: #FDFCF8 bg, #C85C3F accent, #B8956A gold
- Fonts: Lora (display), Source Sans 3 (body), JetBrains Mono (accent)
- AWWWARDS luxury editorial aesthetic
- Brutalist sophistication: sharp edges, no rounded corners
- Extreme typography contrast: clamp(56px, 9vw, 140px) for display
- Glass morphism on floating elements
- Preserve existing functionality: [list specific features]
- Must integrate with next-intl for i18n (EN/VI/ZH/RU)
- Dark mode support via next-themes
"
```

### Example Usage

**❌ WRONG**: Let frontend-design skill generate generic component
```
User: "Redesign the hero"
Assistant: [Invokes frontend-design without context]
Result: Generic component, breaks translations, wrong colors
```

**✅ CORRECT**: Provide full project context
```
User: "Redesign the hero"
Assistant: [Invokes frontend-design with full context about colors, fonts, i18n, existing functionality]
Result: AWWWARDS-level component that integrates perfectly
```

## Post-Generation Checklist

After frontend-design skill generates components:

### 1. i18n Integration
- [ ] Add `useTranslations()` imports
- [ ] Replace hardcoded text with translation keys
- [ ] Add keys to all 4 locale files (en, vi, zh, ru)
- [ ] Test language switcher functionality

### 2. Theme Integration
- [ ] Verify dark mode support
- [ ] Check color variables match project palette
- [ ] Test theme toggle functionality
- [ ] Ensure proper contrast in both themes

### 3. Typography Verification
- [ ] Confirm Lora used for display text
- [ ] Confirm Source Sans 3 used for body text
- [ ] Check font weights: 700 for display, 300 for body
- [ ] Verify fluid typography with clamp()

### 4. Design System Compliance
- [ ] Sharp edges (no border-radius except minimal)
- [ ] Correct color palette applied
- [ ] Glass morphism on appropriate elements
- [ ] Spacing uses clamp() values
- [ ] Asymmetric layouts (60/40 splits)

### 5. Functionality Preservation
- [ ] All buttons work
- [ ] Forms submit properly
- [ ] Navigation links active
- [ ] Animations don't break interaction
- [ ] Mobile menu functions

### 6. Accessibility
- [ ] Semantic HTML structure
- [ ] Proper heading hierarchy
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus states visible

## Common Issues & Fixes

### Issue 1: Generated Component Has Hardcoded Text
**Problem**: Component uses English text directly instead of translations.

**Fix**:
```tsx
// Generated
<h1>Master English with Confidence</h1>

// Fixed
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

### Issue 2: Wrong Color Palette
**Problem**: Component uses generic colors.

**Fix**:
```tsx
// Generated
<div className="bg-white text-gray-900">

// Fixed
<div className="bg-[#FDFCF8] text-[#0F0F11] dark:bg-[#0A0A0C] dark:text-[#F5F1E8]">
```

### Issue 3: Wrong Fonts
**Problem**: Component doesn't use project fonts.

**Fix**:
```tsx
// Generated
<h1 className="font-bold text-6xl">

// Fixed
<h1 className="font-display font-bold text-[clamp(56px,9vw,140px)]">
```

### Issue 4: Rounded Corners
**Problem**: Component has rounded corners (violates brutalist aesthetic).

**Fix**:
```tsx
// Generated
<div className="rounded-lg">

// Fixed
<div className="rounded-none">
```

### Issue 5: No Dark Mode Support
**Problem**: Component only works in light mode.

**Fix**:
```tsx
// Generated
<div className="bg-white text-black">

// Fixed
<div className="bg-[#FDFCF8] text-[#0F0F11] dark:bg-[#0A0A0C] dark:text-[#F5F1E8]">
```

## Combining frontend-design with MCP

### Workflow
1. **Context7**: Query latest component patterns
   ```
   "Context7: Next.js 15 Server Component with client interactivity"
   ```

2. **frontend-design**: Generate component
   ```
   "Use frontend-design to create hero section with [specs]"
   ```

3. **GSAP Master**: Add animations
   ```
   "GSAP Master: Create scroll-triggered parallax for hero"
   ```

4. **Chrome MCP**: Test visually
   ```
   "Navigate to localhost:3000 and screenshot hero section"
   ```

## Design Principles for frontend-design

### AWWWARDS Luxury Editorial
When requesting designs, emphasize:
- **Extreme Scale**: Massive typography (56-140px)
- **Weight Contrast**: 700 weight display vs 300 weight body
- **Asymmetric Grids**: 60/40 splits, avoid symmetry
- **Atmospheric Depth**: Layered gradients, noise textures, glass morphism
- **Liquid Motion**: Smooth animations, staggered reveals
- **Brutalist Polish**: Sharp edges, bold choices, refined execution

### Reference Inspiration
Provide these as design direction:
- AWWWARDS Site of the Day winners
- Typography-heavy editorial layouts
- Luxury brand websites (fashion, architecture)
- Brutalist web design with sophistication
- Kinetic typography examples

## CSS-Only vs Component Generation

### Use CSS-Only (awwwards-luxury.css)
When:
- Design changes are purely visual
- Existing components work, just need styling
- User explicitly says "don't modify components"
- Quick iteration needed

### Use frontend-design Skill
When:
- Creating new components from scratch
- Complete redesign needed
- User requests AWWWARDS-level transformation
- Need creative, distinctive output

## Testing Generated Components

### Visual Testing
```bash
npm run dev
# Open localhost:3000
# Test all 4 locales via language switcher
# Toggle dark/light theme
# Check mobile responsiveness (use Chrome DevTools)
```

### Functionality Testing
- Click all buttons → Should trigger correct actions
- Submit forms → Should validate and submit
- Navigate links → Should go to correct pages
- Test animations → Should be smooth, no jank

### Accessibility Testing
```bash
# Run Lighthouse audit
npm run build
# Check for accessibility warnings
```

## Iterating on frontend-design Output

### Refinement Workflow
1. Generate initial component with frontend-design
2. Review output, identify issues
3. Apply fixes (i18n, colors, fonts, etc.)
4. Test thoroughly
5. If major changes needed, invoke frontend-design again with refined prompt

### Refinement Prompt Pattern
```
"Regenerate [component] with these adjustments:
- [Issue 1 and how to fix]
- [Issue 2 and how to fix]
- Keep [what was good]
- Emphasize [design principle]"
```

## Integration with Existing Codebase

### Component Replacement Strategy
When replacing existing components:

1. **Backup**: Copy existing component
2. **Generate**: Use frontend-design to create new version
3. **Migrate**: Transfer functionality from old to new
4. **Test**: Verify all features work
5. **Deploy**: Replace old with new

### Gradual Enhancement Strategy
When enhancing existing components:

1. **CSS First**: Try awwwards-luxury.css overrides
2. **Partial Replacement**: Use frontend-design for specific sections
3. **Iterative**: One component at a time
4. **Preserve**: Keep working functionality intact

## Version Control Best Practices

### Before Generating
```bash
git add .
git commit -m "feat: Before frontend-design generation for [component]"
```

### After Generating
```bash
# Review changes
git diff

# Test thoroughly
npm run dev

# Commit if good
git add .
git commit -m "feat: Generated [component] with frontend-design skill

- AWWWARDS luxury design applied
- Integrated i18n for all locales
- Preserved existing functionality
- Added dark mode support

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

## Performance Considerations

### frontend-design Output Optimization
Generated components may need optimization:
- [ ] Remove unused Tailwind classes
- [ ] Optimize images with Next.js Image component
- [ ] Lazy load below-fold content
- [ ] Minimize inline styles
- [ ] Extract repeated patterns to variables

### Bundle Size
Monitor JavaScript bundle size:
```bash
npm run build
# Check .next/analyze (if bundle analyzer configured)
```

## Documentation

### Document Generated Components
After using frontend-design, add JSDoc comments:
```tsx
/**
 * Hero Section Component
 *
 * AWWWARDS-level luxury design with:
 * - Extreme typography scale (56-140px)
 * - Glass morphism background
 * - GSAP parallax animations
 * - Full i18n support (EN/VI/ZH/RU)
 * - Dark mode compatible
 *
 * Generated with frontend-design skill on 2026-01-26
 */
export function Hero() {
  // ...
}
```

## Troubleshooting

### frontend-design Skill Not Available
If skill errors:
1. Check skill is installed and enabled
2. Restart Claude Code
3. Verify skill permissions
4. Check skill logs for errors

### Generated Code Doesn't Match Project Style
Refine prompt with more specific instructions:
- Provide exact color hex codes
- Specify font families and weights
- Reference existing components
- Include code examples of desired patterns

### Generation Takes Too Long
- Simplify prompt
- Generate smaller components
- Break complex components into pieces
- Use Context7 to get docs first, then generate

## Future Enhancements

Consider requesting from frontend-design:
- Micro-interactions (button hover effects)
- Loading states and skeletons
- Error state designs
- Empty state illustrations
- Animated transitions between pages
- Advanced GSAP timeline sequences
