import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {AboutPage} from "@/components/pages/AboutPage";
import {siteContent} from "@/content/site";
import {isLocale, locales, type Locale} from "@/lib/routing";
import {aboutMetadata} from "@/lib/seo";

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

  return aboutMetadata(locale);
}

export default async function AboutRoute({params}: PageProps) {
  const {locale: rawLocale} = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  return <AboutPage content={siteContent[locale]} locale={locale} />;
}
