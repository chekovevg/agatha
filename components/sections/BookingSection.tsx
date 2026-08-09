import {CalBookingEmbed} from "@/components/analytics/CalBookingEmbed";
import {ButtonLink} from "@/components/ui/Button";
import {TabMenu} from "@/components/ui/TabMenu";
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
        <div className="mx-auto flex max-w-[760px] flex-col items-center text-center">
          <h1 className="mai-h4 text-[var(--ink)]">Book a Call</h1>
          <div className="mt-10">
            <TabMenu
              ariaLabel="Booking type"
              items={content.booking.eventTypes.map((event) => ({
                active: event.mode === mode,
                href:
                  event.mode === "intro"
                    ? introBookingHref
                    : lessonBookingHref(subject),
                label: event.title,
              }))}
            />
          </div>
          <p className="mai-body mt-8 max-w-[720px] text-[var(--muted)]">
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

        <div className="mx-auto mt-12 w-full">
          {fallbackUrl ? (
            <CalBookingEmbed
              key={`${mode}-${subject ?? "general"}`}
              url={fallbackUrl}
              title={calTitle}
              notes={notes}
            />
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
              <h2 className="mai-h7">Booking link pending</h2>
              <p className="mai-body mt-4 max-w-md text-[var(--muted)]">
                Add the relevant Cal.com link to enable the booking embed. The
                site keeps Cal.com as the booking authority and does not
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
    </section>
  );
}
