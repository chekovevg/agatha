import type {SiteContent} from "@/content/types";
import Link from "next/link";
import Image from "next/image";

export function Footer({
  content,
}: {
  content: SiteContent;
}) {
  const footerNav = content.nav.map((item) => ({
    label: item.label,
    href: item.href,
  }));
  const directContactHref = content.social.email
    ? `mailto:${content.social.email}`
    : "/about#contact";

  return (
    <footer className="mx-auto mt-[calc(320*var(--unit-fx))] grid w-[calc(100%_-_32px)] max-w-[1660px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-start gap-x-6 bg-[var(--background)] pb-[calc(160*var(--unit-fx))] font-ui text-[var(--ink)] max-[1080px]:grid-cols-1 max-[1080px]:gap-x-0 max-[1080px]:gap-y-12 max-[600px]:pb-[calc(139*var(--unit-fx))]">
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
        className="ag-footer-links flex shrink-0 justify-center gap-12 max-[1080px]:flex-col"
        data-footer-zone="links"
      >
        <nav
          aria-label="Site links"
          className="ag-footer-link-list"
          data-footer-section="site"
        >
          {footerNav.map((item) => (
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
          <Link href="/impressum">Impressum</Link>
          <Link href="/datenschutz">Privacy and Cookies</Link>
          <Link className="footer-desktop-only" href="/about#contact">
            Get In Touch
          </Link>
        </nav>
        <nav
          aria-label="Contact links"
          className="ag-footer-link-list"
          data-footer-section="contact"
        >
          <a href={directContactHref}>Get In Touch</a>
          <Link
            className="footer-book-link items-center gap-2"
            href="/book"
            data-analytics-booking-cta="footer"
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
          </Link>
        </nav>
      </div>
      <div
        className="flex min-w-0 flex-col items-end gap-4 max-[1080px]:items-start"
        data-footer-zone="meta"
      >
        <p className="ag-footer-copyright w-[269px] max-w-full">
          &copy; Agatha Gurko Music 2026
        </p>
        <p className="ag-footer-note w-[269px] max-w-full text-[var(--ink)]">
          {content.home.footerNote}
        </p>
      </div>
    </footer>
  );
}
