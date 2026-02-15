"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

interface MechanicalCursorProps {
  color?: string;
  size?: number;
}

export function MechanicalCursor({
  color = '#43b3ae',
  size = 40
}: MechanicalCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const irisRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const cursor = cursorRef.current;
    const iris = irisRef.current;
    if (!cursor || !iris) return;

    // Breathing animation for iris
    const breatheTl = gsap.timeline({ repeat: -1, yoyo: true });
    breatheTl.to(iris, {
      scale: 0.7,
      duration: 2,
      ease: 'sine.inOut',
    });

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      positionRef.current = { x: e.clientX, y: e.clientY };

      gsap.to(cursor, {
        x: e.clientX - size / 2,
        y: e.clientY - size / 2,
        duration: 0.15,
        ease: 'power2.out',
      });
    };

    // Hover detection
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer');

      const isText =
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        target.tagName === 'H1' ||
        target.tagName === 'H2' ||
        target.tagName === 'H3';

      if (isInteractive) {
        setIsHovering(true);
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        gsap.to(iris, { scale: 1.2, duration: 0.3 });
      } else if (isText) {
        // Focus mode for text
        gsap.to(iris, { scale: 0.5, duration: 0.2 });
      } else {
        setIsHovering(false);
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(iris, { scale: 1, duration: 0.3 });
      }
    };

    // Click handlers
    const handleMouseDown = () => {
      setIsClicking(true);
      gsap.to(cursor, {
        scale: 0.8,
        duration: 0.1,
        ease: 'power2.out',
      });

      // Flash effect
      gsap.to(cursor, {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        duration: 0.05,
        yoyo: true,
        repeat: 1,
      });
    };

    const handleMouseUp = () => {
      setIsClicking(false);
      gsap.to(cursor, {
        scale: isHovering ? 1.5 : 1,
        duration: 0.2,
        ease: 'elastic.out(1, 0.5)',
      });
    };

    // Hide default cursor
    document.body.style.cursor = 'none';

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.body.style.cursor = 'auto';
      breatheTl.kill();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [size, isHovering]);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && 'ontouchstart' in window) {
    return null;
  }

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        width: size,
        height: size,
      }}
    >
      {/* Outer ring - Camera aperture */}
      <div
        className="absolute inset-0 rounded-full border-2 transition-colors duration-300"
        style={{
          borderColor: isHovering ? '#f4ecd8' : color,
        }}
      />

      {/* Iris blades */}
      <div
        ref={irisRef}
        className="absolute inset-2 flex items-center justify-center"
      >
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-[2px] origin-center"
            style={{
              backgroundColor: isHovering ? '#f4ecd8' : color,
              transform: `rotate(${i * 30}deg)`,
              opacity: isClicking ? 1 : 0.6,
            }}
          />
        ))}

        {/* Center dot */}
        <div
          className="absolute w-2 h-2 rounded-full transition-all duration-200"
          style={{
            backgroundColor: isClicking ? '#ff6b35' : color,
            boxShadow: isClicking
              ? '0 0 20px rgba(255, 107, 53, 0.8)'
              : `0 0 10px ${color}`,
          }}
        />
      </div>

      {/* Crosshair (appears on interactive) */}
      {isHovering && (
        <>
          <div
            className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2"
            style={{ backgroundColor: '#f4ecd8', opacity: 0.5 }}
          />
          <div
            className="absolute top-0 left-1/2 w-[1px] h-full -translate-x-1/2"
            style={{ backgroundColor: '#f4ecd8', opacity: 0.5 }}
          />
        </>
      )}
    </div>
  );
}

// Simplified cursor for mobile fallback
export function SimpleCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX - 4,
        y: e.clientY - 4,
        duration: 0.1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 w-2 h-2 bg-[#43b3ae] rounded-full pointer-events-none z-[9999] mix-blend-difference"
    />
  );
}
