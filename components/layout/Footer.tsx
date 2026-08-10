import type {SiteContent} from "@/content/types";
import Link from "next/link";
import Image from "next/image";
import {getFooterContent} from "@/components/layout/footer-content";

export function Footer({
  content,
}: {
  content: SiteContent;
}) {
  const footerContent = getFooterContent(content);

  return (
    <footer className="mx-auto mt-[calc(320*var(--unit-fx))] grid w-[calc(100%_-_32px)] max-w-[1660px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-[var(--space-24)] bg-[var(--background)] pb-[calc(160*var(--unit-fx))] font-ui text-[var(--ink)] max-[1080px]:grid-cols-1 max-[1080px]:gap-x-0 max-[1080px]:gap-y-[var(--space-48)] max-[600px]:pb-[calc(139*var(--unit-fx))]">
      <div className="min-w-0" data-footer-zone="brand">
        <Link href="/" aria-label={`${content.brand} home`}>
          <Image
            src="/images/agatha-gurko-music.svg"
            alt="Agatha Gurko Music"
            width={156}
            height={19}
            className="h-auto w-[156px] max-w-full"
          />
        </Link>
      </div>
      <div
        className="ag-footer-links flex shrink-0 justify-center gap-[var(--space-48)] max-[1080px]:flex-col"
        data-footer-zone="links"
      >
        <nav
          aria-label="Site links"
          className="ag-footer-link-list"
          data-footer-section="site"
        >
          {footerContent.siteLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <nav
          aria-label="Legal links"
          className="ag-footer-link-list"
          data-footer-section="legal"
        >
          {footerContent.legalLinks.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
          <Link className="footer-desktop-only" href="/about#contact">
            Get In Touch
          </Link>
        </nav>
        <nav
          aria-label="Contact links"
          className="ag-footer-link-list"
          data-footer-section="contact"
        >
          {footerContent.contactLinks.map((item) =>
            item.showIcon ? (
              <Link
                key={item.href}
                className="footer-book-link items-center gap-[var(--space-8)]"
                href={item.href}
                data-analytics-booking-cta="footer"
              >
                {item.label}
                <Image
                  src="/icons/arrow-up-right.svg"
                  alt=""
                  aria-hidden="true"
                  width={18}
                  height={18}
                  className="h-[18px] w-[18px]"
                />
              </Link>
            ) : (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ),
          )}
        </nav>
      </div>
      <div
        className="flex min-w-0 flex-col items-end gap-[var(--space-16)] max-[1080px]:items-start"
        data-footer-zone="meta"
      >
        <p className="ag-footer-copyright w-[269px] max-w-full">
          {footerContent.copyright}
        </p>
        <p className="ag-footer-note w-[269px] max-w-full text-[var(--ink)]">
          {footerContent.note}
        </p>
      </div>
    </footer>
  );
}
