"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BlogPost as BlogPostType } from "@/lib/blog-types";
import { trackBlogRead } from "@/lib/analytics";
import { KineticText } from "@/components/KineticText";

interface BlogPostProps {
  post: BlogPostType;
  locale: string;
  relatedPosts: BlogPostType[];
}

export function BlogPost({ post, locale, relatedPosts }: BlogPostProps) {
  const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    trackBlogRead(post.slug, post.title);
  }, [post.slug, post.title]);

  const renderInlineMarkdown = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
    return parts.map((part, idx) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`strong-${idx}`} className="font-bold text-foreground">
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={`em-${idx}`} className="italic text-foreground/80">
            {part.slice(1, -1)}
          </em>
        );
      }

      return <React.Fragment key={`text-${idx}`}>{part}</React.Fragment>;
    });
  };

  const renderContent = (content: string) => {
    return content.split("\n").map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h2 key={`h2-${i}`} className="type-title-md tracking-tight mt-20 mb-10 leading-none">
            {line.slice(3)}
          </h2>
        );
      }

      if (line.startsWith("### ")) {
        return (
          <h3 key={`h3-${i}`} className="type-title-sm italic mt-12 mb-6">
            {line.slice(4)}
          </h3>
        );
      }

      if (line.trim() === "") {
        return <div key={`space-${i}`} className="h-8" aria-hidden="true" />;
      }

      return (
        <p key={`p-${i}`} className="type-body text-foreground/70 mb-8 max-w-3xl">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  return (
    <article ref={articleRef} className="bg-background text-foreground pb-40">
      {/* Prestige Article Header */}
      <header className="px-6 md:px-12 lg:px-24 pt-24 lg:pt-40 mb-24 border-b border-foreground/5 pb-24">
        <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-end">
          <div className="col-span-12 lg:col-span-8">
            <Link
              href={`/${locale}/blog`}
              className="type-label opacity-40 hover:opacity-100 transition-opacity flex items-center gap-4 mb-12 group"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              Return to Journal
            </Link>

            <span className="type-meta uppercase text-foreground/30 mb-8 block">
              Category // {post.category.toUpperCase()}
            </span>

            <h1 className="type-display leading-[0.9] mb-0">
              <KineticText text={post.title} />
            </h1>
          </div>

          <div className="col-span-12 lg:col-span-4 lg:pb-4 border-l border-foreground/10 pl-8 lg:text-right lg:border-l-0 lg:border-r lg:pr-8">
            <div className="space-y-4">
              <span className="type-meta opacity-40 block">{post.date}</span>
              <span className="type-label-tight">{post.author}</span>
              <div className="w-12 h-[1px] bg-foreground/20 ml-auto mr-0 hidden lg:block" />
              <span className="type-meta opacity-40 block">{post.readTime} READ</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content: 12-Column Alignment */}
      <div className="px-6 md:px-12 lg:px-24">
        <div className="max-w-[1920px] mx-auto mb-14 border border-foreground/10 p-8 md:p-10 bg-foreground/[0.02]">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="type-label-tight text-foreground/50 mb-3">Applied Learning</p>
              <h2 className="type-title-md">
                Want this strategy tailored to your level?
              </h2>
              <p className="type-body mt-3 text-foreground/70 max-w-3xl">
                Turn this article into a weekly speaking and feedback plan, personalized to your goal and timeline.
              </p>
            </div>
            <a
              href={`/${locale}#contact`}
              className="inline-flex items-center gap-3 px-6 py-3 border border-foreground type-label-tight hover:bg-foreground hover:text-background transition-colors link-sheen"
            >
              Request Personal Plan
            </a>
          </div>
        </div>

        <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8">
          {/* Floating Sidebar: Academic Markers */}
          <aside className="col-span-12 lg:col-span-3 hidden lg:block">
            <div className="sticky top-40 space-y-12 opacity-30">
              <div className="flex flex-col gap-2">
                <span className="type-meta uppercase opacity-40">CATALOGUE_ID</span>
                <span className="type-meta">VF-{post.slug.slice(0, 6).toUpperCase()}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="type-meta uppercase opacity-40">FOCUS</span>
                <span className="type-meta">Applied English</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="type-meta uppercase opacity-40">TOPIC</span>
                <span className="type-meta">{post.category.toUpperCase()}</span>
              </div>
            </div>
          </aside>

          {/* Main Content Body */}
          <div className="col-span-12 lg:col-span-9 lg:pl-24 prose prose-vanguard max-w-none">
            {renderContent(post.content)}
          </div>
        </div>
      </div>

      <section className="mt-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-[1920px] mx-auto border border-foreground/10 p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
          <div>
            <p className="type-label-tight text-foreground/50 mb-3">Next Action</p>
            <h2 className="type-title-md">
              Ready to practice this in real conversations?
            </h2>
            <p className="type-body mt-3 text-foreground/70 max-w-3xl">
              Share your speaking goal and get a concrete roadmap with milestones and feedback structure.
            </p>
          </div>
          <a
            href={`/${locale}#contact`}
            className="inline-flex items-center gap-3 px-7 py-3 border border-foreground type-label-tight hover:bg-foreground hover:text-background transition-colors link-sheen"
          >
            Book Strategy Call
          </a>
        </div>
      </section>

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="mt-40 pt-24 border-t border-foreground/5 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1920px] mx-auto">
            <h2 className="type-label opacity-40 mb-20 text-center">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-foreground/10 border border-foreground/10">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.slug}
                  href={`/${locale}/blog/${rPost.slug}`}
                  className="bg-background group p-12 lg:p-20 hover:bg-foreground hover:text-background transition-colors duration-700"
                >
                  <span className="type-meta opacity-40 mb-8 block group-hover:text-background/70">{rPost.date}</span>
                  <h3 className="type-title-sm group-hover:italic transition-all">{rPost.title}</h3>
                  <div className="mt-12 w-8 h-[2px] bg-foreground group-hover:bg-background transition-all group-hover:w-16" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
