import Link from "next/link";
import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import { LogoWord, Mark } from "@/components/notebook/Mark";
import { AgeChip } from "./AgeChip";
import { LanguageSwitch } from "./LanguageSwitch";
import { NavLink } from "./NavLink";

interface HeaderProps {
  locale: string;
}

/** Number of notebook pages in the story (lib/notebook/story.ts PAGES). */
const STORY_PAGES = 9;

/**
 * Header + the full-screen menu (docs/v4/proto2/src/frag2/chrome.html). The menu button, the blue circle
 * reveal, focus and Escape are driven by lib/notebook/core.ts.
 */
export async function Header({ locale }: HeaderProps) {
  const t = await getTranslations({ locale, namespace: "site" });
  const other = t("language.switchHrefLang");
  const menuItems = [
    { href: `/${locale}`, n: "01", key: "story" },
    { href: `/${locale}/classes`, n: "02", key: "classes" },
    { href: `/${locale}/approach`, n: "03", key: "approach" },
    { href: "#talk", n: "04", key: "talk" },
  ] as const;

  return (
    <>
      <header className="hdr">
        <Link href={`/${locale}`} className="logo mag" data-cur="home" aria-label={t("homeLabel")}>
          <LogoWord />
        </Link>
        <AgeChip locale={locale} page={t("chip.page")} cover={t("chip.cover")} total={STORY_PAGES} />
        <nav aria-label={t("navLabel")}>
          <NavLink href={`/${locale}/classes`} className="hide-m">
            {t("nav.classes")}
          </NavLink>
          <NavLink href={`/${locale}/approach`} className="hide-m">
            {t("nav.approach")}
          </NavLink>
          <LanguageSwitch
            locale={locale}
            targetLocale={other}
            cursor={t("language.switchLabel")}
            ariaLabel={t("language.switchLabel")}
          >
            {t("language.switchTo")}
          </LanguageSwitch>
          <button className="menu-btn" id="menuBtn" type="button" aria-expanded="false" aria-controls="menu">
            <span>{t("menu.open")}</span>
            <i aria-hidden="true" />
          </button>
        </nav>
      </header>
      <nav className="menu" id="menu" aria-label={t("menu.label")}>
        <ol>
          {menuItems.map((m, i) => {
            const body = (
              <>
                <small>{m.n}</small>
                {t(`menu.${m.key}.title`)}
                <em>{t(`menu.${m.key}.text`)}</em>
              </>
            );
            const style = { "--i": i } as CSSProperties;
            return (
              <li key={m.key}>
                {m.href.startsWith("#") ? (
                  <a href={m.href} style={style}>
                    {body}
                  </a>
                ) : (
                  <Link href={m.href} style={style}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
        <Mark className="menu-mark" />
        <div className="menu-foot">
          <span>{t("menu.foot")}</span>
          <LanguageSwitch locale={locale} targetLocale={other}>
            {t("language.switchLabel")}
          </LanguageSwitch>
        </div>
      </nav>
    </>
  );
}
