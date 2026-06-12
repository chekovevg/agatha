"use client";

import {useState} from "react";

import type {SiteContent} from "@/content/types";
import {Link, type Locale, locales} from "@/lib/routing";
import {ButtonLink} from "@/components/ui/Button";
import {StyleSwitcher} from "@/components/ui/StyleSwitcher";

export function Header({
  content,
  locale,
  variant = "compact",
}: {
  content: SiteContent;
  locale: Locale;
  variant?: "compact" | "full";
}) {
  const [open, setOpen] = useState(false);
  const navItems =
    variant === "compact"
      ? [
          {label: content.nav[0]?.label ?? "Lessons", href: "#lessons"},
          {
            label:
              content.booking.eventTypes[0]?.title ?? content.booking.heading,
            href: "#trial",
          },
          {label: content.nav[3]?.label ?? "Reviews", href: "#reviews"},
          {label: content.dashboard.fullProfileCta, href: `/${locale}/full`},
          {
            label: content.nav[6]?.label ?? "Contact",
            href: `/${locale}/full#contact`,
          },
        ]
      : content.nav;
  const localeHref = variant === "full" ? "/full" : "/";

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--surface-nav)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Link
          href="/"
          locale={locale}
          className="font-display text-sm font-bold leading-none text-[var(--ink)]"
        >
          {content.brand}
        </Link>
        <nav className="font-ui hidden items-center gap-5 text-xs font-normal text-[var(--ink)] lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-1 py-2 hover:text-[var(--muted)]"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <StyleSwitcher />
          <div className="font-ui flex rounded-full border border-[var(--line)] bg-[var(--paper)] p-1 text-xs font-medium shadow-[var(--shadow-inset)]">
            {locales.map((item) => (
              <Link
                key={item}
                href={localeHref}
                locale={item}
                className={`rounded-full px-3 py-1.5 ${
                  item === locale
                    ? "bg-[var(--card)] text-[var(--ink)] shadow-[var(--shadow-inset)]"
                    : "text-[var(--muted)]"
                }`}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <ButtonLink href={`/${locale}/book`}>{content.cta.primary}</ButtonLink>
        </div>
        <button
          className="font-ui rounded-full border border-[var(--line)] bg-[var(--card)] px-4 py-2 text-sm font-medium shadow-[var(--shadow-control)] md:hidden"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="border-t border-[var(--line)] bg-[var(--card)] px-5 py-5 md:hidden">
          <nav className="grid gap-4 text-base font-medium">
            <StyleSwitcher />
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <ButtonLink href={`/${locale}/book`} className="mt-2 w-full">
              {content.cta.primary}
            </ButtonLink>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
