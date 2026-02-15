/**
 * KINETIC LEARNING LAB - Font Configuration
 *
 * Modern, playful typography system:
 * - Clash Display: Bold, geometric display font
 * - Satoshi: Clean, modern headings
 * - Inter: Professional, readable body text
 */

import localFont from 'next/font/local';
import { Inter } from 'next/font/google';

// Clash Display - Display/Hero typography
// Bold, geometric, perfect for large impact text
export const clashDisplay = localFont({
  src: [
    {
      path: '../public/fonts/ClashDisplay-Variable.woff2',
      weight: '400 700',
      style: 'normal',
    },
  ],
  variable: '--font-clash-display',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Satoshi - Headings
// Clean, geometric, modern sans-serif
export const satoshi = localFont({
  src: [
    {
      path: '../public/fonts/Satoshi-Variable.woff2',
      weight: '300 900',
      style: 'normal',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

// Inter - Body text
// Professional, highly readable for all content
export const inter = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

// JetBrains Mono - Code/Monospace (fallback to system)
// Using system monospace as fallback for now
export const jetbrainsMono = localFont({
  src: [
    {
      path: '../public/fonts/JetBrainsMono-Variable.woff2',
      weight: '100 800',
      style: 'normal',
    },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  fallback: ['Courier New', 'monospace'],
});

// Font class string for HTML element
export const fontVariables = `${clashDisplay.variable} ${satoshi.variable} ${inter.variable} ${jetbrainsMono.variable}`;
