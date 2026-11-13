/* Classes page: a ruler and pencil choose the age; the week is drawn; the ticket tears off. */
(() => {
const B = window.BEK, { $, $$, clamp, seg, release, settle, RM, tr } = B, I = window.INK, vi = document.documentElement.lang === 'vi', T = (en, v) => vi ? v : en;
/* hero underline */
B.ready.then(() => { const u = $('.u-draw'), t0 = performance.now(); (function f() { const k = release(clamp((performance.now() - t0 - 300) / 900)); u.style.setProperty('--ud', k); if (k < 1) requestAnimationFrame(f); })(); });
/* ruler + pencil */
$('#ruler').innerHTML = I.ruler(); $('#pencil').innerHTML = I.pen(); $('.ruler-nums').innerHTML = [5, 7, 9, 11, 13, 15, 17].map(n => `<span>${n}</span>`).join('');
const P = { yl: { ages: T('Ages 5–10', 'Tuổi 5–10'), name: 'Young <b>Learners</b>', text: T('Play first, speaking from the first lesson, and the reason behind every word before anyone has to remember it.', 'Chơi trước, nói ngay từ buổi đầu, và hiểu lý do của từng từ trước khi phải nhớ.'), steps: [T('A game that needs the word', 'Một trò chơi cần dùng từ đó'), T('We ask why it works', 'Cùng hỏi vì sao nó như vậy'), T('They use it to talk about themselves', 'Các bạn dùng nó để nói về chính mình')] },
  tn: { ages: T('Ages 11–17', 'Tuổi 11–17'), name: '<b>Teens</b>', text: T('Spoken English for real situations, school and exams, built on understanding why the language works the way it does.', 'Tiếng Anh nói cho tình huống thật, cho trường lớp và kỳ thi, dựa trên việc hiểu vì sao ngôn ngữ vận hành như vậy.'), steps: [T('Start from something you want to say', 'Bắt đầu từ điều bạn muốn nói'), T('Find the language for it, and why it works', 'Tìm cách nói, và hiểu vì sao'), T('Use it under a little pressure: debates, ten-second challenges', 'Dùng nó dưới chút áp lực: tranh luận, thử thách mười giây')] } };
const r = $('#age2'), n = $('#dialN'), card = $('#progCard'), pencil = $('#pencil'); let cur = '';
function set() { const v = +r.value, k = (v - 5) / 12; n.textContent = v; n.style.setProperty('--ds', (62 + 63 * k) + '%'); n.style.setProperty('--dw', Math.round(800 - 500 * k)); pencil.style.setProperty('--pp', k); r.setAttribute('aria-valuetext', v + T(' years old', ' tuổi')); $('#dialY').textContent = T('years old', 'tuổi');
  const key = v <= 10 ? 'yl' : 'tn'; if (key === cur) return; cur = key; const p = P[key];
  card.innerHTML = `<p class="t-label">${p.ages}</p><h2>${p.name}</h2><p class="t-voice">${p.text}</p><p class="t-label">${T('A lesson, in three moves', 'Một buổi học, ba bước')}</p><ol class="steps">${p.steps.map(s => `<li>${s}</li>`).join('')}</ol>`; card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
r.addEventListener('input', set); set();
const rs = $('.ruler-ill svg'); B.hooks.push(() => { const b = $('.ruler').getBoundingClientRect(); rs.style.setProperty('--k', release(clamp((innerHeight - b.top) / (innerHeight * .6))).toFixed(3)); });
/* the drawn week, in Ho Chi Minh City time */
const cal = $('#cal'), H0 = 13, H1 = 22, pct = h => (h - H0) / (H1 - H0) * 100, days = vi ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'] : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const now = (() => { const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 420) * 60000); return { day: (d.getDay() + 6) % 7, h: d.getHours() + d.getMinutes() / 60, label: d.toTimeString().slice(0, 5) }; })();
let hrs = '<div class="hrs">'; for (let h = 14; h <= 21; h++) hrs += `<span style="top:${pct(h)}%">${h}:00</span>`; cal.innerHTML = hrs + '</div>';
cal.insertAdjacentHTML('beforeend', `<div class="cal-days">${days.map((d, i) => `<span class="${i === now.day ? 'td' : ''}">${d}</span>`).join('')}</div>`);
let s = '<svg class="cal-svg" viewBox="0 0 700 100" preserveAspectRatio="none">'; s += `<rect class="today" x="${now.day * 100}" y="0" width="100" height="100"/>`;
for (let i = 0; i <= 7; i++) s += `<path class="grid" pathLength="1" d="M${i * 100} 0 L${i * 100 + (i % 2 ? 1 : -1)} 100"/>`;
for (let i = 0; i < 7; i++) { const we = i > 4, a = pct(we ? 14 : 19.5), b = pct(we ? 20 : 21); let d = ''; for (let y = a; y < b; y += 3) d += `M${i * 100 + 12} ${y.toFixed(1)} L${i * 100 + 88} ${(y + 2.4).toFixed(1)} `; s += `<path class="hatch" pathLength="1" d="${d}" style="--s:${(i * .08).toFixed(2)}"/>`; }
if (now.h >= H0 && now.h <= H1) s += `<line class="nowl" x1="${now.day * 100}" x2="${now.day * 100 + 100}" y1="${pct(now.h)}" y2="${pct(now.h)}"/>`;
cal.insertAdjacentHTML('beforeend', s + '</svg>');
const slots = [0, 1, 2, 3, 4].map(i => [i, 19.5, 21]).concat([[5, 14, 20], [6, 14, 20]]); let msg = ''; const on = slots.find(([d, a, b]) => d === now.day && now.h >= a && now.h < b);
if (on) msg = T(`<span class="live"></span>It’s ${now.label} in Phú Nhuận. <b>A class is on right now.</b>`, `<span class="live"></span>Bây giờ là ${now.label} ở Phú Nhuận. <b>Lớp đang học.</b>`);
else for (let k = 0; k < 8 && !msg; k++) { const d = (now.day + k) % 7, sl = slots.find(([dd, a]) => dd === d && (k > 0 || a > now.h)); if (sl) { const when = k === 0 ? T('today', 'hôm nay') : k === 1 ? T('tomorrow', 'ngày mai') : days[d], hh = Math.floor(sl[1]) + ':' + (sl[1] % 1 ? '30' : '00'); msg = T(`It’s ${now.label} in Phú Nhuận. The next class starts <b>${when} at ${hh}</b>.`, `Bây giờ là ${now.label} ở Phú Nhuận. Lớp tiếp theo bắt đầu <b>${when} lúc ${hh}</b>.`); } }
$('#now').innerHTML = msg;
const week = $('#week'); B.hooks.push(() => { const b = cal.getBoundingClientRect(); week.style.setProperty('--wk', settle(clamp((innerHeight - b.top) / (innerHeight * .9))).toFixed(3)); });
/* the ticket tears off */
$('#tkIll').innerHTML = I.ticket(); const tk = $('#tk'), stub = $('#stub'); let sx = 0, sy = 0, dragging = false;
const tear = () => tk.classList.add('torn');
stub.addEventListener('pointerdown', e => { if (tk.classList.contains('torn')) return; dragging = true; sx = e.clientX; sy = e.clientY; stub.setPointerCapture(e.pointerId); stub.classList.add('dragging'); });
stub.addEventListener('pointermove', e => { if (!dragging) return; const dx = e.clientX - sx, dy = Math.max(0, e.clientY - sy); stub.style.setProperty('--tx', dx * .3 + 'px'); stub.style.setProperty('--ty', dy * .6 + 'px'); stub.style.setProperty('--tr', (-dy * .12) + 'deg'); if (dy > 120) { dragging = false; stub.classList.remove('dragging'); tear(); } });
const rel = () => { if (!dragging) return; dragging = false; stub.classList.remove('dragging'); ['--tx', '--ty', '--tr'].forEach(p => stub.style.setProperty(p, p === '--tr' ? '0deg' : '0px')); };
stub.addEventListener('pointerup', rel); stub.addEventListener('pointercancel', rel); $('#tearBtn').addEventListener('click', tear);
})();
