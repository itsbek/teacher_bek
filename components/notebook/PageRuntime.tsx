"use client";

import { useEffect, useRef } from "react";
import { getCore } from "@/lib/notebook/core";
import { mountApproach } from "@/lib/notebook/approach";
import { mountClasses, type ClassesStrings } from "@/lib/notebook/classes";
import { mountPaper } from "@/lib/notebook/pages";

interface ClassesRuntimeProps {
  strings: ClassesStrings;
}

/** Runs the Classes page behaviour (lib/notebook/classes.ts) and the paper-page behaviour over the server markup. */
export function ClassesRuntime({ strings }: ClassesRuntimeProps) {
  const ref = useRef(strings);
  useEffect(() => {
    const core = getCore();
    if (!core) return;
    const stopClasses = mountClasses(core, ref.current);
    const stopPaper = mountPaper(core);
    return () => {
      stopPaper();
      stopClasses();
    };
  }, []);
  return null;
}

/** Runs the Approach page behaviour (lib/notebook/approach.ts) and the paper-page behaviour over the server markup. */
export function ApproachRuntime() {
  useEffect(() => {
    const core = getCore();
    if (!core) return;
    const stopApproach = mountApproach(core);
    const stopPaper = mountPaper(core);
    return () => {
      stopPaper();
      stopApproach();
    };
  }, []);
  return null;
}
