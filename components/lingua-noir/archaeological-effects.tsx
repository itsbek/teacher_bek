"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * LINGUA NOIR - Archaeological Effects
 *
 * Collection of brutalist/archaeological visual effects for AWWWARDS-level design:
 * - Wax Drip: Melting candle wax effect on hover
 * - Crack Underline: Fractured underline animation
 * - Burn Away: Element burns and crumbles on exit
 * - Tobacco Smoke: Drifting smoke tendrils
 * - Chromatic Aberration: RGB split effect
 * - Projector Flicker: Vintage film projection
 */

/**
 * Wax Drip Effect
 * Simulates melting wax dripping from element on hover
 */
export function WaxDrip({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <div
        className="absolute bottom-0 left-1/2 w-1.5 rounded-b-full transition-all duration-500 ease-out"
        style={{
          height: isHovering ? '20px' : '0px',
          background: 'var(--vintage-paper, #f4ecd8)',
          transform: 'translateX(-50%)',
          boxShadow: isHovering ? '0 4px 8px rgba(244, 236, 216, 0.3)' : 'none',
        }}
      />
    </div>
  );
}

/**
 * Crack Underline
 * Animated fractured underline that breaks apart
 */
export function CrackUnderline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <span
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}
      <svg
        className="absolute bottom-0 left-0 w-full h-0.5 pointer-events-none"
        viewBox="0 0 100 2"
        preserveAspectRatio="none"
      >
        <line
          x1="0"
          y1="1"
          x2="20"
          y2="1"
          stroke="var(--dried-blood, #8a0303)"
          strokeWidth="2"
          className="transition-all duration-300"
          style={{
            strokeDasharray: '20',
            strokeDashoffset: isHovering ? '0' : '20',
          }}
        />
        <line
          x1="25"
          y1="1"
          x2="40"
          y2="1"
          stroke="var(--dried-blood, #8a0303)"
          strokeWidth="2"
          className="transition-all duration-300 delay-75"
          style={{
            strokeDasharray: '15',
            strokeDashoffset: isHovering ? '0' : '15',
          }}
        />
        <line
          x1="50"
          y1="1"
          x2="80"
          y2="1"
          stroke="var(--dried-blood, #8a0303)"
          strokeWidth="2"
          className="transition-all duration-300 delay-150"
          style={{
            strokeDasharray: '30',
            strokeDashoffset: isHovering ? '0' : '30',
          }}
        />
        <line
          x1="85"
          y1="1"
          x2="100"
          y2="1"
          stroke="var(--dried-blood, #8a0303)"
          strokeWidth="2"
          className="transition-all duration-300 delay-200"
          style={{
            strokeDasharray: '15',
            strokeDashoffset: isHovering ? '0' : '15',
          }}
        />
      </svg>
    </span>
  );
}

/**
 * Burn Away Animation
 * Element burns and crumbles away with sepia tone
 */
export function BurnAway({
  trigger,
  children,
  onComplete,
}: {
  trigger: boolean;
  children: React.ReactNode;
  onComplete?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger || !ref.current) return;

    gsap.to(ref.current, {
      clipPath: 'inset(0 100% 0 0)',
      filter: 'brightness(2) sepia(0.5)',
      duration: 0.8,
      ease: 'power2.in',
      onComplete,
    });
  }, [trigger, onComplete]);

  return (
    <div ref={ref} className="relative">
      {children}
    </div>
  );
}

/**
 * Tobacco Smoke Tendrils
 * Drifting smoke effect with radial gradients
 */
export function TobaccoSmoke({ className = "" }: { className?: string }) {
  const smoke1Ref = useRef<HTMLDivElement>(null);
  const smoke2Ref = useRef<HTMLDivElement>(null);
  const smoke3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!smoke1Ref.current || !smoke2Ref.current || !smoke3Ref.current) return;

    // Animate each smoke tendril independently
    gsap.to(smoke1Ref.current, {
      y: -15,
      x: 10,
      scale: 1.2,
      opacity: 0.6,
      duration: 6,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    gsap.to(smoke2Ref.current, {
      y: -10,
      x: -8,
      scale: 1.15,
      opacity: 0.5,
      duration: 7,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 1,
    });

    gsap.to(smoke3Ref.current, {
      y: -20,
      x: 5,
      scale: 1.25,
      opacity: 0.4,
      duration: 8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2,
    });
  }, []);

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div
        ref={smoke1Ref}
        className="absolute top-1/4 left-1/4 w-64 h-64"
        style={{
          background: 'radial-gradient(circle, rgba(61, 40, 23, 0.3) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={smoke2Ref}
        className="absolute top-1/2 right-1/3 w-48 h-48"
        style={{
          background: 'radial-gradient(circle, rgba(67, 179, 174, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        ref={smoke3Ref}
        className="absolute bottom-1/3 left-1/2 w-56 h-56"
        style={{
          background: 'radial-gradient(circle, rgba(138, 3, 3, 0.15) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
    </div>
  );
}

/**
 * Chromatic Aberration
 * RGB split effect on hover
 */
export function ChromaticAberration({
  children,
  intensity = 2,
  className = "",
}: {
  children: React.ReactNode;
  intensity?: number;
  className?: string;
}) {
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
    >
      <div className="relative z-10">{children}</div>
      {isActive && (
        <>
          <div
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen"
            style={{
              transform: `translateX(-${intensity}px)`,
              filter: 'url(#red-channel)',
            }}
          >
            {children}
          </div>
          <div
            className="absolute inset-0 pointer-events-none opacity-50 mix-blend-screen"
            style={{
              transform: `translateX(${intensity}px)`,
              filter: 'url(#blue-channel)',
            }}
          >
            {children}
          </div>
        </>
      )}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="red-channel">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 1 0"
            />
          </filter>
          <filter id="blue-channel">
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 1 0 0
                      0 0 0 1 0"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}

/**
 * Projector Flicker
 * Vintage film projection flicker effect
 */
export function ProjectorFlicker({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Random flicker animation
    const flicker = () => {
      if (!ref.current) return;

      const intensity = 0.92 + Math.random() * 0.08; // 0.92 to 1.0
      gsap.to(ref.current, {
        opacity: intensity,
        duration: 0.05,
        ease: 'none',
      });
    };

    // Flicker at random intervals
    const interval = setInterval(() => {
      if (Math.random() > 0.95) { // 5% chance each frame
        flicker();
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Punched Metal Label
 * Industrial embossed metal tag with hover press effect
 */
export function PunchedLabel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      className={`relative inline-flex items-center px-6 py-3 text-xs font-mono tracking-[0.15em] uppercase cursor-pointer select-none transition-all duration-300 ${className}`}
      style={{
        background: isPressed
          ? 'linear-gradient(180deg, #1a1a1a 0%, #2a2a2a 100%)'
          : 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: 'var(--vintage-paper, #f4ecd8)',
        transform: isPressed ? 'translateY(2px)' : 'translateY(0)',
        boxShadow: isPressed
          ? 'inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 20px rgba(67, 179, 174, 0.3)'
          : 'inset 0 1px 2px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Inner border */}
      <div
        className="absolute inset-[2px] border border-white/5 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isPressed ? 0.5 : 1 }}
      />

      {/* Content */}
      <span className="relative z-10">{children}</span>
    </div>
  );
}

/**
 * Oxidized Copper Glow
 * Pulsing copper patina glow effect
 */
export function OxidizedGlow({
  children,
  intensity = 'normal',
  className = "",
}: {
  children: React.ReactNode;
  intensity?: 'subtle' | 'normal' | 'intense';
  className?: string;
}) {
  const glowStyles = {
    subtle: {
      boxShadow: '0 0 20px rgba(67, 179, 174, 0.15), 0 0 40px rgba(67, 179, 174, 0.1)',
    },
    normal: {
      boxShadow: '0 0 30px rgba(67, 179, 174, 0.2), 0 0 60px rgba(67, 179, 174, 0.15), 0 0 90px rgba(67, 179, 174, 0.1)',
    },
    intense: {
      boxShadow: '0 0 40px rgba(125, 249, 255, 0.25), 0 0 80px rgba(67, 179, 174, 0.2), 0 0 120px rgba(67, 179, 174, 0.15)',
    },
  };

  return (
    <div className={`relative ${className}`} style={glowStyles[intensity]}>
      {children}
    </div>
  );
}

/**
 * Breath Pulse
 * 7-second breathing animation (Lingua Noir signature)
 */
export function BreathPulse({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`breath-pulse ${className}`}>
      {children}
    </div>
  );
}
