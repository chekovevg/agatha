import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {BookingSection} from "@/components/sections/BookingSection";
import {siteContent} from "@/content/site";
import {bookMetadata} from "@/lib/seo";

export const metadata = bookMetadata();

export default function BookPage() {
  return (
    <>
      <Header content={siteContent} />
      <main className="pt-10">
        <h1 className="sr-only">{siteContent.booking.heading}</h1>
        <BookingSection content={siteContent} expanded />
      </main>
      <Footer content={siteContent} />
    </>
  );
}
