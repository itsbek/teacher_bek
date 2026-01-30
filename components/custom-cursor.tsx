"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  // Use motion values for smooth cursor movement
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Spring physics for smooth following
  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Check if touch device - only on client
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
      return; // Don't mount on touch devices
    }

    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    };

    const onMouseEnter = (e: Event) => {
      const target = e.target as HTMLElement;

      // Check for interactive elements
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer') ||
        target.getAttribute('role') === 'button' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA';

      // Check for text elements
      const isText =
        target.tagName === 'P' ||
        target.tagName === 'SPAN' ||
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(target.tagName) ||
        target.tagName === 'LI' ||
        target.tagName === 'BLOCKQUOTE';

      if (isInteractive) {
        setIsPointer(true);
      }

      // We could add a text-hover state here if we wanted strictly different visuals
      // For now, ensuring pointer doesn't trigger on plain text, 
      // but we maintain the custom cursor visibility.

      // Check for custom cursor text
      const customText =
        target.getAttribute('data-cursor-text') ||
        target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (customText) {
        setCursorText(customText);
      }
    };

    const onMouseLeave = () => {
      setIsPointer(false);
      setCursorText('');
    };

    const onMouseOut = (e: MouseEvent) => {
      if (!e.relatedTarget) {
        setIsVisible(false);
      }
    };

    const onMouseOver = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseenter', onMouseEnter, true);
    document.addEventListener('mouseleave', onMouseLeave, true);
    document.addEventListener('mouseout', onMouseOut);
    document.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter, true);
      document.removeEventListener('mouseleave', onMouseLeave, true);
      document.removeEventListener('mouseout', onMouseOut);
      document.removeEventListener('mouseover', onMouseOver);
    };
  }, [cursorX, cursorY, isVisible]);

  // Don't render on server or touch devices
  if (!mounted) return null;

  return (
    <>
      {/* Main cursor ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 48 : 32,
            height: isPointer ? 48 : 32,
            opacity: isVisible ? (isPointer ? 0.6 : 1) : 0,
          }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="border border-white rounded-full"
        />
      </motion.div>

      {/* Center dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      >
        <motion.div
          animate={{
            width: isPointer ? 6 : 4,
            height: isPointer ? 6 : 4,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ duration: 0.15 }}
          className="bg-white rounded-full"
        />
      </motion.div>

      {/* Cursor text label */}
      {cursorText && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-[9999] hidden lg:block"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
            translateX: '-50%',
            translateY: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="px-3 py-1.5 text-[10px] font-mono tracking-widest uppercase bg-primary text-primary-foreground"
          >
            {cursorText}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
