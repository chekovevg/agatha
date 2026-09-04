import {expect, test, type Locator, type Page} from "playwright/test";

type TypographyExpectation = {
  family: "EB Garamond" | "Newsreader" | "Red Hat Mono";
  size: number;
  weight: "400" | "500";
  lineHeight: number;
  letterSpacing: number;
};

type TypographyResult = {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  lineHeight: number;
  letterSpacing: number;
};

const responsiveCases = [
  {
    width: 390,
    hero: typography("EB Garamond", 48.5075, "500", 50.9328, -1.4552),
    locationHeading: typography(
      "EB Garamond",
      29.1045,
      "400",
      33.4701,
      -0.5821,
    ),
    locationCopy: typography(
      "Newsreader",
      17.4627,
      "400",
      23.2254,
      -0.3493,
    ),
    headerNav: typography("Red Hat Mono", 16, "500", 28.8, -0.3493),
    metaTitle: typography("Red Hat Mono", 14.5522, "500", 14.5522, -0.2328),
    metaDescription: typography(
      "Red Hat Mono",
      12.6119,
      "500",
      20.1791,
      -0.2328,
    ),
    footer: typography("Red Hat Mono", 12, "400", 19.2, 0),
    imageWidth: 358.9552,
    imageHeight: 225.752,
    sectionGap: 29.1045,
  },
  {
    width: 768,
    hero: typography("EB Garamond", 66.6667, "500", 66.6667, -2.6667),
    locationHeading: typography(
      "EB Garamond",
      50.8031,
      "400",
      50.8031,
      -0.1905,
    ),
    locationCopy: typography(
      "Newsreader",
      19.0512,
      "400",
      23.814,
      -0.1905,
    ),
    headerNav: typography("Red Hat Mono", 12.7008, "500", 22.8614, -0.1905),
    metaTitle: typography("Red Hat Mono", 12, "500", 12, -0.1905),
    metaDescription: typography(
      "Red Hat Mono",
      10.3194,
      "500",
      16.511,
      -0.1905,
    ),
    footer: typography("Red Hat Mono", 11.9069, "400", 19.051, 1.1907),
    imageWidth: 240,
    imageHeight: 150.9394,
    sectionGap: 13.3333,
  },
  {
    width: 1224,
    hero: typography("EB Garamond", 106.25, "500", 106.25, -4.25),
    locationHeading: typography(
      "EB Garamond",
      56.8889,
      "400",
      56.8889,
      -0.2133,
    ),
    locationCopy: typography(
      "Newsreader",
      21.3333,
      "400",
      26.6667,
      -0.2133,
    ),
    headerNav: typography("Red Hat Mono", 14.2222, "500", 25.6, -0.2133),
    metaTitle: typography("Red Hat Mono", 13.3333, "500", 13.3333, -0.2133),
    metaDescription: typography(
      "Red Hat Mono",
      11.5556,
      "500",
      18.4889,
      -0.2133,
    ),
    footer: typography("Red Hat Mono", 13.3333, "400", 21.3333, 1.3333),
    imageWidth: 382.5,
    imageHeight: 240.5596,
    sectionGap: 21.25,
  },
  {
    width: 1440,
    hero: typography("EB Garamond", 125, "500", 125, -5),
    locationHeading: typography(
      "EB Garamond",
      56.8889,
      "400",
      56.8889,
      -0.2133,
    ),
    locationCopy: typography(
      "Newsreader",
      21.3333,
      "400",
      26.6667,
      -0.2133,
    ),
    headerNav: typography("Red Hat Mono", 14.2222, "500", 25.6, -0.2133),
    metaTitle: typography("Red Hat Mono", 13.3333, "500", 13.3333, -0.2133),
    metaDescription: typography(
      "Red Hat Mono",
      11.5556,
      "500",
      18.4889,
      -0.2133,
    ),
    footer: typography("Red Hat Mono", 13.3333, "400", 21.3333, 1.3333),
    imageWidth: 450,
    imageHeight: 283.0113,
    sectionGap: 25,
  },
  {
    width: 1728,
    hero: typography("EB Garamond", 150, "500", 150, -6),
    locationHeading: typography("EB Garamond", 64, "400", 64, -0.24),
    locationCopy: typography("Newsreader", 24, "400", 30, -0.24),
    headerNav: typography("Red Hat Mono", 16, "500", 28.8, -0.24),
    metaTitle: typography("Red Hat Mono", 15, "500", 15, -0.24),
    metaDescription: typography("Red Hat Mono", 13, "500", 20.8, -0.24),
    footer: typography("Red Hat Mono", 15, "400", 24, 1.5),
    imageWidth: 540,
    imageHeight: 339.6136,
    sectionGap: 30,
  },
] as const;

function typography(
  family: TypographyExpectation["family"],
  size: number,
  weight: TypographyExpectation["weight"],
  lineHeight: number,
  letterSpacing: number,
): TypographyExpectation {
  return {family, size, weight, lineHeight, letterSpacing};
}

async function readTypography(locator: Locator): Promise<TypographyResult> {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element);

    return {
      fontFamily: style.fontFamily,
      fontSize: Number.parseFloat(style.fontSize),
      fontWeight: style.fontWeight,
      lineHeight: Number.parseFloat(style.lineHeight),
      letterSpacing:
        style.letterSpacing === "normal"
          ? 0
          : Number.parseFloat(style.letterSpacing),
    };
  });
}

function expectTypography(
  actual: TypographyResult,
  expected: TypographyExpectation,
  label: string,
) {
  expect(actual.fontFamily, `${label} family`).toContain(expected.family);
  expect(actual.fontSize, `${label} size`).toBeCloseTo(expected.size, 1);
  expect(actual.fontWeight, `${label} weight`).toBe(expected.weight);
  expect(actual.lineHeight, `${label} line-height`).toBeCloseTo(
    expected.lineHeight,
    1,
  );
  expect(actual.letterSpacing, `${label} tracking`).toBeCloseTo(
    expected.letterSpacing,
    2,
  );
}

async function waitForStableImage(page: Page) {
  const image = page.locator(".home-location-copy-stack img");
  await expect(image).toBeVisible();
  await image.evaluate(async (element) => {
    const htmlImage = element as HTMLImageElement;
    if (!htmlImage.complete) {
      await new Promise<void>((resolve, reject) => {
        htmlImage.addEventListener("load", () => resolve(), {once: true});
        htmlImage.addEventListener("error", () => reject(), {once: true});
      });
    }
    await htmlImage.decode?.();
  });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
}

test("captures the responsive Home and Classes menu audit when requested", async ({
  page,
}) => {
  const auditDir = process.env.RESPONSIVE_AUDIT_DIR;
  test.skip(!auditDir, "Set RESPONSIVE_AUDIT_DIR to capture visual evidence");

  for (const {width} of responsiveCases) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await waitForStableImage(page);
    await page.screenshot({path: `${auditDir}/home-${width}.png`, fullPage: true});

    if (width <= 860) {
      await page.getByRole("button", {name: "Open Menu"}).click();
      await expect(
        page.getByRole("navigation", {name: "Header Menu"}),
      ).toHaveCSS("opacity", "1");
      await page.getByRole("button", {name: "Classes menu"}).click();
      const mobileClasses = page.getByRole("navigation", {
        name: "Mobile Classes submenu",
      });
      await expect(
        mobileClasses.getByRole("link", {name: "Flute", exact: true}),
      ).toBeVisible();
      await expect
        .poll(() =>
          mobileClasses.locator(".classes-menu-mobile-content").evaluate(
            (element) => element.scrollHeight - element.clientHeight,
          ),
        )
        .toBe(0);
      const [submenuBox, allClassesBox] = await Promise.all([
        mobileClasses.boundingBox(),
        mobileClasses
          .getByRole("link", {name: "All Classes", exact: true})
          .boundingBox(),
      ]);
      expect(allClassesBox!.y + allClassesBox!.height).toBeLessThan(
        submenuBox!.y + submenuBox!.height,
      );
    } else {
      await page
        .getByRole("navigation", {name: "Header Menu"})
        .getByRole("link", {name: "Classes", exact: true})
        .hover();
      const desktopClasses = page.getByRole("navigation", {
        name: "Desktop Classes submenu",
      });
      await expect(desktopClasses.locator(".classes-menu-panel")).toHaveCSS(
        "opacity",
        "1",
      );
    }
    await page.screenshot({path: `${auditDir}/classes-menu-${width}.png`});
  }
});

test("responsive typography and location geometry match the Chrome audit", async ({
  page,
}) => {
  for (const expected of responsiveCases) {
    await page.setViewportSize({width: expected.width, height: 1000});
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await waitForStableImage(page);

    const headerNavSelector =
      expected.width <= 860
        ? ".classes-menu-link-mobile"
        : ".classes-menu-link-desktop";
    const image = page.locator(".home-location-copy-stack img");
    const imageBoxBefore = await image.boundingBox();
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const imageBoxAfter = await image.boundingBox();
    const geometry = await page.evaluate(() => {
      const rect = (selector: string) => {
        const element = document.querySelector(selector);
        if (!element) throw new Error(`Missing ${selector}`);
        return element.getBoundingClientRect();
      };
      const heading = rect("[data-home-location-heading]");
      const locationImage = rect(".home-location-copy-stack img");
      const copy = rect("[data-home-location-copy]");

      return {
        headingImageGap: locationImage.top - heading.bottom,
        imageCopyGap: copy.top - locationImage.bottom,
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        overflowingElements: Array.from(document.querySelectorAll("body *"))
          .map((element) => {
            const box = element.getBoundingClientRect();
            return {
              name:
                element.getAttribute("data-home-location-heading") !== null
                  ? "location-heading"
                  : element.getAttribute("class") ?? element.tagName,
              left: box.left,
              right: box.right,
            };
          })
          .filter(({left, right}) => left < -0.5 || right > window.innerWidth + 0.5),
      };
    });

    expectTypography(
      await readTypography(page.locator(".plain-home-title")),
      expected.hero,
      `hero at ${expected.width}px`,
    );
    expectTypography(
      await readTypography(page.locator("[data-home-location-heading]")),
      expected.locationHeading,
      `location heading at ${expected.width}px`,
    );
    expectTypography(
      await readTypography(page.locator("[data-home-location-copy]")),
      expected.locationCopy,
      `location copy at ${expected.width}px`,
    );
    expectTypography(
      await readTypography(page.locator(headerNavSelector)),
      expected.headerNav,
      `header nav at ${expected.width}px`,
    );

    const desktopClasses = page.locator("#classes-menu-desktop");
    const metaTitle = desktopClasses.getByText("What I teach", {exact: true});
    const metaDescription = desktopClasses.getByText(
      "Discover and choose what you want to learn",
      {exact: true},
    );
    const lessonRow = desktopClasses.locator(
      'a[href="/book?type=lesson&subject=Flute"]',
    ).first();
    const allClasses = desktopClasses.locator('a[href="/classes"]').first();
    for (const [name, locator] of [
      ["metanav title", metaTitle],
      ["lesson row", lessonRow],
      ["All Classes", allClasses],
    ] as const) {
      expectTypography(
        await readTypography(locator),
        expected.metaTitle,
        `${name} at ${expected.width}px`,
      );
    }
    expectTypography(
      await readTypography(metaDescription),
      expected.metaDescription,
      `metanav description at ${expected.width}px`,
    );
    expectTypography(
      await readTypography(
        page.locator('footer [data-footer-section="site"] a').first(),
      ),
      expected.footer,
      `footer at ${expected.width}px`,
    );

    expect(imageBoxAfter).not.toBeNull();
    expect(imageBoxAfter!.width, `image width at ${expected.width}px`).toBeCloseTo(
      expected.imageWidth,
      1,
    );
    expect(
      imageBoxAfter!.height,
      `image height at ${expected.width}px`,
    ).toBeCloseTo(expected.imageHeight, 1);
    expect(imageBoxAfter, `stable image at ${expected.width}px`).toEqual(
      imageBoxBefore,
    );
    expect(
      geometry.headingImageGap,
      `heading to image at ${expected.width}px`,
    ).toBeCloseTo(expected.sectionGap, 1);
    expect(
      geometry.imageCopyGap,
      `image to copy at ${expected.width}px`,
    ).toBeCloseTo(expected.sectionGap, 1);
    expect(
      geometry.overflow,
      `overflow at ${expected.width}px: ${JSON.stringify(geometry.overflowingElements)}`,
    ).toBeLessThanOrEqual(0);
    await expect(page.getByRole("tab").first()).toHaveCSS("cursor", "pointer");
    await expect(
      page.locator(".home-location-section").getByRole("link", {
        name: "Get in Touch",
      }),
    ).toHaveCount(0);

  }
});

test("Classes menu shadow is rendered outside the animated clip", async ({page}) => {
  for (const width of [1224, 1440, 1728]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/");
    await page
      .getByRole("navigation", {name: "Header Menu"})
      .getByRole("link", {name: "Classes", exact: true})
      .hover();

    const shell = page.getByRole("navigation", {
      name: "Desktop Classes submenu",
    });
    const panel = shell.locator(".classes-menu-panel");
    await expect(shell).toBeVisible();
    const [filter, boxShadow, clipPath] = await Promise.all([
      shell.evaluate((element) => getComputedStyle(element).filter),
      panel.evaluate((element) => getComputedStyle(element).boxShadow),
      panel.evaluate((element) => getComputedStyle(element).clipPath),
    ]);

    expect(filter).toContain("drop-shadow");
    expect(filter).toContain("rgba(63, 53, 47, 0.2)");
    expect(filter).toContain("0px 10px 28px");
    expect(boxShadow).toBe("none");
    expect(clipPath).toContain("inset(0px");

  }
});
