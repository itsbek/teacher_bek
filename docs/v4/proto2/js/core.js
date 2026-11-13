/* Teacher Bek — shared runtime: scroll, frame loop, cursor states, magnetic controls, menu, notes,
   preloader (the mark draws itself) and page transitions (blue rises, the mark draws, the next page is uncovered). */
(() => {
'use strict';
const root = document.documentElement;
const RM = root.classList.contains('rm'), LITE = root.classList.contains('lite'), FINE = matchMedia('(pointer:fine)').matches;
const tr = s => (window.BEK_VI && window.BEK_VI[s]) || s;
const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v)), seg = (p, a, b) => clamp((p - a) / (b - a));
const release = t => 1 - Math.pow(1 - t, 4), settle = t => t < .5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2;
const pop = t => { const c = 2.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

let lenis = null; if (!RM && window.Lenis) lenis = new Lenis({ lerp: .09, wheelMultiplier: .85 });
const sy = () => lenis ? lenis.animatedScroll : scrollY;
const scrollToY = (y, d = 1.4) => lenis ? lenis.scrollTo(y, { duration: d, easing: release }) : scrollTo({ top: y, behavior: RM ? 'auto' : 'smooth' });
const hooks = []; (function loop(t) { if (lenis) lenis.raf(t); const y = sy(); for (const h of hooks) h(y, t); requestAnimationFrame(loop); })(performance.now());

/* the mark, reusable */
const MARK = 'M16 66 V10 H30 C42 10 47 16 47 23 C47 31 41 36 30 36 H22 C40 36 51 42 51 51 C51 60 44 66 33 66 H16';
const markSVG = () => `<svg viewBox="0 0 64 84" aria-hidden="true"><path class="lm-p" pathLength="1" d="${MARK}"/><circle class="lm-d" cx="33" cy="78" r="4.4"/></svg>`;
$$('[data-mark]').forEach(el => { el.insertAdjacentHTML('afterbegin', markSVG()); if (el.classList.contains('lg-b')) el.firstElementChild.setAttribute('viewBox', '12 6 42 80'); });

/* cursor with states */
const cur = $('.cur'), ring = cur && $('.c-ring', cur); let mx = -1e4, my = -1e4, cx = -200, cy = -200, magEl = null, seen = false;
addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; seen = true; if (!FINE || RM) return;
  const m = e.target.closest('.mag'); if (magEl && magEl !== m) { magEl.style.setProperty('--mx', '0px'); magEl.style.setProperty('--my', '0px'); } magEl = m;
  if (m) { const r = m.getBoundingClientRect(); m.style.setProperty('--mx', clamp((e.clientX - r.left - r.width / 2) * .3, -12, 12).toFixed(1) + 'px'); m.style.setProperty('--my', clamp((e.clientY - r.top - r.height / 2) * .4, -10, 10).toFixed(1) + 'px'); } }, { passive: true });
if (cur) {
  document.addEventListener('pointerover', e => { const t = e.target; let s = 'dot', label = '';
    if (t.closest('input,textarea,select')) s = 'none';
    else if (t.closest('[data-cur=drag],[data-drag]')) s = 'drag';
    else if (t.closest('[data-look]')) s = 'look';
    else if (t.closest('a,button,[data-cur]')) { s = 'link'; const c = t.closest('[data-cur]'); label = c ? tr(c.dataset.cur) : ''; }
    else if (t.closest('h1,h2,p,li')) s = 'text';
    cur.dataset.s = s; ring.textContent = label; });
  addEventListener('pointerdown', () => cur.classList.add('down')); addEventListener('pointerup', () => cur.classList.remove('down'));
  hooks.push(() => { if (!FINE) return; cx += (mx - cx) * .25; cy += (my - cy) * .25; cur.style.setProperty('--cx', cx.toFixed(1) + 'px'); cur.style.setProperty('--cy', cy.toFixed(1) + 'px'); });
}

/* header: tone and a frosted bar once you leave the top */
let tone = null;
hooks.push(y => { let t = 'light'; for (const s of $$('[data-tone]')) { const r = s.getBoundingClientRect(); if (r.top <= 36 && r.bottom > 36) { t = s.dataset.toneNow || s.dataset.tone; break; } }
  if (root.classList.contains('menu-open')) t = 'dark'; if (t !== tone) { tone = t; root.dataset.tone = t; }
  root.style.setProperty('--hb', y > 40 && !root.classList.contains('menu-open') ? 1 : 0); });

/* menu */
const menu = $('#menu'), mBtn = $('#menuBtn');
function setMenu(open) { root.classList.toggle('menu-open', open); mBtn.setAttribute('aria-expanded', open); $('span', mBtn).textContent = tr(open ? 'Close' : 'Menu'); menu.inert = !open;
  if (open) { lenis && lenis.stop(); setTimeout(() => $('a', menu).focus({ preventScroll: true }), 500); } else { lenis && lenis.start(); } }
if (menu) { menu.inert = true; mBtn.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
  addEventListener('keydown', e => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
  $$('a', menu).forEach(a => a.addEventListener('click', e => { const h = a.getAttribute('href'); if (h.startsWith('#')) { e.preventDefault(); setMenu(false); const t = $(h); if (t) setTimeout(() => scrollToY(t.getBoundingClientRect().top + sy(), 1.6), 400); } })); }

/* field notes */
const NOTES = {
  sweller: ['Cognitive load', 'Working memory is small. Fill it with unconnected items and there is little room left to learn.', 'John Sweller, 1988', 'Cognitive load during problem solving. Cognitive Science.'],
  edmondson: ['Psychological safety', 'In a study of work teams, the ones where people felt safe to admit mistakes learned more. I see the same thing in my students.', 'Amy Edmondson, 1999', 'Administrative Science Quarterly.'],
  craik: ['Depth of processing', 'People remember words far better when they think about what the words mean than when they attend to how they look or sound.', 'Fergus Craik & Endel Tulving, 1975', 'Journal of Experimental Psychology: General.'],
  roediger: ['Retrieval practice', 'Students who practised recalling what they had read remembered more a week later than students who read it again.', 'Henry Roediger & Jeffrey Karpicke, 2006', 'Psychological Science.'],
  wood: ['Scaffolding', 'Good tutoring adjusts the help to what this learner can almost do alone. The researchers called it scaffolding.', 'David Wood, Jerome Bruner & Gail Ross, 1976', 'Journal of Child Psychology and Psychiatry.'],
  lewis: ['A teacher’s view', 'This is a way of seeing grammar, not an experiment. I borrowed it from Michael Lewis’s book.', 'Michael Lewis, 1986', 'The English Verb. (VERIFY)'],
  ryan: ['Self-determination', 'People keep going when they feel three things: I chose this, I can do this, I belong here.', 'Richard Ryan & Edward Deci, 2000', 'American Psychologist.'] };
window.BEK_NOTES = NOTES;
const card = document.createElement('div'); card.className = 'note-card'; card.setAttribute('role', 'dialog'); card.hidden = true; document.body.appendChild(card); let cardFor = null, cardY = 0;
function openNote(b) { const n = NOTES[b.dataset.note]; if (!n) return; if (cardFor === b) return closeNote();
  card.innerHTML = `<p class="nc-k">${tr('Field note')}</p><p class="nc-t">${tr(n[0])}</p><p class="nc-b">${tr(n[1])}</p><p class="nc-c">${n[2]}<span>${n[3]}</span></p>`;
  card.hidden = false; card.classList.remove('in'); const r = b.getBoundingClientRect(), W = card.offsetWidth, h = card.offsetHeight;
  let x = clamp(r.left + r.width / 2 - W / 2, 16, innerWidth - W - 16), y = r.bottom + 12; if (y + h > innerHeight - 16) y = r.top - h - 12;
  card.style.left = x + 'px'; card.style.top = Math.max(80, y) + 'px'; requestAnimationFrame(() => card.classList.add('in')); cardFor = b; cardY = sy(); b.setAttribute('aria-expanded', 'true'); }
function closeNote() { if (!cardFor) return; card.classList.remove('in'); cardFor.setAttribute('aria-expanded', 'false'); cardFor = null; setTimeout(() => { if (!cardFor) card.hidden = true; }, 250); }
document.addEventListener('click', e => { const b = e.target.closest('.nm'); if (b) { e.stopPropagation(); openNote(b); } else if (!e.target.closest('.note-card')) closeNote(); });
addEventListener('keydown', e => { if (e.key === 'Escape') closeNote(); }); hooks.push(y => { if (cardFor && Math.abs(y - cardY) > 60) closeNote(); });

/* protected images: no menu, no drag */
document.addEventListener('contextmenu', e => { if (e.target.closest('.protect')) e.preventDefault(); });
document.addEventListener('dragstart', e => { if (e.target.closest('.protect')) e.preventDefault(); });

/* page transitions */
const veil = document.createElement('div'); veil.className = 'veil'; veil.setAttribute('aria-hidden', 'true'); veil.innerHTML = markSVG(); document.body.appendChild(veil);
if (root.classList.contains('arriving')) { requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.add('arrived'); setTimeout(() => root.classList.remove('arriving', 'arrived'), 1000); })); }
document.addEventListener('click', e => { const a = e.target.closest('a[href]'); if (!a || RM || e.metaKey || e.ctrlKey || a.target) return; const h = a.getAttribute('href');
  if (!h || h.startsWith('#') || h.startsWith('http') || h.startsWith('tel:') || h.startsWith('mailto:')) return;
  e.preventDefault(); try { sessionStorage.setItem('bek-arrive', '1'); } catch (_) {} root.classList.add('leaving'); setTimeout(() => location.href = h, 1050); });

/* preloader: once per visit */
function preload() { return new Promise(done => { const L = $('.loader'); if (!L || !root.classList.contains('loading')) return done();
  let fin = false; const finish = () => { if (fin) return; fin = true; L.classList.add('out'); try { sessionStorage.setItem('bek-loaded', '1'); } catch (_) {} setTimeout(() => { root.classList.remove('loading'); done(); }, 650); };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(ev => addEventListener(ev, finish, { once: true, passive: true })); setTimeout(finish, 2300); }); }


/* ═══ PLAN round 2: shared across pages ═══ */
const VIp = root.lang === 'vi';
/* 2 · frozen → open: every heading arrives narrow and heavy; its last phrase opens up as you read it */
const heads = $$('.t-l, .t-xl').map(h => { let o = $('.t-open', h);
  if (!o) { const tn = [...h.childNodes].reverse().find(n => n.nodeType === 3 && n.textContent.trim()); if (!tn) return null;
    const m = tn.textContent.match(/^([\s\S]*?)(\S+\s*)$/); if (!m) return null; o = document.createElement('span'); o.textContent = m[2]; tn.textContent = m[1]; tn.after(o); }
  o.classList.add('fo'); return { h, o }; }).filter(Boolean);
const reserve = () => heads.forEach(({ h }) => { h.style.minHeight = ''; h.style.setProperty('--fo', 0); const a = h.offsetHeight; h.style.setProperty('--fo', 1); const b = h.offsetHeight; h.style.minHeight = Math.max(a, b) + 'px'; });
if (!RM) { reserve(); let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(reserve, 200); });
  hooks.push(() => { const vh = innerHeight; for (const { h } of heads) { const r = h.getBoundingClientRect(); if (r.bottom < -50 || r.top > vh + 50) continue; h.style.setProperty('--fo', settle(clamp((vh * .82 - r.top) / (vh * .42))).toFixed(3)); } }); }
/* 4.2 · a thin line on the page edge shows how far through the notebook you are */
const prog = document.createElement('div'); prog.className = 'prog'; prog.setAttribute('aria-hidden', 'true'); document.body.appendChild(prog);
hooks.push(y => { const max = document.documentElement.scrollHeight - innerHeight; prog.style.setProperty('--p', max > 0 ? clamp(y / max).toFixed(4) : 0); });
/* 3.1 / 3.2 · ink that bleeds a little into the paper (generated, no images) */
document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="inkf" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".045" numOctaves="2" seed="4" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="2.2" xChannelSelector="R" yChannelSelector="G" result="d"/><feGaussianBlur in="d" stdDeviation=".55" result="b"/><feComponentTransfer in="b" result="b2"><feFuncA type="linear" slope=".5"/></feComponentTransfer><feMerge><feMergeNode in="b2"/><feMergeNode in="d"/></feMerge></filter></svg>');
/* 3.5 · drawings only wobble while they are on screen */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('live', e.isIntersecting))) : null;
const watchIll = () => io && $$('.ill:not([data-io])').forEach(el => { el.dataset.io = 1; io.observe(el); });


window.BEK = { root, RM, LITE, FINE, tr, $, $$, clamp, seg, release, settle, pop, rng, lenis, sy, scrollToY, hooks, MARK, markSVG, mouse: () => [mx, my, seen], ready: document.fonts.ready.then(preload) };
window.BEK.ready.then(() => { setTimeout(watchIll, 60); setTimeout(watchIll, 900); if (!RM) setTimeout(reserve, 120); });
})();
