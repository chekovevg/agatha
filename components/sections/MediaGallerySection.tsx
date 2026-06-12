import Image from "next/image";

import type {MediaItem} from "@/content/types";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";

export function MediaGallerySection({items}: {items: MediaItem[]}) {
  return (
    <Section id="media">
      <SectionHeader
        title="Music in progress"
        intro="A glimpse into lessons, practice materials and the small details that make music learning feel alive."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="overflow-hidden rounded-[var(--radius-card)] bg-[var(--card)] shadow-[var(--shadow-elevated)]"
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={520}
              height={360}
              className="h-56 w-full object-cover"
            />
            <div className="border-t border-[var(--line)] p-5">
              <h3 className="font-display font-normal">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {item.caption}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
