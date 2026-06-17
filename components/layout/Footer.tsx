import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import Link from "next/link";
import Image from "next/image";

export function Footer({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const footerNav = content.nav.map((item) => ({
    label: item.label,
    href: `/${locale}${item.href}`,
  }));
  const socialLinks = [
    {label: "Email", href: "#"},
    {label: "Telegram", href: "#"},
    {label: "WhatsApp", href: "#"},
  ];

  return (
    <footer className="mx-auto mt-[calc(320*var(--unit-fx))] grid max-w-[calc(1660*var(--unit-fx))] grid-cols-[repeat(24,minmax(0,1fr))] gap-[calc(20*var(--unit-fx))] bg-[var(--background)] px-[calc(22*var(--unit-fx))] pb-[27px] font-ui text-[var(--ink)] max-[600px]:block max-[600px]:w-[calc(100%_-_calc(32*var(--unit-fx)))] max-[600px]:space-y-[calc(40*var(--unit-fx))] max-[600px]:px-0">
      <div className="col-span-4">
        <Link href={`/${locale}`} aria-label={`${content.brand} home`}>
          <Image
            src="/images/agatha-gurko-music.svg"
            alt="Agatha Gurko Music"
            width={156}
            height={19}
            className="h-auto w-[156px] max-w-full"
          />
        </Link>
      </div>
      <nav
        aria-label="Site links"
        className="ag-footer-link-list col-start-8 col-span-2"
        data-footer-section="site"
      >
        {footerNav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <nav
        aria-label="Social links"
        className="ag-footer-link-list col-start-10 col-span-3"
        data-footer-section="social"
      >
        {socialLinks.map((link) => (
          <a key={link.label} href={link.href} aria-disabled="true" tabIndex={-1}>
            {link.label}
          </a>
        ))}
      </nav>
      <nav
        aria-label="Legal links"
        className="ag-footer-link-list col-start-13 col-span-4"
        data-footer-section="legal"
      >
        <a className="footer-book-link items-center gap-[calc(10*var(--unit-fx))]" href={`/${locale}/book`}>
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
        <Link href="/datenschutz">Privacy &amp; Cookies</Link>
      </nav>
      <div className="col-start-20 col-span-5 max-[600px]:w-full">
        <p className="ag-footer-note text-[var(--ink)]">
          {content.home.footerNote}
        </p>
      </div>
      <div
        aria-hidden="true"
        className="ag-footer-bottom-spacer col-start-13 col-span-12 max-[600px]:w-full"
        data-footer-section="bottom-spacer"
      />
    </footer>
  );
}
