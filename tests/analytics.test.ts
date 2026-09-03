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
  it("loads only after consent on the production domain", () => {
    expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
    expect(canLoadAnalytics("www.agathamusic.com", "GTM-ABC123", "granted")).toBe(true);
    expect(canLoadAnalytics("agatha-pied.vercel.app", "GTM-ABC123", "granted")).toBe(false);
    expect(canLoadAnalytics("localhost", "GTM-ABC123", "granted")).toBe(false);
    expect(canLoadAnalytics("agathamusic.com", "GTM-ABC123", "denied")).toBe(false);
  });

  it("persists recognized consent choices", () => {
    const values = new Map<string, string>();
    const storage = {getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value)};
    expect(readAnalyticsConsent(storage)).toBeNull();
    writeAnalyticsConsent(storage, "granted");
    expect(readAnalyticsConsent(storage)).toBe("granted");
    values.set(ANALYTICS_CONSENT_KEY, "unexpected");
    expect(readAnalyticsConsent(storage)).toBeNull();
  });

  it("does not push events unless consent is granted", () => {
    const originalWindow = globalThis.window;
    const consent = new Map([[ANALYTICS_CONSENT_KEY, "denied"]]);
    Object.defineProperty(globalThis, "window", {configurable: true, value: {dataLayer: [] as unknown[], localStorage: {getItem: (key: string) => consent.get(key) ?? null}, location: {hostname: "agathamusic.com"}}});
    try {
      const event = createBookingCompletedEvent("intro_call");
      expect(pushAnalyticsEvent(event)).toBe(false);
      consent.set(ANALYTICS_CONSENT_KEY, "granted");
      expect(pushAnalyticsEvent(event)).toBe(true);
      expect((window as unknown as {dataLayer: unknown[]}).dataLayer).toEqual([event]);
    } finally {
      Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
    }
  });

  it("allows only Cal.com paths and safe UTM keys", () => {
    expect(calPathFromUrl("https://cal.com/agatha/intro/")).toBe("agatha/intro");
    expect(calPathFromUrl("https://app.cal.com/agatha")).toBeNull();
    expect(readCalUtm("?utm_source=telegram&utm_medium=social&utm_campaign=autumn&email=student@example.com")).toEqual({utm_source: "telegram", utm_medium: "social", utm_campaign: "autumn"});
  });

  it("emits redacted events for supported bookings only", () => {
    expect(createBookingClickEvent("header")).toEqual({event: "booking_cta_click", cta_location: "header"});
    const events: unknown[] = [];
    const track = createBookingSuccessTracker((event) => events.push(event));
    track({detail: {data: {title: "Unexpected", email: "student@example.com"}}});
    track({detail: {data: {title: "Intro Call", email: "student@example.com"}}});
    track({detail: {data: {title: "Music Lesson"}}});
    expect(events).toEqual([{event: "booking_completed", booking_type: "intro_call"}]);
  });
});
