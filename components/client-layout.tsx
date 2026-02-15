"use client";

import { useEffect } from 'react';
import { initClarity, GA_MEASUREMENT_ID } from '@/lib/analytics';
import { VanguardCursor } from '@/components/VanguardCursor';
import { usePathname } from 'next/navigation';
import { AudioProvider } from '@/components/audio-provider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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

  return (
    <AudioProvider>
      <VanguardCursor />
      {children}
    </AudioProvider>
  );
}

