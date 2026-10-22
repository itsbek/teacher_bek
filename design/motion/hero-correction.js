/* hero-correction.js — "The Correction" (REVAMP_PLAN §3.7.1). Lite/reduced motion: final state, GSAP never requested. */
import { initCtl } from './ctl.js';
import { mountPen, parse } from './pen.js';
import { MISTAKES } from './mistakes.js';

const TB = window.TB, $ = (s) => document.querySelector(s);
const btn = $('#sentence'), noteEl = $('#note'), live = $('#live');
const T = {
  vi: { eyebrow: 'Lỗi hay gặp, sửa ngay trong lớp', hint: 'Chạm vào câu để xem lỗi khác', h1: 'Tiếng Anh nhóm nhỏ ở Phú Nhuận', sub: 'Mỗi buổi, bé nào cũng được nói. Thầy Bek sửa lỗi nhẹ nhàng ngay lúc bé nói.', cta: 'Giữ chỗ',
    sr: (a, b) => `Sửa lỗi: “${a}” thành “${b}”. Chạm để xem lỗi khác.`, add: 'thêm', rm: 'bỏ' },
  en: { eyebrow: 'A common mistake, fixed in class', hint: 'Tap the sentence for another mistake', h1: 'Small-group English in Phú Nhuận', sub: 'Every lesson, every child speaks. Teacher Bek corrects kindly, right as they say it.', cta: 'Hold a seat',
    sr: (a, b) => `Correction: “${a}” becomes “${b}”. Tap for another mistake.`, add: 'add', rm: 'remove' },
};
let idx = 0, cur = null, gsap = null, tl = null, ready = false;

const fix = (parts, L) => parts.filter((p) => p.k !== 't').map((p) => p.k === 'c' ? `${T[L].add} “${p.ins}”` : p.ins ? `“${p.s}” → “${p.ins}”` : `${T[L].rm} “${p.s}”`).join(', ');
function words(i) { return MISTAKES[i].spec; }
function announce(i) {
  const m = MISTAKES[i], L = TB.lang, c = cur.text;
  btn.setAttribute('aria-label', `${c.wrong} → ${c.right} ${T[L].hint}`);
  live.textContent = T[L].sr(c.wrong, c.right);
  noteEl.textContent = L === 'vi' ? m.vi : `Fix: ${fix(parse(m.spec), L)}`;
}
const showNote = (on, animate) => { noteEl.classList.toggle('on', on); noteEl.style.transition = animate ? 'opacity 300ms var(--ease-out)' : 'none'; };

function mount(stage, i) { cur && cur.destroy(); cur = mountPen(stage, words(i), { check: true }); announce(i); }

function run(i, { fade } = {}) {
  tl && tl.kill(); showNote(false, false);
  let stage = $('.stage:last-child');
  if (fade) {                                   // cross-fade: new stage over old one, both in the same grid cell
    const old = stage; stage = document.createElement('span'); stage.className = 'stage'; btn.appendChild(stage);
    mount(stage, i);
    gsap.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: TB.ease('out') });
    gsap.to(old, { opacity: 0, duration: 0.24, ease: TB.ease('in-out'), onComplete: () => old.remove() });
    tl = cur.play(gsap).delay(0.12);
  } else { mount(stage, i); tl = cur.play(gsap); }
  tl.eventCallback('onComplete', () => { cur.marks().forEach((m) => m.word && (m.word.style.clipPath = 'none')); showNote(true, true); });
}

function finalState(i) { const s = $('.stage:last-child'); mount(s, i); showNote(true, false); }

function render(lang) {
  const L = T[lang];
  document.querySelectorAll('[data-i]').forEach((e) => (e.textContent = L[e.dataset.i]));
  if (cur) announce(idx);
}
function replay() { if (TB.lite || !ready) return; run(idx); }
function next() {
  idx = (idx + 1) % MISTAKES.length;
  if (TB.lite) { finalState(idx); return; }
  if (ready) run(idx, { fade: true });
}
btn.addEventListener('click', next);

initCtl({ replay, onLang: render });
if (TB.lite) finalState(idx);
else {
  const sleep = new Promise((r) => setTimeout(r, 600));
  // GSAP is requested after first paint (double rAF), never on lite tier
  const g = new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => TB.gsap(['DrawSVGPlugin']).then(r))));
  Promise.all([Promise.race([document.fonts.ready, sleep]), g]).then(([, G]) => { gsap = G; ready = true; run(idx); });
}
