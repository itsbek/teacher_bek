"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { ArrowUpRight } from "lucide-react";

const programs = [
  {
    id: "01",
    title: "Young Learners",
    subtitle: "Ages 6–10",
    tagline: "Small groups, clear lessons, comfortable pace.",
    format: "2x/week · 90 min · Max 10 students",
    features: [
      "Small group format (max 10)",
      "Speaking-focused activities",
      "Parent progress updates",
      "Safe, CCTV-monitored classroom",
    ],
    anchor: "young-learners",
  },
  {
    id: "02",
    title: "Teens & Pre-Teens",
    subtitle: "Ages 11–17",
    tagline: "Relevant English for school, conversations, and beyond.",
    format: "2x/week · 90 min · Max 10 students",
    features: [
      "School assignment support",
      "Presentation and speaking skills",
      "Exam-focused practice",
      "Communication for real situations",
    ],
    anchor: "teens",
  },
  {
    id: "03",
    title: "IELTS & Professional English",
    subtitle: "All Band Targets",
    tagline: "Structured prep for the exam and the workplace.",
    format: "2x/week · 60 min · All levels",
    features: [
      "Band-focused exam strategy",
      "Mock speaking drills and feedback",
      "Business email and writing",
      "Real-world communication practice",
    ],
    anchor: "ielts",
  },
];

const stats = [
  { value: "Max 10", label: "Students per class" },
  { value: "TESOL", label: "Qualified teacher" },
  { value: "Free", label: "Trial assessment" },
  { value: "HCMC", label: "In-person + online" },
];

export function ServicesPageClient() {
  const locale = useLocale();

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased">

        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-20 lg:py-28 min-h-[calc(100vh-8rem)] flex flex-col justify-center border-b border-foreground/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50 mb-4">
            English Programs
          </p>
          <h1
            className="font-display leading-[0.92] tracking-tight text-foreground"
            style={{ fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
          >
            Find the Right <span className="italic">Program.</span>
          </h1>
          <p className="font-mono text-sm text-foreground/55 max-w-lg mt-5 leading-relaxed">
            Small groups for children, teens, and adults. Practical English with
            real results — not just textbook English.
          </p>
        </section>

        {/* Stats bar */}
        <section className="px-6 md:px-12 lg:px-24 py-0 border-b border-foreground/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px border border-foreground/10 bg-foreground/10">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-background px-6 md:px-10 py-8">
                <p
                  className="font-display font-bold leading-none text-foreground"
                  style={{ fontSize: "clamp(1.5rem, 3vw, 2.5rem)" }}
                >
                  {stat.value}
                </p>
                <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/55 mt-3">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Program rows */}
        <section className="px-6 md:px-12 lg:px-24">
          {programs.map((program, index) => (
            <motion.div
              key={program.id}
              id={program.anchor}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.75,
                delay: index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className={`
                group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16
                py-12 lg:py-16 border-b border-foreground/10
                ${index === 0 ? "border-t border-foreground/10" : ""}
              `}
            >
              {/* LEFT — Identity */}
              <div className="lg:col-span-4 flex flex-col justify-between">
                <div>
                  <div
                    className="font-display font-bold leading-none select-none mb-3 text-foreground/10 group-hover:text-foreground/[0.18] transition-colors duration-500"
                    style={{ fontSize: "clamp(5rem, 10vw, 9rem)" }}
                    aria-hidden="true"
                  >
                    {program.id}
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-1 group-hover:italic transition-all duration-500">
                    {program.title}
                  </h2>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 mb-3">
                    {program.subtitle}
                  </p>
                  <p className="font-mono text-xs text-foreground/55 italic leading-relaxed max-w-xs">
                    {program.tagline}
                  </p>
                </div>
                <div className="mt-6">
                  <span className="font-mono text-[10px] uppercase tracking-widest border border-foreground/15 px-3 py-1.5 inline-block text-foreground/60">
                    {program.format}
                  </span>
                </div>
              </div>

              {/* RIGHT — Features */}
              <div className="lg:col-span-8 flex flex-col justify-center">
                <ul className="flex flex-col divide-y divide-foreground/[0.06]">
                  {program.features.map((feature) => (
                    <li key={feature} className="flex items-baseline gap-4 py-3.5">
                      <span
                        className="font-mono text-foreground/30 text-xs shrink-0 group-hover:text-foreground/60 transition-colors duration-500"
                        aria-hidden="true"
                      >
                        →
                      </span>
                      <span className="font-mono text-sm text-foreground/75 leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href={`/${locale}#contact`}
                  className="inline-flex items-center gap-2 mt-8 self-start font-mono text-xs uppercase tracking-widest text-foreground/40 underline underline-offset-4 hover:text-foreground transition-colors duration-300"
                >
                  Enquire about this program
                  <ArrowUpRight size={11} />
                </a>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Bottom CTA */}
        <section className="px-6 md:px-12 lg:px-24 py-16 border-t border-foreground/10 bg-foreground/[0.02]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50 mb-3">
                Free Assessment
              </p>
              <h2
                className="font-display leading-tight text-foreground"
                style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
              >
                Not sure which program?{" "}
                <span className="italic">Let&apos;s figure it out together.</span>
              </h2>
              <p className="font-mono text-xs text-foreground/50 mt-4 leading-relaxed">
                30-minute assessment. No payment, no commitment.
              </p>
            </div>
            <div className="lg:col-span-4 lg:flex lg:justify-end">
              <a
                href={`/${locale}#contact`}
                className="inline-flex items-center gap-3 px-8 py-5 bg-foreground text-background font-mono text-[11px] uppercase tracking-[0.25em] hover:opacity-90 transition-opacity"
              >
                Book Free Assessment
                <ArrowUpRight size={14} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <VanguardFooter />
      </main>
    </>
  );
}
