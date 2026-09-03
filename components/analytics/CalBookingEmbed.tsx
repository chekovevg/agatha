/* eslint-disable prefer-rest-params -- kept in sync with Cal.com's official bootstrap */
"use client";

import {useEffect} from "react";
import {ButtonLink} from "@/components/ui/Button";
import {calPathFromUrl, createBookingSuccessTracker, pushAnalyticsEvent, readCalUtm} from "@/lib/analytics";

type CalApi = {(...args: unknown[]): void; loaded?: boolean; ns?: Record<string, CalApi>; q?: Array<IArguments | unknown[]>};

function loadCal(): CalApi {
  const calWindow = window as Window & {Cal?: CalApi};
  (function (C, A, L) { const push = (api: CalApi, args: IArguments | unknown[]) => api.q!.push(args); const document = C.document; C.Cal = C.Cal || (function () { const cal = C.Cal!; const args = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; document.head.appendChild(document.createElement("script")).src = A; cal.loaded = true; } if (args[0] === L) { const api = function () { push(api, arguments); } as CalApi; const namespace = args[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns![namespace] = cal.ns![namespace] || api; push(cal.ns![namespace], args); push(cal, ["initNamespace", namespace]); } else push(cal, args); return; } push(cal, args); } as CalApi); })(calWindow, "https://app.cal.com/embed/embed.js", "init");
  return calWindow.Cal!;
}

export function CalBookingEmbed({url, title}: {url: string; title: string}) {
  useEffect(() => { const calLink = calPathFromUrl(url); if (!calLink) return; const trackBookingSuccess = createBookingSuccessTracker(pushAnalyticsEvent); const Cal = loadCal(); Cal("init", {origin: "https://cal.com"}); Cal("inline", {elementOrSelector: "#agatha-cal-inline", calLink, config: readCalUtm(window.location.search)}); Cal("on", {action: "bookingSuccessfulV2", callback: trackBookingSuccess}); }, [url]);
  return <div><div id="agatha-cal-inline" role="region" aria-label={title} className="min-h-[620px] w-full rounded-[var(--radius-card)]" /><ButtonLink href={url} variant="plain" className="mt-3">{title}</ButtonLink></div>;
}
