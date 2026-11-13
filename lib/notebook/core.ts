/* Teacher Bek — shared runtime: scroll, frame loop, cursor states, magnetic controls, menu, field notes,
   protected images, preloader (the mark draws itself) and page transitions (blue rises, the mark draws, the
   next page is uncovered). Ported from docs/v4/proto2/js/core.js.

   Lifecycle in Next.js:
   - initCore() runs once per locale layout mount (NotebookRuntime, useLayoutEffect) and returns the Core.
     Everything it attaches is torn down by core.destroy(): the rAF loop, Lenis, listeners, timers, observers.
   - core.mountPage() runs on every pathname change (NotebookRuntime, useEffect). It does the per-page work
     the prototype did at load (frozen→open headings, wobbling drawings, the arrival half of a page
     transition) and returns a cleanup.
   - Page scripts (lib/notebook/story.ts, and later classes/approach/talk) call getCore() inside their own
     useEffect, register frame hooks with core.addHook() and remove them in their cleanup. */
import Lenis from "lenis";
import { $, $$, clamp, markSVG, MARK, pop, release, rng, seg, settle } from "./util";

export type Hook = (y: number, t: number) => void;

export interface NoteText {
  title: string;
  body: string;
  cite: string;
  source: string;
}

export interface CoreStrings {
  menu: string;
  close: string;
  fieldNote: string;
  /** cursor ring labels, keyed by the data-cur value (EN text); missing keys show the key itself */
  cursor: Record<string, string>;
  notes: Record<string, NoteText>;
}

export interface CoreOptions {
  strings: CoreStrings;
  /** client-side navigation (router.push); called after the veil has covered the page */
  navigate: (href: string) => void;
}

export interface Core {
  root: HTMLElement;
  RM: boolean;
  LITE: boolean;
  FINE: boolean;
  /** translate a cursor label */
  tr: (s: string) => string;
  lenis: Lenis | null;
  sy: () => number;
  scrollToY: (y: number, d?: number) => void;
  /** frame hooks, called every animation frame with (scrollY, time) */
  hooks: Hook[];
  addHook: (h: Hook) => () => void;
  mouse: () => [number, number, boolean];
  /** fonts loaded and the preloader (if any) gone */
  ready: Promise<void>;
  notes: Record<string, NoteText>;
  /** start watching new .ill drawings so they only wobble on screen */
  watchIll: () => void;
  /** re-measure frozen→open headings (call after injecting headings) */
  reserve: () => void;
  mountPage: () => () => void;
  destroy: () => void;
  alive: () => boolean;
  MARK: string;
  markSVG: () => string;
  clamp: typeof clamp;
  seg: typeof seg;
  release: typeof release;
  settle: typeof settle;
  pop: typeof pop;
  rng: typeof rng;
}

let current: Core | null = null;

/** The live runtime, or null before NotebookRuntime has mounted. */
export function getCore(): Core | null {
  return current;
}

/** Same detection as the inline head script; re-applied in case React reset <html> attributes. */
export function applyFlags(root: HTMLElement): void {
  const q = location.search;
  const rm = matchMedia("(prefers-reduced-motion: reduce)").matches || /[?&]rm\b/.test(q);
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  const c = nav.connection ?? {};
  const lite =
    /[?&]lite\b/.test(q) || !!c.saveData || (nav.deviceMemory || 8) <= 4 || (navigator.hardwareConcurrency || 8) <= 4;
  root.classList.add("js");
  if (rm) root.classList.add("rm");
  if (lite) root.classList.add("lite");
}

export function initCore(opts: CoreOptions): Core {
  if (current) current.destroy();
  const root = document.documentElement;
  applyFlags(root);
  const RM = root.classList.contains("rm");
  const LITE = root.classList.contains("lite");
  const FINE = matchMedia("(pointer:fine)").matches;
  const S = opts.strings;
  const tr = (s: string): string => S.cursor[s] ?? s;

  const ac = new AbortController();
  const signal = ac.signal;
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const later = (ms: number, f: () => void): void => {
    const id = setTimeout(() => {
      timers.delete(id);
      if (!signal.aborted) f();
    }, ms);
    timers.add(id);
  };
  let dead = false;

  const lenis: Lenis | null = RM ? null : new Lenis({ lerp: 0.09, wheelMultiplier: 0.85 });
  const sy = (): number => (lenis ? lenis.animatedScroll : scrollY);
  const scrollToY = (y: number, d = 1.4): void => {
    if (lenis) lenis.scrollTo(y, { duration: d, easing: release });
    else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
  };
  const hooks: Hook[] = [];
  const addHook = (h: Hook): (() => void) => {
    hooks.push(h);
    return () => {
      const i = hooks.indexOf(h);
      if (i >= 0) hooks.splice(i, 1);
    };
  };
  let raf = 0;
  const loop = (t: number): void => {
    if (lenis) lenis.raf(t);
    const y = sy();
    for (const h of hooks.slice()) h(y, t);
    raf = requestAnimationFrame(loop);
  };

  /* the mark, reusable (most marks are rendered in JSX; this fills any empty [data-mark]) */
  const fillMarks = (): void =>
    $$("[data-mark]").forEach((el) => {
      if (el.querySelector("svg")) return;
      el.insertAdjacentHTML("afterbegin", markSVG());
      if (el.classList.contains("lg-b")) el.firstElementChild?.setAttribute("viewBox", "12 6 42 80");
    });
  fillMarks();

  /* cursor with states */
  const cur = $(".cur");
  const ring = cur ? $(".c-ring", cur) : null;
  let mx = -1e4,
    my = -1e4,
    cx = -200,
    cy = -200,
    seen = false;
  let magEl: HTMLElement | null = null;
  addEventListener(
    "pointermove",
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      seen = true;
      if (!FINE || RM) return;
      const m = e.target instanceof Element ? e.target.closest<HTMLElement>(".mag") : null;
      if (magEl && magEl !== m) {
        magEl.style.setProperty("--mx", "0px");
        magEl.style.setProperty("--my", "0px");
      }
      magEl = m;
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.setProperty("--mx", clamp((e.clientX - r.left - r.width / 2) * 0.3, -12, 12).toFixed(1) + "px");
        m.style.setProperty("--my", clamp((e.clientY - r.top - r.height / 2) * 0.4, -10, 10).toFixed(1) + "px");
      }
    },
    { passive: true, signal },
  );
  if (cur && ring) {
    document.addEventListener(
      "pointerover",
      (e) => {
        const t = e.target;
        if (!(t instanceof Element)) return;
        let s = "dot",
          label = "";
        if (t.closest("[data-cur=drag],[data-drag],input[type=range]")) s = "drag";
        else if (t.closest("input,textarea,select")) s = "none";
        else if (t.closest("[data-look]")) s = "look";
        else if (t.closest("a,button,[data-cur]")) {
          s = "link";
          const c = t.closest<HTMLElement>("[data-cur]");
          label = c?.dataset.cur ? tr(c.dataset.cur) : "";
        } else if (t.closest("h1,h2,p,li")) s = "text";
        cur.dataset.s = s;
        ring.textContent = label;
        /* over anything blue (buttons, the ticket, the menu, the veil) the cursor turns ink so it stays visible */
        let bg = "";
        for (let x: Element | null = t; x; x = x.parentElement) {
          const c = getComputedStyle(x).backgroundColor;
          const m = c.match(/\d+(\.\d+)?/g);
          if (!m || (m.length === 4 && +m[3] === 0)) continue;
          const [r, g, b] = m.map(Number);
          bg = b > 150 && r < 90 && b - r > 90 && g < 170 ? "blue" : "";
          break;
        }
        if (cur.dataset.bg !== bg) cur.dataset.bg = bg;
      },
      { signal },
    );
    addEventListener("pointerdown", () => cur.classList.add("down"), { signal });
    addEventListener("pointerup", () => cur.classList.remove("down"), { signal });
    hooks.push(() => {
      if (!FINE) return;
      cx += (mx - cx) * 0.25;
      cy += (my - cy) * 0.25;
      cur.style.setProperty("--cx", cx.toFixed(1) + "px");
      cur.style.setProperty("--cy", cy.toFixed(1) + "px");
    });
  }

  /* header: tone and a frosted bar once you leave the top */
  let tone: string | null = null;
  hooks.push((y) => {
    let t = "light";
    for (const s of $$("[data-tone]")) {
      // a page that has turned over is no longer under the header
      if (s.closest(".gone")) continue;
      const r = s.getBoundingClientRect();
      if (r.top <= 36 && r.bottom > 36) {
        t = s.dataset.toneNow || s.dataset.tone || "light";
        break;
      }
    }
    if (root.classList.contains("menu-open")) t = "dark";
    if (t !== tone) {
      tone = t;
      /* the header's own attribute: [data-tone=dark] on <html> would turn the whole page's ink white */
      root.dataset.hdrTone = t;
    }
    root.style.setProperty("--hb", y > 40 && !root.classList.contains("menu-open") ? "1" : "0");
  });

  /* menu */
  const menu = $("#menu");
  const mBtn = $("#menuBtn");
  function setMenu(open: boolean): void {
    if (!menu || !mBtn) return;
    root.classList.toggle("menu-open", open);
    mBtn.setAttribute("aria-expanded", String(open));
    const sp = $("span", mBtn);
    if (sp) sp.textContent = open ? S.close : S.menu;
    menu.inert = !open;
    if (open) {
      lenis?.stop();
      later(500, () => $("a", menu)?.focus({ preventScroll: true }));
    } else {
      lenis?.start();
    }
  }
  if (menu && mBtn) {
    menu.inert = true;
    mBtn.addEventListener("click", () => setMenu(!root.classList.contains("menu-open")), { signal });
    addEventListener(
      "keydown",
      (e) => {
        if (e.key === "Escape" && root.classList.contains("menu-open")) {
          setMenu(false);
          mBtn.focus();
        }
      },
      { signal },
    );
    $$<HTMLAnchorElement>("a", menu).forEach((a) =>
      a.addEventListener(
        "click",
        (e) => {
          const h = a.getAttribute("href") || "";
          if (h.startsWith("#")) {
            e.preventDefault();
            setMenu(false);
            const t = $(h);
            if (t) later(400, () => scrollToY(t.getBoundingClientRect().top + sy(), 1.6));
          }
        },
        { signal },
      ),
    );
  }

  /* field notes */
  const NOTES = S.notes;
  const card = $(".note-card");
  let cardFor: HTMLElement | null = null,
    cardY = 0;
  const esc = (s: string): string =>
    s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
  function openNote(b: HTMLElement): void {
    if (!card) return;
    const n = NOTES[b.dataset.note ?? ""];
    if (!n) return;
    if (cardFor === b) return closeNote();
    if (cardFor) cardFor.setAttribute("aria-expanded", "false");
    card.innerHTML = `<p class="nc-k">${esc(S.fieldNote)}</p><p class="nc-t">${esc(n.title)}</p><p class="nc-b">${esc(n.body)}</p><p class="nc-c">${esc(n.cite)}<span>${esc(n.source)}</span></p>`;
    card.setAttribute("aria-label", n.title);
    card.hidden = false;
    card.classList.remove("in");
    const r = b.getBoundingClientRect(),
      W = card.offsetWidth,
      h = card.offsetHeight;
    const x = clamp(r.left + r.width / 2 - W / 2, 16, innerWidth - W - 16);
    let y = r.bottom + 12;
    if (y + h > innerHeight - 16) y = r.top - h - 12;
    card.style.left = x + "px";
    card.style.top = Math.max(80, y) + "px";
    requestAnimationFrame(() => card.classList.add("in"));
    cardFor = b;
    cardY = sy();
    b.setAttribute("aria-expanded", "true");
  }
  function closeNote(): void {
    if (!cardFor || !card) return;
    card.classList.remove("in");
    cardFor.setAttribute("aria-expanded", "false");
    cardFor = null;
    later(250, () => {
      if (!cardFor) card.hidden = true;
    });
  }
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const b = t?.closest<HTMLElement>(".nm");
      if (b) {
        e.stopPropagation();
        openNote(b);
      } else if (!t?.closest(".note-card")) closeNote();
    },
    { signal },
  );
  addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") closeNote();
    },
    { signal },
  );
  hooks.push((y) => {
    if (cardFor && Math.abs(y - cardY) > 60) closeNote();
  });

  /* protected images: no menu, no drag */
  const prot = (e: Event): void => {
    if (e.target instanceof Element && e.target.closest(".protect")) e.preventDefault();
  };
  document.addEventListener("contextmenu", prot, { signal });
  document.addEventListener("dragstart", prot, { signal });

  /* page transitions: blue rises over the page, the mark draws, then the next page is uncovered.
     Same-locale links go through the App Router (router.push once the veil covers the page); links to the
     other locale (and anything else) do a full load, like the prototype. */
  const arriveIn = (): void => {
    root.classList.remove("leaving");
    root.classList.add("arriving");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        root.classList.add("arrived");
        later(1000, () => root.classList.remove("arriving", "arrived"));
      }),
    );
  };
  if (root.classList.contains("arriving")) arriveIn();
  let pending: string | null = null;
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target instanceof Element ? e.target : null;
      const a = t?.closest<HTMLAnchorElement>("a[href]");
      if (!a || RM || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target || a.hasAttribute("download")) return;
      const h = a.getAttribute("href");
      if (!h || h.startsWith("#") || /^(https?:|tel:|mailto:|\/\/)/.test(h)) return;
      const url = new URL(h, location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      e.stopPropagation();
      if (pending) return;
      const loc = (p: string): string => p.split("/")[1] ?? "";
      const sameDoc = url.pathname === location.pathname && url.search === location.search;
      const full = loc(url.pathname) !== loc(location.pathname);
      pending = url.pathname + url.search + url.hash;
      root.classList.add("leaving");
      later(1050, () => {
        const to = pending;
        pending = null;
        if (!to) return;
        if (full) {
          try {
            sessionStorage.setItem("bek-arrive", "1");
          } catch {
            /* private mode */
          }
          location.href = to;
        } else if (sameDoc) {
          setMenu(false);
          const el = url.hash ? $(url.hash) : null;
          const y = el ? el.getBoundingClientRect().top + sy() : 0;
          if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
          else scrollTo(0, y);
          arriveIn();
        } else {
          opts.navigate(to);
          /* safety net: if the client navigation never lands (slow or failed fetch), the veil must not stay up */
          later(2500, () => {
            if (root.classList.contains("leaving")) location.href = to;
          });
        }
      });
    },
    { capture: true, signal },
  );
  /* back/forward restores never get a veil */
  addEventListener("pageshow", (e) => {
    if (e.persisted) root.classList.remove("leaving");
  }, { signal });

  /* preloader: once per visit */
  function preload(): Promise<void> {
    return new Promise((done) => {
      const L = $(".loader");
      if (dead || !L || !root.classList.contains("loading")) {
        if (!dead && !L) root.classList.remove("loading");
        return done();
      }
      let fin = false;
      const finish = (): void => {
        if (fin || dead) return;
        fin = true;
        L.classList.add("out");
        try {
          sessionStorage.setItem("bek-loaded", "1");
        } catch {
          /* private mode */
        }
        later(650, () => {
          root.classList.remove("loading");
          done();
        });
      };
      (["pointerdown", "keydown", "wheel", "touchstart"] as const).forEach((ev) =>
        addEventListener(ev, finish, { once: true, passive: true, signal }),
      );
      later(2300, finish);
    });
  }

  /* 4.2 · a thin line on the page edge shows how far through the notebook you are */
  const prog = $(".prog");
  if (prog)
    hooks.push((y) => {
      const max = document.documentElement.scrollHeight - innerHeight;
      prog.style.setProperty("--p", max > 0 ? clamp(y / max).toFixed(4) : "0");
    });

  /* 3.5 · drawings only wobble while they are on screen */
  const io =
    "IntersectionObserver" in window
      ? new IntersectionObserver((es) => es.forEach((e) => e.target.classList.toggle("live", e.isIntersecting)))
      : null;
  const watchIll = (): void => {
    if (!io) return;
    $$<SVGElement>(".ill:not([data-io])").forEach((el) => {
      el.dataset.io = "1";
      io.observe(el);
    });
  };

  /* 2 · frozen → open: every heading arrives narrow and heavy; its last phrase opens up as you read it */
  type Head = { h: HTMLElement; o: HTMLElement };
  let heads: Head[] = [];
  const scanHeads = (): void => {
    heads = $$(".t-l, .t-xl")
      .map((h): Head | null => {
        let o = $(".fo", h) ?? $(".t-open", h);
        if (!o) {
          const tn = [...h.childNodes].reverse().find((n) => n.nodeType === 3 && (n.textContent ?? "").trim());
          if (!tn) return null;
          const m = (tn.textContent ?? "").match(/^([\s\S]*?)(\S+\s*)$/);
          if (!m) return null;
          o = document.createElement("span");
          o.textContent = m[2];
          tn.textContent = m[1];
          tn.parentNode?.insertBefore(o, tn.nextSibling);
        }
        o.classList.add("fo");
        return { h, o };
      })
      .filter((x): x is Head => x !== null);
  };
  const reserve = (): void =>
    heads.forEach(({ h }) => {
      h.style.minHeight = "";
      h.style.setProperty("--fo", "0");
      const a = h.offsetHeight;
      h.style.setProperty("--fo", "1");
      const b = h.offsetHeight;
      h.style.minHeight = Math.max(a, b) + "px";
    });
  if (!RM) {
    let rt: ReturnType<typeof setTimeout> | undefined;
    addEventListener(
      "resize",
      () => {
        clearTimeout(rt);
        rt = setTimeout(reserve, 200);
      },
      { signal },
    );
    hooks.push(() => {
      const vh = innerHeight;
      for (const { h } of heads) {
        const r = h.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) continue;
        h.style.setProperty("--fo", settle(clamp((vh * 0.82 - r.top) / (vh * 0.42))).toFixed(3));
      }
    });
  }

  const ready: Promise<void> = document.fonts.ready.then(preload);

  let firstPage = true;
  function mountPage(): () => void {
    const pageTimers: ReturnType<typeof setTimeout>[] = [];
    const isFirst = firstPage;
    firstPage = false;
    if (!isFirst) {
      setMenu(false);
      closeNote();
      fillMarks();
      if (lenis) {
        lenis.resize();
        if (!location.hash) lenis.scrollTo(0, { immediate: true, force: true });
      }
      if (root.classList.contains("leaving")) arriveIn();
    }
    scanHeads();
    if (!RM) reserve();
    void ready.then(() => {
      if (dead) return;
      pageTimers.push(setTimeout(watchIll, 60), setTimeout(watchIll, 900));
      if (!RM) pageTimers.push(setTimeout(reserve, 120));
    });
    return () => {
      pageTimers.forEach(clearTimeout);
      heads = [];
    };
  }

  function destroy(): void {
    if (dead) return;
    dead = true;
    ac.abort();
    cancelAnimationFrame(raf);
    timers.forEach(clearTimeout);
    timers.clear();
    io?.disconnect();
    lenis?.destroy();
    hooks.length = 0;
    root.classList.remove("menu-open", "leaving", "arriving", "arrived");
    if (current === core) current = null;
  }

  const core: Core = {
    root,
    RM,
    LITE,
    FINE,
    tr,
    lenis,
    sy,
    scrollToY,
    hooks,
    addHook,
    mouse: () => [mx, my, seen],
    ready,
    notes: NOTES,
    watchIll,
    reserve,
    mountPage,
    destroy,
    alive: () => !dead,
    MARK,
    markSVG,
    clamp,
    seg,
    release,
    settle,
    pop,
    rng,
  };
  current = core;
  raf = requestAnimationFrame(loop);
  return core;
}
