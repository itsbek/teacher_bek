"use client";

import { useEffect, useState, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Sun, Moon } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'VI' },
  { code: 'zh', name: '中文', flag: 'ZH' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
];

/**
 * Navigation System - "Invisible Until Needed"
 *
 * Minimal corner indicators that expand into full-screen immersive navigation.
 * Features:
 * - Minimal default state (logo + 3 controls)
 * - Full-screen overlay on menu click
 * - Staggered link animations
 * - Language switcher with dropdown
 * - Theme toggle integration
 * - Scroll lock when menu open
 * - ESC key + focus trap
 * - Dual-mode: Maison d'Or (light) / Lingua Noir (dark)
 */
export function NavigationAwwwards() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Hydration safe - prevent theme flash
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [menuOpen]);

  // ESC key to close menu
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setLangMenuOpen(false);
      }
    };

    if (menuOpen) {
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }
  }, [menuOpen]);

  // Focus trap for accessibility
  useEffect(() => {
    if (!menuOpen || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const focusableElements = overlay.querySelectorAll<HTMLElement>(
      'button, a, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    overlay.addEventListener('keydown', handleTab as EventListener);
    firstElement?.focus();

    return () => {
      overlay.removeEventListener('keydown', handleTab as EventListener);
    };
  }, [menuOpen]);

  // Switch language by updating URL
  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
    setLangMenuOpen(false);
    setMenuOpen(false);
  };

  // Smooth scroll to section and close menu
  const handleNavClick = (href: string) => {
    setMenuOpen(false);

    // If it's a hash link, smooth scroll
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Regular navigation
      router.push(href);
    }
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const navLinks = [
    { href: '#about', label: t('about') || 'About' },
    { href: '#courses', label: t('courses') || 'Courses' },
    { href: `/${locale}/blog`, label: t('blog_link') || 'Blog' },
    { href: '#testimonials', label: t('testimonials') || 'Testimonials' },
    { href: '#faq', label: t('faq') || 'FAQ' },
    { href: '#contact', label: t('contact') || 'Contact' },
  ];

  return (
    <>
      {/* Minimal Fixed Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 lg:px-20 py-6 flex items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <a
          href={`/${locale}`}
          className="text-base font-medium tracking-tight text-[#C4A84D] dark:text-[#43b3ae] hover:opacity-70 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505] rounded-sm"
        >
          Teacher Bek
        </a>

        {/* Right Controls */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="text-xs tracking-widest uppercase text-[#C4A84D] dark:text-[#43b3ae] hover:opacity-70 transition-opacity duration-300 flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505] rounded-sm px-2 py-1"
              aria-label="Select language"
              aria-expanded={langMenuOpen}
            >
              {currentLang.flag}
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${
                  langMenuOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
            </button>

            {/* Language Dropdown */}
            <AnimatePresence>
              {langMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />

                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-[#FDFCF8] dark:bg-[#050505] border border-[#C4A84D]/20 dark:border-[#43b3ae]/20 shadow-lg overflow-hidden z-50"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLanguage(lang.code)}
                        className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors duration-200 ${
                          locale === lang.code
                            ? 'bg-[#C4A84D] dark:bg-[#43b3ae] text-white dark:text-[#050505]'
                            : 'hover:bg-[#C4A84D]/10 dark:hover:bg-[#43b3ae]/10 text-[#2A2A2C] dark:text-[#F4ECD8]'
                        }`}
                      >
                        <span className="text-xs tracking-wider w-6 font-medium">
                          {lang.flag}
                        </span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-8 h-8 flex items-center justify-center text-[#C4A84D] dark:text-[#43b3ae] hover:opacity-70 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505] rounded-sm"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait">
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4" aria-hidden="true" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-xs tracking-widest uppercase text-[#C4A84D] dark:text-[#43b3ae] hover:opacity-70 transition-opacity duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505] rounded-sm px-2 py-1"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </nav>

      {/* Full-Screen Navigation Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            ref={overlayRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-[#FDFCF8] dark:bg-[#050505]">
              {/* Noise texture (light mode) */}
              <div className="absolute inset-0 opacity-[0.02] dark:opacity-0">
                <svg width="100%" height="100%">
                  <filter id="nav-noise">
                    <feTurbulence baseFrequency="0.9" numOctaves="4" />
                    <feColorMatrix values="0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0.03 0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#nav-noise)" />
                </svg>
              </div>

              {/* Tobacco gradient (dark mode) */}
              <div className="absolute inset-0 opacity-0 dark:opacity-100">
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse at 20% 30%, rgba(61,40,23,0.15) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 70%, rgba(67,179,174,0.08) 0%, transparent 50%)
                    `,
                  }}
                />
              </div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12">
              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-2 md:gap-3">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{
                      delay: 0.1 + index * 0.05,
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    className="group relative font-display text-[clamp(3rem,8vw,6rem)] font-bold leading-none tracking-tight text-[#C4A84D] dark:text-[#43b3ae] hover:text-[#B8956A] dark:hover:text-[#00FFFF] transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#00FFFF] focus-visible:ring-offset-4 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505]"
                  >
                    <span className="relative inline-block group-hover:translate-x-5 transition-transform duration-500">
                      {link.label}

                      {/* Underline effect */}
                      <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#C4A84D] dark:bg-[#00FFFF] group-hover:w-full transition-all duration-500 origin-left"
                        style={{
                          boxShadow: '0 0 20px currentColor',
                        }}
                      />
                    </span>
                  </motion.a>
                ))}
              </nav>

              {/* Language Grid (expanded in overlay) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-16 md:mt-20 flex flex-wrap gap-3 justify-center"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`px-5 py-2.5 text-xs font-medium tracking-wider uppercase transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C4A84D] dark:focus-visible:ring-[#43b3ae] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FDFCF8] dark:focus-visible:ring-offset-[#050505] ${
                      locale === lang.code
                        ? 'bg-[#C4A84D] dark:bg-[#43b3ae] text-white dark:text-[#050505]'
                        : 'border border-[#C4A84D]/30 dark:border-[#43b3ae]/30 text-[#C4A84D] dark:text-[#43b3ae] hover:bg-[#C4A84D]/10 dark:hover:bg-[#43b3ae]/10'
                    }`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="absolute bottom-8 left-0 right-0 text-center"
              >
                <p className="text-xs tracking-wider uppercase text-[#C4A84D]/50 dark:text-[#43b3ae]/50">
                  TESOL Certified • ILA Vietnam • Ho Chi Minh City
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
