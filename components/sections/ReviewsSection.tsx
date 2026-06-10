import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function ReviewsSection({
  content,
}: {
  content: SiteContent["reviews"];
}) {
  return (
    <Section id="reviews" tone="white">
      <SectionHeader title={content.heading} intro={content.intro} />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {content.items.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border-2 border-[var(--line)] bg-[var(--paper)] p-5"
          >
            <p className="text-xs font-black uppercase text-[var(--leaf)]">
              {item.sourceLabel}
            </p>
            <h3 className="mt-3 text-xl font-black">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
