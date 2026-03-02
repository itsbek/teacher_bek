import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        vanguard: {
          black: "#000000",
          white: "#FFFFFF",
          lime: "#D4FF00",  // Neon Lime
          jade: "#00FF95",  // Electric Jade
          carbon: "#111111",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'none': '0',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-monospace', 'monospace'],    // Spline Sans Mono
        display: ['var(--font-display)', 'system-ui', 'sans-serif'], // Sofia Sans Condensed
        mono: ['var(--font-sans)', 'ui-monospace', 'monospace'],     // Spline Sans Mono (same)
      },
      letterSpacing: {
        'vanguard': '0.25em',
        'tightest': '-0.04em',
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "cinematic-reveal": "cinematicReveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "gold-shimmer": "goldShimmer 3s infinite linear",
        "marquee": "marquee var(--duration) linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        cinematicReveal: {
          "0%": { transform: "translateY(40px) scale(1.05)", opacity: "0", filter: "blur(10px)" },
          "100%": { transform: "translateY(0) scale(1)", opacity: "1", filter: "blur(0px)" },
        },
        goldShimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },

    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
