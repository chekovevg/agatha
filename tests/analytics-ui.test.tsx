import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

import DatenschutzPage from "@/app/datenschutz/page";
import {
  AnalyticsConsentBanner,
  deleteAnalyticsCookies,
} from "@/components/analytics/AnalyticsManager";

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
});
