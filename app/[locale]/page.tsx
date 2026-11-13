import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode, organizationNode, personNode, websiteNode } from "@/components/seo/schema";
import { Mark } from "@/components/notebook/Mark";
import { StoryRuntime } from "@/components/notebook/StoryRuntime";
import { NOTEBOOK } from "@/lib/notebook/content";
import type { StoryStrings } from "@/lib/notebook/story";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getPageSeo(locale, "home");
  return buildPageMetadata({ locale, title, description, path: "" });
}

const rich = {
  b: (c: ReactNode) => <b>{c}</b>,
  em: (c: ReactNode) => <em>{c}</em>,
  open: (c: ReactNode) => <span className="t-open">{c}</span>,
  hl: (c: ReactNode) => <span className="t-open hl">{c}</span>,
};

function NoteMark({ id, n, label }: { id: string; n: number; label: string }) {
  return (
    <button type="button" className="nm" data-note={id} aria-label={label} aria-expanded="false" data-cur="note">
      {n}
    </button>
  );
}

/** The story: one student's English notebook from age five to seventeen (docs/v4/proto2/src/frag2/index.body.html). */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "story" });
  const nb = await getTranslations({ locale, namespace: "notebook" });
  const site = await getTranslations({ locale, namespace: "site" });
  const noteLabel = (id: string) => nb("noteAria", { cite: nb(`notes.${id}.short`) });
  const facts = t.raw("room.facts") as Record<string, [string, string]>;
  const N = NOTEBOOK;

  const strings: StoryStrings = {
    whyAria: t("cover.whyAria"),
    picked: t.raw("turn.picked") as string,
    answers: {
      goed: t.raw("guess.goed") as string,
      went: t.raw("guess.went") as string,
      wented: t.raw("guess.wented") as string,
    },
    chipCover: site("chip.cover"),
    pageWord: t("pageWord"),
    abCap: t("about.caption"),
  };

  const timeline = (arc: boolean) => (
    <div className="tl">
      <svg viewBox="0 0 620 80" aria-hidden="true">
        <path className="axis" d="M20 46 H600" />
        {arc ? (
          <path className="arc" pathLength={1} d="M110 46 C210 -6 410 -6 510 46" />
        ) : (
          <path className="cut" d="M300 30 V62" />
        )}
        <circle className="past" cx="110" cy="46" r="9" />
        <circle className="nowd" cx="510" cy="46" r="9" />
      </svg>
      <div className="tl-l">
        <span>{t("dist.then")}</span>
        <span>{t("dist.now")}</span>
      </div>
    </div>
  );

  const seo = getPageSeo(locale, "home");
  const ld = [
    organizationNode(locale, seo.description),
    personNode(),
    websiteNode(locale),
    breadcrumbNode(locale, [{ name: site("brand"), path: "" }]),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <div className="loader" aria-hidden="true">
        <div className="ld">
          <span className="lw">
            <i>teacher</i>
            <b>
              <Mark viewBox="12 6 42 80" />
              <span className="ld-ek">ek</span>
            </b>
          </span>
        </div>
      </div>
      <main id="main">
        {/* 1 · HERO — the headline splits apart as you scroll; "why" can be pulled */}
        <div className="pin cover" id="cover">
          <section className="hero stage" id="hero" data-tone="light" data-age="5">
            <p className="t-label hero-eyebrow">{t("cover.eyebrow")}</p>
            <h1 className="hero-h" aria-label={t("cover.h1Label")}>
              <span className="hx" data-dir="-1">
                {t("cover.h1Line1")}
              </span>
              <span className="hx" data-dir="1">
                {t("cover.h1Line2")}
              </span>
              <span className="hx" data-dir="-1">
                {t("cover.h1Line3")}
              </span>
              <span className="hx hx-why" data-dir="0">
                <span className="why" id="why" data-cur="drag">
                  {t("cover.why")}
                </span>
                .
                <svg className="why-curve" viewBox="0 0 200 60" aria-hidden="true">
                  <path pathLength={1} d="M6 40 C40 58 90 58 120 40 C140 28 150 14 146 6" />
                </svg>
              </span>
            </h1>
            <div className="hero-foot">
              <p className="t-voice">{t("cover.voice")}</p>
              <p className="t-hand hero-hint">{t.rich("cover.hint", rich)}</p>
            </div>
          </section>
        </div>

        {/* 2 · THE WALL — a notebook fills with tables, written by a pen, until the ink takes over */}
        <section className="pin wall" id="wall" data-tone="light" data-age="6">
          <div className="stage">
            <div className="wall-copy">
              <p className="t-label">{t("wall.label")}</p>
              <h2 className="t-l">{t("wall.heading")}</h2>
              <ol className="wall-lines t-voice">
                <li>{t("wall.line1")}</li>
                <li>{t("wall.line2")}</li>
                <li>{t("wall.line3")}</li>
                <li>
                  <b>{t("wall.line4")}</b>
                  <NoteMark id="sweller" n={1} label={noteLabel("sweller")} />
                </li>
              </ol>
            </div>
            <div className="nb-wrap">
              <div className="nb" id="nb">
                <svg className="nb-svg" id="nbSvg" aria-hidden="true" />
                <div className="nb-rows t-hand" id="nbRows" aria-hidden="true" />
                <div className="nb-pen" id="nbPen" />
              </div>
              <p className="nb-count">
                <span className="t-label">{t("wall.count")}</span>
                <b id="cnt">0</b>
              </p>
            </div>
            <div className="blot" id="blot" aria-hidden="true" />
            <div className="hes" id="hes" data-tone="dark">
              <p className="hes-ask t-voice">{N.hesAsk}</p>
              <div className="ghosts t-hand" id="ghosts" aria-hidden="true" />
              <p className="hes-line" aria-hidden="true">
                <span id="hesTxt" />
                <i className="caret" />
              </p>
              <p className="hes-cap t-label">{t("wall.hesCap")}</p>
              <p className="vh">{t("wall.hesVh")}</p>
            </div>
          </div>
        </section>

        {/* 3 · THE TEST — the week drops into a school bag; lift things out of it */}
        <section className="pin test" id="test" data-tone="light" data-age="9">
          <div className="stage">
            <div className="test-head">
              <p className="t-label">{t("test.label")}</p>
              <p className="test-q">{N.question}</p>
            </div>
            <div className="bag" id="bag">
              <div className="bag-ill" id="bagIll" />
              <div className="tags" id="tags">
                {N.week.map((w) => (
                  <button key={w} type="button" className="tag" data-cur="drag">
                    {w}
                  </button>
                ))}
              </div>
            </div>
            <div className="test-foot">
              <p className="taken t-label">
                {`${t("test.taken")} `}
                <b id="taken">{`0 / ${N.week.length}`}</b>
              </p>
              <p className="cap">{t("test.cap")}</p>
              <p className="rel t-voice" id="rel">
                {t.rich("test.rel", rich)}
                <NoteMark id="edmondson" n={2} label={noteLabel("edmondson")} />
              </p>
            </div>
          </div>
        </section>

        {/* 4 · THE TURN — the rule is written on a closed door; "why?" is the handle */}
        <section className="pin turn" id="turn" data-tone="light" data-age="11">
          <div className="stage">
            <div className="light" id="light" aria-hidden="true" />
            <div className="turn-copy">
              <p className="t-label">{t("turn.label")}</p>
              <p className="t-voice turn-after">{t("turn.after")}</p>
            </div>
            <div className="door3d">
              <div className="frame" />
              <div className="door-panel" id="doorPanel">
                <p className="rule">
                  {N.rule.before}
                  <u>{N.rule.a}</u>
                  {N.rule.mid}
                  <u>{N.rule.the}</u>
                  {N.rule.after}
                </p>
                <button type="button" className="knob" id="knob" data-cur="open">
                  {N.knob}
                </button>
              </div>
            </div>
            <div className="explain" id="explain">
              <p className="big">{t.rich("turn.a", rich)}</p>
              <p className="big">
                {t.rich("turn.the", rich)}
                <NoteMark id="craik" n={3} label={noteLabel("craik")} />
              </p>
              <div className="dogs" id="dogs" role="group" aria-label={t("turn.dogsAria")} />
              <p className="pick t-hand" id="pick" aria-live="polite">
                {t("turn.pick")}
              </p>
            </div>
          </div>
        </section>

        {/* 5 · GUESSING — answers are dragged into a gap and marked by hand */}
        <section className="pin guess" id="wrong" data-tone="light" data-age="12">
          <div className="stage">
            <p className="t-label">{t("guess.label")}</p>
            <h2 className="t-l">{t.rich("guess.heading", rich)}</h2>
            <p className="sent">
              {N.sentence.before}
              <span className="gap" id="gap">
                <span className="gap-w" id="gapW">
                  {" "}
                </span>
                <span className="mark" id="mark" />
              </span>
              {N.sentence.after}
            </p>
            <div className="opts">
              {N.options.map((o) => (
                <button key={o} type="button" className="opt" data-v={o} data-cur="drag">
                  {o}
                </button>
              ))}
            </div>
            <p className="resp t-voice" id="resp" aria-live="polite">
              {t("guess.resp")}
            </p>
            <p className="t-hand guess-note">
              {t("guess.note")}
              <NoteMark id="roediger" n={4} label={noteLabel("roediger")} />
            </p>
          </div>
        </section>

        {/* 6 · THREE WAYS — the page turns sideways; each student gets their own object */}
        <section className="pin six" id="six" data-tone="light" data-age="14">
          <div className="stage">
            <div className="track" id="track">
              <div className="panel p0">
                <p className="t-label">{t("six.label")}</p>
                <h2 className="t-l">
                  {t.rich("six.heading", rich)}
                  <NoteMark id="wood" n={5} label={noteLabel("wood")} />
                </h2>
                <p className="t-voice">{t.rich("six.task", { ...rich, task: N.task })}</p>
                <p className="t-hand">{t("six.hint")}</p>
              </div>
              <div className="panel p1">
                <div>
                  <p className="who t-label">{t("six.who1")}</p>
                  <p className="pv pv0">{t("six.pv0")}</p>
                </div>
                <div className="pill" id="ill1" />
              </div>
              <div className="panel p2">
                <div>
                  <p className="who t-label">{t("six.who2")}</p>
                  <p className="pv pv1">{t("six.pv1")}</p>
                </div>
                <div className="folded" id="note">
                  <div className="flap" />
                  <ol className="lies t-hand">
                    {N.lies.map((l, i) => (
                      <li key={l} className={i === N.lie ? "lie" : undefined}>
                        {l}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="panel p3">
                <div>
                  <p className="who t-label">{t("six.who3")}</p>
                  <p className="pv pv2">{t("six.pv2")}</p>
                </div>
                <div className="sw">
                  <div className="pill" id="ill3" />
                  <p className="wc">
                    <b id="wc">0</b> <span>{t("six.words")}</span>
                  </p>
                  <p className="spoken t-hand" id="spoken" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7 · DISTANCE — two sentences, one 'have' */}
        <section className="pin keys" id="dist" data-tone="light" data-age="15">
          <div className="stage">
            <div className="k-head">
              <p className="t-label">{t("dist.label")}</p>
              <h2 className="t-l">{t("dist.heading")}</h2>
            </div>
            <div className="k-pair">
              <div className="k-s ka">
                <div className="k-ill" />
                <p className="k-en">{N.keys.a}</p>
                {timeline(false)}
                <p className="k-mean t-voice">{t("dist.meanA")}</p>
              </div>
              <div className="k-s kb">
                <div className="k-ill" />
                <p className="k-en">
                  {N.keys.bBefore}
                  <b>{N.keys.bHave}</b>
                  {N.keys.bAfter}
                </p>
                {timeline(true)}
                <p className="k-mean t-voice">{t("dist.meanB")}</p>
              </div>
            </div>
            <p className="k-why t-voice">{t.rich("dist.why", rich)}</p>
          </div>
        </section>

        {/* 8 · OWN WORDS — a single pen line writes the sentence */}
        <section className="pin own" id="own" data-tone="light" data-age="17">
          <div className="stage">
            <p className="t-label">{t("own.label")}</p>
            <p className="own-q t-voice">{N.question}</p>
            <div className="write">
              <svg className="write-line" id="wline" aria-hidden="true">
                <path id="wpath" />
              </svg>
              <p className="say" id="say">
                {N.own.a}
                <span className="u">{N.own.u1}</span>
                {N.own.b}
                <span className="u">{N.own.u2}</span>
                {N.own.c}
              </p>
            </div>
            <p className="cap">
              {t("own.cap")}
              <NoteMark id="ryan" n={7} label={noteLabel("ryan")} />
            </p>
          </div>
        </section>

        {/* 9 · ABOUT — the full portrait, uncropped and protected, over a drawn mark and an oversized name */}
        <section className="about" id="about" data-tone="light" data-age="17">
          <div className="ab-art">
            <p className="ab-name" aria-hidden="true">
              Bek
            </p>
            <div className="ab-mark" aria-hidden="true">
              <Mark pathClass="am-p" dotClass="am-d" />
            </div>
            <div className="ab-photo protect" role="img" aria-label={t("about.photoAria")} data-look="">
              <i style={{ backgroundImage: "url(/og-image.jpg)" }} />
            </div>
          </div>
          <div className="ab-text">
            <p className="t-label">{t("about.label")}</p>
            <h2 className="t-l">{t("about.heading")}</h2>
            <p className="t-voice">{t("about.voice")}</p>
            <ol className="beliefs">
              {([1, 2, 3] as const).map((i) => (
                <li key={i}>
                  <span className="t-hand">{t(`about.n${i}`)}</span>
                  {t(`about.b${i}`)}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 10 · THE ROOM — a drawing of the room turns into the photograph */}
        <section className="room" id="room" data-tone="light" data-age="17">
          <h2 className="t-l">{t.rich("room.heading", rich)}</h2>
          <div className="room-photo" data-look="">
            <Image
              src="/class.jpg"
              alt={t("room.alt")}
              width={1536}
              height={1024}
              sizes="(min-width: 1000px) 70vw, 100vw"
              id="roomImg"
            />
            <svg className="room-trace" id="trace" viewBox="0 0 1536 1024" preserveAspectRatio="none" aria-hidden="true" />
          </div>
          <div className="room-text">
            <p className="t-voice">{t("room.voice")}</p>
            <ul className="facts">
              {Object.entries(facts).map(([k, [a, b]]) => (
                <li key={k}>
                  <span>{a}</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="ctas">
              <a className="btn mag" href="#talk" data-cur="say hi">
                {t("room.ctaTalk")}
              </a>
              <Link className="btn ghost mag" href={`/${locale}/classes`} data-cur="open">
                {t("room.ctaClasses")}
              </Link>
            </div>
          </div>
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
      <StoryRuntime strings={strings} />
    </>
  );
}
