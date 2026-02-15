import fs from 'fs';
import path from 'path';
import { BlogPost } from './blog-types';

const CONTENT_PATH = path.join(process.cwd(), 'content/blog');

function parseMarkdown(fileContent: string): Partial<BlogPost> & { body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);

  if (!match) return { body: fileContent };

  const frontmatter = match[1];
  const body = match[2];
  const metadata: Record<string, any> = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      let value = valueParts.join(':').trim();
      // Remove surrounding quotes
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);

      if (key.trim() === 'readTime') {
        metadata[key.trim()] = parseInt(value);
      } else if (key.trim() === 'featured') {
        metadata[key.trim()] = value === 'true';
      } else {
        metadata[key.trim()] = value;
      }
    }
  });

  return { ...metadata, body };
}

export function getBlogPosts(locale: string): BlogPost[] {
  const localePath = path.join(CONTENT_PATH, locale);

  if (!fs.existsSync(localePath)) {
    // Fallback to English if locale doesn't exist
    if (locale !== 'en') return getBlogPosts('en');
    return [];
  }

  const files = fs.readdirSync(localePath);
  const posts = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const filePath = path.join(localePath, file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { body, ...metadata } = parseMarkdown(fileContent);

      return {
        ...metadata,
        content: body,
      } as BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  const posts = getBlogPosts(locale);
  return posts.find(post => post.slug === slug);
}

export function getFeaturedPosts(locale: string): BlogPost[] {
  return getBlogPosts(locale).filter(post => post.featured);
}

export function getPostsByCategory(locale: string, category: string): BlogPost[] {
  if (category === 'all' || !category) return getBlogPosts(locale);
  return getBlogPosts(locale).filter(post => post.category === category);
}

export function getAllSlugs(locale: string): string[] {
  return getBlogPosts(locale).map(post => post.slug);
}

export const categories = ['all', 'teaching', 'parents', 'learning', 'stories'] as const;
export type Category = typeof categories[number];
