"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface SplitHeadingProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "span";
}

export function SplitHeading({
  children,
  className,
  style,
  delay = 0,
  stagger = 0.022,
  as: Tag = "span",
}: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, { once: true, margin: "-8% 0px" });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <Tag ref={ref as React.RefObject<HTMLHeadingElement & HTMLSpanElement>} className={className} style={style}>
        {children}
      </Tag>
    );
  }

  const chars = children.split("");

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement & HTMLSpanElement>}
      className={className}
      style={style}
      aria-label={children}
    >
      {chars.map((char, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-block", overflow: "hidden", lineHeight: "inherit" }}
        >
          <motion.span
            style={{ display: "inline-block" }}
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.55,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {char === " " ? " " : char}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
