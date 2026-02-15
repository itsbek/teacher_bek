"use client";

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  particleSize?: number;
  speed?: number;
  mouseInfluence?: number;
  color?: string;
}

export function ParticleField({
  className = '',
  particleCount = 5000,
  particleSize = 2,
  speed = 0.5,
  mouseInfluence = 0.5,
  color = '#B8956A'
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const frameRef = useRef<number>(0);

  const vertexShader = `
    uniform float uTime;
    uniform float uSize;
    uniform vec2 uMouse;
    uniform float uMouseInfluence;

    attribute float aScale;
    attribute float aPhase;
    attribute vec3 aVelocity;

    varying float vAlpha;
    varying float vDistance;

    // Simplex 3D noise for organic movement
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
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    // Curl noise for turbulent flow
    vec3 curl(vec3 p) {
      float e = 0.1;
      vec3 dx = vec3(e, 0.0, 0.0);
      vec3 dy = vec3(0.0, e, 0.0);
      vec3 dz = vec3(0.0, 0.0, e);

      float n1 = snoise(p + dy) - snoise(p - dy);
      float n2 = snoise(p + dz) - snoise(p - dz);
      float n3 = snoise(p + dx) - snoise(p - dx);
      float n4 = snoise(p + dz) - snoise(p - dz);
      float n5 = snoise(p + dx) - snoise(p - dx);
      float n6 = snoise(p + dy) - snoise(p - dy);

      return normalize(vec3(n1 - n2, n3 - n4, n5 - n6));
    }

    void main() {
      vec3 pos = position;

      // Time-based animation
      float t = uTime * 0.3;

      // Curl noise displacement for organic movement
      vec3 noisePos = pos * 0.5 + t * 0.1;
      vec3 curlOffset = curl(noisePos) * 0.5;
      pos += curlOffset;

      // Individual particle oscillation
      float oscillation = sin(t * 2.0 + aPhase * 6.28) * 0.1;
      pos.y += oscillation;
      pos.x += sin(t * 1.5 + aPhase * 3.14) * 0.05;

      // Mouse repulsion
      vec2 screenPos = pos.xy;
      vec2 mouseDir = screenPos - uMouse;
      float mouseDist = length(mouseDir);
      float repulsion = smoothstep(1.5, 0.0, mouseDist) * uMouseInfluence;
      pos.xy += normalize(mouseDir + 0.001) * repulsion * 0.5;

      // Calculate distance for alpha fade
      vDistance = length(pos - cameraPosition) / 10.0;
      vAlpha = aScale * (1.0 - smoothstep(0.0, 1.0, vDistance * 0.3));

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = uSize * aScale * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 uColor;
    uniform float uDarkMode;

    varying float vAlpha;
    varying float vDistance;

    void main() {
      // Circular particle with soft edge
      vec2 center = gl_PointCoord - vec2(0.5);
      float dist = length(center);
      if (dist > 0.5) discard;

      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;

      // Color with depth fade
      vec3 color = uColor;
      color = mix(color, color * 0.6, vDistance);

      // Add glow in dark mode
      float glow = exp(-dist * 4.0) * 0.5 * uDarkMode;
      color += vec3(1.0) * glow;

      gl_FragColor = vec4(color, alpha);
    }
  `;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    mouseRef.current.targetX = x * 3;
    mouseRef.current.targetY = y * 3;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      // Distribute particles in a sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 3 + Math.random() * 2;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 5;

      scales[i] = 0.3 + Math.random() * 0.7;
      phases[i] = Math.random();
      velocities[i * 3] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('aVelocity', new THREE.BufferAttribute(velocities, 3));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: particleSize },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: mouseInfluence },
      uColor: { value: new THREE.Color(color) },
      uDarkMode: { value: 0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    const resize = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

      // Smooth mouse following
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      uniforms.uTime.value = (Date.now() - startTime) * 0.001 * speed;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Slow rotation
      particles.rotation.y += 0.0003;
      particles.rotation.x += 0.0001;

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
  }, [particleCount, particleSize, speed, mouseInfluence, color, handleMouseMove]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 ${className}`}
      style={{ touchAction: 'none' }}
    />
  );
}
