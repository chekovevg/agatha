import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import type {Lesson, SiteContent} from "@/content/types";

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
}: {
  content: SiteContent;
}) {
  return (
    <div className="classes-page-shell editorial-shell min-h-screen">
      <div aria-hidden="true" className="classes-page-backdrop" data-testid="classes-backdrop" />
      <Header content={content} variant="classes" />
      <main className="classes-page editorial-container py-[calc(144_*_var(--unit-fx))]">
        <section className="classes-page-intro" data-testid="classes-intro">
          <h1 className="classes-page-heading mai-h4 mx-auto text-center" data-testid="classes-heading">
            {content.pages.classes.heading}
          </h1>
          <p className="classes-page-subtitle mx-auto text-center" data-testid="classes-subtitle">
            {content.pages.classes.intro}
          </p>
        </section>
        <div className="classes-page-lessons mx-auto mt-[calc(144_*_var(--unit-fx))] grid max-w-[1150px] gap-[calc(24_*_var(--unit-fx))]">
          {lessonOrder
            .map((slug) => content.lessons.find((lesson) => lesson.slug === slug))
            .filter((lesson): lesson is Lesson => Boolean(lesson))
            .map((lesson) => (
              <LessonRow
                key={lesson.slug}
                lesson={lesson}
                bookingLabel={content.cta.primary}
                audienceLessons={
                  lesson.slug === "flute" ? content.audienceLessons : undefined
                }
              />
            ))}
        </div>
      </main>
      <Footer content={content} />
    </div>
  );
}

function LessonRow({
  lesson,
  bookingLabel,
  audienceLessons,
}: {
  lesson: Lesson;
  bookingLabel: string;
  audienceLessons?: SiteContent["audienceLessons"];
}) {
  return (
    <article className="classes-lesson-card grid min-h-[328px] gap-8 rounded-[var(--radius-card)] bg-[var(--background)] px-6 py-10 transition-shadow duration-[150ms] hover:shadow-[var(--shadow-hover)] md:grid-cols-[216px_1fr] md:items-center md:px-12 lg:grid-cols-[216px_1fr_333px] lg:gap-[115px]">
      <div className="relative h-[216px] w-[216px] justify-self-center">
        <Image
          src={lesson.image}
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
        <ButtonLink href="/book" className="classes-lesson-cta mt-[calc(32_*_var(--unit-fx))]" data-analytics-booking-cta="classes">
          {lesson.ctaLabel}
        </ButtonLink>
        {audienceLessons ? (
          <div className="mai-ui mt-6 grid gap-2">
            <a className="underline" href={audienceLessons.adults.path}>
              {audienceLessons.adults.navLabel}
            </a>
            <a className="underline" href={audienceLessons.children.path}>
              {audienceLessons.children.navLabel}
            </a>
          </div>
        ) : null}
      </div>
      <p className="mai-body text-[var(--ink)]">
        {lesson.description}
      </p>
    </article>
  );
}
