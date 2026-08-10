import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {HomeAudienceTabs} from "@/components/sections/HomeAudienceTabs";
import type {SiteContent} from "@/content/types";

export function HomePage({content}: {content: SiteContent}) {
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
                className="home-location-image"
              />
              <p className="home-section-copy" data-home-location-copy>
                {home.location.body}
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer content={content} />
    </div>
  );
}
