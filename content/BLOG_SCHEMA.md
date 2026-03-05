# Blog Post Markdown Schema

Each post is a single `.md` file in the GitHub content repo (`itsbek/teacher-blog-content`).

**Filename rules:**
- Lowercase kebab-case only: `my-post-title.md`
- Must exactly match the `slug` field (without `.md`)
- Files starting with an uppercase letter or underscore are silently ignored — `TEMPLATE.md`, `README.md`, `_ideas.md` will never appear on the site

---

## Copy-paste starter

Use this as your starting point. Fill in the required fields, uncomment what you need, delete what you don't.

```markdown
---
slug: "your-slug-here"
title: "Your Post Title Here"
excerpt: "2–3 sentences shown in listing cards and used as the meta description. Make the reader want to click."
date: "2026-03-10"
readTime: 5

category: "teaching"
# One of: teaching | parents | learning | stories

# author: "Teacher Bek"
# image: "https://images.unsplash.com/photo-XXXXXX?w=1200&q=80"
# featured: true
# draft: true
# tags: speaking, vocabulary, fluency
# updatedAt: "2026-04-01"
---

## Opening hook

Start with a concrete observation, surprising fact, or short story that
shows immediately why this post matters. Don't open with "In this article..."

## First point

Explain one idea clearly. Use specifics — technique names, numbers, real
classroom examples.

## Second point

Keep the reader moving. Each section should answer a question the previous
one raised.

> A key takeaway or pull quote that stands out.

## Practical takeaway

End with something the reader can do today. Specific beats vague.

---

*Have a question? [Send me a message](/en#contact) — I reply to everything.*
```

---

## Field reference

| Field | Required | Type | Default | Notes |
|---|---|---|---|---|
| `slug` | ✅ | string | — | Must match filename |
| `title` | ✅ | string | — | Shown in listings and `<h1>` |
| `excerpt` | ✅ | string | — | Card preview + meta description |
| `date` | ✅ | string | — | YYYY-MM-DD, controls sort order (newest first) |
| `readTime` | optional | integer | `5` | Minutes — word count ÷ 200, round up |
| `category` | optional | string | `"teaching"` | See category table below |
| `author` | optional | string | `"Teacher Bek"` | Only set if different |
| `featured` | optional | boolean | `false` | Promotes to homepage Reads preview |
| `draft` | optional | boolean | `false` | Hides post from all listings |
| `image` | optional | string | none | Cover image URL, 1200×800 recommended |
| `tags` | optional | string | none | Comma-separated, no quotes, used for related posts |
| `updatedAt` | optional | string | none | YYYY-MM-DD — shown as "Last updated" on the article |
| `locale` | optional | string | inferred | Inferred from folder structure — almost never needed |

---

## Category values

| Value | Use for |
|---|---|
| `teaching` | Methodology, classroom management, teacher observations |
| `parents` | Advice addressed to parents of young learners |
| `learning` | Practical tips students can apply themselves |
| `stories` | Student progress, personal narrative, case studies |

---

## What makes a post get picked up

All three conditions must be true:

1. Filename is lowercase kebab-case — `my-post.md` ✅ — `TEMPLATE.md` ❌ — `_draft.md` ❌
2. `slug`, `title`, `excerpt`, and `date` are all present and non-empty
3. `draft: true` is **not** set (or the field is absent entirely)

If any required field is missing, the post is silently skipped with a warning in the Vercel function logs.

---

## File location

Posts live in `itsbek/teacher-blog-content`, organised by locale:

```
en/   ← English — primary, always required
  my-post-title.md

vi/   ← Vietnamese
  my-post-title.md   ← same slug, translated content

zh/   ← Chinese (Simplified)
  my-post-title.md

ru/   ← Russian
  my-post-title.md
```

**Fallback rule:** if a locale folder is empty or missing, the site falls back to `en/` automatically. You don't need to translate every post.

---

## Publishing workflow

1. Copy the starter block above into a new file
2. Name the file `your-slug.md` — must match the `slug` field
3. Place it in the correct locale folder (`en/`, `vi/`, `zh/`, or `ru/`)
4. Push to `main` — GitHub webhook fires → site updates within seconds, no redeploy needed
5. To unpublish: add `draft: true` and push again

---

## Quick checklist before pushing

- [ ] Filename is lowercase kebab-case and matches `slug`
- [ ] `slug`, `title`, `excerpt`, `date` are all filled in
- [ ] `date` is YYYY-MM-DD format
- [ ] `readTime` is set (word count ÷ 200, rounded up)
- [ ] `draft: true` is absent or removed when going live
- [ ] Image URL ends with `?w=1200&q=80` if using Unsplash
- [ ] Tags are comma-separated with no quotes
