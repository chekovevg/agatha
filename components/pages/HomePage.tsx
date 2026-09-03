import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import {MusicalScoreHero} from "@/components/ui/MusicalScoreHero";
import type {SiteContent} from "@/content/types";

export function HomePage({
  content,
  showActions = true,
}: {
  content: SiteContent;
  showActions?: boolean;
}) {
  const home = content.home;

  return (
    <div className="editorial-shell home-reference-shell min-h-screen">
      <Header content={content} variant="home" />
      <main>
        <section
          className="musical-home-hero"
          aria-labelledby="home-hero-title"
          data-home-hero="musical-score"
          data-reference-section="hero"
        >
          <div className="musical-home-hero-copy">
            <h1
              id="home-hero-title"
              aria-label={`${home.heroTitle} ${home.heroSubtitle}`}
              className="mai-h1 musical-home-title"
            >
              <span className="musical-home-title-primary">
                {home.heroTitle}
              </span>
              {" "}
              <span className="musical-home-title-secondary">
                {home.heroSubtitle}
              </span>
            </h1>
            {showActions ? (
              <ButtonLink href="/book" data-analytics-booking-cta="home">{home.location.cta}</ButtonLink>
            ) : null}
          </div>
          <MusicalScoreHero />
        </section>

        <div
          className="home-main-stack grid pb-[120px] pt-[128px] min-[861px]:pb-[calc(156*var(--unit-fx))] min-[861px]:pt-[calc(180*var(--unit-fx))]"
          data-reference-background="cream-stack"
        >
          <section
            className="editorial-container grid justify-items-center pb-[180px] text-center min-[861px]:pb-[calc(270*var(--unit-fx))]"
            data-reference-section="manifesto"
          >
            <div className="grid max-w-[750px] justify-items-center gap-[29px] text-[var(--ink)] min-[861px]:gap-[42px]">
              <h2 className="mai-h3">
                {home.manifesto.heading}
              </h2>
              <p className="mai-text-large-alt">
                {home.manifesto.body}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                {Object.values(content.audienceLessons).map((lesson) => (
                  <ButtonLink key={lesson.path} href={lesson.path}>
                    {lesson.navLabel}
                  </ButtonLink>
                ))}
              </div>
            </div>
          </section>

          <section
            className="grid justify-items-center gap-14 text-center text-[var(--ink)]"
            aria-labelledby="home-location-title"
            data-reference-section="single-location"
          >
            <h2
              id="home-location-title"
              className="mai-h1 px-5"
            >
              {home.location.heading}
            </h2>
            <div className="grid w-full justify-items-center gap-10 px-5">
              <Image
                src="/images/home/from-the-rhine.webp"
                alt="Watercolor view of Cologne Cathedral and the Rhine"
                width={1501}
                height={944}
                style={{height: "auto", maxWidth: "500px", width: "100%"}}
              />
              <p className="mai-text-regular max-w-[849px]">
                {home.location.body}
              </p>
            </div>
            {showActions ? (
              <ButtonLink href="/book" variant="split" data-analytics-booking-cta="home">
                {home.location.cta}
              </ButtonLink>
            ) : null}
          </section>
        </div>
      </main>
      <Footer content={content} />
    </div>
  );
}
