import {describe, expect, it} from "vitest";

import {
  ANALYTICS_CONSENT_KEY,
  calPathFromUrl,
  canLoadAnalytics,
  createBookingClickEvent,
  createBookingSuccessTracker,
  createLeadEvent,
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
      event: "book_trial_cta_click",
      cta_location: "header",
    });
    expect(createLeadEvent()).toEqual({
      event: "generate_lead",
      booking_type: "trial_lesson",
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

    expect(pushAnalyticsEvent(createLeadEvent())).toBe(false);
    expect(analyticsWindow.dataLayer).toEqual([]);

    storage.set(ANALYTICS_CONSENT_KEY, "granted");
    expect(pushAnalyticsEvent(createLeadEvent())).toBe(true);
    expect(analyticsWindow.dataLayer).toEqual([createLeadEvent()]);

    Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
  });

  it("accepts only Cal.com paths and allowlisted non-empty UTMs", () => {
    expect(calPathFromUrl("https://cal.com/agatha/trial/")).toBe("agatha/trial");
    expect(calPathFromUrl("https://app.cal.com/agatha")).toBeNull();
    expect(readCalUtm("?utm_source=telegram&utm_medium=social&email=nope@example.com")).toEqual({
      utm_source: "telegram",
      utm_medium: "social",
    });
    expect(readCalUtm("?utm_campaign=&booking_id=123")).toEqual({});
  });

  it("emits one lead event when Cal reports duplicate booking successes", () => {
    const events: unknown[] = [];
    const trackBookingSuccess = createBookingSuccessTracker((event) => events.push(event));

    trackBookingSuccess();
    trackBookingSuccess();

    expect(events).toEqual([{event: "generate_lead", booking_type: "trial_lesson"}]);
  });
});
