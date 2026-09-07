import {expect, test} from "playwright/test";

test("about portrait and copy stay separated at the desktop breakpoint", async ({page}) => {
  for (const width of [861, 1024, 1440]) {
    await page.setViewportSize({width, height: 900});
    await page.goto("/about");
    const portrait = await page.getByRole("img", {name: "Agatha Gurko portrait"}).boundingBox();
    const title = await page.locator("#about-title").boundingBox();
    expect(title!.x - (portrait!.x + portrait!.width)).toBeGreaterThanOrEqual(24);
  }
});

test("tablet lesson descriptions use the available row width", async ({page}) => {
  await page.setViewportSize({width: 768, height: 1024});
  await page.goto("/classes");
  const card = page.locator(".classes-lesson-card").first();
  const description = await card.locator(":scope > p").boundingBox();
  const cardBox = await card.boundingBox();
  expect(description!.width / cardBox!.width).toBeGreaterThan(0.8);
});

test("mobile menu supports touch targets, focus containment, Escape and reduced motion", async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/");
  const toggle = page.getByRole("button", {name: "Open Menu", exact: true});
  const box = await toggle.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await toggle.click();
  const menu = page.getByRole("navigation", {name: "Header Menu", exact: true});
  await expect(menu).toHaveCSS("transition-duration", "0s");
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.getByRole("button", {name: "Close Menu", exact: true}).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", {name: "Home Agatha Music link"})).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeVisible();
  await expect(toggle).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});

test("FAQ disclosure updates its icon and remains keyboard operable", async ({page}) => {
  await page.goto("/");
  const question = page.locator("[data-home-faq] summary").first();
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-home-faq] details").first()).toHaveAttribute("open", "");
  await expect(question.locator(".faq-icon")).toHaveCSS("transform", "matrix(0.707107, 0.707107, -0.707107, 0.707107, 0, 0)");
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-home-faq] details").first()).not.toHaveAttribute("open");
});


test("footer highlights only the current page and updates after navigation", async ({page}) => {
  await page.goto("/classes");
  const footer = page.locator("footer");
  const current = footer.locator('[aria-current="page"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText("Classes");
  await expect(current).toHaveCSS("text-decoration-line", "underline");
  await footer.getByRole("link", {name: "About me", exact: true}).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText("About me");
  await expect(footer.getByRole("link", {name: "Classes", exact: true})).toHaveCSS("text-decoration-line", "none");
  await page.goto("/");
  await expect(current).toHaveCount(0);
});


test("Classes intro uses the measured Models typography scale", async ({page}) => {
  for (const [width, headingSize, headingLine, subtitleSize, subtitleLine] of [
    [1728, 64, 64, 32, 38.4],
    [1440, 56.8889, 56.8889, 28.4444, 34.1333],
    [768, 50.8031, 50.8031, 22.2264, 26.6716],
    [390, 29.1045, 33.4701, 19.403, 23.2836],
  ]) {
    await page.setViewportSize({width, height: 1000});
    await page.goto("/classes");
    for (const [selector, size, line] of [
      [".classes-page-heading", headingSize, headingLine],
      [".classes-page-subtitle", subtitleSize, subtitleLine],
    ] as const) {
      const metrics = await page.locator(selector).evaluate((element) => {
        const style = getComputedStyle(element);
        return {size: parseFloat(style.fontSize), line: parseFloat(style.lineHeight)};
      });
      expect(metrics.size).toBeCloseTo(size, 1);
      expect(metrics.line).toBeCloseTo(line, 1);
    }
  }
});


test("header returns on upward scroll on every main page", async ({page}) => {
  await page.setViewportSize({width: 1440, height: 900});
  for (const route of ["/", "/classes", "/about", "/media"]) {
    await page.goto(route);
    const header = page.locator("header");
    await expect(header).toHaveCSS("position", "fixed");
    await page.evaluate(() => window.scrollTo(0, 900));
    await expect(header).toHaveAttribute("data-header-hidden", "true");
    await page.evaluate(() => window.scrollBy(0, -100));
    await expect(header).toHaveAttribute("data-header-hidden", "false");
    await expect.poll(async () => (await header.boundingBox())!.y).toBeGreaterThanOrEqual(0);
  }
});

test("Classes hover menu stays above its heading and cards stay compact", async ({page}) => {
  await page.setViewportSize({width: 1728, height: 1000});
  await page.goto("/classes");
  await page.locator('header a[href="/classes"]').first().hover();
  const panel = page.locator(".classes-menu-panel");
  await expect(panel).toHaveCSS("opacity", "1");
  await expect.poll(() => panel.evaluate((element) => {
    const box = element.getBoundingClientRect();
    return element.contains(document.elementFromPoint(box.x + box.width / 2, box.y + box.height * 0.7));
  })).toBe(true);
  const card = page.locator(".classes-lesson-card").first();
  const title = await card.locator("h2").boundingBox();
  const cta = await card.locator(".classes-lesson-cta").boundingBox();
  expect((await card.boundingBox())!.height).toBeLessThanOrEqual(360);
  expect(cta!.y - title!.y - title!.height).toBeLessThanOrEqual(40);
  expect(cta!.width).toBeLessThan(300);
});
