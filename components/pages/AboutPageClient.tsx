"use client";

import React from "react";
import { motion } from "framer-motion";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";

export function AboutPageClient() {
  const milestones = [
    { year: "2023 - PRESENT", title: "Independent English Teacher, Ho Chi Minh City", desc: "Teaching small-group English lessons focused on speaking confidence, exam readiness, and practical communication." },
    { year: "2022 - 2023", title: "English Instructor, Language Centers", desc: "Taught mixed-age classes and refined a speaking-first lesson format built around feedback and confidence building." },
    { year: "EARLIER", title: "Corporate Leadership Background", desc: "Managed teams and communication workflows, which now informs structured, goal-oriented teaching." }
  ];
  const proofPoints = [
    { value: "2000+", label: "Students Taught" },
    { value: "4", label: "Languages Supported" },
    { value: "24h", label: "Response Window" },
    { value: "Max 10", label: "Students Per Group" },
  ];
  const methodSteps = [
    {
      id: "01",
      title: "Diagnose",
      description: "Map fluency blockers, confidence triggers, and practical goals before lesson planning starts."
    },
    {
      id: "02",
      title: "Design",
      description: "Build a weekly plan with speaking drills, correction loops, and measurable checkpoints."
    },
    {
      id: "03",
      title: "Deploy",
      description: "Run high-accountability sessions and feedback cycles until communication becomes automatic."
    },
  ];

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <div className="atmosphere-grid opacity-40" />
        <section className="relative px-6 md:px-12 lg:px-24 py-24 lg:py-36 overflow-hidden">
          <div className="absolute top-0 right-0 w-[38.2%] h-full bg-[#f0f0eb] dark:bg-vanguard-carbon -z-10 hidden lg:block" />

          <div className="max-w-[1200px] mx-auto text-center section-stack">
              <motion.span
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="type-label opacity-40 block"
              >
                About Teacher Bek
              </motion.span>
              <motion.h1
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="type-display max-w-[14ch] mx-auto"
              >
                English Teacher <span className="italic">in Ho Chi Minh City</span>
              </motion.h1>
              <p className="type-body-lg max-w-2xl mx-auto text-foreground/75">
                Practical English teaching built around confidence, communication, and consistent progress.
              </p>
          </div>
        </section>

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

        <section className="py-24 md:py-40 px-6 md:px-12 lg:px-24 border-t border-foreground/5">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="col-span-12 md:col-span-5">
              <h2 className="type-label opacity-40 mb-12 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-foreground"></span> Core Principles
              </h2>
              <p className="type-title-lg leading-[1.05] mb-12">
                Language learning works best when students feel safe to <span className="italic">speak and make mistakes.</span>
              </p>
              <div className="space-y-8 type-body text-foreground/70">
                <p>I keep classes small so every student gets real speaking time, direct correction, and clear next steps after each lesson.</p>
                <p>Instead of memorizing disconnected rules, students learn how to use English in conversations, school tasks, exams, and workplace situations.</p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-7 grid grid-cols-2 gap-4 h-full pt-12 lg:pt-0">
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.5 }}
                className="aspect-[3/4] overflow-hidden grayscale brightness-90"
              >
                <img src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop" alt="Teacher session" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
              <motion.div
                initial={false}
                whileInView={{ opacity: 1, clipPath: "inset(0 0 0 0)" }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="aspect-[3/4] overflow-hidden grayscale brightness-90 mt-24"
              >
                <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" alt="Learning workshop" className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 md:py-36 px-6 md:px-12 lg:px-24 border-t border-foreground/10">
          <div className="max-w-[1920px] mx-auto grid grid-cols-12 gap-8 items-start">
            <div className="col-span-12 lg:col-span-4">
              <span className="type-label-tight text-foreground/60">Method</span>
              <h2 className="type-title-lg mt-6">
                Predictable progress, <span className="italic">without confusion.</span>
              </h2>
            </div>
            <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
              {methodSteps.map((step) => (
                <article key={step.id} className="bg-background p-8 md:p-10">
                  <p className="type-label-tight text-foreground/40 mb-5">Step {step.id}</p>
                  <h3 className="type-title-sm mb-4">{step.title}</h3>
                  <p className="type-body text-foreground/70">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 md:py-48 bg-foreground text-background">
          <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
            <div className="flex flex-col items-center text-center mb-32">
              <span className="type-label opacity-40 mb-8">Record of Achievement</span>
              <h2 className="type-title-lg italic">Teaching Journey</h2>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 -translate-x-1/2 top-0 h-full w-[1px] bg-background/10 hidden lg:block" />

              <div className="space-y-32 lg:space-y-60 relative z-10">
                {milestones.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={false}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className={`grid grid-cols-12 gap-8 items-center ${idx % 2 === 0 ? "" : "lg:flex-row-reverse"}`}
                  >
                    <div className={`col-span-12 lg:col-span-5 ${idx % 2 === 0 ? "lg:text-right" : "lg:col-start-8 lg:order-2"}`}>
                      <span className="type-meta opacity-40 mb-4 block tracking-[0.3em]">{item.year}</span>
                      <h3 className="type-title-md mb-6 italic leading-none">{item.title}</h3>
                      <p className="type-body text-background/60 max-w-sm ml-auto mr-0 lg:ml-auto lg:mr-0 inline-block">
                        {item.desc}
                      </p>
                    </div>

                    <div className={`col-span-12 lg:col-span-2 flex justify-center scale-0 lg:scale-100 ${idx % 2 === 0 ? "" : "lg:order-1 lg:col-start-6"}`}>
                      <div className="w-4 h-4 rounded-full border border-background flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-background rounded-full" />
                      </div>
                    </div>

                    <div className={`col-span-12 lg:col-span-5 ${idx % 2 === 0 ? "lg:col-start-8" : "lg:col-start-1 lg:order-1 lg:text-right"}`}>
                      <div className="aspect-video bg-background/5 overflow-hidden filter grayscale opacity-50 hover:opacity-100 transition-opacity">
                        <img
                          src={`https://images.unsplash.com/photo-${idx === 0 ? "1434030216411-0b793f4b4173" : idx === 1 ? "1517245386807-bb43f82c33c4" : "1523050335392-93851179ae22"}?q=80&w=800&auto=format&fit=crop`}
                          className="w-full h-full object-cover"
                          alt="Milestone"
                        />
                      </div>
                    </div>
                  </motion.div>
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
