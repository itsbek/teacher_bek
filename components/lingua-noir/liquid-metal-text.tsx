"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface LiquidMetalTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  pourAnimation?: boolean;
}

export function LiquidMetalText({
  children,
  className = '',
  as: Component = 'h1',
  delay = 0,
  pourAnimation = true,
}: LiquidMetalTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters = container.querySelectorAll('.liquid-letter');

    if (pourAnimation) {
      // Initial state - letters above viewport
      gsap.set(letters, {
        y: -100,
        opacity: 0,
        rotationX: -90,
      });

      // Intersection observer for scroll trigger
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);

            // Pour animation with different viscosity per letter
            gsap.to(letters, {
              y: 0,
              opacity: 1,
              rotationX: 0,
              duration: 1.2,
              stagger: {
                each: 0.05,
                from: 'start',
              },
              ease: 'elastic.out(1, 0.4)',
              delay: delay,
              onComplete: () => {
                // Add subtle shimmer after landing
                gsap.to(letters, {
                  backgroundPosition: '200% center',
                  duration: 2,
                  stagger: 0.02,
                  ease: 'power1.inOut',
                });
              },
            });
          }
        },
        { threshold: 0.2 }
      );

      observer.observe(container);
      return () => observer.disconnect();
    }
  }, [delay, pourAnimation, isVisible]);

  // Split text into letters
  const letters = children.split('').map((char, i) => (
    <span
      key={i}
      className="liquid-letter inline-block"
      style={{
        background: 'linear-gradient(135deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        transformStyle: 'preserve-3d',
        // Viscosity based on letter width (thicker letters = slower)
        transitionDuration: char === 'm' || char === 'w' ? '1.4s' : char === 'i' || char === 'l' ? '0.8s' : '1s',
      }}
    >
      {char === ' ' ? '\u00A0' : char}
    </span>
  ));

  return (
    <div ref={containerRef} className={`perspective-1000 ${className}`}>
      <Component className="inline-flex flex-wrap">
        {letters}
      </Component>
    </div>
  );
}

// Outlined text that fills with liquid on hover
interface OutlinedTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export function OutlinedText({
  children,
  className = '',
  as: Component = 'h1',
}: OutlinedTextProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const text = textRef.current;
    if (!text) return;

    const handleMouseEnter = () => {
      gsap.to(text.querySelector('.fill-layer'), {
        clipPath: 'inset(0 0 0 0)',
        duration: 0.6,
        ease: 'power2.inOut',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(text.querySelector('.fill-layer'), {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.4,
        ease: 'power2.in',
      });
    };

    text.addEventListener('mouseenter', handleMouseEnter);
    text.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      text.removeEventListener('mouseenter', handleMouseEnter);
      text.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div ref={textRef} className={`relative cursor-pointer ${className}`}>
      {/* Outlined version */}
      <Component
        className="relative"
        style={{
          WebkitTextStroke: '1.5px currentColor',
          color: 'transparent',
        }}
      >
        {children}
      </Component>

      {/* Filled version (revealed on hover) */}
      <Component
        className="fill-layer absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          clipPath: 'inset(100% 0 0 0)',
        }}
      >
        {children}
      </Component>
    </div>
  );
}

// Dripping text effect
interface DrippingTextProps {
  children: string;
  className?: string;
  dripColor?: string;
}

export function DrippingText({
  children,
  className = '',
  dripColor = '#bf953f',
}: DrippingTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [drips, setDrips] = useState<{ id: number; x: number; delay: number }[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let dripId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Randomly create drips
      if (Math.random() > 0.95) {
        const newDrip = { id: dripId++, x, delay: Math.random() * 0.5 };
        setDrips(prev => [...prev, newDrip]);

        // Remove drip after animation
        setTimeout(() => {
          setDrips(prev => prev.filter(d => d.id !== newDrip.id));
        }, 2000);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className={`relative inline-block ${className}`}>
      <span
        style={{
          background: 'linear-gradient(135deg, #bf953f, #fcf6ba, #b38728)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {children}
      </span>

      {/* Drips */}
      {drips.map(drip => (
        <div
          key={drip.id}
          className="absolute bottom-0 w-1 rounded-b-full animate-drip"
          style={{
            left: drip.x,
            backgroundColor: dripColor,
            animationDelay: `${drip.delay}s`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes drip {
          0% {
            height: 0;
            opacity: 1;
          }
          50% {
            height: 30px;
            opacity: 1;
          }
          100% {
            height: 50px;
            opacity: 0;
            transform: translateY(20px);
          }
        }
        .animate-drip {
          animation: drip 1.5s ease-in forwards;
        }
      `}</style>
    </div>
  );
}

// Smoke-like fading text
interface SmokeTextProps {
  children: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SmokeText({ children, className = '', style }: SmokeTextProps) {
  return (
    <div className={`relative ${className}`} style={style}>
      <span
        className="relative z-10"
        style={{
          animation: 'smoke-fade 4s ease-in-out infinite',
        }}
      >
        {children}
      </span>

      {/* Smoke trail */}
      <span
        className="absolute inset-0 blur-sm opacity-50"
        style={{
          animation: 'smoke-drift 3s ease-in-out infinite',
          color: '#43b3ae',
        }}
      >
        {children}
      </span>

      <style jsx>{`
        @keyframes smoke-fade {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        @keyframes smoke-drift {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-5px) translateX(3px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
