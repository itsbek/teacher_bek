/* Classes and Approach live in the same notebook as the story: paper pages, page numbers,
   handwritten page headings, and the first page turning over like a cover. */
(() => {
'use strict';
const B = window.BEK, { $, $$, clamp, seg, settle, RM, root } = B, VI = root.lang === 'vi', mob = innerWidth < 700, NS = 'http://www.w3.org/2000/svg';
const main = $('main'), hero = $('.c-hero, .a-hero', main);
/* the hero becomes a cover page that turns over into the next page */
if (hero) { const cv = document.createElement('div'); cv.className = 'pin cover turns'; hero.before(cv); cv.appendChild(hero); hero.classList.add('stage');
  const next = cv.nextElementSibling; if (next) next.classList.add('under'); }
const secs = $$(':scope > section, :scope > .cover', main); secs.forEach((el, i) => { el.style.zIndex = secs.length - i + 1; el.classList.add('paper'); });
let n = 0; secs.forEach(el => { const host = el.classList.contains('cover') ? $('.stage', el) : ($('.stage', el) || el); const t = document.createElement('span'); t.className = 'pgno'; t.setAttribute('aria-hidden', 'true'); t.textContent = (VI ? 'trang ' : 'page ') + (++n); host.appendChild(t); });
/* handwritten headings, in the steady pen of a seventeen-year-old */
const HEADS = { '.dial': 'How old?', '#week': 'My timetable', '.tk': 'Free week', '.faq': 'Questions', '#reasons': 'Five reasons' };
const heads = [];
B.ready.then(() => Object.entries(HEADS).forEach(([sel, txt], i) => { const sec = $(sel); if (!sec) return; const host = $('.stage', sec) || sec, size = mob ? 22 : 32;
  const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pghead'); svg.setAttribute('aria-hidden', 'true'); host.appendChild(svg);
  const wr = window.WRITE.make(svg, txt, { font: 'cursive', size, x: 4, y: size * .92, jitter: .12, seed: 90 + i, cls: 'grown', press: 1 });
  const wd = Math.ceil(wr.width()) + 12, H = Math.ceil(size * 1.45); svg.setAttribute('viewBox', `0 0 ${wd} ${H}`); svg.style.width = wd + 'px'; svg.style.height = H + 'px';
  const u = document.createElementNS(NS, 'path'); u.setAttribute('pathLength', '1'); u.setAttribute('class', 'pg-u'); u.setAttribute('d', `M2 ${H - 5} C${wd * .3} ${H - 1} ${wd * .6} ${H - 8} ${wd - 4} ${H - 4}`); svg.appendChild(u);
  heads.push({ sec, wr, u }); if (RM) { wr.set(1); u.style.setProperty('--k', 1); } }));
const turns = $$('.turns', main);
B.hooks.push(() => { if (RM) return; const vh = innerHeight;
  for (const h of heads) { const r = h.sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue; const k = clamp((vh * .9 - r.top) / (vh * .7)); h.wr.set(seg(k, 0, .85)); h.u.style.setProperty('--k', seg(k, .82, 1).toFixed(3)); }
  for (const el of turns) { const r = el.getBoundingClientRect(), left = r.bottom - vh, to = left < vh * .55 && left > -vh ? settle(clamp(1 - left / (vh * .55))) : left <= -vh ? 1 : 0; el.style.setProperty('--to', to.toFixed(3)); el.classList.toggle('gone', to > .995); } });
})();
