import Image from "next/image";

import type {SiteContent} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function AboutSection({
  content,
}: {
  content: SiteContent["about"];
}) {
  return (
    <Section id="about" tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="overflow-hidden rounded-lg border-2 border-[var(--line)] bg-[var(--paper)] shadow-[6px_6px_0_var(--line)]">
          <Image
            src="/images/about-agathe.svg"
            alt="Agathe teaching with sheet music"
            width={720}
            height={820}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <SectionHeader title={content.heading} />
          <div className="mt-6 space-y-5 text-lg leading-8 text-[var(--muted)]">
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {content.facts.map((fact) => (
              <div key={fact.label} className="border-t-2 border-[var(--line)] pt-4">
                <h3 className="font-black">{fact.label}</h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                  {fact.values.map((value) => (
                    <li key={value}>{value}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
