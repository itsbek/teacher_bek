# Blog Post Markdown Schema

Each blog post is a `.md` file placed in `content/blog/{locale}/`.

## Frontmatter Fields

```yaml
---
slug: "unique-url-slug"           # Required. URL-safe, kebab-case. Must be unique per locale.
title: "Post Title"               # Required. Display title.
excerpt: "Short summary..."       # Required. 1-2 sentences shown in blog listing cards.
author: "Teacher Bek"             # Required. Displayed on post page.
date: "2024-11-15"                # Required. ISO date YYYY-MM-DD. Used for sort order.
readTime: 5                       # Required. Integer minutes.
category: "teaching"              # Required. One of: teaching | parents | learning | stories
image: "https://..."              # Optional. Unsplash or hosted image URL (1200×800 recommended).
featured: true                    # Optional. Defaults to false. Shows in featured/homepage glimpse.
---
```

## Categories

| Value      | When to use                                                  |
|------------|--------------------------------------------------------------|
| `teaching` | Methodology, classroom observations, teacher reflections     |
| `parents`  | Advice for parents supporting children learning English      |
| `learning` | Tips and techniques for students studying English            |
| `stories`  | Student progress stories, case studies, anecdotes            |

## Body Content

Standard Markdown is supported. Recommended structure:

```markdown
## Section Heading

Body paragraph text. Keep paragraphs short (3-5 sentences).

### Subsection

- Bullet list items
- Work well for tips

**Bold** for emphasis. *Italic* for titles, terms, or soft emphasis.

> Blockquote for a student quote or memorable line.

## Another Section
```

## Locales

Posts live in locale-specific folders:
- `content/blog/en/` — English (primary, always required)
- `content/blog/vi/` — Vietnamese
- `content/blog/zh/` — Chinese (Simplified)
- `content/blog/ru/` — Russian

If a locale folder is missing, the site falls back to English automatically.

## File Naming Convention

`{slug}.md` — e.g. `why-small-groups-work.md`

The filename doesn't have to match the slug exactly, but keeping them the same avoids confusion.

## Google Drive Sync (Future)

When uploading from Google Drive:
1. Export Google Doc as Markdown (`.md`)
2. Add frontmatter block at the top (copy template above)
3. Place in the correct locale folder
4. The site re-reads content on next build/request — no code changes needed
