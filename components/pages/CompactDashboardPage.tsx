import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {Badge} from "@/components/ui/badge";
import {ButtonLink} from "@/components/ui/Button";
import {Separator} from "@/components/ui/separator";
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

export function CompactDashboardPage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const dashboard = content.dashboard;

  return (
    <>
      <Header content={content} locale={locale} variant="compact" />
      <main>
        <section className="theme-hero">
          <div className="mx-auto grid min-h-[calc(100vh-65px)] max-w-[1200px] gap-10 px-5 py-8 sm:px-8 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:py-12">
            <div className="grid gap-7">
              <div>
                <p className="font-ui text-xs font-medium tracking-[0.06em] text-[var(--hero-muted)]">
                  {dashboard.eyebrow}
                </p>
                <h1 className="font-display mt-4 max-w-3xl text-4xl font-normal leading-[1.06] text-[var(--hero-ink)] sm:text-5xl lg:text-6xl">
                  {dashboard.heading}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--hero-muted)] sm:text-lg sm:leading-8">
                  {dashboard.subheading}
                </p>
                <p className="mt-5 max-w-xl rounded-[var(--radius-card)] bg-[var(--paper)] px-5 py-4 text-sm font-medium leading-6 text-[var(--ink)] shadow-[var(--shadow-inset)]">
                  {dashboard.trustLine}
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <ButtonLink href={`/${locale}/book`}>
                  {content.cta.primary}
                </ButtonLink>
                <ButtonLink href={`/${locale}/full#contact`} variant="secondary">
                  {content.cta.contact}
                </ButtonLink>
                <ButtonLink
                  href={`/${locale}/full`}
                  variant="plain"
                  className="text-[var(--hero-ink)]"
                  style={{color: "var(--hero-ink)"}}
                >
                  {dashboard.fullProfileCta}
                </ButtonLink>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.practical.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[var(--radius-card)] bg-[var(--paper)] px-5 py-4 text-[var(--ink)] shadow-[var(--shadow-inset)]"
                  >
                    <p className="font-ui text-[10px] font-medium uppercase leading-4 tracking-[0.06em] text-[var(--muted)]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-medium leading-5">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="overflow-hidden rounded-[var(--radius-media)] bg-[var(--card)] shadow-[var(--shadow-elevated)]">
                <Image
                  src="/images/hero-flute.svg"
                  alt="Agathe teaching flute online"
                  width={720}
                  height={520}
                  priority
                  className="h-full min-h-[240px] w-full object-cover sm:min-h-[320px] lg:min-h-[520px]"
                />
              </div>

              <div className="grid gap-4">
                <DashboardBlock
                  id="lessons"
                  title={dashboard.fitHeading}
                  items={dashboard.fitItems}
                />
                <section
                  id="trial"
                  className="rounded-[var(--radius-card)] bg-[var(--paper)] p-5 text-[var(--ink)] shadow-[var(--shadow-inset)]"
                >
                  <h2 className="text-xl font-medium leading-7">
                    {dashboard.trialHeading}
                  </h2>
                  <ol className="mt-4 grid gap-3">
                    {dashboard.trialSteps.map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-3 text-sm leading-6 text-[var(--muted)]"
                      >
                        <span className="font-ui flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--card)] text-xs font-medium text-[var(--ink)]">
                          {index + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--line)] bg-white">
          <div className="mx-auto grid max-w-[1200px] gap-4 px-5 py-8 sm:px-8 lg:grid-cols-2">
            <section id="reviews" className="rounded-[var(--radius-card)] bg-[var(--paper)] p-6">
              <h2 className="text-xl font-medium leading-7">
                {dashboard.proofHeading}
              </h2>
              <Separator className="my-4 bg-[var(--line)]/20" />
              <ul className="mt-4 grid gap-2">
                {dashboard.proofItems.map((item) => (
                  <li
                    key={item}
                    className="text-sm font-normal leading-6 text-[var(--muted)]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[var(--radius-card)] bg-[var(--paper)] p-6">
              <h2 className="text-xl font-medium leading-7">
                {dashboard.styleHeading}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {dashboard.styleIntro}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.styleTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="font-ui h-auto rounded-full border border-[var(--line)] bg-[var(--card)] px-3 py-1 text-xs font-medium text-[var(--ink)]"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={`/${locale}/book`}>
                  {content.cta.primary}
                </ButtonLink>
                <ButtonLink href={`/${locale}/full#contact`} variant="secondary">
                  {content.cta.contact}
                </ButtonLink>
              </div>
            </section>
          </div>
        </section>
      </main>
      <Footer content={content} locale={locale} />
    </>
  );
}

function DashboardBlock({
  id,
  title,
  items,
}: {
  id: string;
  title: string;
  items: string[];
}) {
  return (
    <section
      id={id}
      className="rounded-[var(--radius-card)] bg-[var(--card)] p-5 text-[var(--ink)] shadow-[var(--shadow-elevated)]"
    >
      <h2 className="text-xl font-medium leading-7">{title}</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm font-normal leading-6 text-[var(--muted)]">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
