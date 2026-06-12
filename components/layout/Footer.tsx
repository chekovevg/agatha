import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import Link from "next/link";
import {env} from "@/lib/env";

export function Footer({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const externalLinks = [
    env.NEXT_PUBLIC_PREPLY_URL
      ? {label: "Preply", href: env.NEXT_PUBLIC_PREPLY_URL}
      : null,
    env.NEXT_PUBLIC_INSTAGRAM_URL
      ? {label: "Instagram", href: env.NEXT_PUBLIC_INSTAGRAM_URL}
      : null,
    env.NEXT_PUBLIC_WHATSAPP_URL
      ? {label: "WhatsApp", href: env.NEXT_PUBLIC_WHATSAPP_URL}
      : null,
  ].filter(Boolean) as {label: string; href: string}[];
  const footerNav = [
    {label: content.nav[0]?.label ?? "Lessons", href: `/${locale}#lessons`},
    {
      label: content.booking.eventTypes[0]?.title ?? content.booking.heading,
      href: `/${locale}#trial`,
    },
    {label: content.nav[3]?.label ?? "Reviews", href: `/${locale}#reviews`},
    {label: content.dashboard.fullProfileCta, href: `/${locale}/full`},
    {label: content.nav[6]?.label ?? "Contact", href: `/${locale}/full#contact`},
  ];

  return (
    <footer className="border-t border-[var(--line)] bg-[var(--background)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-5 py-10 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="font-display text-xl font-normal">{content.brand}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--muted)]">
            Flute, recorder and music theory lessons online. Lessons in Russian,
            English and German.
          </p>
        </div>
        <nav className="font-ui grid gap-2 text-xs font-normal">
          {footerNav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <nav className="font-ui grid gap-2 text-xs font-normal">
          <a href={`/${locale}/book`}>{content.cta.primary}</a>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Privacy Policy</Link>
          {externalLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
