/* eslint-disable prefer-rest-params -- kept in sync with Cal.com's official bootstrap */
"use client";

import {useEffect, useReducer} from "react";

import {calBookingStatusReducer} from "@/components/analytics/cal-booking-status";

import {
  calPathFromUrl,
  createBookingSuccessTracker,
  pushAnalyticsEvent,
  readCalUtm,
} from "@/lib/analytics";

type CalApi = {
  (...args: unknown[]): void;
  loaded?: boolean;
  ns?: Record<string, CalApi>;
  q?: Array<IArguments | unknown[]>;
};

const trackBookingSuccess = createBookingSuccessTracker(pushAnalyticsEvent);

function loadCal(): CalApi {
  const calWindow = window as Window & {Cal?: CalApi};

  (function (C, A, L) {
    const push = (api: CalApi, args: IArguments | unknown[]) => {
      api.q!.push(args);
    };
    const document = C.document;

    C.Cal =
      C.Cal ||
      (function () {
        const cal = C.Cal!;
        const args = arguments;

        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          document.head.appendChild(document.createElement("script")).src = A;
          cal.loaded = true;
        }

        if (args[0] === L) {
          const api = function () {
            push(api, arguments);
          } as CalApi;
          const namespace = args[1];
          api.q = api.q || [];

          if (typeof namespace === "string") {
            cal.ns![namespace] = cal.ns![namespace] || api;
            push(cal.ns![namespace], args);
            push(cal, ["initNamespace", namespace]);
          } else {
            push(cal, args);
          }
          return;
        }

        push(cal, args);
      } as CalApi);
  })(calWindow, "https://app.cal.com/embed/embed.js", "init");

  return calWindow.Cal!;
}

export function CalBookingEmbed({
  url,
  title,
  notes,
}: {
  url: string;
  title: string;
  notes?: string;
}) {
  const [status, dispatch] = useReducer(calBookingStatusReducer, "loading");

  useEffect(() => {
    let active = true;
    dispatch({type: "reset"});

    const calLink = calPathFromUrl(url);
    if (!calLink) {
      dispatch({type: "linkFailed"});
      return;
    }

    const slowTimer = window.setTimeout(() => {
      if (active) dispatch({type: "slow"});
    }, 8000);

    const Cal = loadCal();
    Cal("init", {origin: "https://cal.com"});
    Cal("inline", {
      elementOrSelector: "#agatha-cal-inline",
      calLink,
      config: {
        ...readCalUtm(window.location.search),
        ...(notes ? {notes} : {}),
      },
    });
    Cal("ui", {
      hideEventTypeDetails: true,
      showTimezoneWhenEventDetailsHidden: true,
      styles: {body: {background: "transparent"}},
    });
    Cal("on", {
      action: "linkReady",
      callback: () => {
        if (active) dispatch({type: "linkReady"});
      },
    });
    Cal("on", {
      action: "bookerReady",
      callback: () => {
        if (active) {
          window.clearTimeout(slowTimer);
          dispatch({type: "bookerReady"});
        }
      },
    });
    Cal("on", {
      action: "linkFailed",
      callback: () => {
        if (active) {
          window.clearTimeout(slowTimer);
          dispatch({type: "linkFailed"});
        }
      },
    });
    Cal("on", {
      action: "bookingSuccessfulV2",
      callback: trackBookingSuccess,
    });

    return () => {
      active = false;
      window.clearTimeout(slowTimer);
    };
  }, [notes, url]);

  return (
    <div className="cal-booking-shell w-full">
      {status !== "ready" ? (
        <div
          role="status"
          aria-live="polite"
          className="mai-ui mb-5 text-center text-[var(--muted)]"
          data-cal-status={status}
        >
          {status === "failed"
            ? "The booking calendar could not load. Use the direct Cal.com link below."
            : status === "slow"
              ? "The booking calendar is taking longer than expected. You can use the direct Cal.com link below."
              : "Loading booking calendar…"}
        </div>
      ) : null}
      <div
        id="agatha-cal-inline"
        role="region"
        aria-label={title}
        aria-busy={status === "loading" || status === "slow"}
        className="min-h-[620px] w-full rounded-[var(--radius-card)]"
      />
    </div>
  );
}
