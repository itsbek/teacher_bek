"use client";

import { useEffect, useRef } from "react";
import { getCore } from "@/lib/notebook/core";
import { mountStory, type StoryStrings } from "@/lib/notebook/story";

interface StoryRuntimeProps {
  strings: StoryStrings;
}

/** Runs the story scenes (lib/notebook/story.ts) over the server-rendered home page markup. */
export function StoryRuntime({ strings }: StoryRuntimeProps) {
  const ref = useRef(strings);
  useEffect(() => {
    const core = getCore();
    if (!core) return;
    return mountStory(core, ref.current);
  }, []);
  return null;
}
