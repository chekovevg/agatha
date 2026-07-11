import type {Metadata} from "next";

import {siteContent} from "@/content/site";
import {env} from "@/lib/env";

export function siteUrl(path = "") {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

export function landingMetadata(): Metadata {
  const seo = siteContent.seo;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {canonical: siteUrl("/")},
    openGraph: {
      title: seo.ogTitle,
      description: seo.ogDescription,
      url: siteUrl("/"),
      siteName: "Agatha Music",
      locale: "en",
      type: "website",
    },
  };
}

export function bookMetadata(): Metadata {
  return {
    title: `${siteContent.booking.heading} | Agatha Music`,
    description: siteContent.booking.copy,
    alternates: {canonical: siteUrl("/book")},
  };
}

function editorialPageMetadata(
  path: "/classes" | "/about" | "/media",
  title: string,
  description: string,
): Metadata {
  return {
    title: `${title} | Agatha Music`,
    description,
    alternates: {canonical: siteUrl(path)},
  };
}

export function classesMetadata(): Metadata {
  return editorialPageMetadata(
    "/classes",
    "Classes",
    "Choose flute, recorder, piccolo, music theory, ear training and music history lessons with Agatha Music.",
  );
}

export function aboutMetadata(): Metadata {
  return editorialPageMetadata(
    "/about",
    "About me",
    siteContent.about.paragraphs[0] ?? siteContent.seo.description,
  );
}

export function mediaMetadata(): Metadata {
  return editorialPageMetadata(
    "/media",
    "Media",
    siteContent.openLesson.copy,
  );
}
