@tailwind base;
@tailwind components;
@tailwind utilities;

/* ═══════════════════════════════════════════════════════════════════════════
   SOTY DESIGN SYSTEM - Hardware Accelerated & Cinematic
   ═══════════════════════════════════════════════════════════════════════════ */

@layer base {
    :root {
        /* ─── REFINED PALETTE (Higher Contrast) ─── */
        --background: 40 33% 98%;
        --background-rgb: 252, 250, 247;
        --foreground: 240 10% 4%;

        --card: 40 25% 96%;
        --card-foreground: 240 10% 4%;

        --popover: 40 25% 96%;
        --popover-foreground: 240 10% 4%;

        /* Vibrant Orange-Red (More Saturated for Impact) */
        --primary: 17 94% 52%;
        --primary-foreground: 0 0% 100%;

        --secondary: 240 4% 16%;
        --secondary-foreground: 40 33% 98%;

        --muted: 40 10% 90%;
        --muted-foreground: 25 6% 45%;

        --accent: 17 94% 52%;
        --accent-foreground: 0 0% 100%;

        --destructive: 0 84% 60%;
        --destructive-foreground: 0 0% 100%;

        --border: 40 10% 88%;
        --input: 40 10% 88%;
        --ring: 17 94% 52%;

        --radius: 0px;

        /* Cinematic Easings */
        --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
        --ease-out-quart: cubic-bezier(0.165, 0.84, 0.44, 1);
        --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
        --ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
        --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);

        /* Shadows with Depth */
        --shadow-color: 30 30% 3%;
        --shadow-sm: 0 1px 2px -1px hsl(var(--shadow-color) / 0.1);
        --shadow-md: 0 4px 6px -1px hsl(var(--shadow-color) / 0.1), 0 2px 4px -2px hsl(var(--shadow-color) / 0.1);
        --shadow-lg: 0 10px 15px -3px hsl(var(--shadow-color) / 0.1), 0 4px 6px -4px hsl(var(--shadow-color) / 0.1);
        --shadow-xl: 0 20px 25px -5px hsl(var(--shadow-color) / 0.1), 0 8px 10px -6px hsl(var(--shadow-color) / 0.1);
        --shadow-glow: 0 0 40px -10px hsl(var(--primary) / 0.4);
        --shadow-2xl: 0 25px 50px -12px hsl(var(--shadow-color) / 0.25);
    }

    .dark {
        --background: 0 0% 4%;
        --background-rgb: 10, 10, 10;
        --foreground: 40 20% 97%;

        --card: 0 0% 8%;
        --card-foreground: 40 20% 97%;

        --popover: 0 0% 8%;
        --popover-foreground: 40 20% 97%;

        --primary: 17 100% 58%;
        --primary-foreground: 0 0% 4%;

        --secondary: 40 20% 97%;
        --secondary-foreground: 0 0% 4%;

        --muted: 0 0% 15%;
        --muted-foreground: 30 5% 55%;

        --accent: 17 100% 58%;
        --accent-foreground: 0 0% 4%;

        --border: 0 0% 18%;
        --input: 0 0% 18%;
        --ring: 17 100% 58%;

        --shadow-glow: 0 0 50px -10px hsl(var(--primary) / 0.35);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BASE RESETS & ACCESSIBILITY
   ═══════════════════════════════════════════════════════════════════════════ */

@layer base {
    * {
        @apply border-border;
    }

    html {
        scroll-behavior: smooth;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
    }

    /* Hide Default Cursor on Desktop */
    @media (pointer: fine) {

        body.custom-cursor-active,
        body.custom-cursor-active * {
            cursor: none !important;
        }

        body.custom-cursor-active a,
        body.custom-cursor-active button,
        body.custom-cursor-active [role="button"] {
            cursor: none !important;
        }
    }

    body {
        @apply bg-background text-foreground;
        font-feature-settings: "kern" 1, "liga" 1, "calt" 1;
        overflow-x: hidden;
    }

    /* Film Grain Noise Overlay */
    body::before {
        content: "";
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        opacity: 0.03;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        background-repeat: repeat;
        background-size: 200px 200px;
    }

    .dark body::before {
        opacity: 0.05;
    }

    /* Selection Color */
    ::selection {
        background: hsl(var(--primary) / 0.25);
        color: inherit;
    }

    ::-moz-selection {
        background: hsl(var(--primary) / 0.25);
        color: inherit;
    }

    /* Focus Visible (Accessibility) */
    :focus-visible {
        outline: 2px solid hsl(var(--primary));
        outline-offset: 4px;
        transition: outline-offset 0.2s ease;
    }

    :focus:not(:focus-visible) {
        outline: none;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   TYPOGRAPHY - Editorial Scale System
   ═══════════════════════════════════════════════════════════════════════════ */

@layer base {

    /* Display Font Locking */
    .font-display {
        font-weight: 600;
        letter-spacing: -0.03em;
        line-height: 0.9;
    }

    /* Hero Title Specifics */
    .hero-title {
        font-size: clamp(3rem, 11vw, 8rem);
        line-height: 0.85;
        letter-spacing: -0.04em;
        font-weight: 700;
    }

    /* SplitType Character Animation Ready */
    .char {
        display: inline-block;
        will-change: transform, opacity;
        transform: translateY(0);
        transition: transform 0.6s var(--ease-out-expo);
    }

    .char-reveal {
        transform: translateY(100%);
        opacity: 0;
    }

    .char-reveal.revealed {
        transform: translateY(0);
        opacity: 1;
    }

    /* Line Mask for Text Reveals */
    .line-mask {
        overflow: hidden;
        display: block;
        position: relative;
    }

    .line-mask>* {
        display: block;
        transform: translateY(0);
        transition: transform 1s var(--ease-out-expo);
    }

    .line-mask.hidden>* {
        transform: translateY(100%);
    }

    /* Text Outline Effect */
    .text-outline {
        -webkit-text-stroke: 1.5px currentColor;
        -webkit-text-fill-color: transparent;
        color: inherit;
    }

    .text-outline-thick {
        -webkit-text-stroke: 2px currentColor;
        -webkit-text-fill-color: transparent;
    }

    /* Gradient Text */
    .text-gradient {
        background: linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    /* Scramble Text Effect */
    .scramble-text {
        font-family: var(--font-mono);
        position: relative;
    }

    /* Editorial Eyebrow */
    .eyebrow {
        @apply inline-flex items-center gap-3;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.2em;
        color: hsl(var(--primary));
        font-weight: 600;
    }

    .eyebrow::before {
        content: "";
        display: block;
        width: 2rem;
        height: 1px;
        background: hsl(var(--primary));
        transition: width 0.6s var(--ease-out-expo);
    }

    .eyebrow:hover::before {
        width: 3rem;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   3D TRANSFORM UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

@layer utilities {
    .perspective-1000 {
        perspective: 1000px;
    }

    .perspective-2000 {
        perspective: 2000px;
    }

    .preserve-3d {
        transform-style: preserve-3d;
    }

    .backface-hidden {
        backface-visibility: hidden;
    }

    .rotate-y-5 {
        transform: rotateY(5deg);
    }

    .rotate-y-neg5 {
        transform: rotateY(-5deg);
    }

    .rotate-y-10 {
        transform: rotateY(10deg);
    }

    .translate-z-0 {
        transform: translateZ(0);
    }

    .translate-z-10 {
        transform: translateZ(10px);
    }

    .translate-z-20 {
        transform: translateZ(20px);
    }

    .translate-z-30 {
        transform: translateZ(30px);
    }

    .translate-z-50 {
        transform: translateZ(50px);
    }

    .transform-gpu {
        transform: translateZ(0);
        will-change: transform;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS - Liquid & Magnetic Effects
   ═══════════════════════════════════════════════════════════════════════════ */

@layer components {

    /* Primary Button with Liquid Fill */
    .btn-primary {
        @apply relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground font-semibold overflow-hidden;
        transition: transform 0.3s var(--ease-out-quart), box-shadow 0.3s ease;
        box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg), var(--shadow-glow);
    }

    .btn-primary:active {
        transform: translateY(0) scale(0.98);
    }

    /* Liquid Fill Animation */
    .btn-liquid {
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    .btn-liquid::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 300%;
        height: 300%;
        background: hsl(var(--foreground));
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.8s var(--ease-out-expo);
        z-index: -1;
    }

    .btn-liquid:hover::before {
        transform: translate(-50%, -50%) scale(1);
    }

    .btn-liquid:hover {
        color: hsl(var(--background));
    }

    /* Shine Effect */
    .btn-shine {
        position: relative;
        overflow: hidden;
    }

    .btn-shine::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(105deg,
                transparent 40%,
                rgba(255, 255, 255, 0.4) 45%,
                rgba(255, 255, 255, 0.6) 50%,
                rgba(255, 255, 255, 0.4) 55%,
                transparent 60%);
        transform: translateX(-100%);
        transition: transform 0.8s;
    }

    .btn-shine:hover::after {
        transform: translateX(100%);
    }

    /* Magnetic Button Base */
    .magnetic {
        transition: transform 0.3s var(--ease-out-quart);
        will-change: transform;
    }

    /* Outline Button with Sweep */
    .btn-outline {
        @apply relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-foreground/20 text-foreground font-semibold overflow-hidden;
        transition: all 0.5s var(--ease-out-expo);
    }

    .btn-outline::before {
        content: "";
        position: absolute;
        inset: 0;
        background: hsl(var(--foreground));
        transform: translateY(100%);
        transition: transform 0.5s var(--ease-out-expo);
        z-index: -1;
    }

    .btn-outline:hover::before {
        transform: translateY(0);
    }

    .btn-outline:hover {
        @apply text-background border-foreground;
    }

    /* Ghost Button */
    .btn-ghost {
        @apply inline-flex items-center gap-2 text-foreground font-medium relative;
        transition: gap 0.3s ease, color 0.3s ease;
    }

    .btn-ghost:hover {
        @apply gap-4;
        color: hsl(var(--primary));
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CARDS - 3D Tilt & Glassmorphism
   ═══════════════════════════════════════════════════════════════════════════ */

@layer components {
    .card-3d {
        @apply relative bg-card border border-border;
        transform-style: preserve-3d;
        transition: transform 0.5s var(--ease-out-quart), box-shadow 0.5s ease;
        box-shadow: var(--shadow-md);
    }

    .card-3d:hover {
        box-shadow: var(--shadow-xl);
    }

    .card-glass {
        @apply bg-card/70 backdrop-blur-xl border border-border/50;
        box-shadow: 0 8px 32px 0 hsl(var(--shadow-color) / 0.1);
    }

    .dark .card-glass {
        background: rgba(255, 255, 255, 0.03);
        border-color: rgba(255, 255, 255, 0.1);
    }

    /* Floating Card with Rotation */
    .card-floating {
        @apply bg-card border border-border p-6;
        transform: rotate(-2deg);
        transition: all 0.5s var(--ease-elastic);
        box-shadow: var(--shadow-lg);
    }

    .card-floating:hover {
        transform: rotate(0deg) translateY(-5px);
        box-shadow: var(--shadow-xl);
    }

    /* Feature Card with Top Line */
    .card-feature {
        @apply relative bg-card border border-border overflow-hidden;
        transition: all 0.5s var(--ease-out-quart);
    }

    .card-feature::before {
        content: "";
        @apply absolute top-0 left-0 w-full h-[2px] bg-primary;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.6s var(--ease-out-expo);
    }

    .card-feature:hover::before {
        transform: scaleX(1);
    }

    .card-feature:hover {
        @apply border-primary/30;
        box-shadow: var(--shadow-lg), 0 0 40px hsl(var(--primary) / 0.08);
        transform: translateY(-4px);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATIONS - Cinematic Keyframes
   ═══════════════════════════════════════════════════════════════════════════ */

@layer utilities {

    /* Reveal Up Animation */
    @keyframes reveal-up {
        from {
            opacity: 0;
            transform: translateY(100%);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-reveal-up {
        animation: reveal-up 1s var(--ease-out-expo) forwards;
    }

    /* Reveal with Skew */
    @keyframes reveal-skew {
        from {
            opacity: 0;
            transform: translateY(100%) skewY(10deg);
        }

        to {
            opacity: 1;
            transform: translateY(0) skewY(0);
        }
    }

    .animate-reveal-skew {
        animation: reveal-skew 1.2s var(--ease-out-expo) forwards;
    }

    /* Fade In Scale */
    @keyframes fade-in-scale {
        from {
            opacity: 0;
            transform: scale(0.95);
        }

        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    .animate-fade-in-scale {
        animation: fade-in-scale 0.8s var(--ease-out-quart) forwards;
    }

    /* Slide In Left with Fade */
    @keyframes slide-in-left {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }

        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .animate-slide-in-left {
        animation: slide-in-left 0.8s var(--ease-out-expo) forwards;
    }

    /* Marquee */
    @keyframes marquee {
        from {
            transform: translateX(0);
        }

        to {
            transform: translateX(-50%);
        }
    }

    .animate-marquee {
        animation: marquee 30s linear infinite;
    }

    /* Pulse Glow */
    @keyframes pulse-glow {

        0%,
        100% {
            box-shadow: 0 0 20px hsl(var(--primary) / 0.2);
        }

        50% {
            box-shadow: 0 0 40px hsl(var(--primary) / 0.4);
        }
    }

    .animate-pulse-glow {
        animation: pulse-glow 3s ease-in-out infinite;
    }

    /* Scroll Line Indicator */
    @keyframes scroll-line {
        0% {
            transform: translateY(-100%);
            opacity: 0;
        }

        50% {
            opacity: 1;
        }

        100% {
            transform: translateY(100%);
            opacity: 0;
        }
    }

    .animate-scroll-line {
        animation: scroll-line 2s ease-in-out infinite;
    }

    /* Floating Animation */
    @keyframes float {

        0%,
        100% {
            transform: translateY(0);
        }

        50% {
            transform: translateY(-20px);
        }
    }

    .animate-float {
        animation: float 6s ease-in-out infinite;
    }

    /* Rotate In */
    @keyframes rotate-in {
        from {
            opacity: 0;
            transform: rotate(-180deg) scale(0.8);
        }

        to {
            opacity: 1;
            transform: rotate(0) scale(1);
        }
    }

    .animate-rotate-in {
        animation: rotate-in 1s var(--ease-elastic) forwards;
    }

    /* Stagger Delays */
    .delay-100 {
        animation-delay: 100ms;
    }

    .delay-200 {
        animation-delay: 200ms;
    }

    .delay-300 {
        animation-delay: 300ms;
    }

    .delay-400 {
        animation-delay: 400ms;
    }

    .delay-500 {
        animation-delay: 500ms;
    }

    .delay-600 {
        animation-delay: 600ms;
    }

    .delay-700 {
        animation-delay: 700ms;
    }

    .delay-800 {
        animation-delay: 800ms;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CURSOR STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

@layer components {

    /* Custom Cursor States */
    .cursor-none {
        cursor: none !important;
    }

    .cursor-dot {
        @apply fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-[9999];
        transform: translate(-50%, -50%);
        transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease;
        mix-blend-mode: difference;
    }

    .cursor-ring {
        @apply fixed w-10 h-10 border border-primary rounded-full pointer-events-none z-[9998];
        transform: translate(-50%, -50%);
        transition: transform 0.15s ease-out, width 0.3s ease, height 0.3s ease;
        mix-blend-mode: difference;
    }

    .cursor-ring.hover {
        @apply w-16 h-16 bg-primary/10;
    }

    .cursor-ring.text {
        @apply w-1 h-6 bg-primary rounded-none;
    }

    /* Text Hover Highlight */
    .text-hover-highlight {
        position: relative;
        display: inline-block;
    }

    .text-hover-highlight::before {
        content: '';
        position: absolute;
        inset: -0.1em -0.2em;
        background: hsl(var(--primary) / 0.15);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.4s var(--ease-out-expo);
        z-index: -1;
    }

    .text-hover-highlight:hover::before {
        transform: scaleX(1);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   DECORATIVE ELEMENTS
   ═══════════════════════════════════════════════════════════════════════════ */

@layer components {

    /* Corner Brackets */
    .corner-bracket {
        position: absolute;
        width: 2rem;
        height: 2rem;
        border-color: hsl(var(--primary) / 0.3);
        transition: all 0.5s ease;
    }

    .corner-bracket-tl {
        top: -1rem;
        left: -1rem;
        border-top: 2px solid;
        border-left: 2px solid;
    }

    .corner-bracket-tr {
        top: -1rem;
        right: -1rem;
        border-top: 2px solid;
        border-right: 2px solid;
    }

    .corner-bracket-bl {
        bottom: -1rem;
        left: -1rem;
        border-bottom: 2px solid;
        border-left: 2px solid;
    }

    .corner-bracket-br {
        bottom: -1rem;
        right: -1rem;
        border-bottom: 2px solid;
        border-right: 2px solid;
    }

    /* Animated Line */
    .accent-line-animated {
        @apply h-px bg-primary;
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 1.2s var(--ease-out-expo);
    }

    .accent-line-animated.visible {
        transform: scaleX(1);
    }

    /* Gradient Orbs */
    .orb {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.5;
        pointer-events: none;
    }

    .orb-primary {
        background: radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%);
    }

    .orb-secondary {
        background: radial-gradient(circle, hsl(var(--secondary) / 0.2) 0%, transparent 70%);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LINK ANIMATIONS
   ═══════════════════════════════════════════════════════════════════════════ */

@layer components {

    /* Animated Underline */
    .link-animated {
        @apply relative inline-block;
        transition: color 0.3s ease;
    }

    .link-animated::after {
        content: "";
        @apply absolute bottom-0 left-0 w-full h-px bg-current;
        transform: scaleX(0);
        transform-origin: right;
        transition: transform 0.5s var(--ease-out-expo);
    }

    .link-animated:hover::after {
        transform: scaleX(1);
        transform-origin: left;
    }

    /* Strikethrough Reveal */
    .link-strike {
        @apply relative inline-block;
    }

    .link-strike::before,
    .link-strike::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 1px;
        background: currentColor;
        transition: transform 0.4s var(--ease-out-expo);
    }

    .link-strike::before {
        bottom: 0.1em;
        transform: scaleX(0);
        transform-origin: left;
    }

    .link-strike::after {
        bottom: 0.3em;
        transform: scaleX(0);
        transform-origin: right;
    }

    .link-strike:hover::before {
        transform: scaleX(1);
    }

    .link-strike:hover::after {
        transform: scaleX(1);
        transition-delay: 0.1s;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   SCROLLBAR & UTILITIES
   ═══════════════════════════════════════════════════════════════════════════ */

@layer utilities {

    /* Custom Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }

    ::-webkit-scrollbar-track {
        background: hsl(var(--muted));
    }

    ::-webkit-scrollbar-thumb {
        background: hsl(var(--border));
        border-radius: 4px;
        transition: background 0.3s;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: hsl(var(--primary) / 0.6);
    }

    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* Text Balance */
    .text-balance {
        text-wrap: balance;
    }

    /* Clip Path Utilities */
    .clip-inset-0 {
        clip-path: inset(0);
    }

    .clip-inset-full {
        clip-path: inset(100% 0 0 0);
    }

    /* Mask Utilities */
    .mask-bottom-fade {
        mask-image: linear-gradient(to bottom, black 80%, transparent);
    }

    .mask-top-fade {
        mask-image: linear-gradient(to top, black 80%, transparent);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {

    *,
    ::before,
    ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }

    .parallax {
        transform: none !important;
    }
}

/* ═══════════════════════════════════════════════════════════════════════════
   PRINT STYLES
   ═══════════════════════════════════════════════════════════════════════════ */

@media print {
    body::before {
        display: none;
    }

    .no-print {
        display: none !important;
    }

    .card-glass {
        background: white !important;
        backdrop-filter: none !important;
    }
}