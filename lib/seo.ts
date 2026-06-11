import type {Metadata} from "next";

import {siteContent} from "@/content/site";
import {env} from "@/lib/env";
import type {Locale} from "@/lib/routing";
import {locales} from "@/lib/routing";

export function siteUrl(path = "") {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

export function localizedAlternates(path = "") {
  return Object.fromEntries(
    locales.map((locale) => [locale, siteUrl(`/${locale}${path}`)]),
  );
}

export function landingMetadata(locale: Locale): Metadata {
  const seo = siteContent[locale].seo;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: siteUrl(`/${locale}`),
      languages: localizedAlternates(),
    },
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: siteUrl(`/${locale}`),
      siteName: "Agathe G. Musik",
      locale,
      type: "website",
    },
  };
}

export function bookMetadata(locale: Locale): Metadata {
  const content = siteContent[locale];

  return {
    title: `${content.booking.heading} | Agathe G. Musik`,
    description: content.booking.copy,
    alternates: {
      canonical: siteUrl(`/${locale}/book`),
      languages: localizedAlternates("/book"),
    },
  };
}

export function fullProfileMetadata(locale: Locale): Metadata {
  const seo = siteContent[locale].seo;

  return {
    title: `Full profile | ${seo.title}`,
    description: seo.description,
    alternates: {
      canonical: siteUrl(`/${locale}/full`),
      languages: localizedAlternates("/full"),
    },
  };
}
