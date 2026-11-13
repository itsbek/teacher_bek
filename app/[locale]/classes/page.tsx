import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, courseNode, faqNode, personNode, providerNode } from "@/components/seo/schema";
import { ClassesRuntime } from "@/components/notebook/PageRuntime";
import type { ClassesStrings, ProgramText } from "@/lib/notebook/classes";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getPageSeo(locale, "classes");
  return buildPageMetadata({ locale, title, description, path: "/classes" });
}

const FAQ_COUNT = 8;

/** Classes: a ruler and pencil choose the age, the week is drawn, the ticket tears off (docs/v4/proto2/src/frag2/classes.body.html). */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "classes" });
  const story = await getTranslations({ locale, namespace: "story" });
  const pageWord = story("pageWord");
  const pg = (n: number) => (
    <span className="pgno" aria-hidden="true">
      {pageWord} {n}
    </span>
  );

  const prog = (k: "yl" | "tn"): ProgramText => ({
    ages: t(`programs.${k}.ages`),
    name: t.raw(`programs.${k}.name`) as string,
    text: t(`programs.${k}.text`),
    steps: t.raw(`programs.${k}.steps`) as string[],
  });
  const strings: ClassesStrings = {
    years: t("dial.years"),
    ageValue: t.raw("dial.ageValue") as string,
    threeMoves: t("dial.threeMoves"),
    programs: { yl: prog("yl"), tn: prog("tn") },
    days: t.raw("week.days") as string[],
    live: t.raw("week.live") as string,
    next: t.raw("week.next") as string,
    today: t("week.today"),
    tomorrow: t("week.tomorrow"),
  };
  const plain = (s: string) => s.replace(/<\/?[a-z]+>/g, "");
  const site = await getTranslations({ locale, namespace: "site" });
  const faqItems = Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => ({
    q: t(`faq.q${n}`),
    a: plain(t.raw(`faq.a${n}`) as string),
  }));
  const ld = [
    providerNode(locale),
    personNode(),
    courseNode(locale, {
      id: "young-learners",
      name: `Young Learners (${t("programs.yl.ages")})`,
      ages: t("programs.yl.ages"),
      minAge: 5,
      maxAge: 10,
      description: t("programs.yl.text"),
    }),
    courseNode(locale, {
      id: "teens",
      name: `Teens (${t("programs.tn.ages")})`,
      ages: t("programs.tn.ages"),
      minAge: 11,
      maxAge: 17,
      description: t("programs.tn.text"),
    }),
    faqNode(faqItems),
    breadcrumbNode(locale, [
      { name: site("brand"), path: "" },
      { name: site("nav.classes"), path: "/classes" },
    ]),
  ];
  const link = (c: ReactNode) => <Link href={`/${locale}/approach`}>{c}</Link>;

  return (
    <>
      <JsonLd data={ld} />
      <main id="main">
        {/* hero is a cover that turns over into the next page (the runtime drives --to) */}
        <div className="pin cover turns paper" style={{ zIndex: 6 }}>
          <section className="c-hero stage" data-tone="light">
            <p className="t-label">{t("label")}</p>
            <h1 className="t-xl">
              {t("heroBefore")}
              <span className="t-open u-draw">
                {t("place")}
                <svg viewBox="0 0 300 30" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M4 20 C60 8 140 26 200 14 C240 6 270 12 296 18" />
                </svg>
              </span>
              {t("heroAfter")}
            </h1>
            <p className="t-voice lede">{t("lede")}</p>
            {pg(1)}
          </section>
        </div>

        <section className="dial under paper" data-tone="light" style={{ zIndex: 5 }}>
          <div className="dial-l">
            <p className="t-label">{t("dial.label")}</p>
            <p className="dial-n" id="dialN" aria-hidden="true">
              8
            </p>
            <p className="t-hand dial-y" id="dialY">
              {t("dial.years")}
            </p>
            <div className="ruler">
              <div className="ruler-ill" id="ruler" />
              <div className="ruler-nums" aria-hidden="true" />
              <div className="pencil" id="pencil" />
              <label className="vh" htmlFor="age2">
                {t("dial.ageLabel")}
              </label>
              <input
                className="ruler-in"
                id="age2"
                type="range"
                min={5}
                max={17}
                defaultValue={8}
                data-drag
                aria-valuetext={t("dial.ageValue", { n: 8 })}
              />
            </div>
          </div>
          <div className="prog-card" id="progCard" aria-live="polite" />
          {pg(2)}
        </section>

        <section className="week paper" id="week" data-tone="light" style={{ zIndex: 4 }}>
          <h2 className="t-l">{t("week.heading")}</h2>
          <p className="now t-voice" id="now" />
          <div className="cal" id="cal" />
          <p className="t-hand cal-note">{t("week.note")}</p>
          {pg(3)}
        </section>

        <section className="tk paper" data-tone="light" style={{ zIndex: 3 }}>
          <div className="tk-card" id="tk">
            <div className="tk-ill" id="tkIll" />
            <div className="tk-stub" id="stub" data-drag>
              <span className="t-label">{t("ticket.admit")}</span>
              <b>{t("ticket.free")}</b>
              <span className="t-hand">{t("ticket.firstWeek")}</span>
              <span className="tear-hint t-hand">{t("ticket.tearHint")}</span>
            </div>
            <div className="tk-body">
              <h2>{t("ticket.heading")}</h2>
              <p className="t-voice">{t("ticket.body")}</p>
              <div className="tk-after">
                <p className="t-hand">{t("ticket.after")}</p>
                <a className="btn mag" href="#talk" data-cur="say hi">
                  {t("ticket.cta")}
                </a>
              </div>
              <button type="button" className="btn ghost tear-btn" id="tearBtn">
                {t("ticket.tearBtn")}
              </button>
            </div>
          </div>
          {pg(4)}
        </section>

        <section className="faq paper" id="faq" data-tone="light" style={{ zIndex: 2 }}>
          <div className="faq-in">
            <h2 className="t-l">{t("faq.heading")}</h2>
            {Array.from({ length: FAQ_COUNT }, (_, i) => i + 1).map((n) => (
              <details key={n}>
                <summary>
                  <i className="t-hand">{n}</i>
                  {t(`faq.q${n}`)}
                </summary>
                <p>{n === 8 ? t.rich("faq.a8", { link }) : t(`faq.a${n}`)}</p>
              </details>
            ))}
          </div>
          {pg(5)}
        </section>

        <div className="door-wrap">
          <Link className="door mag" href={`/${locale}/approach`} data-cur="open">
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
      <ClassesRuntime strings={strings} />
    </>
  );
}
