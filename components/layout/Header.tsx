"use client";

import {useState} from "react";
import Image from "next/image";

import type {SiteContent} from "@/content/types";
import {Link, type Locale} from "@/lib/routing";
import {ButtonLink} from "@/components/ui/Button";

export function Header({
  content,
  locale,
  variant = "compact",
  showBookingCta = true,
  showLocaleSwitcher = false,
}: {
  content: SiteContent;
  locale: Locale;
  variant?: "compact" | "full" | "home";
  showBookingCta?: boolean;
  showLocaleSwitcher?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navItems = content.nav.map((item) => ({
    ...item,
    href: item.href.startsWith("/") ? `/${locale}${item.href}` : item.href,
  }));
  const localeHref = "/";
  const isHome = variant === "home";
  const shellClassName = isHome
    ? "mx-auto max-w-[1328px] px-5 sm:px-8 2xl:px-0"
    : "mx-auto max-w-[1376px] px-5 sm:px-8 xl:px-0";
  const navFrameClassName = isHome
    ? "flex h-[56px] items-center justify-between gap-4 rounded-[var(--radius-nav)] bg-[var(--background)] px-[18px] shadow-[var(--shadow-elevated)]"
    : "flex h-[58px] items-center justify-between gap-4 rounded-[var(--radius-nav)] bg-[var(--background)] px-[22px] shadow-[var(--shadow-elevated)]";

  return (
    <header
      className={
        isHome
          ? "absolute inset-x-0 top-0 z-40 bg-transparent pt-[28px]"
          : "sticky top-0 z-40 bg-[var(--background)]/90 pt-8 backdrop-blur"
      }
      data-variant={variant}
    >
      <div className={shellClassName}>
        <div className={navFrameClassName}>
          <Link
            href="/"
            locale={locale}
            className="font-display text-[calc(24_*_var(--unit-fx-type))] leading-none text-[var(--ink)]"
          >
            {content.brand}
          </Link>
          <nav className="mai-ui hidden items-center gap-4 text-[var(--ink)] lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-[var(--radius-card)] px-2.5 py-3 hover:bg-[var(--hover-paper)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-5 md:flex">
            {showLocaleSwitcher ? (
              <div className="font-ui flex rounded-full text-xs font-normal text-[var(--muted)]">
                {(["en", "de", "ru"] as const).map((item) => (
                  <Link
                    key={item}
                    href={localeHref}
                    locale={item}
                    className={`rounded-full px-2 py-1 ${
                      item === locale
                        ? "text-[var(--ink)]"
                        : "text-[var(--muted)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {item.toUpperCase()}
                  </Link>
                ))}
              </div>
            ) : null}
            {showBookingCta ? (
              <a
                href={`/${locale}/book`}
                className="mai-ui inline-flex items-center gap-2 hover:text-[var(--muted)]"
              >
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
            ) : null}
          </div>
          <button
            className="mai-ui rounded-[var(--radius-card)] px-3 py-2 md:hidden"
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <div className="mx-5 mt-2 rounded-[var(--radius-card)] bg-[var(--paper)] px-5 py-5 shadow-[var(--shadow-elevated)] md:hidden">
          <nav className="grid gap-4 text-base font-medium">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            {showBookingCta ? (
              <ButtonLink href={`/${locale}/book`} className="mt-2 w-full">
                {content.cta.primary}
              </ButtonLink>
            ) : null}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
