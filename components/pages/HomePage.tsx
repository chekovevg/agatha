import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {HomeValuesSection} from "@/components/sections/HomeValuesSection";
import {SplitLinkButton} from "@/components/ui/SplitLinkButton";
import {WatercolorHeroBackground} from "@/components/ui/WatercolorHeroBackground";
import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";

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
    <div className="editorial-shell min-h-screen">
      <Header content={content} locale={locale} variant="home" />
      <main>
        <section
          className="watercolor-hero relative isolate h-[100svh] overflow-hidden text-center"
          aria-labelledby="home-hero-title"
          data-home-hero="watercolor-intro"
        >
          <div className="home-hero-canvas-stage absolute inset-0">
            <WatercolorHeroBackground />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center px-5 pb-[8svh] pt-[128px] text-[var(--hero-watercolor-ink)] sm:px-8 md:pt-[142px]">
            <div className="grid w-full justify-items-center gap-8 md:gap-9">
              <h1
                id="home-hero-title"
                aria-label={`${home.heroTitle[0]} ${home.heroTitle[1]}`}
                className="font-display max-w-[11ch] text-[58px] leading-[0.92] tracking-[0] sm:text-[110px] lg:text-[150px] xl:text-[166px]"
              >
                <span className="italic">{home.heroTitle[0]}</span>
                <span className="block">{home.heroTitle[1]}</span>
              </h1>
              <p className="mx-auto max-w-[360px] font-display text-[24px] leading-[1.08] tracking-[0] text-[var(--hero-watercolor-muted)] md:max-w-[680px] md:text-[34px]">
                {home.heroSubtitle}
              </p>
            </div>
          </div>
        </section>

        <div className="home-main-stack grid gap-[112px] pb-[120px] pt-[96px] md:gap-[172px] md:pb-[156px] md:pt-[116px]">
          <section className="editorial-container grid justify-items-center gap-[96px] text-center">
            <div className="grid max-w-[750px] gap-[88px] text-[var(--ink)]">
              <h2 className="font-display text-[42px] leading-none tracking-[0] md:text-[62px]">
                {home.manifesto.heading}
              </h2>
              <p className="font-display text-[24px] leading-[1.1] tracking-[0] md:text-[32px]">
                {home.manifesto.body}
              </p>
            </div>
          </section>

          <HomeValuesSection values={home.values} />

          <section
            className="grid justify-items-center gap-14 text-center text-[var(--ink)]"
            aria-labelledby="home-location-title"
          >
            <h2
              id="home-location-title"
              className="font-display px-5 text-[56px] leading-none tracking-[0] sm:text-[92px] lg:text-[134px]"
            >
              {home.location.heading}
            </h2>
            <div className="grid w-full justify-items-center gap-10 px-5">
              <Image
                src="/images/home/from-the-rhine.webp"
                alt="Watercolor view of Cologne Cathedral and the Rhine"
                width={500}
                height={314}
                style={{height: "auto", maxWidth: "500px", width: "100%"}}
              />
              <p className="max-w-[849px] font-display text-[20px] leading-[1.24] tracking-[0] md:text-[23px]">
                {home.location.body}
              </p>
            </div>
            {showActions ? (
              <SplitLinkButton href={`/${locale}/book`}>
                {home.location.cta}
              </SplitLinkButton>
            ) : null}
          </section>

          <section className="editorial-container grid justify-items-center">
            <div className="grid w-full max-w-[866px] gap-10 text-[var(--ink)] md:grid-cols-[179px_1fr] md:gap-[151px]">
              <div className="relative h-[273px] w-[179px] overflow-hidden rounded-[var(--radius-card)] justify-self-center md:justify-self-start">
                <Image
                  src="/images/home/agatha-pic.webp"
                  alt="Agatha playing flute in an ensemble"
                  fill
                  sizes="179px"
                  className="object-cover object-[50%_35%]"
                />
              </div>
              <figure className="grid content-center gap-14">
                <blockquote className="font-display text-[24px] leading-[1.1] tracking-[0] md:text-[32px]">
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
