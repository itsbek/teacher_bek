"use client";

import { useState, useEffect } from 'react';
import { useScroll, useSpring, motion } from 'framer-motion';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-primary origin-left z-[9998]"
      style={{ scaleX }}
    />
  );
}

// Alternative: Side progress indicator
export function ScrollProgressVertical() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-border z-[9998] hidden lg:block">
      <motion.div
        className="absolute top-0 left-0 right-0 bg-primary origin-top"
        style={{ scaleY, height: '100%' }}
      />
    </div>
  );
}

// Percentage indicator
export function ScrollProgressPercent() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-[9998] hidden lg:flex items-center gap-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <span className="text-[11px] font-accent tracking-widest text-muted-foreground uppercase">
        SCROLL
      </span>
      <div className="w-16 h-[2px] bg-border overflow-hidden">
        <motion.div
          className="h-full bg-primary origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </div>
      <motion.span className="text-[11px] font-accent tracking-widest text-muted-foreground w-8">
        <ProgressText progress={smoothProgress} />
      </motion.span>
    </motion.div>
  );
}

// Helper component to display progress percentage
function ProgressText({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const unsubscribe = progress.on('change', (latest) => {
      setDisplayValue(Math.round(latest * 100));
    });
    return unsubscribe;
  }, [progress]);

  return <>{displayValue}%</>;
}
