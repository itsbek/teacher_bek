# Deployment Guide

## ✅ Pre-Deployment Checklist

Before deploying, update these items with your actual information:

### 1. Contact Information (REQUIRED)

Update in these 3 files:

**`components/contact.tsx`** (line 13-15):
```typescript
const whatsappNumber = "+1234567890"; // Replace with your WhatsApp number
const telegramUsername = "your_telegram"; // Replace with your Telegram username
const email = "hello@englishwithconfidence.com"; // Replace with your email
```

**`components/footer.tsx`** (line 8-10):
```typescript
const whatsappNumber = "+1234567890";
const telegramUsername = "your_telegram";
const email = "hello@englishwithconfidence.com";
```

**`components/structured-data.tsx`** (line 7-9):
```typescript
"url": "https://your-actual-domain.com",
"sameAs": [
  "https://wa.me/your-whatsapp",
  "https://t.me/your_telegram"
]
```

### 2. Domain Configuration

Update your domain in these files:

**`app/layout.tsx`** (line 12):
```typescript
metadataBase: new URL('https://your-actual-domain.com'),
```

**`app/robots.ts`** (line 9):
```typescript
sitemap: 'https://your-actual-domain.com/sitemap.xml',
```

**`app/sitemap.ts`** (line 5):
```typescript
const baseUrl = 'https://your-actual-domain.com'
```

### 3. Add Images (Optional but Recommended)

Create and add these images to `/public`:
- `logo.png` (512x512px) - Your logo
- `og-image.jpg` (1200x630px) - Social media preview image
- `favicon.ico` - Browser tab icon

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Follow prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Deploy!

4. **Set up domain** (in Vercel dashboard):
   - Go to Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

### Option 2: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 3: Self-Hosted (VPS/Cloud)

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "english-teacher" -- start
   pm2 save
   pm2 startup
   ```

4. **Set up Nginx reverse proxy**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Set up SSL with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

## 🔍 Post-Deployment SEO Setup

### 1. Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (domain)
3. Verify ownership
4. Submit sitemap: `https://your-domain.com/sitemap.xml`

### 2. Google Analytics (Optional)

1. Create a GA4 property
2. Add tracking code to `app/layout.tsx`:
```typescript
<Script src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" />
<Script id="google-analytics">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
  `}
</Script>
```

### 3. Submit to Search Engines

- **Google**: Submit via Google Search Console (already done above)
- **Bing**: [Bing Webmaster Tools](https://www.bing.com/webmasters)
- **Yandex** (for Russian speakers): [Yandex Webmaster](https://webmaster.yandex.com/)
- **Baidu** (for Chinese speakers): [Baidu Webmaster](https://ziyuan.baidu.com/)

## 📊 Performance Optimization

### After Deployment, Run:

1. **Lighthouse Audit**:
   - Open site in Chrome
   - DevTools → Lighthouse → Generate report
   - Aim for 90+ scores in all categories

2. **PageSpeed Insights**:
   - Visit [PageSpeed Insights](https://pagespeed.web.dev/)
   - Test both mobile and desktop
   - Fix any issues identified

## 🎯 Conversion Tracking

### Set Up Contact Form Tracking

Add event tracking when users click CTAs:

```typescript
// In components/contact.tsx
onClick={() => {
  // Track with Google Analytics
  gtag('event', 'contact_click', {
    method: 'whatsapp'
  });
  // Or your analytics service
}}
```

## 🌍 International SEO

Your site is already set up for international SEO with:
- ✅ `hreflang` tags (automatic via next-intl)
- ✅ Separate URLs per language
- ✅ Proper language declarations

### Additional Steps:

1. **Google Search Console**: Add all language versions
2. **International Targeting**: Set geographic target if desired
3. **Local Business Listings**:
   - Create profiles on local platforms
   - Ensure NAP (Name, Address, Phone) consistency

## 🔒 Security Checklist

- [ ] Enable HTTPS (SSL certificate)
- [ ] Add security headers in `next.config.ts`
- [ ] Set up rate limiting (if needed)
- [ ] Regular dependency updates: `npm audit`
- [ ] Environment variables for sensitive data

## 📱 Testing Checklist

After deployment, test:

- [ ] All 4 languages work (en, vi, zh, ru)
- [ ] Light/dark mode switch
- [ ] All CTAs link correctly
- [ ] Contact methods (WhatsApp, Telegram, Email) open correctly
- [ ] Responsive on mobile (test iPhone, Android)
- [ ] Responsive on tablet (test iPad)
- [ ] Responsive on desktop (test various screen sizes)
- [ ] Page load speed < 3 seconds
- [ ] All animations work smoothly
- [ ] No console errors
- [ ] Social media preview (use [metatags.io](https://metatags.io))

## 🚨 Troubleshooting

### Build Fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Translations Missing
- Check all `messages/*.json` files have the same keys
- Rebuild: `npm run build`

### Images Not Loading
- Verify images exist in `/public`
- Check `next.config.ts` image domains

### Contact Links Not Working
- Verify WhatsApp number format: `+[country code][number]`
- Verify Telegram username (no @ symbol)
- Test links manually

## 📈 Growth Tactics

### 1. Content Marketing
- Start a blog about English learning tips
- Create YouTube videos showing teaching methods
- Share success stories on social media

### 2. Paid Advertising
- Google Ads targeting language learners
- Facebook/Instagram ads in Vietnam, China, Russia
- YouTube ads

### 3. SEO Content
- Add blog section with keyword-rich articles
- Create landing pages for specific services
- Build backlinks through guest posting

### 4. Social Proof
- Request reviews from current students
- Display video testimonials
- Show before/after progress examples

## 🎓 Next Steps

1. ✅ Update contact information
2. ✅ Add custom domain
3. ✅ Upload logo and images
4. ✅ Deploy to Vercel/Netlify
5. ✅ Submit to search engines
6. ✅ Set up analytics
7. ✅ Test all functionality
8. ✅ Start marketing!

## 📞 Need Help?

If you encounter issues:
1. Check the [Next.js Documentation](https://nextjs.org/docs)
2. Check the [next-intl Documentation](https://next-intl.dev/)
3. Review build errors carefully
4. Test locally first: `npm run dev`

Good luck with your English teaching platform! 🚀
