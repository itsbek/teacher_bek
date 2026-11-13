/* Handwriting that is actually written: each letter is a set of single strokes drawn in order, and the pen
   tip can follow the exact point being drawn. Child print can wobble; older hands are steadier. */
window.WRITE = (() => {
  const NS = 'http://www.w3.org/2000/svg';
  function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  /* svg: target <svg> (user units = CSS px). text: string. opts: font ('print'|'casual'|'cursive'), size (px per em),
     x, y (baseline of first line), maxW (wrap width), lh (line height factor), jitter (0–1), seed, cls (class for paths) */
  function make(svg, text, o = {}) {
    const F = window.STROKES[o.font || 'print'], s = (o.size || 32) / 1000, r = rng(o.seed || 7), jit = o.jitter || 0;
    const g = document.createElementNS(NS, 'g'); if (o.cls) g.setAttribute('class', o.cls); svg.appendChild(g); g.style.strokeWidth = ((o.sw || (o.size || 32) * .07) / s).toFixed(1);
    const adv = ch => (F[ch] || F[' '] || [400])[0];
    text = text.replace(/[’‘]/g, "'").replace(/…/g, '...').replace(/[^\x20-\x7E·–—“”]/g, '');
    const words = text.split(' '), strokes = [], boxes = []; let cx = 0, line = 0;
    const lineH = (o.lh || 1.35) * 1000;
    words.forEach((w, wi) => {
      const ww = [...w].reduce((a, ch) => a + adv(ch), 0);
      if (o.maxW && cx > 0 && (cx + ww) * s > o.maxW) { cx = 0; line++; }
      const x0 = cx;
      [...w].forEach(ch => { const gl = F[ch]; if (gl && gl[1]) {
          const subs = gl[1].split(/(?=M)/).filter(Boolean), rot = (r() - .5) * 12 * jit, dy = (r() - .5) * 90 * jit, sc = 1 + (r() - .5) * .14 * jit;
          subs.forEach(d => { const p = document.createElementNS(NS, 'path'); p.setAttribute('d', d);
            p.setAttribute('transform', `translate(${((o.x || 0) + cx * s).toFixed(2)} ${((o.y || 0) + line * lineH * s + dy * s).toFixed(2)}) scale(${(s * sc).toFixed(5)} ${(-s * sc).toFixed(5)}) rotate(${rot.toFixed(2)} ${gl[0] / 2} 300)`);
            if (o.press) p.style.strokeWidth = ((o.sw || (o.size || 32) * .07) / s * (.78 + r() * .44)).toFixed(1);
            g.appendChild(p); strokes.push(p); }); }
        cx += adv(ch) + (r() - .5) * 60 * jit; });
      boxes.push({ w, x0: (o.x || 0) + x0 * s, x1: (o.x || 0) + cx * s, y: (o.y || 0) + line * lineH * s });
      cx += adv(' '); });
    /* lengths in screen units so every letter is written at the same pace */
    const L = strokes.map(p => { const l = p.getTotalLength(); p.style.strokeDasharray = l; p.style.strokeDashoffset = l; p.style.visibility = 'hidden'; return l; });
    const W = L.map((l, i) => l * Math.abs(strokes[i].getCTM() ? strokes[i].getCTM().a : s));
    const T = W.reduce((a, b) => a + b, 0); let last = -1;
    function set(k) { k = Math.max(0, Math.min(1, k)); let left = k * T, pen = null;
      for (let i = 0; i < strokes.length; i++) { const p = strokes[i];
        if (W[i] > 0 ? left >= W[i] : (left > 1e-6 || k >= 1)) { if (p._d !== 0) { p.style.strokeDashoffset = 0; p.style.visibility = ''; p._d = 0; } left -= W[i]; }
        else if (left > 0) { const t = left / W[i]; p.style.strokeDashoffset = (L[i] * (1 - t)).toFixed(2); p.style.visibility = ''; p._d = 1 - t; const pt = p.getPointAtLength(L[i] * t), m = p.getCTM(); pen = new DOMPoint(pt.x, pt.y).matrixTransform(m); left = 0; }
        else if (p._d !== 1) { p.style.strokeDashoffset = L[i]; p.style.visibility = 'hidden'; p._d = 1; } }
      if (!pen && k >= 1 && strokes.length) { const p = strokes.at(-1), m = p.getCTM(), pt = p.getPointAtLength(L.at(-1)); pen = new DOMPoint(pt.x, pt.y).matrixTransform(m); }
      return pen; }
    const lines = line + 1;
    return { g, set, total: T, boxes, height: lines * lineH * s, width: () => g.getBBox().width };
  }
  return { make };
})();
