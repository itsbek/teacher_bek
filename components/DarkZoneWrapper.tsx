"use client";

import React from "react";

/**
 * DarkZoneWrapper — previously forced dark palette unconditionally.
 * Now transparent: children inherit the active theme so light/dark
 * mode applies consistently across all sections.
 */
export function DarkZoneWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative bg-background text-foreground">
      {children}
    </div>
  );
}
