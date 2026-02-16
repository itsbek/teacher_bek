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
    title: "Terms of Service",
    description: "Terms governing tutoring sessions and communications with Teacher Bek.",
    path: "/terms",
  });
}

export default function TermsPage() {
  return (
    <>
      <VanguardNavigation />
      <main className="page-shell">
        <div className="page-container section-stack">
          <header className="section-stack">
            <p className="type-label text-foreground/45">Legal</p>
            <h1 className="type-title-lg">Terms of Service</h1>
            <p className="type-meta text-foreground/55">Effective date: February 16, 2026</p>
            <p className="type-body text-foreground/75 max-w-3xl">
              These terms govern use of this website and any lesson-related communication or services
              requested through this website.
            </p>
          </header>

          <section className="panel section-stack">
            <h2 className="type-title-sm">1. Scope of Services</h2>
            <p className="type-body text-foreground/75">
              Services include English teaching sessions and related communication support.
              Final lesson format, schedule, and pricing are confirmed directly after enquiry.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">2. Booking and Confirmation</h2>
            <p className="type-body text-foreground/75">
              A session is considered confirmed only after direct agreement between teacher and client.
              Availability is limited and may change without notice until confirmation.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">3. Client Responsibilities</h2>
            <ul className="type-body text-foreground/75 list-disc pl-6 space-y-2">
              <li>Provide accurate contact details.</li>
              <li>Provide accurate learner information for placement.</li>
              <li>Respect agreed schedules and communication timelines.</li>
            </ul>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">4. Cancellations and Rescheduling</h2>
            <p className="type-body text-foreground/75">
              Cancellation and rescheduling rules are provided at time of booking.
              Repeated no-shows or last-minute cancellations may result in loss of reserved slots.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">5. Acceptable Use</h2>
            <p className="type-body text-foreground/75">
              This website may not be used for abuse, spam, scraping, or unlawful activity.
              The operator may restrict access or communication to protect business operations and safety.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">6. Liability and External Services</h2>
            <p className="type-body text-foreground/75">
              While reasonable efforts are made to keep website information accurate, no guarantee is made that
              all content is complete or error-free at all times. Third-party services and links are governed
              by their own terms and policies.
            </p>
          </section>

          <section className="panel section-stack">
            <h2 className="type-title-sm">7. Contact</h2>
            <p className="type-body text-foreground/75">
              For legal or service questions, contact:
              <a className="underline ml-1" href="mailto:hello@teacherbek.com">hello@teacherbek.com</a>.
            </p>
          </section>
        </div>
      </main>
      <VanguardFooter />
    </>
  );
}
