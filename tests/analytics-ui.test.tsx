import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it} from "vitest";

import DatenschutzPage from "@/app/datenschutz/page";
import {AnalyticsConsentBanner} from "@/components/analytics/AnalyticsManager";

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
});
