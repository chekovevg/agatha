import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";

vi.mock("next/image", async () => {
  const {createElement} = await import("react");

  return {
    default: ({
      alt,
      className,
      height,
      src,
      width,
    }: {
      alt?: string;
      className?: string;
      height?: number;
      src: string | {src: string};
      width?: number;
    }) =>
      createElement("img", {
        alt: alt ?? "",
        className,
        height,
        src: typeof src === "string" ? src : src.src,
        width,
      }),
  };
});

vi.mock("next/link", async () => {
  const {createElement} = await import("react");

  return {
    default: ({
      children,
      href,
      ...props
    }: {
      children: React.ReactNode;
      href: string;
    }) => createElement("a", {href, ...props}, children),
  };
});

import {Footer} from "@/components/layout/Footer";
import {siteContent} from "@/content/site";

describe("footer", () => {
  it("renders the footer links without duplicate contact actions", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent} />,
    );

    expect(html).toContain('src="/images/agatha-gurko-music.svg"');
    expect(html).toContain('alt="Agatha Gurko Music"');
    expect(html).toContain('data-footer-section="site"');
    expect(html).toContain('data-footer-section="legal"');
    expect(html).toContain('data-footer-section="contact"');
    expect(html).toContain("Book a Call");
    expect(html).toContain('data-analytics-booking-cta="footer"');
    expect(html).not.toContain("Book a Lesson");
    expect(html).not.toContain("Get In Touch");
    expect(html).not.toContain('href="mailto:agathagurko@gmail.com"');
    expect(html).not.toContain('href="#"');
    expect(html).toContain("Impressum");
    expect(html).toContain("Privacy and Cookies");
    expect(html).toContain(siteContent.home.footerNote);
    expect(html).not.toContain('href="/online-flute-lessons-for-adults"');
    expect(html).not.toContain('href="/online-flute-lessons-for-children"');
    expect(html).toContain("© Agatha Gurko Music 2026");
  });

  it("renders the three responsive footer zones", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent} />,
    );

    expect(html).toContain('data-footer-zone="brand"');
    expect(html).toContain('data-footer-zone="links"');
    expect(html).toContain('data-footer-zone="meta"');
    expect(html).not.toContain('data-footer-section="bottom-spacer"');
  });

  it("renders the footer booking arrow inside its link", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent} />,
    );

    expect(html).toContain(
      'class="footer-book-link items-center gap-[var(--space-8)]"',
    );
    expect(html).toContain('src="/icons/arrow-up-right.svg"');
  });
});
