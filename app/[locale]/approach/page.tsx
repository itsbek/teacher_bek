import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleNode, breadcrumbNode, personNode, providerNode } from "@/components/seo/schema";
import { ApproachRuntime } from "@/components/notebook/PageRuntime";
import { MARK } from "@/lib/notebook/util";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getPageSeo(locale, "approach");
  return buildPageMetadata({ locale, title, description, path: "/approach" });
}

/** each reason: how it arrives (data-fx) and which ink drawing goes with it */
const REASONS = [
  { id: "r1", fx: "up", ill: "key" },
  { id: "r2", fx: "side", ill: "glass" },
  { id: "r3", fx: "zoom", ill: "eraser" },
  { id: "r4", fx: "turn", ill: "cards" },
  { id: "r5", fx: "iris", ill: "plant" },
] as const;

const rich = {
  b: (c: ReactNode) => <b>{c}</b>,
  why: (c: ReactNode) => <span className="why-word">{c}</span>,
};

/** Approach: five reasons arrive five different ways (docs/v4/proto2/src/frag2/approach.body.html). */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "approach" });
  const story = await getTranslations({ locale, namespace: "story" });
  const pageWord = story("pageWord");
  const pg = (n: number) => (
    <span className="pgno" aria-hidden="true">
      {pageWord} {n}
    </span>
  );

  const site = await getTranslations({ locale, namespace: "site" });
  const seo = getPageSeo(locale, "approach");
  const ld = [
    providerNode(locale),
    personNode(),
    articleNode(locale, {
      headline: (t.raw("h1") as string).replace(/<\/?why>/g, ""),
      description: seo.description,
      about: locale === "vi" ? "Dạy tiếng Anh cho trẻ em và thanh thiếu niên" : "Teaching English to children and teenagers",
    }),
    breadcrumbNode(locale, [
      { name: site("brand"), path: "" },
      { name: site("nav.approach"), path: "/approach" },
    ]),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <main id="main">
        <div className="pin cover turns paper" style={{ zIndex: 3 }}>
          <section className="a-hero stage" data-tone="light">
            <div className="a-mark" aria-hidden="true">
              <svg viewBox="0 0 64 84">
                <path className="am-p" pathLength={1} d={MARK} />
                <circle className="am-d" cx="33" cy="78" r="4.4" />
              </svg>
            </div>
            <p className="t-label">{t("label")}</p>
            <h1 className="t-xl">{t.rich("h1", rich)}</h1>
            <p className="t-voice lede">{t("lede")}</p>
            <p className="t-hand a-cue">{t("cue")}</p>
            {pg(1)}
          </section>
        </div>

        <section className="pin reasons under paper" id="reasons" data-tone="light" style={{ zIndex: 2 }}>
          <div className="stage">
            <ol className="r-dots" aria-hidden="true">
              <li />
              <li />
              <li />
              <li />
              <li />
            </ol>
            {REASONS.map(({ id, fx, ill }) => (
              <article className="rs" data-fx={fx} key={id}>
                <div className="r-ill" data-ill={ill} />
                <div className="r-txt">
                  <p className="r-n t-hand">{t(`${id}.n`)}</p>
                  <h2>{t.rich(`${id}.h`, rich)}</h2>
                  <p className="t-voice">
                    <b>{t(`${id}.lead`)}</b>
                    {t(`${id}.rest`)}
                  </p>
                  <p className="r-cite">{t(`${id}.cite`)}</p>
                </div>
              </article>
            ))}
            {pg(2)}
          </div>
        </section>

        <div className="door-wrap">
          <Link className="door mag" href={`/${locale}/classes`} data-cur="open">
            <span>
              <small className="t-label">{t("door.small")}</small>
              <strong>{t("door.strong")}</strong>
            </span>
            <span className="arr" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </main>
      <ApproachRuntime />
    </>
  );
}
