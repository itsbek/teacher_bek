/* "Your turn": a short chat that collects what Bek needs, then sends it.
   In the real build the payload POSTs to /api/contact (Telegram + Sheet); here it is simulated. */
(() => {
const chat = document.getElementById('chat'), box = document.getElementById('chatIn'); if (!chat) return;
const vi = document.documentElement.lang === 'vi';
const L = vi ? {
  hi: 'Chào bạn! Ai sẽ là người học?', who: ['Con của mình', 'Chính mình'],
  ageC: 'Bé bao nhiêu tuổi rồi?', ageS: 'Bạn bao nhiêu tuổi?', name: 'Mình nên gọi bạn là gì?', namePh: 'Tên của bạn',
  phone: 'Số điện thoại hoặc Zalo tốt nhất?', phonePh: 'Ví dụ 0912 345 678', note: 'Có điều gì mình nên biết không? (không bắt buộc)', notePh: 'Ví dụ: con hơi ngại nói', skip: 'Bỏ qua',
  next: 'Tiếp', consent: 'Mình đồng ý để thầy Bek dùng thông tin này để trả lời mình.', send: 'Gửi cho thầy Bek',
  done: n => `Đã nhận, ${n}. Mình sẽ nhắn bạn qua Zalo sớm thôi.`, zalo: 'Mở Zalo ngay', copy: 'Chép tin nhắn', copied: 'Đã chép ✓',
  msg: (d) => `Chào thầy Bek, mình là ${d.name}. ${d.who === 0 ? `Mình hỏi lớp cho con ${d.age} tuổi.` : `Mình ${d.age} tuổi, muốn học tiếng Anh.`}${d.note ? ' ' + d.note : ''}`,
  yrs: ' tuổi', bad: 'Số này hơi ngắn, bạn kiểm tra lại giúp mình nhé.' } : {
  hi: 'Hi! Who is going to learn?', who: ['My child', 'Me'],
  ageC: 'Lovely. How old are they?', ageS: 'Nice. How old are you?', name: 'What should I call you?', namePh: 'Your name',
  phone: 'And the best number for Zalo?', phonePh: 'e.g. 0912 345 678', note: 'Anything I should know? (optional)', notePh: 'e.g. a bit shy about speaking', skip: 'Skip',
  next: 'Next', consent: 'I agree that Bek may use these details to reply to me.', send: 'Send to Bek',
  done: n => `Got it, ${n}. I’ll message you on Zalo soon.`, zalo: 'Open Zalo now', copy: 'Copy my message', copied: 'Copied ✓',
  msg: (d) => `Hi Bek, I’m ${d.name}. ${d.who === 0 ? `I’m asking about classes for my ${d.age}-year-old.` : `I’m ${d.age} and I’d like to learn English.`}${d.note ? ' ' + d.note : ''}`,
  yrs: '', bad: 'That number looks a little short. Could you check it?' };
const d = { who: null, age: null, name: '', phone: '', note: '' };
const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const scrollIn = () => { const r = box.getBoundingClientRect(); if (r.bottom > innerHeight - 20) (window.BEK ? BEK.scrollToY(BEK.sy() + r.bottom - innerHeight + 60, .8) : scrollBy(0, r.bottom - innerHeight + 60)); };
function bubble(text, me) { const b = document.createElement('p'); b.className = 'bb ' + (me ? 'me' : 'bek'); b.innerHTML = text; chat.appendChild(b); requestAnimationFrame(() => b.classList.add('in')); return b; }
function bek(text) { return new Promise(res => { const t = bubble('<span class="typing"><i></i><i></i><i></i></span>'); setTimeout(() => { t.innerHTML = text; t.classList.add('said'); res(); scrollIn(); }, 650); }); }
function chips(opts, onPick, cls = '') { box.innerHTML = `<div class="chips ${cls}">${opts.map((o, i) => `<button type="button" class="chip-o mag" data-i="${i}" data-cur="pick">${o}</button>`).join('')}</div>`;
  box.querySelectorAll('button').forEach(b => b.onclick = () => { box.innerHTML = ''; bubble(esc(b.textContent), true); onPick(+b.dataset.i, b.textContent); }); }
function field(type, ph, onOk, opt) { box.innerHTML = `<form class="fld"><input class="inp" type="${type}" placeholder="${ph}" ${type === 'tel' ? 'inputmode="tel" autocomplete="tel"' : 'autocomplete="name"'} aria-label="${ph}" required><button class="go mag" data-cur="send">${L.next} →</button>${opt ? `<button type="button" class="skp">${L.skip}</button>` : ''}</form><p class="err" aria-live="polite"></p>`;
  const f = box.querySelector('form'), i = f.querySelector('input'); setTimeout(() => i.focus({ preventScroll: true }), 50);
  if (opt) f.querySelector('.skp').onclick = () => { box.innerHTML = ''; onOk(''); };
  f.onsubmit = e => { e.preventDefault(); const v = i.value.trim(); if (!v && !opt) return i.focus(); if (type === 'tel' && v.replace(/\D/g, '').length < 9) { box.querySelector('.err').textContent = L.bad; return; } box.innerHTML = ''; if (v) bubble(esc(v), true); onOk(v); }; }
async function run() {
  await bek(L.hi); chips(L.who, async i => { d.who = i; await bek(i === 0 ? L.ageC : L.ageS);
    const ages = []; for (let a = 5; a <= 17; a++) ages.push(a + L.yrs); chips(ages, async (k) => { d.age = k + 5;
      await bek(L.name); field('text', L.namePh, async v => { d.name = v;
        await bek(L.phone); field('tel', L.phonePh, async v => { d.phone = v;
          await bek(L.note); field('text', L.notePh, async v => { d.note = v; summary(); }, true); }); }); }, 'ages'); }); }
function summary() {
  box.innerHTML = `<div class="sum"><label class="cons"><input type="checkbox" id="cons"> <span>${L.consent}</span></label><button class="send mag" id="send" disabled data-cur="send"><span>${L.send}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12 22 3l-6 19-4-8z"/></svg></button></div>`;
  const c = box.querySelector('#cons'), s = box.querySelector('#send'); c.onchange = () => s.disabled = !c.checked; scrollIn();
  s.onclick = async () => { s.classList.add('flying'); s.disabled = true;
    /* real build: await fetch('/api/contact', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ name:d.name, phone:d.phone, message:L.msg(d), forWhom:d.who===0?'child':'self', level:String(d.age), consent:true }) }) */
    setTimeout(async () => { box.innerHTML = ''; await bek(L.done(esc(d.name)));
      box.innerHTML = `<div class="after-send"><a class="cta mag" href="https://zalo.me/84353885757" data-cur="say hi">${L.zalo}</a><button class="cta2 mag" id="cp" data-cur="copy">${L.copy}</button></div>`;
      box.querySelector('#cp').onclick = e => { navigator.clipboard && navigator.clipboard.writeText(L.msg(d)); e.target.textContent = L.copied; }; scrollIn(); }, 1100); }; }
let started = false; new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting && !started) { started = true; o.disconnect(); run(); } }), { threshold: .3 }).observe(chat.parentElement);
})();
