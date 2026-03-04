# Blog Post Markdown Schema

Each post is a single `.md` file. Filename must be lowercase kebab-case —
`TEMPLATE.md`, `README.md`, `_ideas.md` and anything starting with an uppercase
letter or underscore are automatically ignored by the site.

---

## Frontmatter

```yaml
---
# ── REQUIRED ────────────────────────────────────────────────────────────────

slug: "teaching-vocabulary-that-sticks"
# URL slug. Must match the filename (without .md). Lowercase, hyphens only.
# Becomes: /en/blog/teaching-vocabulary-that-sticks

title: "How I Teach Vocabulary That Actually Sticks"
# Shown in the browser tab, listing cards, and article header.

excerpt: "Most vocab is forgotten within 48 hours. Here's the single change that fixed that in my classroom."
# 1–3 sentences. Used as the meta description and listing card preview.
# Write it to make the reader want to click.

date: "2026-03-10"
# Publication date. YYYY-MM-DD. Controls sort order — newest first.

# ── OPTIONAL ────────────────────────────────────────────────────────────────

readTime: 4
# Estimated reading time in minutes. Rule of thumb: word count ÷ 200.
# Defaults to 5 if omitted.

category: "teaching"
# One of: teaching | parents | learning | stories
# Defaults to "teaching" if omitted or unrecognised.

author: "Teacher Bek"
# Defaults to "Teacher Bek" — only set if different.

featured: true
# Promotes this post to the homepage Reads section preview.
# Omit or set false for regular posts.

draft: true
# Hides the post everywhere while you're still writing.
# Remove the line (or set false) to publish.

image: "https://images.unsplash.com/photo-XXXXXX?w=1200&q=80"
# Cover image. Used for OG/Twitter card. 1200×630 recommended.

tags: speaking, vocabulary, fluency
# Comma-separated. Used to surface related posts at the bottom of an article.

updatedAt: "2026-04-01"
# Only set if you significantly revise a post after publishing.
---
```

---

## Category values

| Value | Use for |
|---|---|
| `teaching` | Methodology, how you run the classroom, teacher observations |
| `parents` | Advice addressed to parents of young learners |
| `learning` | Practical tips students can use themselves |
| `stories` | Student progress, personal narrative, case studies |

---

## Body

Plain markdown after the closing `---`. No special syntax needed.

```markdown
Opening paragraph — no heading. Start mid-thought. Never open with
"In this post I will..." or "Today we're going to look at..."

## First section

One idea per section. Use real classroom examples, numbers, specific
names of techniques. Short paragraphs (2–4 sentences).

## Second section

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

All three conditions must be true:

1. Filename matches `lowercase-kebab-case.md`
2. `slug`, `title`, `excerpt`, and `date` are all present and non-empty
3. `draft: true` is not set (or the field is absent entirely)

---

## File location

Posts live in the GitHub blog content repo, organised by locale:

```
en/   ← English (primary — always required)
  teaching-vocabulary-that-sticks.md

vi/   ← Vietnamese
  teaching-vocabulary-that-sticks.md   ← same slug, translated content

zh/   ← Chinese (Simplified)
ru/   ← Russian
```

If a locale folder is empty or missing, the site falls back to `en/` automatically.

---

## Publishing workflow

1. Write the post — copy the frontmatter block above, fill in the fields
2. Save as `your-slug.md` in the correct locale folder(s) in the GitHub repo
3. Push to main — GitHub webhook fires → site updates within seconds, no redeploy needed
4. To unpublish: set `draft: true` and push again
