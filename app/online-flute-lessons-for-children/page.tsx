import {AudienceLessonPage} from "@/components/pages/AudienceLessonPage";
import {siteContent} from "@/content/site";
import {audienceLessonMetadata} from "@/lib/seo";

export const metadata = audienceLessonMetadata(
  siteContent.audienceLessons.children,
);

export default function ChildFluteLessonsPage() {
  return (
    <AudienceLessonPage
      content={siteContent.audienceLessons.children}
      site={siteContent}
    />
  );
}
