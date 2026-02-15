"use client";

import { useEffect, useRef, useCallback } from 'react';

interface MetaballCanvasProps {
  className?: string;
  ballCount?: number;
  color?: string;
  secondaryColor?: string;
  threshold?: number;
  mouseInfluence?: number;
}

export function MetaballCanvas({
  className = '',
  ballCount = 8,
  color = '#C85C3F',
  secondaryColor = '#B8956A',
  threshold = 0.5,
  mouseInfluence = 1.5
}: MetaballCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const frameRef = useRef<number>(0);
  const ballsRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
  }>>([]);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -1000;
    mouseRef.current.y = -1000;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();

    // Initialize balls
    const rect = canvas.getBoundingClientRect();
    ballsRef.current = Array.from({ length: ballCount }, (_, i) => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      radius: 40 + Math.random() * 60,
      color: i % 2 === 0 ? color : secondaryColor
    }));

    const rgb1 = hexToRgb(color);
    const rgb2 = hexToRgb(secondaryColor);

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Create offscreen canvas for metaball calculation
      const offscreen = document.createElement('canvas');
      offscreen.width = Math.floor(width / 4);
      offscreen.height = Math.floor(height / 4);
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      offCtx.clearRect(0, 0, offscreen.width, offscreen.height);

      // Update ball positions
      ballsRef.current.forEach((ball, index) => {
        // Physics update
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x < ball.radius || ball.x > width - ball.radius) {
          ball.vx *= -0.9;
          ball.x = Math.max(ball.radius, Math.min(width - ball.radius, ball.x));
        }
        if (ball.y < ball.radius || ball.y > height - ball.radius) {
          ball.vy *= -0.9;
          ball.y = Math.max(ball.radius, Math.min(height - ball.radius, ball.y));
        }

        // Mouse attraction/repulsion
        const dx = mouseRef.current.x - ball.x;
        const dy = mouseRef.current.y - ball.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 200 && dist > 0) {
          const force = (200 - dist) / 200 * mouseInfluence;
          ball.vx += (dx / dist) * force * 0.05;
          ball.vy += (dy / dist) * force * 0.05;
        }

        // Damping
        ball.vx *= 0.99;
        ball.vy *= 0.99;

        // Random movement
        ball.vx += (Math.random() - 0.5) * 0.1;
        ball.vy += (Math.random() - 0.5) * 0.1;

        // Speed limit
        const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
        if (speed > 3) {
          ball.vx = (ball.vx / speed) * 3;
          ball.vy = (ball.vy / speed) * 3;
        }
      });

      // Draw metaballs using radial gradients on offscreen canvas
      ballsRef.current.forEach((ball) => {
        const gradient = offCtx.createRadialGradient(
          ball.x / 4, ball.y / 4, 0,
          ball.x / 4, ball.y / 4, ball.radius / 4
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        offCtx.beginPath();
        offCtx.arc(ball.x / 4, ball.y / 4, ball.radius / 4, 0, Math.PI * 2);
        offCtx.fillStyle = gradient;
        offCtx.fill();
      });

      // Mouse as additional metaball
      if (mouseRef.current.x > 0) {
        const mouseGradient = offCtx.createRadialGradient(
          mouseRef.current.x / 4, mouseRef.current.y / 4, 0,
          mouseRef.current.x / 4, mouseRef.current.y / 4, 30
        );
        mouseGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        mouseGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
        mouseGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        offCtx.beginPath();
        offCtx.arc(mouseRef.current.x / 4, mouseRef.current.y / 4, 30, 0, Math.PI * 2);
        offCtx.fillStyle = mouseGradient;
        offCtx.fill();
      }

      // Get image data from offscreen canvas
      const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
      const data = imageData.data;

      // Apply threshold to create metaball effect with color
      for (let i = 0; i < data.length; i += 4) {
        const brightness = data[i] / 255;

        if (brightness > threshold) {
          // Mix colors based on brightness
          const t = (brightness - threshold) / (1 - threshold);
          data[i] = Math.floor(rgb1.r * t + rgb2.r * (1 - t));
          data[i + 1] = Math.floor(rgb1.g * t + rgb2.g * (1 - t));
          data[i + 2] = Math.floor(rgb1.b * t + rgb2.b * (1 - t));
          data[i + 3] = Math.min(255, brightness * 300);
        } else {
          data[i + 3] = 0;
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      // Scale up and draw to main canvas
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(offscreen, 0, 0, width, height);

      // Add glow effect
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = 'blur(20px)';
      ctx.globalAlpha = 0.3;
      ctx.drawImage(offscreen, 0, 0, width, height);
      ctx.filter = 'none';
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    };

    animate();

    window.addEventListener('resize', resize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [ballCount, color, secondaryColor, threshold, mouseInfluence, handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
