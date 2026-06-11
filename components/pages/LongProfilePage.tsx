import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
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
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

export function LongProfilePage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <>
      <Header content={content} locale={locale} variant="full" />
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
