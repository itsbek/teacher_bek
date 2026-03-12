import type { Metadata } from "next";

/**
 * Root layout — intentionally minimal.
 *
 * The <html> and <body> shell lives in app/[locale]/layout.tsx, which has
 * access to the locale as a static URL param. This avoids calling getLocale()
 * (which reads request headers and forces dynamic rendering on every route).
 *
 * app/not-found.tsx provides its own <html><body> for the 404 case.
 */

export const metadata: Metadata = {
  metadataBase: new URL("https://teacherbek.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
