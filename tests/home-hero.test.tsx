import {renderToStaticMarkup} from "react-dom/server";
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

vi.mock("next/image", async () => {
  const {createElement} = await import("react");

  return {
    default: ({
      alt,
      src,
    }: {
      alt?: string;
      src: string | {src: string};
    }) =>
      createElement("img", {
        alt: alt ?? "",
        src: typeof src === "string" ? src : src.src,
      }),
  };
});

import {HomePage} from "@/components/pages/HomePage";
import {siteContent} from "@/content/site";

describe("home hero", () => {
  it("uses a one-screen canvas hero instead of a raster or extended sticky intro", () => {
    const html = renderToStaticMarkup(
      <HomePage content={siteContent.en} locale="en" />,
    );

    expect(html).toContain('data-home-hero="watercolor-intro"');
    expect(html).toContain("home-hero-canvas-stage");
    expect(html).toContain("watercolor-hero-bg");
    expect(html).toContain("<canvas");
    expect(html).toContain("h-[100svh]");
    expect(html).not.toContain("min-h-[200svh]");
    expect(html).not.toContain("sticky top-0");
    expect(html).not.toContain("home-hero-scroll-marker");
    expect(html).not.toContain("/images/home/hero-background.png");
  });
});
