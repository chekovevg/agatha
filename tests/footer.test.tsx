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
  it("uses the extended logo, three link columns, and footer note", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent.en} locale="en" />,
    );

    expect(html).toContain('src="/images/agatha-gurko-music.svg"');
    expect(html).toContain('alt="Agatha Gurko Music"');
    expect(html).toContain('data-footer-section="site"');
    expect(html).toContain('data-footer-section="social"');
    expect(html).toContain('data-footer-section="legal"');
    expect(html).toContain("Book a trial lesson");
    expect(html).toContain("Telegram");
    expect(html).toContain("WhatsApp");
    expect(html).toContain("Email");
    expect(html).toContain("Impressum");
    expect(html).toContain("Privacy &amp; Cookies");
    expect(html).toContain(siteContent.en.home.footerNote);
  });

  it("keeps the Microsoft AI footer grid contract on desktop and mobile", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent.en} locale="en" />,
    );

    expect(html).toContain(
      '<footer class="mx-auto mt-[calc(320*var(--unit-fx))] grid max-w-[calc(1660*var(--unit-fx))] grid-cols-[repeat(24,minmax(0,1fr))] gap-[calc(20*var(--unit-fx))] bg-[var(--background)] px-[calc(22*var(--unit-fx))] pb-[27px] font-ui text-[var(--ink)] max-[600px]:block max-[600px]:w-[calc(100%_-_calc(32*var(--unit-fx)))] max-[600px]:space-y-[calc(40*var(--unit-fx))] max-[600px]:px-0"',
    );
    expect(html).toContain('class="col-span-4"');
    expect(html).toContain('class="ag-footer-link-list col-start-8 col-span-2"');
    expect(html).toContain('class="ag-footer-link-list col-start-10 col-span-3"');
    expect(html).toContain('class="ag-footer-link-list col-start-13 col-span-4"');
    expect(html).toContain('class="col-start-20 col-span-5 max-[600px]:w-full"');
    expect(html).toContain('class="ag-footer-note text-[var(--ink)]"');
    expect(html).toContain('data-footer-section="bottom-spacer"');
    expect(html).toContain("ag-footer-bottom-spacer");
  });

  it("keeps the footer booking arrow on the same line as the label", () => {
    const html = renderToStaticMarkup(
      <Footer content={siteContent.en} locale="en" />,
    );
    const css = readFileSync(
      new URL("../app/globals.css", import.meta.url),
      "utf8",
    );

    expect(html).toContain(
      'class="footer-book-link items-center gap-[calc(10*var(--unit-fx))]"',
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
