/* Approach page: the mark draws itself; five reasons arrive five different ways, each with its own drawing.
   Ported from docs/v4/proto2/js/approach.js. The markup is rendered by app/[locale]/approach/page.tsx. */
import type { Core } from "./core";
import { INK, type InkName } from "./ink";
import { $, $$, need, clamp, seg, release, settle, pop } from "./util";

export function mountApproach(B: Core): () => void {
  const { RM } = B;
  const unhooks: (() => void)[] = [];
  const ills = $$(".r-ill");
  const hero = need(".a-hero");
  unhooks.push(
    B.addHook((y) => {
      const k = clamp(y / (innerHeight * 0.9) + 0.35);
      hero.style.setProperty("--am", release(seg(k, 0.3, 1)).toFixed(3));
      hero.style.setProperty("--ad", pop(seg(k, 0.9, 1.1)).toFixed(3));
    }),
  );
  ills.forEach((el) => {
    const name = el.dataset.ill as InkName | undefined;
    if (name && name in INK) el.innerHTML = INK[name]();
  });
  B.watchIll();

  const sec = need("#reasons");
  const rs = $$(".rs", sec);
  const dots = $$(".r-dots li", sec);
  const N = rs.length;
  if (!RM) {
    unhooks.push(
      B.addHook(() => {
        const r = sec.getBoundingClientRect();
        const p = clamp(-r.top / (r.height - innerHeight)) * N;
        rs.forEach((el, i) => {
          const local = p - i;
          const inK = settle(clamp((local + 0.15) / 0.3));
          const outK = settle(clamp((local - 0.85) / 0.3));
          const last = i === N - 1;
          const first = i === 0;
          const vin = first ? 1 : inK;
          const vout = last ? 0 : outK;
          el.style.setProperty("--in", vin.toFixed(3));
          el.style.setProperty("--out", vout.toFixed(3));
          el.style.setProperty("--o", Math.min(vin, 1 - vout).toFixed(3));
          el.classList.toggle("on", vin > 0.5 && vout < 0.5);
          $("svg", el)?.style.setProperty("--k", release(clamp((local + (first ? 0.3 : 0)) / 0.7)).toFixed(3));
        });
        const a = clamp(Math.floor(p), 0, N - 1);
        dots.forEach((d, i) => d.classList.toggle("on", i === a));
      }),
    );
  }
  return () => {
    unhooks.forEach((u) => u());
    ills.forEach((el) => {
      el.innerHTML = "";
    });
  };
}
