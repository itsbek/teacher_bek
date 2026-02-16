"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { KineticText } from "@/components/KineticText";

export function BlogHero() {
    const t = useTranslations("blog");

    return (
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-36 border-b border-foreground/5">
            <div className="max-w-[1200px] mx-auto text-center section-stack">
                    <span className="type-label opacity-40 mb-12 block">
                        English Learning Blog
                    </span>
                    <h1 className="type-display max-w-[12ch] mx-auto">
                        <KineticText text={t("title")} />
                    </h1>
                    <p className="type-body-lg max-w-3xl mx-auto opacity-75">{t("subtitle")}</p>
                    <p className="type-label-tight opacity-55">
                        Practical reading for students, parents, and professionals.
                    </p>
            </div>
        </section>
    );
}
