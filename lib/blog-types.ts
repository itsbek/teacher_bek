export interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    author: string;
    date: string;
    readTime: number;
    category: 'teaching' | 'parents' | 'learning' | 'stories';
    image?: string;
    featured?: boolean;
}

export const categories = ['all', 'teaching', 'parents', 'learning', 'stories'] as const;
export type Category = typeof categories[number];
