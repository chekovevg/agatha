import {existsSync, readFileSync} from "node:fs";
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
import {ClassesMenu} from "@/components/layout/ClassesMenu";
import {AboutPage} from "@/components/pages/AboutPage";
import {ClassesPage} from "@/components/pages/ClassesPage";
import {BookingSection} from "@/components/sections/BookingSection";
import {siteContent} from "@/content/site";
import {env} from "@/lib/env";

describe("editorial site structure", () => {
  it("uses Agatha Music as the public brand", () => {
    expect(siteContent.brand).toBe("Agatha Music");
  });

  it("uses a single English content object with no locale keys", () => {
    expect(siteContent).not.toHaveProperty("en");
    expect(siteContent).not.toHaveProperty("de");
    expect(siteContent).not.toHaveProperty("ru");
  });

  it("offers only the intro call and music lesson", () => {
    expect(siteContent.booking.eventTypes).toEqual([
      {
        mode: "intro",
        title: "Intro Call",
        duration: "15 min",
        description: "A short first conversation about goals and lesson format.",
      },
      {
        mode: "lesson",
        title: "Music Lesson",
        duration: "50 min",
        description:
          "Online lessons in flute, recorder, piccolo, music theory or solfege.",
      },
    ]);
  });

  it("offers the approved five-class catalog in display order", () => {
    expect(
      siteContent.lessons.map(({slug, title}) => ({slug, title})),
    ).toEqual([
      {slug: "flute", title: "Flute"},
      {slug: "recorder", title: "Recorder"},
      {slug: "piccolo", title: "Piccolo"},
      {slug: "music-theory", title: "Music Theory"},
      {slug: "solfege", title: "Solfege"},
    ]);
  });

  it("uses the new editorial top-level navigation", () => {
    expect(siteContent.nav).toEqual([
      {label: "About me", href: "/about"},
      {label: "Classes", href: "/classes"},
      {label: "Media", href: "/media"},
    ]);
  });

  it("keeps only the compact Home audience tab content", () => {
    expect(siteContent.home.audienceTabs).toEqual({
      adults: {
        label: "For adults",
        description:
          "Start from your first note, return after a break, or strengthen the playing you already have.",
      },
      children: {
        label: "For children",
        description:
          "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
      },
    });
    expect(siteContent).not.toHaveProperty("audienceLessons");
  });

  it("keeps the Classes disclosure mobile-only", () => {
    const html = renderToStaticMarkup(
      createElement(ClassesMenu, {
        intro: siteContent.pages.classes.heading,
        lessons: siteContent.lessons,
        onNavigate: () => undefined,
      }),
    );

    expect(html).toContain('href="/classes"');
    expect(html).toContain(">Classes</a>");
    expect(html.match(/aria-label="Classes menu"/g)).toHaveLength(1);
    expect(html).toContain('class="classes-menu-link classes-menu-link-desktop"');
    expect(html).toContain('aria-haspopup="true"');
    expect(html).not.toContain("classes-menu-disclosure-desktop");
    expect(html).toContain('aria-controls="classes-menu-desktop"');
    expect(html).toContain('aria-controls="classes-menu-mobile"');
    expect(html).toContain('id="classes-menu-desktop"');
    expect(html).toContain('id="classes-menu-mobile"');
    expect(html).toContain('aria-expanded="false"');
  });

  it("renders one consistent booking action for each approved class", () => {
    const html = renderToStaticMarkup(
      createElement(ClassesPage, {content: siteContent}),
    );

    expect(html.match(/>Music lesson</g)).toHaveLength(5);
    expect(html.match(/>Book a lesson</g)).toHaveLength(5);
    expect(html).toContain(
      'href="/book?type=lesson&amp;subject=Flute"',
    );
    expect(html).toContain(
      'href="/book?type=lesson&amp;subject=Solfege"',
    );
    expect(html).not.toContain("Music History");
    expect(html).not.toContain("For adults");
    expect(html).not.toContain("For children");
  });

  it("publishes only unprefixed English application URLs", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname);

    expect(paths).toEqual([
      "/",
      "/book",
      "/classes",
      "/about",
      "/media",
    ]);
    expect(sitemap().every((entry) => entry.lastModified == null)).toBe(true);
  });

  it("defines unprefixed pages and removes locale routes and redirects", () => {
    const root = new URL("..", import.meta.url);

    for (const path of [
      "app/page.tsx",
      "app/about/page.tsx",
      "app/classes/page.tsx",
      "app/media/page.tsx",
      "app/book/page.tsx",
    ]) {
      expect(existsSync(new URL(path, root))).toBe(true);
    }

    for (const path of [
      "app/online-flute-lessons-for-adults/page.tsx",
      "app/online-flute-lessons-for-children/page.tsx",
      "components/pages/AudienceLessonPage.tsx",
    ]) {
      expect(existsSync(new URL(path, root))).toBe(false);
    }

    expect(existsSync(new URL("app/[locale]", root))).toBe(false);
    expect(existsSync(new URL("proxy.ts", root))).toBe(false);
  });

  it("removes the localization runtime", () => {
    const root = new URL("..", import.meta.url);
    const packageJson = JSON.parse(
      readFileSync(new URL("package.json", root), "utf8"),
    ) as {dependencies?: Record<string, string>};
    const nextConfig = readFileSync(new URL("next.config.ts", root), "utf8");

    expect(packageJson.dependencies).not.toHaveProperty("next-intl");
    expect(nextConfig).not.toContain("next-intl");
    expect(existsSync(new URL("i18n", root))).toBe(false);
    expect(existsSync(new URL("messages", root))).toBe(false);
  });

  it("renders the Cal inline embed with an immediate direct booking path", () => {
    const previousCalLink = env.NEXT_PUBLIC_CAL_LINK;
    env.NEXT_PUBLIC_CAL_LINK = "https://cal.com/agatha/trial";

    try {
      const html = renderToStaticMarkup(
        createElement(BookingSection, {
          content: siteContent,
          expanded: true,
          mode: "intro",
        }),
      );

      expect(html).toContain('id="agatha-cal-inline"');
      expect(html).toContain('<h1 class="sr-only">Book a Call</h1>');
      expect(html).toContain('aria-label="Booking type"');
      expect(html).toContain('aria-current="page"');
      expect(html).toContain('href="/book?type=intro"');
      expect(html).toContain('href="/book?type=lesson"');
      expect(html).toContain('aria-label="Book an intro call with Agatha"');
      expect(html).toContain('href="https://cal.com/agatha/trial"');
      expect(html).toContain('target="_blank"');
      expect(html).toContain('rel="noreferrer"');
      expect(html).toContain("Open booking page in Cal.com");
      expect(html).not.toContain("Choose the next step");
      expect(html).not.toContain("<iframe");
    } finally {
      env.NEXT_PUBLIC_CAL_LINK = previousCalLink;
    }
  });

  it("switches booking copy, subject, URL, and Cal event for a music lesson", () => {
    const previousCalLink = env.NEXT_PUBLIC_CAL_LINK;
    const previousLessonLink = env.NEXT_PUBLIC_CAL_LESSON_LINK;
    env.NEXT_PUBLIC_CAL_LINK = "https://cal.com/agatha/intro-call";
    env.NEXT_PUBLIC_CAL_LESSON_LINK = "https://cal.com/agatha/music-lesson";

    try {
      const html = renderToStaticMarkup(
        createElement(BookingSection, {
          content: siteContent,
          expanded: true,
          mode: "lesson",
          subject: "Flute",
        }),
      );

      expect(html).toContain('<h1 class="sr-only">Book a Call</h1>');
      expect(html).toContain("Flute");
      expect(html).toContain('aria-label="Book a music lesson with Agatha"');
      expect(html).toContain(
        'href="https://cal.com/agatha/music-lesson?notes=Class%3A+Flute"',
      );
      expect(html).toContain('href="/book?type=intro"');
      expect(html).toContain('aria-current="page"');
      expect(html).not.toContain("Keep progressing");
      expect(html).not.toContain('href="https://cal.com/agatha/intro-call"');
    } finally {
      env.NEXT_PUBLIC_CAL_LINK = previousCalLink;
      env.NEXT_PUBLIC_CAL_LESSON_LINK = previousLessonLink;
    }
  });

  it("uses Cal's official loader and only the current booking-success event", () => {
    const embedUrl = new URL(
      "components/analytics/CalBookingEmbed.tsx",
      new URL("..", import.meta.url),
    );

    expect(existsSync(embedUrl)).toBe(true);
    if (!existsSync(embedUrl)) return;

    const embedSource = readFileSync(embedUrl, "utf8");
    expect(embedSource).toContain("https://app.cal.com/embed/embed.js");
    expect(embedSource).toContain('action: "linkReady"');
    expect(embedSource).toContain('action: "bookerReady"');
    expect(embedSource).toContain('action: "linkFailed"');
    expect(embedSource).toContain('action: "bookingSuccessfulV2"');
    expect(embedSource).not.toContain('action: "bookingSuccessful"');
  });

  it("ignores reproducible local QA artifacts", () => {
    const gitignore = readFileSync(
      new URL("../.gitignore", import.meta.url),
      "utf8",
    );

    expect(gitignore).toContain("/next-*.log");
    expect(gitignore).toContain("/*-debug-*.png");
    expect(gitignore).toContain("/playwright-report/");
    expect(gitignore).toContain("/test-results/");
  });

  it("defines CI for the same checks used locally", () => {
    const workflowUrl = new URL(
      "../.github/workflows/ci.yml",
      import.meta.url,
    );

    expect(existsSync(workflowUrl)).toBe(true);

    const workflow = readFileSync(workflowUrl, "utf8");
    expect(workflow).toContain("actions/checkout@v4");
    expect(workflow).toContain("actions/setup-node@v4");
    expect(workflow).toContain("node-version: 20");
    expect(workflow).toContain("npm ci");
    expect(workflow).toContain("npm run check");
    expect(workflow).toContain("playwright install --with-deps chromium");
    expect(workflow).toContain("npm run e2e:run");
  });

  it("uses the about profile title and contact label from the approved design", () => {
    expect(siteContent.about.heading).toBe("Agatha Gurko");
    expect(siteContent.cta.contact).toBe("Book a Call");
  });

  it("uses German diacritics in visible education and location copy", () => {
    const englishAbout = JSON.stringify(siteContent.about);

    expect(siteContent.home.location.body).toContain(
      "Cologne–Düsseldorf area",
    );
    expect(siteContent.about.paragraphs.join("\n")).toContain(
      "Hochschule für Musik und Tanz Köln",
    );
    expect(siteContent.about.facts[0]?.values.join("\n")).toContain(
      "Instrumental-/Gesangspädagogik",
    );
    expect(englishAbout).not.toMatch(/fuer|Koeln|Gesangspaedagogik/);
    expect(siteContent.home.location.body).not.toContain(
      "Cologne-Duesseldorf",
    );
  });

  it("renders the about page with the high-quality portrait asset", () => {
    const html = renderToStaticMarkup(
      createElement(AboutPage, {content: siteContent}),
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

  it("renders only the approved age and class pickers in the contact form", () => {
    const html = renderToStaticMarkup(
      createElement(AboutPage, {content: siteContent}),
    );

    for (const option of [
      "Adult",
      "Child (7–14)",
      "Flute",
      "Recorder",
      "Piccolo",
      "Music Theory",
      "Solfege",
    ]) {
      expect(html).toContain(`<option value="${option}">${option}</option>`);
    }
    expect(html).not.toContain("Preferred language");
    expect(html).not.toContain("How did you find Agatha?");
  });

  it("links booking fallback contact CTA to the unprefixed contact form", () => {
    const previousCalLink = env.NEXT_PUBLIC_CAL_LINK;
    Object.assign(env, {NEXT_PUBLIC_CAL_LINK: undefined});

    try {
      const html = renderToStaticMarkup(
        createElement(BookingSection, {
          content: siteContent,
          expanded: true,
          mode: "intro",
        }),
      );

      expect(html).toContain("Booking link pending");
      expect(html).toContain('href="/about#contact"');
      expect(html).not.toMatch(/href="\/(en|de|ru)\//);
      expect(html).not.toContain('href="#contact"');
    } finally {
      Object.assign(env, {NEXT_PUBLIC_CAL_LINK: previousCalLink});
    }
  });
});
