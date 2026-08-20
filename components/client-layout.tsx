"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { GA_MEASUREMENT_ID, trackScrollDepth, event as trackEvent } from '@/lib/analytics';
import { usePathname } from 'next/navigation';
import { useAppStore, type FontSize } from '@/lib/store';

/* Lazy-load non-critical UI — keeps main bundle lean */
const ExitIntentModal    = dynamic(() => import('@/components/ExitIntentModal').then(m => ({ default: m.ExitIntentModal })));
const LanguageSuggestion = dynamic(() => import('@/components/LanguageSuggestion').then(m => ({ default: m.LanguageSuggestion })));
const ZaloFloat          = dynamic(() => import('@/components/ZaloFloat').then(m => ({ default: m.ZaloFloat })));
const TransitionCurtain  = dynamic(() => import('@/components/TransitionCurtain').then(m => ({ default: m.TransitionCurtain })));

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const themeMode = useAppStore((state) => state.themeMode);
  const { fontSize, setFontSize } = useAppStore();

  // Initialise font size from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem('font-size') as FontSize | null;
    if (saved === 'sm' || saved === 'md' || saved === 'lg') {
      setFontSize(saved);
      document.documentElement.dataset.fontsize = saved;
    } else {
      document.documentElement.dataset.fontsize = 'md';
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync font size to html element + persist whenever it changes
  useEffect(() => {
    document.documentElement.dataset.fontsize = fontSize;
    localStorage.setItem('font-size', fontSize);
  }, [fontSize]);

  // Initialize analytics
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  // Scroll depth milestones (25 / 50 / 75 / 100)
  useEffect(() => {
    const fired = new Set<number>();
    const onScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.body.scrollHeight;
      const pct      = Math.floor((scrolled / total) * 100);
      for (const milestone of [25, 50, 75, 100]) {
        if (pct >= milestone && !fired.has(milestone)) {
          fired.add(milestone);
          trackScrollDepth(milestone);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Section visibility tracking — fires once per section per page load
  useEffect(() => {
    const SECTIONS = ["hero", "about", "testimonials", "programs", "methodology", "credentials", "reads", "contact"];
    const fired = new Set<string>();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = (entry.target as HTMLElement).id;
          if (entry.isIntersecting && id && !fired.has(id)) {
            fired.add(id);
            trackEvent({ action: "section_view", category: "engagement", label: id });
          }
        });
      },
      { threshold: 0.3 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  return (
    <div className={themeMode === 'inverted' ? 'lie dark' : ''}>
      <TransitionCurtain />
      <ExitIntentModal />
      <LanguageSuggestion />
      <ZaloFloat />
      {children}
    </div>
  );
}
