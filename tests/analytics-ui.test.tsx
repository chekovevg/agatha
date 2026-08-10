import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

vi.mock("next/image", async () => {
  const {createElement} = await import("react");

  return {
    default: ({
      fill: _fill,
      priority: _priority,
      src,
      unoptimized: _unoptimized,
      ...props
    }: {
      fill?: boolean;
      priority?: boolean;
      src: string | {src: string};
      unoptimized?: boolean;
    }) => {
      void _fill;
      void _priority;
      void _unoptimized;

      return createElement("img", {
        ...props,
        src: typeof src === "string" ? src : src.src,
      });
    },
    getImageProps: ({src, ...props}: {src: string | {src: string}}) => ({
      props: {
        ...props,
        src: typeof src === "string" ? src : src.src,
        srcSet: `${typeof src === "string" ? src : src.src} 1x`,
      },
    }),
  };
});

import DatenschutzPage from "@/app/datenschutz/page";
import {
  AnalyticsConsentBanner,
  deleteAnalyticsCookies,
  enqueueConsent,
  initializeGtm,
} from "@/components/analytics/AnalyticsManager";
import {Header} from "@/components/layout/Header";
import {ClassesPage} from "@/components/pages/ClassesPage";
import {HomePage} from "@/components/pages/HomePage";
import {MediaPage} from "@/components/pages/MediaPage";
import {siteContent} from "@/content/site";

describe("analytics consent UI", () => {
  it("queues Google consent commands as gtag arguments objects", () => {
    const originalWindow = globalThis.window;
    const dataLayer: unknown[] = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {dataLayer},
    });

    try {
      enqueueConsent("default", "granted");

      expect(Array.isArray(dataLayer[0])).toBe(false);
      expect(Object.prototype.toString.call(dataLayer[0])).toBe("[object Arguments]");
      expect(Array.from(dataLayer[0] as ArrayLike<unknown>)).toEqual([
        "consent",
        "default",
        {
          ad_personalization: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          analytics_storage: "granted",
        },
      ]);
    } finally {
      Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
    }
  });

  it("updates consent without initializing GTM again after deny and re-allow", () => {
    const originalWindow = globalThis.window;
    const dataLayer: unknown[] = [];
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {dataLayer, location: {hostname: "agathamusic.com"}},
    });

    try {
      const firstInitialization = initializeGtm("GTM-TEST123", false);
      enqueueConsent("update", "denied");
      const secondInitialization = initializeGtm("GTM-TEST123", firstInitialization);

      const consentCommands = dataLayer
        .filter((entry) => Object.prototype.toString.call(entry) === "[object Arguments]")
        .map((entry) => Array.from(entry as ArrayLike<unknown>));
      const gtmInitializations = dataLayer.filter(
        (entry) => !Array.isArray(entry) && (entry as {event?: string}).event === "gtm.js",
      );

      expect(firstInitialization).toBe(true);
      expect(secondInitialization).toBe(true);
      expect(consentCommands.map((command) => command.slice(0, 2))).toEqual([
        ["consent", "default"],
        ["consent", "update"],
        ["consent", "update"],
      ]);
      expect((consentCommands[2]?.[2] as {analytics_storage?: string}).analytics_storage).toBe(
        "granted",
      );
      expect(gtmInitializations).toHaveLength(1);
    } finally {
      Object.defineProperty(globalThis, "window", {configurable: true, value: originalWindow});
    }
  });

  it("renders the simplified banner with a stable acknowledgement button", () => {
    const html = renderToStaticMarkup(
      createElement(AnalyticsConsentBanner, {
        onAllow: () => {},
      }),
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Analytics preferences"');
    expect(html).toContain("We use analytics to understand page visits.");
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html).toContain(">Okay</button>");
    expect(html).toContain("w-[297px]");
    expect(html).toContain("h-[150px]");
    expect(html).toContain("h-[50px]");
    expect(html.match(/mai-ui/g)).toHaveLength(2);
    expect(html).not.toContain("text-[15px]");
    expect(html).toContain("hover:bg-[var(--paper)]");
    expect(html).toContain("hover:text-[var(--ink)]");
    expect(html).not.toContain("<a");
  });

  it("discloses the consent-based Google Analytics controls", () => {
    const html = renderToStaticMarkup(createElement(DatenschutzPage));

    expect(html).toContain("Google Analytics");
    expect(html).toContain("consent");
    expect(html).toContain("data-analytics-preferences");
  });

  it("expires visible analytics cookies for host-only and domain scopes", () => {
    const originalDocument = globalThis.document;
    const writes: string[] = [];
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: {
        get cookie() {
          return "_ga=first; _ga_ABC=second; other=keep";
        },
        set cookie(value: string) {
          writes.push(value);
        },
      },
    });

    deleteAnalyticsCookies("www.agathamusic.com");

    expect(writes).toContain("_ga=; Max-Age=0; path=/");
    expect(writes).toContain("_ga=; Max-Age=0; path=/; domain=www.agathamusic.com");
    expect(writes).toContain("_ga=; Max-Age=0; path=/; domain=agathamusic.com");
    expect(writes).toContain("_ga_ABC=; Max-Age=0; path=/");
    expect(writes).not.toContain("other=; Max-Age=0; path=/");

    Object.defineProperty(globalThis, "document", {configurable: true, value: originalDocument});
  });

  it("marks booking CTAs with their funnel locations", () => {
    const headerHtml = renderToStaticMarkup(createElement(Header, {content: siteContent}));
    const homeHtml = renderToStaticMarkup(createElement(HomePage, {content: siteContent}));
    const classesHtml = renderToStaticMarkup(createElement(ClassesPage, {content: siteContent}));
    const mediaHtml = renderToStaticMarkup(createElement(MediaPage, {content: siteContent}));

    expect(headerHtml.match(/data-analytics-booking-cta="header"/g)).toHaveLength(2);
    expect(homeHtml).not.toContain('data-analytics-booking-cta="home"');
    expect(classesHtml).toContain('data-analytics-booking-cta="classes"');
    expect(mediaHtml).toContain('data-analytics-booking-cta="media"');
  });
});
