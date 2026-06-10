"use client";

import {useState} from "react";

import type {SiteContent} from "@/content/types";
import {Link, type Locale, locales} from "@/lib/routing";
import {ButtonLink} from "@/components/ui/Button";

export function Header({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-[var(--line)] bg-[var(--background)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" locale={locale} className="text-lg font-black">
          {content.brand}
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold lg:flex">
          {content.nav.map((item) => (
            <a key={item.href} href={item.href} className="hover:underline">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex rounded-md border-2 border-[var(--line)] bg-white text-xs font-black">
            {locales.map((item) => (
              <Link
                key={item}
                href="/"
                locale={item}
                className={`px-2.5 py-2 ${
                  item === locale ? "bg-[var(--leaf)] text-white" : ""
                }`}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <ButtonLink href={`/${locale}/book`}>{content.cta.primary}</ButtonLink>
        </div>
        <button
          className="rounded-md border-2 border-[var(--line)] bg-white px-3 py-2 text-sm font-black md:hidden"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>
      {open ? (
        <div className="border-t-2 border-[var(--line)] bg-white px-5 py-5 md:hidden">
          <nav className="grid gap-3 text-base font-bold">
            {content.nav.map((item) => (
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
