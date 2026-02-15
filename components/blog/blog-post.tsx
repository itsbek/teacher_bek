"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { BlogPost as BlogPostType } from "@/lib/blog-types";
import { trackBlogRead } from "@/lib/analytics";
import { KineticText } from "@/components/KineticText";

interface BlogPostProps {
  post: BlogPostType;
  locale: string;
  relatedPosts: BlogPostType[];
}

export function BlogPost({ post, locale, relatedPosts }: BlogPostProps) {
  const t = useTranslations("blog");
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isVisible = useInView(contentRef, { once: true, margin: "-100px" });

  useEffect(() => {
    trackBlogRead(post.slug, post.title);
  }, [post.slug, post.title]);

  // Editorial-grade content processor
  const processContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("## ")) {
          return `<h2 class="text-3xl md:text-5xl font-display tracking-tight mt-20 mb-10 leading-none">${line.slice(3)}</h2>`;
        }
        if (line.startsWith("### ")) {
          return `<h3 class="text-2xl md:text-3xl font-display italic mt-12 mb-6">${line.slice(4)}</h3>`;
        }
        if (line.trim() === "") return '<div class="h-8"></div>';

        // Bold/Italic replacements
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>');
        line = line.replace(/\*(.*?)\*/g, '<em class="italic text-foreground/80">$1</em>');

        return `<p class="text-lg md:text-xl font-sans font-light leading-relaxed text-foreground/70 mb-8 max-w-3xl">${line}</p>`;
      })
      .join("");
  };

  return (
    <article ref={articleRef} className="bg-background text-foreground pb-40">
      {/* Prestige Article Header */}
      <header className="px-6 md:px-12 lg:px-24 pt-24 lg:pt-40 mb-24 border-b border-foreground/5 pb-24">
        <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            <Link
              href={`/${locale}/blog`}
              className="text-[var(--text-xs)] font-mono tracking-[0.4em] uppercase opacity-40 hover:opacity-100 transition-opacity flex items-center gap-4 mb-12 group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Return to Journal
            </Link>

            <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase text-foreground/30 mb-8 block">
              Archive Record // {post.category.toUpperCase()}
            </span>

            <h1 className="text-[var(--text-display-lg)] font-display leading-[0.9] tracking-tightest mb-0">
              <KineticText text={post.title} />
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-4 border-l border-foreground/10 pl-8 lg:text-right lg:border-l-0 lg:border-r lg:pr-8">
            <div className="space-y-4">
              <span className="text-[var(--text-xs)] font-mono opacity-40 block tracking-widest">{post.date}</span>
              <span className="text-[var(--text-xs)] uppercase font-bold tracking-[0.2em]">{post.author}</span>
              <div className="w-12 h-[1px] bg-foreground/20 ml-auto mr-0 hidden lg:block" />
              <span className="text-[var(--text-xs)] opacity-40 block tracking-widest">{post.readTime} READ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content: 12-Column Alignment */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8">
          {/* Floating Sidebar: Academic Markers */}
          <aside className="col-span-12 lg:col-span-3 hidden lg:block">
            <div className="sticky top-40 space-y-12 opacity-30">
              <div className="flex flex-col gap-2">
                <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40">CATALOGUE_ID</span>
                <span className="text-[var(--text-xs)] font-mono">VF-{post.slug.slice(0, 6).toUpperCase()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40">ACCESS_LEVEL</span>
                <span className="text-[var(--text-xs)] font-mono">UNRESTRICTED</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40">DISCOURSE_TYPE</span>
                <span className="text-[var(--text-xs)] font-mono">{post.category.toUpperCase()}</span>
              </div>
            </div>
          </aside>

          {/* Main Content Body */}
          <div
            ref={contentRef}
            className="col-span-12 lg:col-span-9 lg:pl-24 prose prose-vanguard max-w-none"
            dangerouslySetInnerHTML={{ __html: processContent(post.content) }}
          />
        </div>
      </div>

      {/* Related Intellectual Inquiry */}
      {relatedPosts.length > 0 && (
        <section className="mt-40 pt-24 border-t border-foreground/5 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1920px] mx-auto">
            <h2 className="text-[10px] font-mono tracking-[0.4em] uppercase opacity-40 mb-20 text-center">Extended Discourse</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.slug}
                  href={`/${locale}/blog/${rPost.slug}`}
                  className="bg-background group p-12 lg:p-20 hover:bg-black hover:text-white transition-colors duration-700"
                >
                  <span className="text-[var(--text-xs)] font-mono opacity-40 mb-8 block group-hover:text-white/50">{rPost.date} // NEXT</span>
                  <h3 className="text-[var(--text-xl)] md:text-[var(--text-2xl)] font-display leading-[0.9] group-hover:italic transition-all">{rPost.title}</h3>
                  <div className="mt-12 w-8 h-[2px] bg-foreground group-hover:bg-white transition-all group-hover:w-16" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
