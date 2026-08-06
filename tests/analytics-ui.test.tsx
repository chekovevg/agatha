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
    }) =>
      createElement("img", {
        ...props,
        src: typeof src === "string" ? src : src.src,
      }),
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
} from "@/components/analytics/AnalyticsManager";
import {Header} from "@/components/layout/Header";
import {ClassesPage} from "@/components/pages/ClassesPage";
import {HomePage} from "@/components/pages/HomePage";
import {MediaPage} from "@/components/pages/MediaPage";
import {siteContent} from "@/content/site";

describe("analytics consent UI", () => {
  it("renders accessible analytics consent choices", () => {
    const html = renderToStaticMarkup(
      createElement(AnalyticsConsentBanner, {
        onAllow: () => {},
        onDeny: () => {},
      }),
    );

    expect(html).toContain('role="region"');
    expect(html).toContain('aria-label="Analytics preferences"');
    expect(html).toContain("Allow analytics");
    expect(html).toContain("Continue without analytics");
    expect(html).toContain('href="/datenschutz"');
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
    expect(homeHtml).toContain('data-analytics-booking-cta="home"');
    expect(classesHtml).toContain('data-analytics-booking-cta="classes"');
    expect(mediaHtml).toContain('data-analytics-booking-cta="media"');
  });
});
