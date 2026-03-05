"use client";

import { motion } from "framer-motion";

export function ZaloFloat() {
  return (
    <motion.a
      href="https://zalo.me/84353885757"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message on Zalo"
      className="fixed z-50 overflow-hidden rounded-[26px] bg-[#0068FF] shadow-[0_4px_20px_rgba(0,104,255,0.4)]"
      style={{ bottom: 24, right: 24, width: 56, height: 56 }}
      /* ── Periodic nudge: fires after 5s, then every 9s ── */
      animate={{
        rotate: [0, -11, 10, -6, 4, 0],
        scale:  [1, 1.07, 1.07, 1,    1,   1],
      }}
      transition={{
        duration:    0.65,
        ease:        "easeInOut",
        repeat:      Infinity,
        repeatDelay: 8.35,
        delay:       5,
      }}
      whileHover={{
        scale: 1.1,
        boxShadow: "0 6px 28px rgba(0,104,255,0.65)",
        transition: { type: "spring", stiffness: 320, damping: 18 },
      }}
      whileTap={{ scale: 0.93 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/assets/icons/zalo.svg"
        width={56}
        height={56}
        alt=""
        aria-hidden="true"
        className="block"
      />
    </motion.a>
  );
}
