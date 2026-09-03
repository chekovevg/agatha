import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {HomeBackgroundFade} from "@/components/sections/HomeBackgroundFade";
import {HomeAudienceTabs} from "@/components/sections/HomeAudienceTabs";
import type {SiteContent} from "@/content/types";

export function HomePage({content}: {content: SiteContent}) {
  const home = content.home;

  return (
    <div
      className="home-page-shell editorial-shell min-h-screen"
      data-home-background-fade
      data-testid="home-background-fade"
    >
      <HomeBackgroundFade />
      <Header content={content} variant="home" />
      <main>
        <section
          className="plain-home-hero"
          aria-labelledby="home-hero-title"
          data-bg-fade="#f4e8c8"
          data-color-fade="#5D524B"
          data-home-hero="plain"
        >
          <div className="plain-home-hero-copy">
            <h1 id="home-hero-title" className="plain-home-title">
              {home.heroTitle}
            </h1>
            <HomeAudienceTabs tabs={home.audienceTabs} />
          </div>
        </section>

        <div className="home-main-stack">
          <section
            className="home-location-section"
            aria-labelledby="home-location-title"
          >
            <h2
              id="home-location-title"
              className="home-section-heading"
              data-home-location-heading
            >
              {home.location.heading}
            </h2>
            <div className="home-location-copy-stack">
              <Image
                src="/images/home/from-the-rhine.webp"
                alt="Watercolor view of Cologne Cathedral and the Rhine"
                width={1501}
                height={944}
                className="home-location-image"
              />
              <p className="home-section-copy" data-home-location-copy>
                {home.location.body}
              </p>
            </div>
          </section>

          <section
            data-home-faq="true"
            aria-labelledby="home-faq-title"
            className="mt-[var(--space-190)] w-full px-[var(--space-20)] text-[var(--ink)] max-[600px]:mt-[var(--space-100)]"
          >
            <div className="mx-auto grid w-full max-w-[643px] gap-[var(--space-32)]">
              <h2 id="home-faq-title" className="home-section-heading text-center">
                {content.pages.about.faqHeading}
              </h2>
              <div className="divide-y divide-[var(--line)] border-y border-[var(--line)] text-left">
                {[...content.faq]
                  .sort((a, b) => a.order - b.order)
                  .map((item) => (
                    <details
                      key={item.question}
                      className="group py-[var(--space-20)]"
                    >
                      <summary className="mai-body flex cursor-pointer list-none items-center justify-between gap-[var(--space-24)] text-[var(--ink)]">
                        <span>{item.question}</span>
                        <span aria-hidden="true" className="mai-ui">
                          +
                        </span>
                      </summary>
                      <p className="mai-body mt-[var(--space-16)] max-w-[780px] text-[var(--muted)]">
                        {item.answer}
                      </p>
                    </details>
                  ))}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer content={content} />
    </div>
  );
}
