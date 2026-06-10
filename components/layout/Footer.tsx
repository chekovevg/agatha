import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import Link from "next/link";

export function Footer({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <footer className="border-t-2 border-[var(--line)] bg-[var(--ink)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-black">{content.brand}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/75">
            Flute, recorder and music theory lessons online. Lessons in Russian,
            English and German.
          </p>
        </div>
        <nav className="grid gap-2 text-sm font-bold">
          {content.nav.slice(0, 5).map((item) => (
            <a key={item.href} href={`/${locale}${item.href}`}>
              {item.label}
            </a>
          ))}
        </nav>
        <nav className="grid gap-2 text-sm font-bold">
          <a href={`/${locale}/book`}>{content.cta.primary}</a>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Privacy Policy</Link>
        </nav>
      </div>
    </footer>
  );
}
