import type {MetadataRoute} from "next";

import {locales} from "@/lib/routing";
import {siteUrl} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const localized = locales.flatMap((locale) => [
    {
      url: siteUrl(`/${locale}`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: siteUrl(`/${locale}/book`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: siteUrl(`/${locale}/classes`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: siteUrl(`/${locale}/about`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: siteUrl(`/${locale}/media`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    },
  ]);

  return [
    ...localized,
    {
      url: siteUrl("/impressum"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: siteUrl("/datenschutz"),
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
