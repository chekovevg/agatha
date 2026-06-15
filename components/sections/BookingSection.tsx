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
              <div key={step.title} className="rounded-[var(--radius-card)] bg-[var(--card)] p-5 shadow-[var(--shadow-elevated)]">
                <p className="mai-ui text-[var(--muted)]">
                  {index + 1}
                </p>
                <h3 className="mai-body mt-2">{step.title}</h3>
                <p className="mai-caption mt-2 text-[var(--muted)]">
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
        <div className="rounded-[var(--radius-media)] bg-[var(--card)] p-5 shadow-[var(--shadow-elevated)]">
          {calLink ? (
            <iframe
              title="Book a trial lesson with Agatha"
              src={calLink}
              className="min-h-[620px] w-full rounded-[var(--radius-card)]"
            />
          ) : (
            <div className="flex min-h-[420px] flex-col items-start justify-center rounded-[var(--radius-card)] bg-[var(--paper)] p-8">
              <h3 className="mai-h7">Booking link pending</h3>
              <p className="mai-body mt-4 max-w-md text-[var(--muted)]">
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
                <p className="mai-body">
                  {event.title} · {event.duration}
                </p>
                <p className="mai-caption text-[var(--muted)]">{event.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
