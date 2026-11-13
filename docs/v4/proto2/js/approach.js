/* Approach page: the mark draws itself; five reasons arrive five different ways, each with its own drawing. */
(() => {
const B = window.BEK, { $, $$, clamp, seg, release, settle, pop, RM } = B, I = window.INK;
const hero = $('.a-hero'); B.hooks.push(y => { const k = clamp(y / (innerHeight * .9) + .35); hero.style.setProperty('--am', release(seg(k, .3, 1)).toFixed(3)); hero.style.setProperty('--ad', pop(seg(k, .9, 1.1)).toFixed(3)); });
$$('.r-ill').forEach(el => el.innerHTML = I[el.dataset.ill]());
const sec = $('#reasons'), rs = $$('.rs', sec), dots = $$('.r-dots li', sec), N = rs.length;
if (RM) return;
B.hooks.push(y => { const r = sec.getBoundingClientRect(), p = clamp(-r.top / (r.height - innerHeight)) * N;
  rs.forEach((el, i) => { const local = p - i, inK = settle(clamp((local + .15) / .3)), outK = settle(clamp((local - .85) / .3)), last = i === N - 1, first = i === 0;
    const vin = first ? 1 : inK, vout = last ? 0 : outK; el.style.setProperty('--in', vin.toFixed(3)); el.style.setProperty('--out', vout.toFixed(3));
    el.style.setProperty('--o', (Math.min(vin, 1 - vout)).toFixed(3)); el.classList.toggle('on', vin > .5 && vout < .5);
    $('svg', el).style.setProperty('--k', release(clamp((local + (first ? .3 : 0)) / .7)).toFixed(3)); });
  const a = clamp(Math.floor(p), 0, N - 1); dots.forEach((d, i) => d.classList.toggle('on', i === a)); });
})();
