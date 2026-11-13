/* Small shared helpers, ported from docs/v4/proto2/js/core.js. */

export const clamp = (v: number, a = 0, b = 1): number => Math.min(b, Math.max(a, v));
export const seg = (p: number, a: number, b: number): number => clamp((p - a) / (b - a));
export const release = (t: number): number => 1 - Math.pow(1 - t, 4);
export const settle = (t: number): number => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2);
export const pop = (t: number): number => {
  const c = 2.4;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

export function rng(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function $<T extends Element = HTMLElement>(s: string, el: ParentNode = document): T | null {
  return el.querySelector<T>(s) as T | null;
}

export function $$<T extends Element = HTMLElement>(s: string, el: ParentNode = document): T[] {
  return [...el.querySelectorAll<T>(s)] as T[];
}

/** Like $ but throws when the element is missing — for markup the page always renders. */
export function need<T extends Element = HTMLElement>(s: string, el: ParentNode = document): T {
  const found = el.querySelector<T>(s);
  if (!found) throw new Error(`notebook: missing ${s}`);
  return found as T;
}

/** the mark: a B whose lower bowl curls into a question mark, with the dot beneath */
export const MARK =
  "M16 66 V10 H30 C42 10 47 16 47 23 C47 31 41 36 30 36 H22 C40 36 51 42 51 51 C51 60 44 66 33 66 H16";
export const markSVG = (): string =>
  `<svg viewBox="0 0 64 84" aria-hidden="true"><path class="lm-p" pathLength="1" d="${MARK}"/><circle class="lm-d" cx="33" cy="78" r="4.4"/></svg>`;
