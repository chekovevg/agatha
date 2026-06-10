import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutzerklaerung | Agathe G. Musik",
  description: "Privacy information for Agathe G. Musik.",
};

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Link className="text-sm font-semibold underline" href="/en">
        Back to site
      </Link>
      <h1 className="mt-8 text-4xl font-black">Datenschutzerklaerung</h1>
      <div className="mt-8 space-y-5 rounded-lg border-2 border-[var(--line)] bg-white p-6 text-[var(--muted)] shadow-[6px_6px_0_var(--line)]">
        <p>
          This page is intentionally blocked from production launch until a
          reviewed privacy policy is supplied. Do not publish with placeholder
          privacy text.
        </p>
        <section>
          <h2 className="text-xl font-black text-[var(--ink)]">
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
      </div>
    </main>
  );
}
