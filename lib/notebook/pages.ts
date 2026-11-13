/* Classes and Approach live in the same notebook as the story: handwritten page headings, and the first page
   turning over like a cover. Ported from docs/v4/proto2/js/notebook.js. The wrapper (cover), the paper
   classes, z-indexes and page numbers are rendered by the page markup; this only animates it.
   mountPaper() returns a cleanup that removes everything it added. */
import type { Core } from "./core";
import { make as write, type Written } from "./write";
import { $, clamp, seg, settle } from "./util";

const NS = "http://www.w3.org/2000/svg";

/** handwritten headings, in the steady pen of a seventeen-year-old: selector → text (English lesson content) */
const HEADS: Record<string, string> = {
  ".dial": "How old?",
  "#week": "My timetable",
  ".tk": "Free week",
  ".faq": "Questions",
  "#reasons": "Five reasons",
};

interface Head {
  sec: HTMLElement;
  wr: Written;
  u: SVGPathElement;
}

export function mountPaper(B: Core): () => void {
  const { RM } = B;
  const mob = innerWidth < 700;
  let alive = true;
  const heads: Head[] = [];
  const created: SVGElement[] = [];
  const main = $("main");
  const turns = main ? [...main.querySelectorAll<HTMLElement>(".turns")] : [];

  void B.ready.then(() => {
    if (!alive) return;
    Object.entries(HEADS).forEach(([sel, txt], i) => {
      const sec = $(sel);
      if (!sec) return;
      const host = $(".stage", sec) ?? sec;
      const size = mob ? 22 : 32;
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "pghead");
      svg.setAttribute("aria-hidden", "true");
      host.appendChild(svg);
      created.push(svg);
      const wr = write(svg, txt, { font: "cursive", size, x: 4, y: size * 0.92, jitter: 0.12, seed: 90 + i, cls: "grown", press: 1 });
      const wd = Math.ceil(wr.width()) + 12;
      const H = Math.ceil(size * 1.45);
      svg.setAttribute("viewBox", `0 0 ${wd} ${H}`);
      svg.style.width = wd + "px";
      svg.style.height = H + "px";
      const u = document.createElementNS(NS, "path");
      u.setAttribute("pathLength", "1");
      u.setAttribute("class", "pg-u");
      u.setAttribute("d", `M2 ${H - 5} C${wd * 0.3} ${H - 1} ${wd * 0.6} ${H - 8} ${wd - 4} ${H - 4}`);
      svg.appendChild(u);
      heads.push({ sec, wr, u });
      if (RM) {
        wr.set(1);
        u.style.setProperty("--k", "1");
      }
    });
  });

  const unhook = B.addHook(() => {
    if (RM) return;
    const vh = innerHeight;
    for (const h of heads) {
      const r = h.sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const k = clamp((vh * 0.9 - r.top) / (vh * 0.7));
      h.wr.set(seg(k, 0, 0.85));
      h.u.style.setProperty("--k", seg(k, 0.82, 1).toFixed(3));
    }
    for (const el of turns) {
      const r = el.getBoundingClientRect();
      const left = r.bottom - vh;
      const to = left < vh * 0.55 && left > -vh ? settle(clamp(1 - left / (vh * 0.55))) : left <= -vh ? 1 : 0;
      el.style.setProperty("--to", to.toFixed(3));
      el.classList.toggle("gone", to > 0.995);
    }
  });

  return () => {
    alive = false;
    unhook();
    created.forEach((el) => el.parentNode?.removeChild(el));
    for (const el of turns) {
      el.style.removeProperty("--to");
      el.classList.remove("gone");
    }
  };
}
