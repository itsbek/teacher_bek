"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost, categories, Category } from '@/lib/blog-types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogListProps {
  posts: BlogPost[];
  locale: string;
}

export function BlogList({ posts, locale }: BlogListProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const t = useTranslations('blog');
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" });

  const filteredPosts = activeCategory === 'all'
    ? posts
    : posts.filter(post => post.category === activeCategory);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".blog-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.1,
          scrollTrigger: {
            trigger: ".blog-grid",
            start: "top 80%",
            once: true,
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [filteredPosts]);

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-[#FDFBF7] dark:bg-black min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Category Filter */}
        <motion.div
          initial={false}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-wrap gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2.5 text-sm font-medium tracking-wide rounded-full transition-all duration-300 ${activeCategory === category
                  ? 'bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black'
                  : 'bg-foreground/5 dark:bg-white/5 text-foreground/60 dark:text-white/60 border border-foreground/10 dark:border-white/10 hover:bg-foreground/10 dark:hover:bg-white/10 hover:text-foreground dark:hover:text-white hover:border-foreground/20 dark:hover:border-white/20'
                }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.slug}
              className="blog-card group"
            >
              <Link href={`/${locale}/blog/${post.slug}`}>
                <div className="relative h-full p-6 lg:p-8 rounded-2xl border border-foreground/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#C4A84D]/30 dark:hover:border-[#ECD06F]/30 hover:bg-[#C4A84D]/5 dark:hover:bg-[#ECD06F]/5 transition-all duration-500">
                  {/* Featured Badge */}
                  {post.featured && (
                    <div className="absolute -top-3 right-6 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium tracking-[0.05em] bg-[#C4A84D] dark:bg-[#ECD06F] text-white dark:text-black rounded-full">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 mb-4 text-[13px] font-medium tracking-[0.1em] uppercase text-[#C4A84D] dark:text-[#ECD06F] bg-[#C4A84D]/10 dark:bg-[#ECD06F]/10 border border-[#C4A84D]/20 dark:border-[#ECD06F]/20 rounded-full">
                    {t(`categories.${post.category}`)}
                  </span>

                  {/* Title */}
                  <h2 className="font-sans text-xl lg:text-2xl font-normal text-foreground dark:text-white mb-3 group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors duration-300 line-clamp-2" style={{ letterSpacing: '-0.01em' }}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-foreground/50 dark:text-white/50 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-foreground/10 dark:border-white/10">
                    <span className="text-xs text-foreground/40 dark:text-white/40">
                      {new Date(post.date).toLocaleDateString(locale, { month: 'short', year: 'numeric' })}
                    </span>

                    <motion.span
                      className="text-[#C4A84D] dark:text-[#ECD06F] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      whileHover={{ x: 4 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </div>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C4A84D]/5 dark:from-[#ECD06F]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-foreground/50 dark:text-white/50">No posts found in this category yet.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
