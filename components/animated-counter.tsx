"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2,
  className = '',
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000,
  });

  const display = useTransform(spring, (current) =>
    Math.round(current)
  );

  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      spring.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, spring, hasAnimated]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => {
      setDisplayValue(v);
    });
    return unsubscribe;
  }, [display]);

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {prefix}{Math.round(displayValue)}{suffix}
    </motion.span>
  );
}

// Variant with split number animation
export function AnimatedCounterSplit({
  value,
  suffix = '',
  label,
  className = '',
}: {
  value: string;
  suffix?: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const characters = value.split('');

  return (
    <div ref={ref} className={`group ${className}`}>
      <div className="flex items-baseline overflow-hidden">
        {characters.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground inline-block group-hover:text-primary transition-colors duration-300"
            style={{ letterSpacing: '-0.02em' }}
          >
            {char}
          </motion.span>
        ))}
        {suffix && (
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: characters.length * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-display text-3xl md:text-4xl font-semibold text-accent ml-1"
          >
            {suffix}
          </motion.span>
        )}
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.5,
          delay: (characters.length + 1) * 0.1,
        }}
        className="text-sm text-muted-foreground mt-2 font-accent uppercase tracking-wider"
      >
        {label}
      </motion.p>
    </div>
  );
}
