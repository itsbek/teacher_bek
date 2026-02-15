"use client";

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

interface LiquidDistortionProps {
  className?: string;
  imageUrl?: string;
  intensity?: number;
  radius?: number;
  children?: React.ReactNode;
}

export interface LiquidDistortionRef {
  setIntensity: (value: number) => void;
  triggerRipple: (x: number, y: number) => void;
}

export const LiquidDistortion = forwardRef<LiquidDistortionRef, LiquidDistortionProps>(({
  className = '',
  intensity = 0.3,
  radius = 0.4,
  children
}, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, hover: 0 });
  const uniformsRef = useRef<{ [key: string]: THREE.IUniform } | null>(null);
  const frameRef = useRef<number>(0);
  const rippleRef = useRef({ x: 0.5, y: 0.5, time: 0, active: false });

  useImperativeHandle(ref, () => ({
    setIntensity: (value: number) => {
      if (uniformsRef.current) {
        uniformsRef.current.uIntensity.value = value;
      }
    },
    triggerRipple: (x: number, y: number) => {
      rippleRef.current = { x, y, time: 0, active: true };
    }
  }));

  const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uMouseVelocity;
    uniform float uHover;
    uniform float uIntensity;
    uniform float uRadius;
    uniform vec2 uRippleCenter;
    uniform float uRippleTime;
    uniform float uRippleActive;

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
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 p = uv * aspect;
      vec2 mousePos = uMouse * aspect;

      // Calculate distance from mouse
      float dist = distance(p, mousePos);
      float circle = smoothstep(uRadius, 0.0, dist);

      // Velocity magnitude
      float velocity = length(uMouseVelocity);

      // Base distortion from mouse
      float distortionStrength = circle * uHover * uIntensity;

      // Generate noise pattern
      float noise = snoise(gl_FragCoord.xy * 0.02 + uTime * 0.2);
      float noise2 = snoise(gl_FragCoord.xy * 0.01 - uTime * 0.15);

      // Distortion offset
      vec2 distortion = vec2(noise, noise2) * distortionStrength;

      // Add velocity-based distortion
      distortion += uMouseVelocity * 0.05 * circle;

      // Ripple effect
      if (uRippleActive > 0.5) {
        vec2 ripplePos = uRippleCenter * aspect;
        float rippleDist = distance(p, ripplePos);
        float rippleWave = sin(rippleDist * 20.0 - uRippleTime * 5.0);
        float rippleStrength = exp(-rippleDist * 3.0) * exp(-uRippleTime * 0.5);
        distortion += normalize(p - ripplePos + 0.001) * rippleWave * rippleStrength * 0.02;
      }

      // Apply distortion to UV
      vec2 distortedUV = uv + distortion;

      // Chromatic aberration based on distortion magnitude
      float aberration = length(distortion) * 2.0;
      float r = 0.5 + aberration * 0.5;
      float g = 0.5;
      float b = 0.5 - aberration * 0.5;

      // Create a color pattern for visualization (when no image)
      vec3 color1 = vec3(0.784, 0.361, 0.247); // #C85C3F copper
      vec3 color2 = vec3(0.722, 0.584, 0.416); // #B8956A gold

      float pattern = snoise(distortedUV * 3.0 + uTime * 0.1);
      vec3 color = mix(color1, color2, pattern * 0.5 + 0.5);

      // Add specular highlight at mouse position
      float specular = pow(circle, 3.0) * 0.3 * uHover;
      color += vec3(specular);

      // Edge darkening
      float edge = 1.0 - smoothstep(0.3, 0.5, length(uv - 0.5));
      color *= 0.7 + edge * 0.3;

      // Output with subtle transparency for overlay effect
      float alpha = 0.1 + distortionStrength * 0.5 + circle * 0.2 * uHover;
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

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (e.clientX - rect.left) / rect.width;
    const newY = 1.0 - (e.clientY - rect.top) / rect.height;

    mouseRef.current.vx = (newX - mouseRef.current.x) * 5;
    mouseRef.current.vy = (newY - mouseRef.current.y) * 5;
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseRef.current.hover = 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.hover = 0;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

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
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uHover: { value: 0 },
      uIntensity: { value: intensity },
      uRadius: { value: radius },
      uRippleCenter: { value: new THREE.Vector2(0.5, 0.5) },
      uRippleTime: { value: 0 },
      uRippleActive: { value: 0 },
    };
    uniformsRef.current = uniforms;

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
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation loop
    const startTime = Date.now();
    let hoverValue = 0;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      const time = (Date.now() - startTime) * 0.001;
      uniforms.uTime.value = time;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.uMouseVelocity.value.set(mouseRef.current.vx, mouseRef.current.vy);

      // Smooth hover transition
      hoverValue += (mouseRef.current.hover - hoverValue) * 0.1;
      uniforms.uHover.value = hoverValue;

      // Decay velocity
      mouseRef.current.vx *= 0.9;
      mouseRef.current.vy *= 0.9;

      // Ripple animation
      if (rippleRef.current.active) {
        rippleRef.current.time += 0.016;
        uniforms.uRippleCenter.value.set(rippleRef.current.x, rippleRef.current.y);
        uniforms.uRippleTime.value = rippleRef.current.time;
        uniforms.uRippleActive.value = 1;

        if (rippleRef.current.time > 3) {
          rippleRef.current.active = false;
          uniforms.uRippleActive.value = 0;
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [intensity, radius, handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      {children}
    </div>
  );
});

LiquidDistortion.displayName = 'LiquidDistortion';
