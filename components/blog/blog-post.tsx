"use client";

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/lib/blog';
import { trackBlogRead } from '@/lib/analytics';

interface BlogPostProps {
  post: BlogPostType;
  locale: string;
  relatedPosts: BlogPostType[];
}

export function BlogPost({ post, locale, relatedPosts }: BlogPostProps) {
  const t = useTranslations('blog');
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Track blog post read
    trackBlogRead(post.slug, post.title);
  }, [post.slug, post.title]);

  // Process markdown-like content to HTML
  const processContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('## ')) {
          return `<h2 class="font-display text-2xl md:text-3xl font-semibold text-foreground mt-12 mb-6" style="letter-spacing: -0.02em">${line.slice(3)}</h2>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="font-display text-xl md:text-2xl font-semibold text-foreground mt-8 mb-4">${line.slice(4)}</h3>`;
        }
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
        // Italic text
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Lists
        if (line.startsWith('- ')) {
          return `<li class="ml-6 mb-2 text-muted-foreground">${line.slice(2)}</li>`;
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<li class="ml-6 mb-2 text-muted-foreground list-decimal">${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        // Empty lines
        if (line.trim() === '') {
          return '<br />';
        }
        // Regular paragraphs
        return `<p class="text-muted-foreground leading-relaxed mb-4">${line}</p>`;
      })
      .join('');
  };

  return (
    <article className="pt-32 pb-16">
      <div className="container-lg">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {t('backToBlog')}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl mb-12"
        >
          {/* Category */}
          <span className="inline-block px-3 py-1 mb-6 text-xs font-accent tracking-wider uppercase text-primary bg-primary/10 rounded-full">
            {t(`categories.${post.category}`)}
          </span>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-6" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString(locale, {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTime} {t('readTime')}
            </span>
          </div>
        </motion.header>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="h-px bg-gradient-to-r from-primary via-border to-transparent mb-12 origin-left max-w-3xl"
        />

        {/* Content */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl prose-custom"
        >
          <div
            className="text-base md:text-lg"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
        </motion.div>

        {/* Author CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/10"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-display font-semibold">
              E
            </div>
            <div className="flex-1">
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                Ready to start YOUR English journey?
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                Book a free consultation and let's create a personalized learning plan for you.
              </p>
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-2 text-primary font-medium text-sm hover:gap-3 transition-all"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="group p-6 rounded-xl border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <span className="inline-block px-2 py-0.5 mb-3 text-xs font-accent tracking-wider uppercase text-primary/70 bg-primary/5 rounded">
                    {t(`categories.${relatedPost.category}`)}
                  </span>
                  <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </article>
  );
}
