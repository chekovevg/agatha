import type {SiteContent} from "@/content/types";
import {getExternalLinkProps} from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export function Footer({
  content,
}: {
  content: SiteContent;
}) {
  const footerBookLabel = "Book a lesson";
  const footerNav = content.nav.map((item) => ({
    label: item.label,
    href: item.href,
  }));
  const socialLinks = [
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

  return (
    <footer className="mx-auto mt-[calc(320*var(--unit-fx))] grid max-w-[calc(1660*var(--unit-fx))] grid-cols-[repeat(24,minmax(0,1fr))] gap-[calc(20*var(--unit-fx))] bg-[var(--background)] pb-[27px] font-ui text-[var(--ink)] max-[600px]:block max-[600px]:w-[calc(100%_-_calc(32*var(--unit-fx)))] max-[600px]:space-y-[calc(40*var(--unit-fx))]">
      <div className="col-span-4">
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
      <nav
        aria-label="Site links"
        className="ag-footer-link-list col-span-3"
        data-footer-section="site"
      >
        <a
          className="footer-book-link items-center gap-[calc(10*var(--unit-fx))]"
          href="/book"
        >
          {footerBookLabel}
          <Image
            src="/icons/arrow-up-right.svg"
            alt=""
            aria-hidden="true"
            width={18}
            height={18}
            className="h-[18px] w-[18px]"
          />
        </a>
        {footerNav.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <nav
        aria-label="Social links"
        className="ag-footer-link-list col-span-3"
        data-footer-section="social"
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...getExternalLinkProps(link.href)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <nav
        aria-label="Legal links"
        className="ag-footer-link-list col-span-3"
        data-footer-section="legal"
      >
        <Link href="/impressum">Impressum</Link>
        <Link href="/datenschutz">Privacy &amp; Cookies</Link>
      </nav>
      <div className="col-start-17 col-span-8 max-[600px]:w-full">
        <p className="ag-footer-copyright">&copy; Agata Gurko Music 2026</p>
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
