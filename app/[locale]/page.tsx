import type {Metadata} from "next";
import {notFound} from "next/navigation";

import {siteContent} from "@/content/site";
import {isLocale, locales, type Locale} from "@/lib/routing";
import {landingMetadata} from "@/lib/seo";
import {AboutSection} from "@/components/sections/AboutSection";
import {BookingSection} from "@/components/sections/BookingSection";
import {ContactSection} from "@/components/sections/ContactSection";
import {FAQSection} from "@/components/sections/FAQSection";
import {HeroSection} from "@/components/sections/HeroSection";
import {LessonsSection} from "@/components/sections/LessonsSection";
import {MediaGallerySection} from "@/components/sections/MediaGallerySection";
import {MethodSection} from "@/components/sections/MethodSection";
import {OpenLessonSection} from "@/components/sections/OpenLessonSection";
import {ReviewsSection} from "@/components/sections/ReviewsSection";
import {TrustStrip} from "@/components/sections/TrustStrip";
import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";

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

  return landingMetadata(locale);
}

export default async function LocaleHome({params}: PageProps) {
  const {locale: rawLocale} = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale: Locale = rawLocale;
  const content = siteContent[locale];

  return (
    <>
      <Header content={content} locale={locale} />
      <main>
        <HeroSection content={content} locale={locale} />
        <TrustStrip items={content.trust} />
        <LessonsSection content={content} />
        <AboutSection content={content.about} />
        <MethodSection content={content.method} />
        <OpenLessonSection content={content} />
        <MediaGallerySection items={content.media} />
        <ReviewsSection content={content.reviews} />
        <BookingSection content={content} locale={locale} />
        <FAQSection items={content.faq} />
        <ContactSection content={content} />
      </main>
      <Footer content={content} locale={locale} />
    </>
  );
}
