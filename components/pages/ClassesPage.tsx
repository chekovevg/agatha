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
    <div className="editorial-shell min-h-screen">
      <Header content={content} />
      <main className="editorial-container py-[calc(144_*_var(--unit-fx))]">
        <h1 className="mai-h4 mx-auto max-w-[613px] text-center">
          {content.pages.classes.heading}
        </h1>
        <div className="mx-auto mt-[calc(144_*_var(--unit-fx))] grid max-w-[1150px] gap-[calc(24_*_var(--unit-fx))]">
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
    <article className="grid min-h-[328px] gap-8 rounded-[var(--radius-card)] bg-[var(--background)] px-6 py-10 transition-shadow duration-[150ms] hover:shadow-[var(--shadow-hover)] md:grid-cols-[216px_1fr] md:items-center md:px-12 lg:grid-cols-[216px_1fr_333px] lg:gap-[115px]">
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
          Music lesson
        </p>
        <h2 className="mai-h4 mt-[calc(24_*_var(--unit-fx))]">
          {lesson.title}
        </h2>
        <ButtonLink
          href={lessonBookingHref(lesson.title)}
          className="mt-[calc(32_*_var(--unit-fx))]"
          data-analytics-booking-cta="classes"
        >
          Book a lesson
        </ButtonLink>
      </div>
      <p className="mai-body text-[var(--ink)]">
        {lesson.description}
      </p>
    </article>
  );
}
