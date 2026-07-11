import {ClassesPage} from "@/components/pages/ClassesPage";
import {siteContent} from "@/content/site";
import {classesMetadata} from "@/lib/seo";

export const metadata = classesMetadata();

export default function ClassesRoute() {
  return <ClassesPage content={siteContent} />;
}
