"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface EditorialTextProps {
  children: string;
  variant?: 'display' | 'headline' | 'subhead' | 'body';
  effect?: 'reveal' | 'chars' | 'words' | 'lines' | 'gradient' | 'stroke';
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export function EditorialText({
  children,
  variant = 'body',
  effect = 'reveal',
  className = '',
  delay = 0,
  as: Component = 'p',
}: EditorialTextProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const controls = useAnimation();

  const variantStyles = {
    display: 'font-display text-[clamp(3rem,10vw,8rem)] font-normal tracking-[-0.04em] leading-[0.9]',
    headline: 'font-display text-[clamp(2.5rem,6vw,5rem)] font-medium tracking-[-0.03em] leading-[1.0]',
    subhead: 'font-display text-[clamp(1.5rem,3vw,2.5rem)] font-normal tracking-[-0.02em] leading-[1.15]',
    body: 'font-sans text-[clamp(1rem,1.1vw,1.25rem)] leading-[1.7]',
  };

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  // Character split animation
  if (effect === 'chars') {
    const chars = children.split('');
    return (
      <Component
        ref={ref as any}
        className={`${variantStyles[variant]} ${className} overflow-hidden`}
      >
        {chars.map((char, i) => (
          <motion.span
            key={i}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{
              duration: 0.5,
              delay: delay + i * 0.02,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Component>
    );
  }

  // Word split animation
  if (effect === 'words') {
    const words = children.split(' ');
    return (
      <Component
        ref={ref as any}
        className={`${variantStyles[variant]} ${className} overflow-hidden`}
      >
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em]">
            <motion.span
              initial={{ y: '100%' }}
              animate={isInView ? { y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: delay + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          </span>
        ))}
      </Component>
    );
  }

  // Line reveal animation
  if (effect === 'lines') {
    return (
      <Component
        ref={ref as any}
        className={`${variantStyles[variant]} ${className} overflow-hidden`}
      >
        <motion.span
          initial={{ y: '100%' }}
          animate={isInView ? { y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="inline-block"
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  // Gradient text animation
  if (effect === 'gradient') {
    return (
      <Component
        ref={ref as any}
        className={`${variantStyles[variant]} ${className}`}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="gradient-text-animated"
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  // Stroke text effect
  if (effect === 'stroke') {
    return (
      <Component
        ref={ref as any}
        className={`${variantStyles[variant]} ${className}`}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{
            duration: 0.8,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="stroke-text-gold hover:text-[#C4A84D] dark:hover:text-[#ECD06F] transition-all duration-500"
        >
          {children}
        </motion.span>
      </Component>
    );
  }

  // Default reveal animation
  return (
    <Component
      ref={ref as any}
      className={`${variantStyles[variant]} ${className}`}
    >
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </Component>
  );
}

// Hover text component with slide effect
interface HoverTextProps {
  children: string;
  className?: string;
}

export function HoverSlideText({ children, className = '' }: HoverTextProps) {
  return (
    <span className={`link-slide relative inline-block overflow-hidden ${className}`} data-text={children}>
      <span className="block">{children}</span>
    </span>
  );
}

// Magnetic text that follows cursor
export function MagneticText({ children, className = '' }: HoverTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      className={`magnetic-text inline-block ${className}`}
    >
      {children}
    </motion.span>
  );
}

// Word rotation component
interface WordRotateProps {
  words: string[];
  className?: string;
}

export function WordRotate({ words, className = '' }: WordRotateProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  return (
    <span className={`word-rotate ${className}`}>
      <motion.span
        key={currentIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block text-[#C4A84D] dark:text-[#ECD06F]"
      >
        {words[currentIndex]}
      </motion.span>
    </span>
  );
}

// Scroll progress indicator
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      setProgress((scrolled / documentHeight) * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[100]">
      <motion.div
        className="h-full bg-gradient-to-r from-[#C4A84D] to-[#ECD06F]"
        style={{ width: `${progress}%` }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
