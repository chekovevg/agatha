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
    <section className="bg-[var(--background)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:py-24">
        <div>
          <p className="font-black uppercase text-[var(--leaf)]">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-none text-[var(--ink)] sm:text-7xl lg:text-8xl">
            {content.hero.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-[var(--muted)]">
            {content.hero.subheading}
          </p>
          <p className="mt-3 max-w-2xl text-base font-semibold text-[var(--ink)]">
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
          <p className="mt-8 rounded-md border-2 border-[var(--line)] bg-white px-4 py-3 text-sm font-black shadow-[4px_4px_0_var(--line)]">
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
              className={`overflow-hidden rounded-lg border-2 border-[var(--line)] bg-white shadow-[6px_6px_0_var(--line)] ${
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
