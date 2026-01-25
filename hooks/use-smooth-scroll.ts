"use client";

import { useEffect } from 'react';
import { initSmoothScroll, destroySmoothScroll } from '@/lib/smooth-scroll';

export function useSmoothScroll() {
  useEffect(() => {
    const lenis = initSmoothScroll();

    return () => {
      destroySmoothScroll();
    };
  }, []);
}
