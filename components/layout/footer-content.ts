import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

export function getFooterContent(content: SiteContent) {
  return {
    siteLinks: content.nav.map((item) => ({
      label: item.label,
      href: item.href,
    })),
    contactLinks: [
      {label: "Book a Call", href: introBookingHref, showIcon: true},
    ],
    legalLinks: [
      {label: "Impressum", href: "/impressum"},
      {label: "Privacy and Cookies", href: "/datenschutz"},
    ],
    copyright: "© Agatha Gurko Music 2026",
    note: content.home.footerNote,
  };
}
