"use client";

import { useEffect, useState, useRef } from 'react';
import { initClarity, GA_MEASUREMENT_ID } from '@/lib/analytics';
import { VanguardCursor } from '@/components/VanguardCursor';
import { LoadingScreen } from '@/components/LoadingScreen';
import { usePathname } from 'next/navigation';
import { AudioProvider } from '@/components/audio-provider';
import { ExitIntentModal } from '@/components/ExitIntentModal';
import { LanguageSuggestion } from '@/components/LanguageSuggestion';
import { ZaloFloat } from '@/components/ZaloFloat';
import { useAppStore, type FontSize } from '@/lib/store';
import type Lenis from 'lenis';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const themeMode = useAppStore((state) => state.themeMode);
  const { fontSize, setFontSize } = useAppStore();
  const [shouldUseEnhancedCursor, setShouldUseEnhancedCursor] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedBefore, setHasLoadedBefore] = useState(false);
  // lenisRef kept only to satisfy the type reference for anchor navigation
  const lenisRef = useRef<InstanceType<typeof Lenis> | null>(null);

  // Check if user has already seen loading screen in this session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = sessionStorage.getItem('loading-seen');
      if (seen) {
        setIsLoading(false);
        setHasLoadedBefore(true);
      }
    }
  }, []);

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
    initClarity();

    if (typeof window !== 'undefined' && window.gtag && GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const allowCursor =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldUseEnhancedCursor(allowCursor);
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('loading-seen', '1');
    }
  };

  return (
    <div className={themeMode === 'inverted' ? 'lie dark' : ''}>
      <AudioProvider>
        {isLoading && !hasLoadedBefore && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
        {shouldUseEnhancedCursor ? <VanguardCursor /> : null}
        <ExitIntentModal />
        <LanguageSuggestion />
        <ZaloFloat />
        {children}
      </AudioProvider>
    </div>
  );
}
