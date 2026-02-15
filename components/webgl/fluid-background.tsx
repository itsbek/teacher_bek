"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface FluidBackgroundProps {
  className?: string;
  colorScheme?: 'warm' | 'cool' | 'gold';
  intensity?: number;
  mouseInfluence?: number;
}

export function FluidBackground({
  className = '',
  colorScheme = 'warm',
  intensity = 1.0,
  mouseInfluence = 0.3
}: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0 });
  const frameRef = useRef<number>(0);

  const colorSchemes = {
    warm: {
      color1: new THREE.Color('#C85C3F'),
      color2: new THREE.Color('#B8956A'),
      color3: new THREE.Color('#FDFCF8'),
      color4: new THREE.Color('#0A0A0C'),
    },
    cool: {
      color1: new THREE.Color('#4A6FA5'),
      color2: new THREE.Color('#B8956A'),
      color3: new THREE.Color('#FDFCF8'),
      color4: new THREE.Color('#0A0A0C'),
    },
    gold: {
      color1: new THREE.Color('#B8956A'),
      color2: new THREE.Color('#C85C3F'),
      color3: new THREE.Color('#F5F1E8'),
      color4: new THREE.Color('#0F0F11'),
    },
  };

  // Fluid simulation fragment shader with metaball-like blending
  const fragmentShader = `
    precision highp float;

    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec2 uMouse;
    uniform vec2 uMouseVelocity;
    uniform float uIntensity;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform vec3 uColor4;
    uniform float uDarkMode;

    // Simplex 3D noise
    vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);

      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));

      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);

      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Fractal Brownian Motion
    float fbm(vec3 p, int octaves) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;

      for (int i = 0; i < 6; i++) {
        if (i >= octaves) break;
        value += amplitude * snoise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }

    // Smooth metaball-like blending
    float smin(float a, float b, float k) {
      float h = max(k - abs(a - b), 0.0) / k;
      return min(a, b) - h * h * h * k * (1.0 / 6.0);
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 p = (uv - 0.5) * aspect;

      // Mouse influence with velocity-based distortion
      vec2 mousePos = (uMouse - 0.5) * aspect;
      float mouseDist = distance(p, mousePos);
      float mouseEffect = smoothstep(0.5, 0.0, mouseDist);
      float velocityMag = length(uMouseVelocity);

      // Time-based animation
      float t = uTime * 0.15;

      // Multiple noise layers for organic flow
      vec3 noisePos = vec3(p * 2.0 + vec2(t * 0.3, t * 0.2), t * 0.1);
      float noise1 = fbm(noisePos, 4);
      float noise2 = fbm(noisePos * 1.5 + vec3(100.0, 0.0, 0.0), 3);
      float noise3 = fbm(noisePos * 0.5 - vec3(50.0, 0.0, 0.0), 5);

      // Metaball-like blobs
      float blob1 = length(p - vec2(sin(t * 0.7) * 0.3, cos(t * 0.5) * 0.2)) - 0.3;
      float blob2 = length(p - vec2(cos(t * 0.6) * 0.4, sin(t * 0.8) * 0.3)) - 0.25;
      float blob3 = length(p - mousePos) - 0.2 - velocityMag * 0.5;

      float blobs = smin(smin(blob1, blob2, 0.3), blob3, 0.4);

      // Combine noise with blobs
      float combined = noise1 * 0.5 + noise2 * 0.3 + noise3 * 0.2;
      combined += mouseEffect * velocityMag * 2.0;
      combined = combined * 0.5 + 0.5; // Normalize to 0-1

      // Apply blob influence
      combined = mix(combined, smoothstep(0.1, -0.1, blobs), 0.3);

      // Color mixing based on noise and dark mode
      vec3 bgColor = mix(uColor3, uColor4, uDarkMode);
      vec3 accentColor1 = mix(uColor1, uColor1 * 1.2, uDarkMode);
      vec3 accentColor2 = mix(uColor2, uColor2 * 1.1, uDarkMode);

      vec3 color = bgColor;

      // Layer colors based on noise values
      float threshold1 = 0.4 + noise2 * 0.1;
      float threshold2 = 0.55 + noise3 * 0.1;
      float threshold3 = 0.7 + noise1 * 0.05;

      color = mix(color, accentColor2 * 0.3, smoothstep(threshold1 - 0.1, threshold1 + 0.1, combined) * uIntensity * 0.5);
      color = mix(color, accentColor1 * 0.4, smoothstep(threshold2 - 0.1, threshold2 + 0.1, combined) * uIntensity * 0.6);
      color = mix(color, mix(accentColor1, accentColor2, 0.5) * 0.5, smoothstep(threshold3 - 0.1, threshold3 + 0.1, combined) * uIntensity * 0.4);

      // Mouse glow effect
      float mouseGlow = exp(-mouseDist * 3.0) * mouseEffect;
      color += accentColor1 * mouseGlow * 0.3 * uIntensity;

      // Vignette
      float vignette = 1.0 - length(uv - 0.5) * 0.8;
      vignette = smoothstep(0.0, 1.0, vignette);
      color *= vignette;

      // Subtle grain
      float grain = (fract(sin(dot(uv * uTime, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;
      color += grain;

      gl_FragColor = vec4(color, 1.0);
    }
  `;

  const vertexShader = `
    void main() {
      gl_Position = vec4(position, 1.0);
    }
  `;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (e.clientX - rect.left) / rect.width;
    const newY = 1.0 - (e.clientY - rect.top) / rect.height;

    mouseRef.current.vx = (newX - mouseRef.current.x) * 10;
    mouseRef.current.vy = (newY - mouseRef.current.y) * 10;
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    const colors = colorSchemes[colorScheme];

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uMouseVelocity: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: intensity },
      uColor1: { value: colors.color1 },
      uColor2: { value: colors.color2 },
      uColor3: { value: colors.color3 },
      uColor4: { value: colors.color4 },
      uDarkMode: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
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
    container.appendChild(renderer.domElement);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    // Check dark mode
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      uniforms.uDarkMode.value = isDark ? 1 : 0;
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // Animation loop
    const startTime = Date.now();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      uniforms.uTime.value = (Date.now() - startTime) * 0.001;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
      uniforms.uMouseVelocity.value.set(mouseRef.current.vx, mouseRef.current.vy);

      // Decay velocity
      mouseRef.current.vx *= 0.95;
      mouseRef.current.vy *= 0.95;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      observer.disconnect();
      container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [colorScheme, intensity, handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
