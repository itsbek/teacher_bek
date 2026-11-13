"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCore, initCore, type CoreStrings } from "@/lib/notebook/core";
import { MARK } from "@/lib/notebook/util";

interface NotebookRuntimeProps {
  strings: CoreStrings;
}

/**
 * Starts the shared notebook runtime (lib/notebook/core.ts) once per locale layout and renders the fixed
 * pieces it drives: the cursor, the field-note card, the page-transition veil, the progress line and the
 * ink-bleed SVG filter. The core is created in a layout effect so it exists before any page's
 * useEffect asks for it with getCore().
 */
export function NotebookRuntime({ strings }: NotebookRuntimeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const routerRef = useRef(router);
  const stringsRef = useRef(strings);

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  useLayoutEffect(() => {
    const core = initCore({
      strings: stringsRef.current,
      navigate: (href) => routerRef.current.push(href),
    });
    return () => core.destroy();
  }, []);

  useEffect(() => {
    const core = getCore();
    if (!core) return;
    return core.mountPage();
  }, [pathname]);

  return (
    <>
      <div className="cur" aria-hidden="true">
        <span className="c-dot" />
        <span className="c-ring" />
        <span className="c-grip" />
        <span className="c-lens" />
      </div>
      <div className="note-card" role="dialog" hidden />
      <div className="veil" aria-hidden="true">
        <svg viewBox="0 0 64 84" aria-hidden="true">
          <path className="lm-p" pathLength={1} d={MARK} />
          <circle className="lm-d" cx="33" cy="78" r="4.4" />
        </svg>
      </div>
      <div className="prog" aria-hidden="true" />
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <filter id="inkf" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves={2} seed={4} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale={2.2} xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation=".55" result="b" />
          <feComponentTransfer in="b" result="b2">
            <feFuncA type="linear" slope={0.5} />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="b2" />
            <feMergeNode in="d" />
          </feMerge>
        </filter>
      </svg>
    </>
  );
}
