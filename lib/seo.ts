import type {Metadata} from "next";

import {siteContent} from "@/content/site";
import type {AudienceLessonContent} from "@/content/types";
import {env} from "@/lib/env";

const siteName = "Agatha Music";
const homeTitle = "Online Flute Lessons with Agatha Gurko | Agatha Music";
const socialImagePath = "/images/media/open-lesson-preview.png";

export function siteUrl(path = "") {
  return new URL(path, env.NEXT_PUBLIC_SITE_URL).toString();
}

const PERSON_ID = `${siteUrl("/")}#agatha-gurko`;
const WEBSITE_ID = `${siteUrl("/")}#website`;

export function pageMetadata({
  path,
  title,
  description,
  absoluteTitle = false,
}: {
  path: string;
  title: string;
  description: string;
  absoluteTitle?: boolean;
}): Metadata {
  const url = siteUrl(path);
  const image = {
    url: siteUrl(socialImagePath),
    width: 1672,
    height: 941,
    alt: "Online flute lesson with Agatha Gurko",
  };

  return {
    title: absoluteTitle ? {absolute: title} : title,
    description,
    alternates: {canonical: url},
    openGraph: {
      title,
      description,
      url,
      siteName,
      locale: "en",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}

export function landingMetadata(): Metadata {
  return pageMetadata({
    path: "/",
    title: homeTitle,
    description: siteContent.seo.description,
    absoluteTitle: true,
  });
}

export function bookMetadata(): Metadata {
  return pageMetadata({
    path: "/book",
    title: siteContent.booking.heading,
    description: siteContent.booking.copy,
  });
}

export function classesMetadata(): Metadata {
  return pageMetadata({
    path: "/classes",
    title: "Online Music Classes",
    description:
      "Choose flute, recorder, piccolo, music theory and solfege lessons with Agatha Gurko.",
  });
}

export function aboutMetadata(): Metadata {
  return pageMetadata({
    path: "/about",
    title: "About Agatha Gurko",
    description:
      siteContent.about.paragraphs[0] ?? siteContent.seo.description,
  });
}

export function mediaMetadata(): Metadata {
  return pageMetadata({
    path: "/media",
    title: "Flute Teaching Media",
    description: siteContent.openLesson.copy,
  });
}

export function audienceLessonMetadata(
  content: AudienceLessonContent,
): Metadata {
  return pageMetadata({
    path: content.path,
    title: content.seo.title,
    description: content.seo.description,
  });
}

export function siteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Agatha Gurko",
        alternateName: "Agafiia Gurko",
        jobTitle: "Flutist and music teacher",
        url: siteUrl("/about"),
        image: siteUrl("/images/about/agatha-portrait.png"),
        knowsLanguage: ["English", "German", "Russian"],
        sameAs: [
          "https://www.lessonface.com/instructor/agafiia-gurko",
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: siteUrl("/"),
        name: siteName,
        publisher: {"@id": PERSON_ID},
      },
    ],
  };
}

export function serviceStructuredData(content: AudienceLessonContent) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl(content.path)}#service`,
    name: content.title,
    description: content.seo.description,
    serviceType: "Private online flute lessons",
    url: siteUrl(content.path),
    provider: {"@id": PERSON_ID},
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
