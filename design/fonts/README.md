# Fonts — teacherbek.com revamp (phase 2a, P2a.3)

Self-hosted woff2 subsets for Playfair and Inter, plus `fonts.css` with `@font-face`
rules, unicode-range splits, and metric-matched fallbacks.

## Sources

Downloaded from `google/fonts` at commit **`45e3d5269e4a17d823f6d84470bc084dc5ae46f6`** (main HEAD at download time, 2026-10-21).

| File | Source |
|---|---|
| Playfair variable roman | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/playfair/Playfair%5Bopsz%2Cwdth%2Cwght%5D.ttf |
| Playfair variable italic | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/playfair/Playfair-Italic%5Bopsz%2Cwdth%2Cwght%5D.ttf |
| Playfair OFL | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/playfair/OFL.txt (copied to `OFL-Playfair.txt`) |
| Inter variable roman | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/inter/Inter%5Bopsz%2Cwght%5D.ttf |
| Inter variable italic | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/inter/Inter-Italic%5Bopsz%2Cwght%5D.ttf |
| Inter OFL | https://raw.githubusercontent.com/google/fonts/45e3d5269e4a17d823f6d84470bc084dc5ae46f6/ofl/inter/OFL.txt (copied to `OFL-Inter.txt`) |

Directory listings came from `https://api.github.com/repos/google/fonts/contents/ofl/playfair` and `.../ofl/inter`.
Last-changed commits for those paths: playfair `8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5`, inter `0b58fb370093f9a9f4ff785d94405710b79de67c`.

Upstream versions (from the font tables): Playfair OS/2 v4, upm 1240; Inter OS/2 v4, upm 2048.

## Licence

Both families are licensed under the SIL Open Font License 1.1. The licence texts are
included as `OFL-Playfair.txt` and `OFL-Inter.txt` in this folder. The OFL permits
self-hosting and subsetting. The fonts must not be sold on their own, and the OFL text
must travel with the files.

## Subsets

Both subsets keep the remaining variation axes and these layout features where present:
`kern, liga, calt, ccmp, mark, mkmk, locl, tnum, lnum, case, ss01`.

**latin-vi** (`*-latin-vi.woff2`):
`U+0020-007E` (Basic Latin), `U+00A0-017F` (Latin-1 Supplement + Latin Extended-A), `U+01A0-01B0` (Ơ ơ Ư ư),
`U+0300-036F` (combining marks), `U+1E00-1EFF` (Latin Extended Additional, incl. Vietnamese),
`U+2000-206F` (general punctuation), `U+20AB` (₫), `U+20AC` (€), `U+2190-2199` (arrows), `U+2713` (✓), `U+2717` (✗).

**cyrillic** (`*-cyrillic.woff2`):
`U+0300-036F`, `U+0400-045F`, `U+0490-0491`, `U+04B0-04B1`, `U+2116` (№), `U+2000-206F`, `U+20AC`.

## Axis settings (shipped, P2a.8 revision)

| Family | Axis | Setting |
|---|---|---|
| Playfair roman | opsz 5-1200 | **kept variable** (display sizes use opsz 1200 / 400 / 72) |
| Playfair roman | wdth / wght | **pinned 100 / 500** (every Playfair role is weight 500; no 400/600 requests, no faux bold) |
| Playfair italic | all axes | **static instance: opsz 72, wdth 100, wght 400** (accent words only; nothing animates italic axes) |
| Inter roman | opsz / wght | opsz pinned 14, wght 400-600 variable |
| Inter italic | - | **not shipped, never used** (`em, i` are reset to normal in base.css) |

Subset layout features: roman `kern, liga, ccmp, mark, mkmk, locl, lnum, tnum`; italic `kern, liga, ccmp, mark, mkmk, locl`.

**Cyrillic unicode-ranges contain only Cyrillic code points** (`U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116`).
The previous ranges also listed `U+0300-036F, U+2000-206F, U+20AC`, which overlap the latin-vi faces, so any curly quote or
dash on a VI/EN page pulled the Cyrillic files (and the italic ones) in. That was the main cause of the 484 KB font weight.

## File sizes (shipped, bytes)

| File | Bytes | Loads when |
|---|---:|---|
| playfair-latin-vi.woff2 | 73,772 | every page (preloaded) |
| playfair-italic-latin-vi.woff2 | 40,852 | pages with an italic accent word (all current pages) |
| inter-latin-vi.woff2 | 52,436 | every page |
| playfair-cyrillic.woff2 | 40,956 | RU only |
| playfair-italic-cyrillic.woff2 | 19,104 | RU italic only |
| inter-cyrillic.woff2 | 22,604 | RU only |

VI/EN page: 73,772 + 40,852 + 52,436 = **167,060 bytes** (measured on the wire: 167,627 B incl. headers).
RU page: adds 82,664 bytes of Cyrillic (about 83 KB) = ~250 KB. Total shipped: 249,724 bytes in 6 files.

## Coverage check

Test string: `Tiếng Việt: ặ ẫ ỗ ữ ự ợ đ Ơ Ư — Русский: Щёлкнуть ₫ ✓` (re-checked after P2a.8: Playfair roman + italic still cover every VI and RU glyph except ✓)

Checked with `fontTools` cmap lookups across the two subsets of each family:

- **Inter** (latin-vi ∪ cyrillic): every character is present, including ặ ẫ ỗ ữ ự ợ đ Ơ Ư ₫ — Щ ё ✓.
- **Playfair** (latin-vi ∪ cyrillic): every character is present **except `✓` (U+2713)**. Playfair has no check mark glyph,
  so `✓` falls through to a system font.

**✓ is not in Playfair — draw check marks as SVG (handwriting set) or use Inter.**

Per-file coverage is as expected: each file contains only its own subset. For example,
`inter-cyrillic.woff2` has no Latin letters, because the latin-vi file handles those via unicode-range.

## Metric computation (fallback faces)

Metrics were read with fontTools from the webfont and the reference font.
Playfair was instanced at wdth 100, wght 400, opsz 16. Inter was instanced at wght 400, opsz 14,
matching the pinned axis values.

Reference fonts are on macOS at `/System/Library/Fonts/Supplemental/` (`Georgia.ttf`, `Arial.ttf`, `Times New Roman.ttf`).

The `size-adjust` ratio uses the English-letter-frequency weighted average advance
(a–z plus space, weights from standard English frequency tables), divided by upm.
OS/2 `xAvgCharWidth` was not used because it is not comparable across OS/2 versions
(v4 for the webfonts, v3 for Georgia and Arial).

| | Webfont | Reference | size-adjust |
|---|---|---|---|
| Playfair vs Georgia | 0.4381 em (543.3/1240) | 0.4459 em (913.2/2048) | 98.25% |
| Inter vs Arial | 0.4805 em (984.0/2048) | 0.4471 em (915.6/2048) | 107.47% |

Overrides use the webfont's hhea metrics divided by size-adjust. This assumes the browser scales overrides with the adjusted size.
Verify this in Chrome and Safari (DevTools → Rendering → font metrics or measure a line box) before shipping. If the overrides are not scaled, drop the `/ size-adjust` term.

| Face | ascent-override | descent-override | line-gap-override |
|---|---|---|---|
| Playfair Fallback | 90.12% | 32.01% | 0% |
| Inter Fallback | 90.14% | 22.44% | 0% |

Fallback caveats:
- `Playfair Fallback` is tuned for Georgia. Times New Roman (the second `local()` source) is about 7.5% narrower and would shift line widths.
- `Inter Fallback` is tuned for Arial. Helvetica Neue was not measured.

## Preload

Preload only the primary display/serif file (`playfair-latin-vi.woff2`), as a `<link>` in `<head>`:

```html
<link rel="preload" href="/fonts/playfair-latin-vi.woff2" as="font" type="font/woff2" crossorigin>
```

Adjust the path to wherever the files are served from.

## Regenerating

Requires Python 3 and a venv. Work in a scratch directory. Downloads are treated as untrusted; nothing downloaded is executed.

```bash
SCRATCH=/path/to/scratch
python3 -m venv "$SCRATCH/fontenv"
"$SCRATCH/fontenv/bin/pip" install fonttools brotli

SHA=45e3d5269e4a17d823f6d84470bc084dc5ae46f6
B=https://raw.githubusercontent.com/google/fonts/$SHA/ofl
mkdir -p "$SCRATCH/font-src" "$SCRATCH/build" && cd "$SCRATCH/font-src"
curl -sfL -o Playfair.ttf        "$B/playfair/Playfair%5Bopsz%2Cwdth%2Cwght%5D.ttf"
curl -sfL -o Playfair-Italic.ttf "$B/playfair/Playfair-Italic%5Bopsz%2Cwdth%2Cwght%5D.ttf"
curl -sfL -o Inter.ttf           "$B/inter/Inter%5Bopsz%2Cwght%5D.ttf"
curl -sfL -o Inter-Italic.ttf    "$B/inter/Inter-Italic%5Bopsz%2Cwght%5D.ttf"
curl -sfL -o Playfair-OFL.txt    "$B/playfair/OFL.txt"
curl -sfL -o Inter-OFL.txt       "$B/inter/OFL.txt"

FT="$SCRATCH/fontenv/bin/fonttools"
PS="$SCRATCH/fontenv/bin/pyftsubset"
cd "$SCRATCH/build"

# 1. Pin axes (P2a.8): roman wght 500 (opsz stays variable), italic fully static (opsz 72, wght 400)
$FT varLib.instancer "$SCRATCH/font-src/Playfair.ttf"        wdth=100 wght=500 -o Playfair-lim.ttf
$FT varLib.instancer "$SCRATCH/font-src/Playfair-Italic.ttf" wdth=100 wght=400 opsz=72 -o Playfair-Italic-lim.ttf
$FT varLib.instancer "$SCRATCH/font-src/Inter.ttf"           opsz=14 wght=400:600 -o Inter-lim.ttf
# (Inter italic is not built: never used)

# 2. Subset to woff2
LATIN="U+0020-007E,U+00A0-017F,U+01A0-01B0,U+0300-036F,U+1E00-1EFF,U+2000-206F,U+20AB,U+20AC,U+2190-2199,U+2713,U+2717"
CYR="U+0300-036F,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116,U+2000-206F,U+20AC"   # file content; the CSS unicode-range is Cyrillic-only
PS="$SCRATCH/fontenv/bin/pyftsubset"
sub() { "$PS" "$1" --unicodes="$2" --layout-features="$3" --flavor=woff2 --no-hinting --desubroutinize --output-file="$4"; }
sub Playfair-lim.ttf        "$LATIN" kern,liga,ccmp,mark,mkmk,locl,lnum,tnum Playfair-latin-vi.woff2
sub Playfair-lim.ttf        "$CYR"   kern,liga,ccmp,mark,mkmk,locl,lnum,tnum Playfair-cyrillic.woff2
sub Playfair-Italic-lim.ttf "$LATIN" kern,liga,ccmp,mark,mkmk,locl           Playfair-Italic-latin-vi.woff2
sub Playfair-Italic-lim.ttf "$CYR"   kern,liga,ccmp,mark,mkmk,locl           Playfair-Italic-cyrillic.woff2
FEAT="kern,liga,calt,ccmp,mark,mkmk,locl,tnum,lnum,case,ss01"
sub Inter-lim.ttf "$LATIN" "$FEAT" Inter-latin-vi.woff2
sub Inter-lim.ttf "$CYR"   "$FEAT" Inter-cyrillic.woff2
# Rename into design/fonts/ with lowercase names, for example:
#   cp Playfair-latin-vi.woff2 .../design/fonts/playfair-latin-vi.woff2

```

Metrics for the fallback faces:

```bash
$FT varLib.instancer "$SCRATCH/font-src/Playfair.ttf" wdth=100 wght=400 opsz=16 -o pf-body-static.ttf
$FT varLib.instancer "$SCRATCH/font-src/Inter.ttf"    opsz=14 wght=400 -o inter-body-static.ttf
# Then read hhea ascent/descent/lineGap, head.unitsPerEm and the english-weighted advance
# (a–z + space) from each file with fontTools, for both the webfonts and
# /System/Library/Fonts/Supplemental/Georgia.ttf and Arial.ttf.
```

The metric script is a short fontTools loop over `hmtx` and `cmap` using standard English letter frequencies. It is not part of the repo.
