import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <main id="main">
          <h1>Page not found</h1>
          <p>This page does not exist or has moved.</p>
          <Link href="/en">Back to home</Link>
        </main>
      </body>
    </html>
  );
}
