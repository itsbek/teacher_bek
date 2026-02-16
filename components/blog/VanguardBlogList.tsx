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
                <div className="grid grid-cols-12 gap-8 mb-16 border border-foreground/10">
                    <div className="col-span-12 lg:col-span-8 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-foreground/10 bg-foreground/[0.02]">
                        <p className="type-label-tight text-foreground/50 mb-4">Reader to Student Path</p>
                        <h2 className="type-title-md">
                            Reading is step one. <span className="italic">Speaking confidently</span> is the goal.
                        </h2>
                        <p className="type-body mt-4 text-foreground/70 max-w-3xl">
                            Every article reflects practical classroom methods used in real lessons.
                            If you want personalized application, request your plan directly.
                        </p>
                    </div>
                    <div className="col-span-12 lg:col-span-4 p-8 md:p-10 flex flex-col justify-between gap-6">
                        <div>
                            <p className="type-label-tight text-foreground/50 mb-3">Quick Action</p>
                            <p className="type-body text-foreground/75">Get a personalized roadmap based on your level and timeline.</p>
                        </div>
                        <a
                            href={`/${locale}#contact`}
                            className="inline-flex items-center gap-3 w-fit px-6 py-3 border border-foreground type-label-tight hover:bg-foreground hover:text-background transition-colors link-sheen"
                        >
                            Request My Plan
                            <ArrowUpRight size={14} />
                        </a>
                    </div>
                </div>

                {/* Academic Filter System */}
                <div className="flex flex-wrap gap-x-12 gap-y-6 mb-24 border-b border-foreground/10 pb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`type-label transition-all ${activeCategory === cat
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
                                    <span className="type-meta opacity-20 group-hover:opacity-100 transition-opacity">
                                        0{idx + 1}
                                    </span>
                                </div>

                                {/* Title & Category */}
                                <div className="col-span-12 md:col-span-8 lg:col-span-7">
                                    <span className="type-meta uppercase opacity-40 mb-4 block">
                                        {t(`categories.${post.category}`)}
                                    </span>
                                    <h2 className="type-title-lg group-hover:italic transition-all duration-700">
                                        {post.title}
                                    </h2>
                                </div>

                                {/* Meta Column */}
                                <div className="col-span-6 md:col-span-2 lg:col-span-3 text-right md:text-left">
                                    <span className="type-meta opacity-40 block mb-2">{post.date}</span>
                                    <span className="type-label-tight opacity-20 group-hover:opacity-100 transition-opacity">
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
                            <div
                              className="absolute inset-0 bg-foreground/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-700 z-0"
                              style={{ transitionTimingFunction: "var(--ease-editorial)" }}
                            />
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPosts.length === 0 && (
                    <div className="py-40 text-center">
                        <span className="type-label opacity-40">No articles in this category yet</span>
                    </div>
                )}

                <div className="mt-20 border border-foreground/10 p-8 md:p-12 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
                    <div>
                        <p className="type-label-tight text-foreground/50 mb-3">Need implementation, not just tips?</p>
                        <h3 className="type-title-md">
                            Build your fluency system with <span className="italic">direct teaching.</span>
                        </h3>
                    </div>
                    <a
                        href={`/${locale}#contact`}
                        className="inline-flex items-center gap-3 px-7 py-3 border border-foreground type-label-tight hover:bg-foreground hover:text-background transition-colors link-sheen"
                    >
                        Book Consultation
                    </a>
                </div>
            </div>
        </section>
    );
}
