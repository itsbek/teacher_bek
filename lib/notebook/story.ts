/* Story page. Every scene owns a different behaviour; every scrubbed value reverses cleanly on the way up.
   Ported from docs/v4/proto2/js/story.js. The markup is rendered by app/[locale]/page.tsx; this only
   animates it. mountStory() returns a cleanup that removes everything it added (hooks, listeners, timers,
   injected drawings), so it can run again on the same DOM (React StrictMode, client navigations). */
import type { Core } from "./core";
import { INK } from "./ink";
import { make as write, type Written, type WriteOptions } from "./write";
import { $, $$, need, clamp, seg, release, settle, pop, rng } from "./util";
import { NOTEBOOK, type HeadId } from "./content";
import { holdUnder, peel, unpeel } from "./peel";

export interface StoryStrings {
  /** aria-label of the draggable "why" */
  whyAria: string;
  /** after a dog is picked (HTML) */
  picked: string;
  /** marking for each guess (HTML) */
  answers: { goed: string; went: string; wented: string };
  /** the header chip: "Page" … "cover" */
  chipCover: string;
  /** "page" — the handwritten page number word */
  pageWord: string;
}

type Timer = ReturnType<typeof setTimeout>;
const NS = "http://www.w3.org/2000/svg";
const css = (el: Element, k: string, v: string | number): void => (el as HTMLElement).style.setProperty(k, String(v));

export function mountStory(B: Core, S: StoryStrings): () => void {
  const { RM, FINE } = B;
  const mob = innerWidth < 700;
  const ease = settle;
  const ac = new AbortController();
  const signal = ac.signal;
  let alive = true;
  const timers = new Set<Timer>();
  const later = (ms: number, f: () => void): void => {
    const id = setTimeout(() => {
      timers.delete(id);
      if (alive) f();
    }, ms);
    timers.add(id);
  };
  const unhooks: (() => void)[] = [];
  const hook = (h: (y: number, t: number) => void): void => {
    unhooks.push(B.addHook(h));
  };
  const created: Element[] = [];
  const emptied: Element[] = [];
  const on = <K extends keyof HTMLElementEventMap>(
    el: HTMLElement | Window,
    type: K,
    fn: (e: HTMLElementEventMap[K]) => void,
    opts: AddEventListenerOptions = {},
  ): void => el.addEventListener(type, fn as EventListener, { ...opts, signal });

  /* ───────── 1 · hero: split + pull the why ───────── */
  const hero = need("#hero");
  const hx = $$(".hx", hero);
  const why = need("#why");
  const curve = need<SVGSVGElement>(".why-curve");
  let pull = 0,
    pullV = 0,
    pulling = false,
    px0 = 0,
    wc = 0,
    hov = 0;
  let touched = false,
    demoN = 0;
  hx.forEach((h) => css(h, "--d", h.dataset.dir ?? "0"));
  const openCover = (): void => {
    const w = $("#wall");
    if (w) B.scrollToY(w.getBoundingClientRect().top + B.sy(), 1.8);
  };
  if (!RM) {
    on(why, "pointerdown", (e) => {
      pulling = true;
      px0 = e.clientX;
      why.setPointerCapture(e.pointerId);
    });
    on(why, "pointermove", (e) => {
      if (pulling) pull = clamp((e.clientX - px0) / (innerWidth * 0.4), -0.3, 1);
    });
    (["pointerup", "pointercancel"] as const).forEach((ev) =>
      on(why, ev, () => {
        if (pulling && pull > 0.62) openCover();
        pulling = false;
        touched = true;
      }),
    );
  }
  why.tabIndex = 0;
  why.setAttribute("role", "button");
  why.setAttribute("aria-label", S.whyAria);
  on(why, "keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      touched = true;
      demoPull(openCover);
    }
  });
  function demoPull(done?: () => void): void {
    if (RM) {
      done?.();
      return;
    }
    const t0 = performance.now();
    pulling = true;
    const f = (): void => {
      if (!alive) return;
      const k = clamp((performance.now() - t0) / 900);
      pull = Math.sin((k * Math.PI) / 2) * 0.55;
      if (k < 1) requestAnimationFrame(f);
      else {
        pulling = false;
        if (done) later(250, done);
      }
    };
    f();
  }
  const demo = (): void => {
    if (touched || B.sy() > 40 || demoN >= 3) return;
    demoN++;
    demoPull();
    later(5200, demo);
  };

  /* ───────── 2 · wall: the notebook ───────── */
  const wall = need("#wall");
  const nb = need("#nb");
  const nbSvg = need<SVGSVGElement>("#nbSvg");
  const rowsEl = need("#nbRows");
  const pen = need("#nbPen");
  const blot = need("#blot");
  const hes = need("#hes");
  const cnt = need("#cnt");
  pen.innerHTML = INK.pen();
  emptied.push(pen, nbSvg);
  const ROWS_ALL: readonly string[] = NOTEBOOK.rows;
  const ROWS = mob ? ROWS_ALL.filter((r) => r.length <= 20).slice(0, 9) : ROWS_ALL.slice(0, 14);
  let lh = 26;
  let nbW: Written[] = [];
  function buildNotebook(): void {
    const w = nb.clientWidth,
      h = nb.clientHeight;
    const NL = mob ? 12 : 18;
    lh = h / NL;
    let sv = "";
    for (let i = 3; i < NL; i++)
      sv += `<line class="rule" pathLength="1" x1="0" y1="${(i * lh).toFixed(1)}" x2="${w}" y2="${(i * lh).toFixed(1)}"/>`;
    nbSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    nbSvg.innerHTML = sv;
    rowsEl.innerHTML = "";
    nbW = ROWS.map((t, i) => {
      const o: WriteOptions = { font: "print", size: lh * 0.74, x: w * 0.04, y: (3 + i) * lh - lh * 0.16, jitter: 0.9, seed: 11 + i, cls: "kid", press: 1 };
      let wr = write(nbSvg, t, o);
      const fit = (w * 0.92) / (wr.width() + 1);
      if (fit < 1) {
        wr.g.remove();
        wr = write(nbSvg, t, { ...o, size: (o.size ?? 32) * fit });
      }
      return wr;
    });
  }
  const wl = $$(".wall-lines li", wall);

  /* the silence, in real time */
  const LINES: readonly string[] = NOTEBOOK.fillers;
  const POOL: readonly string[] = NOTEBOOK.ghosts;
  const ghostsEl = need("#ghosts");
  emptied.push(ghostsEl);
  const gr = rng(8);
  const GH: HTMLSpanElement[] = [];
  const placed: [number, number][] = [];
  POOL.slice(0, mob ? 10 : POOL.length).forEach((w) => {
    const s = document.createElement("span");
    s.textContent = w;
    let x: number,
      y: number,
      tries = 0;
    do {
      x = (mob ? 22 : 8) + gr() * (mob ? 56 : 84);
      y = 24 + gr() * 60;
      tries++;
    } while (
      tries < 80 &&
      ((y > (mob ? 28 : 36) && y < (mob ? 74 : 66) && x > 8 && x < 92) ||
        placed.some(([px, py]) => Math.abs(px - x) < (mob ? 30 : 16) && Math.abs(py - y) < 7))
    );
    if (tries >= 80) return;
    placed.push([x, y]);
    s.style.left = x + "%";
    s.style.top = y + "%";
    s.style.fontSize = (18 + gr() * 22).toFixed(0) + "px";
    css(s, "--r", ((gr() - 0.5) * 12).toFixed(1) + "deg");
    css(s, "--go", (0.55 + gr() * 0.4).toFixed(2));
    ghostsEl.appendChild(s);
    GH.push(s);
  });
  const hesTxt = need("#hesTxt");
  let hesOn = false,
    gN = 0;
  let T: Timer[] = [];
  const hlater = (ms: number, f: () => void): void => {
    T.push(setTimeout(f, ms));
  };
  const set = (t: string): void => {
    hesTxt.textContent = t;
  };
  const typeOut = (s: string, at: number, sp: number): number => {
    for (let i = 1; i <= s.length; i++) hlater(at + i * sp, () => set(s.slice(0, i)));
    return at + s.length * sp;
  };
  const eraseOut = (s: string, at: number): number => {
    for (let i = s.length - 1; i >= 0; i--) hlater(at + (s.length - i) * 30, () => set(s.slice(0, i)));
    return at + s.length * 30;
  };
  const ghost = (): void => {
    if (gN < GH.length) GH[gN++].classList.add("on");
  };
  function hesStart(): void {
    if (hesOn) return;
    hesOn = true;
    hes.classList.add("ask");
    let t = 800;
    LINES.forEach((w, i) => {
      const end = typeOut(w, t, w.length > 12 ? 68 : 105);
      hlater(end + 200, () => {
        ghost();
        ghost();
        ghost();
      });
      t = i === LINES.length - 1 ? end + 1300 : eraseOut(w, end + 1050) + 360;
    });
    hlater(t, () => {
      set("");
      while (gN < GH.length) ghost();
      hes.classList.add("done");
    });
  }
  function hesReset(): void {
    if (!hesOn) return;
    hesOn = false;
    T.forEach(clearTimeout);
    T = [];
    set("");
    gN = 0;
    GH.forEach((g) => g.classList.remove("on"));
    hes.classList.remove("ask", "done");
  }

  /* ───────── 3 · test: the bag ───────── */
  const bagIll = need("#bagIll");
  bagIll.innerHTML = INK.desk();
  emptied.push(bagIll);
  const bag = need("#bag");
  const takenEl = need("#taken");
  const rel = need("#rel");
  const tags = $$(".tag");
  /* the week piles up on the study desk: sticky notes tossed on, first things at the bottom, a heap that
     rises above the desktop. Four rows of three (in desk-drawing units: the desktop is at y = 92, centre x = 160).
     Each note is tossed from its own side, at its own moment, spinning a little (seeded: same every visit). */
  const NW = tags.length;
  const pr = rng(21);
  const PILE = [3, 3, 3, 3, 2, 2];
  const DESK_W = 320,
    DESK_TOP = -70;
  const REST: [number, number, number][] = [];
  for (let row = 0, i = 0; i < NW; row++) {
    const n = Math.min(PILE[row] ?? 2, NW - i);
    const step = 58,
      span = step * (n - 1);
    for (let c = 0; c < n; c++, i++) {
      REST.push([-span / 2 + c * step + (pr() - 0.5) * 8 + (row % 2 ? 12 : -12), 46 - row * 33 - pr() * 3, (pr() - 0.5) * 14]);
    }
  }
  const FALL = tags.map(() => [(pr() - 0.5) * 220, (pr() - 0.5) * 120] as [number, number]);
  let acc = 0;
  const DELAY = tags.map(() => (acc += 0.5 + pr() * 0.9));
  const DROP_SPAN = acc + 1;
  interface Tag {
    el: HTMLElement;
    i: number;
    x: number;
    y: number;
    r: number;
    o: number;
    vx: number;
    vy: number;
    out: boolean;
    drag: boolean;
    fly: boolean;
    back: boolean;
    auto: boolean;
  }
  const A: Tag[] = tags.map((el, i) => ({ el, i, x: 0, y: 0, r: 0, o: 1, vx: 0, vy: 0, out: false, drag: false, fly: false, back: false, auto: false }));
  let takenN = 0,
    autoN = 0,
    dropK = 0;
  const applyA = (a: Tag): void => {
    const s = a.el.style;
    s.setProperty("--x", a.x.toFixed(1) + "px");
    s.setProperty("--y", a.y.toFixed(1) + "px");
    s.setProperty("--r", a.r.toFixed(1) + "deg");
    s.setProperty("--o", a.o.toFixed(2));
  };
  const restOf = (i: number): [number, number, number] => {
    const u = bag.offsetWidth / DESK_W;
    return [REST[i][0] * u, (REST[i][1] - DESK_TOP) * u, REST[i][2]];
  };
  function sagSet(): void {
    const inBag = A.filter((a) => !a.out).length * dropK;
    css(bag, "--sag", (inBag / NW).toFixed(2));
    css(bag, "--tk", (bag.offsetWidth / 360).toFixed(3));
    takenEl.textContent = takenN + " / " + NW;
    rel.classList.toggle("on", takenN >= 2);
  }
  function takeOut(a: Tag, vx?: number, vy?: number): void {
    if (a.out) return;
    a.out = a.fly = true;
    a.back = false;
    a.vx = vx ?? (a.x < 0 ? -14 : 14);
    a.vy = vy ?? -18;
    takenN++;
    sagSet();
  }
  function putBack(a: Tag): void {
    if (!a.out) return;
    a.out = false;
    a.fly = a.back = true;
    a.o = 1;
    a.x = a.x < 0 ? -innerWidth * 0.5 : innerWidth * 0.5;
    a.y = -innerHeight * 0.3;
    takenN--;
    sagSet();
  }
  A.forEach((a) => {
    let sx = 0,
      sy0 = 0,
      ox = 0,
      oy = 0;
    let h: [number, number, number][] = [];
    on(a.el, "pointerdown", (e) => {
      if (a.out) return;
      a.drag = true;
      a.el.setPointerCapture(e.pointerId);
      sx = e.clientX;
      sy0 = e.clientY;
      ox = a.x;
      oy = a.y;
      h = [[sx, sy0, performance.now()]];
    });
    on(a.el, "pointermove", (e) => {
      if (!a.drag) return;
      a.x = ox + e.clientX - sx;
      a.y = oy + e.clientY - sy0;
      a.r = (e.clientX - sx) * 0.05;
      applyA(a);
      h.push([e.clientX, e.clientY, performance.now()]);
      if (h.length > 6) h.shift();
    });
    const end = (): void => {
      if (!a.drag) return;
      a.drag = false;
      const f = h[0],
        l = h[h.length - 1];
      const dt = Math.max(16, l[2] - f[2]),
        vx = ((l[0] - f[0]) / dt) * 16,
        vy = ((l[1] - f[1]) / dt) * 16,
        moved = Math.hypot(a.x - ox, a.y - oy);
      if (Math.hypot(vx, vy) > 5 || moved > 90 || moved < 6)
        takeOut(a, moved < 6 ? undefined : vx * 1.2, moved < 6 ? undefined : vy * 1.2);
      else a.fly = a.back = true;
    };
    on(a.el, "pointerup", end);
    on(a.el, "pointercancel", end);
    on(a.el, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        takeOut(a);
      }
    });
  });
  function stepTags(): void {
    A.forEach((a) => {
      if (a.drag) return;
      if (!a.fly) {
        const [rx, ry, rr] = restOf(a.i),
          k = pop(clamp(dropK * DROP_SPAN - DELAY[a.i], 0, 1));
        a.x = rx + (1 - k) * FALL[a.i][0];
        a.y = ry - (1 - k) * innerHeight * 0.7;
        a.r = rr + (1 - k) * FALL[a.i][1];
        a.o = k > 0 ? 1 : 0;
        applyA(a);
        return;
      }
      if (a.back) {
        const [rx, ry, rr] = restOf(a.i);
        a.x += (rx - a.x) * 0.16;
        a.y += (ry - a.y) * 0.16;
        a.r += (rr - a.r) * 0.16;
        applyA(a);
        if (Math.hypot(rx - a.x, ry - a.y) < 0.6) a.fly = a.back = false;
        return;
      }
      a.vy += 0.9;
      a.x += a.vx;
      a.y += a.vy;
      a.r += a.vx * 0.3;
      a.o = Math.max(0, a.o - 0.03);
      applyA(a);
    });
  }

  /* ───────── 4 · turn: the door ───────── */
  const knob = need("#knob");
  const dogsEl = need("#dogs");
  const pickEl = need("#pick");
  emptied.push(dogsEl);
  dogsEl.innerHTML = "";
  const DOGN = 4;
  for (let i = 0; i < DOGN; i++) {
    const b = document.createElement("button");
    b.className = "dog";
    b.dataset.cur = "pick";
    b.innerHTML = INK.dog() + `<b>${NOTEBOOK.dog.a}</b>`;
    b.setAttribute("aria-label", NOTEBOOK.dog.aria);
    on(b, "click", () => {
      dogsEl.classList.add("picked");
      $$(".dog", dogsEl).forEach((d) => {
        d.classList.remove("chosen");
        const lb = $("b", d);
        if (lb) lb.textContent = NOTEBOOK.dog.a;
      });
      b.classList.add("chosen");
      const lb = $("b", b);
      if (lb) lb.textContent = NOTEBOOK.dog.the;
      pickEl.innerHTML = S.picked;
    });
    dogsEl.appendChild(b);
  }
  on(knob, "click", () => {
    const g = geo.find((g) => g.id === "turn");
    if (g) B.scrollToY(g.top + (g.h - innerHeight) * 0.52, 1.6);
  });

  /* ───────── 5 · guess ───────── */
  const sent = need(".sent");
  if (!$(".wd", sent)) {
    const out: Node[] = [];
    [...sent.childNodes].forEach((n) => {
      if (n.nodeType === 3)
        (n.textContent ?? "").split(/(\s+)/).forEach((t) => {
          if (!t) return;
          if (/^\s+$/.test(t)) out.push(document.createTextNode(t));
          else {
            const w = document.createElement("span");
            w.className = "wd";
            w.textContent = t;
            out.push(w);
          }
        });
      else if (n instanceof Element) {
        n.classList.add("wd");
        out.push(n);
      }
    });
    sent.replaceChildren(...out);
  }
  const sWd = $$(".wd", sent);
  sWd.forEach((w, i) => css(w, "--rz", (i % 2 ? -1 : 1) * (6 + i * 3) + "deg"));
  hook(() => {
    const r = sent.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0) return;
    const k = clamp((innerHeight * 0.95 - r.top) / (innerHeight * 0.45));
    sWd.forEach((w, i) => css(w, "--d", pop(clamp((k * (sWd.length + 2)) / 2 - i * 0.5)).toFixed(3)));
  });

  type Answer = keyof StoryStrings["answers"];
  const isAnswer = (v: string): v is Answer => v === "goed" || v === "went" || v === "wented";
  const gap = need("#gap");
  const gapW = need("#gapW");
  const mark = need("#mark");
  const resp = need("#resp");
  function drawIn(svgEl: SVGSVGElement, ms = 520): void {
    const t0 = performance.now();
    const f = (): void => {
      if (!alive) return;
      const k = clamp((performance.now() - t0) / ms);
      css(svgEl, "--k", release(k));
      if (k < 1) requestAnimationFrame(f);
    };
    f();
  }
  function choose(btn: HTMLElement): void {
    const v = btn.dataset.v ?? "";
    if (!isAnswer(v)) return;
    const ok = v === "went";
    $$(".opt").forEach((o) => {
      o.classList.toggle("is-ok", o === btn && ok);
      o.classList.toggle("is-no", o === btn && !ok);
    });
    gapW.textContent = v;
    gapW.className = "gap-w land " + (ok ? "ok" : "no");
    mark.innerHTML = `<span class="${ok ? "ok" : "no"}">${ok ? INK.tick() : INK.cross()}</span>`;
    const s = $<SVGSVGElement>("svg", mark);
    if (s) {
      css(s, "--k", 0);
      drawIn(s);
    }
    resp.innerHTML = S.answers[v];
  }
  const near = (x: number, y: number): boolean => {
    const g = gap.getBoundingClientRect();
    return x > g.left - 70 && x < g.right + 70 && y > g.top - 70 && y < g.bottom + 70;
  };
  $$(".opt").forEach((b) => {
    let sx: number | null = null,
      sy1 = 0,
      dr = false;
    on(b, "pointerdown", (e) => {
      sx = e.clientX;
      sy1 = e.clientY;
      dr = false;
      b.setPointerCapture(e.pointerId);
    });
    on(b, "pointermove", (e) => {
      if (sx == null) return;
      const dx = e.clientX - sx,
        dy = e.clientY - sy1;
      if (!dr && Math.hypot(dx, dy) > 6) {
        dr = true;
        b.classList.add("drag");
      }
      if (dr) {
        b.style.transform = `translate(${dx}px,${dy}px) rotate(${(dx * 0.04).toFixed(1)}deg)`;
        gap.classList.toggle("hot", near(e.clientX, e.clientY));
      }
    });
    on(b, "pointerup", (e) => {
      const was = dr;
      sx = null;
      dr = false;
      b.classList.remove("drag");
      b.style.transform = "";
      gap.classList.remove("hot");
      if (!was || near(e.clientX, e.clientY)) choose(b);
    });
    on(b, "keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        choose(b);
      }
    });
  });

  /* ───────── 6 · three ways ───────── */
  const ill1 = need("#ill1");
  const ill3 = need("#ill3");
  ill1.innerHTML = INK.sketchbook();
  ill3.innerHTML = INK.stopwatch();
  emptied.push(ill1, ill3);
  const sk = need<SVGSVGElement>("svg", ill1);
  const swSvg = need<SVGSVGElement>("svg", ill3);
  const note = need("#note");
  const wcEl = need("#wc");
  const spokenEl = need("#spoken");
  let timer: ReturnType<typeof setInterval> | undefined;
  let tOn = false;
  let caughtT: Timer | null = null;
  function startTimer(): void {
    if (tOn) return;
    tOn = true;
    const said = NOTEBOOK.spoken.split(" ");
    let n = 0;
    timer = setInterval(() => {
      n++;
      css(swSvg, "--sa", n * 9 + "deg");
      const w = Math.min(said.length, Math.floor((n * said.length) / 34));
      spokenEl.textContent = said.slice(0, w).join(" ");
      wcEl.textContent = String(w);
      if (n >= 40) clearInterval(timer);
    }, 250);
  }
  function stopTimer(): void {
    if (!tOn) return;
    tOn = false;
    clearInterval(timer);
    css(swSvg, "--sa", "0deg");
    spokenEl.textContent = "";
    wcEl.textContent = "0";
  }

  /* ───────── 7 · two sentences, one 'have' ───────── */
  const kS = $$(".k-s");
  $$(".k-ill").forEach((e) => {
    e.innerHTML = INK.key();
    emptied.push(e);
  });
  const kb = need(".kb");
  const kWhy = need(".k-why");

  /* ───────── 8 · own words ───────── */
  const wline = need<SVGSVGElement>("#wline");
  const sayP = need("#say");
  const ownPen = document.createElement("div");
  ownPen.className = "nb-pen own-pen";
  ownPen.innerHTML = INK.pen();
  wline.parentElement?.appendChild(ownPen);
  created.push(ownPen);
  emptied.push(wline);
  let ownW: Written | null = null;
  let ownU: SVGPathElement[] = [];
  function buildWrite(): void {
    const box = wline.parentElement;
    if (!box) return;
    const w = box.clientWidth;
    wline.innerHTML = "";
    const size = mob ? 40 : Math.min(92, w / 11);
    const ow = write(wline, (sayP.textContent ?? "").replace(/\s+/g, " ").trim(), {
      font: "cursive",
      size,
      x: 4,
      y: size * 0.95,
      maxW: w - 12,
      lh: 1.25,
      jitter: 0.15,
      seed: 3,
      cls: "grown",
      press: 1,
    });
    ownW = ow;
    const H = ow.height + size * 0.4;
    wline.setAttribute("viewBox", `0 0 ${w} ${H}`);
    wline.style.height = H + "px";
    ownU = ow.boxes
      .filter((b) => /^(lot\.?|I['’]ve|started)$/.test(b.w))
      .map((b) => {
        const u = document.createElementNS(NS, "path");
        u.setAttribute("class", "uline");
        u.setAttribute("pathLength", "1");
        u.setAttribute(
          "d",
          `M${b.x0 - 4} ${b.y + size * 0.2} C${(b.x0 + b.x1) / 2} ${b.y + size * 0.3} ${(b.x0 + b.x1) / 2} ${b.y + size * 0.12} ${b.x1 + 6} ${b.y + size * 0.22}`,
        );
        wline.appendChild(u);
        return u;
      });
  }

  /* ───────── 10 · room trace (lines over the photograph) ───────── */
  const TRACE: [string, number, number][] = [
    ["M130 0 L512 262 L1076 262 L1400 0", 0, 0.14],
    ["M512 262 L512 660 L1030 660 L1076 262", 0.08, 0.22],
    ["M40 892 L512 660 M1030 660 L1536 930", 0.14, 0.28],
    ["M602 322 L990 322 L990 652 L602 652 Z M794 322 L794 652", 0.22, 0.38],
    ["M668 596 L898 596 L938 672 L640 676 Z", 0.32, 0.46],
    ["M652 678 L652 862 M924 674 L924 862 M672 600 L672 760 M896 600 L896 760", 0.4, 0.52],
    ["M702 680 C700 670 836 670 838 682 L836 760 L704 760 Z M706 760 L702 900 M834 760 L842 884 M770 760 L774 860", 0.46, 0.6],
    ["M94 366 L318 392 L318 578 L96 595 Z", 0.52, 0.66],
    ["M422 522 L512 520 L512 686 L426 686 Z M424 578 L512 576 M424 632 L512 630", 0.58, 0.72],
    ["M36 722 L376 634 L376 800 L40 892 Z M36 722 L60 716 M120 700 L120 870 M182 682 L182 852 M240 668 L240 834 M294 654 L294 820", 0.62, 0.78],
    ["M1104 418 L1500 366 L1500 684 L1104 558 Z M1278 396 L1278 604", 0.7, 0.86],
    ["M1252 790 L1384 790 L1380 892 L1254 892 Z", 0.78, 0.92],
    [
      "M1074 904 C1074 884 1184 884 1184 904 C1184 924 1074 924 1074 904 Z M1218 910 C1220 892 1322 892 1324 912 C1322 930 1220 930 1218 910 Z M1200 958 C1204 938 1290 936 1292 958 C1290 980 1204 980 1200 958 Z M1356 972 C1358 952 1446 952 1448 972 C1446 994 1358 994 1356 972 Z",
      0.86,
      1,
    ],
  ];
  const traceEl = need("#trace");
  traceEl.innerHTML = TRACE.map(([d, s, e]) => `<path pathLength="1" d="${d}" style="--s:${s};--e:${e}"/>`).join("");
  emptied.push(traceEl);

  /* ───────── geometry ───────── */
  interface Geo {
    el: HTMLElement;
    id: string;
    top: number;
    h: number;
  }
  const pins = $$(".pin");
  let geo: Geo[] = [];
  function layout(): void {
    const y = B.sy();
    geo = pins.map((s) => {
      const r = s.getBoundingClientRect();
      return { el: s, id: s.id, top: r.top + y, h: s.offsetHeight };
    });
    buildNotebook();
    buildWrite();
    buildHeads();
    if (RM) {
      nbW.forEach((w) => w.set(1));
      ownW?.set(1);
      ownU.forEach((u) => css(u, "--k", 1));
      cnt.textContent = "212";
    }
  }

  /* ───────── the frame ───────── */
  const ageEl = $("#age");
  const ab = need("#about");
  const abPhoto = need(".ab-photo");
  const abImg = need(".ab-photo i");
  const abName = need(".ab-name");
  const room = need("#room");
  const roomPhoto = need(".room-photo", room);
  /** the pencil drawing takes its time, holds, then the photograph develops over it */
  const ROOM_DRAW = 1800,
    ROOM_HOLD = 250,
    ROOM_FADE = 900;
  let roomT0 = -1,
    roomDone = false;
  const turnStage = need(".stage", need("#turn"));
  const door3d = need(".door3d");
  hook((y, t) => {
    if (RM) return;
    const vh = innerHeight;
    /* hero */
    const hk = clamp(y / (innerHeight * 0.55));
    css(hero, "--split", ease(hk).toFixed(4));
    if (y < vh * 1.2) {
      const [mx, my, seen] = B.mouse();
      if (seen && FINE) {
        const r = why.getBoundingClientRect();
        const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
        hov += ((d < 220 ? 1 - d / 220 : 0) - hov) * 0.12;
      }
      if (!pulling) {
        pullV += -pull * 0.15;
        pullV *= 0.8;
        pull += pullV;
        if (Math.abs(pull) < 0.0005) pull = 0;
      }
      css(why, "--pull", pull.toFixed(3));
      css(why, "--o", Math.max(hov, Math.abs(pull) * 1.3, 0.15 + 0.1 * Math.sin(t / 600)).toFixed(3));
      css(curve, "--pull", pull.toFixed(3));
      css(curve, "--wc", wc.toFixed(3));
      css(hero, "--wc", wc.toFixed(3));
    }
    /* pinned scenes */
    for (const g of geo) {
      if (y + vh < g.top - vh * 0.3 || y > g.top + g.h + vh * 0.2) continue;
      const p = clamp((y - g.top) / (g.h - vh)),
        st = g.el.style;
      if (g.id === "wall") {
        css(nbSvg, "--rk", release(seg(p, 0, 0.08)).toFixed(3));
        const rp = seg(p, 0.05, 0.34) * nbW.length;
        let pt: DOMPoint | null = null;
        nbW.forEach((wr, i) => {
          const q = wr.set(clamp(rp - i));
          if (rp - i > 0 && rp - i <= 1 && q) pt = q;
        });
        if (!pt && rp >= nbW.length && nbW.length) pt = nbW[nbW.length - 1].set(1);
        const ptv = pt as DOMPoint | null;
        const pxv = ptv ? ptv.x - 17 : 0,
          pyv = ptv ? ptv.y - 128 : 0;
        css(pen, "--px", pxv.toFixed(1) + "px");
        css(pen, "--py", pyv.toFixed(1) + "px");
        css(pen, "--po", ptv && p < 0.36 ? 1 : 0);
        cnt.textContent = String(Math.round((Math.min(nbW.length, rp) / nbW.length) * 212));
        wl.forEach((l, k) => css(l, "--a", release(seg(p, 0.05 + k * 0.065, 0.1 + k * 0.065)).toFixed(3)));
        const stage = g.el.querySelector(".stage");
        if (stage) {
          const nb0 = nb.getBoundingClientRect(),
            s0 = stage.getBoundingClientRect();
          st.setProperty("--bx", nb0.left - s0.left + pxv + 14 + "px");
          st.setProperty("--by", nb0.top - s0.top + pyv + 70 + "px");
        }
        const bk = seg(p, 0.36, 0.44);
        css(blot, "--bs", ((Math.pow(bk, 1.6) * Math.hypot(innerWidth, vh)) / 12).toFixed(2));
        if (bk > 0.6) g.el.dataset.toneNow = "dark";
        else delete g.el.dataset.toneNow;
        st.setProperty("--ho", seg(p, 0.43, 0.47).toFixed(3));
        if (p > 0.46) hesStart();
        else if (p < 0.41) hesReset();
      }
      if (g.id === "test") {
        css(bag, "--fall", (1 - pop(seg(p, 0, 0.1))).toFixed(3));
        dropK = seg(p, 0.06, 0.34);
        const auto = Math.floor(seg(p, 0.4, 0.68) * NW);
        while (autoN < auto) {
          const a = A.find((a) => !a.out);
          if (!a) {
            autoN = auto;
            break;
          }
          takeOut(a, (Math.random() - 0.5) * 24, -16);
          a.auto = true;
          autoN++;
        }
        while (autoN > auto) {
          const a = [...A].reverse().find((a) => a.out && a.auto);
          if (!a) {
            autoN = auto;
            break;
          }
          a.auto = false;
          putBack(a);
          autoN--;
        }
        sagSet();
      }
      if (g.id === "turn") {
        st.setProperty("--slide", (1 - release(seg(p, 0, 0.1))).toFixed(3));
        st.setProperty("--wr2", release(seg(p, 0.06, 0.2)).toFixed(3));
        const open = settle(seg(p, 0.2, 0.36)),
          f = settle(seg(p, 0.28, 0.46));
        st.setProperty("--open", open.toFixed(3));
        st.setProperty("--f", f.toFixed(3));
        const dr = door3d.getBoundingClientRect(),
          sr = turnStage.getBoundingClientRect();
        st.setProperty("--lx", (((dr.left + dr.width * 0.3 - sr.left) / sr.width) * 100).toFixed(1) + "%");
        st.setProperty("--ly", (((dr.top + dr.height / 2 - sr.top) / sr.height) * 100).toFixed(1) + "%");
        st.setProperty("--lo", seg(p, 0.22, 0.32).toFixed(3));
        st.setProperty("--lr", (seg(p, 0.24, 0.46) * 1.6).toFixed(3));
        st.setProperty("--dg", seg(p, 0.46, 0.54).toFixed(3));
      }
      if (g.id === "six") {
        const u = seg(p, 0.03, 0.76);
        let h = 0;
        for (let k = 0; k < 3; k++) h += settle(seg(u, k / 3 + 0.07, (k + 1) / 3 - 0.05)) / 3;
        st.setProperty("--hx", h.toFixed(4));
        css(sk, "--k", release(seg(h, 0.1, 0.33)).toFixed(3));
        const uf = settle(seg(h, 0.45, 0.64));
        css(note, "--uf", uf.toFixed(3));
        if (uf > 0.98 && !caughtT) {
          const id = setTimeout(() => note.classList.add("caught"), 900);
          caughtT = id;
          timers.add(id);
        }
        if (uf < 0.9) {
          if (caughtT) clearTimeout(caughtT);
          caughtT = null;
          note.classList.remove("caught");
        }
        css(swSvg, "--k", release(seg(h, 0.76, 0.97)).toFixed(3));
        if (h > 0.97) startTimer();
        else stopTimer();
      }
      if (g.id === "dist") {
        kS.forEach((c, i) => {
          css(c, "--a", release(seg(p, 0.02 + i * 0.1, 0.14 + i * 0.1)).toFixed(3));
          css(c, "--m", release(seg(p, 0.3 + i * 0.05, 0.38 + i * 0.05)).toFixed(3));
        });
        css(kb, "--arc", settle(seg(p, 0.22, 0.4)).toFixed(3));
        css(kWhy, "--w", release(seg(p, 0.42, 0.52)).toFixed(3));
      }
      if (g.id === "own" && ownW) {
        const k = seg(p, 0.03, 0.38),
          pt = ownW.set(k);
        css(ownPen, "--px", ((pt ? pt.x : 0) - 17).toFixed(1) + "px");
        css(ownPen, "--py", ((pt ? pt.y : 0) - 128).toFixed(1) + "px");
        css(ownPen, "--po", k > 0 && k < 1 ? 1 : 0);
        ownU.forEach((u, n) => css(u, "--k", seg(p, 0.38 + n * 0.025, 0.43 + n * 0.025).toFixed(3)));
      }
    }
    stepTags();
    /* about: layered depth */
    const ar = ab.getBoundingClientRect();
    if (ar.bottom > 0 && ar.top < vh) {
      const k = clamp((vh - ar.top) / (vh + ar.height));
      css(abPhoto, "--cv", settle(seg(k, 0.05, 0.38)).toFixed(3));
      css(abPhoto, "--py", ((k - 0.5) * -60).toFixed(1) + "px");
      css(abImg, "--pi", ((k - 0.5) * 40).toFixed(1) + "px");
      css(abName, "--ny", ((k - 0.5) * 140).toFixed(1) + "px");
      css(ab, "--am", release(seg(k, 0.12, 0.55)).toFixed(3));
      css(ab, "--ad", pop(seg(k, 0.5, 0.62)).toFixed(3));
    }
    /* room: drawn, then photographed. Played on its own clock once the drawing is in view (a scroll-linked
       drawing finished in one trackpad flick, too fast to notice); scrolling away before the end restarts it. */
    const rr = room.getBoundingClientRect();
    const photo = roomPhoto.getBoundingClientRect();
    const seen = photo.top < vh * 0.8 && photo.bottom > vh * 0.15;
    if (seen && roomT0 < 0) {
      roomT0 = performance.now();
      const tick = (): void => {
        if (!alive || roomT0 < 0) return;
        const t = performance.now() - roomT0;
        css(room, "--rt", (1 - Math.pow(1 - clamp(t / ROOM_DRAW), 2)).toFixed(3));
        css(room, "--rp", settle(clamp((t - ROOM_DRAW - ROOM_HOLD) / ROOM_FADE)).toFixed(3));
        if (t < ROOM_DRAW + ROOM_HOLD + ROOM_FADE) requestAnimationFrame(tick);
        else roomDone = true;
      };
      requestAnimationFrame(tick);
    } else if (!roomDone && roomT0 >= 0 && (rr.top > vh || rr.bottom < 0)) {
      roomT0 = -1;
      css(room, "--rt", "0");
      css(room, "--rp", "0");
    }
  });

  /* ───────── things lean toward the pointer ───────── */
  const tilted: HTMLElement[] = [];
  if (FINE && !RM)
    $$("#nb, .k-s, .ab-art, .folded").forEach((el) => {
      el.classList.add("tilt");
      tilted.push(el);
      on(el, "pointermove", (e) => {
        const r = el.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - 0.5,
          y = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(900px) rotateY(${(x * 10).toFixed(2)}deg) rotateX(${(-y * 8).toFixed(2)}deg)`;
      });
      on(el, "pointerleave", () => {
        el.style.transform = "";
      });
    });

  /* ───────── PLAN 1 · one notebook: paper pages, page turns, page count ───────── */
  const PAGES = ["wall", "test", "turn", "wrong", "six", "dist", "own", "about", "room"];
  const main = need("main");
  const secEls = [...main.children] as HTMLElement[];
  secEls.forEach((el, i) => {
    el.style.zIndex = String(secEls.length - i);
  });
  PAGES.forEach((id, i) => {
    const el = $("#" + id);
    if (!el) return;
    el.classList.add("paper");
    el.dataset.page = String(i + 1);
    const tag = document.createElement("span");
    tag.className = "pgno";
    tag.setAttribute("aria-hidden", "true");
    tag.textContent = S.pageWord + " " + (i + 1);
    ($(".stage", el) ?? el).appendChild(tag);
    created.push(tag);
  });
  const TURNS: [string, string][] = [
    ["cover", "wall"],
    ["wall", "test"],
    ["test", "turn"],
    ["turn", "wrong"],
    ["wrong", "six"],
    ["six", "dist"],
    ["dist", "own"],
    ["own", "about"],
  ];
  TURNS.forEach(([a, b]) => {
    $("#" + a)?.classList.add("turns");
    $("#" + b)?.classList.add("under");
  });
  const turnEls = TURNS.map(([a]) => $("#" + a)).filter((x): x is HTMLElement => x !== null);
  const turnStages = turnEls.map((el) => el.querySelector<HTMLElement>(":scope > .stage") ?? el);
  const underEls = TURNS.filter(([a]) => $("#" + a)).map(([, b]) => $("#" + b));
  const TW = 0.55;
  const chip = $(".age-chip");
  const pageEls = PAGES.map((id) => $("#" + id));
  hook(() => {
    if (RM) return;
    const vh = innerHeight;
    turnEls.forEach((el, i) => {
      const r = el.getBoundingClientRect(),
        left = r.bottom - vh,
        to = left < vh * TW && left > -vh ? settle(clamp(1 - left / (vh * TW))) : left <= -vh ? 1 : 0;
      el.style.setProperty("--to", to.toFixed(3));
      el.classList.toggle("gone", to > 0.995);
      peel(turnStages[i], to);
      holdUnder(underEls[i], to > 0 && to < 1);
    });
    let pg = 0;
    pageEls.forEach((el, i) => {
      if (el && el.getBoundingClientRect().top <= vh * 0.5) pg = i + 1;
    });
    const pv = pg ? String(pg) : S.chipCover;
    if (chip) chip.classList.toggle("is-cover", !pg);
    if (ageEl && ageEl.textContent !== pv) {
      ageEl.textContent = pv;
      ageEl.classList.remove("flip");
      void ageEl.offsetWidth;
      ageEl.classList.add("flip");
    }
  });

  /* ───────── PLAN 1.2 · the notebook ages: page headings written in a hand that grows up ───────── */
  interface PageHead {
    sec: HTMLElement;
    svg: SVGSVGElement;
    wr: Written;
    u: SVGPathElement;
  }
  let heads: PageHead[] = [];
  function buildHeads(): void {
    heads.forEach((h) => h.svg.remove());
    heads = [];
    (Object.entries(NOTEBOOK.heads) as [HeadId, (typeof NOTEBOOK.heads)[HeadId]][]).forEach(([id, [txt, font, jit]], n) => {
      const sec = $("#" + id);
      if (!sec) return;
      const host = id === "wall" ? $(".nb-wrap", sec) : ($(".stage", sec) ?? sec);
      if (!host) return;
      const size = mob ? 24 : 34;
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "pghead pg-" + id);
      svg.setAttribute("aria-hidden", "true");
      host.appendChild(svg);
      const wr = write(svg, txt, { font, size, x: 4, y: size * 0.92, jitter: jit, seed: 40 + n, cls: font === "print" ? "kid" : "grown", press: 1 });
      const wd = Math.ceil(wr.width()) + 12,
        H = Math.ceil(size * 1.45);
      svg.setAttribute("viewBox", `0 0 ${wd} ${H}`);
      svg.style.width = wd + "px";
      svg.style.height = H + "px";
      const u = document.createElementNS(NS, "path");
      u.setAttribute("pathLength", "1");
      u.setAttribute("class", "pg-u " + (font === "print" ? "ruler" : "pen"));
      u.setAttribute(
        "d",
        font === "print" ? `M2 ${H - 4} L${wd - 4} ${H - 4}` : `M2 ${H - 5} C${wd * 0.3} ${H - 1} ${wd * 0.6} ${H - 8} ${wd - 4} ${H - 4}`,
      );
      svg.appendChild(u);
      heads.push({ sec, svg, wr, u });
    });
  }
  hook(() => {
    const vh = innerHeight;
    for (const h of heads) {
      const r = h.sec.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) continue;
      const k = RM ? 1 : clamp((vh * 0.9 - r.top) / (vh * 0.7));
      h.wr.set(seg(k, 0, 0.85));
      css(h.u, "--k", seg(k, 0.82, 1).toFixed(3));
    }
  });

  /* ───────── PLAN 9.3 · the rule on the door appears word by word, left to right ───────── */
  const rule = $(".rule");
  if (rule && !$(".rw", rule)) {
    let n = 0;
    const walk = (el: Node): void =>
      [...el.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const out: Node[] = [];
          (c.textContent ?? "").split(/(\s+)/).forEach((t) => {
            if (!t) return;
            if (/^\s+$/.test(t)) out.push(document.createTextNode(t));
            else {
              const w = document.createElement("span");
              w.className = "rw";
              w.style.setProperty("--i", String(n++));
              w.textContent = t;
              out.push(w);
            }
          });
          (c as ChildNode).replaceWith(...out);
        } else if (c.nodeType === 1) walk(c);
      });
    walk(rule);
    rule.style.setProperty("--n", String(n));
  }

  /* ───────── intro ───────── */
  void B.ready.then(() => {
    if (!alive) return;
    layout();
    later(2600, demo);
    const t0 = performance.now();
    const f = (): void => {
      if (!alive) return;
      wc = release(clamp((performance.now() - t0 - 300) / 1600));
      if (wc < 1) requestAnimationFrame(f);
    };
    f();
  });
  if (RM) {
    wc = 1;
    css(curve, "--wc", 1);
    hes.classList.add("ask", "done");
    set(LINES.slice(0, 3).join(" "));
    GH.forEach((g) => g.classList.add("on"));
  }
  let rz: Timer | undefined;
  const relayout = (): void => {
    clearTimeout(rz);
    rz = setTimeout(() => {
      if (alive) layout();
    }, 160);
  };
  on(window, "resize", relayout);
  /* on phones the notebook takes the height the copy leaves, which settles after fonts load: redraw when it changes */
  if ("ResizeObserver" in window) {
    let nbSize = `${nb.clientWidth}x${nb.clientHeight}`;
    const ro = new ResizeObserver(() => {
      const s = `${nb.clientWidth}x${nb.clientHeight}`;
      if (s === nbSize) return;
      nbSize = s;
      relayout();
    });
    ro.observe(nb);
    ac.signal.addEventListener("abort", () => ro.disconnect());
  }
  /* new drawings were injected: let the runtime watch them */
  B.watchIll();

  return () => {
    turnStages.forEach(unpeel);
    underEls.forEach((u) => holdUnder(u, false));
    alive = false;
    ac.abort();
    unhooks.forEach((u) => u());
    timers.forEach(clearTimeout);
    timers.clear();
    T.forEach(clearTimeout);
    clearInterval(timer);
    clearTimeout(rz);
    heads.forEach((h) => h.svg.remove());
    created.forEach((el) => el.remove());
    emptied.forEach((el) => {
      el.innerHTML = "";
    });
    tilted.forEach((el) => {
      el.classList.remove("tilt");
      el.style.transform = "";
    });
  };
}
