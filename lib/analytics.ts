export const ANALYTICS_CONSENT_KEY = "agatha.analytics-consent";
export type AnalyticsConsent = "granted" | "denied";
export type AnalyticsEvent =
  | {event: "book_trial_cta_click"; cta_location: string}
  | {event: "generate_lead"; booking_type: "trial_lesson"};

const productionHosts = new Set(["agathamusic.com", "www.agathamusic.com"]);
const gtmIdPattern = /^GTM-[A-Z0-9]+$/;

export function canLoadAnalytics(
  hostname: string,
  gtmId: string | undefined,
  consent: AnalyticsConsent | null,
): boolean {
  return consent === "granted" && productionHosts.has(hostname) && Boolean(gtmId && gtmIdPattern.test(gtmId));
}

export function createBookingClickEvent(ctaLocation: string): AnalyticsEvent {
  return {event: "book_trial_cta_click", cta_location: ctaLocation};
}

export function createLeadEvent(): AnalyticsEvent {
  return {event: "generate_lead", booking_type: "trial_lesson"};
}

export function readAnalyticsConsent(storage: Pick<Storage, "getItem">): AnalyticsConsent | null {
  try {
    const consent = storage.getItem(ANALYTICS_CONSENT_KEY);
    return consent === "granted" || consent === "denied" ? consent : null;
  } catch {
    return null;
  }
}

export function writeAnalyticsConsent(
  storage: Pick<Storage, "setItem">,
  consent: AnalyticsConsent,
): void {
  storage.setItem(ANALYTICS_CONSENT_KEY, consent);
}

export function pushAnalyticsEvent(event: AnalyticsEvent): boolean {
  try {
    if (
      typeof window === "undefined" ||
      !productionHosts.has(window.location.hostname) ||
      readAnalyticsConsent(window.localStorage) !== "granted"
    ) {
      return false;
    }

    const analyticsWindow = window as Window & {dataLayer?: AnalyticsEvent[]};
    analyticsWindow.dataLayer ??= [];
    analyticsWindow.dataLayer.push(event);
    return true;
  } catch {
    return false;
  }
}

export function calPathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || parsed.hostname !== "cal.com" || parsed.username || parsed.password) {
      return null;
    }

    const path = parsed.pathname.replace(/^\/+|\/+$/g, "");
    return path || null;
  } catch {
    return null;
  }
}

export function readCalUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};

  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}

export function createBookingSuccessTracker(push: (event: AnalyticsEvent) => unknown): () => void {
  let tracked = false;

  return () => {
    if (tracked) return;
    tracked = true;
    push(createLeadEvent());
  };
}
