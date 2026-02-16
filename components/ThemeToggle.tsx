"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    const activeTheme = resolvedTheme ?? theme;
    const handleToggle = () => {
        if (!mounted) return;
        const nextTheme = activeTheme === "dark" ? "light" : "dark";

        // Hard fallback: apply class immediately even if theme provider lags.
        const root = document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(nextTheme);
        setTheme(nextTheme);
    };

    return (
        <button
            type="button"
            onClick={handleToggle}
            className="inline-flex items-center gap-2 px-3 h-10 rounded-full border border-foreground/20 bg-background/80 text-foreground/80 hover:text-foreground hover:border-foreground/50 transition-colors relative z-[10010] pointer-events-auto"
            aria-label="Toggle Theme"
            title="Toggle light/dark theme"
        >
            <span className="type-label-tight hidden lg:inline">Theme</span>
            {activeTheme === "dark" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
    );
}
