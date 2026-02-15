"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Mail, Linkedin } from 'lucide-react';

// Custom SVG Icons for platforms not in lucide-react
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const ZaloIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.119.099.152.232.168.326.015.094.035.306.019.472z"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export interface SocialLink {
  name: string;
  href: string;
  icon: 'whatsapp' | 'zalo' | 'telegram' | 'linkedin' | 'email';
}

interface SocialIconsProps {
  links: SocialLink[];
  variant?: 'default' | 'minimal' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

const iconComponents = {
  whatsapp: WhatsAppIcon,
  zalo: ZaloIcon,
  telegram: TelegramIcon,
  linkedin: Linkedin,
  email: Mail,
};

const sizeClasses = {
  sm: {
    container: 'w-9 h-9',
    icon: 'w-4 h-4',
  },
  md: {
    container: 'w-11 h-11',
    icon: 'w-5 h-5',
  },
  lg: {
    container: 'w-14 h-14',
    icon: 'w-6 h-6',
  },
};

export function SocialIcons({
  links,
  variant = 'default',
  size = 'md',
  showLabels = false,
  className = '',
}: SocialIconsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const getVariantStyles = () => {
    switch (variant) {
      case 'minimal':
        return {
          base: 'text-white/50 hover:text-[#ECD06F]',
          hover: '',
        };
      case 'glass':
        return {
          base: 'bg-white/5 backdrop-blur-sm border border-white/10 text-white/60 hover:bg-[#ECD06F]/10 hover:border-[#ECD06F]/30 hover:text-[#ECD06F]',
          hover: 'shadow-lg shadow-[#ECD06F]/5',
        };
      default:
        return {
          base: 'border border-white/10 text-white/60 hover:border-[#ECD06F]/50 hover:text-[#ECD06F] hover:bg-[#ECD06F]/5',
          hover: '',
        };
    }
  };

  const styles = getVariantStyles();
  const sizes = sizeClasses[size];

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link, index) => {
        const Icon = iconComponents[link.icon];
        const isHovered = hoveredIndex === index;

        return (
          <div key={link.name} className="relative">
            <motion.a
              href={link.href}
              target={link.href.startsWith('mailto:') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              aria-label={`Contact via ${link.name}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(index)}
              onBlur={() => setHoveredIndex(null)}
              initial={false}
              animate={{
                scale: isHovered ? 1.08 : 1,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
              className={`
                relative flex items-center justify-center rounded-full
                ${sizes.container}
                transition-all duration-300 ease-out
                ${styles.base}
                ${isHovered ? styles.hover : ''}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ECD06F] focus-visible:ring-offset-2 focus-visible:ring-offset-black
              `}
            >
              {/* Glass morphism background on hover */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ECD06F]/10 via-transparent to-[#ECD06F]/5 opacity-0"
                animate={{
                  opacity: isHovered ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Icon */}
              <motion.span
                className="relative z-10"
                animate={{
                  y: isHovered ? -1 : 0,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 25,
                }}
              >
                <Icon className={sizes.icon} />
              </motion.span>

              {/* Subtle shine effect on hover */}
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                animate={{
                  x: isHovered ? '200%' : '-100%',
                }}
                transition={{
                  duration: 0.6,
                  ease: 'easeInOut',
                }}
              />
            </motion.a>

            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="absolute left-1/2 -translate-x-1/2 -bottom-10 z-50 pointer-events-none"
                >
                  <div className="relative px-3 py-1.5 bg-white text-black text-xs font-medium tracking-wide whitespace-nowrap rounded-full">
                    {link.name}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Optional label below icon */}
            {showLabels && (
              <motion.span
                className="block mt-2 text-xs text-white/40 text-center"
                animate={{
                  color: isHovered ? '#ECD06F' : 'rgba(255,255,255,0.4)',
                }}
              >
                {link.name}
              </motion.span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Pre-configured social links for the teacher
export const defaultSocialLinks: SocialLink[] = [
  { name: 'WhatsApp', href: 'https://wa.me/+84123456789', icon: 'whatsapp' },
  { name: 'Zalo', href: 'https://zalo.me/0123456789', icon: 'zalo' },
  { name: 'Telegram', href: 'https://t.me/teacherbek', icon: 'telegram' },
  { name: 'LinkedIn', href: 'https://linkedin.com/in/teacherbek', icon: 'linkedin' },
  { name: 'Email', href: 'mailto:hello@teacherbek.com', icon: 'email' },
];
