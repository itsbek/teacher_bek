"use client";

import { useEffect, useRef, useCallback, useState } from 'react';
import * as THREE from 'three';

interface RGBShiftImageProps {
  src: string;
  alt: string;
  className?: string;
  intensity?: number;
  onLoad?: () => void;
}

export function RGBShiftImage({
  src,
  alt,
  className = '',
  intensity = 0.02,
  onLoad
}: RGBShiftImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, vx: 0, vy: 0, hover: 0 });
  const frameRef = useRef<number>(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const vertexShader = `
    uniform vec2 uOffset;
    varying vec2 vUv;

    #define M_PI 3.141592653589793

    vec3 deformationCurve(vec3 pos, vec2 uv, vec2 offset) {
      // Sine wave deformation based on UV and offset
      pos.x += sin(uv.y * M_PI) * offset.x * 0.5;
      pos.y += sin(uv.x * M_PI) * offset.y * 0.5;
      return pos;
    }

    void main() {
      vUv = uv;
      vec3 newPos = deformationCurve(position, uv, uOffset);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform vec2 uOffset;
    uniform float uAlpha;
    uniform float uRGBShift;
    uniform float uTime;
    uniform float uHover;

    varying vec2 vUv;

    // Simplex noise for grain
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

      // Calculate RGB shift based on offset
      float shiftAmount = uRGBShift * length(uOffset) * uHover;

      // RGB Split (chromatic aberration)
      float r = texture2D(uTexture, uv + uOffset * shiftAmount * 1.5).r;
      float g = texture2D(uTexture, uv + uOffset * shiftAmount).g;
      float b = texture2D(uTexture, uv + uOffset * shiftAmount * 0.5).b;

      vec3 color = vec3(r, g, b);

      // Add subtle noise/grain
      float noise = snoise(uv * 500.0 + uTime * 0.5);
      color += (noise - 0.5) * 0.02;

      // Slight vignette on hover
      float vignette = 1.0 - length(uv - 0.5) * 0.3 * uHover;
      color *= vignette;

      // Brightness boost on hover
      color += vec3(0.02) * uHover;

      gl_FragColor = vec4(color, uAlpha);
    }
  `;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const newX = (e.clientX - rect.left) / rect.width;
    const newY = (e.clientY - rect.top) / rect.height;

    mouseRef.current.vx = (newX - mouseRef.current.x) * 2;
    mouseRef.current.vy = (newY - mouseRef.current.y) * 2;
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
  }, []);

  const handleMouseEnter = useCallback(() => {
    mouseRef.current.hover = 1;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.hover = 0;
    mouseRef.current.vx = 0;
    mouseRef.current.vy = 0;
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Load texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      src,
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;

        // Calculate aspect ratio to cover container
        const containerAspect = container.clientWidth / container.clientHeight;
        const imageAspect = texture.image.width / texture.image.height;

        let planeWidth = 2;
        let planeHeight = 2;

        if (containerAspect > imageAspect) {
          planeHeight = planeWidth / containerAspect;
        } else {
          planeWidth = planeHeight * containerAspect;
        }

        const uniforms = {
          uTexture: { value: texture },
          uOffset: { value: new THREE.Vector2(0, 0) },
          uAlpha: { value: 1 },
          uRGBShift: { value: intensity },
          uTime: { value: 0 },
          uHover: { value: 0 },
        };

        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          uniforms,
          transparent: true,
        });

        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32);
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        setImageLoaded(true);
        onLoad?.();

        // Animation loop
        const startTime = Date.now();
        let hoverValue = 0;

        const animate = () => {
          frameRef.current = requestAnimationFrame(animate);

          uniforms.uTime.value = (Date.now() - startTime) * 0.001;

          // Smooth offset following
          const currentOffset = uniforms.uOffset.value;
          currentOffset.x += (mouseRef.current.vx - currentOffset.x) * 0.1;
          currentOffset.y += (-mouseRef.current.vy - currentOffset.y) * 0.1;

          // Smooth hover transition
          hoverValue += (mouseRef.current.hover - hoverValue) * 0.1;
          uniforms.uHover.value = hoverValue;

          // Decay velocity
          mouseRef.current.vx *= 0.95;
          mouseRef.current.vy *= 0.95;

          // Subtle mesh rotation based on offset
          mesh.rotation.x = currentOffset.y * 0.1 * hoverValue;
          mesh.rotation.y = currentOffset.x * 0.1 * hoverValue;

          renderer.render(scene, camera);
        };
        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

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
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [src, intensity, handleMouseMove, handleMouseEnter, handleMouseLeave, onLoad]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* Fallback image for SEO and loading state */}
      {!imageLoaded && (
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.5 }}
        />
      )}
      <span className="sr-only">{alt}</span>
    </div>
  );
}
