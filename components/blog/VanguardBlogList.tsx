"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { BlogPost, Category, categories } from "@/lib/blog-types";

const POSTS_PER_PAGE = 6;

interface VanguardBlogListProps {
    posts: BlogPost[];
    locale: string;
}

export function VanguardBlogList({ posts, locale }: VanguardBlogListProps) {
    const t = useTranslations("blog");
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

    const filteredPosts = activeCategory === "all"
        ? posts
        : posts.filter(post => post.category === activeCategory);

    const visiblePosts = filteredPosts.slice(0, visibleCount);
    const hasMore = visibleCount < filteredPosts.length;

    const handleCategoryChange = (cat: Category) => {
        setActiveCategory(cat);
        setVisibleCount(POSTS_PER_PAGE); // reset pagination when filtering
    };

    return (
        <>
            <section className="py-8 md:py-16 bg-background text-foreground px-6 md:px-12 lg:px-24">
                <div className="w-full">

                    {/* Filter System */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 md:mb-10 border-b border-foreground/10 pb-5 md:pb-8">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleCategoryChange(cat)}
                                className={`type-label-tight transition-all pb-1 ${activeCategory === cat
                                    ? "text-foreground border-b border-foreground"
                                    : "text-foreground/35 hover:text-foreground/65"
                                    }`}
                            >
                                {t(`categories.${cat}`)}
                            </button>
                        ))}
                    </div>

                    {/* Post List — min-height prevents layout collapse with few posts */}
                    <div className="space-y-0 min-h-[40vh]">
                        {visiblePosts.map((post, idx) => (
                            <Link
                                key={post.slug}
                                href={`/${locale}/blog/${post.slug}`}
                                onMouseEnter={() => setHoveredSlug(post.slug)}
                                onMouseLeave={() => setHoveredSlug(null)}
                                className="group relative block py-4 md:py-8 border-b border-foreground/10 overflow-hidden"
                            >
                                <div className="grid grid-cols-12 gap-3 md:gap-8 items-center relative z-10">
                                    {/* Index */}
                                    <div className="col-span-1 hidden md:block">
                                        <span className="type-meta opacity-15 group-hover:opacity-60 transition-opacity">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                    </div>

                                    {/* Title & Category */}
                                    <div className="col-span-10 md:col-span-8 lg:col-span-8">
                                        <span className="type-meta uppercase opacity-35 mb-1 block">
                                            {t(`categories.${post.category}`)}
                                        </span>
                                        <h2 className="text-[clamp(0.95rem,1.6vw,1.35rem)] font-display font-bold leading-snug tracking-tight group-hover:translate-x-1 transition-transform duration-500">
                                            {post.title}
                                        </h2>
                                    </div>

                                    {/* Meta + Arrow (combined on mobile) */}
                                    <div className="col-span-2 md:col-span-2 lg:col-span-2 text-right flex flex-col items-end gap-1.5">
                                        <ArrowUpRight size={14} className="opacity-25 group-hover:opacity-100 transition-opacity md:hidden" />
                                        <span className="type-meta opacity-30 hidden md:block">
                                            {new Date(post.date).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>

                                    {/* Arrow — desktop only */}
                                    <div className="hidden md:flex col-span-1 justify-end">
                                        <ArrowUpRight size={16} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>

                                <div
                                    className="absolute inset-0 bg-foreground/[0.03] -translate-x-full group-hover:translate-x-0 transition-transform duration-500 z-0"
                                />
                            </Link>
                        ))}

                        {filteredPosts.length === 0 && (
                            <div className="py-24 text-center">
                                <span className="type-label opacity-40">No articles in this category yet</span>
                            </div>
                        )}
                    </div>

                    {/* Pagination — Load More */}
                    {hasMore && (
                        <div className="mt-10 flex justify-center">
                            <button
                                onClick={() => setVisibleCount(c => c + POSTS_PER_PAGE)}
                                className="group inline-flex items-center gap-3 px-8 py-3 border border-foreground/20 type-label-tight text-foreground/60 hover:border-foreground hover:text-foreground transition-all duration-300"
                            >
                                Load More
                                <span className="opacity-40 group-hover:opacity-100 transition-opacity">
                                    ({filteredPosts.length - visibleCount} remaining)
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Post count indicator */}
                    {filteredPosts.length > 0 && (
                        <p className="mt-6 text-center type-meta opacity-30">
                            Showing {Math.min(visibleCount, filteredPosts.length)} of {filteredPosts.length}
                        </p>
                    )}

                    <div className="mt-8 md:mt-16 border border-foreground/10 p-5 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
                        <p className="type-body text-foreground/65">
                            Want to apply this to your own English? <span className="italic">Book a free chat.</span>
                        </p>
                        <a
                            href={`/${locale}#contact`}
                            className="inline-flex items-center gap-3 px-6 py-2.5 border border-foreground type-label-tight hover:bg-foreground hover:text-background transition-colors shrink-0"
                        >
                            Get in Touch
                            <ArrowUpRight size={13} />
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
