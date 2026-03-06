"use client";

import React from "react";

/**
 * DarkZoneWrapper — structural grouping for §2-6.
 * Transparent: children manage their own backgrounds.
 * Dark sections (About, Journal) opt-in via `dark` class on their own element.
 */
export function DarkZoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
    </div>
  );
}
