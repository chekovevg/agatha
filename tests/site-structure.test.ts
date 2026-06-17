import {readFileSync} from "node:fs";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

function getPngSize(path: URL) {
  const buffer = readFileSync(path);
  const signature = buffer.toString("ascii", 1, 4);

  if (signature !== "PNG") {
    throw new Error(`Expected PNG signature for ${path.pathname}`);
  }

  return {
    height: buffer.readUInt32BE(20),
    width: buffer.readUInt32BE(16),
  };
}

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

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("next/link", () => ({
  default: "a",
}));

vi.mock("next/image", async () => {
  const {createElement: createReactElement} = await import("react");

  return {
    default: ({
      alt,
      className,
      quality,
      sizes,
      src,
    }: {
      alt?: string;
      className?: string;
      quality?: number;
      sizes?: string;
      src: string | {src: string};
    }) =>
      createReactElement("img", {
        alt: alt ?? "",
        className,
        "data-quality": quality,
        sizes,
        src: typeof src === "string" ? src : src.src,
      }),
  };
});

import sitemap from "@/app/sitemap";
import {AboutPage} from "@/components/pages/AboutPage";
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

  it("renders the about page with the high-quality portrait asset", () => {
    const html = renderToStaticMarkup(
      createElement(AboutPage, {content: siteContent.en, locale: "en"}),
    );

    expect(html).toContain('src="/images/about/agatha-portrait.png"');
    expect(html).toContain('alt="Agatha Gurko portrait"');
    expect(html).toContain('data-quality="95"');
    expect(html).toContain("max-w-[calc(1660*var(--unit-fx))]");
    expect(html).toContain("min-[861px]:grid-cols-[repeat(24,minmax(0,1fr))]");
    expect(html).toContain("min-[861px]:col-span-5");
    expect(html).toContain("min-[861px]:col-start-8");
    expect(html).toContain("aspect-[1086/1448]");
    expect(html).toContain("min-[861px]:h-[328px]");
    expect(html).toContain("min-[861px]:w-[245px]");
    expect(html).toContain('sizes="(max-width: 860px) calc(100vw - 44px), 245px"');
    expect(
      getPngSize(
        new URL("../public/images/about/agatha-portrait.png", import.meta.url),
      ),
    ).toEqual({height: 1448, width: 1086});

    expect(
      readFileSync(new URL("../next.config.ts", import.meta.url), "utf8"),
    ).toContain("qualities: [75, 95]");
  });
});
