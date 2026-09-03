import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import type {AudienceLessonContent, SiteContent} from "@/content/types";
import {serializeJsonLd, serviceStructuredData} from "@/lib/seo";

export function AudienceLessonPage({
  content,
  site,
}: {
  content: AudienceLessonContent;
  site: SiteContent;
}) {
  return (
    <div className="editorial-shell min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(serviceStructuredData(content)),
        }}
      />
      <Header content={site} />
      <main className="text-[var(--ink)]">
        <section className="editorial-container grid justify-items-center gap-8 py-20 text-center min-[861px]:py-[calc(160*var(--unit-fx))]">
          <p className="mai-ui">{content.eyebrow}</p>
          <h1 className="mai-h3 max-w-[980px]">{content.title}</h1>
          <p className="mai-text-large-alt max-w-[780px]">{content.intro}</p>
          <p className="mai-ui">{content.trustLine}</p>
          <ButtonLink href="/book">{site.cta.primary}</ButtonLink>
        </section>

        <section className="editorial-container grid gap-10 py-20 min-[861px]:grid-cols-2 min-[861px]:py-[calc(120*var(--unit-fx))]">
          <div className="grid content-start gap-6">
            <h2 className="mai-h4">{content.audienceHeading}</h2>
            <p className="mai-body">{content.audienceCopy}</p>
          </div>
          <ul className="grid gap-4">
            {content.audiencePoints.map((point) => (
              <li
                key={point}
                className="mai-body rounded-[var(--radius-card)] bg-[var(--background)] p-6"
              >
                {point}
              </li>
            ))}
          </ul>
        </section>

        <section className="editorial-container grid gap-10 py-20">
          <div className="grid max-w-[760px] gap-5">
            <h2 className="mai-h4">{content.lessonsHeading}</h2>
            <p className="mai-body">{content.lessonsCopy}</p>
          </div>
          <div className="grid gap-6 min-[700px]:grid-cols-2">
            {content.lessonFocus.map((focus) => (
              <article
                key={focus.title}
                className="grid gap-4 rounded-[var(--radius-card)] bg-[var(--background)] p-8"
              >
                <h3 className="mai-h5">{focus.title}</h3>
                <p className="mai-body">{focus.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="editorial-container grid gap-6 py-20">
          <h2 className="mai-h4">{content.whyHeading}</h2>
          {content.whyParagraphs.map((paragraph) => (
            <p key={paragraph} className="mai-text-large-alt max-w-[860px]">
              {paragraph}
            </p>
          ))}
        </section>

        <section className="editorial-container grid gap-8 py-20">
          <h2 className="mai-h4">Frequently asked questions</h2>
          <div className="grid gap-4">
            {content.faq.map((item) => (
              <details
                key={item.question}
                className="rounded-[var(--radius-card)] bg-[var(--background)] p-6"
              >
                <summary className="mai-h5 cursor-pointer">
                  {item.question}
                </summary>
                <p className="mai-body mt-4 max-w-[760px]">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="editorial-container grid justify-items-center gap-6 py-24 text-center">
          <h2 className="mai-h4">{content.ctaHeading}</h2>
          <p className="mai-body max-w-[680px]">{content.ctaCopy}</p>
          <ButtonLink href="/book">{site.cta.primary}</ButtonLink>
        </section>
      </main>
      <Footer content={site} />
    </div>
  );
}
