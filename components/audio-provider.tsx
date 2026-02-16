"use client";

import React, { createContext, useContext, useRef, useState, useEffect } from 'react';

type SoundType = 'click' | 'thud' | 'reveal' | 'morph' | 'hover';

interface AudioContextType {
    isMuted: boolean;
    toggleMute: () => void;
    playSound: (type: SoundType) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const initAudioCtx = () => {
        if (!audioCtxRef.current) {
            const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioCtor) return null;
            audioCtxRef.current = new AudioCtor();
        }
        return audioCtxRef.current;
    };

    const playSound = (type: SoundType) => {
        if (isMuted) return;

        const ctx = initAudioCtx();
        if (!ctx) return;
        if (ctx.state === 'suspended') {
            void ctx.resume();
        }

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        switch (type) {
            case 'click':
                // Soft mechanical click
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.start(now);
                osc.stop(now + 0.05);
                break;

            case 'hover':
                // Subtle hover tick
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(0.02, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
                osc.start(now);
                osc.stop(now + 0.02);
                break;

            case 'thud':
                // Deep bass thud
                osc.type = 'sine';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
                break;

            case 'morph':
                // Liquid bloop
                osc.type = 'sine';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;

            case 'reveal':
                // Subtle wind
                osc.type = 'sine';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.03, now + 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
                break;
        }
    };

    const toggleMute = () => {
        setIsMuted((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('audio-muted', String(next));
            } catch {
                // Ignore storage errors
            }
            return next;
        });
    };

    useEffect(() => {
        try {
            const saved = localStorage.getItem('audio-muted');
            if (saved === 'true') {
                setIsMuted(true);
            }
        } catch {
            // Ignore storage errors
        }
    }, []);

    useEffect(() => {
        const unlockAudio = () => {
            const ctx = initAudioCtx();
            if (ctx && ctx.state === 'suspended') {
                void ctx.resume();
            }
            window.removeEventListener('pointerdown', unlockAudio);
        };

        window.addEventListener('pointerdown', unlockAudio, { passive: true });
        return () => window.removeEventListener('pointerdown', unlockAudio);
    }, []);

    return (
        <AudioContext.Provider value={{ isMuted, toggleMute, playSound }}>
            {children}
        </AudioContext.Provider>
    );
}

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
}
