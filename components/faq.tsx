"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export function FAQ() {
  const t          = useTranslations("faq");
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Heading reveal
      const words = headingRef.current?.querySelectorAll(".faq-title-word");
      if (words?.length) {
        gsap.fromTo(words,
          { y: "100%", opacity: 0 },
          {
            y: "0%",
            opacity: 1,
            duration: 0.8,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }

      // FAQ items stagger
      const items = listRef.current?.querySelectorAll(".faq-row");
      if (items?.length) {
        gsap.fromTo(items,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.06,
            ease: "power3.out",
            scrollTrigger: {
              trigger: listRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="bg-background text-foreground"
      style={{ scrollMarginTop: "5rem" }}
    >
      {/* ── Section header ─────────────────────────────────────────── */}
      <div className="px-6 md:px-10 lg:px-16 pt-16 pb-12 border-b border-foreground/10 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-4 mb-6">
            <span className="w-8 h-[1px] bg-foreground/30 shrink-0" />
            <span className="font-sans text-[12px] uppercase tracking-[0.22em] opacity-40 font-light">
              [ {t("title")} ]
            </span>
          </div>

          <div ref={headingRef}>
            <h2
              className="font-display font-bold uppercase leading-[0.9]"
              style={{ fontSize: "clamp(3rem, 10vw, 11rem)", letterSpacing: "-0.05em" }}
            >
              {t("title").split(" ").map((word, i, arr) => (
                <span
                  key={i}
                  className="faq-title-word inline-block"
                  style={{
                    display: "inline-block",
                    marginRight: i < arr.length - 1 ? "0.2em" : 0,
                    opacity: i === arr.length - 1 ? 0.2 : 1,
                  }}
                >
                  {word}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <a
          href="#contact"
          className="shrink-0 inline-flex items-center gap-4 border border-foreground/30 px-7 py-3.5 font-sans text-[13px] uppercase tracking-[0.18em] font-light hover:bg-foreground hover:text-background transition-all duration-500"
          style={{ transitionTimingFunction: "var(--transition-main)" }}
        >
          Ask a Question
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11L11 1M11 1H3M11 1V9" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </a>
      </div>

      {/* ── FAQ list ───────────────────────────────────────────────── */}
      <div
        ref={listRef}
        itemScope
        itemType="https://schema.org/FAQPage"
        role="list"
      >
        {FAQ_KEYS.map((key, index) => {
          const isOpen = open === index;

          return (
            <div
              key={key}
              className="faq-row border-b border-foreground/10"
              itemScope
              itemProp="mainEntity"
              itemType="https://schema.org/Question"
              role="listitem"
            >
              <button
                onClick={() => setOpen(isOpen ? null : index)}
                className="w-full text-left px-6 md:px-10 lg:px-16 py-7 flex items-start justify-between gap-8 group hover:bg-foreground/[0.02] transition-colors duration-300"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
              >
                {/* Number + question */}
                <div className="flex items-start gap-6 flex-1 min-w-0">
                  <span
                    className="font-sans text-[13px] font-light shrink-0 mt-1"
                    style={{ opacity: isOpen ? 0.7 : 0.2, letterSpacing: "0.1em" }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3
                    className="font-display font-bold uppercase leading-[0.95] pr-4"
                    style={{
                      fontSize: "clamp(1rem, 2.5vw, 1.9rem)",
                      letterSpacing: "-0.03em",
                      opacity: isOpen ? 1 : 0.65,
                      transition: "opacity 0.3s ease",
                    }}
                    itemProp="name"
                  >
                    {t(`${key}.question`)}
                  </h3>
                </div>

                {/* Plus/minus indicator */}
                <div
                  className="shrink-0 w-8 h-8 flex items-center justify-center border border-foreground/15 group-hover:border-foreground/35 transition-colors duration-300"
                  aria-hidden="true"
                >
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    className="transition-transform duration-500"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                </div>
              </button>

              {/* Answer — animated height */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.11, 0.82, 0.39, 0.92] }}
                    className="overflow-hidden"
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p
                      className="font-sans font-light leading-relaxed opacity-55 px-6 md:px-10 lg:px-16 pb-7 pl-[calc(1.5rem+1.5rem+1.5rem)] md:pl-[calc(2.5rem+1.5rem+1.5rem)] lg:pl-[calc(4rem+1.5rem+1.5rem)]"
                      style={{ fontSize: "clamp(0.875rem, 1.5vw, 1.05rem)" }}
                      itemProp="text"
                    >
                      {t(`${key}.answer`)}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
