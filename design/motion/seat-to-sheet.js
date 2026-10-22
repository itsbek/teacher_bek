/* seat-to-sheet.js — Ten Seats room (draws on scroll) + bottom sheet (REVAMP_PLAN §3.7.4, §4.3). */
import { initCtl } from './ctl.js';

const TB = window.TB, $ = (s) => document.querySelector(s);
const TAKEN = new Set([1, 2, 4, 6, 9, 10]);
const POS = (n) => [36 + 67 * ((n - 1) % 5), n <= 5 ? 150 : 250];
const T = {
  vi: { eyebrow: 'Mười chỗ ngồi', h2: 'Lớp nhỏ có chủ ý', sub: 'Mỗi nhóm chỉ tối đa 10 bạn. Đây là các nhóm đang còn chỗ.', scroll: 'Cuộn xuống ↓', grp: 'Nhóm A · [ngày giờ]', cnt: (n) => `Còn ${n}/10 chỗ`, upd: 'Cập nhật ngày [date]',
    free: (n) => `Chỗ trống số ${n}. Chạm để giữ chỗ.`, taken: (n) => `Chỗ số ${n} đã có bạn.`, note: 'Giữ chỗ chưa phải đóng tiền. Thầy giữ chỗ cho ba mẹ 48 giờ.',
    step: 'Bước 1 / 3', st: 'Giữ chỗ', lg: 'Nhóm', ls: 'Chỗ ngồi', ltel: 'Số điện thoại hoặc Zalo', next: 'Tiếp tục', msg: 'Prototype: bước 2 chưa làm.', close: 'Đóng', seat: (n) => `Số ${n}` },
  en: { eyebrow: 'Ten seats', h2: 'Small on purpose', sub: 'Every group has at most 10 students. Here is who has room.', scroll: 'Scroll ↓', grp: 'Group A · [days and time]', cnt: (n) => `${n} of 10 seats free`, upd: 'Updated [date]',
    free: (n) => `Seat ${n}, free`, taken: (n) => `Seat ${n}, taken`, note: 'Holding a seat costs nothing. I keep it for 48 hours.',
    step: 'Step 1 of 3', st: 'Hold a seat', lg: 'Group', ls: 'Seat', ltel: 'Phone or Zalo', next: 'Continue', msg: 'Prototype: step 2 not built.', close: 'Close', seat: (n) => `No. ${n}` },
};
const room = $('#room'), sheet = $('#sheet'), scrim = $('#scrim'), page = $('#page');
let gsap = null, tl = null, lenis = null, opener = null, seatN = 0;

// ---- room markup ----
const rect = (x, y, w, h) => `M${x} ${y}h${w}v${h}h${-w}z`;
let svg = `<svg viewBox="0 0 340 320" aria-hidden="true" focusable="false">
<path class="ln w" d="M20 8H8v304h324V8H72"/>
<path class="ln soft fx" d="M72 8v52A52 52 0 0 0 20 8"/>
<path class="ln fx" d="${rect(120, 14, 180, 8)}"/><path class="ln fx" d="${rect(170, 38, 80, 22)}"/>
<path class="ln soft fx" d="${rect(14, 104, 312, 16)}"/><path class="ln soft fx" d="${rect(14, 204, 312, 16)}"/>`;
let btns = '';
for (let n = 1; n <= 10; n++) {
  const [x, y] = POS(n), s = TAKEN.has(n) ? 'taken' : 'free';
  svg += `<g class="seatg" data-s="${s}" data-n="${n}"><path class="fill" d="${rect(x - 19, y - 17, 38, 34)}" style="fill:var(--color-fg)"/><path class="ln cl" d="${rect(x - 19, y - 17, 38, 34)}M${x - 19} ${y + 23}h38"/><text class="no" x="${x}" y="${y + 5}">${n}</text></g>`;
  btns += `<button type="button" class="seat" data-n="${n}" aria-haspopup="dialog" ${s === 'taken' ? 'aria-disabled="true"' : ''} style="left:${(x / 340) * 100}%;top:${(y / 320) * 100}%"></button>`;
}
room.innerHTML = svg + '</svg>' + btns;
room.querySelectorAll('.fill').forEach((f) => (f.style.opacity = f.parentNode.dataset.s === 'taken' ? 1 : 0));

function render(lang) {
  const L = T[lang];
  document.querySelectorAll('[data-i]').forEach((e) => (e.textContent = L[e.dataset.i]));
  $('#grp').textContent = L.grp; $('#cnt').textContent = L.cnt(10 - TAKEN.size); $('#upd').textContent = L.upd;
  room.querySelectorAll('.seat').forEach((b) => { const n = +b.dataset.n; b.setAttribute('aria-label', TAKEN.has(n) ? L.taken(n) : L.free(n)); });
  $('#step').textContent = L.step; $('#st').textContent = L.st; $('#lg').textContent = L.lg; $('#ls').textContent = L.ls; $('#ltel').textContent = L.ltel; $('#next').textContent = L.next;
  $('#close').setAttribute('aria-label', L.close); $('#vg').textContent = L.grp; $('#vs').textContent = seatN ? L.seat(seatN) : '';
}

// ---- draw-in (GSAP only on full/touch) ----
function build() {
  const EP = TB.ease('pen'), EO = TB.ease('out'), q = (s) => room.querySelectorAll(s), free = q('.seatg[data-s="free"]');
  tl = gsap.timeline({ paused: true, onComplete: () => gsap.set(q('.ln'), { clearProps: 'strokeDasharray,strokeDashoffset' }) })
    .fromTo(q('.w'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.9, ease: EP }, 0)
    .fromTo(q('.fx'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, stagger: 0.07, ease: EP }, 0.45)
    .fromTo(q('.cl'), { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.38, stagger: 0.05, ease: EP }, 0.75)
    .fromTo(q('.no'), { opacity: 0 }, { opacity: 1, duration: 0.25, stagger: 0.04, ease: 'none' }, 1.2)
    .fromTo(q('.seatg[data-s="taken"] .fill'), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.1, ease: EO }, 1.45)
    .fromTo(free, { scale: 1 }, { scale: 1.14, duration: 0.2, yoyo: true, repeat: 1, stagger: 0.12, ease: EO, clearProps: 'transform' }, 2.15);
  room.classList.remove('pre');
  // visibility:hidden was only a pre-paint guard; frame 0 of the timeline is the hidden state
  tl.progress(0.0001); tl.progress(0);
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.create({ trigger: room, start: 'top 80%', once: true, onEnter: () => tl.play() });
}
function replay() {
  if (TB.lite || !tl) return;
  (lenis || window).scrollTo ? (lenis ? lenis.scrollTo(room, { offset: -120, immediate: true }) : room.scrollIntoView({ block: 'center' })) : 0;
  tl.restart();
}

// ---- bottom sheet ----
const focusables = () => [...sheet.querySelectorAll('button, input, [href], [tabindex]:not([tabindex="-1"])')].filter((e) => !e.disabled);
function open(btn) {
  opener = btn; seatN = +btn.dataset.n; $('#vs').textContent = T[TB.lang].seat(seatN);
  room.querySelector(`.seatg[data-n="${seatN}"] .ln`).style.strokeWidth = 3.5;
  page.inert = true; sheet.classList.add('on'); scrim.classList.add('on'); lenis && lenis.stop();
  document.documentElement.style.overflow = 'hidden';
  $('#st').focus({ preventScroll: true });
}
function close() {
  if (!sheet.classList.contains('on')) return;
  sheet.classList.remove('on'); scrim.classList.remove('on'); sheet.style.transform = ''; sheet.style.transition = ''; scrim.style.opacity = '';
  page.inert = false; document.documentElement.style.overflow = ''; lenis && lenis.start();
  room.querySelectorAll('.seatg .ln').forEach((l) => (l.style.strokeWidth = ''));
  opener && opener.focus({ preventScroll: true }); $('#msg').textContent = '';
}
room.addEventListener('click', (e) => { const b = e.target.closest('.seat'); if (b && b.getAttribute('aria-disabled') !== 'true') open(b); });
scrim.addEventListener('click', close); $('#close').addEventListener('click', close);
$('#next').addEventListener('click', () => ($('#msg').textContent = T[TB.lang].msg));
sheet.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { e.stopPropagation(); close(); }
  else if (e.key === 'Tab') { const f = focusables(), a = document.activeElement; if (e.shiftKey && (a === f[0] || a === sheet || a === $('#st'))) { e.preventDefault(); f[f.length - 1].focus(); } else if (!e.shiftKey && a === f[f.length - 1]) { e.preventDefault(); f[0].focus(); } }
});
document.addEventListener('keydown', (e) => e.key === 'Escape' && close());

// drag-to-dismiss on the sheet header (pointer events; velocity threshold)
const head = $('#head'); let d = null;
head.addEventListener('pointerdown', (e) => { if (e.target.closest('button')) return; head.setPointerCapture(e.pointerId); d = { y0: e.clientY, h: sheet.offsetHeight, s: [[e.timeStamp, e.clientY]], dy: 0 }; sheet.style.transition = 'none'; });
head.addEventListener('pointermove', (e) => {
  if (!d) return; d.dy = Math.max(0, e.clientY - d.y0); d.s.push([e.timeStamp, e.clientY]); if (d.s.length > 5) d.s.shift();
  sheet.style.transform = `translateY(${d.dy}px)`; scrim.style.transition = 'none'; scrim.style.opacity = 0.45 * (1 - Math.min(1, d.dy / d.h));
});
const release = () => {
  if (!d) return; const [t0, y0] = d.s[0], [t1, y1] = d.s[d.s.length - 1], v = t1 > t0 ? (y1 - y0) / (t1 - t0) : 0; // px/ms
  const dismiss = d.dy > d.h * 0.35 || (v > 0.5 && d.dy > 24); d = null; scrim.style.transition = '';
  if (dismiss) close(); else { sheet.style.transition = ''; sheet.style.transform = ''; scrim.style.opacity = ''; }
};
head.addEventListener('pointerup', release); head.addEventListener('pointercancel', release);

initCtl({ replay, onLang: render });
if (!TB.lite) {
  room.classList.add('pre'); const safety = setTimeout(() => room.classList.remove('pre'), 4000);
  TB.idle(async () => {
    const [G, Len] = await Promise.all([TB.gsap(['ScrollTrigger', 'DrawSVGPlugin']), TB.lenis()]); gsap = G; clearTimeout(safety); build();
    if (Len) { lenis = new Len({ lerp: 0.1 }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
  });
} else room.classList.remove('pre');
