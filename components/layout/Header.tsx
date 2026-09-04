"use client";

import Image from "next/image";
import Link from "next/link";
import {useEffect, useRef} from "react";

import {ClassesMenu} from "@/components/layout/ClassesMenu";
import {getFooterContent} from "@/components/layout/footer-content";
import {useHeaderController} from "@/components/layout/useHeaderController";
import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";
import {cn} from "@/lib/utils";

export function Header({
  content,
  variant = "compact",
  showBookingCta = true,
}: {
  content: SiteContent;
  variant?: "compact" | "full" | "home" | "classes";
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
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const navItems = content.nav;
  const footerContent = getFooterContent(content);
  const isHome = variant === "home";

  useEffect(() => {
    if (!menuVisible || window.innerWidth > 640) return;

    const background = [document.querySelector("main"), document.querySelector("footer")]
      .filter((element): element is HTMLElement => element instanceof HTMLElement);
    for (const element of background) element.inert = true;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key !== "Escape" || event.defaultPrevented) {
        return;
      }
      event.preventDefault();
      closeMenu();
      requestAnimationFrame(() => menuTriggerRef.current?.focus());
    }

    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("keydown", closeWithEscape);
      for (const element of background) element.inert = false;
    };
  }, [closeMenu, menuVisible]);

  return (
    <>
    <header
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-[999] bg-transparent px-[21px] pt-[33px] max-[640px]:px-[15px] max-[640px]:pt-[20px]",
        variant === "classes" && "classes-header-frame",
        "min-[641px]:transition-transform min-[641px]:duration-[400ms] min-[641px]:ease-[var(--alias-easeOutCubic)]",
        headerHidden && !menuVisible
          ? "min-[641px]:-translate-y-[calc(100%+12px)]"
          : "min-[641px]:translate-y-0",
        menuVisible &&
          "max-[640px]:fixed max-[640px]:inset-x-0 max-[640px]:top-0 max-[640px]:z-[9999]",
      )}
      data-header-hidden={headerHidden}
      data-menu-state={menuState}
      data-variant={variant}
    >
      <div
        className="pointer-events-none mx-auto w-full max-w-[1660px]"
      >
        <div
          data-header-surface
          className={cn(
            "pointer-events-auto relative grid h-[58px] grid-cols-2 items-center rounded-[5px] bg-[var(--background)] px-[var(--space-24)] text-[var(--ink)] min-[641px]:grid-cols-3 min-[641px]:shadow-[var(--shadow-navigation-surface)] max-[640px]:h-[67px] max-[640px]:px-[var(--space-20)]",
            variant === "classes" && "classes-header-surface",
          )}
        >
          <Link
            href="/"
            aria-label="Home Agatha Music link"
            className="relative z-[2] flex h-full items-center justify-self-start max-[640px]:col-start-1 max-[640px]:row-start-1"
            onClick={closeMenu}
          >
            <Image
              src="/images/agatha-gurko-music.svg"
              alt=""
              aria-hidden="true"
              width={156}
              height={19}
              priority
              className="block h-auto w-[156px] max-w-full"
            />
          </Link>
          <nav
            aria-label="Header Menu"
            className={cn(
              "mai-header-nav justify-self-center min-[641px]:h-full min-[641px]:w-full",
              menuVisible
                ? "max-[640px]:fixed max-[640px]:inset-0 max-[640px]:z-[1] max-[640px]:flex max-[640px]:h-[100dvh] max-[640px]:w-full max-[640px]:flex-col max-[640px]:items-start max-[640px]:overflow-x-hidden max-[640px]:overflow-y-auto max-[640px]:bg-[var(--background)] max-[640px]:px-[var(--space-32)] max-[640px]:pb-[var(--space-32)] max-[640px]:pt-[max(72px,var(--space-100))] max-[640px]:transition-opacity max-[640px]:duration-[700ms] max-[640px]:ease-out"
                : "max-[640px]:absolute max-[640px]:left-0 max-[640px]:right-0 max-[640px]:top-full max-[640px]:z-50 max-[640px]:hidden max-[640px]:w-full max-[640px]:bg-[var(--background)] max-[640px]:px-[var(--space-20)] max-[640px]:pb-[var(--space-30)] max-[640px]:pt-[var(--space-30)]",
              menuVisible &&
                (menuExpanded
                  ? "max-[640px]:opacity-100"
                  : "max-[640px]:pointer-events-none max-[640px]:opacity-0"),
            )}
          >
            <ul className="flex h-full items-center justify-center gap-[var(--space-16)] max-[640px]:block max-[640px]:h-auto max-[640px]:w-full max-[640px]:space-y-0">
            {navItems.map((item) =>
              item.href === "/classes" ? (
                <ClassesMenu
                  key={item.href}
                  lessons={content.lessons}
                  intro={content.pages.classes.heading}
                  mobileMenuVisible={menuVisible}
                  onNavigate={closeMenu}
                />
              ) : (
              <li
                key={item.href}
                className="relative flex h-full items-center justify-center max-[640px]:block max-[640px]:h-11"
              >
                <a
                  href={item.href}
                  className="inline-flex h-[38px] items-center rounded-[4px] px-[10px] hover:bg-[var(--hover-paper)] max-[640px]:h-full max-[640px]:px-0 max-[640px]:leading-[1.8]"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              </li>
              ),
            )}
            </ul>
            <div
              className="mobile-menu-bottom hidden w-full max-[640px]:mt-auto max-[640px]:flex max-[640px]:flex-col max-[640px]:pt-[var(--space-56)]"
              data-mobile-menu-bottom
            >
              {showBookingCta ? (
                <a
                  href={introBookingHref}
                  data-analytics-booking-cta="header"
                  className="mobile-menu-booking-link inline-flex items-center gap-[var(--space-8)] hover:underline"
                  onClick={closeMenu}
                >
                  {content.cta.header}
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
              <div
                className={cn(
                  "flex flex-col items-start gap-[var(--space-16)]",
                  showBookingCta &&
                    "mt-[var(--space-56)]",
                )}
              >
                <p className="ag-footer-copyright w-[269px] max-w-full">
                  {footerContent.copyright}
                </p>
                <p className="ag-footer-note w-[269px] max-w-full">
                  {footerContent.note}
                </p>
              </div>
            </div>
          </nav>
          <div
            className={cn(
              "hidden h-full w-full items-center justify-end min-[861px]:flex",
            )}
          >
            {showBookingCta ? (
              <a
                href={introBookingHref}
                data-analytics-booking-cta="header"
                className="mai-ui inline-flex items-center gap-[var(--space-8)] leading-none hover:underline"
                onClick={closeMenu}
              >
                {content.cta.header}
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
            ref={menuTriggerRef}
            className="group relative z-[2] hidden h-[8px] w-[18px] justify-self-end text-[0] leading-none outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 max-[640px]:col-start-2 max-[640px]:row-start-1 max-[640px]:block"
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
        className={cn(
          "h-[91px] max-[640px]:h-[87px]",
          variant === "classes" && "classes-header-spacer",
        )}
      />
    ) : null}
    </>
  );
}
