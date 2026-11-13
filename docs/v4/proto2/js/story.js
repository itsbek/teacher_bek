/* Story page. Every scene owns a different behaviour; every scrubbed value reverses cleanly on the way up. */
(() => {
'use strict';
const B = window.BEK, { $, $$, clamp, seg, release, settle, pop, rng, RM, LITE, FINE, root, tr } = B, I = window.INK;
const VI = root.lang === 'vi', mob = innerWidth < 700;
const ease = settle;

/* ───────── 1 · hero: split + pull the why ───────── */
const hero = $('#hero'), hx = $$('.hx', hero), why = $('#why'), curve = $('.why-curve'); let pull = 0, pullV = 0, pulling = false, px0 = 0, wc = 0, hov = 0;
hx.forEach(h => h.style.setProperty('--d', h.dataset.dir));
if (!RM) { why.addEventListener('pointerdown', e => { pulling = true; px0 = e.clientX; why.setPointerCapture(e.pointerId); });
  why.addEventListener('pointermove', e => { if (pulling) pull = clamp((e.clientX - px0) / (innerWidth * .4), -.3, 1); });
  ['pointerup', 'pointercancel'].forEach(ev => why.addEventListener(ev, () => { if (pulling && pull > .62) openCover(); pulling = false; touched = true; })); }
let touched = false, demoN = 0;
const openCover = () => { const w = $('#wall'); if (w) B.scrollToY(w.getBoundingClientRect().top + B.sy(), 1.8); };
why.tabIndex = 0; why.setAttribute('role', 'button'); why.setAttribute('aria-label', VI ? 'Kéo chữ why để mở cuốn vở' : 'Pull why to open the notebook');
why.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); touched = true; demoPull(openCover); } });
function demoPull(done) { if (RM) { done && done(); return; } const t0 = performance.now(); pulling = true;
  (function f() { const k = clamp((performance.now() - t0) / 900); pull = Math.sin(k * Math.PI / 2) * .55; if (k < 1) requestAnimationFrame(f); else { pulling = false; done && setTimeout(done, 250); } })(); }
const demo = () => { if (touched || B.sy() > 40 || demoN >= 3) return; demoN++; demoPull(); setTimeout(demo, 5200); };

/* ───────── bridges: height chart + rolling age ───────── */
const AGES = [5, 6, 9, 11, 12, 14, 15, 17], hAt = a => 8 + (a - 5) / 12 * 84;
const bridges = $$('.bridge'); void [].map(el => { const f = +el.dataset.from, t = +el.dataset.to, ch = $('.chart', el), n = $('.br-n', el);
  for (let v = f; v <= t; v++) n.insertAdjacentHTML('beforeend', `<span>${v}</span>`); n.style.setProperty('--steps', t - f); return el; });

/* ───────── 2 · wall: the notebook ───────── */
const wall = $('#wall'), nb = $('#nb'), nbSvg = $('#nbSvg'), rowsEl = $('#nbRows'), pen = $('#nbPen'), blot = $('#blot'), hes = $('#hes');
pen.innerHTML = I.pen();
const TABLES = VI ? null : null;
const ROWS_ALL = ['I am · you are · he is · she is', 'we are · they are · it is', 'go — went — gone', 'see — saw — seen', 'take — took — taken', 'write — wrote — written', 'a / an + singular noun', 'the + specific noun', 'much + uncountable', 'many + countable', 'few · a few · little · a little', 'since + point in time', 'for + period of time', 'have + past participle', 'will · shall · would · should', 'in · on · at (time)', 'in · on · at (place)', 'if + past, would + verb', 'its ≠ it’s', 'their · there · they’re', 'whom · whose · which', 'make · do (!!)', 'bring — brought — brought', 'think — thought — thought', 'teach — taught — taught', 'buy — bought — bought'];
const ROWS = mob ? ROWS_ALL.filter(r => r.length <= 20).slice(0, 9) : ROWS_ALL.slice(0, 14); let nbH = 0, lh = 26;
let nbW = [];
function buildNotebook() { const w = nb.clientWidth, h = nb.clientHeight; nbH = h; const NL = mob ? 12 : 18; lh = h / NL;
  let sv = ''; for (let i = 3; i < NL; i++) sv += `<line class="rule" pathLength="1" x1="0" y1="${(i * lh).toFixed(1)}" x2="${w}" y2="${(i * lh).toFixed(1)}"/>`;
  nbSvg.setAttribute('viewBox', `0 0 ${w} ${h}`); nbSvg.innerHTML = sv; rowsEl.innerHTML = '';
  nbW = ROWS.map((t, i) => { const o = { font: 'print', size: lh * .74, x: w * .04, y: (3 + i) * lh - lh * .16, jitter: .9, seed: 11 + i, cls: 'kid', press: 1 }; let wr = window.WRITE.make(nbSvg, t, o);
    const fit = w * .92 / (wr.width() + 1); if (fit < 1) { wr.g.remove(); wr = window.WRITE.make(nbSvg, t, { ...o, size: o.size * fit }); } return wr; }); }
const measureRows = () => {};
const wl = $$('.wall-lines li', wall);

/* the silence, in real time */
const LINES = ['My dog is…', 'ờ…', 'my dog… nó… big… big?', 'ủa, tiếng Anh nói sao ta…', 'cái con… gì á…', 'hổng biết nữa thầy ơi'];
const POOL = ['ủa…', 'ờ ờ', 'gì á…', 'cái đó đó', 'hông nhớ', 'quên mất tiêu', 'nó… nó…', 'là… là…', 'thầy ơi', 'kiểu…', 'hổng biết', 'dog… dog…', 'big… big?', 'nói sao ta', 'à…', 'ừa'];
const gr = rng(8), GH = [], placed = []; POOL.slice(0, mob ? 10 : POOL.length).forEach((w, i) => { const s = document.createElement('span'); s.textContent = w; let x, y, tries = 0; do { x = (mob ? 22 : 8) + gr() * (mob ? 56 : 84); y = 24 + gr() * 60; tries++; } while (tries < 80 && ((y > (mob ? 28 : 36) && y < (mob ? 74 : 66) && x > 8 && x < 92) || placed.some(([px, py]) => Math.abs(px - x) < (mob ? 30 : 16) && Math.abs(py - y) < 7))); if (tries >= 80) return; placed.push([x, y]);
  s.style.left = x + '%'; s.style.top = y + '%'; s.style.fontSize = (18 + gr() * 22).toFixed(0) + 'px'; s.style.setProperty('--r', ((gr() - .5) * 12).toFixed(1) + 'deg'); s.style.setProperty('--go', (.55 + gr() * .4).toFixed(2)); $('#ghosts').appendChild(s); GH.push(s); });
const hesTxt = $('#hesTxt'); let hesOn = false, T = [], gN = 0; const later = (ms, f) => T.push(setTimeout(f, ms)), set = t => hesTxt.textContent = t;
const typeOut = (s, at, sp) => { for (let i = 1; i <= s.length; i++) later(at + i * sp, () => set(s.slice(0, i))); return at + s.length * sp; };
const eraseOut = (s, at) => { for (let i = s.length - 1; i >= 0; i--) later(at + (s.length - i) * 30, () => set(s.slice(0, i))); return at + s.length * 30; };
const ghost = () => { if (gN < GH.length) GH[gN++].classList.add('on'); };
function hesStart() { if (hesOn) return; hesOn = true; hes.classList.add('ask'); let t = 800;
  LINES.forEach((w, i) => { const end = typeOut(w, t, w.length > 12 ? 68 : 105); later(end + 200, () => { ghost(); ghost(); ghost(); }); t = i === LINES.length - 1 ? end + 1300 : eraseOut(w, end + 1050) + 360; });
  later(t, () => { set(''); while (gN < GH.length) ghost(); hes.classList.add('done'); }); }
function hesReset() { if (!hesOn) return; hesOn = false; T.forEach(clearTimeout); T = []; set(''); gN = 0; GH.forEach(g => g.classList.remove('on')); hes.classList.remove('ask', 'done'); }

/* ───────── 3 · test: the bag ───────── */
$('#bagIll').innerHTML = I.backpack();
const tags = $$('.tag'), REST = [[-10, 100, -3], [12, 124, 2.5], [-12, 148, -2], [10, 172, 3], [-4, 196, -1.5]];
const A = tags.map((el, i) => ({ el, i, x: 0, y: 0, r: 0, o: 1, vx: 0, vy: 0, out: false, drag: false, fly: false, back: false, auto: false }));
let takenN = 0, autoN = 0, dropK = 0;
const applyA = a => { const s = a.el.style; s.setProperty('--x', a.x.toFixed(1) + 'px'); s.setProperty('--y', a.y.toFixed(1) + 'px'); s.setProperty('--r', a.r.toFixed(1) + 'deg'); s.setProperty('--o', a.o.toFixed(2)); };
const restOf = i => { const bh = $('#bag').offsetWidth / 200; return [REST[i][0] * bh, (REST[i][1] - 14) * bh, REST[i][2]]; };
function sagSet() { const inBag = A.filter(a => !a.out).length * dropK; $('#bag').style.setProperty('--sag', (inBag / 5).toFixed(2)); $('#taken').textContent = takenN + ' / 5'; $('#rel').classList.toggle('on', takenN >= 2); }
function takeOut(a, vx, vy) { if (a.out) return; a.out = a.fly = true; a.back = false; a.vx = vx ?? (a.x < 0 ? -14 : 14); a.vy = vy ?? -18; takenN++; sagSet(); }
function putBack(a) { if (!a.out) return; a.out = false; a.fly = a.back = true; a.o = 1; a.x = a.x < 0 ? -innerWidth * .5 : innerWidth * .5; a.y = -innerHeight * .3; takenN--; sagSet(); }
A.forEach(a => { let sx, sy0, ox, oy, h = [];
  a.el.addEventListener('pointerdown', e => { if (a.out) return; a.drag = true; a.el.setPointerCapture(e.pointerId); sx = e.clientX; sy0 = e.clientY; ox = a.x; oy = a.y; h = [[sx, sy0, performance.now()]]; });
  a.el.addEventListener('pointermove', e => { if (!a.drag) return; a.x = ox + e.clientX - sx; a.y = oy + e.clientY - sy0; a.r = (e.clientX - sx) * .05; applyA(a); h.push([e.clientX, e.clientY, performance.now()]); if (h.length > 6) h.shift(); });
  const end = () => { if (!a.drag) return; a.drag = false; const f = h[0], l = h.at(-1), dt = Math.max(16, l[2] - f[2]), vx = (l[0] - f[0]) / dt * 16, vy = (l[1] - f[1]) / dt * 16, moved = Math.hypot(a.x - ox, a.y - oy);
    if (Math.hypot(vx, vy) > 5 || moved > 90 || moved < 6) takeOut(a, moved < 6 ? undefined : vx * 1.2, moved < 6 ? undefined : vy * 1.2); else a.fly = a.back = true; };
  a.el.addEventListener('pointerup', end); a.el.addEventListener('pointercancel', end);
  a.el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); takeOut(a); } }); });
function stepTags() { A.forEach(a => { if (a.drag) return;
  if (!a.fly) { const [rx, ry, rr] = restOf(a.i), k = pop(clamp(dropK * 5 - a.i * .9, 0, 1)); a.x = rx; a.y = ry - (1 - k) * innerHeight * .7; a.r = rr; a.o = k > 0 ? 1 : 0; applyA(a); return; }
  if (a.back) { const [rx, ry, rr] = restOf(a.i); a.x += (rx - a.x) * .16; a.y += (ry - a.y) * .16; a.r += (rr - a.r) * .16; applyA(a); if (Math.hypot(rx - a.x, ry - a.y) < .6) a.fly = a.back = false; return; }
  a.vy += .9; a.x += a.vx; a.y += a.vy; a.r += a.vx * .3; a.o = Math.max(0, a.o - .03); applyA(a); }); }

/* ───────── 4 · turn: the door ───────── */
const turn = $('#turn'), knob = $('#knob'), dogsEl = $('#dogs');
const DOGN = 4; for (let i = 0; i < DOGN; i++) { const b = document.createElement('button'); b.className = 'dog'; b.dataset.cur = 'pick'; b.innerHTML = I.dog() + '<b>a dog</b>'; b.setAttribute('aria-label', 'dog');
  b.onclick = () => { dogsEl.classList.add('picked'); $$('.dog', dogsEl).forEach(d => { d.classList.remove('chosen'); $('b', d).textContent = 'a dog'; }); b.classList.add('chosen'); $('b', b).textContent = 'the dog'; $('#pick').innerHTML = tr('now it’s <b>the</b> dog. you made it specific.'); };
  dogsEl.appendChild(b); }
knob.addEventListener('click', () => { const g = geo.find(g => g.id === 'turn'); B.scrollToY(g.top + (g.h - innerHeight) * .52, 1.6); });

/* ───────── 5 · guess ───────── */
const sent = $('.sent'); (() => { const out = []; [...sent.childNodes].forEach(n => { if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) out.push(document.createTextNode(t)); else { const w = document.createElement('span'); w.className = 'wd'; w.textContent = t; out.push(w); } }); else { n.classList.add('wd'); out.push(n); } }); sent.replaceChildren(...out); })();
const sWd = $$('.wd', sent); sWd.forEach((w, i) => w.style.setProperty('--rz', ((i % 2 ? -1 : 1) * (6 + i * 3)) + 'deg'));
B.hooks.push(() => { const r = sent.getBoundingClientRect(); if (r.top > innerHeight || r.bottom < 0) return; const k = clamp((innerHeight * .95 - r.top) / (innerHeight * .45)); sWd.forEach((w, i) => w.style.setProperty('--d', pop(clamp(k * (sWd.length + 2) / 2 - i * .5)).toFixed(3))); });

const RESP = { goed: '<b class="no">Not quite, and a smart mistake.</b> You used the rule for regular verbs. English just forgot to be regular here.', wented: '<b class="no">Not quite, and even smarter.</b> You knew it was irregular, and added the rule anyway.', went: '<b class="ok">Yes.</b> And notice you had to pull it out of your head. That pull is the practice.' };
const gap = $('#gap'), gapW = $('#gapW'), mark = $('#mark'), resp = $('#resp');
function drawIn(svgEl, ms = 520) { const t0 = performance.now(); (function f() { const k = clamp((performance.now() - t0) / ms); svgEl.style.setProperty('--k', release(k)); if (k < 1) requestAnimationFrame(f); })(); }
function choose(btn) { const v = btn.dataset.v, ok = v === 'went'; $$('.opt').forEach(o => { o.classList.toggle('is-ok', o === btn && ok); o.classList.toggle('is-no', o === btn && !ok); });
  gapW.textContent = v; gapW.className = 'gap-w land ' + (ok ? 'ok' : 'no'); mark.innerHTML = `<span class="${ok ? 'ok' : 'no'}">${ok ? I.tick() : I.cross()}</span>`; const s = $('svg', mark); s.style.setProperty('--k', 0); drawIn(s); resp.innerHTML = tr(RESP[v]); }
const near = (x, y) => { const g = gap.getBoundingClientRect(); return x > g.left - 70 && x < g.right + 70 && y > g.top - 70 && y < g.bottom + 70; };
$$('.opt').forEach(b => { let sx = null, sy1, dr = false;
  b.addEventListener('pointerdown', e => { sx = e.clientX; sy1 = e.clientY; dr = false; b.setPointerCapture(e.pointerId); });
  b.addEventListener('pointermove', e => { if (sx == null) return; const dx = e.clientX - sx, dy = e.clientY - sy1; if (!dr && Math.hypot(dx, dy) > 6) { dr = true; b.classList.add('drag'); } if (dr) { b.style.transform = `translate(${dx}px,${dy}px) rotate(${(dx * .04).toFixed(1)}deg)`; gap.classList.toggle('hot', near(e.clientX, e.clientY)); } });
  b.addEventListener('pointerup', e => { const was = dr; sx = null; dr = false; b.classList.remove('drag'); b.style.transform = ''; gap.classList.remove('hot'); if (!was || near(e.clientX, e.clientY)) choose(b); });
  b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(b); } }); });

/* ───────── 6 · three ways ───────── */
$('#ill1').innerHTML = I.sketchbook(); $('#ill3').innerHTML = I.stopwatch();
const sk = $('#ill1 svg'), swSvg = $('#ill3 svg'), note = $('#note'); let timer = null, tOn = false, caughtT = null;
function startTimer() { if (tOn) return; tOn = true; const said = 'My room is small but it has a big window, a blue bed and too many books.'.split(' '); let n = 0;
  timer = setInterval(() => { n++; swSvg.style.setProperty('--sa', (n * 9) + 'deg'); const w = Math.min(said.length, Math.floor(n * said.length / 34)); $('#spoken').textContent = said.slice(0, w).join(' '); $('#wc').textContent = w; if (n >= 40) clearInterval(timer); }, 250); }
function stopTimer() { if (!tOn) return; tOn = false; clearInterval(timer); swSvg.style.setProperty('--sa', '0deg'); $('#spoken').textContent = ''; $('#wc').textContent = 0; }

/* ───────── 7 · two sentences, one 'have' ───────── */
const kS = $$('.k-s'); $$('.k-ill').forEach(e => e.innerHTML = I.key()); const kb = $('.kb'), kWhy = $('.k-why');

/* ───────── 8 · own words ───────── */
const wline = $('#wline'), sayP = $('#say'), ownPen = document.createElement('div'); ownPen.className = 'nb-pen own-pen'; ownPen.innerHTML = I.pen(); wline.parentElement.appendChild(ownPen); let ownW = null, ownU = [];
function buildWrite() { const box = wline.parentElement, w = box.clientWidth; wline.innerHTML = ''; const size = mob ? 40 : Math.min(92, w / 11);
  ownW = window.WRITE.make(wline, sayP.textContent.replace(/\s+/g, ' ').trim(), { font: 'cursive', size, x: 4, y: size * .95, maxW: w - 12, lh: 1.25, jitter: .15, seed: 3, cls: 'grown', press: 1 });
  const H = ownW.height + size * .4; wline.setAttribute('viewBox', `0 0 ${w} ${H}`); wline.style.height = H + 'px';
  ownU = ownW.boxes.filter(b => /^(lot\.?|I['’]ve|started)$/.test(b.w)).map(b => { const u = document.createElementNS('http://www.w3.org/2000/svg', 'path'); u.setAttribute('class', 'uline'); u.setAttribute('pathLength', '1'); u.setAttribute('d', `M${b.x0 - 4} ${b.y + size * .2} C${(b.x0 + b.x1) / 2} ${b.y + size * .3} ${(b.x0 + b.x1) / 2} ${b.y + size * .12} ${b.x1 + 6} ${b.y + size * .22}`); wline.appendChild(u); return u; }); }

/* ───────── 10 · room trace (lines over the photograph) ───────── */
const TRACE = [
  ['M130 0 L512 262 L1076 262 L1400 0', 0, .14], ['M512 262 L512 660 L1030 660 L1076 262', .08, .22], ['M40 892 L512 660 M1030 660 L1536 930', .14, .28],
  ['M602 322 L990 322 L990 652 L602 652 Z M794 322 L794 652', .22, .38],
  ['M668 596 L898 596 L938 672 L640 676 Z', .32, .46], ['M652 678 L652 862 M924 674 L924 862 M672 600 L672 760 M896 600 L896 760', .4, .52],
  ['M702 680 C700 670 836 670 838 682 L836 760 L704 760 Z M706 760 L702 900 M834 760 L842 884 M770 760 L774 860', .46, .6],
  ['M94 366 L318 392 L318 578 L96 595 Z', .52, .66], ['M422 522 L512 520 L512 686 L426 686 Z M424 578 L512 576 M424 632 L512 630', .58, .72],
  ['M36 722 L376 634 L376 800 L40 892 Z M36 722 L60 716 M120 700 L120 870 M182 682 L182 852 M240 668 L240 834 M294 654 L294 820', .62, .78],
  ['M1104 418 L1500 366 L1500 684 L1104 558 Z M1278 396 L1278 604', .7, .86],
  ['M1252 790 L1384 790 L1380 892 L1254 892 Z', .78, .92],
  ['M1074 904 C1074 884 1184 884 1184 904 C1184 924 1074 924 1074 904 Z M1218 910 C1220 892 1322 892 1324 912 C1322 930 1220 930 1218 910 Z M1200 958 C1204 938 1290 936 1292 958 C1290 980 1204 980 1200 958 Z M1356 972 C1358 952 1446 952 1448 972 C1446 994 1358 994 1356 972 Z', .86, 1]];
$('#trace').innerHTML = TRACE.map(([d, s, e]) => `<path pathLength="1" d="${d}" style="--s:${s};--e:${e}"/>`).join('');

/* ───────── geometry ───────── */
const pins = $$('.pin'); let geo = [];
function layout() { const y = B.sy(); geo = pins.map(s => { const r = s.getBoundingClientRect(); return { el: s, id: s.id, top: r.top + y, h: s.offsetHeight }; });
  buildNotebook(); measureRows(); buildWrite(); buildHeads();
  if (RM) { nbW.forEach(w => w.set(1)); ownW && ownW.set(1); ownU.forEach(u => u.style.setProperty('--k', 1)); $('#cnt').textContent = 212; } }

/* ───────── the frame ───────── */
const ageEl = $('#age'); let ageNow = 5; const ageSecs = $$('[data-age]');
const setAge = v => { if (!ageEl || v == ageNow) return; ageNow = v; ageEl.textContent = v; ageEl.classList.remove('flip'); void ageEl.offsetWidth; ageEl.classList.add('flip'); };
const ab = $('#about'), abPhoto = $('.ab-photo'), abImg = $('.ab-photo i'), abName = $('.ab-name'), room = $('#room');
B.hooks.push((y, t) => { if (RM) return; const vh = innerHeight;
  /* hero */
  const hk = clamp(y / (innerHeight * .55)); hero.style.setProperty('--split', ease(hk).toFixed(4));
  if (y < vh * 1.2) { const [mx, my, seen] = B.mouse(); if (seen && FINE) { const r = why.getBoundingClientRect(); const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2)); hov += ((d < 220 ? 1 - d / 220 : 0) - hov) * .12; }
    if (!pulling) { pullV += -pull * .15; pullV *= .8; pull += pullV; if (Math.abs(pull) < .0005) pull = 0; }
    why.style.setProperty('--pull', pull.toFixed(3)); why.style.setProperty('--o', Math.max(hov, Math.abs(pull) * 1.3, .15 + .1 * Math.sin(t / 600)).toFixed(3)); curve.style.setProperty('--pull', pull.toFixed(3)); curve.style.setProperty('--wc', wc.toFixed(3)); hero.style.setProperty('--wc', wc.toFixed(3)); }
  /* bridges */
  for (const b of bridges) { const r = b.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue; const k = settle(clamp((vh * .85 - r.top) / (r.height * .85))); b.style.setProperty('--k', k.toFixed(4)); $('.br-n', b).style.setProperty('--k', k.toFixed(4)); }
  /* pinned scenes */
  for (const g of geo) { if (y + vh < g.top - vh * .3 || y > g.top + g.h + vh * .2) continue; const p = clamp((y - g.top) / (g.h - vh)), st = g.el.style;
    if (g.id === 'wall') {
      nbSvg.style.setProperty('--rk', release(seg(p, 0, .08)).toFixed(3));
      const rp = seg(p, .05, .34) * nbW.length; let pt = null; nbW.forEach((wr, i) => { const q = wr.set(clamp(rp - i)); if (rp - i > 0 && rp - i <= 1 && q) pt = q; });
      if (!pt && rp >= nbW.length && nbW.length) pt = nbW.at(-1).set(1);
      const pxv = pt ? pt.x - 17 : 0, pyv = pt ? pt.y - 128 : 0;
      pen.style.setProperty('--px', pxv.toFixed(1) + 'px'); pen.style.setProperty('--py', pyv.toFixed(1) + 'px'); pen.style.setProperty('--po', (pt && p < .36 ? 1 : 0));
      $('#cnt').textContent = Math.round(Math.min(nbW.length, rp) / nbW.length * 212);
      wl.forEach((l, k) => l.style.setProperty('--a', release(seg(p, .05 + k * .065, .1 + k * .065)).toFixed(3)));
      const nb0 = nb.getBoundingClientRect(), s0 = g.el.querySelector('.stage').getBoundingClientRect(); st.setProperty('--bx', (nb0.left - s0.left + pxv + 14) + 'px'); st.setProperty('--by', (nb0.top - s0.top + pyv + 70) + 'px');
      const bk = seg(p, .36, .44); blot.style.setProperty('--bs', (Math.pow(bk, 1.6) * Math.hypot(innerWidth, vh) / 12).toFixed(2));
      if (bk > .6) g.el.dataset.toneNow = 'dark'; else delete g.el.dataset.toneNow;
      st.setProperty('--ho', seg(p, .43, .47).toFixed(3)); if (p > .46) hesStart(); else if (p < .41) hesReset();
    }
    if (g.id === 'test') { $('#bag').style.setProperty('--fall', (1 - pop(seg(p, 0, .1))).toFixed(3)); dropK = seg(p, .08, .26); const auto = Math.floor(seg(p, .36, .6) * 5);
      while (autoN < auto) { const a = A.find(a => !a.out); if (!a) { autoN = auto; break; } takeOut(a, (Math.random() - .5) * 24, -16); a.auto = true; autoN++; }
      while (autoN > auto) { const a = [...A].reverse().find(a => a.out && a.auto); if (!a) { autoN = auto; break; } a.auto = false; putBack(a); autoN--; } sagSet(); }
    if (g.id === 'turn') { st.setProperty('--slide', (1 - release(seg(p, 0, .1))).toFixed(3)); st.setProperty('--wr2', release(seg(p, .06, .2)).toFixed(3)); const open = settle(seg(p, .2, .36)), f = settle(seg(p, .28, .46)); st.setProperty('--open', open.toFixed(3)); st.setProperty('--f', f.toFixed(3));
      const dr = $('.door3d').getBoundingClientRect(), sr = g.el.querySelector('.stage').getBoundingClientRect();
      st.setProperty('--lx', ((dr.left + dr.width * .3 - sr.left) / sr.width * 100).toFixed(1) + '%'); st.setProperty('--ly', ((dr.top + dr.height / 2 - sr.top) / sr.height * 100).toFixed(1) + '%');
      st.setProperty('--lo', seg(p, .22, .32).toFixed(3)); st.setProperty('--lr', (seg(p, .24, .46) * 1.6).toFixed(3)); st.setProperty('--dg', seg(p, .46, .54).toFixed(3)); }
    if (g.id === 'six') { const u = seg(p, .03, .76); let h = 0; for (let k = 0; k < 3; k++) h += settle(seg(u, k / 3 + .07, (k + 1) / 3 - .05)) / 3; st.setProperty('--hx', h.toFixed(4));
      sk.style.setProperty('--k', release(seg(h, .1, .33)).toFixed(3)); const uf = settle(seg(h, .45, .64)); note.style.setProperty('--uf', uf.toFixed(3));
      if (uf > .98 && !caughtT) caughtT = setTimeout(() => note.classList.add('caught'), 900); if (uf < .9) { clearTimeout(caughtT); caughtT = null; note.classList.remove('caught'); }
      swSvg.style.setProperty('--k', release(seg(h, .76, .97)).toFixed(3)); h > .97 ? startTimer() : stopTimer(); }
    if (g.id === 'dist') { kS.forEach((c, i) => { c.style.setProperty('--a', release(seg(p, .02 + i * .1, .14 + i * .1)).toFixed(3)); c.style.setProperty('--m', release(seg(p, .3 + i * .05, .38 + i * .05)).toFixed(3)); });
      kb.style.setProperty('--arc', settle(seg(p, .22, .4)).toFixed(3)); kWhy.style.setProperty('--w', release(seg(p, .42, .52)).toFixed(3)); }
    if (g.id === 'own' && ownW) { const k = seg(p, .03, .38), pt = ownW.set(k); ownPen.style.setProperty('--px', ((pt ? pt.x : 0) - 17).toFixed(1) + 'px'); ownPen.style.setProperty('--py', ((pt ? pt.y : 0) - 128).toFixed(1) + 'px'); ownPen.style.setProperty('--po', k > 0 && k < 1 ? 1 : 0); ownU.forEach((u, n) => u.style.setProperty('--k', seg(p, .38 + n * .025, .43 + n * .025).toFixed(3))); }
  }
  stepTags();
  /* about: layered depth */
  const ar = ab.getBoundingClientRect(); if (ar.bottom > 0 && ar.top < vh) { const k = clamp((vh - ar.top) / (vh + ar.height)); abPhoto.style.setProperty('--cv', settle(seg(k, .05, .38)).toFixed(3)); abPhoto.style.setProperty('--py', ((k - .5) * -60).toFixed(1) + 'px'); abImg.style.setProperty('--pi', ((k - .5) * 40).toFixed(1) + 'px'); abName.style.setProperty('--ny', ((k - .5) * 140).toFixed(1) + 'px');
    ab.style.setProperty('--am', release(seg(k, .12, .55)).toFixed(3)); ab.style.setProperty('--ad', pop(seg(k, .5, .62)).toFixed(3)); }
  /* room: drawn, then photographed */
  const rr = room.getBoundingClientRect(); if (rr.bottom > 0 && rr.top < vh) { const k = clamp((vh - rr.top) / (vh * 1.1)); room.style.setProperty('--rt', seg(k, .1, .6).toFixed(3)); room.style.setProperty('--rp', settle(seg(k, .55, .85)).toFixed(3)); }
  /* age */
});

/* ───────── things lean toward the pointer ───────── */
if (FINE && !RM) $$('#nb, .k-s, .ab-art, .folded').forEach(el => { el.classList.add('tilt'); el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(900px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`; });
  el.addEventListener('pointerleave', () => el.style.transform = ''); });

/* ───────── PLAN 1 · one notebook: paper pages, page turns, page count ───────── */
const PAGES = ['wall', 'test', 'turn', 'wrong', 'six', 'dist', 'own', 'about', 'room'];
const secEls = [...$('main').children]; secEls.forEach((el, i) => el.style.zIndex = secEls.length - i);
PAGES.forEach((id, i) => { const el = $('#' + id); if (!el) return; el.classList.add('paper'); el.dataset.page = i + 1;
  const tag = document.createElement('span'); tag.className = 'pgno'; tag.setAttribute('aria-hidden', 'true'); tag.textContent = (VI ? 'trang ' : 'page ') + (i + 1); ($('.stage', el) || el).appendChild(tag); });
const TURNS = [['cover', 'wall'], ['wall', 'test'], ['test', 'turn'], ['turn', 'wrong'], ['wrong', 'six'], ['six', 'dist'], ['dist', 'own'], ['own', 'about']];
TURNS.forEach(([a, b]) => { $('#' + a).classList.add('turns'); $('#' + b).classList.add('under'); });
const turnEls = TURNS.map(([a]) => $('#' + a)), TW = .55;
const cap = document.createElement('p'); cap.className = 'ab-cap'; cap.textContent = VI ? 'thầy Bek, Phú Nhuận' : 'me, in Phú Nhuận'; $('.ab-art').appendChild(cap);
const chip = $('.age-chip'); if (chip) { chip.firstChild.textContent = VI ? 'Trang ' : 'Page '; $('span', chip).textContent = '/ ' + PAGES.length; }
B.hooks.push(() => { if (RM) return; const vh = innerHeight;
  for (const el of turnEls) { const r = el.getBoundingClientRect(), left = r.bottom - vh, to = left < vh * TW && left > -vh ? settle(clamp(1 - left / (vh * TW))) : left <= -vh ? 1 : 0; el.style.setProperty('--to', to.toFixed(3)); el.classList.toggle('gone', to > .995); }
  let pg = 0; PAGES.forEach((id, i) => { const r = $('#' + id).getBoundingClientRect(); if (r.top <= vh * .5) pg = i + 1; }); const pv = pg || (VI ? 'bìa' : 'cover'); if (chip) chip.classList.toggle('is-cover', !pg); if (ageEl && ageEl.textContent != pv) { ageEl.textContent = pv; ageEl.classList.remove('flip'); void ageEl.offsetWidth; ageEl.classList.add('flip'); } });


/* ───────── PLAN 1.2 · the notebook ages: page headings written in a hand that grows up ───────── */
const NS = 'http://www.w3.org/2000/svg', W8 = window.WRITE;
const HEADS = { wall: ['Unit 1 · to be', 'print', .9], test: ['My week', 'print', .6], turn: ['a / an / the', 'casual', .45], wrong: ['Past simple', 'casual', .35], six: ['My room', 'casual', .25], dist: ['Present perfect', 'cursive', .2], own: ['Free writing', 'cursive', .12] };
let heads = [];
function buildHeads() { heads.forEach(h => h.svg.remove()); heads = [];
  Object.entries(HEADS).forEach(([id, [txt, font, jit]], n) => { const sec = $('#' + id); if (!sec) return;
    const host = id === 'wall' ? $('.nb-wrap', sec) : ($('.stage', sec) || sec), size = mob ? 24 : 34;
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'pghead pg-' + id); svg.setAttribute('aria-hidden', 'true'); host.appendChild(svg);
    const wr = W8.make(svg, txt, { font, size, x: 4, y: size * .92, jitter: jit, seed: 40 + n, cls: font === 'print' ? 'kid' : 'grown', press: 1 });
    const wd = Math.ceil(wr.width()) + 12, H = Math.ceil(size * 1.45);
    svg.setAttribute('viewBox', `0 0 ${wd} ${H}`); svg.style.width = wd + 'px'; svg.style.height = H + 'px';
    const u = document.createElementNS(NS, 'path'); u.setAttribute('pathLength', '1'); u.setAttribute('class', 'pg-u ' + (font === 'print' ? 'ruler' : 'pen'));
    u.setAttribute('d', font === 'print' ? `M2 ${H - 4} L${wd - 4} ${H - 4}` : `M2 ${H - 5} C${wd * .3} ${H - 1} ${wd * .6} ${H - 8} ${wd - 4} ${H - 4}`); svg.appendChild(u);
    heads.push({ sec, svg, wr, u }); }); }
B.hooks.push(() => { const vh = innerHeight; for (const h of heads) { const r = h.sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) continue;
  const k = RM ? 1 : clamp((vh * .9 - r.top) / (vh * .7)); h.wr.set(seg(k, 0, .85)); h.u.style.setProperty('--k', seg(k, .82, 1).toFixed(3)); } });

/* ───────── PLAN 5.1 · the cover's school label fills itself in ───────── */
function writeLabel() { const ws = $$('#label svg[data-w]'); let at = 500;
  ws.forEach((svg, i) => { svg.innerHTML = ''; const size = mob ? 24 : 30, wr = W8.make(svg, svg.dataset.w, { font: 'print', size, x: 4, y: size * .9, jitter: .8, seed: 70 + i, cls: 'kid', press: 1 });
    const wd = Math.ceil(wr.width()) + 10; svg.setAttribute('viewBox', `0 0 ${wd} ${Math.ceil(size * 1.2)}`); svg.style.width = wd + 'px'; svg.style.height = Math.ceil(size * 1.2) + 'px';
    if (RM) { wr.set(1); return; } wr.set(0); const dur = 380 + svg.dataset.w.length * 120, t0 = performance.now() + at; at += dur + 160;
    (function f() { const k = clamp((performance.now() - t0) / dur); wr.set(k); if (k < 1) requestAnimationFrame(f); })(); }); }

/* ───────── PLAN 9.3 · the rule on the door appears word by word, left to right ───────── */
(() => { const rule = $('.rule'); if (!rule) return; let n = 0; const walk = el => [...el.childNodes].forEach(c => { if (c.nodeType === 3) { const out = []; c.textContent.split(/(\s+)/).forEach(t => { if (!t) return; if (/^\s+$/.test(t)) out.push(document.createTextNode(t)); else { const w = document.createElement('span'); w.className = 'rw'; w.style.setProperty('--i', n++); w.textContent = t; out.push(w); } }); c.replaceWith(...out); } else walk(c); });
  walk(rule); rule.style.setProperty('--n', n); })();

/* ───────── intro ───────── */
B.ready.then(() => { layout(); writeLabel(); setTimeout(demo, 2600); const t0 = performance.now(); (function f() { wc = release(clamp((performance.now() - t0 - 300) / 1600)); if (wc < 1) requestAnimationFrame(f); })(); });
if (RM) { wc = 1; curve.style.setProperty('--wc', 1); hes.classList.add('ask', 'done'); set(LINES.slice(0, 3).join(' ')); GH.forEach(g => g.classList.add('on')); }
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(layout, 160); });
})();
