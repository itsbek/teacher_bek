"use client";

import React from "react";

export function VanguardMarquee() {
    const text = "Small-group English lessons for speaking confidence, IELTS test preparation, and real-world communication.";
    const repeated = `${text} • ${text} • ${text} • ${text} • `;

    return (
        <div className="w-full bg-black text-white py-4 overflow-hidden border-y border-white/15">
            <div className="marquee-track flex w-max">
                <span className="type-title-sm px-4 text-white/90 whitespace-nowrap">{repeated}</span>
                <span className="type-title-sm px-4 text-white/90 whitespace-nowrap" aria-hidden="true">{repeated}</span>
            </div>
            <style jsx>{`
                .marquee-track {
                    animation: marquee-loop 26s linear infinite;
                }

                @keyframes marquee-loop {
                    from {
                        transform: translateX(0);
                    }
                    to {
                        transform: translateX(-50%);
                    }
                }
            `}</style>
        </div>
    );
}
