import Image from "next/image";

import {Footer} from "@/components/layout/Footer";
import {Header} from "@/components/layout/Header";
import {ButtonLink} from "@/components/ui/Button";
import {ContactForm} from "@/components/ui/ContactForm";
import type {SiteContent} from "@/content/types";
import {env} from "@/lib/env";
import type {Locale} from "@/lib/routing";

export function AboutPage({
  content,
  locale,
}: {
  content: SiteContent;
  locale: Locale;
}) {
  const contactHref =
    content.social.email != null
      ? `mailto:${content.social.email}`
      : env.NEXT_PUBLIC_WHATSAPP_URL ?? `/${locale}/book`;
  const isExternalContact = contactHref.startsWith("http");

  return (
    <div className="editorial-shell min-h-screen">
      <Header content={content} locale={locale} />
      <main className="mx-auto grid w-full max-w-[1376px] gap-28 px-5 pb-28 pt-24 sm:px-8 lg:gap-[150px] lg:pb-[150px] lg:pt-[160px] xl:px-0">
        <section
          aria-labelledby="about-title"
          className="grid gap-14 lg:grid-cols-[179px_minmax(0,643px)] lg:gap-[clamp(96px,14.3vw,206px)] lg:px-[22px]"
        >
          <div className="grid w-[179px] max-w-full content-start gap-4 justify-self-center lg:justify-self-start">
            <div className="relative h-[273px] w-full overflow-hidden rounded-[var(--radius-card)] bg-[var(--paper)]">
              <Image
                src="/images/home/agatha-pic.webp"
                alt="Agatha Gurko playing flute in an ensemble"
                fill
                priority
                sizes="179px"
                className="object-cover object-[50%_35%]"
              />
            </div>
            <ButtonLink
              href={contactHref}
              target={isExternalContact ? "_blank" : undefined}
              rel={isExternalContact ? "noreferrer" : undefined}
              className="h-[48px] w-full px-0 py-0"
            >
              {content.cta.contact}
            </ButtonLink>
          </div>

          <div className="grid max-w-[643px] gap-14 text-[var(--ink)]">
            <h1
              id="about-title"
              className="font-display-regular text-[48px] leading-none tracking-[-1.2px] md:text-[62px] md:tracking-[-1.44px]"
            >
              {content.about.heading}
            </h1>

            <div className="font-copy grid gap-8 text-[18px] leading-[1.33] tracking-[-0.36px] md:text-[23px] md:leading-[1.24] md:tracking-[-0.21px]">
              {content.about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <dl className="grid gap-9">
              {content.about.facts.map((fact) => (
                <div key={fact.label} className="grid gap-5">
                  <dt className="mai-ui tracking-[-0.21px] text-[var(--ink)]">
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
          aria-labelledby="about-trust-title"
          className="grid gap-8 border-t border-[var(--line)] pt-10"
        >
          <h2 id="about-trust-title" className="mai-h4 max-w-[720px]">
            {content.pages.about.trustHeading}
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.trust.map((item) => (
              <article key={item.title} className="border-t border-[var(--line)] pt-5">
                <h3 className="mai-h7">{item.title}</h3>
                <p className="mai-body mt-4 text-[var(--muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="about-method-title"
          className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]"
        >
          <div>
            <h2 id="about-method-title" className="mai-h4">
              {content.method.heading}
            </h2>
            <p className="mai-body mt-6 text-[var(--muted)]">
              {content.method.intro}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {content.method.principles.map((principle) => (
              <article key={principle.title} className="border-t border-[var(--line)] pt-5">
                <h3 className="mai-h7">{principle.title}</h3>
                <p className="mai-body mt-4 text-[var(--muted)]">
                  {principle.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="about-reviews-title"
          className="grid gap-10"
        >
          <div className="max-w-[760px]">
            <h2 id="about-reviews-title" className="mai-h4">
              {content.reviews.heading}
            </h2>
            <p className="mai-body mt-6 text-[var(--muted)]">
              {content.reviews.intro}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {content.reviews.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[var(--radius-card)] bg-[var(--paper)] p-5 shadow-[var(--shadow-elevated)]"
              >
                <p className="mai-ui text-[var(--muted)]">{item.sourceLabel}</p>
                <h3 className="mai-h7 mt-5">{item.title}</h3>
                <p className="mai-body mt-4 text-[var(--muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="about-faq-title"
          className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]"
        >
          <h2 id="about-faq-title" className="mai-h4">
            {content.pages.about.faqHeading}
          </h2>
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {[...content.faq]
              .sort((a, b) => a.order - b.order)
              .map((item) => (
                <details key={item.question} className="group py-5">
                  <summary className="mai-body flex cursor-pointer list-none items-center justify-between gap-6 text-[var(--ink)]">
                    <span>{item.question}</span>
                    <span aria-hidden="true" className="mai-ui">
                      +
                    </span>
                  </summary>
                  <p className="mai-body mt-4 max-w-[780px] text-[var(--muted)]">
                    {item.answer}
                  </p>
                </details>
              ))}
          </div>
        </section>

        <section
          id="contact"
          aria-labelledby="about-contact-title"
          className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start"
        >
          <div>
            <h2 id="about-contact-title" className="mai-h4">
              {content.contact.heading}
            </h2>
            <p className="mai-body mt-6 text-[var(--muted)]">
              {content.contact.copy}
            </p>
          </div>
          <ContactForm />
        </section>
      </main>
      <Footer content={content} locale={locale} />
    </div>
  );
}
