/* answer-key-unfold.js — folded sheet unfolds (CSS 3D, 2 folds, 700 ms), pen circles the recommended plan, writes the trial line (REVAMP_PLAN §3.7.5).
   All prices are [OWNER] placeholders. Lite/reduced motion: final state at once, GSAP never requested. */
import { initCtl } from './ctl.js';
import { writeIn } from './pen.js';

const TB = window.TB, $ = (s) => document.querySelector(s);
const T = {
  vi: { eyebrow: 'Bước 3 / 3', h2: 'Giữ chỗ', lname: 'Tên của bạn', send: 'Gửi (giả lập)', fake: 'Prototype: nút gửi chỉ chạy hiệu ứng.', hint: 'Bảng học phí sẽ mở ở đây', plans: 'Học phí', key: 'Bảng học phí', foldhint: 'gấp 2 nếp', next: 'Bước tiếp theo', book: 'Đặt lịch học thử',
    prog: 'Bé 6–10 tuổi · Nhóm A', who: (n) => `Dành cho ${n}`, trial: 'Buổi học thử của bạn: [ngày]?', plan: ['Học thử một buổi', 'Theo tháng', 'Theo quý'], pr: '[OWNER] ₫' },
  en: { eyebrow: 'Step 3 of 3', h2: 'Hold a seat', lname: 'Your name', send: 'Send (fake)', fake: 'Prototype: the button only runs the animation.', hint: 'Your price sheet opens here', plans: 'Fees', key: 'Answer Key', foldhint: 'folded twice', next: 'Next step', book: 'Book your trial',
    prog: 'Young Learners 6–10 · Group A', who: (n) => `For ${n}`, trial: 'Your trial: [date]?', plan: ['One trial lesson', 'Monthly', '3 months'], pr: '[OWNER] VND' },
};
let gsap = null, tl = null, ready = false, shown = false;
const scene = $('#scene'), p1 = $('#p1'), p3 = $('#p3'), ov = $('#ov'), trial = $('#trial');

function render(lang) {
  const L = T[lang];
  document.querySelectorAll('[data-i]').forEach((e) => (e.textContent = L[e.dataset.i]));
  $('#plans').innerHTML = L.plan.map((n, i) => `<li data-rec="${i === 1}"><b>${n}</b><span>${L.pr}</span></li>`).join('');
  $('#who').textContent = L.who($('#nm').value || '…'); $('#prog').textContent = L.prog; trial.textContent = L.trial;
  if (shown) { circle(); }
}
// hand-drawn loop around the recommended plan: spiral polyline, overshoots its start by ~25deg
function circle() {
  const row = $('#plans [data-rec="true"]'), ref = $('#p2 .face').getBoundingClientRect(), r = row.getBoundingClientRect();
  const cx = r.left - ref.left + r.width / 2, cy = r.top - ref.top + r.height / 2, rx = r.width / 2 + 8, ry = r.height / 2 + 8;
  let d = '';
  for (let i = 0; i <= 80; i++) {
    const a = (-205 + 385 * (i / 80)) * Math.PI / 180, k = 0.97 + 0.07 * (i / 80);
    d += (i ? 'L' : 'M') + (cx + Math.cos(a) * rx * k).toFixed(1) + ' ' + (cy + Math.sin(a) * ry * k - 2 + i * 0.03).toFixed(1);
  }
  ov.innerHTML = `<svg><path class="pen-s" d="${d}"/></svg>`;
  return ov.querySelector('path');
}
function final() { shown = true; scene.hidden = false; $('#hint').hidden = true; render(TB.lang); }

function run() {
  shown = true; tl && tl.kill(); scene.hidden = false; $('#hint').hidden = true; render(TB.lang);
  const EP = TB.ease('pen'), EO = TB.ease('out'), EI = TB.ease('in-out'), path = circle(), shades = scene.querySelectorAll('.shade');
  gsap.set([p1, p3], { clearProps: 'all' });
  gsap.set(p1, { rotateX: -179, z: 5 }); gsap.set(p3, { rotateX: 179, z: 0.5 });   // p1 always above p3: no plane intersection gsap.set(shades, { opacity: 0.18 });
  gsap.set('#p2 .plans li, #p2 .kicker', { opacity: 1 });
  const len = path.getTotalLength(), cd = Math.min(1.1, Math.max(0.5, len / 1.2 / 1000));
  tl = gsap.timeline({ onComplete: () => gsap.set([p1, p3, scene, '#p2'], { clearProps: 'transform,perspective' }) })
    .fromTo(scene, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.3, ease: EO }, 0)
    .to(p1, { rotateX: 0, z: 0, duration: 0.45, ease: EI }, 0.45)                    // unfold 1 (top flap)  0.45 -> 0.90
    .to(p3, { rotateX: 0, z: 0, duration: 0.45, ease: EI }, 0.7)                     // unfold 2 (bottom flap) 0.70 -> 1.15 => 700 ms of unfolding
    .to(shades, { opacity: 0, duration: 0.6, ease: 'none' }, 0.45)
    .fromTo(path, { drawSVG: '0%' }, { drawSVG: '100%', duration: cd, ease: EP }, 1.25);
  writeIn(tl, trial, 1.25 + cd * 0.8, 1, EP, EO);
  tl.fromTo('#book', { opacity: 0 }, { opacity: 1, duration: 0.3, ease: EO }, 1.25 + cd * 0.8 + 0.5);
  if (!TB.rm) tl.call(() => {}, null, 0);
}
function go() {
  if (TB.lite) return final();
  if (!ready) return;
  if (innerHeight < $('#stage').getBoundingClientRect().bottom + 20) window.scrollTo({ top: scrollY + $('#stage').getBoundingClientRect().top - 150, behavior: 'smooth' });
  run();
}
$('#form').addEventListener('submit', (e) => { e.preventDefault(); go(); });
$('#nm').addEventListener('input', () => ($('#who').textContent = T[TB.lang].who($('#nm').value || '…')));
new ResizeObserver(() => { if (shown && (!tl || !tl.isActive())) circle(); }).observe($('#stage'));

initCtl({ replay: () => { if (shown) go(); }, onLang: render, replayLabel: { vi: 'Gửi lại', en: 'Re-submit' } });
if (!TB.lite) TB.idle(() => TB.gsap(['DrawSVGPlugin']).then((G) => { gsap = G; ready = true; }));
