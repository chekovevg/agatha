import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {SplitLinkButton} from "@/components/ui/SplitLinkButton";
import {VideoPreview} from "@/components/ui/VideoPreview";
import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

export function MediaPage({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} />
      <main className="mx-auto grid w-full justify-items-center px-[var(--space-20)] pb-0 pt-[var(--space-160)] text-center max-[600px]:pt-[var(--space-72)]">
        <section className="grid w-full justify-items-center">
          <h1 className="mai-h3 text-[var(--ink)]">
            {content.pages.media.heading}
          </h1>
          <p className="mai-text-large mt-[var(--space-20)] text-[var(--ink)] max-[600px]:mt-[var(--space-16)]">
            {content.openLesson.copy}
          </p>

          <VideoPreview
            title={content.openLesson.caption}
            videoUrl={content.openLesson.videoUrl}
            thumbnail="/images/media/open-lesson-preview.png"
            playLabel="Watch preview"
            unoptimizedThumbnail
            className="mt-[var(--space-80)] w-full max-w-[calc(844*var(--unit-fx))] max-[600px]:mt-[var(--space-48)]"
          />

          <SplitLinkButton href={introBookingHref} className="mt-[var(--space-100)] max-[600px]:mt-[var(--space-48)]" data-analytics-booking-cta="media">
            {content.cta.primary}
          </SplitLinkButton>
        </section>
      </main>
      <Footer content={content} />
    </div>
  );
}
