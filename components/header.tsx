"use client";

import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ChevronDown, Menu, X } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'vi', name: 'Tiếng Việt', flag: 'VI' },
  { code: 'zh', name: '中文', flag: 'ZH' },
  { code: 'ru', name: 'Русский', flag: 'RU' },
];

export function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const switchLanguage = (newLocale: string) => {
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`));
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const currentLang = languages.find(l => l.code === locale) || languages[0];

  const navLinks = [
    { href: `/${locale}#courses`, label: t('courses') },
    { href: `/${locale}#testimonials`, label: t('testimonials') },
    { href: `/${locale}#faq`, label: t('faq') },
    { href: `/${locale}#contact`, label: t('contact') },
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-lg border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-lg">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href={`/${locale}`} className="group flex items-baseline gap-0.5">
              <span className="font-display text-xl md:text-2xl font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                English
              </span>
              <span className="text-accent font-display text-xl md:text-2xl font-semibold">.</span>
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Language Switcher */}
              <div className="relative hidden md:block">
                <button
                  onClick={() => setLangMenuOpen(!langMenuOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-accent tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {currentLang.flag}
                  <ChevronDown className={`w-3 h-3 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {langMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => switchLanguage(lang.code)}
                          className={`w-full px-4 py-3 text-left text-sm flex items-center gap-3 transition-colors ${
                            locale === lang.code
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <span className="font-accent text-xs tracking-wider">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg border border-border hover:bg-muted transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden bg-background"
          >
            <div className="h-full flex flex-col justify-center items-center px-6 pt-16">
              <nav className="flex flex-col items-center gap-6 mb-12">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    className="font-display text-3xl font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </motion.a>
                ))}
              </nav>

              {/* Language Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-2 mb-6"
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => switchLanguage(lang.code)}
                    className={`px-4 py-2 text-xs font-accent tracking-wider rounded-lg transition-colors ${
                      locale === lang.code
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-border text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </motion.div>

              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    setTheme(theme === 'dark' ? 'light' : 'dark');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
