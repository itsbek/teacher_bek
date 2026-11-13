/* Abuse guards for student notes: a bad-word check (English + Vietnamese) and a readable device summary.
   Pure functions, no I/O: easy to test and safe to run anywhere. */

/* ── bad words ─────────────────────────────────────────────────────────── */

/** Lowercase, undo common letter swaps (0→o, 1→i, 3→e, @→a, $→s, …), squeeze repeats ("fuuuck" → "fuck"). */
function normalise(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFC")
    .replace(/[0@]/g, (c) => (c === "0" ? "o" : "a"))
    .replace(/[1!|]/g, "i")
    .replace(/3/g, "e")
    .replace(/[$5]/g, "s")
    .replace(/7/g, "t")
    .replace(/(.)\1{2,}/g, "$1$1");
}

/** Vietnamese accents removed (đ → d too): catches "dit", "deo", "lon" written without diacritics. */
function stripAccents(text: string): string {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d");
}

/* Matched as whole words (or with symbols inside: f.u.c.k, f*ck). Kept short and unambiguous:
   words that are also innocent ("lon" = can, "cac" = the plural marker) are only matched WITH their accents. */
const EN = [
  "fuck", "fucking", "fucker", "fck", "fk", "f*ck", "shit", "bullshit", "bitch", "asshole", "arsehole", "dick", "dickhead",
  "cunt", "bastard", "slut", "whore", "fag", "faggot", "retard", "nigger", "nigga", "motherfucker", "wtf", "stfu", "porn", "pussy", "cock",
];
/** Vietnamese written with accents (exact) */
const VI_ACCENT = [
  "địt", "đụ", "đéo", "lồn", "cặc", "buồi", "đĩ", "đm", "đmm", "đcm", "đkm", "óc chó", "mẹ mày", "con chó", "súc vật", "chó má", "thằng chó",
  "ngu như chó", "đần độn",
];
/** Vietnamese abbreviations and no-accent forms that are not ordinary words */
const VI_PLAIN = [
  "dit", "djt", "dit me", "dit con me", "du ma", "duma", "dume", "deo", "dm", "dmm", "dcm", "dkm", "vcl", "vkl", "vl", "clm", "cmm", "cmn",
  "loz", "buoi", "oc cho", "me may", "suc vat", "cho ma", "thang cho",
];

const esc = (w: string) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "[\\s._*-]*");
/* letters may be split by dots, stars or dashes ("f.u.c.k"): allow those between letters of single words */
const spread = (w: string) =>
  /\s/.test(w) ? esc(w) : [...w].map((c) => c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("[._*-]?");
const wordRe = (list: string[]) => new RegExp(`(^|[^\\p{L}\\p{N}])(?:${list.map(spread).join("|")})(?=$|[^\\p{L}\\p{N}])`, "iu");
const RE_EN = wordRe(EN);
const RE_VI_ACCENT = wordRe(VI_ACCENT);
const RE_VI_PLAIN = wordRe(VI_PLAIN);

/** True when the text contains a word on the list: as written, and (for the plain list) typed without accents. */
export function hasBadWords(...parts: (string | undefined)[]): boolean {
  const raw = normalise(parts.filter(Boolean).join(" \n "));
  // English also checked with every doubled letter squeezed, for stretched words ("fuuuck", "shiiit")
  const squeezed = raw.replace(/(\p{L})\1+/gu, "$1");
  return RE_EN.test(raw) || RE_EN.test(squeezed) || RE_VI_ACCENT.test(raw) || isPlainHit(raw);
}

/** The plain list only counts where the matched word itself carries no accents in the original text. */
function isPlainHit(raw: string): boolean {
  const re = new RegExp(RE_VI_PLAIN.source, "giu");
  const plain = stripAccents(raw);
  let m: RegExpExecArray | null;
  while ((m = re.exec(plain))) {
    const start = m.index + m[1].length;
    const original = raw.slice(start, start + (m[0].length - m[1].length));
    if (original === stripAccents(original)) return true;
  }
  return false;
}

/* ── device summary from the user agent ───────────────────────────────── */

export interface DeviceInfo {
  device: string; // "iPhone", "Samsung SM-A515F", "Mac", "Windows PC"
  os: string; // "iOS 18.1", "Android 14", "macOS", "Windows 10/11"
  browser: string; // "Safari", "Chrome 131", "Zalo app", "Facebook app"
  type: "phone" | "tablet" | "desktop" | "bot" | "unknown";
}

export function describeUA(ua: string, model?: string): DeviceInfo {
  const u = ua || "";
  let os = "unknown",
    device = "unknown",
    type: DeviceInfo["type"] = "unknown";
  let m: RegExpMatchArray | null;
  if (/bot|crawler|spider|curl|wget|python|headless/i.test(u)) type = "bot";
  if ((m = u.match(/iPhone OS (\d+)[._](\d+)/))) {
    os = `iOS ${m[1]}.${m[2]}`;
    device = "iPhone";
    type = "phone";
  } else if ((m = u.match(/iPad.*OS (\d+)[._](\d+)/))) {
    os = `iPadOS ${m[1]}.${m[2]}`;
    device = "iPad";
    type = "tablet";
  } else if ((m = u.match(/Android (\d+(?:\.\d+)?)(?:;\s*([^;)]+))?/))) {
    os = `Android ${m[1]}`;
    const raw = (model || (m[2] && !/^(K|wv|Linux|U)$/.test(m[2].trim()) ? m[2] : "")).trim();
    device = raw ? `Android ${raw.replace(/\s*Build\/.*$/, "")}` : "Android phone";
    type = /Mobile/.test(u) ? "phone" : "tablet";
  } else if (/Macintosh|Mac OS X/.test(u)) {
    os = "macOS";
    device = "Mac";
    type = "desktop";
  } else if ((m = u.match(/Windows NT (\d+\.\d+)/))) {
    os = m[1] === "10.0" ? "Windows 10/11" : `Windows NT ${m[1]}`;
    device = "Windows PC";
    type = "desktop";
  } else if (/CrOS/.test(u)) {
    os = "ChromeOS";
    device = "Chromebook";
    type = "desktop";
  } else if (/Linux/.test(u)) {
    os = "Linux";
    device = "Linux PC";
    type = "desktop";
  }
  let browser = "unknown";
  if (/Zalo/i.test(u)) browser = "Zalo app";
  else if (/FBAN|FBAV|FB_IAB/.test(u)) browser = "Facebook app";
  else if (/Instagram/.test(u)) browser = "Instagram app";
  else if (/TikTok|musical_ly|BytedanceWebview/i.test(u)) browser = "TikTok app";
  else if ((m = u.match(/coc_coc_browser\/(\d+)/))) browser = `Cốc Cốc ${m[1]}`;
  else if ((m = u.match(/Edg(?:A|iOS)?\/(\d+)/))) browser = `Edge ${m[1]}`;
  else if ((m = u.match(/SamsungBrowser\/(\d+)/))) browser = `Samsung Internet ${m[1]}`;
  else if ((m = u.match(/(?:OPR|Opera)\/(\d+)/))) browser = `Opera ${m[1]}`;
  else if ((m = u.match(/(?:Firefox|FxiOS)\/(\d+)/))) browser = `Firefox ${m[1]}`;
  else if ((m = u.match(/(?:Chrome|CriOS)\/(\d+)/))) browser = `Chrome ${m[1]}`;
  else if ((m = u.match(/Version\/(\d+(?:\.\d+)?).*Safari/))) browser = `Safari ${m[1]}`;
  return { device, os, browser, type };
}

/** Short stable key for "same browser": the UA without version numbers, hashed. */
export async function uaKey(ua: string): Promise<string> {
  const base = (ua || "").replace(/\d+([._]\d+)*/g, "#");
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(base));
  return [...new Uint8Array(buf)]
    .slice(0, 6)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
