"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { BlogPost, Category, categories } from "@/lib/blog-types";

interface VanguardBlogListProps {
    posts: BlogPost[];
    locale: string;
}

export function VanguardBlogList({ posts, locale }: VanguardBlogListProps) {
    const t = useTranslations("blog");
    const [activeCategory, setActiveCategory] = useState<Category>("all");
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    const filteredPosts = activeCategory === "all"
        ? posts
        : posts.filter(post => post.category === activeCategory);

    return (
        <section className="py-24 md:py-40 bg-background text-foreground px-6 md:px-12 lg:px-24">
            <div className="max-w-[1920px] mx-auto">
                {/* Academic Filter System */}
                <div className="flex flex-wrap gap-x-12 gap-y-6 mb-24 border-b border-foreground/10 pb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`text-[var(--text-xs)] uppercase tracking-[0.3em] font-bold transition-all ${activeCategory === cat
                                ? "text-foreground underline underline-offset-8"
                                : "text-foreground/30 hover:text-foreground/60"
                                }`}
                        >
                            {t(`categories.${cat}`)}
                        </button>
                    ))}
                </div>

                {/* Journal-style Row List */}
                <div className="space-y-0">
                    {filteredPosts.map((post, idx) => (
                        <Link
                            key={post.slug}
                            href={`/${locale}/blog/${post.slug}`}
                            onMouseEnter={() => setHoveredSlug(post.slug)}
                            onMouseLeave={() => setHoveredSlug(null)}
                            className="group relative block py-12 md:py-16 border-b border-foreground/10 overflow-hidden"
                        >
                            <div className="grid grid-cols-12 gap-8 items-center relative z-10">
                                {/* Index Column */}
                                <div className="col-span-1 hidden md:block">
                                    <span className="text-[var(--text-xs)] font-mono opacity-20 group-hover:opacity-100 transition-opacity">
                                        0{idx + 1}
                                    </span>
                                </div>

                                {/* Title & Category */}
                                <div className="col-span-12 md:col-span-8 lg:col-span-7">
                                    <span className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-40 mb-4 block">
                                        {t(`categories.${post.category}`)} // ARCHIVE_{post.slug.slice(0, 4).toUpperCase()}
                                    </span>
                                    <h2 className="text-[var(--text-xl)] md:text-[var(--text-display-lg)] font-display tracking-tightest leading-[0.85] group-hover:italic transition-all duration-700">
                                        {post.title}
                                    </h2>
                                </div>

                                {/* Meta Column */}
                                <div className="col-span-6 md:col-span-2 lg:col-span-3 text-right md:text-left">
                                    <span className="text-[var(--text-xs)] font-mono opacity-40 block mb-2">{post.date}</span>
                                    <span className="text-[var(--text-xs)] uppercase tracking-widest font-bold opacity-20 group-hover:opacity-100 transition-opacity">
                                        {post.readTime} reading
                                    </span>
                                </div>

                                {/* Link Column */}
                                <div className="col-span-6 md:col-span-1 lg:col-span-1 flex justify-end">
                                    <div className="w-12 h-12 rounded-full border border-foreground/10 flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-500">
                                        <ArrowUpRight size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Kinetic Row Reveal (Background) */}
                            <div className="absolute inset-0 bg-foreground/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-[0.16,1,0.3,1] z-0" />
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="py-40 text-center">
                        <span className="text-[var(--text-xs)] font-mono opacity-40 uppercase tracking-widest">Null return on filter inquiry</span>
                    </div>
                )}
            </div>
        </section>
    );
}
