"use client";

import { useEffect } from 'react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { MechanicalCursor } from '@/components/lingua-noir/mechanical-cursor';
import { AtmosphericOverlay } from '@/components/lingua-noir/film-grain';
import { ScrollProgress } from '@/components/scroll-progress';
import { initClarity, GA_MEASUREMENT_ID } from '@/lib/analytics';
import { usePathname } from 'next/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Initialize smooth scroll
  useSmoothScroll();

  // Initialize analytics
  useEffect(() => {
    // Initialize Microsoft Clarity
    initClarity();

    // Google Analytics pageview tracking
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Scroll depth tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const depths = [25, 50, 75, 100];
    const tracked = new Set<number>();

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / scrollHeight) * 100;

      depths.forEach((depth) => {
        if (scrolled >= depth && !tracked.has(depth)) {
          tracked.add(depth);
          if (window.gtag) {
            window.gtag('event', `scroll_depth_${depth}`, {
              event_category: 'engagement',
              value: depth,
            });
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <MechanicalCursor color="#43b3ae" size={36} />
      <AtmosphericOverlay />
      <ScrollProgress />
      {children}
    </>
  );
}
