import {AudienceLessonPage} from "@/components/pages/AudienceLessonPage";
import {siteContent} from "@/content/site";
import {audienceLessonMetadata} from "@/lib/seo";

export const metadata = audienceLessonMetadata(
  siteContent.audienceLessons.adults,
);

export default function AdultFluteLessonsPage() {
  return (
    <AudienceLessonPage
      content={siteContent.audienceLessons.adults}
      site={siteContent}
    />
  );
}
