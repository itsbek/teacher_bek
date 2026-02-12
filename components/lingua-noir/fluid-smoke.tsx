"use client";

import { useEffect, useRef, useCallback } from 'react';

interface FluidSmokeProps {
  className?: string;
  colors?: {
    tobacco: string;
    copper: string;
    blood: string;
  };
}

// Simplified fluid simulation for performance
// Uses canvas 2D with metaball-like effect for smoke
export function FluidSmoke({
  className = '',
  colors = {
    tobacco: '#3d2817',
    copper: '#43b3ae',
    blood: '#8a0303',
  }
}: FluidSmokeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, isActive: false });
  const animationRef = useRef<number | undefined>(undefined);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    life: number;
    maxLife: number;
    color: string;
    opacity: number;
  }

  const createParticle = useCallback((x: number, y: number, color: string): Particle => ({
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 2 - 1,
    radius: Math.random() * 40 + 20,
    life: 0,
    maxLife: Math.random() * 150 + 100,
    color,
    opacity: Math.random() * 0.3 + 0.1,
  }), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize particles in silhouette shape
    const initParticles = () => {
      const colorArray = [colors.tobacco, colors.copper, colors.blood];
      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;

      for (let i = 0; i < 50; i++) {
        // Create particles in rough human silhouette shape
        const angle = Math.random() * Math.PI * 2;
        const radiusX = Math.random() * 100 + 50;
        const radiusY = Math.random() * 150 + 80;

        particlesRef.current.push(
          createParticle(
            centerX + Math.cos(angle) * radiusX * 0.5,
            centerY + Math.sin(angle) * radiusY * 0.6 - 50,
            colorArray[Math.floor(Math.random() * colorArray.length)]
          )
        );
      }
    };
    initParticles();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        isActive: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const colorArray = [colors.tobacco, colors.copper, colors.blood];
      const particles = particlesRef.current;

      // Add new particles
      if (particles.length < 80) {
        const centerX = canvas.offsetWidth / 2;
        const centerY = canvas.offsetHeight / 2;
        particles.push(
          createParticle(
            centerX + (Math.random() - 0.5) * 150,
            centerY + (Math.random() - 0.5) * 200,
            colorArray[Math.floor(Math.random() * colorArray.length)]
          )
        );
      }

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Mouse repulsion
        if (mouseRef.current.isActive) {
          const dx = p.x - mouseRef.current.x;
          const dy = p.y - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            const force = (150 - dist) / 150;
            p.vx += (dx / dist) * force * 0.5;
            p.vy += (dy / dist) * force * 0.5;
          }
        }

        // Breathing turbulence (sinusoidal)
        const breathe = Math.sin(Date.now() * 0.001 + i * 0.1) * 0.3;
        p.vx += breathe * 0.1;
        p.vy += breathe * 0.05 - 0.02; // Slight upward drift

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Update life
        p.life++;

        // Calculate opacity based on life
        const lifeRatio = p.life / p.maxLife;
        const currentOpacity = p.opacity * (1 - lifeRatio) * (lifeRatio < 0.1 ? lifeRatio * 10 : 1);

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          p.x, p.y, 0,
          p.x, p.y, p.radius
        );

        // Convert hex color to rgba for proper opacity handling
        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 0, g: 0, b: 0 };
        };

        const rgb = hexToRgb(p.color);
        gradient.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Remove dead particles
        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
        }
      }

      // Apply blur effect via CSS filter on canvas
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [colors, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ filter: 'blur(20px)' }}
    />
  );
}

// Simplified smoke tendrils using SVG
export function SmokeTendrils({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="smoke-blur">
            <feGaussianBlur stdDeviation="15" />
          </filter>
          <linearGradient id="smoke-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3d2817" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#43b3ae" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#43b3ae" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[...Array(5)].map((_, i) => (
          <path
            key={i}
            d={`M${200 + i * 100},600
                Q${220 + i * 100 + Math.sin(i) * 50},${400 - i * 30}
                 ${180 + i * 100 + Math.cos(i) * 30},${200 - i * 20}
                Q${200 + i * 100},${100 - i * 10}
                 ${190 + i * 100 + Math.sin(i * 2) * 40},0`}
            fill="none"
            stroke="url(#smoke-gradient)"
            strokeWidth={30 + i * 10}
            filter="url(#smoke-blur)"
            style={{
              animation: `smoke-rise ${8 + i * 2}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </svg>

      <style jsx>{`
        @keyframes smoke-rise {
          0%, 100% {
            transform: translateY(0) scaleX(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) scaleX(1.1);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
