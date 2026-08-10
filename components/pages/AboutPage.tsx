import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import {ContactForm} from "@/components/ui/ContactForm";
import type {SiteContent} from "@/content/types";
import {introBookingHref} from "@/lib/booking";

export function AboutPage({
  content,
}: {
  content: SiteContent;
}) {
  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} />
      <main className="mx-auto grid w-full max-w-[calc(1660*var(--unit-fx))] gap-[var(--space-120)] px-[var(--space-24)] pb-[var(--space-120)] pt-[var(--space-32)] min-[601px]:px-[var(--space-24)] min-[861px]:gap-[var(--space-160)] min-[861px]:pb-[var(--space-160)] min-[861px]:pt-[var(--space-160)]">
        <section
          aria-labelledby="about-title"
          className="grid gap-[var(--space-40)] min-[861px]:grid-cols-[repeat(24,minmax(0,1fr))] min-[861px]:gap-x-[var(--space-20)] min-[861px]:gap-y-0"
        >
          <div className="grid w-full content-start gap-[var(--space-16)] justify-self-center min-[861px]:col-span-5 min-[861px]:w-[245px] min-[861px]:justify-self-start">
            <div className="relative aspect-[1086/1448] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--paper)] min-[861px]:h-[328px] min-[861px]:aspect-auto">
              <Image
                src="/images/about/agatha-portrait.png"
                alt="Agatha Gurko portrait"
                fill
                preload
                quality={95}
                sizes="(max-width: 860px) calc(100vw - 44px), 245px"
                className="object-cover object-center"
              />
            </div>
            <ButtonLink
              href={introBookingHref}
              className="h-[48px] w-full px-0 py-0"
            >
              {content.cta.contact}
            </ButtonLink>
          </div>

          <div className="grid max-w-[643px] gap-[var(--space-56)] text-[var(--ink)] min-[861px]:col-start-8 min-[861px]:col-span-11">
            <h1
              id="about-title"
              className="font-display-regular text-[48px] leading-none tracking-[-1.2px] md:text-[62px] md:tracking-[-1.44px]"
            >
              {content.about.heading}
            </h1>

            <div className="font-copy grid gap-[var(--space-32)] text-[18px] leading-[1.33] tracking-[-0.36px] md:text-[23px] md:leading-[1.24] md:tracking-[-0.21px]">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="grid gap-[var(--space-40)]">
              {content.about.facts.map((fact) => (
                <div key={fact.label} className="grid gap-[var(--space-20)]">
                  <dt className="mai-ui text-[var(--ink)]">
                    {fact.label}
                  </dt>
                  <dd>
                    <ul className="font-copy grid gap-0 text-[18px] leading-[1.33] tracking-[-0.36px] md:text-[23px] md:leading-[1.24] md:tracking-[-0.21px]">
                      {fact.values.map((value) => (
                        <li key={value}>{value}</li>
                      ))}
                    </ul>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="about-faq-title"
          className="grid min-[861px]:grid-cols-[repeat(24,minmax(0,1fr))] min-[861px]:gap-x-[var(--space-20)]"
        >
          <div className="grid max-w-[643px] gap-[var(--space-32)] min-[861px]:col-start-8 min-[861px]:col-span-11">
            <h2 id="about-faq-title" className="mai-h4">
              {content.pages.about.faqHeading}
            </h2>
            <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {[...content.faq]
                .sort((a, b) => a.order - b.order)
                .map((item) => (
                  <details key={item.question} className="group py-[var(--space-20)]">
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

        <section
          id="contact"
          aria-labelledby="about-contact-title"
          className="grid min-[861px]:grid-cols-[repeat(24,minmax(0,1fr))] min-[861px]:gap-x-[var(--space-20)]"
        >
          <div className="grid max-w-[643px] gap-[var(--space-40)] min-[861px]:col-start-8 min-[861px]:col-span-11">
            <div>
              <h2 id="about-contact-title" className="mai-h4">
                {content.contact.heading}
              </h2>
              <p className="mai-body mt-[var(--space-24)] text-[var(--muted)]">
                {content.contact.copy}
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </div>
  );
}
