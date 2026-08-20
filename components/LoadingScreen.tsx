"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const t = useTranslations("loadingScreen");
  const [count, setCount] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [showName, setShowName] = useState(false);

  const finish = useCallback(() => {
    setIsDone(true);
    const t = setTimeout(onComplete, 600);
    return () => clearTimeout(t);
  }, [onComplete]);

  useEffect(() => {
    // Show name after brief delay
    const nameTimer = setTimeout(() => setShowName(true), 100);

    let frame: number;
    let start: number | null = null;
    const duration = 1400;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * 100);

      setCount(value);

      if (value < 100) {
        frame = requestAnimationFrame(step);
      } else {
        setTimeout(() => finish(), 300);
      }
    };

    const delay = setTimeout(() => {
      frame = requestAnimationFrame(step);
    }, 200);

    return () => {
      clearTimeout(delay);
      clearTimeout(nameTimer);
      cancelAnimationFrame(frame);
    };
  }, [finish]);

  return (
    <div
      className={`loading-screen ${isDone ? "is-done" : ""}`}
      aria-hidden="true"
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(hsl(var(--background) / 0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Name text */}
      <div
        className="font-display text-sm md:text-base uppercase tracking-[0.4em] mb-8 transition-opacity duration-700"
        style={{ opacity: showName ? 0.4 : 0 }}
      >
        Teacher Bek
      </div>

      {/* Counter */}
      <div
        className="font-sans font-bold tabular-nums"
        style={{ fontSize: "clamp(3rem, 10vw, 6rem)" }}
      >
        {count.toString().padStart(3, "0")}
      </div>

      {/* Horizontal line wipe */}
      <div className="w-[200px] h-[1px] bg-current opacity-10 relative mt-6 overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-current transition-none"
          style={{ width: `${count}%`, opacity: 0.6 }}
        />
      </div>

      {/* Status text */}
      <p
        className="mt-5 text-xs tracking-[0.3em] uppercase opacity-30"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {t("status")}
      </p>
    </div>
  );
}
