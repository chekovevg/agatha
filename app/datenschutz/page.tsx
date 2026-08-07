import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklaerung | Agatha Music",
  description: "Privacy information for Agatha Music.",
};

export default function DatenschutzPage() {
  return (
    <main className="mai-body mx-auto max-w-3xl px-5 py-16">
      <Link className="mai-ui underline" href="/">
        Back to site
      </Link>
      <h1 className="mai-h4 mt-8 break-words">
        Datenschutzerklaerung
      </h1>
      <div className="mt-8 space-y-5 rounded-[var(--radius-card)] bg-[var(--card)] p-6 text-[var(--muted)] shadow-[var(--shadow-elevated)]">
        <p>
          This page is intentionally blocked from production launch until a
          reviewed privacy policy is supplied. Do not publish with placeholder
          privacy text.
        </p>
        <section>
          <h2 className="mai-h7 text-[var(--ink)]">
            Data processing to cover
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Contact form data sent through Resend.</li>
            <li>Booking data handled by Cal.com.</li>
            <li>Vercel hosting, Analytics, and Speed Insights.</li>
            <li>YouTube nocookie video embeds loaded only after click.</li>
            <li>Retention, controller identity, and user rights under GDPR.</li>
          </ul>
        </section>
        <section>
          <h2 className="mai-h7 text-[var(--ink)]">Google Analytics</h2>
          <p className="mt-3">
            Google Analytics is consent-based and remains disabled until you allow it. It is used to measure page and source visits and the booking funnel, without sending booking form contents. You can review or withdraw your consent at any time using the button below.
          </p>
          <button
            className="mai-ui mt-3 underline focus-visible:outline-2 focus-visible:outline-offset-4"
            data-analytics-preferences
            type="button"
          >
            Review analytics preferences
          </button>
        </section>
      </div>
    </main>
  );
}
