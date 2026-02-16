"use client";

import { trackCTAClick } from "@/lib/analytics";

export function ConversionStrip() {
  return (
    <section className="px-6 md:px-12 lg:px-24 py-12 border-y border-foreground/10 bg-background relative overflow-hidden">
      <div className="atmosphere-grid opacity-50" />
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center editorial-panel px-6 md:px-10 py-8">
        <div className="lg:col-span-8">
          <p className="text-[var(--text-xl)] font-display leading-tight">
            Intake is limited each cycle to maintain small-group quality and measurable progress.
          </p>
          <p className="text-sm uppercase tracking-[0.16em] opacity-50 mt-3">
            Free assessment. Personalized plan in your first reply.
          </p>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <a
            href="#contact"
            onClick={() => trackCTAClick("strip", "assessment")}
            className="inline-flex items-center gap-3 px-7 py-4 border border-foreground text-[11px] uppercase tracking-[0.25em] hover:bg-foreground hover:text-background transition-colors link-sheen"
          >
            Reserve Assessment
          </a>
        </div>
      </div>
    </section>
  );
}
