"use client";

import React from "react";
import { motion } from "framer-motion";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";

export function AboutPageClient() {
  const credentials = [
    { abbr: "TESOL", full: "Teaching English to Speakers of Other Languages" },
    { abbr: "PGCE", full: "Postgraduate Certificate in Education" },
    { abbr: "DELTA", full: "Cambridge — Completed, awaiting results" },
  ];

  const proofPoints = [
    { value: "2,000+", label: "Students Taught" },
    { value: "7", label: "Languages Spoken" },
    { value: "15+", label: "Schools in HCMC" },
    { value: "Max 10", label: "Students Per Group" },
  ];

  const timeline = [
    {
      year: "2022 — PRESENT",
      title: "English Teacher, Ho Chi Minh City",
      desc: "Teaching small-group lessons at my own classroom in Golden Mansion, Phu Nhuan. ILA Vietnam, BlueSky Kindergarten, international schools, government schools, and kindergartens across the city."
    },
    {
      year: "EARLIER",
      title: "Corporate Team Leadership",
      desc: "Years managing people and chasing quarterly targets. Good training for understanding how adults learn under pressure — and why most of them hate being put on the spot."
    },
    {
      year: "THE BEGINNING",
      title: "Tashkent, Uzbekistan",
      desc: "Grew up speaking Uzbek, Russian, and eventually English. Language was never just school subject — it was the difference between being understood and being invisible."
    }
  ];

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <div className="atmosphere-grid opacity-40" />

        {/* Hero */}
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-36">
          <div className="max-w-[1200px] mx-auto text-center section-stack">
            <motion.span
              initial={false}
              animate={{ opacity: 0.4, x: 0 }}
              className="type-label block"
            >
              About Teacher Bek
            </motion.span>
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="type-display max-w-[16ch] mx-auto"
            >
              English Teacher <span className="italic">in Ho Chi Minh City</span>
            </motion.h1>
            <p className="type-body-lg max-w-2xl mx-auto text-foreground/75">
              From Tashkent to teaching. Three years in Vietnam, seven languages, and a genuine belief that small groups produce better English speakers.
            </p>
          </div>
        </section>

        {/* Stats bar */}
        <section className="px-6 md:px-12 lg:px-24 py-10 border-y border-foreground/10 bg-foreground/[0.02]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-px border border-foreground/10 bg-foreground/10">
            {proofPoints.map((point) => (
              <div key={point.label} className="bg-background px-6 md:px-10 py-8">
                <p className="type-title-md leading-none">{point.value}</p>
                <p className="type-label-tight mt-3 text-foreground/60">{point.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story section */}
        <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="col-span-12 lg:col-span-6">
              <h2 className="type-label opacity-40 mb-12 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-foreground"></span> The Story
              </h2>
              <p className="type-title-sm leading-[1.2] mb-10 text-foreground/90">
                I came to Vietnam three years ago to volunteer. I was going to stay a few months.
              </p>
              <div className="space-y-6 type-body text-foreground/70">
                <p>
                  After years managing teams and chasing corporate targets, I found myself in a classroom in Ho Chi Minh City — and realised I liked it more than anything I'd done in an office. So I stayed.
                </p>
                <p>
                  I'm originally from Tashkent, Uzbekistan. I speak seven languages, which means I know first-hand what it feels like to not understand, to hesitate before speaking, to feel embarrassed about making mistakes in front of people. That background informs how I teach.
                </p>
                <p>
                  I hold TESOL and PGCE qualifications, and I've recently completed my DELTA (Cambridge) — awaiting results. I've taught at ILA Vietnam, BlueSky Kindergarten, international schools, government schools, and kindergartens across HCMC. Right now I teach from my own classroom at Golden Mansion in Phu Nhuan.
                </p>
                <p>
                  Outside of teaching: reading, weightlifting, grappling. Staying active keeps me sharp — and keeps me honest about what it actually takes to build a new skill.
                </p>
              </div>
            </div>

            {/* Photo placeholder — replace with actual teacher photo */}
            <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 pt-12 lg:pt-16">
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.2 }}
                className="aspect-[4/5] bg-foreground/5 border border-foreground/10 overflow-hidden flex items-end"
              >
                {/* Replace src with actual teacher photo */}
                <div className="w-full h-full flex flex-col items-center justify-center text-foreground/20 p-8 text-center">
                  <span className="type-label-tight block mb-2">Photo</span>
                  <span className="type-meta block opacity-60">Teacher Bek — Phu Nhuan, Ho Chi Minh City</span>
                </div>
              </motion.div>
              <div className="border-l-2 border-foreground/15 pl-6">
                <p className="type-body-lg italic text-foreground/60 leading-relaxed">
                  "My students teach me something new every week. That's not a platitude — it's just true."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Credentials */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-foreground/10">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-4">
              <span className="type-label-tight text-foreground/60 block mb-6">Qualifications</span>
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-display font-bold leading-tight tracking-tight">
                Certified and<br /><span className="italic">still learning.</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
              {credentials.map((cred) => (
                <article key={cred.abbr} className="bg-background p-8 md:p-10">
                  <p className="type-title-sm mb-4 font-mono">{cred.abbr}</p>
                  <p className="type-body text-foreground/60 leading-relaxed">{cred.full}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Teaching approach */}
        <section className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-foreground/10">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-12 items-center">
            <div className="col-span-12 lg:col-span-5">
              <span className="type-label-tight text-foreground/60 block mb-6">Why It Works</span>
              <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-display font-bold leading-tight tracking-tight mb-8">
                Small groups.<br /><span className="italic">Real speaking time.</span>
              </h2>
              <div className="space-y-5 type-body text-foreground/70">
                <p>
                  I keep my groups at ten students maximum. Not because it sounds exclusive — because I've seen what happens in a 25-student language centre class. Students speak for maybe four minutes per hour. That's not a language lesson.
                </p>
                <p>
                  With ten or fewer, every student speaks in every lesson. I know each person's patterns, their hesitations, the specific sounds they consistently get wrong. Correction is direct and immediate.
                </p>
                <p>
                  My classroom at Golden Mansion, Phu Nhuan has CCTV, a separate restroom, air conditioning, and mosquito lamps. Parents are welcome to visit before enrolling their children.
                </p>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-7 grid grid-cols-2 gap-px border border-foreground/10 bg-foreground/10">
              {[
                { stat: "Max 10", label: "Students per group" },
                { stat: "3 yrs", label: "Teaching in Vietnam" },
                { stat: "15+", label: "Schools taught at in HCMC" },
                { stat: "CCTV", label: "Secure classroom with monitoring" },
              ].map((item) => (
                <div key={item.label} className="bg-background p-8 md:p-10">
                  <p className="text-[clamp(1.5rem,3vw,2.5rem)] font-display font-bold leading-none mb-3">{item.stat}</p>
                  <p className="type-label-tight text-foreground/55">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 md:py-36 px-6 md:px-12 lg:px-24 bg-foreground text-background border-t border-foreground/10">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-20">
              <span className="type-label opacity-40 mb-4 block">Background</span>
              <h2 className="text-[clamp(1.8rem,4vw,3.5rem)] font-display font-bold leading-tight italic">
                How I got here.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-background/10 bg-background/10">
              {timeline.map((item) => (
                <motion.article
                  key={item.year}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="bg-foreground p-8 md:p-10"
                >
                  <span className="type-meta opacity-30 block mb-6 tracking-[0.25em]">{item.year}</span>
                  <h3 className="text-[clamp(1.1rem,1.8vw,1.4rem)] font-display font-bold leading-tight mb-5 italic">{item.title}</h3>
                  <p className="type-body text-background/60 leading-relaxed">{item.desc}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <VanguardFooter />
      </main>
    </>
  );
}
