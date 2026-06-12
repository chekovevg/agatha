import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function LessonsSection({content}: {content: SiteContent}) {
  return (
    <Section id="lessons">
      <SectionHeader
        title="Lessons that meet you where you are"
        intro="Whether you are taking your first steps, returning to music after a break, preparing for exams or learning theory from scratch, lessons are adapted to your level, pace and musical goals."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {content.lessons.map((lesson) => (
          <article
            key={lesson.slug}
            className="rounded-[var(--radius-card)] bg-[var(--card)] p-6 shadow-[var(--shadow-elevated)]"
          >
            <h3 className="font-display text-2xl font-normal leading-8">{lesson.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {lesson.description}
            </p>
            <a
              href="#booking"
              className="font-ui mt-5 inline-block rounded-full text-xs font-medium underline underline-offset-4"
            >
              {lesson.ctaLabel}
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}
