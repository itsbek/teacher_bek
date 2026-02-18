"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";
import { ArrowUpRight } from "lucide-react";

export function ServicesPageClient() {
  const locale = useLocale();

  const programs = [
    {
      id: "01",
      title: "Young Learners (6-10)",
      desc: "Interactive English classes that build confidence, pronunciation, and vocabulary through structured games and conversation.",
      features: ["Small group format", "Speaking-focused activities", "Parent progress updates"],
      image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=1200"
    },
    {
      id: "02",
      title: "Teens (11-17)",
      desc: "Academic and conversational English for school success, presentations, and day-to-day confidence.",
      features: ["School support", "Presentation speaking", "Exam-focused practice"],
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1200"
    },
    {
      id: "03",
      title: "IELTS & Professional English",
      desc: "Targeted IELTS and workplace English lessons for interviews, meetings, and client conversations.",
      features: ["Band-focused strategy", "Mock speaking drills", "Real-world communication practice"],
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200"
    }
  ];
  const trustSignals = [
    { value: "Max 10", label: "Small Group Classes" },
    { value: "IELTS", label: "Test Prep Included" },
    { value: "Band+", label: "Exam Strategy + Drills" },
    { value: "HCMC", label: "Local + Online Delivery" },
  ];

  return (
    <>
      <VanguardNavigation />
      <main className="bg-background text-foreground min-h-screen pt-32 selection:bg-black selection:text-white antialiased relative overflow-hidden">
        <div className="atmosphere-grid opacity-40" />
        <section className="px-6 md:px-12 lg:px-24 py-24 lg:py-36">
          <div className="max-w-[1200px] mx-auto text-center section-stack">
            <motion.span
              initial={false}
              animate={{ opacity: 0.4, x: 0 }}
              className="type-label block"
            >
              Programs & Services
            </motion.span>
            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="type-display max-w-[12ch] mx-auto"
            >
              English <span className="italic">Programs</span>
            </motion.h1>
            <p className="type-body-lg max-w-2xl mx-auto text-foreground/75">
              Flexible small-group lessons for kids, teens, and adults who want practical English results.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-12 lg:px-24 pb-16">
          <div className="max-w-[1920px] mx-auto">
            <div className="mb-6">
              <p className="type-label-tight text-foreground/50 mb-2">Program Snapshot</p>
              <p className="type-body text-foreground/70 max-w-2xl">
                Core delivery standards across all programs below, including IELTS-focused preparation.
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px border border-foreground/10 bg-foreground/10">
              {trustSignals.map((signal) => (
                <div key={signal.label} className="bg-background px-6 md:px-10 py-8">
                  <p className="type-title-md leading-none">{signal.value}</p>
                  <p className="type-label-tight mt-3 text-foreground/60">{signal.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-24 px-6 md:px-12 lg:px-24">
          <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px border border-foreground/10 bg-foreground/10">
              {programs.map((program, idx) => (
                <motion.div
                  key={program.id}
                  id={`program-${program.id}`}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
                  className="bg-background flex flex-col group"
                >
                  <div className="relative aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <img src={program.image} className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-700" alt={program.title} />
                    <div className="absolute top-0 left-0 p-4">
                      <span className="type-meta text-white/50">0{program.id}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-6 md:p-8 lg:p-10">
                    <h2 className="text-[clamp(1.25rem,2vw,1.75rem)] font-display font-bold leading-tight mb-4">
                      {program.title}
                    </h2>
                    <p className="type-body text-foreground/65 mb-6 flex-1">
                      {program.desc}
                    </p>

                    <ul className="space-y-2.5 mb-8">
                      {program.features.map(f => (
                        <li key={f} className="flex items-center gap-3 type-label-tight opacity-50">
                          <div className="w-4 h-[1px] bg-foreground shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a href={`/${locale}#contact`} className="vanguard-magnetic group/btn mt-auto w-fit flex items-center gap-4 py-3 px-6 border border-foreground/15 hover:bg-foreground hover:text-background transition-colors duration-400">
                      <span className="type-label-tight">Enquire</span>
                      <ArrowUpRight size={14} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <VanguardFooter />
      </main>

      <style jsx>{`
        .vanguard-magnetic {
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .vanguard-magnetic:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </>
  );
}
