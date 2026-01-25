# English Teaching Platform

A premium, conversion-optimized website for English language instruction, designed with psychological principles and SEO best practices.

## 🎯 Key Features

### Design & UX Psychology
- **Editorial Confidence** aesthetic with Playfair Display & Plus Jakarta Sans typography
- **Conversion-optimized** based on proven UX principles:
  - **Hick's Law**: Clear, focused CTAs
  - **Fitts's Law**: Large, mobile-friendly buttons (min 44px)
  - **Von Restorff Effect**: CTAs stand out with contrasting colors
  - **Social Proof**: Testimonials, ratings, student counts
  - **Trust Signals**: Certifications, experience, guarantees

### Mobile-First Responsive Design
- Optimized for mobile (320px+), tablet, and desktop
- 80% of traffic expected from mobile devices
- Touch-friendly interactions
- Smooth animations with Framer Motion

### Internationalization (i18n)
- 4 languages: English, Vietnamese, Chinese, Russian
- Seamless language switching
- SEO-optimized for each locale

### SEO & AI-Search Optimization
- Comprehensive meta tags and Open Graph
- Structured data (JSON-LD) for:
  - Organization schema
  - Person/Teacher schema
  - Course schema
  - FAQ schema
  - Aggregate ratings
- Sitemap.xml and robots.txt
- Semantic HTML for AI comprehension
- Mobile-first indexing ready

### Light/Dark Mode
- Smooth theme transitions
- System preference detection
- Custom color tokens for both themes

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **i18n**: next-intl
- **Themes**: next-themes
- **Icons**: Lucide React

## 📂 Project Structure

```
├── app/
│   ├── [locale]/          # Internationalized routes
│   │   ├── layout.tsx     # Locale-specific layout
│   │   └── page.tsx       # Homepage
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout with SEO
│   ├── robots.ts          # Robots.txt generation
│   └── sitemap.ts         # Sitemap generation
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── contact.tsx        # Contact/CTA section
│   ├── courses.tsx        # Course offerings
│   ├── faq.tsx            # FAQ with schema markup
│   ├── footer.tsx         # Footer
│   ├── header.tsx         # Header with nav & lang switcher
│   ├── hero.tsx           # Hero section
│   ├── structured-data.tsx # JSON-LD schemas
│   ├── testimonials.tsx   # Social proof
│   └── theme-provider.tsx # Theme context
├── messages/              # Translation files
│   ├── en.json
│   ├── vi.json
│   ├── zh.json
│   └── ru.json
└── lib/
    └── utils.ts          # Utility functions
```

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en) in your browser.

### Build

```bash
npm run build
npm start
```

## 🎨 Customization

### Update Contact Information

Edit the following files with your actual contact details:

1. **components/contact.tsx**:
   ```typescript
   const whatsappNumber = "+1234567890"; // Your WhatsApp number
   const telegramUsername = "your_telegram"; // Your Telegram username
   const email = "hello@englishwithconfidence.com"; // Your email
   ```

2. **components/footer.tsx**: Same values as above

3. **components/structured-data.tsx**: Update organization details

### Change Colors

Edit `app/globals.css` to customize the color scheme:

```css
:root {
  --primary: 222 47% 11%;      /* Deep Navy */
  --secondary: 38 92% 50%;     /* Warm Amber */
  --accent: 142 25% 65%;       /* Soft Sage */
}
```

### Update Content

All content is in translation files (`messages/*.json`). Edit these to customize text for each language.

## 📱 Responsive Breakpoints

- Mobile: 320px - 639px
- Tablet: 640px - 1023px
- Desktop: 1024px+

## 🔍 SEO Checklist

- ✅ Semantic HTML structure
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph for social sharing
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Mobile-first responsive
- ✅ Fast load times (Next.js optimizations)
- ✅ Accessible (WCAG compliant)

## 🤖 AI Search Optimization

The site is optimized for AI-driven search engines:

1. **Clear Content Hierarchy**: Proper heading structure (H1→H6)
2. **Structured Data**: Machine-readable course, FAQ, and rating information
3. **Semantic HTML**: Using appropriate HTML5 elements
4. **FAQ Schema**: Questions and answers formatted for AI extraction
5. **Comprehensive Metadata**: Detailed descriptions for AI comprehension

## 🎯 Conversion Optimization

- **Above-the-fold hero** with clear value proposition
- **Social proof** throughout (testimonials, ratings, student count)
- **Trust signals** (certifications, years of experience)
- **Low-friction contact** (WhatsApp, Telegram, Email)
- **Scarcity indicators** (limited spots)
- **Multiple CTAs** strategically placed
- **Free consultation** offer to reduce commitment anxiety

## 📊 Performance

Next.js 15 optimizations:
- Automatic code splitting
- Image optimization
- Font optimization (variable fonts)
- Static generation for fast loads
- Lazy loading components

## 🌐 Deployment

### Vercel (Recommended)

```bash
vercel
```

### Other Platforms

Build the production bundle:

```bash
npm run build
```

Deploy the `.next` folder to your hosting provider.

## 📝 License

This project is private and proprietary.

## 🙋 Support

For questions or customization requests, contact the developer.
