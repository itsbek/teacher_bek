# Student Writing — Markdown Schema

Student writing is stored as `.md` files in the GitHub content repo (`itsbek/teacher-blog-content`) under the `community/` subfolder. The same GitHub webhook that syncs blog posts also syncs student writing — no extra setup needed.

---

## How submissions work

1. **Student** uploads their work (photo of handwriting, Google Doc, Word file) to Google Drive and sets sharing to "Anyone with the link can view".
2. **Student** submits the form with: their name (private), level, title, and the Google Drive link.
3. **You receive an email** with their name and a clickable Drive link. Review it.
4. **If it's good**: create a `.md` file using the starter below, paste the Drive link into `driveLink`, write your feedback in `feedback`, and push.
5. **Wall updates** within seconds — no redeploy needed.

The student's **name is never shown on the wall**. Only the level badge, title, teacher feedback, and a "View work" button (linking to Drive) are visible publicly. You have the name in your inbox for your own records.

---

## Repo layout

```
your-content-repo/
  en/                        ← blog posts (existing)
  vi/
  zh/
  ru/
  community/                 ← student writing (new)
    linh-coffee-shop.md
    minh-why-i-started.md
    STUDENT_GUIDE.md         ← ignored (uppercase)
```

Files named with uppercase letters or underscores are silently ignored.

---

## Copy-paste starter

```markdown
---
slug: "linh-coffee-shop"
name: "Linh"
level: "Intermediate"
date: "2026-03-05"
title: "My Favourite Place in Saigon"
driveLink: "https://drive.google.com/file/d/XXXXXXXXXXXX/view"
feedback: "Really natural use of the present simple here — it reads like you're describing a real routine, which is exactly right. One thing to try next time: mix in a few longer sentences between the short ones. The rhythm will feel even more alive."

# excerpt: "Optional — shown if you want a preview on future listing pages. Auto-generated otherwise."
# featured: true
# draft: true
---
```

> **Note:** No body content is needed. The work lives on Drive. The body field is optional (leave it empty or omit it). The file only needs valid frontmatter.

---

## Field reference

| Field | Required | Type | Notes |
|---|---|---|---|
| `slug` | ✅ | string | Lowercase kebab-case, must match filename |
| `name` | ✅ | string | Student's real name — **private, never shown publicly**, used only for your records |
| `level` | ✅ | string | `Beginner` / `Intermediate` / `Advanced` |
| `date` | ✅ | string | YYYY-MM-DD — controls sort order (newest first) |
| `title` | ✅ | string | Shown on the wall card |
| `driveLink` | ✅ | string | Google Drive view link (make sure sharing is "Anyone with the link") |
| `feedback` | optional | string | Your improvement notes — shown on the card with a "Teacher's note" label |
| `excerpt` | optional | string | For future listing pages. Auto-generated if omitted. |
| `featured` | optional | boolean | Pins to the top of the wall |
| `draft` | optional | boolean | Hides from the wall entirely |

---

## Filename rules

- Lowercase kebab-case only: `linh-coffee-shop.md` ✅
- Must exactly match the `slug` field (without `.md`)
- Uppercase files are silently skipped: `STUDENT_GUIDE.md` ❌ `README.md` ❌
- Underscores also skipped: `_draft.md` ❌

A good naming convention: `{firstname}-{short-title}.md`

---

## What makes a post go live

All of these must be true:

1. Filename is lowercase kebab-case and matches `slug`
2. `slug`, `name`, `level`, `date`, `title`, and `driveLink` are all non-empty
3. `draft: true` is **not** set (or absent entirely)

---

## Quick checklist before pushing

- [ ] Filename is lowercase kebab-case and matches `slug`
- [ ] `slug`, `name`, `level`, `date`, `title`, `driveLink` are all filled in
- [ ] `date` is YYYY-MM-DD format
- [ ] Drive link sharing is set to "Anyone with the link can view"
- [ ] `feedback` is written (students come back to read it)
- [ ] `draft: true` is absent or removed
