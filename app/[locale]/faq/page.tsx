"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { Plus } from "lucide-react";
import { KineticText } from "@/components/KineticText";

export default function FAQPage() {
    const t = useTranslations("faq");

    const faqs = [
        {
            q: "How does elite mentorship differ from traditional teaching?",
            a: "Traditional teaching often prioritizes standardized metrics. Elite mentorship focuses on cognitive architecture—building the mental models required for high-stakes intellectual leadership."
        },
        {
            q: "What is 'Conceptual Literacy'?",
            a: "It is the ability to deconstruct complex narratives and build new ones with precision. We treat linguistic mastery as an architectural discipline."
        },
        {
            q: "Is this program suitable for corporate executives?",
            a: "Our 'Corporate Dialect' framework is specifically designed for high-potential leaders who need to master the linguistic protocols of international diplomacy and high-level strategy."
        },
        {
            q: "Can I apply for a 1:1 strategy session immediately?",
            a: "Admission is by inquiry only. We prioritize students who demonstrate intellectual resilience and a commitment to radical growth."
        }
    ];

    return (
        <>
            <VanguardNavigation />
            <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased">
                {/* FAQ Hero: Minimalist Logic */}
                <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-48">
                    <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8">
                        <div className="col-span-12 lg:col-span-9">
                            <span className="text-[var(--text-xs)] font-mono tracking-[0.5em] uppercase opacity-40 mb-12 block">
                                Inquiry — Knowledge Base 0.1
                            </span>
                            <h1 className="text-[var(--text-display-lg)] font-display leading-[0.8] tracking-tightest mb-12">
                                <KineticText text="Frequent" /> <br /><span className="italic"><KineticText text="Questions" delay={0.2} className="italic" /></span>
                            </h1>
                        </div>
                    </div>
                </section>

                {/* FAQ Content: Prestige Accordion */}
                <section className="pb-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
                    <div className="max-w-[1920px] mx-auto">
                        <div className="grid grid-cols-12 gap-8 py-24">
                            <div className="col-span-12 lg:col-span-4 lg:pr-24 mb-12 lg:mb-0">
                                <h2 className="text-[var(--text-xs)] font-mono tracking-widest uppercase opacity-30 mb-8">SEC_ACCESS // PROTOCOL</h2>
                                <p className="text-[var(--text-xl)] font-sans font-light leading-relaxed opacity-60">
                                    A structured repository of common inquiries regarding the Vanguard intellectual framework.
                                </p>
                            </div>

                            <div className="col-span-12 lg:col-span-8 space-y-0">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="group border-b border-foreground/10 py-12">
                                        <div className="flex justify-between items-start gap-12">
                                            <div className="flex-1">
                                                <span className="text-[var(--text-xs)] font-mono opacity-20 block mb-6">ITEM_0{idx + 1}</span>
                                                <h3 className="text-[var(--text-2xl)] md:text-[var(--text-xl)] font-display mb-8 group-hover:italic transition-all">
                                                    {faq.q}
                                                </h3>
                                                <div className="max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-700 ease-[0.16,1,0.3,1]">
                                                    <p className="text-[var(--text-lg)] text-foreground/60 font-light leading-relaxed max-w-2xl py-4">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="pt-2 opacity-20 group-hover:opacity-100 group-hover:rotate-45 transition-all">
                                                <Plus size={24} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                <VanguardFooter />
            </main>
        </>
    );
}
