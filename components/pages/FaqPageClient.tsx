"use client";

import React, { useState } from "react";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { Plus } from "lucide-react";
import { KineticText } from "@/components/KineticText";

export function FaqPageClient() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How are your classes different from large language centers?",
      a: "Groups are limited to 10 students, so everyone speaks in every lesson. You get direct correction and practical speaking time, not just textbook exercises."
    },
    {
      q: "Do you teach children, teens, and adults?",
      a: "Yes. Programs are designed for young learners (6-10), teens (11-17), and adults preparing for IELTS or improving workplace English."
    },
    {
      q: "Can I study IELTS with you?",
      a: "Yes. IELTS lessons include speaking drills, writing correction, and test strategy to help you reach your target band."
    },
    {
      q: "How do I start?",
      a: "Send an enquiry with your current level and goal. You will get a recommended program and available schedule in the first response."
    }
  ];
  const concernTags = [
    "Price & Value",
    "Schedule Fit",
    "Current Level",
    "Exam Pressure",
    "Business Fluency",
    "Parent Guidance",
  ];

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <div className="atmosphere-grid opacity-35" />
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-36">
          <div className="max-w-[1200px] mx-auto text-center section-stack">
              <span className="type-label opacity-40 mb-12 block">
                Questions & Answers
              </span>
                <h1 className="type-display max-w-[12ch] mx-auto">
                <KineticText text="Frequently" /> <span className="italic"><KineticText text="Asked Questions" delay={0.2} className="italic" /></span>
              </h1>
              <p className="type-body-lg max-w-2xl mx-auto text-foreground/75">
                Direct answers on class format, IELTS preparation, group levels, and enrollment.
              </p>
          </div>
        </section>

        <section className="pb-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
          <div className="max-w-[1920px] mx-auto">
            <div className="py-14 border-b border-foreground/10">
              <p className="type-label-tight text-foreground/50 mb-5">Common Concerns</p>
              <div className="flex flex-wrap gap-2">
                {concernTags.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 border border-foreground/20 type-label-tight text-foreground/65">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-12 gap-8 py-24">
              <div className="col-span-12 lg:col-span-4 lg:pr-24 mb-12 lg:mb-0">
                <h2 className="type-label opacity-30 mb-8">Quick Answers</h2>
                <p className="type-body-lg opacity-60">
                  Common questions about class format, age groups, IELTS preparation, and getting started.
                </p>
              </div>

              <div className="col-span-12 lg:col-span-8 space-y-0">
                {faqs.map((faq, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div key={idx} className="group border-b border-foreground/10 py-8">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${idx}`}
                        className="w-full text-left flex justify-between items-start gap-12"
                      >
                        <div className="flex-1">
                          <span className="type-meta opacity-20 block mb-4">Q{idx + 1}</span>
                          <h3 className={`type-title-md transition-all ${isOpen ? "italic" : ""}`}>
                            {faq.q}
                          </h3>
                        </div>
                        <div className={`pt-2 opacity-40 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                          <Plus size={24} />
                        </div>
                      </button>
                      <div
                        id={`faq-panel-${idx}`}
                        className={`overflow-hidden transition-all duration-400 ${isOpen ? "max-h-96 mt-4" : "max-h-0"}`}
                      >
                        <p className="type-body-lg text-foreground/60 max-w-2xl py-2">
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
