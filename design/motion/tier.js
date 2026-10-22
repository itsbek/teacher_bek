/* tier.js — boot script (REVAMP_PLAN §5.1). Classic <script> in <head>, runs before first paint.
   Sets html[data-tier="full|touch|lite"] + data-rm, exposes window.TB.
   Prototype overrides: ?tier=full|touch|lite  ?rm=1 (simulate reduced motion)  ?lang=vi|en */
(function () {
  var d = document.documentElement, q = new URLSearchParams(location.search), n = navigator;
  var c = n.connection || {}, cores = n.hardwareConcurrency || 6, mem = n.deviceMemory;
  var rm = matchMedia('(prefers-reduced-motion: reduce)').matches || q.get('rm') === '1';
  var fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  var t = q.get('tier');
  if (t !== 'full' && t !== 'touch' && t !== 'lite') {
    t = (c.saveData || cores <= 4 || (mem && mem <= 2)) ? 'lite' : (!fine || cores < 6) ? 'touch' : 'full';
  }
  if (rm) t = 'lite';
  d.dataset.tier = t; d.dataset.rm = rm ? '1' : '0';
  var lang = q.get('lang') || 'vi'; d.lang = lang;

  var base = document.currentScript.src.replace(/[^/]*$/, '');
  var cache = {};
  function load(src) {
    return cache[src] || (cache[src] = new Promise(function (ok, no) {
      var s = document.createElement('script'); s.src = base + src; s.async = true;
      s.onload = ok; s.onerror = no; document.head.appendChild(s);
    }));
  }
  // cubic-bezier(x1,y1,x2,y2) -> easing fn, read from the CSS tokens so there is one source of truth
  function bez(x1, y1, x2, y2) {
    var cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
    var X = function (s) { return ((ax * s + bx) * s + cx) * s; }, Y = function (s) { return ((ay * s + by) * s + cy) * s; };
    var dX = function (s) { return (3 * ax * s + 2 * bx) * s + cx; };
    return function (x) {
      if (x <= 0) return 0; if (x >= 1) return 1;
      var s = x, i, e;
      for (i = 0; i < 8; i++) { e = X(s) - x; if (Math.abs(e) < 1e-5) return Y(s); var g = dX(s); if (Math.abs(g) < 1e-6) break; s -= e / g; }
      var lo = 0, hi = 1; s = x;
      while (lo < hi && hi - lo > 1e-5) { e = X(s); if (Math.abs(e - x) < 1e-5) break; if (e < x) lo = s; else hi = s; s = (lo + hi) / 2; }
      return Y(s);
    };
  }
  var eases = {};
  window.TB = {
    tier: t, rm: rm, lang: lang, lite: t === 'lite', full: t === 'full',
    ease: function (name) {            // name = 'pen' | 'out' | 'in-out'
      if (eases[name]) return eases[name];
      var v = getComputedStyle(d).getPropertyValue('--ease-' + name).match(/[\d.]+/g) || [0, 0, 1, 1];
      return (eases[name] = bez(+v[0], +v[1], +v[2], +v[3]));
    },
    ms: function (name, fallback) { var v = parseFloat(getComputedStyle(d).getPropertyValue('--dur-' + name)); return isNaN(v) ? fallback : v; },
    // After first paint + idle: GSAP core + requested plugins. Never called on lite tier.
    gsap: function (plugins) {
      if (t === 'lite') return Promise.reject(new Error('lite tier: GSAP not loaded'));
      return load('vendor/gsap-3.15.0/gsap.min.js').then(function () {
        return Promise.all((plugins || []).map(function (p) { return load('vendor/gsap-3.15.0/' + p + '.min.js'); }));
      }).then(function () { (plugins || []).forEach(function (p) { window[p] && gsap.registerPlugin(window[p]); }); return window.gsap; });
    },
    lenis: function () {
      if (t !== 'full') return Promise.resolve(null);
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = base + 'vendor/lenis-1.3.27/lenis.css'; document.head.appendChild(l);
      return load('vendor/lenis-1.3.27/lenis.min.js').then(function () { return window.Lenis; });
    },
    idle: function (fn) {
      requestAnimationFrame(function () { requestAnimationFrame(function () { (window.requestIdleCallback || setTimeout)(fn, { timeout: 300 }); }); });
    },
    vibrate: function (ms) { try { if (navigator.vibrate && t !== 'lite') navigator.vibrate(ms); } catch (e) {} }
  };
})();
