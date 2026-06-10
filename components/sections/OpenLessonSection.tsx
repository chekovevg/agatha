import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";
import {ButtonLink} from "@/components/ui/Button";
import {VideoPreview} from "@/components/ui/VideoPreview";

export function OpenLessonSection({content}: {content: SiteContent}) {
  return (
    <Section id="open-lesson" tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <SectionHeader title={content.openLesson.heading} intro={content.openLesson.copy} />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="#booking">{content.cta.primary}</ButtonLink>
            <ButtonLink href="#media" variant="secondary">
              Watch more media
            </ButtonLink>
          </div>
        </div>
        <VideoPreview
          title={content.openLesson.caption}
          videoUrl={content.openLesson.videoUrl}
          thumbnail="/images/open-lesson.svg"
        />
      </div>
    </Section>
  );
}
