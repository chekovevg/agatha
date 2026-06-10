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
            className="rounded-lg border-2 border-[var(--line)] bg-white p-6 shadow-[5px_5px_0_var(--line)]"
          >
            <h3 className="text-2xl font-black">{lesson.title}</h3>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {lesson.description}
            </p>
            <a
              href="#booking"
              className="mt-5 inline-block text-sm font-black underline"
            >
              {lesson.ctaLabel}
            </a>
          </article>
        ))}
      </div>
    </Section>
  );
}
