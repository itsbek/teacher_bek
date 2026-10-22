#!/usr/bin/env node
/*
 * design/qa/contrast.mjs — WCAG 2.x contrast audit for the "Red Pen" tokens.
 *
 *   node design/qa/contrast.mjs > design/qa/contrast-report.md
 *
 * Parses design/tokens/tokens.css (light :root, both dark blocks) and the
 * .chapter--chalk overrides in design/tokens/base.css, resolves var() chains
 * per theme, composites alpha colours over their background, and prints a
 * markdown report to stdout. Also lists hard-coded colour / opacity / colour-mix
 * hits in components.css, base.css and pages/*.html.
 *
 * Exit code 1 if any text (4.5:1) or non-text (3:1) pair fails. Plain Node, no deps.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DESIGN = join(HERE, '..');
const read = (p) => readFileSync(p, 'utf8');
const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');

const TEXT = 'text';
const NONTEXT = 'non-text';
const INFO = 'info';
const AA_NORMAL = 4.5;
const AA_LARGE = 3.0;

/* ---------- CSS parsing ---------- */

function rules(css) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  const src = stripComments(css);
  let m;
  while ((m = re.exec(src))) {
    const decls = {};
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':');
      if (i < 0) continue;
      const k = d.slice(0, i).trim();
      if (k.startsWith('--')) decls[k] = d.slice(i + 1).trim();
    }
    out.push({ selector: m[1].trim(), decls });
  }
  return out;
}

const tokenRules = rules(read(join(DESIGN, 'tokens', 'tokens.css')));
const baseRules = rules(read(join(DESIGN, 'tokens', 'base.css')));
const merged = (rs, selector) =>
  Object.assign({}, ...rs.filter((r) => r.selector === selector).map((r) => r.decls));

const rootMap = merged(tokenRules, ':root');
const darkMedia = merged(tokenRules, ':root:not([data-theme="light"])');
const darkAttr = merged(tokenRules, ':root[data-theme="dark"]');
const chalkOverrides = merged(baseRules, '.chapter--chalk');
const darkBlocksIdentical = Object.keys({ ...darkMedia, ...darkAttr }).every(
  (k) => darkMedia[k] === darkAttr[k],
);

const THEMES = {
  light: { title: 'Light — "Paper" (:root)', map: rootMap },
  dark: {
    title: 'Dark — "Blackboard" ([data-theme="dark"] / prefers-color-scheme: dark)',
    map: { ...rootMap, ...darkAttr },
  },
};
for (const t of Object.values(THEMES)) t.chalk = { ...t.map, ...chalkOverrides };

/* ---------- colour maths ---------- */

function raw(map, name, seen = new Set()) {
  if (seen.has(name)) throw new Error(`cycle at ${name}`);
  seen.add(name);
  const v = map[name];
  if (v === undefined) throw new Error(`token ${name} is not defined`);
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  return ref ? raw(map, ref[1], seen) : v;
}

function parseHex(v, name) {
  const m = v.match(/^#([0-9a-fA-F]{3,8})$/);
  if (!m) throw new Error(`${name} is not a hex colour: ${v}`);
  let h = m[1];
  if (h.length === 3 || h.length === 4) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 && h.length !== 8) throw new Error(`${name} bad hex length: ${v}`);
  const n = (i) => parseInt(h.slice(i, i + 2), 16);
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) / 255 : 1 };
}

const tok = (map, name) => parseHex(raw(map, name), name);
const over = (fg, bg) => ({
  r: fg.r * fg.a + bg.r * (1 - fg.a),
  g: fg.g * fg.a + bg.g * (1 - fg.a),
  b: fg.b * fg.a + bg.b * (1 - fg.a),
  a: 1,
});
const lin = (c) => {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
};
const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c) =>
  '#' + [c.r, c.g, c.b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
const hexOf = (c) => toHex(c) + (c.a < 1 ? ` @${Math.round(c.a * 100)}%` : '');
const f2 = (x) => x.toFixed(2);

/* Smallest move of `col` toward black or white such that passes(candidate) holds. */
function minimalShift(col, passes) {
  let best = null;
  for (const towards of [{ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }]) {
    for (let s = 0; s <= 1.0001; s += 0.001) {
      const c = {
        r: Math.round(col.r + (towards.r - col.r) * s),
        g: Math.round(col.g + (towards.g - col.g) * s),
        b: Math.round(col.b + (towards.b - col.b) * s),
        a: 1,
      };
      if (passes(c)) {
        const r = passes.ratioOf ? passes.ratioOf(c) : null;
        if (!best || s < best.s) best = { hex: toHex(c), s, ratio: r };
        break;
      }
    }
  }
  return best;
}

/* ---------- checks ---------- */

// Semantic pairs per surface. [fgToken, bgToken, kind, where used]
const ROWS = {
  paper: [
    ['--color-fg', '--color-bg', TEXT, 'Body copy, headings, nav, primary text'],
    ['--color-fg-soft', '--color-bg', TEXT, 'Eyebrows, labels, figcaptions, .t-soft, .help, .field__help, .facts dt, .progress, .legend, placeholders (base.css:143)'],
    ['--color-accent', '--color-bg', TEXT, '.t-red (base.css:168), .field__error (base.css:149), .tag--temp, .pen-note, .hand, .plan__rec, .missing b (components.css:575)'],
    ['--color-bg', '--color-fg', TEXT, 'Inverted fill: .btn default (base.css:88), .seg pressed (components.css:101), .vidcard__play'],
    ['--color-on-accent', '--color-accent', TEXT, '.btn--primary label (base.css:108, components.css:83); hover/active'],
    ['--color-on-highlight', '--color-highlight', TEXT, '.t-highlight (base.css:167), one word per screen'],
    ['--color-selection-fg', '--color-selection-bg', TEXT, '::selection (base.css:48)'],
    ['--color-focus', '--color-bg', NONTEXT, 'focus-visible outline, 3px (--focus-ring)'],
    ['--color-highlight', '--color-bg', INFO, 'Highlighter fill vs paper: background-only, never carries text alone'],
    ['--color-rule-strong', '--color-bg', INFO, 'Dashed ghost/turnstile borders (base.css:115, components.css:573), link hover underline (base.css:64): decorative hairline'],
  ],
  paper2: [
    ['--color-fg', '--color-bg-2', TEXT, 'Body copy on paper-2 chapters (.problem, .proof-sec, form-sheet)'],
    ['--color-fg-soft', '--color-bg-2', TEXT, 'Labels and captions on paper-2 chapters'],
    ['--color-accent', '--color-bg-2', TEXT, 'Red-pen annotations on paper-2 chapters'],
    ['--color-on-highlight', '--color-highlight', TEXT, '.t-highlight inside paper-2 chapter (home.html:140)'],
    ['--color-focus', '--color-bg-2', NONTEXT, 'focus-visible outline on paper-2 chapters'],
    ['--color-highlight', '--color-bg-2', INFO, 'Highlighter fill vs paper-2: background-only'],
  ],
  chalk: [
    ['--color-fg', '--color-bg', TEXT, 'Chalk body copy and headings (.chapter--chalk, home.html:144)'],
    ['--color-fg-soft', '--color-bg', TEXT, 'Chalk labels and soft text (chalk-soft)'],
    ['--color-accent', '--color-bg', TEXT, 'Chalk-pen annotations: .t-red, .hand, .pen-note inside chalk chapter'],
    ['--color-on-accent', '--color-accent', TEXT, '.btn--primary inside chalk chapter (base.css:215 hard-coded #14201A on chalk-pen)'],
    ['--color-chapter-chalk', '--color-chapter-chalk-fg', TEXT, 'Filled .btn (non-primary) inside chalk chapter (base.css:119, components.css:728)'],
    ['--color-on-highlight', '--color-highlight', TEXT, '.t-highlight inside chalk chapter (base.css:219-220, hard-coded #E5CE3E)'],
    ['--color-focus', '--color-bg', NONTEXT, 'focus-visible outline inside chalk chapter (base.css:56, 221)'],
    ['--color-highlight', '--color-bg', INFO, 'Chalk highlighter fill vs chalk-green: background-only'],
  ],
};

// Derived translucent surfaces (color-mix / opacity). Evaluated per theme.
// fg = token name whose colour is suggested-shifted; tint = {pct, base} for stage-style mixes.
function derivedChecks(map) {
  const fgTok = (n) => (m) => tok(m, n);
  const alpha = (n, a) => (m) => ({ ...tok(m, n), a });
  const bgTok = (n) => (m) => tok(m, n);
  const mixed = (n, a, base = '--color-bg') => (m) => over(alpha(n, a)(m), tok(m, base));
  return [
    { surface: 'paper', label: 'Text on input hover tint', kind: TEXT, map, fg: '--color-fg', fgFn: fgTok('--color-fg'), bgFn: mixed('--color-fg', 0.04), where: 'base.css:144 .input:hover color-mix(fg 4%)' },
    { surface: 'paper', label: 'Input text on invalid tint', kind: TEXT, map, fg: '--color-fg', fgFn: fgTok('--color-fg'), bgFn: mixed('--color-accent', 0.06), where: 'base.css:148 aria-invalid color-mix(accent 6%)' },
    { surface: 'paper', label: 'Text on .stage (color-mix fg 14% over bg)', kind: TEXT, map, fg: '--color-fg', fgFn: fgTok('--color-fg'), bgFn: mixed('--color-fg', 0.14), tint: { token: '--color-fg', base: '--color-bg' }, where: 'components.css:531 .stage (form-sheet frames)' },
    { surface: 'paper', label: 'Soft text on .stage (color-mix fg 14% over bg)', kind: TEXT, map, fg: '--color-fg-soft', fgFn: fgTok('--color-fg-soft'), bgFn: mixed('--color-fg', 0.14), tint: { token: '--color-fg', base: '--color-bg' }, where: 'components.css:531 .stage' },
    { surface: 'paper', label: 'Accent ring at opacity .8 (room plan free-seat cue, non-text)', kind: NONTEXT, map, fg: '--color-accent', fgFn: alpha('--color-accent', 0.8), fgAlpha: 0.8, bgFn: bgTok('--color-bg'), where: 'components.css:441 .roomplan .ring opacity .8, stroke 2 (the state cue for a free seat)' },
    { surface: 'paper', label: 'Turnstile placeholder border (fg 55%, non-text)', kind: NONTEXT, map, fg: '--color-fg', fgFn: alpha('--color-fg', 0.55), fgAlpha: 0.55, bgFn: bgTok('--color-bg'), where: 'components.css:573 .turnstile border' },
  ];
}

function evaluate(c) {
  const bgC = c.bgFn ? c.bgFn(c.map) : tok(c.map, c.bg);
  const fg0 = c.fgFn ? c.fgFn(c.map) : tok(c.map, c.fg);
  const fgC = fg0.a < 1 ? over(fg0, bgC) : fg0;
  const r = ratio(fgC, bgC);
  const needed = c.kind === NONTEXT ? AA_LARGE : AA_NORMAL;
  const pass = c.kind === INFO ? null : r >= needed;
  const out = { ...c, fgC, bgC, r, pass, needed, fgAlpha: fg0.a, fgHex: hexOf(fg0), bgHex: toHex(bgC) };
  if (pass === false) {
    // FG token: shift the opaque token colour, keeping its alpha, until it passes against the bg.
    const tokCol = tok(c.map, c.fg);
    if (tokCol.a === 1) {
      const sug = minimalShift(tokCol, (cand) => {
        const comp = over({ ...cand, a: fg0.a }, bgC);
        return ratio(comp, bgC) >= needed;
      });
      if (sug) out.fgSuggest = { ...sug, ratio: ratio(over({ ...parseHex(sug.hex, 'x'), a: fg0.a }, bgC), bgC) };
    }
    // BG token (fill pairs only): shift the bg token against the fg.
    if (c.bg) {
      const sug = minimalShift(tok(c.map, c.bg), (cand) => ratio(fgC, cand) >= needed);
      if (sug) out.bgSuggest = { ...sug, ratio: ratio(fgC, parseHex(sug.hex, 'x')) };
    }
    // Tint reduction for translucent surfaces: largest tint still passing.
    if (c.tint) {
      const base = tok(c.map, c.tint.base);
      const ink = tok(c.map, c.tint.token);
      for (let pct = 16; pct >= 0; pct--) {
        const bg2 = over({ ...ink, a: pct / 100 }, base);
        if (ratio(fgC, bg2) >= needed) {
          out.tintSuggest = { pct, hex: toHex(bg2), ratio: ratio(fgC, bg2) };
          break;
        }
      }
    }
  }
  return out;
}

function themeChecks(themeName) {
  const { map, chalk } = THEMES[themeName];
  const list = [];
  for (const [fg, bg, kind, where] of ROWS.paper)
    list.push({ surface: 'paper (--color-bg)', fg, bg, kind, where, map });
  for (const [fg, bg, kind, where] of ROWS.paper2)
    list.push({ surface: 'paper-2 (--color-bg-2)', fg, bg, kind, where, map });
  for (const [fg, bg, kind, where] of ROWS.chalk)
    list.push({ surface: 'chalk chapter', fg, bg, kind, where, map: chalk });
  list.push(...derivedChecks(map));
  return list.map((c) => evaluate(c));
}

/* ---------- hard-coded colour scan ---------- */

function scanHardcoded() {
  const pagesDir = join(DESIGN, 'pages');
  const files = [
    join(DESIGN, 'components', 'components.css'),
    join(DESIGN, 'tokens', 'base.css'),
    ...readdirSync(pagesDir).filter((f) => f.endsWith('.html')).map((f) => join(pagesDir, f)),
  ];
  const hits = [];
  const HEX = /#[0-9a-fA-F]{3,8}(?![0-9A-Za-z_-])/;
  for (const f of files) {
    read(f).split('\n').forEach((line, i) => {
      const kinds = [];
      if (HEX.test(line)) kinds.push('hex');
      if (/\b(rgba?|hsla?|oklch|oklab)\(/.test(line)) kinds.push('rgb/hsl/oklch');
      if (/color-mix\(/.test(line)) kinds.push('color-mix');
      const op = line.match(/opacity\s*[:=]\s*["']?\s*(\d*\.?\d+)/);
      if (op && Number(op[1]) < 1) kinds.push(`opacity ${op[1]}`);
      if (kinds.length) {
        const rel = f.slice(DESIGN.length + 1);
        hits.push({ where: `${rel}:${i + 1}`, kinds: kinds.join(', '), text: line.trim().slice(0, 150) });
      }
    });
  }
  return hits;
}

/* ---------- output ---------- */

const status = (c, which) => {
  if (c.kind === INFO) return 'info';
  if (which === 'normal') {
    if (c.kind === NONTEXT) return 'n/a (non-text)';
    return c.pass ? 'PASS' : 'FAIL';
  }
  if (c.kind === NONTEXT) return c.pass ? 'PASS (3:1 non-text)' : 'FAIL (3:1 non-text)';
  if (c.kind === INFO) return 'info';
  return c.r >= AA_LARGE ? 'PASS' : 'FAIL';
};

const fgLabel = (c) => (c.fgFn ? c.label : `\`${c.fg}\``) + ` ${c.fgHex}`;
const bgLabel = (c) => (c.bgFn ? `derived ${c.bgHex}` : `\`${c.bg}\` ${c.bgHex}`);

const out = [];
const log = (s = '') => out.push(s);
const summary = { text: { pass: 0, fail: 0 }, nontext: { pass: 0, fail: 0 } };
const failures = [];

log('# Contrast audit (generated by design/qa/contrast.mjs)');
log('');
log(`Generated ${new Date().toISOString().slice(0, 10)}. Sources: design/tokens/tokens.css, design/tokens/base.css (.chapter--chalk), design/components/components.css, design/pages/*.html.`);
log('');
log(`Dark blocks identical (media query vs data-theme): **${darkBlocksIdentical ? 'yes' : 'NO — see differences'}**`);
log('');

for (const themeName of Object.keys(THEMES)) {
  const theme = THEMES[themeName];
  const checks = themeChecks(themeName);
  log(`## ${theme.title}`);
  log('');
  log('| FG | BG | ratio | AA normal (4.5) | AA large (3.0) | where used |');
  log('|---|---|---|---|---|---|');
  for (const c of checks) {
    const label = c.label ?? `${c.surface}: ${c.fg}`;
    const fgCell = c.fgFn ? `\`${c.fg}\` ${c.fgHex}` : `\`${c.fg}\` ${c.fgHex}`;
    const bgCell = c.bgFn ? `${c.bgHex} (derived, ${c.surface})` : `\`${c.bg}\` ${c.bgHex} (${c.surface})`;
    const fgText = c.label && c.fgFn ? `${c.label}: ${fgCell}` : fgCell;
    log(`| ${fgText} | ${bgCell} | ${f2(c.r)} | ${status(c, 'normal')} | ${status(c, 'large')} | ${c.where ?? ''} |`);
    if (c.kind === INFO) continue;
    const bucket = c.kind === TEXT ? summary.text : summary.nontext;
    if (c.pass) bucket.pass++;
    else {
      bucket.fail++;
      failures.push({ theme: themeName, c, label });
    }
  }
  log('');
}

log('## Summary');
log('');
log(`- Text pairs (4.5:1): ${summary.text.pass} pass, ${summary.text.fail} fail`);
log(`- Non-text pairs (3:1): ${summary.nontext.pass} pass, ${summary.nontext.fail} fail`);
log('- Highlighter and rule rows are informational (background-only / decorative) and not counted.');
log('');

log('## Failures');
log('');
if (!failures.length) log('None.');
for (const { theme, c, label } of failures) {
  const parts = [];
  parts.push(`- **${theme} / ${c.surface}** — ${label}: \`${c.fg}\` ${c.fgHex} on ${c.bgFn ? 'derived' : `\`${c.bg}\``} ${c.bgHex} = **${f2(c.r)}:1** (needs ${c.needed}:1).`);
  if (c.fgSuggest) parts.push(`Shift \`${c.fg}\` to **${c.fgSuggest.hex}** (${f2(c.fgSuggest.ratio)}:1; ${Math.round(c.fgSuggest.s * 100)}% moved toward black or white); this changes every surface using the token.`);
  if (c.tintSuggest) parts.push(`Or reduce the tint from ${16}% to ${c.tintSuggest.pct}% (${f2(c.tintSuggest.ratio)}:1).`);
  if (c.bgSuggest) parts.push(`Or move \`${c.bg}\` to **${c.bgSuggest.hex}** (${f2(c.bgSuggest.ratio)}:1).`);
  if (c.where) parts.push(`Used: ${c.where}.`);
  log(parts.join(' '));
}
log('');
log('Rules applied: red pen (`--red-pen` / `--chalk-pen`) must pass 4.5:1 wherever it is used for small text (corrections, hand notes, error text); highlighter (`--highlight`) is background-only, so only the ink on it is checked.');
log('');

log('## Hard-coded colour, opacity and colour-mix findings');
log('');
log('Every hit below is a literal that bypasses the token layer. Translucent surfaces that carry text are checked above under "derived" rows; the rest are non-text decoration or cannot be computed.');
log('');
log('| Location | Kind | Line |');
log('|---|---|---|');
for (const h of scanHardcoded()) log(`| \`${h.where}\` | ${h.kinds} | \`${h.text.replace(/\|/g, '\\|')}\` |`);
log('');

process.stdout.write(out.join('\n') + '\n');
process.exitCode = failures.length ? 1 : 0;
