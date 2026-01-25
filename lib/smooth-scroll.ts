import Lenis from 'lenis';

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (typeof window === 'undefined') return null;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
}

export function destroySmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}

export function scrollTo(target: string | number, options?: { offset?: number; duration?: number }) {
  lenis?.scrollTo(target, options);
}
