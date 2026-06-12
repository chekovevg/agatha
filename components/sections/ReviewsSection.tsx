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
            className="rounded-[var(--radius-card)] bg-[var(--paper)] p-5 shadow-[var(--shadow-inset)]"
          >
            <p className="font-ui text-xs font-medium uppercase text-[var(--muted)]">
              {item.sourceLabel}
            </p>
            <h3 className="font-display mt-3 text-xl font-normal leading-7">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {item.text}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
