/* A page turning over like paper, not a board on a hinge.
   The bottom-right corner lifts first, then the fold line sweeps right → left. Everything past the fold is cut
   away from the page (clip-path), so the next page shows underneath; the cut part is drawn again, mirrored
   across the fold, as the back of the sheet lying over the page (the "flap"), shaded like curved paper.
   peel(stage, p): p = 0 flat, 1 fully turned. Pure 2D: cheap enough for phones. */

interface Flap {
  wrap: HTMLDivElement;
  sheet: HTMLDivElement;
  last: number;
}

const flaps = new WeakMap<HTMLElement, Flap>();

function flapFor(stage: HTMLElement): Flap {
  let f = flaps.get(stage);
  if (f && f.wrap.isConnected) return f;
  const wrap = document.createElement("div");
  wrap.className = "peel";
  wrap.setAttribute("aria-hidden", "true");
  const sheet = document.createElement("div");
  sheet.className = "peel-back";
  wrap.appendChild(sheet);
  stage.appendChild(wrap);
  f = { wrap, sheet, last: -1 };
  flaps.set(stage, f);
  return f;
}

type Pt = [number, number];

export function peel(stage: HTMLElement, p: number): void {
  const f = flapFor(stage);
  const k = Math.round(p * 1000) / 1000;
  if (k === f.last) return;
  f.last = k;
  if (k <= 0) {
    stage.style.clipPath = "";
    f.wrap.style.display = "none";
    return;
  }
  const W = stage.clientWidth,
    H = stage.clientHeight;
  // fold position and tilt: the tilt is largest mid-turn and gone at both ends, so the corner leads
  const X = W * (1 - k);
  const s = H * 0.2 * Math.sin(Math.PI * Math.min(1, k * 1.15));
  const T: Pt = [X + s, 0]; // fold meets the top edge
  const B: Pt = [X - s, H]; // fold meets the bottom edge
  // the page keeps everything left of the fold
  stage.style.clipPath = `polygon(0 0, ${T[0].toFixed(1)}px 0, ${B[0].toFixed(1)}px ${H}px, 0 ${H}px)`;

  // the part that was cut away (inside the page): fold top, page corners right of the fold, fold bottom
  const cut: Pt[] = [];
  const topX = Math.min(T[0], W);
  const botX = Math.min(B[0], W);
  if (T[0] < W) cut.push([topX, 0], [W, 0]);
  else {
    // fold leaves through the right edge before reaching the top: intersect with x = W
    const y = (H * (T[0] - W)) / (T[0] - B[0]);
    cut.push([W, y]);
  }
  if (B[0] < W) cut.push([W, H], [botX, H]);
  else return void (f.wrap.style.display = "none");

  // frame aligned with the fold: dir runs down the fold, n points into the cut side
  const dx = B[0] - T[0];
  const len = Math.hypot(dx, H);
  const dir: Pt = [dx / len, H / len];
  const n: Pt = [dir[1], -dir[0]];
  const loc = cut.map(([x, y]): Pt => {
    const rx = x - T[0],
      ry = y - T[1];
    return [rx * n[0] + ry * n[1], rx * dir[0] + ry * dir[1]]; // [distance from fold, position along fold]
  });
  const U = Math.max(1, ...loc.map((q) => q[0]));
  const vMin = Math.min(0, ...loc.map((q) => q[1]));
  const vMax = Math.max(len, ...loc.map((q) => q[1]));
  // box: right edge on the fold, extending away from the cut (over the kept page)
  const ox = T[0] + vMin * dir[0],
    oy = T[1] + vMin * dir[1];
  const phi = Math.atan2(-dx, H);
  const st = f.wrap.style;
  st.display = "block";
  st.width = U.toFixed(1) + "px";
  st.height = (vMax - vMin).toFixed(1) + "px";
  st.left = (ox - U).toFixed(1) + "px";
  st.top = oy.toFixed(1) + "px";
  st.transform = `rotate(${phi.toFixed(4)}rad)`;
  // the mirrored cut: a point d past the fold lands d before it
  f.sheet.style.clipPath = `polygon(${loc.map(([u, v]) => `${(U - u).toFixed(1)}px ${(v - vMin).toFixed(1)}px`).join(",")})`;
  // the curl is softer as the sheet lies flatter
  f.wrap.style.setProperty("--pk", String(Math.sin(Math.PI * k).toFixed(3)));
}

export function unpeel(stage: HTMLElement): void {
  stage.style.clipPath = "";
  const f = flaps.get(stage);
  if (f) {
    f.wrap.remove();
    flaps.delete(stage);
  }
}

/* While a page turns, the page underneath must lie still, as in a real notebook. In the scroll flow it is still
   rising into place, so it is held at the top by exactly the distance it still has to travel. */
const held = new WeakMap<HTMLElement, number>();

export function holdUnder(under: HTMLElement | null, turning: boolean): void {
  if (!under) return;
  const was = held.get(under) ?? 0;
  const top = under.getBoundingClientRect().top - was; // where it would be without the hold
  const want = turning && top > 0 ? -top : 0;
  if (Math.abs(want - was) < 0.5) return;
  held.set(under, want);
  under.style.translate = want ? `0 ${want.toFixed(1)}px` : "";
}
