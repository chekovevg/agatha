import type {SiteContent} from "@/content/types";
import type {Locale} from "@/lib/routing";
import {env} from "@/lib/env";
import {Section} from "@/components/ui/Section";
import {SectionHeader} from "@/components/ui/SectionHeader";
import {ButtonLink} from "@/components/ui/Button";

export function BookingSection({
  content,
  locale,
  expanded = false,
}: {
  content: SiteContent;
  locale: Locale;
  expanded?: boolean;
}) {
  const calLink = env.NEXT_PUBLIC_CAL_LINK;

  return (
    <Section id="booking" tone="green">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <SectionHeader title={content.booking.heading} intro={content.booking.copy} />
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {content.booking.steps.map((step, index) => (
              <div key={step.title} className="rounded-lg border-2 border-[var(--line)] bg-white p-5">
                <p className="text-sm font-black text-[var(--leaf)]">
                  {index + 1}
                </p>
                <h3 className="mt-2 font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
          {!expanded ? (
            <ButtonLink href={`/${locale}/book`} className="mt-8">
              {content.cta.primary}
            </ButtonLink>
          ) : null}
        </div>
        <div className="rounded-lg border-2 border-[var(--line)] bg-white p-5 shadow-[6px_6px_0_var(--line)]">
          {calLink ? (
            <iframe
              title="Book a trial lesson with Agathe"
              src={calLink}
              className="min-h-[620px] w-full rounded-md"
            />
          ) : (
            <div className="flex min-h-[420px] flex-col items-start justify-center rounded-md bg-[var(--paper)] p-8">
              <h3 className="text-2xl font-black">Booking link pending</h3>
              <p className="mt-4 max-w-md leading-7 text-[var(--muted)]">
                Add NEXT_PUBLIC_CAL_LINK to enable the Cal.com booking embed.
                The site keeps Cal.com as the booking authority and does not
                implement custom availability.
              </p>
              <ButtonLink href="#contact" className="mt-6" variant="secondary">
                {content.booking.fallbackContactCta}
              </ButtonLink>
            </div>
          )}
          <div className="mt-5 grid gap-3">
            {content.booking.eventTypes.map((event) => (
              <div key={event.title} className="border-t border-[var(--line)] pt-3">
                <p className="font-black">
                  {event.title} · {event.duration}
                </p>
                <p className="text-sm text-[var(--muted)]">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
