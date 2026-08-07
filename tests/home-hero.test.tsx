import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

vi.mock("next/link", () => ({
  default: "a",
}));

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    priority: _priority,
    src,
    ...props
  }: {
    alt?: string;
    priority?: boolean;
    src: string | {src: string};
  }) => {
    void _priority;

    return createElement("img", {
      ...props,
      alt,
      src: typeof src === "string" ? src : src.src,
    });
  },
  getImageProps: ({
    alt = "",
    src,
    ...props
  }: {
    alt?: string;
    src: string | {src: string};
  }) => {
    const resolvedSrc = typeof src === "string" ? src : src.src;

    return {
      props: {
        ...props,
        alt,
        src: resolvedSrc,
        srcSet: `${resolvedSrc} 1x`,
      },
    };
  },
}));

import {HomePage} from "@/components/pages/HomePage";
import {siteContent} from "@/content/site";

describe("home page", () => {
  it("renders the approved plain hero without interactive media", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );

    expect(html).toContain('data-home-hero="plain"');
    expect(html).toContain("<h1");
    expect(html).toContain("Flute &amp; Music Teacher");
    expect(html).toContain("For Adults and Children");
    expect(html).toContain('href="/book"');
    expect(html).toContain('data-analytics-booking-cta="home-hero"');
    expect(html).toContain("Get in Touch");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<audio");
    expect(html).not.toContain("Play the phrase");
  });

  it("keeps only the manifesto and Rhine blocks after the hero", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );
    const manifesto = html.indexOf("Music becomes possible");
    const adultLink = html.indexOf(
      'href="/online-flute-lessons-for-adults"',
    );
    const childrenLink = html.indexOf(
      'href="/online-flute-lessons-for-children"',
    );
    const location = html.indexOf("From the Rhine, online");

    expect(manifesto).toBeGreaterThan(-1);
    expect(adultLink).toBeGreaterThan(manifesto);
    expect(childrenLink).toBeGreaterThan(manifesto);
    expect(location).toBeGreaterThan(childrenLink);
    expect(html).not.toContain(">Values<");
    expect(html).not.toContain("I believe music should never feel");
  });

  it("shows Intro Call as the header booking action", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );

    expect(html).toContain('data-analytics-booking-cta="header"');
    expect(html).toContain("Book Intro Call");
    expect(html).toContain('src="/images/agatha-gurko-music.svg"');
    expect(html).not.toContain('src="/images/logo.svg"');
  });
});
