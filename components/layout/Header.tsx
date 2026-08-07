"use client";

import Image from "next/image";
import Link from "next/link";

import {useHeaderController} from "@/components/layout/useHeaderController";
import type {SiteContent} from "@/content/types";
import {cn, getExternalLinkProps} from "@/lib/utils";

const mobileFooterLinks = [
  {label: "Contact", href: "/book"},
  {label: "Privacy & Cookies", href: "/datenschutz"},
  {label: "Impressum", href: "/impressum"},
];

export function Header({
  content,
  variant = "compact",
  showBookingCta = true,
}: {
  content: SiteContent;
  variant?: "compact" | "full" | "home";
  showBookingCta?: boolean;
}) {
  const {
    closeMenu,
    headerHidden,
    menuExpanded,
    menuState,
    menuVisible,
    openMenu,
  } = useHeaderController();
  const navItems = content.nav;
  const mobileSocialLinks = [
    content.social.email
      ? {label: "Email", href: `mailto:${content.social.email}`}
      : null,
    content.social.preply
      ? {label: "Preply", href: content.social.preply}
      : null,
    content.social.instagram
      ? {label: "Instagram", href: content.social.instagram}
      : null,
    content.social.telegram
      ? {label: "Telegram", href: content.social.telegram}
      : null,
    content.social.whatsapp
      ? {label: "WhatsApp", href: content.social.whatsapp}
      : null,
  ].filter((link): link is {label: string; href: string} => link != null);
  const isHome = variant === "home";

  return (
    <>
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[999] bg-transparent pt-[calc(33*var(--unit-fx))] max-[860px]:pt-5",
        "min-[861px]:transition-transform min-[861px]:duration-[400ms] min-[861px]:ease-[var(--alias-easeOutCubic)]",
        headerHidden && !menuVisible
          ? "min-[861px]:-translate-y-[calc(100%+12px)]"
          : "min-[861px]:translate-y-0",
        menuVisible &&
          "max-[860px]:fixed max-[860px]:inset-x-0 max-[860px]:top-0 max-[860px]:z-[9999]",
      )}
      data-header-hidden={headerHidden}
      data-menu-state={menuState}
      data-variant={variant}
    >
      <div
        className={cn(
          "pointer-events-none mx-auto w-full px-[calc(15*var(--unit-fx))] drop-shadow-[0_4px_80px_rgba(93,82,75,0.30)] max-[860px]:drop-shadow-none min-[861px]:max-w-[calc(1660*var(--unit-fx))] min-[861px]:px-0",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto relative grid grid-cols-[1fr_2fr] items-center rounded-[5px] bg-[var(--background)] px-[calc(22*var(--unit-fx))] text-[var(--ink)] min-[861px]:h-[calc(70.6875*var(--unit-fx))] max-[860px]:grid-cols-2 max-[860px]:px-[calc(19*var(--unit-fx))]",
          )}
        >
          <Link
            href="/"
            aria-label="Home Agatha Music link"
            className="relative z-[2] justify-self-start py-[calc(22*var(--unit-fx))] max-[860px]:col-start-1 max-[860px]:row-start-1"
            onClick={closeMenu}
          >
            <Image
              src="/images/logo.svg"
              alt=""
              aria-hidden="true"
              width={76}
              height={26}
              priority
              className="block h-[calc(25.06*var(--unit-fx))] w-auto"
            />
          </Link>
          <nav
            aria-label="Header Menu"
            className={cn(
              "mai-ui justify-self-center min-[861px]:absolute min-[861px]:left-1/2 min-[861px]:top-0 min-[861px]:h-full min-[861px]:-translate-x-1/2",
              menuVisible
                ? "max-[860px]:fixed max-[860px]:inset-0 max-[860px]:z-[1] max-[860px]:flex max-[860px]:h-[100dvh] max-[860px]:w-full max-[860px]:flex-col max-[860px]:items-start max-[860px]:justify-between max-[860px]:overflow-x-hidden max-[860px]:overflow-y-auto max-[860px]:bg-[var(--background)] max-[860px]:px-[calc(34*var(--unit-fx))] max-[860px]:pb-[calc(32*var(--unit-fx))] max-[860px]:pt-[calc(100*var(--unit-fx))] max-[860px]:transition-opacity max-[860px]:duration-[700ms] max-[860px]:ease-out"
                : "max-[860px]:absolute max-[860px]:left-0 max-[860px]:right-0 max-[860px]:top-full max-[860px]:z-50 max-[860px]:hidden max-[860px]:w-full max-[860px]:bg-[var(--background)] max-[860px]:px-[calc(19*var(--unit-fx))] max-[860px]:pb-[calc(28*var(--unit-fx))] max-[860px]:pt-[calc(27*var(--unit-fx))]",
              menuVisible &&
                (menuExpanded
                  ? "max-[860px]:opacity-100"
                  : "max-[860px]:pointer-events-none max-[860px]:opacity-0"),
            )}
          >
            <ul className="flex items-center justify-end space-x-[10px] max-[860px]:block max-[860px]:space-x-0 max-[860px]:space-y-[calc(16*var(--unit-fx))]">
            {navItems.map((item) => (
              <li
                key={item.href}
                className="relative flex items-center justify-start py-[calc(14*var(--unit-fx))] max-[860px]:block max-[860px]:py-0"
              >
                <a
                  href={item.href}
                  className="block rounded-[calc(4*var(--unit-fx))] px-[calc(14*var(--unit-fx))] py-[calc(6*var(--unit-fx))] leading-[1.8] hover:bg-[#FBF0DC] max-[860px]:px-0 max-[860px]:py-0 max-[860px]:text-[16px]"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
            ))}
            </ul>
            {showBookingCta ? (
              <a
                href="/book"
                data-analytics-booking-cta="header"
                className="font-ui mt-[calc(28*var(--unit-fx))] hidden items-center gap-[calc(10*var(--unit-fx))] hover:underline max-[860px]:mt-auto max-[860px]:flex max-[860px]:text-[16px] max-[860px]:leading-[1.8]"
                onClick={closeMenu}
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
            <div className="mt-[calc(36*var(--unit-fx))] hidden w-full gap-[calc(20*var(--unit-fx))] max-[860px]:flex">
              <nav
                aria-label="Footer links"
                className="w-1/2 font-ui text-[12px] leading-[1.8]"
              >
                {mobileFooterLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="block hover:underline"
                    onClick={closeMenu}
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
              {mobileSocialLinks.length > 0 ? (
                <nav
                  aria-label="Social links"
                  className="w-1/2 font-ui text-[12px] leading-[1.8]"
                >
                  {mobileSocialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      {...getExternalLinkProps(link.href)}
                      className="block hover:underline"
                      onClick={closeMenu}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              ) : null}
            </div>
          </nav>
          <div
            className={cn(
              "absolute right-[calc(22*var(--unit-fx))] top-1/2 hidden -translate-y-1/2 items-center gap-5 min-[861px]:flex",
            )}
          >
            {showBookingCta ? (
              <a
                href="/book"
                data-analytics-booking-cta="header"
                className="mai-ui inline-flex items-center gap-[calc(10*var(--unit-fx))] leading-none hover:underline max-[860px]:w-full max-[860px]:text-[16px] max-[860px]:leading-[1.8]"
                onClick={closeMenu}
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
            className="group relative z-[2] hidden h-[8px] w-[18px] justify-self-end text-[0] leading-none outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 max-[860px]:col-start-2 max-[860px]:row-start-1 max-[860px]:block"
            type="button"
            aria-label={menuVisible ? "Close Menu" : "Open Menu"}
            aria-expanded={menuExpanded}
            onClick={() => {
              if (menuVisible) {
                closeMenu();
              } else {
                openMenu();
              }
            }}
          >
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-[3px] border-t border-current transition-transform duration-[400ms] ease-[var(--alias-easeOutCubic)]",
                menuVisible && "translate-y-0 -rotate-45",
              )}
            />
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-1/2 top-1/2 block w-full -translate-x-1/2 translate-y-[3px] border-t border-current transition-transform duration-[400ms] ease-[var(--alias-easeOutCubic)]",
                menuVisible && "translate-y-0 rotate-45",
              )}
            />
          </button>
        </div>
      </div>
    </header>
    {!isHome ? (
      <div
        aria-hidden="true"
        className="h-[calc(calc(33*var(--unit-fx))+calc(70.6875*var(--unit-fx)))] max-[860px]:h-[calc(20px+calc(70.6875*var(--unit-fx)))]"
      />
    ) : null}
    </>
  );
}
