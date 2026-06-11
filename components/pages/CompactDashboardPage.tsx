import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
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
        <section className="bg-[var(--background)]">
          <div className="mx-auto grid min-h-[calc(100vh-78px)] max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-10">
            <div className="grid gap-6">
              <div>
                <p className="text-sm font-black uppercase text-[var(--leaf)]">
                  {dashboard.eyebrow}
                </p>
                <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[0.95] text-[var(--ink)] sm:text-6xl">
                  {dashboard.heading}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                  {dashboard.subheading}
                </p>
                <p className="mt-4 rounded-md border-2 border-[var(--line)] bg-white px-4 py-3 text-sm font-black shadow-[4px_4px_0_var(--line)]">
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
                <ButtonLink href={`/${locale}/full`} variant="plain">
                  {dashboard.fullProfileCta}
                </ButtonLink>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.practical.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-md border-2 border-[var(--line)] bg-white px-4 py-3"
                  >
                    <p className="text-xs font-black uppercase text-[var(--leaf)]">
                      {item.label}
                    </p>
                    <p className="mt-1 text-sm font-black">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="overflow-hidden rounded-lg border-2 border-[var(--line)] bg-white shadow-[6px_6px_0_var(--line)]">
                <Image
                  src="/images/hero-flute.svg"
                  alt="Agathe teaching flute online"
                  width={720}
                  height={520}
                  priority
                  className="h-full min-h-[280px] w-full object-cover"
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
                  className="rounded-lg border-2 border-[var(--line)] bg-[#edf3df] p-5"
                >
                  <h2 className="text-xl font-black">
                    {dashboard.trialHeading}
                  </h2>
                  <ol className="mt-4 grid gap-3">
                    {dashboard.trialSteps.map((step, index) => (
                      <li key={step} className="flex gap-3 text-sm leading-6">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-[var(--line)] bg-white text-xs font-black">
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

        <section className="border-y-2 border-[var(--line)] bg-white">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-6 sm:px-8 lg:grid-cols-2">
            <section id="reviews" className="rounded-lg bg-[var(--paper)] p-5">
              <h2 className="text-xl font-black">{dashboard.proofHeading}</h2>
              <ul className="mt-4 grid gap-2">
                {dashboard.proofItems.map((item) => (
                  <li key={item} className="text-sm font-bold leading-6">
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-lg bg-[var(--paper)] p-5">
              <h2 className="text-xl font-black">{dashboard.styleHeading}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                {dashboard.styleIntro}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {dashboard.styleTags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border-2 border-[var(--line)] bg-white px-3 py-1 text-xs font-black"
                  >
                    {tag}
                  </span>
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
      className="rounded-lg border-2 border-[var(--line)] bg-white p-5"
    >
      <h2 className="text-xl font-black">{title}</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item} className="text-sm font-bold leading-6">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
