import {CalBookingEmbed} from "@/components/analytics/CalBookingEmbed";
import {ButtonLink} from "@/components/ui/Button";
import type {BookingMode, SiteContent} from "@/content/types";
import {introBookingHref, lessonBookingHref} from "@/lib/booking";
import {env} from "@/lib/env";

export function BookingSection({
  content,
  expanded = false,
  mode = "intro",
  subject,
}: {
  content: SiteContent;
  expanded?: boolean;
  mode?: BookingMode;
  subject?: string;
}) {
  const booking = mode === "lesson" ? content.booking.lesson : content.booking;
  const calLink =
    mode === "lesson"
      ? env.NEXT_PUBLIC_CAL_LESSON_LINK
      : env.NEXT_PUBLIC_CAL_LINK;
  const calTitle =
    mode === "lesson"
      ? "Book a music lesson with Agatha"
      : "Book an intro call with Agatha";
  const notes = mode === "lesson" && subject ? `Class: ${subject}` : undefined;
  const fallbackUrl =
    notes && calLink
      ? `${calLink}?${new URLSearchParams({notes})}`
      : calLink;

  return (
    <section id="booking" className="bg-[var(--background)]">
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 lg:py-24">
        <nav aria-label="Booking type" className="mb-10 flex flex-wrap gap-3">
          {content.booking.eventTypes.map((event) => {
            const active = event.mode === mode;
            const href =
              event.mode === "intro"
                ? introBookingHref
                : lessonBookingHref(subject);

            return (
              <ButtonLink
                key={event.mode}
                href={href}
                variant={active ? "accent" : "secondary"}
                aria-current={active ? "page" : undefined}
              >
                {event.title}
              </ButtonLink>
            );
          })}
        </nav>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <div className="max-w-3xl">
              <h1 className="mai-h4 text-[var(--ink)]">{booking.heading}</h1>
              <p className="mai-body mt-5 max-w-[720px] text-[var(--muted)]">
                {booking.copy}
              </p>
              {mode === "lesson" && subject ? (
                <p
                  className="mai-ui mt-5 text-[var(--ink)]"
                  data-testid="selected-class"
                >
                  Selected class: <strong>{subject}</strong>
                </p>
              ) : null}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {booking.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-[var(--radius-card)] bg-[var(--card)] p-5 shadow-[var(--shadow-elevated)]"
                >
                  <p className="mai-ui text-[var(--muted)]">{index + 1}</p>
                  <h2 className="mai-body mt-2">{step.title}</h2>
                  <p className="mai-caption mt-2 text-[var(--muted)]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>

            {!expanded ? (
              <ButtonLink
                href={
                  mode === "lesson"
                    ? lessonBookingHref(subject)
                    : introBookingHref
                }
                className="mt-8"
              >
                {content.cta.primary}
              </ButtonLink>
            ) : null}
          </div>

          <div>
            {fallbackUrl ? (
              <CalBookingEmbed
                key={`${mode}-${subject ?? "general"}`}
                url={fallbackUrl}
                title={calTitle}
                notes={notes}
              />
            ) : (
              <div className="flex min-h-[420px] flex-col items-start justify-center p-8">
                <h2 className="mai-h7">Booking link pending</h2>
                <p className="mai-body mt-4 max-w-md text-[var(--muted)]">
                  Add the relevant Cal.com link to enable the booking embed.
                  The site keeps Cal.com as the booking authority and does not
                  implement custom availability.
                </p>
                <ButtonLink
                  href="/about#contact"
                  className="mt-6"
                  variant="secondary"
                >
                  {content.booking.fallbackContactCta}
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
