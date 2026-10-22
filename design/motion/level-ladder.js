/* level-ladder.js — one card, four programmes, GSAP Flip morph, red-pen correction (REVAMP_PLAN §3.7.3). */
import { initCtl } from './ctl.js';
import { mountPen } from './pen.js';

const TB = window.TB, $ = (s) => document.querySelector(s);
const card = $('#card'), track = $('#track'), thumb = $('#thumb');
const P = [
  { chip: ['6–10 tuổi', 'Ages 6–10'], name: ['Bé 6–10 tuổi', 'Young Learners'], lesson: ['2 buổi/tuần · 90 phút + 15 phút nghỉ', '2 lessons/week · 90 min + 15 min break'], spec: 'She {have>has} a cat.' },
  { chip: ['11–17 tuổi', 'Ages 11–17'], name: ['Thiếu niên 11–17', 'Teens'], lesson: ['2 buổi/tuần · 90 phút + 15 phút nghỉ', '2 lessons/week · 90 min + 15 min break'], spec: 'I {am>} agree with you.' },
  { chip: ['Người lớn', 'Adults'], name: ['Luyện thi IELTS', 'IELTS Preparation'], lesson: ['2 buổi/tuần · 60 phút', '2 lessons/week · 60 min'], spec: 'Technology make{^s} life easier.' },
  { chip: ['Người lớn', 'Adults'], name: ['Tiếng Anh công sở', 'English for Work'], lesson: ['2 buổi/tuần · 90 phút + 15 phút nghỉ', '2 lessons/week · 90 min + 15 min break'], spec: 'I {am>} graduated in 2020.' },
];
const STOP = [['6–10', '6–10'], ['11–17', '11–17'], ['IELTS', 'IELTS'], ['Công sở', 'Work']];
const T = {
  q: ['Bé nhà mình mấy tuổi?', 'How old is your learner?'], sample: ['Một lỗi thầy thường sửa', 'A mistake I often fix'], cta: ['Giữ chỗ cho nhóm này →', 'Hold a seat in this group →'],
  f: [['Mỗi buổi', 'Lịch học', 'Số bạn trong lớp', 'Học phí'], ['Each lesson', 'Schedule', 'Class size', 'Fees']],
  sched: ['[Nhóm: ngày giờ]', '[Group: days and time]'], size: ['Tối đa 10 bạn', 'Max 10 students'], fee: ['[OWNER] ₫/tháng', '[OWNER] VND/month'],
  adult: ['Người lớn', 'Adults'], aria: ['Kéo để chọn độ tuổi', 'Drag to choose an age'],
};
let i = 0, L = 0, gsap = null, pen = null, tl = null, dragging = false, W = 0;
const pc = $('#sample');

function fill() {
  const p = P[i];
  $('#chip').textContent = p.chip[L]; $('#name').textContent = p.name[L]; $('#q').textContent = T.q[L]; $('#lsample').textContent = T.sample[L]; $('#cta').textContent = T.cta[L];
  const v = [p.lesson[L], T.sched[L], T.size[L], T.fee[L]];
  $('#facts').innerHTML = v.map((x, k) => `<div><dt>${T.f[L][k]}</dt><dd>${x}</dd></div>`).join('');
  track.setAttribute('aria-valuenow', i); track.setAttribute('aria-label', T.aria[L]);
  track.setAttribute('aria-valuetext', `${p.chip[L]}, ${p.name[L]}`);
  $('#stops').querySelectorAll('button').forEach((b, k) => { b.textContent = STOP[k][L]; b.setAttribute('aria-current', k === i); });
  $('#adult').textContent = T.adult[L];
}
function mountSample(hold) {
  pen && pen.destroy(); pen = mountPen(pc, P[i].spec, { hold });
  $('#after').textContent = '→ ' + pen.text.right; $('#after').style.opacity = hold ? 0 : 1;
  pc.setAttribute('aria-label', `${pen.text.wrong} → ${pen.text.right}`);
}
const setThumb = () => { thumb.style.transform = `translateX(${(i / 3) * W}px)`; };

function go(n, { vib = true } = {}) {
  if (n === i) return; i = n; vib && TB.vibrate(10);
  const els = gsap && gsap.utils.toArray('[data-flip]');
  if (gsap) { tl && tl.kill(); Flip.killFlipsOf(els); }
  const state = gsap && Flip.getState(els);
  card.dataset.p = i; fill(); mountSample(!TB.lite);
  if (TB.lite || !gsap) { pen.final(); return; }
  const k = card.querySelectorAll('.facts, .name, .chip, .cta');
  Flip.from(state, { duration: 0.48, ease: TB.ease('in-out'), scale: false, absolute: false, onComplete: play });
  gsap.fromTo(k, { opacity: 0 }, { opacity: 1, duration: 0.22, delay: 0.16, ease: 'none', clearProps: 'opacity' });
}
function play() { if (!gsap || TB.lite) return; tl = pen.play(gsap, 0.75); gsap.to('#after', { opacity: 1, duration: 0.3, delay: 0.7, ease: TB.ease('out') }); }
const x2i = (x) => Math.max(0, Math.min(3, Math.round((x / W) * 3)));

track.addEventListener('pointerdown', (e) => {
  dragging = true; track.classList.add('drag'); track.setPointerCapture(e.pointerId); move(e);
});
track.addEventListener('pointermove', (e) => dragging && move(e));
function move(e) {
  const r = track.getBoundingClientRect(), x = Math.max(0, Math.min(W, e.clientX - r.left - 22));
  thumb.style.transform = `translateX(${x}px)`; go(x2i(x));
}
const end = () => { if (!dragging) return; dragging = false; track.classList.remove('drag'); setThumb(); };
track.addEventListener('pointerup', end); track.addEventListener('pointercancel', end);
track.addEventListener('keydown', (e) => {
  const d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
  if (e.key === 'Home') go(0); else if (e.key === 'End') go(3); else if (d) go(Math.max(0, Math.min(3, i + d))); else return;
  e.preventDefault(); setThumb();
});
$('#stops').addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) { go(+b.dataset.i); setThumb(); } });
new ResizeObserver(() => { W = track.clientWidth - 44; setThumb(); pen && !gsap && pen.final(); }).observe(track);

// build stops + detent ticks once
$('#stops').insertAdjacentHTML('beforeend', STOP.map((_, k) => `<button type="button" data-i="${k}" tabindex="-1"></button>`).join(''));
track.insertAdjacentHTML('afterbegin', [0, 1, 2, 3].map((k) => `<span class="tick" style="left:calc(22px + ${k} * (100% - 44px) / 3)"></span>`).join(''));

function render(lang) { L = lang === 'vi' ? 0 : 1; fill(); mountSample(false); pen.final(); }
function replay() { if (TB.lite || !gsap) return; mountSample(true); play(); }
initCtl({ replay, onLang: render });
if (!TB.lite) TB.idle(() => TB.gsap(['DrawSVGPlugin', 'Flip']).then((G) => { gsap = G; pen && pen.final(); }));
