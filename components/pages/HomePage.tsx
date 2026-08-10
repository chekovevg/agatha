import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {HomeAudienceTabs} from "@/components/sections/HomeAudienceTabs";
import {ButtonLink} from "@/components/ui/Button";
import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

export function HomePage({
  content,
  showActions = true,
}: {
  content: SiteContent;
  showActions?: boolean;
}) {
  const home = content.home;

  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} variant="home" />
      <main>
        <section
          className="plain-home-hero"
          aria-labelledby="home-hero-title"
          data-home-hero="plain"
        >
          <div className="plain-home-hero-copy">
            <h1 id="home-hero-title" className="plain-home-title">
              {home.heroTitle}
            </h1>
            <p className="plain-home-subtitle">{home.heroSubtitle}</p>
            {showActions ? (
              <ButtonLink
                href={introBookingHref}
                variant="accent"
                className="plain-home-cta"
                data-analytics-booking-cta="home-hero"
              >
                {home.location.cta}
              </ButtonLink>
            ) : null}
          </div>
        </section>

        <div className="home-main-stack">
          <HomeAudienceTabs tabs={home.audienceTabs} />

          <section
            className="home-location-section"
            aria-labelledby="home-location-title"
          >
            <h2
              id="home-location-title"
              className="home-location-heading"
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
                style={{height: "auto", maxWidth: "500px", width: "100%"}}
              />
              <p className="home-section-copy" data-home-location-copy>
                {home.location.body}
              </p>
            </div>
            {showActions ? (
              <ButtonLink
                href={introBookingHref}
                variant="split"
                className="home-location-action"
                data-analytics-booking-cta="home"
              >
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
