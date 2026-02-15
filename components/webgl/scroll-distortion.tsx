"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

interface ScrollDistortionProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  scrollInfluence?: number;
}

export function ScrollDistortion({
  children,
  className = '',
  intensity = 0.5,
  scrollInfluence = 0.1
}: ScrollDistortionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRef = useRef({ current: 0, target: 0, velocity: 0 });
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const frameRef = useRef<number>(0);
  const [isVisible, setIsVisible] = useState(false);

  const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform float uScrollVelocity;
    uniform vec2 uMouse;
    uniform float uIntensity;

    varying vec2 vUv;

    // Simplex noise
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x = a0.x * x0.x + h.x * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      vec2 uv = vUv;

      // Scroll-based wave distortion
      float velocity = abs(uScrollVelocity);
      float direction = sign(uScrollVelocity);

      // Parabolic curve based on scroll
      float curve = sin(uv.x * 3.14159) * velocity * direction * -0.02 * uIntensity;

      // Add noise for organic feel
      float noise = snoise(uv * 3.0 + uTime * 0.5);
      curve += noise * velocity * 0.003 * uIntensity;

      // Mouse influence
      vec2 mouseDir = uv - uMouse;
      float mouseDist = length(mouseDir);
      float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
      curve += mouseEffect * noise * 0.01 * uIntensity;

      // Apply distortion
      uv.y += curve;

      // Create gradient overlay
      vec3 color1 = vec3(0.784, 0.361, 0.247); // Copper
      vec3 color2 = vec3(0.722, 0.584, 0.416); // Gold

      float gradient = snoise(uv * 2.0 + uTime * 0.1);
      vec3 color = mix(color1, color2, gradient * 0.5 + 0.5);

      // Overlay effect
      float alpha = velocity * 0.3 * uIntensity;
      alpha = clamp(alpha, 0.0, 0.15);

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const vertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const handleScroll = useCallback(() => {
    scrollRef.current.target = window.scrollY;
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseRef.current.x = (e.clientX - rect.left) / rect.width;
    mouseRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Check if element is in viewport
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uScrollVelocity: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uIntensity: { value: intensity },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.uResolution.value.set(width, height);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', handleScroll, { passive: true });
    container.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const startTime = Date.now();

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Only render when visible
      if (!isVisible) return;

      // Smooth scroll following
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * 0.1;
      scrollRef.current.velocity = (scrollRef.current.target - scrollRef.current.current) * scrollInfluence;

      uniforms.uTime.value = (Date.now() - startTime) * 0.001;
      uniforms.uScrollVelocity.value = scrollRef.current.velocity;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      observer.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [intensity, scrollInfluence, isVisible, handleScroll, handleMouseMove]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />
      {children}
    </div>
  );
}
