import { useTranslations } from "next-intl";

function LockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="0" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export function ComingSoonTier3() {
  const t = useTranslations("community");

  const items = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
          <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
          <line x1="12" x2="12" y1="19" y2="22" />
        </svg>
      ),
      title: t("comingSoonPodcastTitle"),
      desc: t("comingSoonPodcastDesc"),
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      title: t("comingSoonStoryTitle"),
      desc: t("comingSoonStoryDesc"),
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      ),
      title: t("comingSoonForumTitle"),
      desc: t("comingSoonForumDesc"),
    },
  ];

  return (
    <section
      style={{
        background: "hsl(var(--background))",
        color: "hsl(var(--foreground))",
        padding: "clamp(4rem, 8vw, 9rem) clamp(1.25rem, 4vw, 2rem)",
        borderTop: "1px solid hsl(var(--foreground) / 0.08)",
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(3rem, 6vw, 5rem)" }}>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.45,
              marginBottom: "1rem",
            }}
          >
            — {t("comingSoonEyebrow")}
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(48px, 7vw, 96px)",
              letterSpacing: "-0.03em",
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            {t("comingSoonHeading")}<br />
            <em style={{ fontStyle: "italic", opacity: 0.5 }}>{t("comingSoonHeadingItalic")}</em>
          </h2>
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(14px, 1.4vw, 17px)",
              opacity: 0.5,
              marginTop: "1.25rem",
              maxWidth: 440,
              lineHeight: 1.6,
            }}
          >
            {t("comingSoonSubtitle")}
          </p>
        </div>

        {/* 3 teaser items */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            borderTop: "1px solid hsl(var(--foreground) / 0.1)",
          }}
          className="tier3-grid"
        >
          {items.map((item, i) => (
            <div
              key={i}
              style={{
                padding: "clamp(2rem, 3.5vw, 3rem) clamp(1.5rem, 3vw, 2.5rem)",
                borderRight: i < items.length - 1 ? "1px solid hsl(var(--foreground) / 0.1)" : "none",
                filter: "blur(0px)",
                opacity: 0.45,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Blurred overlay effect */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backdropFilter: "blur(1px)",
                  pointerEvents: "none",
                  zIndex: 0,
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Icon + lock */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span style={{ opacity: 0.6 }}>{item.icon}</span>
                  <span style={{ opacity: 0.4 }}>
                    <LockIcon />
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 800,
                    fontSize: "clamp(24px, 3vw, 40px)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.0,
                    textTransform: "uppercase",
                    marginBottom: "0.75rem",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(13px, 1.2vw, 15px)",
                    lineHeight: 1.6,
                    opacity: 0.7,
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div
          style={{
            marginTop: "clamp(2rem, 4vw, 3rem)",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span style={{ width: 32, height: 1, background: "currentColor", opacity: 0.2, flexShrink: 0 }} />
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              opacity: 0.35,
            }}
          >
            Tier 3 — In Development
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .tier3-grid {
            grid-template-columns: 1fr !important;
          }
          .tier3-grid > div {
            border-right: none !important;
            border-bottom: 1px solid hsl(var(--foreground) / 0.1);
          }
        }
      `}</style>
    </section>
  );
}
