import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {BookingSection} from "@/components/sections/BookingSection";
import {siteContent} from "@/content/site";
import type {BookingMode} from "@/content/types";
import {bookMetadata} from "@/lib/seo";

export const metadata = bookMetadata();

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string | string[];
    subject?: string | string[];
  }>;
}) {
  const query = await searchParams;
  const mode: BookingMode = query.type === "lesson" ? "lesson" : "intro";
  const subject =
    mode === "lesson" &&
    typeof query.subject === "string" &&
    siteContent.lessons.some((lesson) => lesson.title === query.subject)
      ? query.subject
      : undefined;

  return (
    <>
      <Header content={siteContent} />
      <main className="pt-10">
        <BookingSection
          content={siteContent}
          expanded
          mode={mode}
          subject={subject}
        />
      </main>
      <Footer content={siteContent} />
    </>
  );
}
