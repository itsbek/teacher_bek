"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface MorphingBlobProps {
  className?: string;
  color?: string;
  secondaryColor?: string;
  size?: number;
  duration?: number;
  blur?: number;
}

export function MorphingBlob({
  className = '',
  color = '#C85C3F',
  secondaryColor = '#B8956A',
  size = 400,
  duration = 8,
  blur = 60
}: MorphingBlobProps) {
  const blobRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const blob = blobRef.current;
    if (!blob) return;

    const shapes = [
      '60% 40% 30% 70% / 60% 30% 70% 40%',
      '30% 60% 70% 40% / 50% 60% 30% 60%',
      '70% 30% 50% 50% / 30% 50% 70% 60%',
      '40% 60% 60% 40% / 70% 30% 60% 40%',
      '50% 50% 40% 60% / 40% 60% 50% 50%',
    ];

    const tl = gsap.timeline({ repeat: -1 });

    shapes.forEach((shape, i) => {
      tl.to(blob, {
        borderRadius: shape,
        duration: duration / shapes.length,
        ease: 'sine.inOut',
      });
    });

    // Subtle rotation
    gsap.to(blob, {
      rotation: 360,
      duration: duration * 2,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      tl.kill();
    };
  }, [duration]);

  return (
    <div
      ref={blobRef}
      className={`${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color} 0%, ${secondaryColor} 100%)`,
        filter: `blur(${blur}px)`,
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
      }}
    />
  );
}

// Multiple floating orbs
interface FloatingOrbsProps {
  className?: string;
  count?: number;
  colors?: string[];
}

export function FloatingOrbs({
  className = '',
  count = 5,
  colors = ['#C85C3F', '#B8956A', '#E88C73', '#D4B896', '#C4A84D']
}: FloatingOrbsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const orbs = container.children;

    Array.from(orbs).forEach((orb, i) => {
      const el = orb as HTMLElement;

      // Random starting position
      gsap.set(el, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
      });

      // Floating animation
      gsap.to(el, {
        x: `+=${Math.random() * 100 - 50}`,
        y: `+=${Math.random() * 100 - 50}`,
        duration: 4 + Math.random() * 4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
      });

      // Scale pulsing
      gsap.to(el, {
        scale: 0.8 + Math.random() * 0.4,
        duration: 2 + Math.random() * 2,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      });
    });
  }, [count]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-40"
          style={{
            width: 100 + Math.random() * 200,
            height: 100 + Math.random() * 200,
            background: `radial-gradient(circle, ${colors[i % colors.length]} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
}

// Liquid gradient background
interface LiquidGradientProps {
  className?: string;
  colors?: string[];
  speed?: number;
}

export function LiquidGradient({
  className = '',
  colors = ['#C85C3F', '#B8956A', '#E88C73', '#FDFCF8'],
  speed = 15
}: LiquidGradientProps) {
  const gradientRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gradient = gradientRef.current;
    if (!gradient) return;

    gsap.to(gradient, {
      backgroundPosition: '200% 200%',
      duration: speed,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      gsap.killTweensOf(gradient);
    };
  }, [speed]);

  return (
    <div
      ref={gradientRef}
      className={`${className}`}
      style={{
        background: `linear-gradient(
          -45deg,
          ${colors.join(', ')}
        )`,
        backgroundSize: '400% 400%',
        backgroundPosition: '0% 0%',
      }}
    />
  );
}

// Gooey filter for blob connections
export function GooeyFilter({ id = 'gooey' }: { id?: string }) {
  return (
    <svg className="hidden">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
            result="gooey"
          />
          <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
}

// Connected blobs with gooey effect
interface GooeyBlobsProps {
  className?: string;
  color?: string;
  count?: number;
}

export function GooeyBlobs({
  className = '',
  color = '#C85C3F',
  count = 3
}: GooeyBlobsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const blobs = container.querySelectorAll('.gooey-blob');

    blobs.forEach((blob, i) => {
      gsap.to(blob, {
        x: `random(-100, 100)`,
        y: `random(-100, 100)`,
        duration: 4 + i,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.5,
      });
    });
  }, [count]);

  return (
    <>
      <GooeyFilter id="gooey-blobs" />
      <div
        ref={containerRef}
        className={`relative ${className}`}
        style={{ filter: 'url(#gooey-blobs)' }}
      >
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="gooey-blob absolute rounded-full"
            style={{
              width: 80 + i * 20,
              height: 80 + i * 20,
              backgroundColor: color,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    </>
  );
}

// Noise texture overlay
export function NoiseOverlay({
  className = '',
  opacity = 0.03
}: { className?: string; opacity?: number }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[9999] ${className}`}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }}
    />
  );
}
