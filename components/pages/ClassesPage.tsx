import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import type {Lesson, SiteContent} from "@/content/types";
import {lessonBookingHref} from "@/lib/booking";

export function ClassesPage({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <div className="classes-page-shell editorial-shell min-h-screen">
      <div aria-hidden="true" className="classes-page-backdrop" />
      <Header content={content} variant="classes" />
      <main className="classes-page editorial-container py-[var(--space-144)]">
        <section className="classes-page-intro" data-testid="classes-intro">
          <h1
            className="classes-page-heading mai-h4 mx-auto max-w-[613px] text-center"
            data-testid="classes-heading"
          >
            {content.pages.classes.heading}
          </h1>
          <p
            className="classes-page-subtitle mai-body mx-auto text-center"
            data-testid="classes-subtitle"
          >
            {content.pages.classes.intro}
          </p>
        </section>
        <div className="classes-page-lessons mx-auto mt-[var(--space-144)] grid max-w-[1150px] gap-[var(--space-24)]">
          {content.lessons.map((lesson) => (
            <LessonRow key={lesson.slug} lesson={lesson} />
          ))}
        </div>
      </main>
      <Footer content={content} />
    </div>
  );
}

function LessonRow({
  lesson,
}: {
  lesson: Lesson;
}) {
  return (
    <article className="classes-lesson-card grid min-h-[328px] gap-[var(--space-32)] rounded-[var(--radius-card)] bg-[var(--background)] px-[var(--space-24)] py-[var(--space-40)] transition-shadow duration-[150ms] hover:shadow-[var(--shadow-hover)] md:grid-cols-[216px_1fr] md:items-center md:px-[var(--space-48)] lg:grid-cols-[216px_1fr_333px] lg:gap-[var(--space-120)]">
      <div className="classes-lesson-media relative h-[216px] w-[216px] justify-self-center">
        <Image
          src={lesson.image}
          alt=""
          fill
          sizes="(max-width: 640px) calc(100vw - 30px), 216px"
          className="object-contain"
        />
      </div>
      <div className="classes-lesson-details">
        <p className="classes-lesson-eyebrow mai-eyebrow text-[var(--ink)]">
          Music lesson
        </p>
        <h2 className="classes-lesson-title mai-h4 mt-[var(--space-24)]">
          {lesson.title}
        </h2>
      </div>
      <p className="classes-lesson-description mai-body text-[var(--ink)]">
        {lesson.description}
      </p>
      <ButtonLink
        href={lessonBookingHref(lesson.title)}
        className="classes-lesson-cta mt-[var(--space-32)] md:col-start-2"
        data-analytics-booking-cta="classes"
      >
        Book a Lesson
      </ButtonLink>
    </article>
  );
}
