"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 hover:border-primary/50 transition-colors group"
            aria-label="Toggle Theme"
        >
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === "dark" ? 0 : 180,
                    opacity: theme === "dark" ? 0 : 1,
                    scale: theme === "dark" ? 0.5 : 1,
                }}
                className="absolute"
            >
                <Sun size={18} className="text-primary" />
            </motion.div>
            <motion.div
                initial={false}
                animate={{
                    rotate: theme === "dark" ? 0 : -180,
                    opacity: theme === "dark" ? 1 : 0,
                    scale: theme === "dark" ? 1 : 0.5,
                }}
                className="absolute"
            >
                <Moon size={18} className="text-primary" />
            </motion.div>
        </button>
    );
}
