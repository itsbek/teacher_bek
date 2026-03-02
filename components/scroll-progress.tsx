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
      className="fixed top-0 left-0 right-0 h-[2px] bg-[#ECD06F] origin-left z-[9998]"
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
    <div className="fixed right-6 top-1/2 -translate-y-1/2 h-32 w-[2px] bg-white/10 z-[9998] hidden lg:block rounded-full overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 right-0 bg-[#ECD06F] origin-top"
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
      <span className="text-[13px] font-medium tracking-[0.1em] uppercase text-white/40">
        SCROLL
      </span>
      <div className="w-16 h-[2px] bg-white/10 overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-[#ECD06F] origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </div>
      <motion.span className="text-[13px] font-medium tracking-[0.1em] text-white/40 w-8">
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
