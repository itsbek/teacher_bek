# Blog Post Markdown Schema

Each post is a single `.md` file in the GitHub content repo (`itsbek/teacher-blog-content`).

**Filename rules:**
- Lowercase kebab-case only: `my-post-title.md`
- Must match the `slug` field exactly (without `.md`)
- Files starting with an uppercase letter or underscore are silently ignored — `TEMPLATE.md`, `README.md`, `_ideas.md` will never appear on the site

---

## Frontmatter

```yaml
---
# ── REQUIRED ────────────────────────────────────────────────────────────────
# Missing any of these four = post is skipped entirely

slug: "teaching-vocabulary-that-sticks"
# URL identifier. Must exactly match the filename (without .md).
# Lowercase, hyphens only. No spaces, no special characters.
# Becomes: /en/blog/teaching-vocabulary-that-sticks

title: "How I Teach Vocabulary That Actually Sticks"
# Full post title. Shown in the browser tab, listing cards, and article <h1>.

excerpt: "Most vocab is forgotten within 48 hours. Here's the single change that fixed that in my classroom."
# 1–3 sentences. Shown in listing cards and used as the meta description.
# Write it to make someone want to click.

date: "2026-03-10"
# Publication date. YYYY-MM-DD format. Controls sort order — newest first.

# ── OPTIONAL ────────────────────────────────────────────────────────────────

readTime: 4
# Estimated reading time in minutes. Integer.
# Rule of thumb: word count ÷ 200, round up.
# Defaults to 5 if omitted.

category: "teaching"
# One of: teaching | parents | learning | stories
# Defaults to "teaching" if omitted or an unrecognised value.

author: "Teacher Bek"
# Display name shown on the post. Defaults to "Teacher Bek" — only set if different.

featured: true
# Set to true to promote this post to the homepage Reads section preview.
# Omit (or set false) for regular posts. At most 1–2 posts should be featured at once.

draft: true
# Set to true to hide this post from all listings while writing.
# The post exists in the repo but is invisible on the site.
# Remove this line (or set false) when ready to publish.

image: "https://images.unsplash.com/photo-XXXXXX?w=1200&q=80"
# Cover image URL. Displayed as the post hero and used for OG / Twitter card previews.
# Recommended size: 1200×800. Unsplash works well — append ?w=1200&q=80 for fast loading.

tags: speaking, vocabulary, fluency
# Comma-separated keywords. Used to surface related posts at the bottom of an article.
# No quotes needed. Keep to 3–5 relevant terms.

updatedAt: "2026-04-01"
# ISO date YYYY-MM-DD. Only set if you significantly revise a published post.
# Shown as "Last updated" on the article page when present.

locale: "en"
# Inferred automatically from the folder structure (en/, vi/, zh/, ru/).
# Only override this if you have a specific reason — almost never needed.
---
```

---

## Field reference

| Field | Required | Type | Default | Notes |
|---|---|---|---|---|
| `slug` | ✅ | string | — | Must match filename |
| `title` | ✅ | string | — | Shown in listings and `<h1>` |
| `excerpt` | ✅ | string | — | Card preview + meta description |
| `date` | ✅ | string | — | YYYY-MM-DD, controls sort order |
| `readTime` | optional | integer | `5` | Minutes, word count ÷ 200 |
| `category` | optional | string | `"teaching"` | See category table below |
| `author` | optional | string | `"Teacher Bek"` | Display name |
| `featured` | optional | boolean | `false` | Promotes to homepage Reads preview |
| `draft` | optional | boolean | `false` | Hides post from all listings |
| `image` | optional | string | none | Cover image URL, 1200×800 |
| `tags` | optional | string | none | Comma-separated, used for related posts |
| `updatedAt` | optional | string | none | YYYY-MM-DD, shown as "Last updated" |
| `locale` | optional | string | inferred | Override only if needed |

---

## Category values

| Value | Use for |
|---|---|
| `teaching` | Methodology, classroom management, teacher observations |
| `parents` | Advice addressed to parents of young learners |
| `learning` | Practical tips students can apply themselves |
| `stories` | Student progress, personal narrative, case studies |

---

## Body

Plain markdown after the closing `---`. No special syntax needed.

```markdown
Opening paragraph — no heading. Start mid-thought or mid-scene. Never open with
"In this post I will..." or "Today we're going to look at..."

## First section heading

One idea per section. Use real classroom examples, numbers, specific
names of techniques. Short paragraphs (2–4 sentences).

## Second section heading

Keep it moving. Each section should answer a question the previous one raised.

> Pull quote — a single sentence worth highlighting.

### Subsection (use sparingly)

- Bullet lists work well for tips and steps
- Keep each item to one line if possible

**Bold** for key terms. *Italic* for titles, foreign words, or soft emphasis.

## Practical takeaway

End with something the reader can do today. Specific beats vague.

---

*Have a question? [Message me directly](/en#contact)*
```

---

## What makes a post get picked up

All conditions must be true:

1. Filename is lowercase kebab-case: `my-post.md` ✅ — `TEMPLATE.md` ❌ — `_draft.md` ❌
2. `slug`, `title`, `excerpt`, and `date` are all present and non-empty
3. `draft: true` is **not** set (or the field is absent)

If any required field is missing, the post is silently skipped with a warning in the server logs.

---

## File location

Posts live in `itsbek/teacher-blog-content`, organised by locale folder:

```
en/   ← English — primary, always required
  teaching-vocabulary-that-sticks.md

vi/   ← Vietnamese
  teaching-vocabulary-that-sticks.md   ← same slug, translated content

zh/   ← Chinese (Simplified)
  teaching-vocabulary-that-sticks.md

ru/   ← Russian
  teaching-vocabulary-that-sticks.md
```

**Fallback rule:** if a locale folder is empty or missing, the site automatically falls back to `en/`. You don't need to translate every post — English content shows for any locale that doesn't have its own version.

---

## Publishing workflow

1. Copy the frontmatter block above, fill in all required fields
2. Write the body in plain markdown below the closing `---`
3. Save as `your-slug.md` in the correct locale folder (e.g. `en/your-slug.md`)
4. Push to `main` — GitHub webhook fires → site updates within seconds, no redeploy needed
5. To unpublish: set `draft: true` and push again

---

## Quick checklist before pushing

- [ ] Filename is lowercase kebab-case and matches `slug`
- [ ] `slug`, `title`, `excerpt`, `date` are all filled in
- [ ] `date` is in YYYY-MM-DD format
- [ ] `readTime` is set (word count ÷ 200, rounded up)
- [ ] `draft: true` is removed (or absent) when ready to go live
- [ ] Image URL ends with `?w=1200&q=80` if using Unsplash
- [ ] Tags are comma-separated with no quotes
