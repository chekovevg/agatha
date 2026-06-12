import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | Agathe G. Musik",
  description: "Provider information for Agathe G. Musik.",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Link className="font-ui text-sm font-medium underline" href="/en">
        Back to site
      </Link>
      <h1 className="font-display mt-8 text-4xl font-normal">Impressum</h1>
      <div className="mt-8 space-y-5 rounded-[var(--radius-card)] bg-[var(--card)] p-6 text-[var(--muted)] shadow-[var(--shadow-elevated)]">
        <p>
          This page is intentionally blocked from production launch until real
          provider details are supplied and reviewed. Do not invent legal data.
        </p>
        <section>
          <h2 className="font-display text-xl font-normal text-[var(--ink)]">
            Required launch inputs
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Legal name of the service provider.</li>
            <li>Postal address for the provider information.</li>
            <li>Contact email and, if required, phone number.</li>
            <li>Any registration, tax, or professional details that apply.</li>
            <li>Human legal review for German commercial website compliance.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
