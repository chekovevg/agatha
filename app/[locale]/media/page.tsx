import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {MediaPage} from "@/components/pages/MediaPage";
import {siteContent} from "@/content/site";
import {isLocale, locales, type Locale} from "@/lib/routing";
import {mediaMetadata} from "@/lib/seo";

type PageProps = {
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!isLocale(locale)) {
    return {};
  }

  return mediaMetadata(locale);
}

export default async function MediaRoute({params}: PageProps) {
  const {locale: rawLocale} = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  return <MediaPage content={siteContent[locale]} locale={locale} />;
}
