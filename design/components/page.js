/* teacherbek.com static designs — tiny behaviour layer (vanilla, no deps).
   Everything here is progressive: pages are complete without it (end states are in the markup).
   - language swap (VI <-> EN) + aria-label / <title> swap
   - theme toggle (light / dark / system) persisted per browser
   - menu sheet, Level Ladder slider, seat-group chips
   Query helpers for review/screenshots: ?lang=en  ?theme=dark  */
(function () {
  var root = document.documentElement;
  var q = new URLSearchParams(location.search);
  function safe(fn) { try { return fn(); } catch (e) { return null; } }

  /* ---- language ---- */
  function setLang(l) {
    root.setAttribute('lang', l);
    document.querySelectorAll('[data-aria-en]').forEach(function (el) {
      if (!el.hasAttribute('data-aria-vi')) el.setAttribute('data-aria-vi', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', l === 'en' ? el.getAttribute('data-aria-en') : el.getAttribute('data-aria-vi'));
    });
    var tt = document.querySelector('title[data-en]');
    if (tt) { if (!tt.hasAttribute('data-vi')) tt.setAttribute('data-vi', tt.textContent); tt.textContent = l === 'en' ? tt.getAttribute('data-en') : tt.getAttribute('data-vi'); }
    document.querySelectorAll('.seg button[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === l)); });
    safe(function () { localStorage.setItem('tb-lang', l); });
    if (window.__tbSeats) window.__tbSeats.refresh();
  }
  var initial = q.get('lang') || safe(function () { return localStorage.getItem('tb-lang'); }) || root.getAttribute('lang') || 'vi';
  if (initial !== 'en' && initial !== 'vi') initial = 'vi';
  setLang(initial);
  document.querySelectorAll('.seg button[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });

  /* ---- theme ---- */
  var t = q.get('theme') || safe(function () { return localStorage.getItem('tb-theme'); });
  if (t === 'dark' || t === 'light') root.setAttribute('data-theme', t);
  document.querySelectorAll('[data-theme-toggle]').forEach(function (tb) { tb.addEventListener('click', function () {
    var cur = root.getAttribute('data-theme');
    var sysDark = window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = cur ? cur === 'dark' : sysDark;
    var next = isDark ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    safe(function () { localStorage.setItem('tb-theme', next); });
  }); });

  /* ---- menu ---- */
  var menu = document.getElementById('menu');
  var opener = document.querySelector('[data-menu-open]');
  function openMenu() { if (!menu) return; menu.classList.add('is-open'); document.body.style.overflow = 'hidden'; var c = menu.querySelector('[data-menu-close]'); if (c) c.focus(); if (opener) opener.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { if (!menu) return; menu.classList.remove('is-open'); document.body.style.overflow = ''; if (opener) { opener.setAttribute('aria-expanded', 'false'); opener.focus(); } }
  if (opener) opener.addEventListener('click', openMenu);
  document.querySelectorAll('[data-menu-close]').forEach(function (b) { b.addEventListener('click', closeMenu); });
  if (menu) menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  if (q.get('menu') === '1') openMenu();

  /* ---- Level Ladder ---- */
  var range = document.getElementById('ladder-range');
  if (range) {
    var cards = document.querySelectorAll('[data-stop]');
    var stops = document.querySelectorAll('.slider__stops button');
    var rail = document.querySelectorAll('.rail li');
    var vib = function () { if (navigator.vibrate) { try { navigator.vibrate(10); } catch (e) {} } };
    var set = function (i, tick) {
      cards.forEach(function (c) { c.hidden = Number(c.getAttribute('data-stop')) !== i; });
      stops.forEach(function (b, k) { b.setAttribute('aria-current', String(k === i)); });
      rail.forEach(function (b, k) { b.setAttribute('aria-current', String(k === i)); });
      range.value = String(i);
      range.setAttribute('aria-valuetext', stops[i].getAttribute('data-vt-' + root.getAttribute('lang')) || stops[i].textContent);
      if (tick) vib();
    };
    range.addEventListener('input', function () { set(Number(range.value), true); });
    stops.forEach(function (b, k) { b.addEventListener('click', function () { set(k, true); }); });
    rail.forEach(function (b, k) { b.addEventListener('click', function () { set(k, true); }); });
    set(Number(range.value) || 0, false);
  }

  /* ---- Ten Seats: group chips ---- */
  var seatRoot = document.querySelector('[data-seats]');
  if (seatRoot) {
    var groups = JSON.parse(seatRoot.getAttribute('data-seats'));
    var cur = 0;
    var L = {
      vi: { free: function (n) { return 'Chỗ trống số ' + n + '. Chạm để giữ chỗ.'; }, taken: function (n) { return 'Chỗ số ' + n + ' đã có bạn.'; } },
      en: { free: function (n) { return 'Free seat ' + n + '. Tap to hold it.'; }, taken: function (n) { return 'Seat ' + n + ' is taken.'; } }
    };
    var refresh = function () {
      var taken = groups[cur].taken;
      var lang = root.getAttribute('lang') === 'en' ? 'en' : 'vi';
      seatRoot.querySelectorAll('.seat').forEach(function (s) {
        var n = Number(s.getAttribute('data-n'));
        var isTaken = taken.indexOf(n) > -1;
        s.classList.toggle('seat--taken', isTaken);
        s.classList.toggle('seat--free', !isTaken);
        var a = s.querySelector('a');
        if (a) {
          a.setAttribute('aria-label', isTaken ? L[lang].taken(n) : L[lang].free(n));
          if (isTaken) a.removeAttribute('href'); else a.setAttribute('href', 'form-sheet.html#step1');
          a.removeAttribute('data-aria-en');
        }
      });
      var free = 10 - taken.length;
      seatRoot.querySelectorAll('[data-free-count]').forEach(function (e) { e.textContent = String(free); });
      seatRoot.querySelectorAll('[data-group-label]').forEach(function (e) { e.hidden = e.getAttribute('data-group-label') !== String(cur); });
    };
    window.__tbSeats = { refresh: refresh };
    seatRoot.querySelectorAll('[data-group]').forEach(function (b, k) {
      b.addEventListener('click', function () {
        cur = k;
        seatRoot.querySelectorAll('[data-group]').forEach(function (x, j) { x.setAttribute('aria-pressed', String(j === k)); });
        refresh();
      });
    });
    refresh();
  }
})();
