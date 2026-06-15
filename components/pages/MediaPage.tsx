import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import {VideoPreview} from "@/components/ui/VideoPreview";
import type {MediaItem, SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

const mediaTypeLabels: Record<Locale, Record<MediaItem["type"], string>> = {
  en: {
    photo: "Photo",
    video: "Video",
    audio: "Audio",
  },
  de: {
    photo: "Foto",
    video: "Video",
    audio: "Audio",
  },
  ru: {
    photo: "Фото",
    video: "Видео",
    audio: "Аудио",
  },
};

export function MediaPage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} locale={locale} />
      <main className="editorial-container py-24">
        <section className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="mai-ui text-[var(--muted)]">
              {content.pages.media.eyebrow}
            </p>
            <h1 className="mai-h2 mt-6">
              {content.pages.media.heading}
            </h1>
          </div>
          <p className="mai-body">
            {content.openLesson.copy}
          </p>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="mai-h4">
              {content.openLesson.heading}
            </h2>
            <p className="mai-body mt-6 text-[var(--muted)]">
              {content.openLesson.caption}
            </p>
            <ButtonLink href={`/${locale}/book`} className="mt-8">
              {content.cta.primary}
            </ButtonLink>
          </div>
          <VideoPreview
            title={content.openLesson.caption}
            videoUrl={content.openLesson.videoUrl}
            thumbnail="/images/open-lesson.svg"
          />
        </section>

        <section className="mt-32">
          <h2 className="mai-h4">{content.pages.media.galleryHeading}</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.media.map((item) => (
              <article key={item.title} className="border-t border-[var(--line)] pt-5">
                <div className="relative h-56 overflow-hidden rounded-[var(--radius-card)] bg-[var(--paper)]">
                  <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                </div>
                <p className="mai-ui mt-5 text-[var(--muted)]">
                  {mediaTypeLabels[locale][item.type]}
                </p>
                <h3 className="mai-h7 mt-3">
                  {item.title}
                </h3>
                <p className="mai-body mt-4 text-[var(--muted)]">
                  {item.caption}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer content={content} locale={locale} />
    </div>
  );
}
