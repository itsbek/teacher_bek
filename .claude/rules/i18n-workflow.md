# Internationalization Workflow Rules

## Translation Key Management

### CRITICAL RULE: Translation Keys Must Exist
**NEVER** use `useTranslations()` or `getTranslations()` with keys that don't exist in ALL locale files.

Before adding translation usage:
1. Search for the key in all locale files (en.json, vi.json, zh.json, ru.json)
2. If missing, add to ALL locale files first
3. Then implement component usage

### Adding New Translation Keys

**Step 1**: Add to `/messages/en.json` (English master)
```json
{
  "hero": {
    "badge": "Professional English Teacher",
    "title": "Master English with Confidence"
  }
}
```

**Step 2**: Add to `/messages/vi.json` (Vietnamese)
```json
{
  "hero": {
    "badge": "Giáo Viên Tiếng Anh Chuyên Nghiệp",
    "title": "Học Tiếng Anh Tự Tin"
  }
}
```

**Step 3**: Add to `/messages/zh.json` (Chinese)
```json
{
  "hero": {
    "badge": "专业英语教师",
    "title": "自信掌握英语"
  }
}
```

**Step 4**: Add to `/messages/ru.json` (Russian)
```json
{
  "hero": {
    "badge": "Профессиональный Учитель Английского",
    "title": "Уверенное Владение Английским"
  }
}
```

**Step 5**: Use in component
```tsx
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');

  return (
    <div>
      <span>{t('badge')}</span>
      <h1>{t('title')}</h1>
    </div>
  );
}
```

## Translation Key Naming Conventions

### Namespace Structure
```
{
  "component_name": {        // Hero, Courses, FAQ, etc.
    "key_name": "value",
    "nested": {
      "deeper_key": "value"
  }
}
```

### Key Naming Patterns
- Use lowercase with underscores: `course_title`, `call_to_action`
- Group related keys under namespaces: `hero.*`, `contact.*`
- Keep keys semantic: `button_learn_more` not `btn1`
- Arrays use numbered keys: `benefits.0`, `benefits.1`

## Vietnamese-Specific Guidelines

### Character Set
Ensure all Vietnamese characters render correctly:
- Ă, Â, Ê, Ô, Ơ, Ư (vowels with diacritics)
- Đ (d with stroke)
- Tone marks: à, á, ả, ã, ạ (and all vowel combinations)

### Font Support
Source Sans 3 includes Vietnamese subset:
```typescript
const sourceSans = Source_Sans_3({
  subsets: ["latin", "latin-ext", "vietnamese"],
  // ...
});
```

### Common Phrases
```json
{
  "common": {
    "read_more": "Đọc Thêm",
    "learn_more": "Tìm Hiểu Thêm",
    "contact_us": "Liên Hệ",
    "get_started": "Bắt Đầu",
    "book_lesson": "Đặt Lịch Học"
  }
}
```

### Location Names
Always use Vietnamese names for Ho Chi Minh City districts:
- Gò Vấp (not Go Vap)
- Phú Nhuận (not Phu Nhuan)
- Bình Thạnh (not Binh Thanh)
- TP.HCM or Thành phố Hồ Chí Minh (not HCMC in Vietnamese)

## Chinese-Specific Guidelines

### Simplified Chinese
Use Simplified Chinese characters (not Traditional):
- 学习 (not 學習)
- 课程 (not 課程)
- 联系 (not 聯繫)

### Common Phrases
```json
{
  "common": {
    "read_more": "阅读更多",
    "learn_more": "了解更多",
    "contact_us": "联系我们",
    "get_started": "开始学习",
    "book_lesson": "预约课程"
  }
}
```

## Russian-Specific Guidelines

### Cyrillic Characters
Full Cyrillic alphabet support required.

### Case Sensitivity
Russian is case-sensitive and uses Title Case sparingly:
- Buttons/CTAs: Often lowercase or sentence case
- Headings: Often sentence case
- Proper nouns: Capitalize

### Common Phrases
```json
{
  "common": {
    "read_more": "Читать далее",
    "learn_more": "Узнать больше",
    "contact_us": "Связаться с нами",
    "get_started": "Начать обучение",
    "book_lesson": "Записаться на урок"
  }
}
```

## Server vs Client Components

### Server Components
Use `getTranslations()` for async server components:
```tsx
import { getTranslations } from 'next-intl/server';

export default async function Page() {
  const t = await getTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

### Client Components
Use `useTranslations()` for client components:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function Hero() {
  const t = useTranslations('hero');
  return <h1>{t('title')}</h1>;
}
```

## Locale-Specific Metadata

### SEO Metadata
Each locale needs tailored metadata in layout.tsx:
```typescript
export const metadata: Metadata = {
  title: {
    default: "Giáo viên tiếng Anh | English Teacher",
    template: "%s | English Teacher HCMC"
  },
  description: "Vietnamese first, English second for better local SEO",
  alternates: {
    languages: {
      'en': '/en',
      'vi': '/vi',
      'zh': '/zh',
      'ru': '/ru',
    },
  },
};
```

## Testing Translation Coverage

### Manual Checklist
Before deploying:
- [ ] All new keys exist in en.json
- [ ] All new keys exist in vi.json
- [ ] All new keys exist in zh.json
- [ ] All new keys exist in ru.json
- [ ] Vietnamese diacritics render correctly
- [ ] Chinese characters display properly
- [ ] Russian Cyrillic characters work
- [ ] Test all locales via language switcher

### Common Errors to Avoid

**❌ WRONG**: Using hardcoded text
```tsx
<button>Learn More</button>
```

**✅ CORRECT**: Using translations
```tsx
const t = useTranslations('common');
<button>{t('learn_more')}</button>
```

**❌ WRONG**: Using keys that don't exist yet
```tsx
const t = useTranslations('new_section');
return <h1>{t('new_title')}</h1>; // Will throw MISSING_MESSAGE error
```

**✅ CORRECT**: Add keys first, then use
```json
// Add to all 4 locale files first
{
  "new_section": {
    "new_title": "translated text"
  }
}
```

## Language Switcher Implementation

The header component includes a language switcher dropdown:
- Current locale highlighted
- Flags/labels for each language
- Updates URL with new locale prefix
- Preserves current page path

Example URL structure:
```
/en          → English homepage
/vi          → Vietnamese homepage
/zh          → Chinese homepage
/ru          → Russian homepage
/en/blog     → English blog
/vi/blog     → Vietnamese blog
```

## RTL Support (Future)

Currently not implemented, but if adding Arabic or Hebrew:
```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

## Translation Quality Standards

### Vietnamese
- Formal register for professional teaching service
- Use respectful terms: "Quý vị", "học viên"
- Avoid overly casual language

### Chinese
- Professional but approachable tone
- Use 您 (formal "you") in contact forms
- Use 你 (informal "you") in conversational content

### Russian
- Formal Вы (capitalized) in forms
- Conversational ты in testimonials/casual sections
- Professional terminology for teaching concepts

## Fallback Strategy

If translation missing:
1. next-intl shows MISSING_MESSAGE error in dev
2. In production, falls back to key name
3. **Never ship with missing translations**

Always test in dev mode to catch missing translations before production build.
