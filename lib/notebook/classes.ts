/* Classes page: a ruler and pencil choose the age; the week is drawn; the ticket tears off.
   Ported from docs/v4/proto2/js/classes.js. The markup is rendered by app/[locale]/classes/page.tsx. */
import type { Core } from "./core";
import { INK } from "./ink";
import { $$, need, clamp, release, settle } from "./util";

export interface ProgramText {
  ages: string;
  /** HTML (contains <b>) from our own messages */
  name: string;
  text: string;
  steps: string[];
}

export interface ClassesStrings {
  years: string;
  /** "{n} years old" */
  ageValue: string;
  threeMoves: string;
  programs: { yl: ProgramText; tn: ProgramText };
  days: string[];
  /** HTML with {time} */
  live: string;
  /** HTML with {time} {when} {at} */
  next: string;
  today: string;
  tomorrow: string;
}

const esc = (s: string): string => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);

export function mountClasses(B: Core, S: ClassesStrings): () => void {
  let alive = true;
  const ac = new AbortController();
  const signal = ac.signal;
  const unhooks: (() => void)[] = [];
  const hook = (h: (y: number, t: number) => void): void => {
    unhooks.push(B.addHook(h));
  };
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement, type: K, fn: (e: HTMLElementEventMap[K]) => void): void =>
    el.addEventListener(type, fn as EventListener, { signal });
  const filled: HTMLElement[] = [];
  const fill = (el: HTMLElement, html: string): void => {
    el.innerHTML = html;
    filled.push(el);
  };

  /* hero underline */
  const u = need(".u-draw");
  void B.ready.then(() => {
    const t0 = performance.now();
    const f = (): void => {
      if (!alive) return;
      const k = release(clamp((performance.now() - t0 - 300) / 900));
      u.style.setProperty("--ud", String(k));
      if (k < 1) requestAnimationFrame(f);
    };
    f();
  });

  /* ruler + pencil */
  fill(need("#ruler"), INK.ruler());
  fill(need("#pencil"), INK.pen());
  fill(need(".ruler-nums"), [5, 7, 9, 11, 13, 15, 17].map((n) => `<span>${n}</span>`).join(""));

  const r = need<HTMLInputElement>("#age2");
  const n = need("#dialN");
  const card = need("#progCard");
  const pencil = need("#pencil");
  let cur = "";
  const set = (): void => {
    const v = +r.value;
    const k = (v - 5) / 12;
    n.textContent = String(v);
    n.style.setProperty("--ds", 62 + 63 * k + "%");
    n.style.setProperty("--dw", String(Math.round(800 - 500 * k)));
    pencil.style.setProperty("--pp", String(k));
    r.setAttribute("aria-valuetext", S.ageValue.replace("{n}", String(v)));
    need("#dialY").textContent = S.years;
    const key = v <= 10 ? "yl" : "tn";
    if (key === cur) return;
    cur = key;
    const p = S.programs[key];
    fill(
      card,
      `<p class="t-label">${esc(p.ages)}</p><h2>${p.name}</h2><p class="t-voice">${esc(p.text)}</p><p class="t-label">${esc(S.threeMoves)}</p><ol class="steps">${p.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>`,
    );
    card.classList.remove("swap");
    void card.offsetWidth;
    card.classList.add("swap");
  };
  on(r, "input", set);
  set();
  const rs = need(".ruler-ill svg", document);
  const ruler = need(".ruler");
  hook(() => {
    const b = ruler.getBoundingClientRect();
    rs.style.setProperty("--k", release(clamp((innerHeight - b.top) / (innerHeight * 0.6))).toFixed(3));
  });

  /* the drawn week, in Ho Chi Minh City time */
  const cal = need("#cal");
  const H0 = 13;
  const H1 = 22;
  const pct = (h: number): number => ((h - H0) / (H1 - H0)) * 100;
  const days = S.days;
  const now = (() => {
    const d = new Date(Date.now() + (new Date().getTimezoneOffset() + 420) * 60000);
    return { day: (d.getDay() + 6) % 7, h: d.getHours() + d.getMinutes() / 60, label: d.toTimeString().slice(0, 5) };
  })();
  let hrs = '<div class="hrs">';
  for (let h = 14; h <= 21; h++) hrs += `<span style="top:${pct(h)}%">${h}:00</span>`;
  fill(cal, hrs + "</div>");
  cal.insertAdjacentHTML("beforeend", `<div class="cal-days">${days.map((d, i) => `<span class="${i === now.day ? "td" : ""}">${esc(d)}</span>`).join("")}</div>`);
  let s = '<svg class="cal-svg" viewBox="0 0 700 100" preserveAspectRatio="none">';
  s += `<rect class="today" x="${now.day * 100}" y="0" width="100" height="100"/>`;
  for (let i = 0; i <= 7; i++) s += `<path class="grid" pathLength="1" d="M${i * 100} 0 L${i * 100 + (i % 2 ? 1 : -1)} 100"/>`;
  for (let i = 0; i < 7; i++) {
    const we = i > 4;
    const a = pct(we ? 14 : 19.5);
    const b = pct(we ? 20 : 21);
    let d = "";
    for (let y = a; y < b; y += 3) d += `M${i * 100 + 12} ${y.toFixed(1)} L${i * 100 + 88} ${(y + 2.4).toFixed(1)} `;
    s += `<path class="hatch" pathLength="1" d="${d}" style="--s:${(i * 0.08).toFixed(2)}"/>`;
  }
  if (now.h >= H0 && now.h <= H1) s += `<line class="nowl" x1="${now.day * 100}" x2="${now.day * 100 + 100}" y1="${pct(now.h)}" y2="${pct(now.h)}"/>`;
  cal.insertAdjacentHTML("beforeend", s + "</svg>");

  const slots: [number, number, number][] = [0, 1, 2, 3, 4].map((i): [number, number, number] => [i, 19.5, 21]).concat([
    [5, 14, 20],
    [6, 14, 20],
  ]);
  let msg = "";
  const live = slots.find(([d, a, b]) => d === now.day && now.h >= a && now.h < b);
  if (live) {
    msg = `<span class="live"></span>${S.live.replace("{time}", now.label)}`;
  } else {
    for (let k = 0; k < 8 && !msg; k++) {
      const d = (now.day + k) % 7;
      const sl = slots.find(([dd, a]) => dd === d && (k > 0 || a > now.h));
      if (sl) {
        const when = k === 0 ? S.today : k === 1 ? S.tomorrow : days[d];
        const at = Math.floor(sl[1]) + ":" + (sl[1] % 1 ? "30" : "00");
        msg = S.next.replace("{time}", now.label).replace("{when}", when).replace("{at}", at);
      }
    }
  }
  fill(need("#now"), msg);
  const week = need("#week");
  hook(() => {
    const b = cal.getBoundingClientRect();
    week.style.setProperty("--wk", settle(clamp((innerHeight - b.top) / (innerHeight * 0.9))).toFixed(3));
  });

  /* the ticket tears off */
  fill(need("#tkIll"), INK.ticket());
  const tk = need("#tk");
  const stub = need("#stub");
  let sx = 0;
  let sy = 0;
  let dragging = false;
  const tear = (): void => tk.classList.add("torn");
  on(stub, "pointerdown", (e) => {
    if (tk.classList.contains("torn")) return;
    dragging = true;
    sx = e.clientX;
    sy = e.clientY;
    stub.setPointerCapture(e.pointerId);
    stub.classList.add("dragging");
  });
  on(stub, "pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - sx;
    const dy = Math.max(0, e.clientY - sy);
    stub.style.setProperty("--tx", dx * 0.3 + "px");
    stub.style.setProperty("--ty", dy * 0.6 + "px");
    stub.style.setProperty("--tr", -dy * 0.12 + "deg");
    if (dy > 120) {
      dragging = false;
      stub.classList.remove("dragging");
      tear();
    }
  });
  const rel = (): void => {
    if (!dragging) return;
    dragging = false;
    stub.classList.remove("dragging");
    stub.style.setProperty("--tx", "0px");
    stub.style.setProperty("--ty", "0px");
    stub.style.setProperty("--tr", "0deg");
  };
  on(stub, "pointerup", rel);
  on(stub, "pointercancel", rel);
  on(need("#tearBtn"), "click", tear);

  B.watchIll();
  return () => {
    alive = false;
    ac.abort();
    unhooks.forEach((h) => h());
    filled.forEach((el) => {
      el.innerHTML = "";
    });
    tk.classList.remove("torn");
    stub.classList.remove("dragging");
    ["--tx", "--ty", "--tr"].forEach((p) => stub.style.removeProperty(p));
    $$(".swap", card).forEach((el) => el.classList.remove("swap"));
    card.classList.remove("swap");
  };
}
