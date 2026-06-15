import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import type {Lesson, SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

const lessonImages: Record<string, string> = {
  flute: "/images/classes/flute.png",
  recorder: "/images/classes/recorder.png",
  piccolo: "/images/classes/piccolo.png",
  "music-theory": "/images/classes/music-theory.png",
  "ear-training": "/images/classes/ear-training.png",
  "music-history": "/images/classes/music-theory.png",
};

const lessonOrder = [
  "flute",
  "recorder",
  "piccolo",
  "music-theory",
  "ear-training",
  "music-history",
];

export function ClassesPage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} locale={locale} />
      <main className="editorial-container py-[calc(144_*_var(--unit-fx))]">
        <h1 className="mai-h4 mx-auto max-w-[613px] text-center">
          {content.pages.classes.heading}
        </h1>
        <div className="mx-auto mt-[calc(144_*_var(--unit-fx))] grid max-w-[1150px] gap-[calc(24_*_var(--unit-fx))]">
          {lessonOrder
            .map((slug) => content.lessons.find((lesson) => lesson.slug === slug))
            .filter((lesson): lesson is Lesson => Boolean(lesson))
            .map((lesson) => (
              <LessonRow
                key={lesson.slug}
                lesson={lesson}
                locale={locale}
                bookingLabel={content.cta.primary}
              />
            ))}
        </div>
      </main>
      <Footer content={content} locale={locale} />
    </div>
  );
}

function LessonRow({
  lesson,
  locale,
  bookingLabel,
}: {
  lesson: Lesson;
  locale: Locale;
  bookingLabel: string;
}) {
  return (
    <article className="grid min-h-[328px] gap-8 rounded-[var(--radius-card)] bg-[var(--background)] px-6 py-10 transition-shadow duration-[150ms] hover:shadow-[var(--shadow-hover)] md:grid-cols-[216px_1fr] md:items-center md:px-12 lg:grid-cols-[216px_1fr_333px] lg:gap-[115px]">
      <div className="relative h-[216px] w-[216px] justify-self-center">
        <Image
          src={lessonImages[lesson.slug]}
          alt=""
          fill
          sizes="216px"
          className="object-contain"
        />
      </div>
      <div>
        <p className="mai-ui tracking-[1.5px] text-[var(--ink)] max-sm:tracking-[1.2px]">
          {bookingLabel}
        </p>
        <h2 className="mai-h4 mt-[calc(24_*_var(--unit-fx))]">
          {lesson.title}
        </h2>
        <ButtonLink href={`/${locale}/book`} className="mt-[calc(32_*_var(--unit-fx))]">
          {lesson.ctaLabel}
        </ButtonLink>
      </div>
      <p className="mai-body text-[var(--ink)]">
        {lesson.description}
      </p>
    </article>
  );
}
