"use client";

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorTextRef = useRef<HTMLDivElement>(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    // Check if touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      setIsHidden(true);
      return;
    }

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    const cursorTextEl = cursorTextRef.current;
    if (!cursor || !cursorDot || !cursorTextEl) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Immediate dot movement
      gsap.set(cursorDot, {
        x: mouseX,
        y: mouseY,
      });
    };

    // Smooth cursor follow with RAF
    const animateCursor = () => {
      const dx = mouseX - currentX;
      const dy = mouseY - currentY;

      currentX += dx * 0.15;
      currentY += dy * 0.15;

      gsap.set(cursor, {
        x: currentX,
        y: currentY,
      });

      gsap.set(cursorTextEl, {
        x: currentX,
        y: currentY,
      });

      requestAnimationFrame(animateCursor);
    };

    animateCursor();

    const handleMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;

      // Check for interactive elements
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button'
      ) {
        setIsPointer(true);

        // Check for custom cursor text
        const customText = target.getAttribute('data-cursor-text') ||
                          target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        if (customText) {
          setCursorText(customText);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsPointer(false);
      setCursorText('');
    };

    // Hide cursor when leaving window
    const handleMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        gsap.to([cursor, cursorDot, cursorTextEl], {
          opacity: 0,
          duration: 0.3,
        });
      }
    };

    const handleMouseOver = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 1,
        duration: 0.3,
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mouseover', handleMouseOver);

    // Use event delegation for better performance
    document.addEventListener('mouseenter', handleMouseEnter, true);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseout', handleMouseOut);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, []);

  if (isHidden) return null;

  return (
    <>
      {/* Main cursor ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="transition-all duration-300 ease-out rounded-full border border-white"
          style={{
            width: isPointer ? '50px' : '32px',
            height: isPointer ? '50px' : '32px',
            opacity: isPointer ? 0.6 : 1,
          }}
        />
      </div>

      {/* Center dot */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="bg-white rounded-full transition-all duration-200"
          style={{
            width: isPointer ? '6px' : '4px',
            height: isPointer ? '6px' : '4px',
          }}
        />
      </div>

      {/* Cursor text label */}
      <div
        ref={cursorTextRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`
            flex items-center justify-center
            text-[11px] font-accent tracking-widest uppercase
            text-primary-foreground bg-primary
            px-3 py-1.5 rounded
            transition-all duration-300
            ${cursorText ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}
          `}
          style={{
            marginTop: '40px',
          }}
        >
          {cursorText}
        </div>
      </div>
    </>
  );
}
