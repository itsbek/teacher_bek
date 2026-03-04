import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
  robots: { index: false, follow: false },
};

/**
 * Root-level 404 — shown when the URL falls outside the [locale] layout
 * (e.g. /unknown-path with no locale prefix, or an invalid locale segment).
 * No next-intl context available here — keep it locale-neutral.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f7f7f7",
          color: "#101010",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <p
          style={{
            fontSize: "0.6875rem",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.22em",
            opacity: 0.4,
            marginBottom: "1rem",
          }}
        >
          Page not found
        </p>

        <h1
          style={{
            fontSize: "clamp(3rem, 12vw, 10rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            margin: "0 0 2rem",
          }}
        >
          404
        </h1>

        <Link
          href="/en"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#101010",
            color: "#f7f7f7",
            padding: "0.875rem 1.75rem",
            fontFamily: "monospace",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            textDecoration: "none",
          }}
        >
          Back to home
        </Link>
      </body>
    </html>
  );
}
