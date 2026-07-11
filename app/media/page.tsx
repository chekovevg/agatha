import {MediaPage} from "@/components/pages/MediaPage";
import {siteContent} from "@/content/site";
import {mediaMetadata} from "@/lib/seo";

export const metadata = mediaMetadata();

export default function MediaRoute() {
  return <MediaPage content={siteContent} />;
}
