/* pen.js — "red pen" correction engine shared by the hero and the Level Ladder.
   Spec syntax:  "I {very>really} like English."   strike + write above
                 "I am 8 year{^s} old."            caret insert
                 "I {am>} play football."          strike only
   Text + overlay are real DOM; overlay is absolutely positioned (never shifts layout). */
const NS = 'http://www.w3.org/2000/svg';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const mk = (tag, cls, parent, attrs) => { const e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); for (const k in attrs || {}) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };

export function parse(spec) {
  const parts = []; let last = 0;
  spec.replace(/\{([^}]*)\}/g, (m, b, i) => {
    if (i > last) parts.push({ k: 't', s: spec.slice(last, i) });
    if (b[0] === '^') parts.push({ k: 'c', ins: b.slice(1) });
    else { const [w, ins] = b.split('>'); parts.push({ k: 'x', s: w, ins: ins || '' }); }
    last = i + m.length; return m;
  });
  if (last < spec.length) parts.push({ k: 't', s: spec.slice(last) });
  return parts;
}
export const texts = (parts) => ({
  wrong: parts.map((p) => p.k === 't' || p.k === 'x' ? p.s : '').join('').replace(/\s+/g, ' ').trim(),
  right: parts.map((p) => p.k === 't' ? p.s : p.ins || '').join('').replace(/\s+/g, ' ').replace(/ ([.,?!])/g, '$1').trim(),
});

const OK_TICK = 'M4 26 L14 38 L36 8';
const OK_GOOD = 'M64 14 C57 7 44 11 44 25 C44 38 57 42 64 35 L64 27 L56 27 M76 23 C68 23 68 37 76 37 C84 37 85 23 76 23 M96 23 C88 23 88 37 96 37 C104 37 105 23 96 23 M116 23 C108 23 108 37 116 37 C124 37 125 23 116 23 M125 8 L125 39 M137 8 L136 28 M136 36 L136.5 37';

// handwriting reveal: clip-path left->right + a short opacity "ink soak" (--dur-settle).
// The italic is a STATIC font instance (no opsz/wght axes), so nothing animates font-variation-settings any more.
export function writeIn(tl, el, at, k, EP, EO) {
  tl.fromTo(el, { clipPath: 'inset(-25% 102% -25% -12%)', opacity: 0.55 }, { clipPath: 'inset(-25% -12% -25% -12%)', duration: 0.56 * k, ease: EP }, at)
    .to(el, { opacity: 1, duration: window.TB.ms('settle', 700) / 1000 * k, ease: EO }, at);
}

export function mountPen(host, spec, o = {}) {
  const parts = parse(spec), t = texts(parts), TB = window.TB;
  host.classList.add('pen'); host.textContent = '';
  const txt = document.createElement('span'); txt.className = 'pen-t'; host.appendChild(txt);
  const spans = parts.map((p) => {
    if (p.k === 't') { txt.append(p.s); return null; }
    const s = document.createElement('span'); s.className = p.k === 'x' ? 'pen-x' : 'pen-c'; if (p.k === 'x') s.textContent = p.s; txt.appendChild(s); return s;
  });
  const ov = document.createElement('span'); ov.className = 'pen-ov'; ov.setAttribute('aria-hidden', 'true'); host.appendChild(ov); if (o.hold) ov.style.visibility = 'hidden';
  let marks = [], ok = null, busy = false, tl = null, dead = false, played = false;

  function layout() {
    ov.textContent = ''; marks = []; ok = null;
    const svg = mk('svg', '', ov), H = host.getBoundingClientRect(), W = H.width;
    parts.forEach((p, i) => {
      const s = spans[i]; if (!s) return;
      const r = s.getClientRects()[0] || s.getBoundingClientRect(), fs = parseFloat(getComputedStyle(s).fontSize);
      const L = r.left - H.left, R = r.right - H.left, base = r.top - H.top + r.height * 0.81, cap = base - 0.71 * fs, mid = base - 0.3 * fs;
      const m = { fs }; let cx = (L + R) / 2, wy = cap - 0.17 * fs;
      if (p.k === 'x') {
        const w = R - L, j = (i % 3) * 0.02 * fs;
        m.strike = mk('path', 'pen-s', svg, { d: `M${L - 0.08 * fs} ${mid + 0.07 * fs + j} C${L + w * 0.3} ${mid - 0.02 * fs} ${L + w * 0.62} ${mid + 0.1 * fs} ${R + 0.1 * fs} ${mid - 0.07 * fs}` });
        if (p.ins) m.caret = mk('path', 'pen-s', svg, { d: `M${cx - 0.09 * fs} ${cap + 0.02 * fs} L${cx} ${cap - 0.14 * fs} L${cx + 0.09 * fs} ${cap + 0.02 * fs}` });
      } else {
        cx = L; wy = cap - 0.12 * fs;
        m.caret = mk('path', 'pen-s', svg, { d: `M${cx - 0.1 * fs} ${base + 0.22 * fs} L${cx} ${base - 0.02 * fs} L${cx + 0.1 * fs} ${base + 0.22 * fs}` });
      }
      if (p.ins) {
        const w = document.createElement('span'); w.className = 'pen-w'; w.textContent = p.ins; w.style.fontSize = 0.62 * fs + 'px'; ov.appendChild(w);
        const ww = w.offsetWidth; w.style.left = clamp(cx, ww / 2 + 2, W - ww / 2 - 2) + 'px'; w.style.top = wy + 'px'; m.word = w;
      }
      marks.push(m);
    });
    if (o.check) {
      ok = mk('svg', 'pen-ok', ov, { viewBox: '0 0 150 48' });
      ok.style.cssText = `left:${W - 150}px;top:${H.height - 52}px;width:150px;height:48px;overflow:visible`;
      ok.tick = mk('path', '', ok, { d: OK_TICK }); ok.good = mk('path', '', ok, { d: OK_GOOD });
    }
  }
  const final = () => { if (!busy && !dead) { layout(); if (o.hold && !played) ov.style.visibility = 'hidden'; } };
  layout();
  new ResizeObserver(final).observe(host);
  document.fonts && document.fonts.addEventListener('loadingdone', final);

  function play(gsap, k = 1) {
    layout(); ov.style.visibility = ''; played = true; busy = true; const EP = TB.ease('pen'), EO = TB.ease('out'); tl && tl.kill();
    tl = gsap.timeline({ onComplete() { busy = false; marks.forEach((m) => m.word && (m.word.style.clipPath = 'none')); } });
    let end = 0;
    marks.forEach((m, i) => {
      const t0 = i * 0.35 * k;
      let d = 0.14 * k, ws = t0 + 0.2 * k;
      if (m.strike) {
        d = clamp(m.strike.getTotalLength() / 1.2 / 1000, 0.4, 1.1) * k; ws = t0 + d * 1.1;
        tl.fromTo(m.strike, { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease: EP }, t0);
      }
      if (m.caret) tl.fromTo(m.caret, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.14 * k, ease: EP }, m.strike ? t0 + d * 0.82 : t0);
      if (m.word) {
        writeIn(tl, m.word, ws, k, EP, EO);
        end = Math.max(end, ws + 0.7 * k);
      } else end = Math.max(end, t0 + d);
    });
    if (ok) {
      const t0 = Math.max(end - 0.3 * k, 0.84 * k);
      tl.fromTo(ok.tick, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.18 * k, ease: EP }, t0)
        .fromTo(ok.good, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.26 * k, ease: EP }, t0 + 0.1 * k);
    }
    return tl;
  }
  return { text: t, marks: () => marks, final, show() { played = true; layout(); ov.style.visibility = ''; }, play, kill() { tl && tl.kill(); busy = false; }, destroy() { dead = true; tl && tl.kill(); } };
}
