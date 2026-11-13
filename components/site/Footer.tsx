import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LogoWord } from "@/components/notebook/Mark";
import { Chat, type ChatStrings } from "@/components/site/Chat";

interface FooterProps {
  locale: string;
}

/**
 * "Say hello / Your turn" + the dark footer (docs/v4/proto2/src/frag2/foot.html).
 * No references list and no production-method line here, by the owner's rule: only the copyright,
 * with privacy and terms kept discreetly next to it.
 */
export async function Footer({ locale }: FooterProps) {
  const t = await getTranslations({ locale, namespace: "site" });
  const c = await getTranslations({ locale, namespace: "chat" });
  const l = await getTranslations({ locale, namespace: "leads" });
  const chat: ChatStrings = {
    hi: c("hi"),
    who: c.raw("who") as [string, string],
    ageC: c("ageC"),
    ageS: c("ageS"),
    name: c("name"),
    namePh: c("namePh"),
    phone: c("phone"),
    phonePh: c("phonePh"),
    note: c("note"),
    notePh: c("notePh"),
    skip: c("skip"),
    next: c("next"),
    consent: c("consent"),
    send: c("send"),
    done: c.raw("done") as string,
    zalo: c("zalo"),
    copy: c("copy"),
    copied: c("copied"),
    msgChild: c.raw("msgChild") as string,
    msgSelf: c.raw("msgSelf") as string,
    yrs: c("yrs"),
    bad: c("bad"),
    badName: c("badName"),
    failZalo: c("failZalo"),
    captchaZalo: c("captchaZalo"),
    errors: {
      errorDelivery: l("errorDelivery"),
      errorRateLimited: l("errorRateLimited"),
      errorInvalid: l("errorInvalid"),
      errorSpam: l("errorSpam"),
      errorCaptcha: l("errorCaptcha"),
      errorNetwork: l("errorNetwork"),
    },
  };
  return (
    <>
      <section className="talk" id="talk" data-tone="light">
        <div className="talk-head">
          <p className="t-label">{t("talk.label")}</p>
          <h2>
            {t("talk.heading")}
            <em>{t("talk.headingEm")}</em>
          </h2>
          <p className="talk-sub">{t("talk.sub")}</p>
        </div>
        <Chat locale={locale} strings={chat} />
      </section>
      <footer className="foot" data-tone="dark">
        <Link className="logo" href={`/${locale}`} aria-label={t("brand")}>
          <LogoWord />
        </Link>
        <div className="foot-grid">
          <div>
            <h3>{t("brand")}</h3>
            <p>{t("footer.description")}</p>
          </div>
          <div>
            <h3>{t("footer.visit")}</h3>
            <p>
              {t("footer.addressLine1")}
              <br />
              {t("footer.addressLine2")}
            </p>
          </div>
          <div>
            <h3>{t("footer.talk")}</h3>
            <a href="#talk">{t("footer.sendMessage")}</a>
            <a href="https://zalo.me/84353885757" target="_blank" rel="noopener noreferrer">
              {t("footer.zalo")}
            </a>
            <a href="tel:+84353885757">{t("footer.phone")}</a>
          </div>
          <div>
            <h3>{t("footer.read")}</h3>
            <Link href={`/${locale}`}>{t("nav.story")}</Link>
            <Link href={`/${locale}/classes`}>{t("nav.classes")}</Link>
            <Link href={`/${locale}/approach`}>{t("nav.approach")}</Link>
          </div>
        </div>
        <div className="foot-small">
          <span>{t("footer.copyright")}</span>
          <span className="foot-legal">
            <Link href={`/${locale}/privacy`}>{t("nav.privacy")}</Link>
            <Link href={`/${locale}/terms`}>{t("nav.terms")}</Link>
          </span>
        </div>
      </footer>
    </>
  );
}
