"use client";

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { BlogPost as BlogPostType } from '@/lib/blog';
import { trackBlogRead } from '@/lib/analytics';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface BlogPostProps {
  post: BlogPostType;
  locale: string;
  relatedPosts: BlogPostType[];
}

export function BlogPost({ post, locale, relatedPosts }: BlogPostProps) {
  const t = useTranslations('blog');
  const contentRef = useRef<HTMLDivElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: "-100px" });

  useEffect(() => {
    // Track blog post read
    trackBlogRead(post.slug, post.title);
  }, [post.slug, post.title]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate related posts on scroll
      gsap.fromTo(".related-post-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.15,
          scrollTrigger: {
            trigger: ".related-posts-section",
            start: "top 80%",
            once: true,
          }
        }
      );
    }, articleRef);

    return () => ctx.revert();
  }, [relatedPosts]);

  // Process markdown-like content to HTML
  const processContent = (content: string) => {
    return content
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('## ')) {
          return `<h2 class="font-sans text-2xl md:text-3xl font-normal text-foreground dark:text-white mt-12 mb-6" style="letter-spacing: -0.02em">${line.slice(3)}</h2>`;
        }
        if (line.startsWith('### ')) {
          return `<h3 class="font-sans text-xl md:text-2xl font-normal text-foreground dark:text-white mt-8 mb-4" style="letter-spacing: -0.01em">${line.slice(4)}</h3>`;
        }
        // Bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-medium text-foreground dark:text-white">$1</strong>');
        // Italic text
        line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
        // Lists
        if (line.startsWith('- ')) {
          return `<li class="ml-6 mb-2 text-foreground/60 dark:text-white/60">${line.slice(2)}</li>`;
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return `<li class="ml-6 mb-2 text-foreground/60 dark:text-white/60 list-decimal">${line.replace(/^\d+\.\s/, '')}</li>`;
        }
        // Empty lines
        if (line.trim() === '') {
          return '<br />';
        }
        // Regular paragraphs
        return `<p class="text-foreground/60 dark:text-white/60 leading-relaxed mb-4">${line}</p>`;
      })
      .join('');
  };

  return (
    <article ref={articleRef} className="pt-32 pb-16 bg-[#FDFBF7] dark:bg-black min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-2 text-sm text-foreground/50 dark:text-white/50 hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-colors duration-300 group"
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
          <span className="inline-block px-4 py-1.5 mb-6 text-[11px] font-medium tracking-[0.1em] uppercase text-[#C4A84D] dark:text-[#ECD06F] bg-[#C4A84D]/10 dark:bg-[#ECD06F]/10 border border-[#C4A84D]/20 dark:border-[#ECD06F]/20 rounded-full">
            {t(`categories.${post.category}`)}
          </span>

          {/* Title */}
          <h1 className="font-sans text-3xl md:text-4xl lg:text-5xl font-normal text-foreground dark:text-white mb-6" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/50 dark:text-white/50">
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
          className="h-px bg-gradient-to-r from-[#C4A84D] dark:from-[#ECD06F] via-foreground/10 dark:via-white/10 to-transparent mb-12 origin-left max-w-3xl"
        />

        {/* Content */}
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl"
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
          className="max-w-3xl mt-16 p-8 rounded-2xl bg-white dark:bg-white/5 border border-foreground/10 dark:border-white/10 backdrop-blur-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#C4A84D]/10 dark:bg-[#ECD06F]/10 border border-[#C4A84D]/20 dark:border-[#ECD06F]/20 flex items-center justify-center text-[#C4A84D] dark:text-[#ECD06F] text-2xl font-sans font-normal">
              E
            </div>
            <div className="flex-1">
              <h3 className="font-sans text-lg font-normal text-foreground dark:text-white mb-2" style={{ letterSpacing: '-0.01em' }}>
                Ready to start YOUR English journey?
              </h3>
              <p className="text-foreground/50 dark:text-white/50 text-sm mb-4">
                Book a free consultation and let's create a personalized learning plan for you.
              </p>
              <Link
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-2 text-[#C4A84D] dark:text-[#ECD06F] font-medium text-sm hover:gap-3 transition-all duration-300"
              >
                Get in touch
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="related-posts-section mt-20">
            <h2 className="font-sans text-2xl font-normal text-foreground dark:text-white mb-8" style={{ letterSpacing: '-0.01em' }}>
              Related Articles
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${locale}/blog/${relatedPost.slug}`}
                  className="related-post-card group p-6 rounded-2xl border border-foreground/10 dark:border-white/10 bg-white dark:bg-white/5 hover:border-[#C4A84D]/30 dark:hover:border-[#ECD06F]/30 hover:bg-[#C4A84D]/5 dark:hover:bg-[#ECD06F]/5 transition-all duration-300"
                >
                  <span className="inline-block px-3 py-1 mb-3 text-[10px] font-medium tracking-[0.1em] uppercase text-[#C4A84D]/70 dark:text-[#ECD06F]/70 bg-[#C4A84D]/5 dark:bg-[#ECD06F]/5 border border-[#C4A84D]/10 dark:border-[#ECD06F]/10 rounded-full">
                    {t(`categories.${relatedPost.category}`)}
                  </span>
                  <h3 className="font-sans text-lg font-normal text-foreground dark:text-white group-hover:text-[#C4A84D] dark:group-hover:text-[#ECD06F] transition-colors duration-300 mb-2 line-clamp-2" style={{ letterSpacing: '-0.01em' }}>
                    {relatedPost.title}
                  </h3>
                  <p className="text-sm text-foreground/50 dark:text-white/50 line-clamp-2">
                    {relatedPost.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
