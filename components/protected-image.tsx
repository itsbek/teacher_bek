"use client";

import { useCallback, useState } from 'react';
import Image from 'next/image';

interface ProtectedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Protected Image Component
 *
 * Prevents easy downloading of images through:
 * - Disabled right-click context menu
 * - Disabled drag and drop
 * - Transparent overlay to prevent direct image access
 * - CSS pointer-events manipulation
 * - Disabled image selection
 */
export function ProtectedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes,
}: ProtectedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  // Prevent right-click context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Prevent drag start
  const handleDragStart = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Prevent touch hold (mobile context menu)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    // Allow touch but prevent long-press menu
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, []);

  return (
    <div
      className={`protected-image-container relative overflow-hidden ${className}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onTouchStart={handleTouchStart}
      style={{
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        userSelect: 'none',
      }}
    >
      {/* The actual image */}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        className={`
          transition-opacity duration-500
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
          pointer-events-none
          select-none
        `}
        style={{
          WebkitUserDrag: 'none',
          userSelect: 'none',
          pointerEvents: 'none',
        } as React.CSSProperties}
        draggable={false}
      />

      {/* Transparent protective overlay */}
      <div
        className="absolute inset-0 z-10"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        style={{
          background: 'transparent',
          cursor: 'default',
        }}
        aria-hidden="true"
      />

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Protected Profile Image with responsive sizing
 * Pre-configured for the teacher profile picture
 */
export function ProfileImage({ className = '' }: { className?: string }) {
  return (
    <ProtectedImage
      src="/images/teacher-profile.webp"
      alt="Teacher Bek - English Teacher in Ho Chi Minh City"
      width={800}
      height={1200}
      priority
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
      className={className}
    />
  );
}
