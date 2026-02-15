"use client";

import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  type?: 'chars' | 'words' | 'lines';
  stagger?: number;
  duration?: number;
  delay?: number;
  y?: number;
  rotation?: number;
  scrub?: boolean | number;
  start?: string;
  end?: string;
  once?: boolean;
}

export function TextReveal({
  children,
  className = '',
  type = 'words',
  stagger = 0.03,
  duration = 1,
  delay = 0,
  y = 100,
  rotation = 0,
  scrub = false,
  start = 'top 85%',
  end = 'top 20%',
  once = true
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const splitRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const text = container.textContent || '';
    container.innerHTML = '';

    let elements: string[] = [];
    if (type === 'chars') {
      elements = text.split('');
    } else if (type === 'words') {
      elements = text.split(' ');
    } else {
      elements = [text];
    }

    // Create wrapper for overflow hidden
    const wrapper = document.createElement('span');
    wrapper.className = 'inline-block overflow-hidden';

    elements.forEach((element, i) => {
      const span = document.createElement('span');
      span.className = 'inline-block';
      span.style.display = 'inline-block';
      span.textContent = type === 'words' && i < elements.length - 1 ? element + '\u00A0' : element;
      splitRef.current.push(span);
      wrapper.appendChild(span);
    });

    container.appendChild(wrapper);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: scrub ? {
          trigger: container,
          start,
          end,
          scrub: typeof scrub === 'number' ? scrub : 1,
        } : {
          trigger: container,
          start,
          once,
        }
      });

      tl.fromTo(splitRef.current,
        {
          y,
          rotation,
          opacity: 0,
        },
        {
          y: 0,
          rotation: 0,
          opacity: 1,
          duration,
          delay,
          stagger,
          ease: 'power4.out',
        }
      );
    }, container);

    return () => {
      ctx.revert();
      splitRef.current = [];
    };
  }, [type, stagger, duration, delay, y, rotation, scrub, start, end, once]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}

// Magnetic hover text effect
interface MagneticTextProps {
  children: string;
  className?: string;
  strength?: number;
}

export function MagneticText({ children, className = '', strength = 0.3 }: MagneticTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      charsRef.current.forEach((char) => {
        const charRect = char.getBoundingClientRect();
        const charCenterX = charRect.left - rect.left + charRect.width / 2;
        const charCenterY = charRect.top - rect.top + charRect.height / 2;

        const deltaX = mouseX - charCenterX;
        const deltaY = mouseY - charCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDist = 150;

        if (distance < maxDist) {
          const force = (1 - distance / maxDist) * strength;
          gsap.to(char, {
            x: deltaX * force,
            y: deltaY * force,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });
    };

    const handleMouseLeave = () => {
      charsRef.current.forEach((char) => {
        gsap.to(char, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => { if (el) charsRef.current[i] = el; }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// Wave text animation
interface WaveTextProps {
  children: string;
  className?: string;
  amplitude?: number;
  frequency?: number;
  speed?: number;
}

export function WaveText({
  children,
  className = '',
  amplitude = 20,
  frequency = 0.3,
  speed = 2
}: WaveTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let time = 0;

    const animate = () => {
      time += 0.016 * speed;

      charsRef.current.forEach((char, i) => {
        const offset = Math.sin(time + i * frequency) * amplitude;
        char.style.transform = `translateY(${offset}px)`;
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [amplitude, frequency, speed]);

  return (
    <span ref={containerRef} className={`inline-block ${className}`}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => { if (el) charsRef.current[i] = el; }}
          className="inline-block"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}

// Scramble reveal text
interface ScrambleRevealProps {
  children: string;
  className?: string;
  duration?: number;
  scrambleChars?: string;
}

export function ScrambleReveal({
  children,
  className = '',
  duration = 1.5,
  scrambleChars = '!<>-_\\/[]{}—=+*^?#________'
}: ScrambleRevealProps) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;

    const originalText = children;
    let frame = 0;
    const totalFrames = duration * 60;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const animate = () => {
            const progress = frame / totalFrames;
            const revealedLength = Math.floor(originalText.length * progress);

            let displayText = '';
            for (let i = 0; i < originalText.length; i++) {
              if (i < revealedLength) {
                displayText += originalText[i];
              } else if (originalText[i] === ' ') {
                displayText += ' ';
              } else {
                displayText += scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
              }
            }

            el.textContent = displayText;
            frame++;

            if (frame <= totalFrames) {
              requestAnimationFrame(animate);
            } else {
              el.textContent = originalText;
            }
          };

          animate();
        }
      });
    }, el);

    return () => ctx.revert();
  }, [children, duration, scrambleChars]);

  return (
    <span ref={textRef} className={className}>
      {children}
    </span>
  );
}
