import {expect, test, type Page} from "playwright/test";

async function expectHealthyPage(page: Page) {
  await expect(page.locator("body")).not.toHaveText("");
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
}

function rectanglesIntersect(
  first: {x: number; y: number; width: number; height: number},
  second: {x: number; y: number; width: number; height: number},
) {
  return !(
    first.x + first.width <= second.x ||
    second.x + second.width <= first.x ||
    first.y + first.height <= second.y ||
    second.y + second.height <= first.y
  );
}

test("primary English routes render successfully with security headers", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const path of [
    "/",
    "/about",
    "/classes",
    "/media",
    "/book",
    "/online-flute-lessons-for-adults",
    "/online-flute-lessons-for-children",
  ]) {
    const response = await page.goto(path);

    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expectHealthyPage(page);
  }

  const response = await page.goto("/");
  expect(response?.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response?.headers()["referrer-policy"]).toBe(
    "strict-origin-when-cross-origin",
  );
  expect(pageErrors).toEqual([]);
});

test("home and audience pages expose their approved H1 and booking paths", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1:visible")).toHaveCount(1);
  await expect(page.locator("h1:visible")).toHaveText(
    "Flute & Music Teacher",
  );
  await expect(page.getByText("For Adults and Children", {exact: true})).toBeVisible();
  await expect(page).toHaveTitle(
    "Online Flute Lessons with Agatha Gurko | Agatha Music",
  );
  const homeCanonical = await page
    .locator('link[rel="canonical"]')
    .getAttribute("href");
  expect(new URL(homeCanonical!).pathname).toBe("/");
  const homeJsonLd = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(homeJsonLd.some((value) => value.includes('"@type":"Person"'))).toBe(
    true,
  );
  expect(
    homeJsonLd.some((value) => value.includes('"@type":"WebSite"')),
  ).toBe(true);

  for (const [path, heading] of [
    [
      "/online-flute-lessons-for-adults",
      "Private Online Flute Lessons for Adults",
    ],
    [
      "/online-flute-lessons-for-children",
      "Private Online Flute Lessons for Children",
    ],
  ] as const) {
    await page.goto(path);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    await expect(page.locator("h1:visible")).toHaveText(heading);
    await expect(page).toHaveTitle(
      `${heading.replace("Private ", "")} | Agatha Music`,
    );
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(new URL(canonical!).pathname).toBe(path);
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    expect(jsonLd.some((value) => value.includes('"@type":"Service"'))).toBe(
      true,
    );
    await expect(
      page.getByRole("link", {name: "Intro Call"}).first(),
    ).toHaveAttribute("href", "/book?type=intro");
  }
});

test("desktop header keeps its three links and booking action clear", async ({
  page,
}) => {
  for (const width of [861, 1280]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");

    const header = page.locator("header");
    const logo = header.getByRole("link", {name: "Home Agatha Music link"});
    const navigation = header.getByRole("navigation", {name: "Header Menu"});
    const booking = header.locator('a[href="/book?type=intro"]:visible');

    await expect(navigation.getByRole("link", {name: "About me"})).toBeVisible();
    await expect(navigation.getByRole("link", {name: "Classes"})).toBeVisible();
    await expect(navigation.getByRole("link", {name: "Media"})).toBeVisible();

    const [logoBox, navigationBox, bookingBox] = await Promise.all([
      logo.boundingBox(),
      navigation.boundingBox(),
      booking.boundingBox(),
    ]);
    expect(logoBox, `logo at ${width}px`).not.toBeNull();
    expect(navigationBox, `navigation at ${width}px`).not.toBeNull();
    expect(bookingBox, `booking at ${width}px`).not.toBeNull();
    expect(rectanglesIntersect(logoBox!, navigationBox!)).toBe(false);
    expect(rectanglesIntersect(navigationBox!, bookingBox!)).toBe(false);
  }
});

test("home header stays centered and keeps mono text readable while resizing", async ({
  page,
}) => {
  for (const width of [861, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");

    const headerSurface = page.locator("[data-header-surface]");
    const navigation = page.getByRole("navigation", {name: "Header Menu"});
    const booking = page.locator('header a[href="/book?type=intro"]:visible');
    const [surfaceBox, navigationBox] = await Promise.all([
      headerSurface.boundingBox(),
      navigation.boundingBox(),
    ]);

    expect(surfaceBox?.height, `header height at ${width}px`).toBeCloseTo(58, 0);
    expect(
      navigationBox!.y + navigationBox!.height / 2,
      `navigation center at ${width}px`,
    ).toBeCloseTo(surfaceBox!.y + surfaceBox!.height / 2, 0);
    expect(
      await booking.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
        };
      }),
    ).toEqual({
      fontSize: "14px",
      fontWeight: "400",
      letterSpacing: "-0.21px",
    });
  }

  await expect(page.locator('header img[src="/images/agatha-gurko-music.svg"]')).toBeVisible();
  await expect(
    page.locator("header").getByRole("link", {name: "Book Intro Call"}),
  ).toBeVisible();
  expect(
    await page
      .locator('footer [data-footer-section="site"] a')
      .first()
      .evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          letterSpacing: style.letterSpacing,
        };
      }),
  ).toEqual({
    fontSize: "14px",
    fontWeight: "400",
    letterSpacing: "-0.21px",
  });
});

test("home typography and audience buttons follow the current Figma contract", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/");

  const fontSize = async (selector: string) =>
    Number.parseFloat(
      await page
        .locator(selector)
        .evaluate((element) => getComputedStyle(element).fontSize),
    );

  expect(await fontSize(".plain-home-title")).toBeCloseTo(120, 1);
  expect(await fontSize(".plain-home-subtitle")).toBeCloseTo(32, 1);
  expect(await fontSize("[data-home-manifesto-heading]")).toBeCloseTo(62, 1);
  expect(await fontSize("[data-home-manifesto-copy]")).toBeCloseTo(28, 1);
  expect(await fontSize("[data-home-location-heading]")).toBeCloseTo(80, 1);
  expect(await fontSize("[data-home-location-copy]")).toBeCloseTo(28, 1);

  const fontFaces = await page.evaluate(() =>
    Array.from(document.styleSheets).flatMap((sheet) =>
      Array.from(sheet.cssRules)
        .filter((rule) => rule.type === CSSRule.FONT_FACE_RULE)
        .map((rule) => rule.cssText),
    ),
  );
  expect(
    fontFaces.some(
      (rule) =>
        rule.includes('font-family: "EB Garamond"') &&
        rule.includes("font-style: italic"),
    ),
  ).toBe(true);

  const copy = page.locator("[data-home-manifesto-copy]");
  const adults = page.getByRole("link", {name: "For adults"});
  const children = page.getByRole("link", {name: "For children"});
  const heroCta = page.getByRole("link", {name: "Get in Touch"}).first();

  await expect(copy).toHaveText(
    "Agatha teaches through small steps — helping students build confidence, sound and understanding.",
  );
  await adults.hover();
  await expect(copy).toHaveText(
    "Start from your first note, return after a break, or strengthen the playing you already have.",
  );
  await children.hover();
  await expect(copy).toHaveText(
    "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
  );

  await expect(adults).toHaveCSS("background-color", "rgb(246, 236, 218)");
  await adults.hover();
  await expect(adults).toHaveCSS("background-color", "rgb(92, 82, 76)");
  await expect(heroCta).toHaveCSS("background-color", "rgb(92, 82, 76)");
  await heroCta.hover();
  await expect(heroCta).toHaveCSS("background-color", "rgb(246, 236, 218)");
});

test("footer keeps its link cluster centered and stacks before columns overlap", async ({
  page,
}) => {
  for (const width of [1100, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");

    const footer = page.locator("footer");
    const brand = footer.locator('[data-footer-zone="brand"]');
    const links = footer.locator('[data-footer-zone="links"]');
    const meta = footer.locator('[data-footer-zone="meta"]');
    const copyright = meta.locator(".ag-footer-copyright");
    const note = meta.locator(".ag-footer-note");
    await expect(brand).toHaveCount(1);
    await expect(links).toHaveCount(1);
    await expect(meta).toHaveCount(1);

    const [
      brandBox,
      linksBox,
      metaBox,
      copyrightBox,
      noteBox,
      footerStyle,
    ] = await Promise.all([
      brand.boundingBox(),
      links.boundingBox(),
      meta.boundingBox(),
      copyright.boundingBox(),
      note.boundingBox(),
      footer.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          columnGap: style.columnGap,
          display: style.display,
          paddingBottom: Number.parseFloat(style.paddingBottom),
        };
      }),
    ]);

    expect(footerStyle.columnGap).toBe("24px");
    expect(footerStyle.display).toBe("grid");
    expect(footerStyle.paddingBottom).toBeGreaterThanOrEqual(100);
    expect(brandBox!.width).toBeCloseTo(metaBox!.width, 0);
    expect(linksBox!.x + linksBox!.width / 2).toBeCloseTo(width / 2, 0);
    expect(copyrightBox!.x).toBeCloseTo(noteBox!.x, 0);
    expect(rectanglesIntersect(brandBox!, linksBox!)).toBe(false);
    expect(rectanglesIntersect(linksBox!, metaBox!)).toBe(false);
  }

  await page.setViewportSize({width: 960, height: 900});
  await page.goto("/");

  const footer = page.locator("footer");
  const brand = footer.locator('[data-footer-zone="brand"]');
  const links = footer.locator('[data-footer-zone="links"]');
  const meta = footer.locator('[data-footer-zone="meta"]');
  await expect(footer.locator(".footer-desktop-only")).toBeHidden();
  const [brandBox, linksBox, metaBox] = await Promise.all([
    brand.boundingBox(),
    links.boundingBox(),
    meta.boundingBox(),
  ]);

  expect(linksBox!.y).toBeGreaterThan(brandBox!.y + brandBox!.height);
  expect(metaBox!.y).toBeGreaterThan(linksBox!.y + linksBox!.height);
  await expect(links).toHaveCSS("flex-direction", "column");
  expect(
    await footer.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingBottom),
    ),
  ).toBeGreaterThan(80);
});

test("desktop Classes menu previews lessons and keeps direct booking links", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/");

  const classesLink = page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  await classesLink.hover();

  const menu = page.getByRole("navigation", {name: "Classes submenu"});
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", {name: "All classes"})).toHaveAttribute(
    "href",
    "/classes",
  );
  await expect(
    menu.getByRole("link", {name: "Flute", exact: true}),
  ).toHaveAttribute("href", "/book?type=lesson&subject=Flute");
  await expect(menu.getByTestId("classes-menu-preview-title")).toHaveText(
    "Flute",
  );

  await menu.getByRole("link", {name: "Solfege", exact: true}).hover();
  await expect(menu.getByTestId("classes-menu-preview-title")).toHaveText(
    "Solfege",
  );
  await expect(menu.getByTestId("classes-menu-preview-image")).toHaveAttribute(
    "src",
    /ear-training/,
  );
  await expect(
    menu.getByRole("link", {name: "Solfege", exact: true}),
  ).toHaveAttribute("href", "/book?type=lesson&subject=Solfege");

  await menu.getByRole("link", {name: "Solfege", exact: true}).focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(classesLink).toBeFocused();
});

test("booking route selects the relevant event and remains switchable", async ({
  page,
}) => {
  await page.route("https://app.cal.com/**", (route) => route.abort());
  await page.goto("/book?type=intro");
  await expect(
    page.getByRole("heading", {name: "Book an intro call"}),
  ).toBeVisible();
  const bookingType = page.getByRole("navigation", {name: "Booking type"});
  await expect(
    bookingType.getByRole("link", {name: "Intro Call", exact: true}),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.locator('a[href*="cal.com/agafiia-gurko/intro-call"]'),
  ).toBeVisible();

  await page.goto("/book?type=lesson&subject=Piccolo");
  await expect(
    page.getByRole("heading", {name: "Book a music lesson"}),
  ).toBeVisible();
  await expect(page.getByTestId("selected-class")).toHaveText(
    "Selected class: Piccolo",
  );
  await expect(
    bookingType.getByRole("link", {name: "Music Lesson", exact: true}),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.locator('a[href*="cal.com/agafiia-gurko/music-lesson"]'),
  ).toBeVisible();

  await bookingType.getByRole("link", {name: "Intro Call", exact: true}).click();
  await expect(page).toHaveURL(/\/book\?type=intro$/);
  await expect(
    page.getByRole("heading", {name: "Book an intro call"}),
  ).toBeVisible();

  await page.goto("/book?type=unknown&subject=Flute");
  await expect(
    page.getByRole("heading", {name: "Book an intro call"}),
  ).toBeVisible();
});

test("analytics preferences do not cover the home booking action", async ({
  page,
}) => {
  await page.goto("/");

  const banner = page.getByRole("region", {name: "Analytics preferences"});
  const booking = page.getByRole("link", {name: "Get in Touch"}).first();
  const [bannerBox, bookingBox] = await Promise.all([
    banner.boundingBox(),
    booking.boundingBox(),
  ]);

  expect(bannerBox).not.toBeNull();
  expect(bookingBox).not.toBeNull();
  expect(bannerBox!.width).toBe(297);
  expect(bannerBox!.height).toBe(150);
  await expect(banner.getByRole("button", {name: "Okay"})).toBeVisible();
  expect(rectanglesIntersect(bannerBox!, bookingBox!)).toBe(false);
});

test("legacy English routes redirect only for the approved exact paths", async ({
  page,
}) => {
  for (const [source, destination] of [
    ["/en", "/"],
    ["/en/about", "/about"],
    ["/en/classes", "/classes"],
    ["/en/media", "/media"],
    ["/en/book", "/book"],
  ]) {
    const response = await page.request.get(source, {maxRedirects: 0});

    expect(response.status(), source).toBe(308);
    expect(
      new URL(response.headers()["location"], "http://127.0.0.1:3101")
        .pathname,
    ).toBe(destination);
  }
});

test("unapproved locale routes remain standard 404 responses", async ({page}) => {
  for (const path of ["/de", "/ru", "/en/unknown", "/de/book"]) {
    const response = await page.goto(path);

    expect(response?.status(), path).toBe(404);
    await expectHealthyPage(page);
  }
});

test("legal placeholders stay crawlable but noindex", async ({page}) => {
  for (const path of ["/impressum", "/datenschutz"]) {
    const response = await page.goto(path);

    expect(response?.status(), path).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
  }
});

test.describe("mobile navigation", () => {
  test.use({viewport: {width: 390, height: 844}});

  test("opens and closes without changing route contracts", async ({page}) => {
    await page.goto("/");
    await page.getByRole("button", {name: "Open Menu"}).click();

    await expect(page.getByRole("button", {name: "Close Menu"})).toBeVisible();
    await expect(
      page.getByRole("navigation", {name: "Header Menu"}).getByRole("link", {
        name: "About me",
      }),
    ).toHaveAttribute("href", "/about");
    await expect(
      page.getByRole("navigation", {name: "Header Menu"}).getByRole("link", {
        name: "Classes",
      }),
    ).toHaveAttribute("href", "/classes");
    await expect(
      page.getByRole("navigation", {name: "Header Menu"}).getByRole("link", {
        name: "Media",
      }),
    ).toHaveAttribute("href", "/media");

    await page.getByRole("button", {name: "Close Menu"}).click();
    await expect(page.getByRole("button", {name: "Open Menu"})).toBeVisible();
  });

  test("uses the same menu through tablet width", async ({page}) => {
    await page.setViewportSize({width: 768, height: 1024});
    await page.goto("/");
    await page.getByRole("button", {name: "Open Menu"}).click();

    await expect(
      page.getByRole("navigation", {name: "Header Menu"}).getByRole("link", {
        name: "Media",
      }),
    ).toBeVisible();
  });
});

test("video iframe loads only after explicit interaction", async ({page}) => {
  await page.goto("/media");
  await expect(page.locator("iframe")).toHaveCount(0);

  await page.getByRole("button", {name: "Watch preview"}).click();

  await expect(page.locator("iframe")).toHaveCount(1);
});

test("contact network failure is announced and remains retryable", async ({
  page,
}) => {
  await page.route("**/api/contact", (route) => route.abort("failed"));
  await page.goto("/about");
  await page.getByLabel("Name").fill("Test Student");
  await page.getByLabel("Email").fill("student@example.com");
  await page.getByLabel("Subject").fill("Flute lessons");
  await page
    .getByLabel("How did you find Agatha? (optional)")
    .selectOption("Google or another search engine");
  await page
    .getByLabel("Message")
    .fill("I would like to ask about a first flute lesson.");
  await page.getByRole("button", {name: "Send message"}).click();

  await expect(page.getByRole("status")).toContainText(
    "Something went wrong. Please try again or use the booking link.",
  );
  await expect(page.getByRole("button", {name: "Send message"})).toBeEnabled();
});
