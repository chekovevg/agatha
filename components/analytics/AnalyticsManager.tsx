"use client";

import Script from "next/script";
import {useEffect, useRef, useState} from "react";

import {Button} from "@/components/ui/Button";
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
}: {
  onAllow: () => void;
}) {
  return (
    <section
      aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 z-50 flex h-[150px] w-[297px] flex-col items-start gap-[30px] rounded-[5px] bg-[var(--ink)] p-5 text-[var(--paper)] max-[329px]:right-4 max-[329px]:w-auto"
      role="region"
    >
      <p className="mai-ui w-full">We use analytics to understand page visits.</p>
      <Button
        className="h-[50px] w-full hover:bg-[var(--paper)] hover:text-[var(--ink)]"
        onClick={onAllow}
        type="button"
      >
        Okay
      </Button>
    </section>
  );
}

export function AnalyticsManager({gtmId}: {gtmId?: string}) {
  const [showBanner, setShowBanner] = useState(false);
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false);
  const hasInitializedGtm = useRef(false);

  function activateAnalytics() {
    setShowBanner(false);
    hasInitializedGtm.current = initializeGtm(gtmId, hasInitializedGtm.current);
    setShouldLoadGtm(hasInitializedGtm.current);
  }

  function allowAnalytics() {
    if (!writeStoredConsent("granted")) {
      setShowBanner(true);
      return;
    }

    activateAnalytics();
  }

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const storedConsent = readStoredConsent();
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
      {showBanner ? <AnalyticsConsentBanner onAllow={allowAnalytics} /> : null}
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
