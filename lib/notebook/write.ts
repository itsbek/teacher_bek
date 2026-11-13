/* Handwriting that is actually written: each letter is a set of single strokes drawn in order, and the pen
   tip can follow the exact point being drawn. Child print can wobble; older hands are steadier.
   Ported from docs/v4/proto2/js/write.js — behaviour kept identical. */
import { STROKES, type FontName } from "./strokes";
import { rng } from "./util";

const NS = "http://www.w3.org/2000/svg";

export interface WriteOptions {
  font?: FontName;
  /** px per em */
  size?: number;
  x?: number;
  /** baseline of the first line */
  y?: number;
  /** wrap width */
  maxW?: number;
  /** line height factor */
  lh?: number;
  /** 0–1 */
  jitter?: number;
  seed?: number;
  /** class for the group */
  cls?: string;
  sw?: number;
  press?: number;
}

export interface WordBox {
  w: string;
  x0: number;
  x1: number;
  y: number;
}

export interface Written {
  g: SVGGElement;
  set: (k: number) => DOMPoint | null;
  total: number;
  boxes: WordBox[];
  height: number;
  width: () => number;
}

type StrokePath = SVGPathElement & { _d?: number };

export function make(svg: SVGSVGElement, text: string, o: WriteOptions = {}): Written {
  const F = STROKES[o.font ?? "print"];
  const s = (o.size || 32) / 1000;
  const r = rng(o.seed || 7);
  const jit = o.jitter || 0;
  const g = document.createElementNS(NS, "g");
  if (o.cls) g.setAttribute("class", o.cls);
  svg.appendChild(g);
  g.style.strokeWidth = ((o.sw || (o.size || 32) * 0.07) / s).toFixed(1);
  const adv = (ch: string): number => (F[ch] ?? F[" "] ?? [400, ""])[0];
  text = text
    .replace(/[’‘]/g, "'")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E·–—“”]/g, "");
  const words = text.split(" ");
  const strokes: StrokePath[] = [];
  const boxes: WordBox[] = [];
  let cx = 0;
  let line = 0;
  const lineH = (o.lh || 1.35) * 1000;
  const ox = o.x || 0;
  const oy = o.y || 0;
  words.forEach((w) => {
    const ww = [...w].reduce((a, ch) => a + adv(ch), 0);
    if (o.maxW && cx > 0 && (cx + ww) * s > o.maxW) {
      cx = 0;
      line++;
    }
    const x0 = cx;
    [...w].forEach((ch) => {
      const gl = F[ch];
      if (gl && gl[1]) {
        const subs = gl[1].split(/(?=M)/).filter(Boolean);
        const rot = (r() - 0.5) * 12 * jit;
        const dy = (r() - 0.5) * 90 * jit;
        const sc = 1 + (r() - 0.5) * 0.14 * jit;
        subs.forEach((d) => {
          const p = document.createElementNS(NS, "path") as StrokePath;
          p.setAttribute("d", d);
          p.setAttribute(
            "transform",
            `translate(${(ox + cx * s).toFixed(2)} ${(oy + line * lineH * s + dy * s).toFixed(2)}) scale(${(s * sc).toFixed(5)} ${(-s * sc).toFixed(5)}) rotate(${rot.toFixed(2)} ${gl[0] / 2} 300)`,
          );
          if (o.press) p.style.strokeWidth = (((o.sw || (o.size || 32) * 0.07) / s) * (0.78 + r() * 0.44)).toFixed(1);
          g.appendChild(p);
          strokes.push(p);
        });
      }
      cx += adv(ch) + (r() - 0.5) * 60 * jit;
    });
    boxes.push({ w, x0: ox + x0 * s, x1: ox + cx * s, y: oy + line * lineH * s });
    cx += adv(" ");
  });
  /* lengths in screen units so every letter is written at the same pace */
  const L = strokes.map((p) => {
    const l = p.getTotalLength();
    p.style.strokeDasharray = String(l);
    p.style.strokeDashoffset = String(l);
    p.style.visibility = "hidden";
    return l;
  });
  const W = L.map((l, i) => {
    const m = strokes[i].getCTM();
    return l * Math.abs(m ? m.a : s);
  });
  const T = W.reduce((a, b) => a + b, 0);

  function set(k: number): DOMPoint | null {
    k = Math.max(0, Math.min(1, k));
    let left = k * T;
    let pen: DOMPoint | null = null;
    for (let i = 0; i < strokes.length; i++) {
      const p = strokes[i];
      if (W[i] > 0 ? left >= W[i] : left > 1e-6 || k >= 1) {
        if (p._d !== 0) {
          p.style.strokeDashoffset = "0";
          p.style.visibility = "";
          p._d = 0;
        }
        left -= W[i];
      } else if (left > 0) {
        const t = left / W[i];
        p.style.strokeDashoffset = (L[i] * (1 - t)).toFixed(2);
        p.style.visibility = "";
        p._d = 1 - t;
        const pt = p.getPointAtLength(L[i] * t);
        const m = p.getCTM();
        pen = m ? new DOMPoint(pt.x, pt.y).matrixTransform(m) : null;
        left = 0;
      } else if (p._d !== 1) {
        p.style.strokeDashoffset = String(L[i]);
        p.style.visibility = "hidden";
        p._d = 1;
      }
    }
    if (!pen && k >= 1 && strokes.length) {
      const p = strokes[strokes.length - 1];
      const m = p.getCTM();
      const pt = p.getPointAtLength(L[L.length - 1]);
      pen = m ? new DOMPoint(pt.x, pt.y).matrixTransform(m) : null;
    }
    return pen;
  }
  const lines = line + 1;
  return { g, set, total: T, boxes, height: lines * lineH * s, width: () => g.getBBox().width };
}
