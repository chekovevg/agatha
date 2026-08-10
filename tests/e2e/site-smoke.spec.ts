import {expect, test, type Locator, type Page} from "playwright/test";

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

async function readTypography(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      fontFamily: style.fontFamily,
      fontSize: Number.parseFloat(style.fontSize),
      fontWeight: style.fontWeight,
      letterSpacing:
        style.letterSpacing === "normal"
          ? 0
          : Number.parseFloat(style.letterSpacing),
      lineHeight: Number.parseFloat(style.lineHeight),
    };
  });
}

test("assigns the requested artwork to each color scheme", async ({page}) => {
  await page.goto("/");

  await expect(
    page.locator(
      'link[rel="icon"][media="(prefers-color-scheme: light)"]',
    ),
  ).toHaveAttribute("href", "/favicon-dark.svg");
  await expect(
    page.locator(
      'link[rel="icon"][media="(prefers-color-scheme: dark)"]',
    ),
  ).toHaveAttribute("href", "/favicon-light.svg");
});

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

test("home exposes its approved H1, metadata, and booking path", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("h1:visible")).toHaveCount(1);
  await expect(page.locator("h1:visible")).toHaveText(
    "Flute & Music Teacher",
  );
  await expect(
    page.locator(".plain-home-hero").getByRole("tablist", {
      name: "Lesson audience",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("For Adults and Children", {exact: true}),
  ).toHaveCount(0);
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
  await expect(
    page.getByRole("link", {name: "Book a Call"}).first(),
  ).toHaveAttribute("href", "/book?type=intro");
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
    const bookingTypography = await readTypography(booking);
    expect(bookingTypography.fontFamily).toContain("Red Hat Mono");
    expect(bookingTypography.fontSize).toBeGreaterThanOrEqual(10);
  }

  await expect(page.locator('header img[src="/images/agatha-gurko-music.svg"]')).toBeVisible();
  await expect(
    page.locator("header").getByRole("link", {name: "Book a Call"}),
  ).toBeVisible();
  expect(
    (await readTypography(
      page.locator('footer [data-footer-section="site"] a').first(),
    )).fontFamily,
  ).toContain("Red Hat Mono");
});

test("header and Classes menu animate one panel instead of revealing a pre-frame", async ({
  page,
}) => {
  const headerSurface = page.locator("[data-header-surface]");

  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/");
  await page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true})
    .hover();

  const menuPanel = page.locator(".classes-menu-panel");
  const menuShell = page.locator(".classes-menu-shell");
  await expect(menuPanel).toBeVisible();
  const [headerShadow, menuShadow, menuFilter] = await Promise.all([
    headerSurface.evaluate((element) => getComputedStyle(element).boxShadow),
    menuPanel.evaluate((element) => getComputedStyle(element).boxShadow),
    menuShell.evaluate((element) => getComputedStyle(element).filter),
  ]);
  expect(headerShadow).toContain("rgba(0, 0, 0, 0.12) 0px 3px 100px 8px");
  expect(menuShadow).toBe("none");
  expect(menuFilter).toContain("drop-shadow");
  expect(
    await menuPanel.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        clipPath: style.clipPath,
        transitionProperty: style.transitionProperty,
      };
    }),
  ).toEqual(
    expect.objectContaining({
      transitionProperty: expect.stringContaining("clip-path"),
    }),
  );
  await expect(menuPanel.locator(".classes-menu-content")).toHaveCSS(
    "clip-path",
    "none",
  );

  await page.setViewportSize({width: 390, height: 844});
  await expect(headerSurface).toHaveCSS("box-shadow", "none");
});

test("editorial text uses Newsreader Regular and headings use EB Garamond Regular", async ({
  page,
}) => {
  await page.setViewportSize({width: 1728, height: 1000});
  await page.goto("/classes");

  const copy = await readTypography(page.locator(".mai-body").first());
  const heading = await readTypography(page.locator(".mai-h4").first());

  expect(copy.fontFamily).toContain("Newsreader");
  expect(copy.fontWeight).toBe("400");
  expect(heading.fontFamily).toContain("EB Garamond");
  expect(heading.fontWeight).toBe("400");
});

test("home display flows directly into the audience tabs", async ({
  page,
}) => {
  const cases = [
    {width: 390, displayTabsGap: 12.13},
    {width: 1440, displayTabsGap: 31.25},
    {width: 1728, displayTabsGap: 37.5},
  ];

  for (const expected of cases) {
    await page.setViewportSize({width: expected.width, height: 1000});
    await page.goto("/");

    const gaps = await page.evaluate(() => {
      const gapBetween = (first: Element, second: Element) => {
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        return secondRect.top - firstRect.bottom;
      };
      const display = document.querySelector(".plain-home-title");
      const tabs = document.querySelector(".plain-home-hero [role=tablist]");
      if (!display || !tabs) {
        throw new Error("Expected Home display and audience tabs");
      }
      return {
        displayTabsGap: gapBetween(display, tabs),
      };
    });

    expect(gaps.displayTabsGap).toBeCloseTo(expected.displayTabsGap, 1);
    await expect(page.locator(".plain-home-subtitle")).toHaveCount(0);
    await expect(
      page.locator('[data-analytics-booking-cta="home-hero"]'),
    ).toHaveCount(0);
  }
});

test("home spacing roles resolve from the shared scale", async ({page}) => {
  for (const width of [390, 768, 1224, 1728]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/");
    await expect(page.locator(".home-location-copy-stack img")).toBeVisible();

    const gaps = await page.evaluate(() => {
      const gapBetween = (firstSelector: string, secondSelector: string) => {
        const first = document.querySelector(firstSelector);
        const second = document.querySelector(secondSelector);
        if (!first || !second) {
          throw new Error(
            `Expected spacing nodes: ${firstSelector}, ${secondSelector}`,
          );
        }
        const firstRect = first.getBoundingClientRect();
        const secondRect = second.getBoundingClientRect();
        return secondRect.top - firstRect.bottom;
      };

      return {
        displayTabs: gapBetween(
          ".plain-home-title",
          ".plain-home-hero [role=tablist]",
        ),
        controlDescription: gapBetween(
          '[role="tablist"]',
          "[data-home-manifesto-copy]",
        ),
        descriptionAction: gapBetween(
          "[data-home-manifesto-copy]",
          '[data-analytics-booking-cta="home-audience"]',
        ),
        sectionTransition: gapBetween(
          '[data-analytics-booking-cta="home-audience"]',
          "[data-home-location-heading]",
        ),
      };
    });

    const scale = width <= 600 ? width / 402 : Math.min(width / 1728, 1);
    const expected = {
      displayTabs: (width <= 600 ? 12.5 : 37.5) * scale,
      controlDescription: 30 * scale,
      descriptionAction: (width <= 600 ? 40 : 50) * scale,
      sectionTransition: (width <= 600 ? 190 : 250) * scale,
    };

    for (const [role, value] of Object.entries(expected)) {
      expect(gaps[role as keyof typeof gaps], `${role} at ${width}px`).toBeCloseTo(
        value,
        1,
      );
    }
  }
});

test("text selection uses the reference paper color", async ({page}) => {
  await page.goto("/");
  const selection = await page.locator("body").evaluate((element) =>
    getComputedStyle(element, "::selection").backgroundColor,
  );
  expect(selection).toBe("rgb(245, 238, 224)");
});

test("home audience tabs switch their panel without navigation", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/");

  const panel = page.getByRole("tabpanel");
  const adults = page.getByRole("tab", {name: "For adults"});
  const children = page.getByRole("tab", {name: "For children"});
  const audienceCta = page.locator(
    '[data-analytics-booking-cta="home-audience"]',
  );

  await expect(adults).toHaveAttribute("aria-selected", "true");
  await expect(panel).toHaveText(
    "Start from your first note, return after a break, or strengthen the playing you already have.",
  );
  await children.hover();
  await expect(panel).toHaveText(
    "Start from your first note, return after a break, or strengthen the playing you already have.",
  );

  await children.click();
  await expect(children).toHaveAttribute("aria-selected", "true");
  await expect(panel).toHaveText(
    "Clear musical foundations, age-appropriate goals and practical guidance for the time between lessons.",
  );
  await expect(page).toHaveURL(/\/$/);

  await children.press("ArrowLeft");
  await expect(adults).toBeFocused();
  await expect(adults).toHaveAttribute("aria-selected", "true");
  await expect(panel).toHaveText(
    "Start from your first note, return after a break, or strengthen the playing you already have.",
  );

  await adults.press("End");
  await expect(children).toBeFocused();
  await expect(children).toHaveAttribute("aria-selected", "true");
  await children.press("Home");
  await expect(adults).toBeFocused();
  await expect(adults).toHaveAttribute("aria-selected", "true");

  await expect(audienceCta).toHaveAttribute("href", "/book?type=intro");
  await expect(audienceCta).toHaveClass(/split-link-button/);

  for (const width of [390, 768, 1224, 1728]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/");

    const responsiveAdults = page.getByRole("tab", {name: "For adults"});
    const responsiveChildren = page.getByRole("tab", {name: "For children"});
    const responsivePanel = page.getByRole("tabpanel");
    const responsiveCta = page.locator(
      '[data-analytics-booking-cta="home-audience"]',
    );
    const [adultsBox, childrenBox, panelOverflow, ctaBox] = await Promise.all([
      responsiveAdults.boundingBox(),
      responsiveChildren.boundingBox(),
      responsivePanel.evaluate((element) => ({
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      })),
      responsiveCta.boundingBox(),
    ]);

    expect(adultsBox, `adult tab at ${width}px`).not.toBeNull();
    expect(childrenBox, `child tab at ${width}px`).not.toBeNull();
    expect(ctaBox, `booking CTA at ${width}px`).not.toBeNull();
    expect(
      adultsBox!.x + adultsBox!.width,
      `audience tabs overlap at ${width}px`,
    ).toBeLessThanOrEqual(childrenBox!.x + 0.5);
    expect(panelOverflow.scrollHeight).toBeLessThanOrEqual(
      panelOverflow.clientHeight + 1,
    );
  }
});

test("footer keeps its link cluster centered and stacks before columns overlap", async ({
  page,
}) => {
  for (const width of [1100, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/");

    const footer = page.locator("footer");
    await expect(
      footer.getByRole("link", {name: "Get In Touch", exact: true}),
    ).toHaveCount(0);
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

    expect(Number.parseFloat(footerStyle.columnGap)).toBeCloseTo(
      24 * (width / 1728),
      1,
    );
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

test("footer uses line-height rhythm on mobile and preserves desktop spacing", async ({
  page,
}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/classes");

  const footer = page.locator("footer");
  const siteLinks = footer.locator('[data-footer-section="site"]');
  const firstLink = siteLinks.getByRole("link").nth(0);
  const secondLink = siteLinks.getByRole("link").nth(1);
  const [firstBox, secondBox, lineHeight] = await Promise.all([
    firstLink.boundingBox(),
    secondLink.boundingBox(),
    firstLink.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).lineHeight),
    ),
  ]);

  expect(secondBox!.y - firstBox!.y).toBeCloseTo(lineHeight, 1);
  await expect(siteLinks).toHaveCSS("row-gap", "0px");
  expect(
    await footer
      .locator('[data-footer-zone="links"]')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).rowGap)),
  ).toBeCloseTo(48 * (390 / 402), 1);

  await page.setViewportSize({width: 1440, height: 900});
  await page.goto("/classes");
  expect(
    await page
      .locator('footer [data-footer-section="site"]')
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).rowGap)),
  ).toBeCloseTo(16 * (1440 / 1728), 1);
});

test("desktop Classes menu remains open while the pointer crosses the header gap", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/");

  const classesLink = page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  await classesLink.hover();

  const menu = page.getByRole("navigation", {
    name: "Desktop Classes submenu",
  });
  await expect(menu).toBeVisible();

  const [classesItemBox, menuBox] = await Promise.all([
    classesLink.locator("xpath=..").boundingBox(),
    menu.boundingBox(),
  ]);
  expect(classesItemBox).not.toBeNull();
  expect(menuBox).not.toBeNull();
  await page.mouse.move(
    menuBox!.x + menuBox!.width / 2,
    classesItemBox!.y + classesItemBox!.height + 4,
    {steps: 8},
  );
  await page.waitForTimeout(100);
  await expect(menu).toBeVisible();

  await menu.getByRole("link", {name: "Flute", exact: true}).hover();
  await page.waitForTimeout(100);
  await expect(menu).toBeVisible();
});

test("desktop Classes opens on hover without a visible disclosure control", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/classes");

  const classesLink = page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  const disclosure = page.getByRole("button", {name: "Classes menu"});
  const menu = page.getByRole("navigation", {
    name: "Desktop Classes submenu",
  });

  await expect(disclosure).toBeHidden();
  await classesLink.hover();
  await expect(classesLink).toHaveAttribute("aria-expanded", "true");
  await expect(menu).toBeVisible();
});

test("desktop Classes menu previews lessons and booking targets", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/");

  const classesLink = page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  await classesLink.hover();

  const menu = page.getByRole("navigation", {
    name: "Desktop Classes submenu",
  });
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", {name: "All classes"})).toHaveAttribute(
    "href",
    "/classes",
  );
  await expect(
    menu.getByRole("link", {name: "Flute", exact: true}),
  ).toHaveAttribute("href", "/book?type=lesson&subject=Flute");
  expect(
    await menu
      .getByRole("link", {name: "Flute", exact: true})
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain("Red Hat Mono");
  const menuDescription = menu.getByText(
    "Discover and choose what you want to learn",
    {exact: true},
  );
  expect(
    await menuDescription
      .locator("..")
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).rowGap)),
  ).toBeCloseTo(20 * (1440 / 1728), 1);
  expect(
    await menuDescription.evaluate(
      (element) => element.scrollWidth <= element.clientWidth,
    ),
  ).toBe(true);
  await expect(menu.getByTestId("classes-menu-preview-title")).toHaveText(
    "Flute",
  );
  const previewDescription = menu.getByText(
    "Build a clear tone, healthy breathing and relaxed posture from the very beginning. We work with sound, technique, hands, embouchure and musical expression step by step.",
    {exact: true},
  );
  expect(
    await previewDescription
      .locator("..")
      .evaluate((element) => Number.parseFloat(getComputedStyle(element).rowGap)),
  ).toBeCloseTo(20 * (1440 / 1728), 1);

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
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/book?type=intro");
  await expect(
    page.getByRole("heading", {name: "Book a Call", exact: true}),
  ).toHaveClass(/sr-only/);
  const bookingType = page.getByRole("navigation", {name: "Booking type"});
  await expect(bookingType).toHaveAttribute("data-overflow", "false");
  expect(
    await bookingType.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingTop),
    ),
  ).toBeCloseTo(10 * (1440 / 1728), 1);
  await expect(
    bookingType.getByRole("link", {name: "Intro Call", exact: true}),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    bookingType.getByRole("link", {name: "Intro Call", exact: true}),
  ).toHaveCSS("height", "39.2188px");
  const introTab = bookingType.getByRole("link", {
    name: "Intro Call",
    exact: true,
  });
  const lessonTab = bookingType.getByRole("link", {
    name: "Music Lesson",
    exact: true,
  });
  const tabTypography = await readTypography(introTab);
  expect(tabTypography.fontSize).toBeCloseTo(14.22, 1);
  expect(tabTypography.fontWeight).toBe("500");
  expect(tabTypography.letterSpacing).toBeCloseTo(-0.2133, 2);
  expect(tabTypography.lineHeight / tabTypography.fontSize).toBeCloseTo(1, 1);
  const desktopScale = 1440 / 1728;
  expect(
    await bookingType.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).height),
    ),
  ).toBeCloseTo(39.21875 + 2 * 10 * desktopScale, 1);
  for (const tab of [introTab, lessonTab]) {
    const padding = await tab.evaluate((element) => {
      const style = getComputedStyle(element);
      return [
        Number.parseFloat(style.paddingLeft),
        Number.parseFloat(style.paddingRight),
      ];
    });
    expect(padding[0]).toBeCloseTo(24 * desktopScale, 1);
    expect(padding[1]).toBeCloseTo(24 * desktopScale, 1);
  }
  await lessonTab.hover();
  await expect(lessonTab).toHaveCSS("background-color", "rgb(254, 249, 238)");
  expect(
    await bookingType
      .getByRole("link", {name: "Intro Call", exact: true})
      .evaluate((element) => getComputedStyle(element).fontFamily),
  ).toContain("Red Hat Mono");
  const bookingDescription = page.getByTestId("booking-description");
  await expect(bookingDescription).toHaveCSS("font-size", "28px");
  expect(
    await bookingDescription.evaluate(
      (element) => getComputedStyle(element).fontFamily,
    ),
  ).toContain("Newsreader");
  await expect(page.getByText("Choose the next step", {exact: true})).toHaveCount(
    0,
  );
  await expect(
    page.locator('a[href*="cal.com/agafiia-gurko/intro-call"]'),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", {name: "Open booking page in Cal.com"}),
  ).toHaveAttribute("target", "_blank");

  await page.goto("/book?type=lesson&subject=Piccolo");
  await expect(
    page.getByRole("heading", {name: "Book a Call", exact: true}),
  ).toHaveClass(/sr-only/);
  await expect(page.getByTestId("selected-class")).toHaveText(
    "Selected class: Piccolo",
  );
  await expect(
    bookingType.getByRole("link", {name: "Music Lesson", exact: true}),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.locator('a[href*="cal.com/agafiia-gurko/music-lesson"]'),
  ).toHaveCount(1);

  await bookingType.getByRole("link", {name: "Intro Call", exact: true}).click();
  await expect(page).toHaveURL(/\/book\?type=intro$/);
  await expect(
    page.getByRole("heading", {name: "Book a Call", exact: true}),
  ).toHaveClass(/sr-only/);

  await page.goto("/book?type=unknown&subject=Flute");
  await expect(
    page.getByRole("heading", {name: "Book a Call", exact: true}),
  ).toHaveClass(/sr-only/);

  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/book?type=intro");
  const mobileBookingType = page.getByRole("navigation", {
    name: "Booking type",
  });
  const mobileBookingBox = await mobileBookingType.boundingBox();
  expect(mobileBookingBox!.width).toBeLessThan(366);
  expect(mobileBookingBox!.height).toBeCloseTo(54.66, 1);
  expect(
    await mobileBookingType.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).paddingTop),
    ),
  ).toBeCloseTo(12 * (390 / 402), 2);
  await expect(
    mobileBookingType.getByRole("link", {name: "Intro Call", exact: true}),
  ).toHaveCSS("height", "31.375px");
  await expect(page.getByTestId("booking-description")).toHaveCSS(
    "font-size",
    "18px",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);

  await page.emulateMedia({reducedMotion: "reduce"});
  await page.setViewportSize({width: 180, height: 844});
  await page.goto("/book?type=lesson&subject=Flute");
  const narrowBookingType = page.getByRole("navigation", {
    name: "Booking type",
  });
  await expect(narrowBookingType).toHaveAttribute("data-overflow", "true");
  expect(
    await narrowBookingType.evaluate(
      (element) => element.scrollWidth > element.clientWidth,
    ),
  ).toBe(true);
  expect(await narrowBookingType.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
});

test("about FAQ and contact content share the profile text axis", async ({
  page,
}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto("/about");

  const profileHeading = page.getByRole("heading", {name: "Agatha Gurko"});
  const faqHeading = page.getByRole("heading", {
    name: "Questions before the first lesson",
  });
  const contactHeading = page.getByRole("heading", {name: "Get in touch"});
  const contactForm = page.locator("#contact form");
  const [profileBox, faqBox, contactBox, formBox] = await Promise.all([
    profileHeading.boundingBox(),
    faqHeading.boundingBox(),
    contactHeading.boundingBox(),
    contactForm.boundingBox(),
  ]);

  expect(faqBox!.x).toBeCloseTo(profileBox!.x, 0);
  expect(contactBox!.x).toBeCloseTo(profileBox!.x, 0);
  expect(formBox!.x).toBeCloseTo(profileBox!.x, 0);
  expect(faqBox!.y).toBeLessThan(
    (await page.getByText("Do you teach complete beginners?").boundingBox())!.y,
  );
  expect(contactBox!.y).toBeLessThan(formBox!.y);

  await page.setViewportSize({width: 390, height: 844});
  const mobileFormBox = await page.locator("#contact form").boundingBox();
  expect(mobileFormBox!.width).toBeLessThanOrEqual(346);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    ),
  ).toBeLessThanOrEqual(0);
});

test("analytics preferences do not cover the home booking action", async ({
  page,
}) => {
  await page.goto("/");

  const banner = page.getByRole("region", {name: "Analytics preferences"});
  const booking = page.locator(
    '[data-analytics-booking-cta="home-audience"]',
  );
  const [bannerBox, bookingBox] = await Promise.all([
    banner.boundingBox(),
    booking.boundingBox(),
  ]);

  expect(bannerBox).not.toBeNull();
  expect(bookingBox).not.toBeNull();
  expect(bannerBox!.width).toBe(297);
  expect(bannerBox!.height).toBe(150);
  const okay = banner.getByRole("button", {name: "Okay"});
  await expect(okay).toBeVisible();
  await expect(okay).toHaveCSS("cursor", "pointer");
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

test("removed and unapproved routes remain standard 404 responses", async ({
  page,
}) => {
  for (const path of [
    "/de",
    "/ru",
    "/en/unknown",
    "/de/book",
    "/online-flute-lessons-for-adults",
    "/online-flute-lessons-for-children",
  ]) {
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

  test("keeps one booking CTA and pins only the brand meta to the menu bottom", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", {name: "Open Menu"}).click();

    const menu = page.getByRole("navigation", {name: "Header Menu"});
    await expect(menu.getByRole("link", {name: "Book a Call"})).toHaveCount(1);
    for (const duplicate of [
      "Get In Touch",
      "Book Intro Call",
      "Impressum",
      "Privacy and Cookies",
    ]) {
      await expect(
        menu.getByRole("link", {name: duplicate, exact: true}),
      ).toHaveCount(0);
    }

    const copyright = menu.getByText(/Agatha Gurko Music 2026/);
    const note = menu.getByText(
      "Flute, recorder and music theory lessons online.",
    );
    const booking = menu.getByRole("link", {name: "Book a Call"});
    await expect(copyright).toBeVisible();
    await expect(note).toBeVisible();

    const [menuBox, bookingBox, copyrightBox, noteBox] = await Promise.all([
      menu.boundingBox(),
      booking.boundingBox(),
      copyright.boundingBox(),
      note.boundingBox(),
    ]);
    expect(bookingBox!.y).toBeLessThan(copyrightBox!.y);
    expect(copyrightBox!.y).toBeLessThan(noteBox!.y);
    expect(
      menuBox!.y + menuBox!.height - (noteBox!.y + noteBox!.height),
    ).toBeLessThanOrEqual(32);
  });

  test("expands Classes in normal flow and resets it when the header closes", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("button", {name: "Open Menu"}).click();

    const disclosure = page.getByRole("button", {name: "Classes menu"});
    const headerSurface = page.locator("[data-header-surface]");
    const submenu = page.getByRole("navigation", {
      name: "Mobile Classes submenu",
    });
    const headerYBefore = (await headerSurface.boundingBox())!.y;
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(submenu).toBeHidden();

    await page
      .getByRole("navigation", {name: "Header Menu"})
      .getByRole("link", {name: "Classes", exact: true})
      .focus();
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(submenu).toBeHidden();

    await disclosure.click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "true");
    await expect(submenu).toBeVisible();
    expect((await headerSurface.boundingBox())!.y).toBeCloseTo(headerYBefore, 0);
    await expect(submenu.getByRole("link")).toHaveCount(6);
    await expect(
      submenu.getByRole("link", {name: "Flute", exact: true}),
    ).toHaveAttribute("href", "/book?type=lesson&subject=Flute");
    await expect(
      submenu.getByRole("link", {name: "All classes", exact: true}),
    ).toHaveAttribute("href", "/classes");

    const lessonLinks = submenu.getByRole("link").filter({has: page.locator("img")});
    await expect(lessonLinks).toHaveCount(5);

    const fluteLink = submenu.getByRole("link", {name: "Flute", exact: true});
    await expect(fluteLink.locator("img")).toHaveCount(1);
    await expect(fluteLink.locator("svg")).toHaveCount(0);
    await expect(fluteLink).toHaveCSS("background-color", "rgb(250, 240, 221)");

    const [firstRow, secondRow] = await Promise.all([
      fluteLink.boundingBox(),
      submenu.getByRole("link", {name: "Recorder", exact: true}).boundingBox(),
    ]);
    expect(firstRow!.height).toBeCloseTo(50, 0);
    expect(secondRow!.y - (firstRow!.y + firstRow!.height)).toBeCloseTo(10, 0);
    await expect
      .poll(async () => (await submenu.boundingBox())?.height ?? 0)
      .toBeCloseTo(262 + 120 * (390 / 402), 0);

    await page.keyboard.press("Escape");
    await expect(submenu).toBeHidden();
    await expect(disclosure).toBeFocused();

    await disclosure.click();
    await page.getByRole("button", {name: "Close Menu"}).click();
    await expect(page.getByRole("button", {name: "Open Menu"})).toBeVisible();
    await page.getByRole("button", {name: "Open Menu"}).click();
    await expect(disclosure).toHaveAttribute("aria-expanded", "false");
    await expect(submenu).toBeHidden();
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

    const [logoBox, firstLinkBox] = await Promise.all([
      page.getByRole("link", {name: "Home Agatha Music link"}).boundingBox(),
      page
        .getByRole("navigation", {name: "Header Menu"})
        .getByRole("link", {name: "About me"})
        .boundingBox(),
    ]);
    expect(firstLinkBox!.y).toBeGreaterThanOrEqual(
      logoBox!.y + logoBox!.height,
    );
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
  await page.getByLabel("Student age").selectOption("Adult");
  await page.getByLabel("Subject").selectOption("Flute");
  await page
    .getByLabel("Message")
    .fill("I would like to ask about a first flute lesson.");
  await page.getByRole("button", {name: "Send message"}).click();

  await expect(page.getByRole("status")).toContainText(
    "Something went wrong. Please try again or use the booking link.",
  );
  await expect(page.getByRole("button", {name: "Send message"})).toBeEnabled();
});
