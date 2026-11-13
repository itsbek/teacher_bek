import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { buildPageMetadata, getPageSeo } from "@/lib/seo";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbNode } from "@/components/seo/schema";
import { StudentNoteForm } from "@/components/site/StudentNoteForm";
import { wallNotes } from "@/lib/students/notes";

type Props = {
  params: Promise<{ locale: string }>;
};

/* the wall is read from the sheet; a "Put on the wall" tap in Telegram also refreshes it at once */
export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = getPageSeo(locale, "students");
  return buildPageMetadata({ locale, title, description, path: "/students" });
}

/** each note sits a little differently on the page, like real notes taped in */
const TILT = ["-1.2deg", ".8deg", "-.5deg", "1.3deg", "-.9deg", ".4deg"];

/** For my students: write to Bek, and read the notes he put on the wall. */
export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "students" });
  const site = await getTranslations({ locale, namespace: "site" });
  const notes = await wallNotes();
  const when = new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", { month: "long", year: "numeric" });
  const ld = [
    breadcrumbNode(locale, [
      { name: site("brand"), path: "" },
      { name: site("nav.students"), path: "/students" },
    ]),
  ];

  return (
    <>
      <JsonLd data={ld} />
      <main id="main" className="students">
        <section className="s-hero paper" data-tone="light">
          <p className="t-label">{t("label")}</p>
          <h1 className="t-xl">{t.rich("h1", { em: (c: ReactNode) => <em className="fo">{c}</em> })}</h1>
          <p className="t-voice lede">{t("lede")}</p>
          <p className="t-hand s-cue" aria-hidden="true">
            {t("cue")}
          </p>
        </section>

        <section className="s-write paper" data-tone="light" aria-labelledby="s-write-h">
          <StudentNoteForm
            locale={locale}
            strings={{
              title: t("formTitle"),
              name: t("name"),
              namePh: t("namePh"),
              studied: t("studied"),
              studiedPh: t("studiedPh"),
              optional: t("optional"),
              message: t("message"),
              messagePh: t("messagePh"),
              wall: t("wall"),
              send: t("send"),
              sending: t("sending"),
              sent: t("sent"),
              sentWall: t("sentWall"),
              error: t("error"),
            }}
          />
        </section>

        <section className="s-wall paper" data-tone="light" aria-labelledby="s-wall-h">
          <h2 className="t-l" id="s-wall-h">
            {t("wallTitle")}
          </h2>
          <p className="t-voice">{t("wallSub")}</p>
          {notes.length ? (
            <ul className="s-notes">
              {notes.map((n, i) => (
                <li key={n.id} style={{ rotate: TILT[i % TILT.length] }}>
                  <p className="s-msg">{n.message}</p>
                  <p className="s-by">
                    <b>{n.name}</b>
                    {n.studied ? ` · ${n.studied}` : ""}
                    <time dateTime={n.createdAt}>{n.createdAt ? when.format(new Date(n.createdAt)) : ""}</time>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="s-empty t-hand">{t("empty")}</p>
          )}
        </section>
      </main>
    </>
  );
}
