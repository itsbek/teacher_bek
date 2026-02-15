"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';

interface InfiniteMarqueeProps {
  children: ReactNode;
  className?: string;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: number;
}

export function InfiniteMarquee({
  children,
  className = '',
  speed = 50,
  direction = 'left',
  pauseOnHover = true,
  gap = 40
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    // Clone children for seamless loop
    const content = track.innerHTML;
    track.innerHTML = content + content;

    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    tweenRef.current = gsap.to(track, {
      x: direction === 'left' ? -totalWidth : totalWidth,
      duration,
      ease: 'none',
      repeat: -1,
    });

    if (direction === 'right') {
      gsap.set(track, { x: -totalWidth });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [speed, direction]);

  const handleMouseEnter = () => {
    if (pauseOnHover && tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 0, duration: 0.5 });
    }
  };

  const handleMouseLeave = () => {
    if (pauseOnHover && tweenRef.current) {
      gsap.to(tweenRef.current, { timeScale: 1, duration: 0.5 });
    }
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex items-center"
        style={{ gap }}
      >
        {children}
      </div>
    </div>
  );
}

// Logo marquee with hover effects
interface LogoItem {
  name: string;
  logo?: ReactNode;
}

interface LogoMarqueeProps {
  items: LogoItem[];
  className?: string;
  speed?: number;
  itemClassName?: string;
}

export function LogoMarquee({
  items,
  className = '',
  speed = 30,
  itemClassName = ''
}: LogoMarqueeProps) {
  return (
    <InfiniteMarquee speed={speed} className={className} gap={60}>
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-center gap-4 text-foreground/30 dark:text-white/30 hover:text-foreground dark:hover:text-white transition-colors duration-500 ${itemClassName}`}
        >
          {item.logo}
          <span className="text-lg font-medium whitespace-nowrap">{item.name}</span>
        </div>
      ))}
    </InfiniteMarquee>
  );
}

// Text marquee with stroke effect
interface TextMarqueeProps {
  text: string;
  className?: string;
  speed?: number;
  strokeText?: boolean;
  fontSize?: string;
}

export function TextMarquee({
  text,
  className = '',
  speed = 80,
  strokeText = false,
  fontSize = 'clamp(80px, 15vw, 200px)'
}: TextMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const totalWidth = track.scrollWidth / 2;
    const duration = totalWidth / speed;

    const tween = gsap.to(track, {
      x: -totalWidth,
      duration,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, [speed]);

  const textStyle = strokeText ? {
    WebkitTextStroke: '2px currentColor',
    WebkitTextFillColor: 'transparent',
  } : {};

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
    >
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="font-display font-bold tracking-[-0.04em] mx-8"
            style={{ fontSize, ...textStyle }}
          >
            {text}
            <span className="mx-8 inline-block text-[#C85C3F] dark:text-[#B8956A]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// Dual direction marquee
interface DualMarqueeProps {
  topContent: ReactNode;
  bottomContent: ReactNode;
  className?: string;
  speed?: number;
}

export function DualMarquee({
  topContent,
  bottomContent,
  className = '',
  speed = 40
}: DualMarqueeProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <InfiniteMarquee direction="left" speed={speed}>
        {topContent}
      </InfiniteMarquee>
      <InfiniteMarquee direction="right" speed={speed * 0.8}>
        {bottomContent}
      </InfiniteMarquee>
    </div>
  );
}
