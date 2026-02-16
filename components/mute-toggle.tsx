"use client";

import { useAudio } from './audio-provider';
import { Volume2, VolumeX } from 'lucide-react';

export function MuteToggle() {
    const { isMuted, toggleMute, playSound } = useAudio();

    return (
        <button
            type="button"
            onClick={() => {
                toggleMute();
                // Give audible confirmation when unmuting.
                if (isMuted) playSound('click');
            }}
            className="relative z-[10010] pointer-events-auto flex items-center justify-center w-10 h-10 rounded-full border border-foreground/10 text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors duration-300"
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5" />
            ) : (
                <Volume2 className="w-5 h-5" />
            )}
        </button>
    );
}
