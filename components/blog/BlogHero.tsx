"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { KineticText } from "@/components/KineticText";

export function BlogHero() {
    const t = useTranslations("blog");

    return (
        <section className="px-6 md:px-12 lg:px-24 pt-6 pb-10 md:pt-10 md:pb-14 border-b border-foreground/5">
            <div className="max-w-[1920px] mx-auto w-full text-center flex flex-col items-center gap-4 md:gap-6">
                <span className="type-label opacity-40">
                    {t("label")}
                </span>
                <h1 className="type-hero mx-auto">
                    <KineticText text={t("title")} noWrap={false} />
                </h1>
                <p className="type-body-lg max-w-2xl mx-auto opacity-75">{t("subtitle")}</p>
            </div>
        </section>
    );
}
