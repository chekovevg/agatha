import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function MethodSection({
  content,
}: {
  content: SiteContent["method"];
}) {
  return (
    <Section id="method" tone="green">
      <SectionHeader title={content.heading} intro={content.intro} />
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {content.principles.map((principle) => (
          <article
            key={principle.title}
            className="rounded-lg border-2 border-[var(--line)] bg-white p-5"
          >
            <h3 className="text-xl font-black">{principle.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {principle.text}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
