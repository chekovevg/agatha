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
          This page is a technical placeholder and must be reviewed before
          launch. The v1 stack collects contact form data only to send email via
          Resend and uses Cal.com as the booking provider.
        </p>
        <p>
          YouTube video embeds are loaded only after user interaction. Vercel
          Analytics and Speed Insights are included for cookieless site metrics.
        </p>
      </div>
    </main>
  );
}
