import type {MetadataRoute} from "next";

import {siteUrl} from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {url: siteUrl("/"), changeFrequency: "monthly", priority: 1},
    {url: siteUrl("/book"), changeFrequency: "monthly", priority: 0.8},
    {url: siteUrl("/classes"), changeFrequency: "monthly", priority: 0.7},
    {url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.7},
    {url: siteUrl("/media"), changeFrequency: "monthly", priority: 0.6},
    {url: siteUrl("/impressum"), changeFrequency: "yearly", priority: 0.4},
    {url: siteUrl("/datenschutz"), changeFrequency: "yearly", priority: 0.4},
  ];
}
