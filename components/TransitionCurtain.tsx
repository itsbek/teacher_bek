"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "framer-motion";

export function TransitionCurtain() {
  const pathname    = usePathname();
  const reduceMotion = useReducedMotion();
  const prevPath    = useRef<string | null>(null);
  const [key, setKey]         = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prevPath.current === null) {
      prevPath.current = pathname;
      return;
    }
    if (prevPath.current !== pathname) {
      prevPath.current = pathname;
      setKey((k) => k + 1);
      setVisible(true);
    }
  }, [pathname]);

  if (reduceMotion || !visible) return null;

  return (
    <motion.div
      key={key}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1500, background: "#B85337" }}
      initial={{ x: 0 }}
      animate={{ x: "100%" }}
      transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => setVisible(false)}
    />
  );
}
