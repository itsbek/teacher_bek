import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const INK = "#14141A";
const BLUE = "#0071E3";
const PAPER = "#FFFDF8";

/* Read from disk (Node runtime): fetch(new URL(..., import.meta.url)) is rewritten by webpack to a relative
   /_next/static path, which is an invalid URL on `next start` and made every OG image answer 500.
   The file is included in the serverless trace by outputFileTracingIncludes in next.config.ts. */
async function loadFont(): Promise<ArrayBuffer> {
  const buf = await readFile(join(process.cwd(), "lib/og/archivo-og-800.ttf"));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

interface OgTexts {
  /** headline, split so that the emphasised word can be blue */
  before: string;
  why: string;
  after: string;
  kicker?: string;
}

async function render({ before, why, after, kicker }: OgTexts, locale: string) {
  const font = await loadFont();
  const t = await getTranslations({ locale, namespace: "site" });
  const brand = locale === "vi" ? "Thầy Bek · Phú Nhuận" : "Teacher Bek · Phú Nhuận";
  const rules = Array.from({ length: 12 }, (_, i) => 70 + i * 50);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: PAPER,
          fontFamily: "Archivo",
        }}
      >
        {rules.map((y) => (
          <div
            key={y}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y,
              height: 2,
              background: "rgba(0,113,227,0.14)",
            }}
          />
        ))}
        <div
          style={{ position: "absolute", left: 120, top: 0, bottom: 0, width: 3, background: "rgba(214,40,40,0.55)" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 80px 52px 170px",
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#5B5B66" }}>
            {kicker ?? t("brand")}
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: 112,
              lineHeight: 1.02,
              color: INK,
              letterSpacing: -2,
              textTransform: "none",
            }}
          >
            <span>{before}</span>
            <span style={{ color: BLUE }}>{why}</span>
            <span>{after}</span>
          </div>
          <div style={{ display: "flex", fontSize: 34, color: INK }}>{brand}</div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: [{ name: "Archivo", data: font, weight: 800, style: "normal" }] },
  );
}

/** Home / default card: the headline with "why" in blue. */
export async function renderHomeOg(locale: string) {
  const t = await getTranslations({ locale, namespace: "story" });
  const full = t("cover.h1Label");
  const why = t("cover.why");
  const i = full.lastIndexOf(why);
  const before = i >= 0 ? full.slice(0, i) : full;
  const after = i >= 0 ? full.slice(i + why.length) : "";
  return render({ before, why: i >= 0 ? why : "", after }, locale);
}

/** Classes card. */
export async function renderClassesOg(locale: string) {
  const t = await getTranslations({ locale, namespace: "classes" });
  const heroBefore = t("heroBefore");
  const place = t("place");
  const heroAfter = t("heroAfter");
  return render({ before: heroBefore, why: place, after: heroAfter, kicker: t("label") }, locale);
}

/** Approach card. */
export async function renderApproachOg(locale: string) {
  const t = await getTranslations({ locale, namespace: "approach" });
  const raw = t.raw("h1") as string;
  const m = /^(.*?)<why>(.*?)<\/why>(.*)$/.exec(raw);
  const [before, why, after] = m ? [m[1], m[2], m[3]] : [raw, "", ""];
  return render({ before, why, after, kicker: t("label") }, locale);
}
