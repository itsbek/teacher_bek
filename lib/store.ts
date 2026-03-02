import { create } from 'zustand';

export type FontSize = 'sm' | 'md' | 'lg';

interface AppState {
    themeMode: 'default' | 'inverted';
    setThemeMode: (mode: 'default' | 'inverted') => void;
    activeSection: string | null;
    setActiveSection: (section: string | null) => void;
    fontSize: FontSize;
    setFontSize: (size: FontSize) => void;
}

export const useAppStore = create<AppState>((set) => ({
    themeMode: 'default',
    setThemeMode: (mode) => set({ themeMode: mode }),
    activeSection: null,
    setActiveSection: (section) => set({ activeSection: section }),
    fontSize: 'md',
    setFontSize: (size) => set({ fontSize: size }),
}));
