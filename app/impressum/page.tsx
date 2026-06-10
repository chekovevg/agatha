import type {Metadata} from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Impressum | Agathe G. Musik",
  description: "Provider information for Agathe G. Musik.",
};

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <Link className="text-sm font-semibold underline" href="/en">
        Back to site
      </Link>
      <h1 className="mt-8 text-4xl font-black">Impressum</h1>
      <div className="mt-8 space-y-5 rounded-lg border-2 border-[var(--line)] bg-white p-6 text-[var(--muted)] shadow-[6px_6px_0_var(--line)]">
        <p>
          This page is a technical placeholder. German commercial provider
          information must be completed with Agathe&apos;s real legal details before
          production launch.
        </p>
        <p>
          Required fields usually include name, postal address, contact email,
          and any legally required registration or professional information.
        </p>
      </div>
    </main>
  );
}
