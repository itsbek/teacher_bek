"use client";

import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { BlogPost, categories, Category } from '@/lib/blog';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <section ref={sectionRef} className="section-sm">
      <div className="container-lg">
        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </motion.div>

        {/* Posts Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              variants={cardVariants}
              className="group"
            >
              <Link href={`/${locale}/blog/${post.slug}`}>
                <div className="relative h-full p-6 lg:p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-xl transition-all duration-500">
                  {/* Featured Badge */}
                  {post.featured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-3 right-6 inline-flex items-center gap-1.5 px-3 py-1 text-xs font-accent tracking-wider bg-accent text-accent-foreground rounded-full"
                    >
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </motion.div>
                  )}

                  {/* Category Badge */}
                  <span className="inline-block px-3 py-1 mb-4 text-xs font-accent tracking-wider uppercase text-primary bg-primary/10 rounded-full">
                    {t(`categories.${post.category}`)}
                  </span>

                  {/* Title */}
                  <h2 className="font-display text-xl lg:text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString(locale, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime} {t('readTime')}
                      </span>
                    </div>

                    <motion.span
                      className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ x: 4 }}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  </div>

                  {/* Hover gradient */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-muted-foreground">No posts found in this category yet.</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
