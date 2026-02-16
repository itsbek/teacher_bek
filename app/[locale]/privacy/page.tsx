import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import { VanguardNavigation } from "@/components/VanguardNavigation";
import { VanguardFooter } from "@/components/VanguardFooter";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    title: "Privacy Policy",
    description: "How Teacher Bek collects, uses, and protects personal data.",
    path: "/privacy",
  });
}

export default function PrivacyPage() {
  return (
    <>
      <VanguardNavigation />
      <main className="page-shell">
        <div className="page-container section-stack">
          <header className="section-stack">
            <p className="type-label text-foreground/45">Legal</p>
            <h1 className="type-title-lg">Privacy Policy</h1>
            <p className="type-meta text-foreground/55">Effective date: February 16, 2026</p>
            <p className="type-body text-foreground/75 max-w-3xl">
              This policy explains what information is collected through this website, how it is used,
              and what rights users have regarding their personal data.
            </p>
          </header>

          <section className="panel section-stack">
            <h2 className="type-title-sm">1. Information Collected</h2>
            <p className="type-body text-foreground/75">
              Information is collected only when a user submits an enquiry or newsletter form.
            </p>
            <ul className="type-body text-foreground/75 list-disc pl-6 space-y-2">
              <li>Name</li>
              <li>Email address</li>
              <li>Optional contact details provided by the user</li>
              <li>Message content</li>
              <li>Basic technical metadata used for spam prevention and security (for example IP and timestamp)</li>
            </ul>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">2. Purpose of Processing</h2>
            <p className="type-body text-foreground/75">
              Personal data is processed only to respond to enquiries, provide lesson-related information,
              manage scheduling communication, and maintain website security.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">3. Data Retention</h2>
            <p className="type-body text-foreground/75">
              Data is retained only as long as reasonably necessary to handle communication and service requests,
              or as required by applicable law.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">4. Data Sharing</h2>
            <p className="type-body text-foreground/75">
              Personal data is not sold. Data may be processed by trusted service providers used to operate
              contact forms, analytics, and communication tools, strictly for business operations.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">5. User Rights</h2>
            <p className="type-body text-foreground/75">
              Users may request access, correction, or deletion of their personal data by contacting:
              <a className="underline ml-1" href="mailto:hello@teacherbek.com">hello@teacherbek.com</a>.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">6. Policy Updates</h2>
            <p className="type-body text-foreground/75">
              This policy may be updated periodically. The effective date above reflects the latest revision.
            </p>
          </section>
        </div>
      </main>
      <VanguardFooter />
    </>
  );
}
