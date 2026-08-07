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
  onDeny,
}: {
  onAllow: () => void;
  onDeny: () => void;
}) {
  return (
    <section
      aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 z-50 flex w-[305px] flex-col items-start gap-[30px] rounded-[5px] bg-[var(--ink)] p-6 text-[var(--paper)] max-[337px]:right-4 max-[337px]:w-auto"
      role="region"
    >
      <div className="flex w-full flex-col items-start gap-4">
        <p className="mai-ui w-full">We use analytics to understand page visits.</p>
        <a
          className="mai-ui flex h-[18px] items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]"
          href="/datenschutz"
        >
          Read our privacy information
          <svg
            aria-hidden="true"
            className="size-[18px] shrink-0"
            fill="none"
            viewBox="0 0 18 18"
          >
            <path
              d="M4.5 13.5 13.5 4.5M13.5 10.5v-6h-6"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
      <div className="flex w-full flex-col items-start gap-2">
        <Button className="w-full" onClick={onAllow} type="button">
          Allow
        </Button>
        <Button
          className="w-full border-[1.5px] border-[var(--paper)] bg-transparent text-[var(--paper)] focus-visible:outline-[var(--paper)]"
          onClick={onDeny}
          type="button"
          variant="accent"
        >
          No, thanks
        </Button>
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
