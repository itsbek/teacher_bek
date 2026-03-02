"use client";

import { useEffect, useState } from "react";

type Section = {
  id: string;
  label: string;
};

const SECTIONS: Section[] = [
  { id: "hero", label: "Intro" },
  { id: "signature", label: "Philosophy" },
  { id: "lexicon", label: "Framework" },
  { id: "journal", label: "Journal" },
  { id: "contact", label: "Inquiry" },
];

export function HomeSectionRail() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          setActive(visible.target.id);
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: "-20% 0px -40% 0px" }
    );

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <aside className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40">
      <div className="flex flex-col gap-3 bg-background/90 border border-foreground/20 backdrop-blur-md px-3 py-4 editorial-panel">
        {SECTIONS.map((section) => {
          const isActive = section.id === active;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={`flex items-center gap-3 text-[13px] uppercase tracking-[0.25em] transition-all ${isActive ? "text-foreground" : "text-foreground/60 hover:text-foreground"}`}
            >
              <span className={`h-[1px] transition-all ${isActive ? "w-10 bg-foreground" : "w-5 bg-foreground/40"}`} />
              <span>{section.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
