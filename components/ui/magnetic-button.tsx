"use client";

import { useRef, useState, MouseEvent, ReactNode } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
  as?: 'button' | 'a';
}

export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  strength = 0.3,
  as = 'button'
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !contentRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Move container with magnetic effect
    gsap.to(containerRef.current, {
      x: x * strength,
      y: y * strength,
      duration: 0.6,
      ease: 'power3.out',
    });

    // Move content slightly more for depth
    gsap.to(contentRef.current, {
      x: x * (strength * 0.5),
      y: y * (strength * 0.5),
      duration: 0.4,
      ease: 'power3.out',
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current || !contentRef.current) return;

    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });

    gsap.to(contentRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });

    setIsHovering(false);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const Component = as === 'a' ? motion.a : motion.button;

  return (
    <div
      ref={containerRef}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        href={as === 'a' ? href : undefined}
        onClick={onClick}
        className={`relative overflow-hidden ${className}`}
        whileTap={{ scale: 0.98 }}
      >
        {/* Background fill effect */}
        <motion.div
          className="absolute inset-0 bg-[#ECD06F]"
          initial={{ y: '100%' }}
          animate={{ y: isHovering ? '0%' : '100%' }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Content */}
        <div ref={contentRef} className="relative z-10">
          {children}
        </div>

        {/* Corner accents */}
        <motion.span
          className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ECD06F]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ECD06F]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
        />
        <motion.span
          className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ECD06F]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        />
        <motion.span
          className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ECD06F]"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: isHovering ? 1 : 0, scale: isHovering ? 1 : 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        />
      </Component>
    </div>
  );
}

// Text variant with hover effect
interface MagneticTextProps {
  children: string;
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function MagneticText({
  children,
  className = '',
  onClick,
  href
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    gsap.to(containerRef.current, {
      x: x * 0.15,
      y: y * 0.15,
      duration: 0.5,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!containerRef.current) return;

    gsap.to(containerRef.current, {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
    });

    setIsHovering(false);
  };

  const Component = href ? 'a' : 'button';

  return (
    <div
      ref={containerRef}
      className="inline-block"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
    >
      <Component
        href={href}
        onClick={onClick}
        className={`relative overflow-hidden block ${className}`}
      >
        {/* Original text */}
        <span
          className={`block transition-transform duration-500 ${
            isHovering ? '-translate-y-full' : 'translate-y-0'
          }`}
        >
          {children}
        </span>

        {/* Duplicate text for hover */}
        <span
          className={`absolute inset-0 text-[#ECD06F] transition-transform duration-500 ${
            isHovering ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          {children}
        </span>
      </Component>
    </div>
  );
}
