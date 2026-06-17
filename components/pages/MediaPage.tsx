import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {SplitLinkButton} from "@/components/ui/SplitLinkButton";
import {VideoPreview} from "@/components/ui/VideoPreview";
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

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
      <main className="mx-auto grid w-full justify-items-center px-5 pb-0 pt-[calc(154*var(--unit-fx))] text-center max-[600px]:pt-[calc(72*var(--unit-fx))]">
        <section className="grid w-full justify-items-center">
          <h1 className="mai-h3 text-[var(--ink)]">
            {content.pages.media.heading}
          </h1>
          <p className="mai-text-large mt-[calc(18*var(--unit-fx))] text-[var(--ink)] max-[600px]:mt-4">
            {content.openLesson.copy}
          </p>

          <VideoPreview
            title={content.openLesson.caption}
            videoUrl={content.openLesson.videoUrl}
            thumbnail="/images/media/open-lesson-preview.png"
            playLabel="Watch preview"
            unoptimizedThumbnail
            className="mt-[calc(82*var(--unit-fx))] w-full max-w-[calc(844*var(--unit-fx))] max-[600px]:mt-12"
          />

          <SplitLinkButton href={`/${locale}/book`} className="mt-[calc(100*var(--unit-fx))] max-[600px]:mt-12">
            {content.cta.primary}
          </SplitLinkButton>
        </section>
      </main>
      <Footer content={content} locale={locale} />
    </div>
  );
}
