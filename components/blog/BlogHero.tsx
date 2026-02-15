"use client";

import React from "react";
import { KineticText } from "@/components/KineticText";

export function BlogHero() {
    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-48 border-b border-foreground/5">
            <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-end">
                <div className="col-span-12 lg:col-span-9">
                    <span className="text-[var(--text-xs)] font-mono tracking-[0.5em] uppercase opacity-40 mb-12 block">
                        Record — Discourse & Narrative
                    </span>
                    <h1 className="text-[var(--text-display-lg)] font-display leading-[0.8] tracking-tightest mb-12">
                        <KineticText text="Vanguard" /> <br />
                        <span className="italic">
                            <KineticText text="Journal" delay={0.2} className="italic" />
                        </span>
                    </h1>
                </div>
                <div className="col-span-12 lg:col-span-3 lg:pb-12 border-t border-foreground/10 lg:border-t-0 pt-12 lg:pt-0">
                    <p className="text-[var(--text-xl)] font-sans font-light leading-relaxed max-w-sm opacity-70">
                        A repository of clinical pedagogical insights and strategic communication frameworks.
                    </p>
                </div>
            </div>
        </section>
    );
}
