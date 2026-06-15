import {describe, expect, it, vi} from "vitest";

vi.mock("next-intl/navigation", () => ({
  createNavigation: () => ({
    Link: "a",
    getPathname: vi.fn(),
    redirect: vi.fn(),
    usePathname: vi.fn(),
    useRouter: vi.fn(),
  }),
}));

vi.mock("next-intl/routing", () => ({
  defineRouting: (config: unknown) => config,
}));

import sitemap from "@/app/sitemap";
import {siteContent} from "@/content/site";
import {locales} from "@/lib/routing";

describe("editorial site structure", () => {
  it("uses Agatha Music as the public brand", () => {
    expect(siteContent.en.brand).toBe("Agatha Music");
    expect(siteContent.de.brand).toBe("Agatha Music");
    expect(siteContent.ru.brand).toBe("Agatha Music");
  });

  it("uses the new editorial top-level navigation", () => {
    expect(siteContent.en.nav).toEqual([
      {label: "About me", href: "/about"},
      {label: "Classes", href: "/classes"},
      {label: "Media", href: "/media"},
    ]);
  });

  it("publishes localized home, classes, about, media and booking URLs", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    for (const locale of locales) {
      expect(paths).toContain(`/${locale}`);
      expect(paths).toContain(`/${locale}/classes`);
      expect(paths).toContain(`/${locale}/about`);
      expect(paths).toContain(`/${locale}/media`);
      expect(paths).toContain(`/${locale}/book`);
      expect(paths).not.toContain(`/${locale}/full`);
    }
  });

  it("uses the about profile title and contact label from the approved design", () => {
    expect(siteContent.en.about.heading).toBe("Agatha Gurko");
    expect(siteContent.en.cta.contact).toBe("Text me");
  });
});
