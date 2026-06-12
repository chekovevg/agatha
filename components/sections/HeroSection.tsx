import Image from "next/image";

import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import {ButtonLink} from "@/components/ui/Button";

export function HeroSection({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  return (
    <section className="theme-hero">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
        <div>
          <p className="font-ui text-xs font-medium tracking-[0.06em] text-[var(--hero-muted)]">
            {content.hero.eyebrow}
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-5xl font-normal leading-[1.03] text-[var(--hero-ink)] sm:text-6xl lg:text-7xl">
            {content.hero.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--hero-muted)]">
            {content.hero.subheading}
          </p>
          <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-[var(--hero-ink)]">
            {content.hero.support}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={`/${locale}/book`}>
              {content.cta.primary}
            </ButtonLink>
            <ButtonLink href="#open-lesson" variant="secondary">
              {content.cta.secondary}
            </ButtonLink>
          </div>
          <p className="mt-8 max-w-xl rounded-[var(--radius-card)] bg-[var(--paper)] px-5 py-4 text-sm font-medium leading-6 text-[var(--ink)] shadow-[var(--shadow-inset)]">
            {content.hero.trust}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["/images/hero-flute.svg", "Flutist teaching online"],
            ["/images/hero-notes.svg", "Sheet music and notes"],
            ["/images/hero-botanical.svg", "Botanical music detail"],
          ].map(([src, alt], index) => (
            <div
              key={src}
              className={`overflow-hidden rounded-[var(--radius-media)] bg-[var(--card)] shadow-[var(--shadow-elevated)] ${
                index === 0 ? "sm:col-span-2" : ""
              }`}
            >
              <Image
                src={src}
                alt={alt}
                width={720}
                height={index === 0 ? 380 : 300}
                priority={index === 0}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
