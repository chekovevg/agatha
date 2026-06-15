import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import Link from "next/link";
import Image from "next/image";
import {env} from "@/lib/env";

export function Footer({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const externalLinks = [
    content.social.email
      ? {label: "Email", href: `mailto:${content.social.email}`}
      : null,
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
    ...content.nav.map((item) => ({
      label: item.label,
      href: `/${locale}${item.href}`,
    })),
  ];

  return (
    <footer className="bg-[var(--background)] text-[var(--ink)]">
      <div className="mx-auto grid max-w-[1408px] gap-8 px-6 pb-6 pt-0 md:grid-cols-[minmax(150px,1fr)_112px_112px_184px_minmax(240px,1fr)] md:items-start xl:px-0">
        <div>
          <p className="font-display text-[calc(24_*_var(--unit-fx-type))] leading-none">
            {content.brand}
          </p>
        </div>
        <nav className="mai-ui grid content-start gap-3">
          {footerNav.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <nav className="mai-ui grid content-start gap-3">
          {externalLinks.map((link) => (
            <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </nav>
        <nav className="mai-ui grid content-start gap-3">
          <a href={`/${locale}/book`} className="inline-flex items-center gap-2">
            {content.cta.primary}
            <Image
              src="/icons/arrow-up-right.svg"
              alt=""
              aria-hidden="true"
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </a>
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Privacy and Cookies</Link>
        </nav>
        <div>
          <p className="mai-ui max-w-xs leading-[1.4] text-[var(--ink)]">
            {content.home.footerNote}
          </p>
        </div>
      </div>
    </footer>
  );
}
