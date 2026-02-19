"use client";

import { ArrowUpRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";

const trustPoints = [
  "No payment required",
  "30-minute session",
  "Honest fit assessment",
];

export function ConversionStrip() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-14 border-y border-foreground/10 bg-foreground/[0.02]">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT — Copy */}
          <div className="lg:col-span-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50 mb-3">
              Free Assessment
            </p>
            <h2
              className="font-display leading-tight text-foreground"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.6rem)" }}
            >
              Try a class before you decide.{" "}
              <span className="italic">No commitment.</span>
            </h2>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
              {trustPoints.map((point) => (
                <span
                  key={point}
                  className="font-mono text-xs text-foreground/55 flex items-center gap-2"
                >
                  <span className="text-foreground/40" aria-hidden="true">✓</span>
                  {point}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — CTA */}
          <div className="lg:col-span-4 lg:flex lg:justify-end">
            <a
              href="#contact"
              onClick={() => trackCTAClick("strip", "free_assessment")}
              className="inline-flex items-center gap-3 px-8 py-5 bg-foreground text-background text-[11px] uppercase tracking-[0.25em] font-mono hover:opacity-90 transition-opacity"
            >
              Book Free Assessment
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
