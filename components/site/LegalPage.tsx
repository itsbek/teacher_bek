import type { ReactNode } from "react";

export interface LegalSection {
  /** "1. Information Collected": the number is split off and set in the margin */
  title: string;
  lead?: ReactNode;
  text?: ReactNode;
  items?: string[];
}

interface Props {
  eyebrow: string;
  title: string;
  effective: string;
  intro: string;
  shortTitle: string;
  short: ReactNode[];
  sections: LegalSection[];
}

/** Privacy and Terms: a notebook page that reads easily, a plain-language summary first, then numbered sections. */
export function LegalPage({ eyebrow, title, effective, intro, shortTitle, short, sections }: Props) {
  return (
    <main id="main" className="legal paper">
      <header className="lg-head">
        <p className="t-label">{eyebrow}</p>
        <h1 className="t-xl">{title}</h1>
        <p className="t-hand lg-date">{effective}</p>
        <p className="t-voice lg-intro">{intro}</p>
      </header>

      <aside className="lg-short" aria-labelledby="lg-short-h">
        <h2 id="lg-short-h">{shortTitle}</h2>
        <ul>
          {short.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </aside>

      <ol className="lg-sections">
        {sections.map((s) => {
          const m = s.title.match(/^\s*(\d+)\.\s*(.*)$/);
          const n = m ? m[1] : "";
          const heading = m ? m[2] : s.title;
          return (
            <li key={s.title} className="lg-sec">
              <span className="lg-n" aria-hidden="true">
                {n}
              </span>
              <div className="lg-body">
                <h2>{heading}</h2>
                {s.lead && <p>{s.lead}</p>}
                {s.text && <p>{s.text}</p>}
                {s.items && (
                  <ul className="lg-items">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
