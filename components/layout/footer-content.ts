import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

export function getFooterContent(content: SiteContent) {
  const directContactHref = content.social.email
    ? `mailto:${content.social.email}`
    : "/about#contact";

  return {
    siteLinks: content.nav.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    contactLinks: [
      {label: "Get In Touch", href: directContactHref, showIcon: false},
      {label: "Book Intro Call", href: introBookingHref, showIcon: true},
    ],
    legalLinks: [
      {label: "Impressum", href: "/impressum"},
      {label: "Privacy and Cookies", href: "/datenschutz"},
    ],
    copyright: "© Agatha Gurko Music 2026",
    note: content.home.footerNote,
  };
}
