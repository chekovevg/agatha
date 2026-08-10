import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

vi.mock("next/link", () => ({
  default: "a",
}));

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    fill: _fill,
    priority: _priority,
    src,
    ...props
  }: {
    alt?: string;
    fill?: boolean;
    priority?: boolean;
    src: string | {src: string};
  }) => {
    void _priority;
    void _fill;

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
  it("renders the audience selector as the single hero message and action", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );

    expect(html).toContain('data-home-hero="plain"');
    expect(html).toContain("<h1");
    expect(html).toContain("Flute &amp; Music Teacher");
    expect(html).toContain('href="/book?type=intro"');
    expect(
      html.match(/data-analytics-booking-cta="home-audience"/g),
    ).toHaveLength(1);
    expect(html).not.toContain("For Adults and Children");
    expect(html).not.toContain('data-analytics-booking-cta="home-hero"');
    expect(html).not.toContain("Get in Touch");
    expect(html).not.toContain("<canvas");
    expect(html).not.toContain("<audio");
    expect(html).not.toContain("Play the phrase");
  });

  it("renders local audience tabs before the Rhine block", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );
    const adultsTab = html.indexOf("For Adults");
    const childrenTab = html.indexOf("For Children");
    const description = html.indexOf("Start from your first note");
    const audienceCta = html.indexOf(
      'data-analytics-booking-cta="home-audience"',
    );
    const location = html.indexOf("From the Rhine, online");

    expect(adultsTab).toBeGreaterThan(-1);
    expect(childrenTab).toBeGreaterThan(adultsTab);
    expect(description).toBeGreaterThan(childrenTab);
    expect(audienceCta).toBeGreaterThan(description);
    expect(location).toBeGreaterThan(audienceCta);
    expect(html).toContain('role="tablist"');
    expect(html).toContain('role="tabpanel"');
    expect(html).toContain('class="split-link-button');
    expect(html).toContain('href="/book?type=intro"');
    expect(html).not.toContain('data-analytics-booking-cta="home"');
    expect(html).not.toContain("Music becomes possible");
    expect(html).not.toContain("/online-flute-lessons-for-adults");
    expect(html).not.toContain("/online-flute-lessons-for-children");
    expect(html).not.toContain(">Values<");
    expect(html).not.toContain("I believe music should never feel");
  });

  it("shows Book a Call as the header booking action", () => {
    const html = renderToStaticMarkup(
      createElement(HomePage, {content: siteContent}),
    );

    expect(html).toContain('data-analytics-booking-cta="header"');
    expect(html).toContain("Book a Call");
    expect(html).toContain('src="/images/agatha-gurko-music.svg"');
    expect(html).not.toContain('src="/images/logo.svg"');
  });
});
