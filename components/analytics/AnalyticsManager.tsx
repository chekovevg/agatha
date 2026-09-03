"use client";

import Script from "next/script";
import {useEffect, useRef, useState} from "react";

import {type AnalyticsConsent, canLoadAnalytics, createBookingClickEvent, pushAnalyticsEvent, readAnalyticsConsent, writeAnalyticsConsent} from "@/lib/analytics";

const consentSettings = (analyticsStorage: AnalyticsConsent) => ({ad_personalization: "denied", ad_storage: "denied", ad_user_data: "denied", analytics_storage: analyticsStorage});

function gtag(...args: unknown[]): void;
function gtag() {
  const analyticsWindow = window as Window & {dataLayer?: unknown[]};
  analyticsWindow.dataLayer ??= [];
  // GTM consumes the arguments object placed on the data layer by gtag.
  // eslint-disable-next-line prefer-rest-params
  analyticsWindow.dataLayer.push(arguments);
}

function enqueueConsent(command: "default" | "update", analyticsStorage: AnalyticsConsent) {
  gtag("consent", command, consentSettings(analyticsStorage));
}

function deleteAnalyticsCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=", 1)[0];
    if (name?.startsWith("_ga")) document.cookie = `${name}=; Max-Age=0; path=/`;
  }
}

export function AnalyticsConsentBanner({onAllow, onDeny}: {onAllow: () => void; onDeny: () => void}) {
  return <section aria-label="Analytics preferences" className="fixed inset-x-4 top-1/2 z-50 mx-auto max-w-xl -translate-y-1/2 rounded-[var(--radius-card)] bg-[var(--ink)] p-5 text-[var(--paper)] shadow-[var(--shadow-elevated)]" role="region">
    <p className="mai-ui text-sm">We use optional analytics to understand page visits and the booking journey.</p>
    <p className="mt-2 text-sm text-[var(--paper)]/80"><a className="underline focus-visible:outline-2 focus-visible:outline-offset-4" href="/datenschutz">Read our privacy information</a></p>
    <div className="mt-4 flex flex-wrap gap-3">
      <button className="rounded-full bg-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]" onClick={onAllow} type="button">Allow analytics</button>
      <button className="rounded-full border border-[var(--paper)] px-4 py-2 text-sm font-semibold text-[var(--paper)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--paper)]" onClick={onDeny} type="button">Continue without analytics</button>
    </div>
  </section>;
}

export function AnalyticsManager({gtmId}: {gtmId?: string}) {
  const [consent, setConsent] = useState<AnalyticsConsent | null | undefined>(undefined);
  const [showBanner, setShowBanner] = useState(false);
  const [shouldLoadGtm, setShouldLoadGtm] = useState(false);
  const hasInitializedGtm = useRef(false);
  function activateAnalytics() {
    setConsent("granted"); setShowBanner(false); enqueueConsent(hasInitializedGtm.current ? "update" : "default", "granted");
    if (!hasInitializedGtm.current && canLoadAnalytics(window.location.hostname, gtmId, "granted")) {
      (window as Window & {dataLayer?: unknown[]}).dataLayer?.push({event: "gtm.js", "gtm.start": Date.now()});
      hasInitializedGtm.current = true;
      setShouldLoadGtm(true);
    }
  }
  function allowAnalytics() { try { writeAnalyticsConsent(window.localStorage, "granted"); activateAnalytics(); } catch { setConsent(null); setShowBanner(true); } }
  function denyAnalytics() { try { writeAnalyticsConsent(window.localStorage, "denied"); } catch { setConsent(null); setShowBanner(true); return; } if (consent === "granted") enqueueConsent("update", "denied"); deleteAnalyticsCookies(); setConsent("denied"); setShowBanner(false); }
  useEffect(() => { const timeout = window.setTimeout(() => { const stored = readAnalyticsConsent(window.localStorage); setConsent(stored); setShowBanner(stored === null); if (stored === "granted") activateAnalytics(); }, 0); return () => window.clearTimeout(timeout); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { function handleClick(event: MouseEvent) { const target = event.target; if (!(target instanceof Element)) return; if (target.closest("[data-analytics-preferences]")) { setShowBanner(true); return; } const cta = target.closest<HTMLElement>("[data-analytics-booking-cta]"); const location = cta?.dataset.analyticsBookingCta; if (location && readAnalyticsConsent(window.localStorage) === "granted") pushAnalyticsEvent(createBookingClickEvent(location)); } document.addEventListener("click", handleClick); return () => document.removeEventListener("click", handleClick); }, []);
  return <>{showBanner ? <AnalyticsConsentBanner onAllow={allowAnalytics} onDeny={denyAnalytics} /> : null}{shouldLoadGtm && gtmId ? <Script id="agatha-gtm" src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`} strategy="afterInteractive" /> : null}</>;
}
