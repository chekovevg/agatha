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
      siteName: "Agatha Music",
      locale,
      type: "website",
    },
  };
}

export function bookMetadata(locale: Locale): Metadata {
  const content = siteContent[locale];

  return {
    title: `${content.booking.heading} | Agatha Music`,
    description: content.booking.copy,
    alternates: {
      canonical: siteUrl(`/${locale}/book`),
      languages: localizedAlternates("/book"),
    },
  };
}

function editorialPageMetadata(
  locale: Locale,
  path: "/classes" | "/about" | "/media",
  title: string,
  description: string,
): Metadata {
  return {
    title: `${title} | Agatha Music`,
    description,
    alternates: {
      canonical: siteUrl(`/${locale}${path}`),
      languages: localizedAlternates(path),
    },
  };
}

export function classesMetadata(locale: Locale): Metadata {
  return editorialPageMetadata(
    locale,
    "/classes",
    "Classes",
    "Choose flute, recorder, piccolo, music theory, ear training and music history lessons with Agatha Music.",
  );
}

export function aboutMetadata(locale: Locale): Metadata {
  const content = siteContent[locale];

  return editorialPageMetadata(
    locale,
    "/about",
    "About me",
    content.about.paragraphs[0] ?? content.seo.description,
  );
}

export function mediaMetadata(locale: Locale): Metadata {
  const content = siteContent[locale];

  return editorialPageMetadata(
    locale,
    "/media",
    "Media",
    content.openLesson.copy,
  );
}
