import {HomePage} from "@/components/pages/HomePage";
import {siteContent} from "@/content/site";
import {landingMetadata} from "@/lib/seo";

export const metadata = landingMetadata();

export default function Home() {
  return <HomePage content={siteContent} />;
}
