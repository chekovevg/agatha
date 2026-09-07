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
