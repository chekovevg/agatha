import {renderToStaticMarkup} from "react-dom/server";
import {readFileSync} from "node:fs";
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
  it("uses the Figma link groups and footer note", () => {
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
    expect(html).not.toContain("Book a lesson");
    expect(html).toContain("Get In Touch");
    expect(html).toContain('href="mailto:agathagurko@gmail.com"');
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

  it("keeps the footer booking arrow on the same line as the label", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent} />,
    );
    const css = readFileSync(
      new URL("../app/globals.css", import.meta.url),
      "utf8",
    );

    expect(html).toContain(
      'class="footer-book-link items-center gap-2"',
    );
    expect(html).toContain('src="/icons/arrow-up-right.svg"');
    expect(css).toContain(".ag-footer-link-list a.footer-book-link");
    expect(css).toContain("display: inline-flex;");
    expect(css).toContain("flex-wrap: nowrap;");
    expect(css).toContain("white-space: nowrap;");
    expect(css).toContain("width: max-content;");
    expect(css).toContain(".ag-footer-link-list a.footer-book-link img");
    expect(css).toContain("flex: 0 0 auto;");
  });
});
