"use client";

import { useAudio } from './audio-provider';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

export function MuteToggle() {
    const { isMuted, toggleMute } = useAudio();

    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMute}
            className="p-2 text-white/50 hover:text-[#ECD06F] transition-colors duration-300"
            aria-label={isMuted ? "Unmute" : "Mute"}
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5" />
            ) : (
                <Volume2 className="w-5 h-5" />
            )}
        </motion.button>
    );
}
