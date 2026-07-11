import {readdirSync, readFileSync} from "node:fs";
import {relative, resolve, sep} from "node:path";

import {expect, test, type Locator, type Page, type Route} from "playwright/test";

import {
  installReferenceWebGLProbe,
  readReferenceWebGLProbe,
} from "./reference-webgl-probe";

const REFERENCE_HERO_URL = "/?hero=reference-webgl&heroCompare=1&ascii=0";
const RENDERER_CHUNK_MARKER = "Unable to create Reference GL shader";
const SWITCHER_BUTTON_NAMES = [
  "Canvas",
  "Legacy GL",
  "Reference GL",
  "ASCII",
] as const;

type ExpectedQuery = {
  ascii: string | null;
  hero: string | null;
};

async function expectOnlyButtonActive(buttons: Locator, activeIndex: number) {
  await expect(buttons.nth(activeIndex)).toHaveAttribute("aria-pressed", "true");
  await expect(buttons.nth(activeIndex)).toHaveAttribute("data-active", "true");

  const switcher = buttons.first().locator("..");
  await expect(switcher.locator('button[aria-pressed="true"]')).toHaveCount(1);
  await expect(switcher.locator('button[data-active="true"]')).toHaveCount(1);
}

async function expectHeroQuery(page: Page, expected: ExpectedQuery) {
  await expect.poll(() => {
    const url = new URL(page.url());
    return {
      ascii: url.searchParams.get("ascii"),
      hero: url.searchParams.get("hero"),
      heroCompare: url.searchParams.get("heroCompare"),
      pathname: url.pathname,
    };
  }).toEqual({
    ...expected,
    heroCompare: "1",
    pathname: "/",
  });
}

async function readCanvasSize(canvas: Locator) {
  return canvas.evaluate((element) => {
    const htmlCanvas = element as HTMLCanvasElement;
    const rect = htmlCanvas.getBoundingClientRect();

    return {
      backingHeight: htmlCanvas.height,
      backingWidth: htmlCanvas.width,
      cssHeight: rect.height,
      cssWidth: rect.width,
      devicePixelRatio: window.devicePixelRatio,
    };
  });
}

async function expectHalfResolutionAtDprTwo(canvas: Locator) {
  await expect.poll(async () => {
    const size = await readCanvasSize(canvas);
    return {
      devicePixelRatio: size.devicePixelRatio,
      heightMatches: size.backingHeight === Math.round(size.cssHeight * 0.5),
      widthMatches: size.backingWidth === Math.round(size.cssWidth * 0.5),
    };
  }).toEqual({
    devicePixelRatio: 2,
    heightMatches: true,
    widthMatches: true,
  });

  const size = await readCanvasSize(canvas);
  expect(size.backingWidth).toBe(Math.round(size.cssWidth * 0.5));
  expect(size.backingHeight).toBe(Math.round(size.cssHeight * 0.5));
  expect(size.backingWidth).not.toBe(
    Math.round(size.cssWidth * size.devicePixelRatio),
  );
  expect(size.backingHeight).not.toBe(
    Math.round(size.cssHeight * size.devicePixelRatio),
  );

  return size;
}

async function frameBarrier(page: Page) {
  await page.evaluate(
    () => new Promise<void>((resolveFrame) => requestAnimationFrame(() => resolveFrame())),
  );
}

function findReferenceRendererChunkPath() {
  const chunksRoot = resolve(process.cwd(), ".next", "static", "chunks");
  const matches: string[] = [];

  const visit = (directory: string) => {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      const entryPath = resolve(directory, entry.name);

      if (entry.isDirectory()) {
        visit(entryPath);
      } else if (
        entry.isFile() &&
        entry.name.endsWith(".js") &&
        readFileSync(entryPath, "utf8").includes(RENDERER_CHUNK_MARKER)
      ) {
        matches.push(entryPath);
      }
    }
  };

  visit(chunksRoot);
  if (matches.length !== 1) {
    throw new Error(
      `Expected one built Reference GL renderer chunk containing ${JSON.stringify(RENDERER_CHUNK_MARKER)}, found ${matches.length}`,
    );
  }

  const chunkRelativePath = relative(chunksRoot, matches[0])
    .split(sep)
    .join("/");
  return `/_next/static/chunks/${chunkRelativePath}`;
}

test.describe("reference WebGL variant contract", () => {
  test("keeps all four mobile controls reachable and preserves query contracts", async ({
    page,
  }) => {
    await page.setViewportSize({width: 390, height: 844});
    await page.goto(REFERENCE_HERO_URL);

    const switcher = page.getByRole("group", {name: "Hero background"});
    await expect(switcher).toHaveCount(1);
    const buttons = switcher.getByRole("button");
    await expect(buttons).toHaveText([...SWITCHER_BUTTON_NAMES]);
    await expectOnlyButtonActive(buttons, 2);

    const switcherBounds = await switcher.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return {
        bottom: rect.bottom,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        viewportHeight: window.innerHeight,
        viewportWidth: window.innerWidth,
      };
    });
    expect(switcherBounds.left).toBeGreaterThanOrEqual(0);
    expect(switcherBounds.top).toBeGreaterThanOrEqual(0);
    expect(switcherBounds.right).toBeLessThanOrEqual(
      switcherBounds.viewportWidth,
    );
    expect(switcherBounds.bottom).toBeLessThanOrEqual(
      switcherBounds.viewportHeight,
    );

    await buttons.nth(0).click();
    await expectOnlyButtonActive(buttons, 0);
    await expectHeroQuery(page, {ascii: "0", hero: null});

    await buttons.nth(1).click();
    await expectOnlyButtonActive(buttons, 1);
    await expectHeroQuery(page, {ascii: null, hero: "webgl"});

    await buttons.nth(2).click();
    await expectOnlyButtonActive(buttons, 2);
    await expectHeroQuery(page, {ascii: null, hero: "reference-webgl"});

    await switcher.evaluate((element) => {
      element.scrollLeft = element.scrollWidth;
    });
    await expect.poll(() => buttons.nth(3).evaluate((element) => {
      const buttonRect = element.getBoundingClientRect();
      const switcherRect = element.parentElement?.getBoundingClientRect();
      if (!switcherRect) return false;

      return (
        buttonRect.left >= Math.max(0, switcherRect.left) - 1 &&
        buttonRect.right <= Math.min(window.innerWidth, switcherRect.right) + 1
      );
    })).toBe(true);

    await buttons.nth(3).click();
    await expectOnlyButtonActive(buttons, 3);
    await expectHeroQuery(page, {ascii: null, hero: null});
  });

  test.describe("at device pixel ratio two", () => {
    test.use({deviceScaleFactor: 2, viewport: {width: 390, height: 844}});

    test("keeps the backing store at half CSS resolution across resize", async ({
      page,
    }) => {
      await page.goto(REFERENCE_HERO_URL);

      const canvas = page.locator(".reference-webgl-hero-canvas");
      await expect(canvas).toHaveAttribute("data-reference-webgl-status", "ready");
      const initialSize = await expectHalfResolutionAtDprTwo(canvas);

      await page.setViewportSize({width: 430, height: 900});
      await expect.poll(async () => (await readCanvasSize(canvas)).cssWidth)
        .not.toBe(initialSize.cssWidth);
      await expectHalfResolutionAtDprTwo(canvas);
    });
  });

  test("does not initialize a renderer after a pending import is unmounted", async ({
    page,
  }) => {
    const rendererChunkPath = findReferenceRendererChunkPath();
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await installReferenceWebGLProbe(page);

    let releaseChunk!: () => void;
    const chunkRelease = new Promise<void>((resolveRelease) => {
      releaseChunk = resolveRelease;
    });
    let heldRequestUrl: string | null = null;
    let routeCompleted = false;
    const rendererChunkMatches = (url: URL) => url.pathname === rendererChunkPath;
    const holdRendererChunk = async (route: Route) => {
      heldRequestUrl = route.request().url();
      try {
        await chunkRelease;
        await route.continue();
      } finally {
        routeCompleted = true;
      }
    };

    await page.route(rendererChunkMatches, holdRendererChunk);
    try {
      await page.goto("/?heroCompare=1&ascii=0");
      const switcher = page.locator(".hero-background-switcher");
      const canvasButton = switcher.getByRole("button", {
        exact: true,
        name: "Canvas",
      });
      const referenceButton = switcher.getByRole("button", {
        exact: true,
        name: "Reference GL",
      });
      const canvas = page.locator(".reference-webgl-hero-canvas");
      await expect(canvasButton).toHaveAttribute("aria-pressed", "true");

      const rendererResponsePromise = page.waitForResponse((response) =>
        rendererChunkMatches(new URL(response.url())),
      );
      try {
        await referenceButton.click();
        await expect.poll(() => heldRequestUrl).not.toBeNull();
        await expect(canvas).toHaveAttribute(
          "data-reference-webgl-status",
          "loading",
        );

        await canvasButton.click();
        await expect(canvas).toHaveCount(0);
      } finally {
        releaseChunk();
      }

      const rendererResponse = await rendererResponsePromise;
      expect(await rendererResponse.finished()).toBeNull();
      await expect.poll(() => routeCompleted).toBe(true);
      await frameBarrier(page);
      await frameBarrier(page);

      await expect(canvas).toHaveCount(0);
      expect((await readReferenceWebGLProbe(page)).contextCalls).toBe(0);
      expect(pageErrors).toEqual([]);
    } finally {
      releaseChunk();
      await page.unroute(rendererChunkMatches, holdRendererChunk);
    }
  });
});
