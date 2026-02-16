"use client";

import { useEffect, useState } from 'react';
import { initClarity, GA_MEASUREMENT_ID } from '@/lib/analytics';
import { VanguardCursor } from '@/components/VanguardCursor';
import { usePathname } from 'next/navigation';
import { AudioProvider } from '@/components/audio-provider';
import { ExitIntentModal } from '@/components/ExitIntentModal';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [shouldUseEnhancedCursor, setShouldUseEnhancedCursor] = useState(false);

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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const allowCursor =
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShouldUseEnhancedCursor(allowCursor);
  }, []);

  return (
    <AudioProvider>
      {shouldUseEnhancedCursor ? <VanguardCursor /> : null}
      <ExitIntentModal />
      {children}
    </AudioProvider>
  );
}
