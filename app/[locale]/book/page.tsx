import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {BookingSection} from "@/components/sections/BookingSection";
import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {siteContent} from "@/content/site";
import {isLocale, locales, type Locale} from "@/lib/routing";
import {bookMetadata} from "@/lib/seo";

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

  return bookMetadata(locale);
}

export default async function BookPage({params}: PageProps) {
  const {locale: rawLocale} = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const content = siteContent[locale];

  return (
    <>
      <Header content={content} locale={locale} />
      <main className="pt-10">
        <h1 className="sr-only">{content.booking.heading}</h1>
        <BookingSection content={content} locale={locale} expanded />
      </main>
      <Footer content={content} locale={locale} />
    </>
  );
}
