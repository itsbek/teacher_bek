export const categories = ['all', 'teaching', 'parents', 'learning', 'stories'] as const;
export type Category = typeof categories[number];
export type PostCategory = Exclude<Category, 'all'>;

export interface BlogPost {
  // ─── Required ────────────────────────────────────────────────────────────
  slug: string;        // URL-safe, kebab-case, unique per locale. e.g. "why-small-groups-work"
  title: string;       // Display title shown in listings and <h1>
  excerpt: string;     // 1–2 sentence teaser shown in cards and meta description
  content: string;     // Full markdown body (populated by parser — do not set in frontmatter)
  author: string;      // e.g. "Teacher Bek"
  date: string;        // ISO date: YYYY-MM-DD. Used for sorting (newest first)
  readTime: number;    // Estimated reading time in minutes (integer)
  category: PostCategory;

  // ─── Optional ────────────────────────────────────────────────────────────
  image?: string;      // Full URL, 1200×800 recommended. Used for OG/Twitter card
  featured?: boolean;  // true → shown in featured/highlighted sections
  draft?: boolean;     // true → excluded from all listings (safe to publish WIP)
  tags?: string[];     // Extra keywords, e.g. ["ielts", "speaking"]. Used for related posts
  updatedAt?: string;  // ISO date: YYYY-MM-DD. Shown as "Last updated" if set
  locale?: string;     // Inferred from folder structure. Override only if needed
}
