import {AboutPage} from "@/components/pages/AboutPage";
import {siteContent} from "@/content/site";
import {aboutMetadata} from "@/lib/seo";

export const metadata = aboutMetadata();

export default function AboutRoute() {
  return <AboutPage content={siteContent} />;
}
