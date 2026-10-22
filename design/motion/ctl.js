/* ctl.js — prototype control bar: Replay · Tier · Reduced-motion · VI/EN. Not part of the product. */
const TB = window.TB;
const L = { vi: { replay: 'Chạy lại', tier: 'Tier', rm: 'Giảm chuyển động' }, en: { replay: 'Replay', tier: 'Tier', rm: 'Reduced motion' } };

export function initCtl({ replay, onLang, replayLabel }) {
  const bar = document.querySelector('.ctl');
  const url = (o) => { const u = new URL(location.href); for (const k in o) o[k] == null ? u.searchParams.delete(k) : u.searchParams.set(k, o[k]); return u.search; };
  const set = (lang) => {
    document.documentElement.lang = lang; TB.lang = lang;
    history.replaceState(null, '', url({ lang }));
    bar.querySelectorAll('[data-lang]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    bar.querySelector('[data-replay]').textContent = replayLabel?.[lang] || L[lang].replay;
    onLang && onLang(lang);
  };
  const tierBtn = (t) => `<button type="button" data-tier-set="${t}" aria-pressed="${TB.tier === t && !TB.rm}">${t}</button>`;
  bar.innerHTML = `<div class="ctl__row"><button type="button" class="ctl__main" data-replay></button>
    <span class="ctl__seg" role="group" aria-label="Language"><button type="button" data-lang="vi">VI</button><button type="button" data-lang="en">EN</button></span></div>
    <div class="ctl__row"><span class="ctl__seg" role="group" aria-label="Tier">${['full', 'touch', 'lite'].map(tierBtn).join('')}</span>
    <button type="button" data-rm aria-pressed="${TB.rm}">${L[TB.lang].rm}</button><output class="ctl__out">tier=${TB.tier}${TB.rm ? ' (rm)' : ''}</output></div>`;
  bar.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.hasAttribute('data-replay')) replay();
    else if (b.dataset.lang) set(b.dataset.lang);
    else if (b.dataset.tierSet) location.search = url({ tier: b.dataset.tierSet, rm: null });
    else if (b.hasAttribute('data-rm')) location.search = url({ rm: TB.rm ? null : '1', tier: null });
  });
  set(TB.lang);
}
