"use client";

import React, { useState } from "react";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { Plus } from "lucide-react";
import { KineticText } from "@/components/KineticText";

type FaqTag = "All" | "Price & Value" | "Schedule Fit" | "Current Level" | "Exam Pressure" | "Parent Guidance" | "Getting Started";

interface FaqItem {
  q: string;
  a: string;
  tag: FaqTag;
}

const faqs: FaqItem[] = [
  {
    tag: "Getting Started",
    q: "How do I start?",
    a: "Send a short message with your current level and what you want to improve. I'll reply with a suggested program and available schedule — usually within 24 hours."
  },
  {
    tag: "Price & Value",
    q: "How much do lessons cost?",
    a: "It depends on program type, location, and frequency. Contact me for a direct answer — no hidden fees, no packages you don't need."
  },
  {
    tag: "Schedule Fit",
    q: "When are classes held?",
    a: "Weekday mornings and afternoons at my classroom in Phu Nhuan. Evenings and weekend slots are available by request. Online sessions work around your schedule."
  },
  {
    tag: "Current Level",
    q: "How are your classes different from large language centers?",
    a: "Groups stay at ten students maximum, so everyone actually speaks in every lesson. You get direct correction and real speaking time — not just textbook exercises in a room of 25."
  },
  {
    tag: "Current Level",
    q: "Do you teach children, teens, and adults?",
    a: "Yes. Programs are designed for young learners (ages 6–10), teens (11–17), and adults preparing for IELTS or improving workplace English."
  },
  {
    tag: "Exam Pressure",
    q: "Can I study IELTS with you?",
    a: "Yes. IELTS lessons cover all four skills — speaking, writing, reading, and listening — with timed practice tests and clear feedback on what's holding your score back."
  },
  {
    tag: "Exam Pressure",
    q: "What band score can I realistically reach?",
    a: "That depends on your starting point and how consistently you practise between lessons. I'll give you an honest assessment in the first session and a realistic timeline based on your goal."
  },
  {
    tag: "Parent Guidance",
    q: "Is your classroom safe for children?",
    a: "Yes. The classroom at Golden Mansion has CCTV, a separate restroom, air conditioning, and mosquito lamps. Parents are welcome to check the space before enrolling."
  },
  {
    tag: "Parent Guidance",
    q: "I don't speak English — can I still support my child?",
    a: "Absolutely. I send short weekly updates on what your child practised and what to encourage at home. You don't need to speak English to help — consistency and encouragement matter more."
  },
  {
    tag: "Getting Started",
    q: "Can I try a class before committing?",
    a: "Yes — a free assessment session is available. No pressure, no obligation. It's just a chance to see if the format and level are the right fit."
  },
];

const ALL_TAGS: FaqTag[] = [
  "All",
  "Getting Started",
  "Price & Value",
  "Schedule Fit",
  "Current Level",
  "Exam Pressure",
  "Parent Guidance",
];

export function FaqPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTag, setActiveTag] = useState<FaqTag>("All");

  const filteredFaqs = activeTag === "All"
    ? faqs
    : faqs.filter((f) => f.tag === activeTag);

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-32 min-h-[calc(100vh-8rem)] flex flex-col justify-center">
          <div className="max-w-[1920px] mx-auto w-full text-center section-stack">
            <span className="type-label opacity-40 mb-12 block">
              Questions & Answers
            </span>
            <h1 className="type-display max-w-[12ch] mx-auto">
              <KineticText text="Frequently" />{" "}
              <span className="italic">
                <KineticText text="Asked Questions" delay={0.2} className="italic" />
              </span>
            </h1>
            <p className="type-body-lg max-w-2xl mx-auto text-foreground/75">
              Direct answers on class format, IELTS preparation, group levels, and enrollment.
            </p>
          </div>
        </section>

        <section className="pb-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
          <div className="max-w-[1920px] mx-auto">

            {/* Filter Buttons */}
            <div className="py-10 border-b border-foreground/10">
              <p className="type-label-tight text-foreground/50 mb-5">Filter by concern</p>
              <div className="overflow-x-auto -mx-6 md:-mx-12 lg:-mx-24 px-6 md:px-12 lg:px-24 pb-1">
                <div className="flex gap-2 min-w-max md:min-w-0 md:flex-wrap">
                  {ALL_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setActiveTag(tag);
                        setOpenIndex(null);
                      }}
                      className={`whitespace-nowrap px-4 py-2 border type-label-tight transition-all duration-300 ${
                        activeTag === tag
                          ? "border-foreground bg-foreground text-background"
                          : "border-foreground/20 text-foreground/65 hover:border-foreground/50 hover:text-foreground"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 py-16">
              <div className="col-span-12 lg:col-span-4 lg:pr-24 mb-12 lg:mb-0">
                <h2 className="type-label opacity-30 mb-8">
                  {activeTag === "All" ? "All Questions" : activeTag}
                </h2>
                <p className="type-body-lg opacity-60">
                  {filteredFaqs.length} question{filteredFaqs.length !== 1 ? "s" : ""} shown.
                  Select a filter above to narrow down by topic.
                </p>
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-0">
                {filteredFaqs.length === 0 && (
                  <p className="type-body text-foreground/40 py-12">No questions in this category yet.</p>
                )}
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={`${activeTag}-${idx}`} className="group border-b border-foreground/10 py-7">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${idx}`}
                        className="w-full text-left flex justify-between items-start gap-8"
                      >
                        <div className="flex-1">
                          <span className="type-meta opacity-20 block mb-3">
                            {faq.tag}
                          </span>
                          <h3 className={`text-[clamp(1rem,1.8vw,1.5rem)] font-display font-bold leading-snug tracking-tight transition-all ${isOpen ? "italic" : ""}`}>
                            {faq.q}
                          </h3>
                        </div>
                        <div className={`pt-1 opacity-40 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-45" : ""}`}>
                          <Plus size={22} />
                        </div>
                      </button>
                      <div
                        id={`faq-panel-${idx}`}
                        className={`overflow-hidden transition-all duration-400 ${isOpen ? "max-h-96 mt-4" : "max-h-0"}`}
                      >
                        <p className="type-body text-foreground/60 max-w-2xl py-2 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <VanguardFooter />
      </main>
    </>
  );
}
