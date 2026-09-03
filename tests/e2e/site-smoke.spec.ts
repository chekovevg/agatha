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
    "Flute & Music Teacher For Adults and Children",
  );
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
    ).toHaveAttribute("href", "/book");
  }
});

test("musical score player starts only after interaction and can pause", async ({
  page,
}) => {
  await page.goto("/");

  const player = page.locator(".musical-score-player");
  const button = page.locator(".musical-score-play-button");

  await expect(player).toHaveAttribute("data-playback-state", "idle");
  await expect(player).not.toHaveAttribute("data-audio-started", "true");
  await expect(button).toContainText("Play the phrase");

  await button.click();
  await expect(player).toHaveAttribute("data-playback-state", "playing");
  await expect(player).toHaveAttribute("data-audio-started", "true");
  await expect(button).toContainText("Pause");

  await button.click();
  await expect(player).toHaveAttribute("data-playback-state", "paused");
  await expect(button).toContainText("Resume");

  const initialShape = await page
    .locator("[data-musical-score]")
    .getAttribute("data-score-shape");

  await button.click();
  await expect(player).toHaveAttribute("data-playback-state", "playing");
  await expect(page.locator('.score-note[data-active="true"]')).toHaveCount(1);
  await expect(player).toHaveAttribute("data-playback-state", "complete", {
    timeout: 15_000,
  });
  await expect(button).toContainText("Replay");

  await button.click();
  await expect(player).toHaveAttribute("data-playback-state", "playing");
  await expect(page.locator("[data-musical-score]")).not.toHaveAttribute(
    "data-score-shape",
    initialShape ?? "",
  );
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
    const booking = header.locator('a[href="/book"]:visible');

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

test("desktop Classes menu previews lessons and supports keyboard dismissal", async ({
  page,
}) => {
  await page.setViewportSize({width: 1280, height: 900});
  await page.goto("/");

  const classesLink = page
    .getByRole("navigation", {name: "Header Menu"})
    .getByRole("link", {name: "Classes", exact: true});
  await classesLink.hover();

  const menu = page.getByTestId("classes-menu");
  await expect(menu).toBeVisible();
  await menu.getByRole("link", {name: "Recorder", exact: true}).hover();

  const preview = page.getByTestId("classes-menu-preview");
  await expect(preview.getByText("Recorder", {exact: true})).toBeVisible();
  await expect(preview).toHaveAttribute(
    "href",
    "/about?subject=Recorder#contact",
  );
  await expect(
    menu.getByRole("link", {name: "All classes"}),
  ).toHaveAttribute("href", "/classes");

  await classesLink.focus();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(classesLink).toBeFocused();
});

test("lesson menu destinations prefill the editable contact subject", async ({
  page,
}) => {
  await page.goto("/about?subject=Piccolo#contact");

  const subject = page.getByLabel("Subject");
  await expect(subject).toHaveValue("Piccolo");
  await subject.fill("Piccolo for an adult beginner");
  await expect(subject).toHaveValue("Piccolo for an adult beginner");
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
    await expect(page.getByTestId("classes-menu")).toBeHidden();

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

test("mobile classes keep the header card and lesson controls on their grids", async ({
  page,
}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto("/classes");

  const [logoBox, eyebrowBox, buttonBox] = await Promise.all([
    page
      .getByRole("link", {name: "Home Agatha Music link"})
      .boundingBox(),
    page.locator("article").first().locator("p").first().boundingBox(),
    page
      .locator("article")
      .first()
      .getByRole("link", {name: "Learn flute with Agatha"})
      .boundingBox(),
  ]);

  expect(logoBox).not.toBeNull();
  expect(eyebrowBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(logoBox!.x).toBeCloseTo(35, 0);
  expect(eyebrowBox!.x).toBeCloseTo(40, 0);
  expect(buttonBox!.x).toBeCloseTo(40, 0);
  expect(buttonBox!.height).toBeCloseTo(42, 0);
});

test("mobile classes use the Models-style intro mass and fading backdrop", async ({
  page,
}) => {
  await page.setViewportSize({width: 393, height: 852});
  await page.goto("/classes");

  const intro = page.getByTestId("classes-intro");
  const heading = page.getByTestId("classes-heading");
  const subtitle = page.getByTestId("classes-subtitle");
  const backdrop = page.getByTestId("classes-backdrop");

  await expect(subtitle).toHaveText(
    "Choose the instrument or subject that suits your musical goals, level and pace.",
  );
  await expect(backdrop).toBeVisible();

  const [introBox, headingBox, subtitleBox, headerBox] = await Promise.all([
    intro.boundingBox(),
    heading.boundingBox(),
    subtitle.boundingBox(),
    page.locator("header > div > div").boundingBox(),
  ]);

  expect(introBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(subtitleBox).not.toBeNull();
  expect(headerBox).not.toBeNull();
  expect(headerBox!.x).toBeCloseTo(15, 0);
  expect(headerBox!.width).toBeCloseTo(363, 0);
  expect(headingBox!.y).toBeCloseTo(195, 0);
  expect(headingBox!.height).toBeCloseTo(67, 0);
  expect(subtitleBox!.y).toBeCloseTo(292, 0);
  expect(subtitleBox!.height).toBeGreaterThan(60);

  await page.evaluate(() => window.scrollTo({top: 852, behavior: "instant"}));
  expect((await backdrop.boundingBox())!.y).toBeLessThan(0);
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
