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
        "pointer-events-none fixed inset-x-0 top-0 z-[999] bg-transparent pt-[calc(33*var(--unit-fx))] max-[600px]:pt-5",
        "min-[601px]:transition-transform min-[601px]:duration-[400ms] min-[601px]:ease-[var(--alias-easeOutCubic)]",
        headerHidden && !menuVisible
          ? "min-[601px]:-translate-y-[calc(100%+12px)]"
          : "min-[601px]:translate-y-0",
        menuVisible &&
          "max-[600px]:fixed max-[600px]:inset-x-0 max-[600px]:top-0 max-[600px]:z-[9999]",
      )}
      data-header-hidden={headerHidden}
      data-menu-state={menuState}
      data-variant={variant}
    >
      <div
        className={cn(
          "pointer-events-none mx-auto w-full px-[calc(15*var(--unit-fx))] drop-shadow-[0_4px_80px_rgba(93,82,75,0.30)] max-[600px]:drop-shadow-none min-[601px]:max-w-[calc(1660*var(--unit-fx))] min-[601px]:px-0",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto relative grid grid-cols-[1fr_2fr] items-center rounded-[5px] bg-[var(--background)] px-[calc(22*var(--unit-fx))] text-[var(--ink)] min-[601px]:h-[calc(70.6875*var(--unit-fx))] max-[600px]:grid-cols-2 max-[600px]:px-[calc(19*var(--unit-fx))]",
          )}
        >
          <Link
            href="/"
            aria-label="Home Agatha Music link"
            className="relative z-[2] justify-self-start py-[calc(22*var(--unit-fx))] max-[600px]:col-start-1 max-[600px]:row-start-1"
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
              "mai-ui justify-self-center min-[601px]:absolute min-[601px]:left-1/2 min-[601px]:top-0 min-[601px]:h-full min-[601px]:-translate-x-1/2",
              menuVisible
                ? "max-[600px]:fixed max-[600px]:inset-0 max-[600px]:z-[1] max-[600px]:flex max-[600px]:h-[100dvh] max-[600px]:w-full max-[600px]:flex-col max-[600px]:items-start max-[600px]:justify-between max-[600px]:overflow-x-hidden max-[600px]:overflow-y-auto max-[600px]:bg-[var(--background)] max-[600px]:px-[calc(34*var(--unit-fx))] max-[600px]:pb-[calc(32*var(--unit-fx))] max-[600px]:pt-[calc(100*var(--unit-fx))] max-[600px]:transition-opacity max-[600px]:duration-[700ms] max-[600px]:ease-out"
                : "max-[600px]:absolute max-[600px]:left-0 max-[600px]:right-0 max-[600px]:top-full max-[600px]:z-50 max-[600px]:hidden max-[600px]:w-full max-[600px]:bg-[var(--background)] max-[600px]:px-[calc(19*var(--unit-fx))] max-[600px]:pb-[calc(28*var(--unit-fx))] max-[600px]:pt-[calc(27*var(--unit-fx))]",
              menuVisible &&
                (menuExpanded
                  ? "max-[600px]:opacity-100"
                  : "max-[600px]:pointer-events-none max-[600px]:opacity-0"),
            )}
          >
            <ul className="flex items-center justify-end space-x-[10px] max-[600px]:block max-[600px]:space-x-0 max-[600px]:space-y-[calc(16*var(--unit-fx))]">
            {navItems.map((item) => (
              <li
                key={item.href}
                className="relative flex items-center justify-start py-[calc(14*var(--unit-fx))] max-[600px]:block max-[600px]:py-0"
              >
                <a
                  href={item.href}
                  className="block rounded-[calc(4*var(--unit-fx))] px-[calc(14*var(--unit-fx))] py-[calc(6*var(--unit-fx))] leading-[1.8] hover:bg-[#FBF0DC] max-[600px]:px-0 max-[600px]:py-0 max-[600px]:text-[16px]"
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
                className="font-ui mt-[calc(28*var(--unit-fx))] hidden items-center gap-[calc(10*var(--unit-fx))] hover:underline max-[600px]:mt-auto max-[600px]:flex max-[600px]:text-[16px] max-[600px]:leading-[1.8]"
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
            <div className="mt-[calc(36*var(--unit-fx))] hidden w-full gap-[calc(20*var(--unit-fx))] max-[600px]:flex">
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
              "absolute right-[calc(22*var(--unit-fx))] top-1/2 hidden -translate-y-1/2 items-center gap-5 min-[601px]:flex",
            )}
          >
            {showBookingCta ? (
              <a
                href="/book"
                data-analytics-booking-cta="header"
                className="mai-ui inline-flex items-center gap-[calc(10*var(--unit-fx))] leading-none hover:underline max-[600px]:w-full max-[600px]:text-[16px] max-[600px]:leading-[1.8]"
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
            className="group relative z-[2] hidden h-[8px] w-[18px] justify-self-end text-[0] leading-none outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 max-[600px]:col-start-2 max-[600px]:row-start-1 max-[600px]:block"
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
        className="h-[calc(calc(33*var(--unit-fx))+calc(70.6875*var(--unit-fx)))] max-[600px]:h-[calc(20px+calc(70.6875*var(--unit-fx)))]"
      />
    ) : null}
    </>
  );
}
