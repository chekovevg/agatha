import {expect, test, type Page} from "playwright/test";

async function expectHealthyPage(page: Page) {
  await expect(page.locator("body")).not.toHaveText("");
  await expect(page.locator("[data-nextjs-dialog]")).toHaveCount(0);
}

test("primary English routes render successfully with security headers", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const path of ["/", "/about", "/classes", "/media", "/book"]) {
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

test("legacy locale routes return standard 404 responses", async ({page}) => {
  for (const path of ["/en", "/de", "/ru", "/en/about", "/de/book"]) {
    const response = await page.goto(path);

    expect(response?.status(), path).toBe(404);
    await expectHealthyPage(page);
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

    await page.getByRole("button", {name: "Close Menu"}).click();
    await expect(page.getByRole("button", {name: "Open Menu"})).toBeVisible();
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
    .getByLabel("Message")
    .fill("I would like to ask about a first flute lesson.");
  await page.getByRole("button", {name: "Send message"}).click();

  await expect(page.getByRole("status")).toContainText(
    "Something went wrong. Please try again or use the booking link.",
  );
  await expect(page.getByRole("button", {name: "Send message"})).toBeEnabled();
});
