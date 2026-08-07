import {describe, expect, it} from "vitest";

import {
  ANALYTICS_CONSENT_KEY,
  calPathFromUrl,
  canLoadAnalytics,
  createBookingClickEvent,
  createBookingCompletedEvent,
  createBookingSuccessTracker,
  pushAnalyticsEvent,
  readAnalyticsConsent,
  readCalUtm,
  writeAnalyticsConsent,
} from "@/lib/analytics";

describe("analytics contracts", () => {
  it("loads analytics only for consented production hosts with a valid GTM ID", () => {
    expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
    expect(canLoadAnalytics("www.agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
    expect(canLoadAnalytics("agatha-pied.vercel.app", "GTM-ABC123", "granted")).toBe(false);
    expect(canLoadAnalytics("localhost", "GTM-ABC123", "granted")).toBe(false);
    expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "denied")).toBe(false);
    expect(canLoadAnalytics("agathamusic.com", "invalid", "granted")).toBe(false);
  });

  it("creates the two permitted redacted event payloads", () => {
    expect(createBookingClickEvent("header")).toEqual({
      event: "booking_cta_click",
      cta_location: "header",
    });
    expect(createBookingCompletedEvent("intro_call")).toEqual({
      event: "booking_completed",
      booking_type: "intro_call",
    });
    expect(createBookingCompletedEvent("music_lesson")).toEqual({
      event: "booking_completed",
      booking_type: "music_lesson",
    });
  });

  it("persists only recognized consent choices", () => {
    const entries = new Map<string, string>();
    const storage = {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
    };

    expect(readAnalyticsConsent(storage)).toBeNull();
    entries.set(ANALYTICS_CONSENT_KEY, "unexpected");
    expect(readAnalyticsConsent(storage)).toBeNull();
    writeAnalyticsConsent(storage, "granted");
    expect(readAnalyticsConsent(storage)).toBe("granted");
  });

  it("fails closed when storage access is unavailable", () => {
    const unavailableStorage = {
      getItem: () => {
        throw new DOMException("Storage unavailable", "SecurityError");
      },
    };
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        get localStorage() {
          throw new DOMException("Storage unavailable", "SecurityError");
        },
        location: {hostname: "agathamusic.com"},
      },
    });

    expect(readAnalyticsConsent(unavailableStorage)).toBeNull();
    expect(pushAnalyticsEvent(createBookingCompletedEvent("intro_call"))).toBe(false);

    Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
  });

  it("does not push events without stored granted consent on a production host", () => {
    const originalWindow = globalThis.window;
    const storage = new Map([[ANALYTICS_CONSENT_KEY, "denied"]]);
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        dataLayer: [] as unknown[],
        localStorage: {getItem: (key: string) => storage.get(key) ?? null},
        location: {hostname: "agathamusic.com"},
      },
    });
    const analyticsWindow = window as unknown as Window & {dataLayer: unknown[]};

    const bookingEvent = createBookingCompletedEvent("intro_call");

    expect(pushAnalyticsEvent(bookingEvent)).toBe(false);
    expect(analyticsWindow.dataLayer).toEqual([]);

    storage.set(ANALYTICS_CONSENT_KEY, "granted");
    expect(pushAnalyticsEvent(bookingEvent)).toBe(true);
    expect(analyticsWindow.dataLayer).toEqual([bookingEvent]);

    Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
  });

  it("accepts only Cal.com paths and allowlisted non-empty UTMs", () => {
    expect(calPathFromUrl("https://cal.com/agatha/trial/")).toBe("agatha/trial");
    expect(calPathFromUrl("https://app.cal.com/agatha")).toBeNull();
    expect(
      readCalUtm(
        "?utm_source=telegram&utm_medium=social&utm_campaign=autumn&email=nope@example.com&booking_id=123&utm_term=piano&utm_content=hero",
      ),
    ).toEqual({
      utm_source: "telegram",
      utm_medium: "social",
      utm_campaign: "autumn",
    });
    expect(readCalUtm("?utm_campaign=&booking_id=123")).toEqual({});
  });

  it("maps each supported Cal title to a redacted booking completion", () => {
    const privateData = {
      uid: "private-uid",
      email: "student@example.com",
      name: "Student Name",
      time: "12:00",
      startTime: "2026-08-07T12:00:00Z",
      status: "ACCEPTED",
      videoCallUrl: "https://meet.google.com/private",
    };

    for (const [title, bookingType] of [
      ["Intro Call", "intro_call"],
      ["Music Lesson", "music_lesson"],
    ] as const) {
      const events: unknown[] = [];
      const trackBookingSuccess = createBookingSuccessTracker((event) => events.push(event));

      trackBookingSuccess({detail: {data: {title, ...privateData}}});

      expect(events).toEqual([{event: "booking_completed", booking_type: bookingType}]);
    }
  });

  it("ignores malformed and unsupported Cal booking titles without consuming the tracker", () => {
    const events: unknown[] = [];
    const trackBookingSuccess = createBookingSuccessTracker((event) => events.push(event));

    for (const notification of [
      undefined,
      {},
      {detail: {}},
      {detail: {data: null}},
      {detail: {data: {title: 123}}},
      {detail: {data: {title: "Parent Intro Call"}}},
      {detail: {data: {title: "Music Theory Consultation"}}},
    ]) {
      trackBookingSuccess(notification);
    }

    trackBookingSuccess({detail: {data: {title: "Intro Call"}}});
    trackBookingSuccess({detail: {data: {title: "Music Lesson"}}});

    expect(events).toEqual([{event: "booking_completed", booking_type: "intro_call"}]);
  });
});
