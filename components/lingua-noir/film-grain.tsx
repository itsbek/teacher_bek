"use client";

import { useEffect, useRef } from 'react';

interface FilmGrainProps {
  opacity?: number;
  animated?: boolean;
}

export function FilmGrain({ opacity = 0.04, animated = true }: FilmGrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!animated) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate grain
    let animationId: number;
    const generateGrain = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // R
        data[i + 1] = value; // G
        data[i + 2] = value; // B
        data[i + 3] = 25;    // A (low for subtle effect)
      }

      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(generateGrain);
    };

    generateGrain();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [animated]);

  if (!animated) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ opacity, mixBlendMode: 'overlay' }}
    />
  );
}

// Scanline overlay
export function Scanlines({ opacity = 0.03 }: { opacity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9997]"
      style={{
        opacity,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`,
      }}
    />
  );
}

// Vignette overlay
export function Vignette({ intensity = 0.4 }: { intensity?: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9996]"
      style={{
        background: `radial-gradient(
          ellipse at center,
          transparent 0%,
          transparent 50%,
          rgba(0, 0, 0, ${intensity}) 100%
        )`,
      }}
    />
  );
}

// Color bleed overlay
export function ColorBleed() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9995]"
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, rgba(138, 3, 3, 0.08) 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, rgba(67, 179, 174, 0.06) 0%, transparent 40%),
          radial-gradient(ellipse at 90% 10%, rgba(61, 40, 23, 0.05) 0%, transparent 30%)
        `,
      }}
    />
  );
}

// Combined atmospheric overlay
export function AtmosphericOverlay() {
  return (
    <>
      <FilmGrain opacity={0.035} animated={false} />
      <Scanlines opacity={0.02} />
      <Vignette intensity={0.3} />
      <ColorBleed />
    </>
  );
}
