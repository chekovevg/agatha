import Image, {getImageProps} from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {HomeValuesSection} from "@/components/sections/HomeValuesSection";
import {ButtonLink} from "@/components/ui/Button";
import {HomeHeroBackground} from "@/components/ui/HomeHeroBackground";
import {HomeScrollBackground} from "@/components/ui/HomeScrollBackground";
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

function AgathaQuoteImage() {
  const common = {
    alt: "Agatha playing flute in an ensemble",
    sizes: "(max-width: 767px) calc(100vw - 40px), 179px",
  };
  const {
    props: {srcSet: desktop},
  } = getImageProps({
    ...common,
    height: 1088,
    src: "/images/home/agatha-pic.webp",
    width: 716,
  });
  const {
    props: {srcSet: mobile, ...rest},
  } = getImageProps({
    ...common,
    height: 1508,
    src: "/images/home/agatha-pic-mobile.webp",
    width: 1404,
  });

  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile} />
      <source media="(min-width: 768px)" srcSet={desktop} />
      <img
        {...rest}
        alt={common.alt}
        className="h-full w-full object-cover md:object-[50%_35%]"
      />
    </picture>
  );
}

export function HomePage({
  content,
  locale,
  showActions = true,
}: {
  content: SiteContent;
  locale: Locale;
  showActions?: boolean;
}) {
  const home = content.home;

  return (
    <div className="editorial-shell home-reference-shell min-h-screen">
      <HomeScrollBackground />
      <Header content={content} locale={locale} variant="home" />
      <main>
        <section
          className="watercolor-hero relative isolate h-[100svh] overflow-hidden text-center"
          aria-labelledby="home-hero-title"
          data-home-hero="watercolor-intro"
          data-reference-section="hero"
        >
          <div className="home-hero-canvas-stage absolute inset-0">
            <HomeHeroBackground />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center px-5 pb-[8svh] pt-[128px] text-[var(--hero-watercolor-ink)] sm:px-8 md:pt-[8svh]">
            <div className="home-hero-copy grid w-full justify-items-center gap-8 md:gap-9">
              <h1
                id="home-hero-title"
                aria-label={`${home.heroTitle[0]} ${home.heroTitle[1]}`}
                className="mai-h1 home-hero-title"
              >
                <span className="home-hero-title-line home-hero-title-line-primary">
                  {home.heroTitle[0]}
                </span>
                <span className="home-hero-title-line home-hero-title-line-secondary">
                  {home.heroTitle[1]}
                </span>
              </h1>
              <p className="mai-text-large home-hero-subtitle mx-auto text-[var(--hero-watercolor-muted)]">
                {home.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <div
          className="home-main-stack grid pb-[120px] pt-[96px] min-[861px]:pb-[calc(156*var(--unit-fx))] min-[861px]:pt-[calc(116*var(--unit-fx))]"
          data-reference-background="cream-stack"
        >
          <section
            className="editorial-container grid justify-items-center gap-[96px] text-center min-[861px]:min-h-[calc(100svh+calc(142*var(--unit-fx)))] min-[861px]:content-start min-[861px]:pt-[calc(320*var(--unit-fx))]"
            data-reference-section="manifesto"
            data-scroll-bg="#fef9ed"
          >
            <div className="grid max-w-[750px] gap-[29px] text-[var(--ink)] min-[861px]:gap-[88px]">
              <h2 className="mai-h3">
                {home.manifesto.heading}
              </h2>
              <p className="mai-text-large-alt">
                {home.manifesto.body}
              </p>
            </div>
          </section>

          <HomeValuesSection values={home.values} />

          <section
            className="mt-[112px] grid justify-items-center gap-14 pt-[136px] text-center text-[var(--ink)] min-[861px]:mt-[calc(172*var(--unit-fx))] min-[861px]:pt-[calc(440*var(--unit-fx))]"
            aria-labelledby="home-location-title"
            data-reference-section="single-location"
            data-scroll-bg="#fef9ed"
            data-scroll-bg-mode="center-pulse"
            data-scroll-bg-peak="#fbf9ee"
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
              <ButtonLink href={`/${locale}/book`} variant="split">
                {home.location.cta}
              </ButtonLink>
            ) : null}
          </section>

          <section
            className="editorial-container mt-[128px] grid justify-items-center min-[861px]:mt-[calc(320*var(--unit-fx))]"
            data-reference-section="quote"
            data-scroll-bg="#fef9ed"
          >
            <div className="grid w-full max-w-[866px] gap-10 text-[var(--ink)] min-[861px]:grid-cols-[179px_1fr] min-[861px]:gap-[151px]">
              <div className="relative aspect-[1404/1508] w-full max-w-[360px] overflow-hidden rounded-[var(--radius-card)] justify-self-center min-[861px]:aspect-auto min-[861px]:h-[273px] min-[861px]:w-[179px] min-[861px]:max-w-none min-[861px]:justify-self-start">
                <AgathaQuoteImage />
              </div>
              <figure className="grid content-center gap-14">
                <blockquote className="mai-h7">
                  {home.quote.body}
                </blockquote>
                <figcaption className="mai-ui">{home.quote.signature}</figcaption>
              </figure>
            </div>
          </section>
        </div>
      </main>
      <Footer content={content} locale={locale} />
    </div>
  );
}
