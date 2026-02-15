"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  scale?: number;
  direction?: 'up' | 'down';
  overlay?: boolean;
  overlayColor?: string;
  maskReveal?: boolean;
}

export function ParallaxImage({
  src,
  alt,
  className = '',
  speed = 50,
  scale = 1.2,
  direction = 'up',
  overlay = false,
  overlayColor = 'rgba(0,0,0,0.3)',
  maskReveal = false
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const image = imageRef.current;
    const mask = maskRef.current;
    if (!container || !image) return;

    const ctx = gsap.context(() => {
      // Parallax effect
      gsap.fromTo(image,
        { y: direction === 'up' ? speed : -speed },
        {
          y: direction === 'up' ? -speed : speed,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          }
        }
      );

      // Mask reveal effect
      if (maskReveal && mask) {
        gsap.fromTo(mask,
          { scaleY: 1 },
          {
            scaleY: 0,
            ease: 'power4.inOut',
            duration: 1.5,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            }
          }
        );

        gsap.fromTo(image,
          { scale: 1.4 },
          {
            scale,
            ease: 'power4.out',
            duration: 2,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            }
          }
        );
      }
    }, container);

    return () => ctx.revert();
  }, [speed, scale, direction, maskReveal]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div ref={imageRef} className="w-full h-full" style={{ transform: `scale(${scale})` }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: overlayColor }}
        />
      )}
      {maskReveal && (
        <div
          ref={maskRef}
          className="absolute inset-0 bg-[#C85C3F] dark:bg-[#B8956A] origin-top z-10"
        />
      )}
    </div>
  );
}

// Horizontal scroll gallery
interface HorizontalGalleryProps {
  images: { src: string; alt: string; caption?: string }[];
  className?: string;
}

export function HorizontalGallery({ images, className = '' }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const totalWidth = track.scrollWidth - container.offsetWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });
    }, container);

    return () => ctx.revert();
  }, [images]);

  return (
    <div ref={containerRef} className={`relative h-screen overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex h-full gap-8 px-20">
        {images.map((image, i) => (
          <div key={i} className="relative flex-shrink-0 w-[70vw] h-[80%] my-auto">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover"
              sizes="70vw"
            />
            {image.caption && (
              <div className="absolute bottom-8 left-8 right-8">
                <p className="text-white text-lg font-medium">{image.caption}</p>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Image with cursor follower
interface InteractiveImageProps {
  src: string;
  alt: string;
  className?: string;
  cursorText?: string;
}

export function InteractiveImage({
  src,
  alt,
  className = '',
  cursorText = 'View'
}: InteractiveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const cursor = cursorRef.current;
    if (!container || !cursor) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      gsap.to(cursor, {
        x,
        y,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-none ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover transition-transform duration-700 ${isHovering ? 'scale-110' : 'scale-100'}`}
        sizes="(max-width: 768px) 100vw, 50vw"
      />

      <div
        ref={cursorRef}
        className={`absolute pointer-events-none z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
          isHovering ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
        }`}
      >
        <div className="flex items-center justify-center w-24 h-24 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm">
          <span className="text-sm font-medium tracking-wider uppercase text-black dark:text-white">
            {cursorText}
          </span>
        </div>
      </div>
    </div>
  );
}

// Tilt card on hover
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glare?: boolean;
}

export function TiltCard({
  children,
  className = '',
  maxTilt = 15,
  perspective = 1000,
  scale = 1.02,
  glare = true
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glareEl = glareRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * maxTilt * 2;
      const tiltY = (x - 0.5) * -maxTilt * 2;

      gsap.to(card, {
        rotateX: tiltX,
        rotateY: tiltY,
        scale,
        duration: 0.3,
        ease: 'power2.out',
        transformPerspective: perspective,
      });

      if (glareEl && glare) {
        gsap.to(glareEl, {
          opacity: 0.3,
          background: `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          duration: 0.3,
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
      });

      if (glareEl && glare) {
        gsap.to(glareEl, {
          opacity: 0,
          duration: 0.3,
        });
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxTilt, perspective, scale, glare]);

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none opacity-0 z-10"
        />
      )}
    </div>
  );
}
