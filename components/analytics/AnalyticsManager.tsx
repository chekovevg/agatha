"use client";

import Script from "next/script";
import {useEffect, useRef, useState} from "react";

import {
  type AnalyticsConsent,
  canLoadAnalytics,
  createBookingClickEvent,
  pushAnalyticsEvent,
  readAnalyticsConsent,
  writeAnalyticsConsent,
} from "@/lib/analytics";

const consentSettings = (analyticsStorage: AnalyticsConsent) => ({
  ad_personalization: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  analytics_storage: analyticsStorage,
});

function gtag(
  ...args: [
    "consent",
    "default" | "update",
    ReturnType<typeof consentSettings>,
  ]
): void;
function gtag() {
  const analyticsWindow = window as Window & {dataLayer?: unknown[]};
  analyticsWindow.dataLayer ??= [];
  // Google's gtag API intentionally queues the function's Arguments object.
  // eslint-disable-next-line prefer-rest-params
  analyticsWindow.dataLayer.push(arguments);
}

export function enqueueConsent(
  command: "default" | "update",
  analyticsStorage: AnalyticsConsent,
) {
  gtag("consent", command, consentSettings(analyticsStorage));
}

export function initializeGtm(gtmId: string | undefined, initialized: boolean): boolean {
  enqueueConsent(initialized ? "update" : "default", "granted");
  if (initialized || !canLoadAnalytics(window.location.hostname, gtmId, "granted")) {
    return initialized;
  }

  const analyticsWindow = window as Window & {dataLayer?: unknown[]};
  analyticsWindow.dataLayer?.push({event: "gtm.js", "gtm.start": Date.now()});
  return true;
}

export function deleteAnalyticsCookies(hostname: string) {
  try {
    const domains = new Set<string>();
    if (hostname.includes(".") && !/^\d+(?:\.\d+){3}$/.test(hostname)) {
      domains.add(hostname);
      domains.add(hostname.split(".").slice(-2).join("."));
    }

    for (const cookie of document.cookie.split(";")) {
      const name = cookie.trim().split("=", 1)[0];
      if (!name?.startsWith("_ga")) continue;

      document.cookie = `${name}=; Max-Age=0; path=/`;
      for (const domain of domains) {
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${domain}`;
      }
    }
  } catch {
    // Cookie access is best-effort; analytics remains disabled below.
  }
}

function getAnalyticsStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readStoredConsent(): AnalyticsConsent | null {
  const storage = getAnalyticsStorage();
  return storage ? readAnalyticsConsent(storage) : null;
}

function writeStoredConsent(consent: AnalyticsConsent): boolean {
  const storage = getAnalyticsStorage();
  if (!storage) return false;

  try {
    writeAnalyticsConsent(storage, consent);
    return true;
  } catch {
    return false;
  }
}

export function AnalyticsConsentBanner({
  onAllow,
  onDeny,
}: {
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <section
      aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 z-50 w-[320px] rounded-[var(--radius-card)] bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow-elevated)] max-[860px]:right-4 max-[860px]:w-auto"
      role="region"
    >
      <p className="mai-ui text-sm">
        We use optional analytics to understand page visits and the booking journey.
      </p>
      <p className="mt-2 text-sm text-[var(--paper)]/80">
        <a className="underline focus-visible:outline-2 focus-visible:outline-offset-4" href="/datenschutz">
          Read our privacy information
        </a>
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
          onClick={onAllow}
          type="button"
        >
          Allow analytics
        </button>
        <button
          className="rounded-full border border-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--paper)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
          onClick={onDeny}
          type="button"
        >
          Continue without analytics
        </button>
      </div>
    </section>
  );
}

export function AnalyticsManager({gtmId}: {gtmId?: string}) {
  const [consent, setConsent] = useState<AnalyticsConsent | null | undefined>(undefined);
  const [showBanner, setShowBanner] = useState(false);
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false);
  const hasInitializedGtm = useRef(false);

  function activateAnalytics() {
    setConsent("granted");
    setShowBanner(false);
    hasInitializedGtm.current = initializeGtm(gtmId, hasInitializedGtm.current);
    setShouldLoadGtm(hasInitializedGtm.current);
  }

  function allowAnalytics() {
    if (!writeStoredConsent("granted")) {
      setConsent(null);
      setShowBanner(true);
      return;
    }

    activateAnalytics();
  }

  function denyAnalytics() {
    const stored = writeStoredConsent("denied");
    if (consent === "granted") enqueueConsent("update", "denied");
    deleteAnalyticsCookies(window.location.hostname);
    setConsent(stored ? "denied" : null);
    setShowBanner(!stored);
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedConsent = readStoredConsent();
      setConsent(storedConsent);
      setShowBanner(storedConsent === null);
      if (storedConsent === "granted") activateAnalytics();
    }, 0);

    return () => window.clearTimeout(timeout);
    // The stored choice is intentionally read once after hydration.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function handleDocumentClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (target.closest("[data-analytics-preferences]")) {
        setShowBanner(true);
        return;
      }

      const bookingCta = target.closest<HTMLElement>("[data-analytics-booking-cta]");
      const ctaLocation = bookingCta?.dataset.analyticsBookingCta;
      if (ctaLocation && readStoredConsent() === "granted") {
        pushAnalyticsEvent(createBookingClickEvent(ctaLocation));
      }
    }

    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  return (
    <>
      {showBanner ? <AnalyticsConsentBanner onAllow={allowAnalytics} onDeny={denyAnalytics} /> : null}
      {shouldLoadGtm && gtmId ? (
        <Script
          id="agatha-gtm"
          src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}
