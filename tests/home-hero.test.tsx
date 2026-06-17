import {renderToStaticMarkup} from "react-dom/server";
import {existsSync, readFileSync} from "node:fs";
import {describe, expect, it, vi} from "vitest";

function getWebpSize(path: URL) {
  const buffer = readFileSync(path);
  let offset = 12;

  while (offset + 8 <= buffer.length) {
    const chunk = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (chunk === "VP8X") {
      return {
        height: 1 + buffer.readUIntLE(dataOffset + 7, 3),
        width: 1 + buffer.readUIntLE(dataOffset + 4, 3),
      };
    }

    if (chunk === "VP8 ") {
      return {
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff,
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
      };
    }

    if (chunk === "VP8L") {
      const bits = buffer.readUInt32LE(dataOffset + 1);

      return {
        height: 1 + ((bits >> 14) & 0x3fff),
        width: 1 + (bits & 0x3fff),
      };
    }

    offset += 8 + size + (size % 2);
  }

  throw new Error(`Could not read WebP dimensions for ${path.pathname}`);
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

vi.mock("next/image", async () => {
  const {createElement} = await import("react");

  return {
    default: ({
      alt,
      className,
      height,
      sizes,
      src,
      style,
      width,
    }: {
      alt?: string;
      className?: string;
      height?: number;
      sizes?: string;
      src: string | {src: string};
      style?: Record<string, string>;
      width?: number;
    }) =>
      createElement("img", {
        alt: alt ?? "",
        className,
        height,
        sizes,
        src: typeof src === "string" ? src : src.src,
        style,
        width,
      }),
    getImageProps: ({
      alt,
      className,
      height,
      sizes,
      src,
      style,
      width,
    }: {
      alt?: string;
      className?: string;
      height?: number;
      sizes?: string;
      src: string | {src: string};
      style?: Record<string, string>;
      width?: number;
    }) => {
      const srcValue = typeof src === "string" ? src : src.src;

      return {
        props: {
          alt: alt ?? "",
          className,
          height,
          sizes,
          src: srcValue,
          srcSet: `${srcValue} 1x`,
          style,
          width,
        },
      };
    },
  };
});

import {HomePage} from "@/components/pages/HomePage";
import {ButtonLink} from "@/components/ui/Button";
import {SplitLinkButton} from "@/components/ui/SplitLinkButton";
import {WebGLHeroBackground} from "@/components/ui/WebGLHeroBackground";
import {siteContent} from "@/content/site";

describe("home hero", () => {
  it("uses the one-screen ASCII canvas hero instead of a raster or extended sticky intro", () => {
    const html = renderToStaticMarkup(
      <HomePage content={siteContent.en} locale="en" />,
    );

    expect(html).toContain('data-home-hero="watercolor-intro"');
    expect(html).toContain('data-home-hero-background-switcher="ascii"');
    expect(html).toContain("home-hero-canvas-stage");
    expect(html).toContain("watercolor-hero-bg");
    expect(html).toContain("ascii-hero-reveal");
    expect(html).toContain("scale: c d e f g a b");
    expect(html).toContain("<canvas");
    expect(html).toContain("h-[100svh]");
    expect(html).not.toContain("webgl-hero-bg");
    expect(html).not.toContain("min-h-[200svh]");
    expect(html).not.toContain("sticky top-0");
    expect(html).not.toContain("home-hero-scroll-marker");
    expect(html).not.toContain("/images/home/hero-background.png");
  });

  it("marks the reused Microsoft AI home sections and omits non-reused blocks", () => {
    const html = renderToStaticMarkup(
      <HomePage content={siteContent.en} locale="en" />,
    );

    expect(html).toContain('data-reference-section="hero"');
    expect(html).toContain('data-reference-section="manifesto"');
    expect(html).toContain('data-reference-section="values"');
    expect(html).toContain('data-reference-section="single-location"');
    expect(html).toContain('data-reference-section="quote"');
    expect(html).toContain('data-reference-background="cream-stack"');
    expect(html).toContain('class="home-scroll-background"');
    expect(html).toContain('data-scroll-bg="#fef9ed"');
    expect(html).toContain('data-scroll-bg-mode="early-pulse"');
    expect(html).toContain('data-scroll-bg-peak="#f4e8c8"');
    expect(html).toContain('data-scroll-bg-mode="center-pulse"');
    expect(html).toContain('data-scroll-bg-peak="#fbf9ee"');
    expect(html).not.toContain(
      'data-reference-section="hero" data-scroll-bg',
    );
    expect(html).toContain("Music becomes possible");
    expect(html).toContain("Values");
    expect(html).toContain("From the Rhine, online");
    expect(html).not.toContain('data-reference-section="news-link"');
    expect(html).not.toContain('data-reference-section="models"');
    expect(html).not.toContain('data-reference-section="join-us"');
    expect(html).not.toContain('data-reference-section="multi-location"');
  });

  it("documents the Microsoft AI block mapping decisions", () => {
    const mapping = readFileSync(
      new URL("../docs/MICROSOFT_AI_HOME_MAPPING.md", import.meta.url),
      "utf8",
    );

    expect(mapping).toContain("Hero background: `#FBD3BE`");
    expect(mapping).toContain("Main page background: `#FEF9ED`");
    expect(mapping).toContain("Values scroll warm point: about `#F4E8C8`");
    expect(mapping).toContain("Key Locations subtle warm point: about `#FBF9EE`");
    expect(mapping).toContain(
      "does not switch the global page background on the Hero-to-content boundary",
    );
    expect(mapping).toContain("Large image/news link after Hero | Not reused for v1");
    expect(mapping).toContain("Models list | Not reused on home");
    expect(mapping).toContain("Join Us photo zoom block | Not reused for v1");
    expect(mapping).toContain("Key Locations | Adapted as one single-location block");
  });

  it("uses a section-scoped controller for scroll background changes", () => {
    const source = readFileSync(
      new URL("../components/ui/HomeScrollBackground.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("[data-scroll-bg]");
    expect(source).toContain("--home-scroll-bg");
    expect(source).toContain("early-pulse");
    expect(source).toContain("center-pulse");
    expect(source).toContain("mixColor");
    expect(source).toContain("IntersectionObserver");
    expect(source).not.toContain("data-reference-section=\\\"models\\\"");
    expect(source).not.toContain("data-reference-section=\\\"join-us\\\"");
  });

  it("has a separate WebGL shader background variant for visual experiments", () => {
    const html = renderToStaticMarkup(<WebGLHeroBackground />);

    expect(html).toContain('data-hero-background="webgl"');
    expect(html).toContain('data-pointer-reactive="true"');
    expect(html).toContain("webgl-hero-bg");
    expect(html).toContain("webgl-hero-canvas");
    expect(html).toContain("<canvas");
  });

  it("guards the WebGL animation loop before disposing GL resources", () => {
    const source = readFileSync(
      new URL("../components/ui/WebGLHeroBackground.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("let isDisposed = false;");
    expect(source).toContain("if (isDisposed) {");
    expect(source).toContain("isDisposed = true;");
  });

  it("reveals the WebGL bokeh field through a cursor-centered shader mask", () => {
    const source = readFileSync(
      new URL("../components/ui/WebGLHeroBackground.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("float pointerReveal =");
    expect(source).toContain("bokeh = clamp(bokeh * pointerReveal");
    expect(source).toContain("highlights = clamp(highlights * pointerReveal");
  });

  it("uses the optically tuned local hero typography on the home page", () => {
    const html = renderToStaticMarkup(
      <HomePage content={siteContent.en} locale="en" />,
    );

    expect(html).toContain("mai-h1");
    expect(html).toContain("home-hero-copy");
    expect(html).toContain("home-hero-title");
    expect(html).toContain("min-[601px]:h-[calc(70.6875*var(--unit-fx))]");
    expect(html).not.toContain("min-[601px]:min-h-[calc(70.6875*var(--unit-fx))]");
    expect(html).toContain("h-[calc(25.06*var(--unit-fx))] w-auto");
    expect(html).not.toContain("h-[calc(30*var(--unit-fx))]");
    expect(html).not.toContain("w-[calc(54*var(--unit-fx))]");
    expect(html).toContain("home-hero-title-line-primary");
    expect(html).toContain("home-hero-title-line-secondary");
    expect(html).toContain("home-hero-subtitle");
    expect(html).toContain("mai-h3");
    expect(html).toContain("mai-h4");
    expect(html).toContain("mai-h5");
    expect(html).toContain("mai-h7");
    expect(html).toContain("mai-text-large");
    expect(html).toContain("mai-text-large-alt");
    expect(html).toContain("mai-text-regular");
    expect(html).toContain(
      'class="mai-text-large home-hero-subtitle mx-auto text-[var(--hero-watercolor-muted)]"',
    );
    expect(html).not.toContain("tracking-[0]");
  });

  it("keeps the open mobile header aligned with the Microsoft AI menu contract", () => {
    const source = readFileSync(
      new URL("../components/layout/Header.tsx", import.meta.url),
      "utf8",
    );

    expect(source).toContain("max-[600px]:fixed");
    expect(source).toContain("max-[600px]:inset-0");
    expect(source).toContain("max-[600px]:bg-[var(--background)]");
    expect(source).toContain("data-menu-state");
    expect(source).toContain("data-header-hidden");
    expect(source).toContain("window.addEventListener(\"scroll\"");
    expect(source).toContain("lastScrollYRef");
    expect(source).toContain("headerHidden");
    expect(source).toContain("fixed");
    expect(source).toContain("top-0");
    expect(source).toContain("pt-[calc(33*var(--unit-fx))]");
    expect(source).toContain("max-[600px]:pt-5");
    expect(source).toContain("min-[601px]:-translate-y-[calc(100%+12px)]");
    expect(source).toContain("requestAnimationFrame");
    expect(source).toContain("setTimeout");
    expect(source).toContain("max-[600px]:fixed max-[600px]:inset-0");
    expect(source).toContain("max-[600px]:bg-[var(--background)]");
    expect(source).toContain("max-[600px]:transition-opacity");
    expect(source).toContain("max-[600px]:duration-[700ms]");
    expect(source).toContain("max-[600px]:ease-out");
    expect(source).toContain("max-[600px]:opacity-100");
    expect(source).toContain("max-[600px]:opacity-0");
    expect(source).toContain("max-[600px]:leading-[1.8]");
    expect(source).toContain('"font-ui mt-[calc(28*var(--unit-fx))]');
    expect(source).toContain("aria-label=\"Footer links\"");
    expect(source).toContain("aria-label=\"Social links\"");
    expect(source).toContain("max-[600px]:z-[9999]");
    expect(source).toContain("max-[600px]:h-[100dvh]");
    expect(source).toContain("max-[600px]:justify-between");
    expect(source).toContain("max-[600px]:row-start-1");
    expect(source).toContain("max-[600px]:pt-[calc(100*var(--unit-fx))]");
    expect(source).toContain("h-[8px] w-[18px]");
    expect(source).toContain("outline-none");
    expect(source).toContain("focus-visible:outline-offset-2");
    expect(source).toContain("left-1/2 top-1/2");
    expect(source).toContain("-translate-x-1/2 -translate-y-[3px]");
    expect(source).toContain("-translate-x-1/2 translate-y-[3px]");
    expect(source).toContain("border-t border-current");
    expect(source).toContain("duration-[400ms]");
    expect(source).toContain("translate-y-0 -rotate-45");
    expect(source).toContain("translate-y-0 rotate-45");
    expect(source).not.toContain("clipPath");
    expect(source).not.toContain("max-[600px]:transition-[clip-path,opacity]");
    expect(source).not.toContain("max-[600px]:delay-[500ms]");
    expect(source).not.toContain("max-[600px]:delay-[600ms]");
    expect(source).not.toContain("max-[600px]:delay-[700ms]");
    expect(source).not.toContain(
      "max-[600px]:transition-opacity max-[600px]:duration-[500ms]",
    );
    expect(source).not.toContain("top-0 h-px w-full bg-[currentColor]");
    expect(source).not.toContain("bottom-0 left-0 h-px w-full bg-[currentColor]");
    expect(source).not.toContain("translate-y-[3.5px]");
    expect(source).not.toContain("max-[600px]:inset-x-[calc(16*var(--unit-fx))]");
    expect(source).not.toContain("max-[600px]:bottom-[calc(20*var(--unit-fx))]");
    expect(source).not.toContain("pb-[calc(132*var(--unit-fx))]");
    expect(source).not.toContain("Accessibility Mode");
    expect(source).not.toContain("max-[600px]:top-[calc(100%+calc(10*var(--unit-fx)))]");
  });

  it("defines the fluid reference-derived type ramp used by home page tokens", () => {
    const css = readFileSync(
      new URL("../app/globals.css", import.meta.url),
      "utf8",
    );

    expect(css).toContain("--mai-h3-size: calc(64 * var(--unit-fx-type));");
    expect(css).toContain("--reference-hero-peach: #fbd3be;");
    expect(css).toContain("--reference-values-warm: #f4e8c8;");
    expect(css).toContain("--reference-location-warm: #fbf9ee;");
    expect(css).toContain("--reference-soft-row: #fbf0dc;");
    expect(css).toContain("--background: var(--parchment-white);");
    expect(css).toContain("background: var(--reference-hero-peach);");
    expect(css).toContain(".home-reference-shell");
    expect(css).toContain("--home-scroll-bg: var(--reference-cream);");
    expect(css).toContain(".home-scroll-background");
    expect(css).toContain("background-color: var(--home-scroll-bg);");
    expect(css).toContain("--mai-text-large-size: calc(30 * var(--unit-fx-type));");
    expect(css).toContain(
      "--mai-text-large-alt-size: calc(32 * var(--unit-fx-type));",
    );
    expect(css).toContain("--mai-text-regular-size: var(--mai-body-size);");
    expect(css).toContain(".mai-text-large");
    expect(css).toContain(".mai-text-large-alt");
    expect(css).toContain(".mai-text-regular");
    expect(css).toContain(".home-hero-title-line-primary");
    expect(css).toContain(".home-hero-copy");
    expect(css).toContain("transform: translateY(clamp(8px, 2svh, 20px));");
    expect(css).toContain("--font-garamond-book-narrow");
    expect(css).toContain("--font-az-garamond");
    expect(css).toContain("font-size: clamp(58px, 9vw, 156px);");
    expect(css).toContain("letter-spacing: -0.017em;");
    expect(css).toContain("font-size: clamp(64px, 9.65vw, 167px);");
    expect(css).toContain("letter-spacing: -0.024em;");
    expect(css).toContain("font-size: clamp(18px, 2.05vw, 36px);");
    expect(css).toContain("letter-spacing: -0.023em;");
    expect(css).toContain("max-width: min(calc(100vw - 40px), 960px);");
    expect(css).toContain("line-height: 110%;");
    expect(css).toContain("@media (width < 600px)");
    expect(css).toContain("row-gap: 20px;");
    expect(css).toContain("transform: translateY(-34px);");
    expect(css).toContain("max-width: min(calc(100vw - 48px), 340px);");
    expect(css).toContain("font-size: clamp(42px, 11vw, 46px);");
    expect(css).toContain("font-size: clamp(43px, 11.8vw, 48px);");
    expect(css).toContain("font-size: clamp(15px, 4vw, 16px);");
    expect(css).toContain("max-width: min(calc(100vw - 56px), 320px);");
  });

  it("loads the hero Garamond faces from local font files", () => {
    const layout = readFileSync(
      new URL("../app/layout.tsx", import.meta.url),
      "utf8",
    );

    expect(layout).toContain('localFont from "next/font/local"');
    expect(layout).toContain("./fonts/GaramondBookNarrowC.otf");
    expect(layout).toContain("./fonts/GaramondBookNarrowC-Italic.otf");
    expect(layout).toContain("./fonts/AZGaramondC.otf");
    expect(layout).toContain("--font-garamond-book-narrow");
    expect(layout).toContain("--font-az-garamond");

    expect(
      existsSync(new URL("../app/fonts/GaramondBookNarrowC.otf", import.meta.url)),
    ).toBe(true);
    expect(
      existsSync(
        new URL("../app/fonts/GaramondBookNarrowC-Italic.otf", import.meta.url),
      ),
    ).toBe(true);
    expect(
      existsSync(new URL("../app/fonts/AZGaramondC.otf", import.meta.url)),
    ).toBe(true);
  });

  it("uses updated location artwork and a mobile-specific Agatha image", () => {
    const html = renderToStaticMarkup(
      <HomePage content={siteContent.en} locale="en" />,
    );

    expect(html).toContain('src="/images/home/from-the-rhine.webp"');
    expect(html).toContain('width="1501"');
    expect(html).toContain('height="944"');
    expect(html).toContain("<picture");
    expect(html).toContain('media="(max-width: 767px)"');
    expect(html).toContain('media="(min-width: 768px)"');
    expect(html).toContain("/images/home/agatha-pic-mobile.webp");

    expect(
      getWebpSize(new URL("../public/images/home/from-the-rhine.webp", import.meta.url)),
    ).toEqual({height: 944, width: 1501});
    expect(
      getWebpSize(new URL("../public/images/home/agatha-pic-mobile.webp", import.meta.url)),
    ).toEqual({height: 1508, width: 1404});
  });

  it("keeps split link button hover motion aligned with Microsoft AI", () => {
    const html = renderToStaticMarkup(
      <SplitLinkButton href="/en/book">Get in touch</SplitLinkButton>,
    );
    const sharedButtonHtml = renderToStaticMarkup(
      <ButtonLink href="/en/book" variant="split">
        Book Trial Class
      </ButtonLink>,
    );
    const css = readFileSync(
      new URL("../app/globals.css", import.meta.url),
      "utf8",
    );

    expect(html).toContain("split-link-button");
    expect(sharedButtonHtml).toContain("split-link-button");
    expect(sharedButtonHtml).toContain("Book Trial Class");
    expect(html).not.toContain("split-link-button-label");
    expect(html).not.toContain("split-link-button-icon");
    expect(html).not.toContain("split-link-button-arrow");
    expect(html).not.toContain("arrow-up-right");
    expect(css).toContain("margin-right: calc(3em + 3px);");
    expect(css).toContain("transition-duration: 0.6s;");
    expect(css).toContain("transition-timing-function: var(--alias-easeOutCubic);");
    expect(css).toContain(".split-link-button::before");
    expect(css).toContain(".split-link-button::after");
    expect(css).toContain('mask: url("/icons/arrow-narrow-right-light.svg")');
    expect(css).toContain("center / 13px 10px no-repeat");
    expect(css).toContain("border-radius: 100%;");
  });
});
