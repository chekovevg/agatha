import {expect, test, type Page} from "playwright/test";

import {
  emitReferenceIntersection,
  installReferenceWebGLProbe,
  readReferenceWebGLProbe,
  releaseReferenceScrollTimers,
  setReferenceVisibility,
  type ReferenceWebGLProbeSnapshot,
} from "./reference-webgl-probe";

const REFERENCE_HERO_URL = "/?hero=reference-webgl&heroCompare=1&ascii=0";

async function frameBarrier(page: Page) {
  await page.evaluate(
    () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())),
  );
}

async function expectDrawGrowth(page: Page, baseline: number) {
  await expect
    .poll(async () => (await readReferenceWebGLProbe(page)).drawCount)
    .toBeGreaterThan(baseline);
}

async function expectDrawsStable(page: Page) {
  await frameBarrier(page);
  await frameBarrier(page);
  const baseline = (await readReferenceWebGLProbe(page)).drawCount;
  await frameBarrier(page);
  await frameBarrier(page);
  expect((await readReferenceWebGLProbe(page)).drawCount).toBe(baseline);
  return baseline;
}

function deletionTotal(snapshot: ReferenceWebGLProbeSnapshot) {
  return Object.values(snapshot.deletions).reduce(
    (total, count) => total + count,
    0,
  );
}

async function expectFallbackVisible(page: Page) {
  const fallback = page.locator(".reference-webgl-hero-bg");
  await expect(fallback).toBeVisible();
  const appearance = await fallback.evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      area: rect.width * rect.height,
      backgroundImage: style.backgroundImage,
      opacity: Number(style.opacity),
      visibility: style.visibility,
    };
  });
  expect(appearance.area).toBeGreaterThan(0);
  expect(appearance.backgroundImage).not.toBe("none");
  expect(appearance.opacity).toBeGreaterThan(0);
  expect(appearance.visibility).toBe("visible");
}

test.describe("reference WebGL lifecycle probe", () => {
  test("pauses and resumes for intersection, visibility, and scroll", async ({
    page,
  }) => {
    await installReferenceWebGLProbe(page, {intersectionMode: "controlled"});
    await page.goto(REFERENCE_HERO_URL);

    const canvas = page.locator(".reference-webgl-hero-canvas");
    await expect(canvas).toHaveAttribute("data-reference-webgl-status", "ready");

    const readyDraws = (await readReferenceWebGLProbe(page)).drawCount;
    await expectDrawGrowth(page, readyDraws);

    await emitReferenceIntersection(page, false);
    const offscreenDraws = await expectDrawsStable(page);
    await emitReferenceIntersection(page, true);
    await expectDrawGrowth(page, offscreenDraws);

    await setReferenceVisibility(page, "hidden");
    const hiddenDraws = await expectDrawsStable(page);
    await setReferenceVisibility(page, "visible");
    await expectDrawGrowth(page, hiddenDraws);

    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await expect
      .poll(async () => (await readReferenceWebGLProbe(page)).heldScrollTimers)
      .toBe(1);
    const scrollingDraws = await expectDrawsStable(page);
    await releaseReferenceScrollTimers(page);
    await expectDrawGrowth(page, scrollingDraws);
  });

  test("reduced motion stays static through input and resize, then resumes", async ({
    page,
  }) => {
    await page.emulateMedia({reducedMotion: "reduce"});
    await installReferenceWebGLProbe(page, {intersectionMode: "controlled"});
    await page.goto(REFERENCE_HERO_URL);

    const canvas = page.locator(".reference-webgl-hero-canvas");
    await expect(canvas).toHaveAttribute("data-reference-webgl-status", "ready");
    await expectDrawsStable(page);

    await canvas.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: rect.left + rect.width * 0.1,
          clientY: rect.top + rect.height * 0.2,
        }),
      );
    });
    await expectDrawsStable(page);
    const reducedPointer = (await readReferenceWebGLProbe(page)).pointerUniforms
      .filter(({name}) => name === "u_pointer")
      .at(-1);
    expect(reducedPointer).toBeDefined();
    expect(reducedPointer?.x).toBeCloseTo(0.5, 5);
    expect(reducedPointer?.y).toBeCloseTo(0.5, 5);

    const beforeResize = (await readReferenceWebGLProbe(page)).drawCount;
    await page.setViewportSize({width: 1060, height: 780});
    await expect
      .poll(() =>
        canvas.evaluate((element) => {
          const htmlCanvas = element as HTMLCanvasElement;
          const rect = htmlCanvas.getBoundingClientRect();
          return (
            htmlCanvas.width ===
              Math.max(1, Math.round(rect.width * 0.5)) &&
            htmlCanvas.height ===
              Math.max(1, Math.round(rect.height * 0.5))
          );
        }),
      )
      .toBe(true);
    const dimensions = await canvas.evaluate((element) => {
      const htmlCanvas = element as HTMLCanvasElement;
      const rect = htmlCanvas.getBoundingClientRect();
      return {
        height: htmlCanvas.height,
        targetHeight: Math.max(1, Math.round(rect.height * 0.5)),
        targetWidth: Math.max(1, Math.round(rect.width * 0.5)),
        width: htmlCanvas.width,
      };
    });
    expect(dimensions.width).toBe(dimensions.targetWidth);
    expect(dimensions.height).toBe(dimensions.targetHeight);
    await expectDrawGrowth(page, beforeResize);
    const resizedDraws = await expectDrawsStable(page);

    await page.emulateMedia({reducedMotion: "no-preference"});
    await expectDrawGrowth(page, resizedDraws);
    await canvas.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      window.dispatchEvent(
        new PointerEvent("pointermove", {
          clientX: rect.left + rect.width * 0.1,
          clientY: rect.top + rect.height * 0.2,
        }),
      );
    });
    await expect
      .poll(async () => {
        const pointer = (await readReferenceWebGLProbe(page)).pointerUniforms
          .filter(({name}) => name === "u_pointer")
          .at(-1);
        return pointer
          ? Math.abs(pointer.x - 0.5) + Math.abs(pointer.y - 0.5)
          : 0;
      })
      .toBeGreaterThan(0.05);
  });

  for (const scenario of [
    {status: "unsupported", webglMode: "null"},
    {status: "error", webglMode: "throw"},
  ] as const) {
    test(`keeps the fallback visible for ${scenario.status} WebGL`, async ({
      page,
    }) => {
      const pageErrors: string[] = [];
      page.on("pageerror", (error) => pageErrors.push(error.message));
      await installReferenceWebGLProbe(page, {
        intersectionMode: "controlled",
        webglMode: scenario.webglMode,
      });
      await page.goto(REFERENCE_HERO_URL);

      const canvas = page.locator(".reference-webgl-hero-canvas");
      await expect(canvas).toHaveAttribute(
        "data-reference-webgl-status",
        scenario.status,
      );
      await expect(canvas).toHaveCSS("opacity", "0");
      await expectFallbackVisible(page);
      await frameBarrier(page);
      await frameBarrier(page);
      expect(pageErrors).toEqual([]);
    });
  }

  test("initializes without IntersectionObserver", async ({page}) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await installReferenceWebGLProbe(page, {intersectionMode: "missing"});
    await page.goto(REFERENCE_HERO_URL);

    await expect(page.locator(".reference-webgl-hero-canvas")).toHaveAttribute(
      "data-reference-webgl-status",
      "ready",
    );
    expect((await readReferenceWebGLProbe(page)).contextCalls).toBeGreaterThan(0);
    expect(pageErrors).toEqual([]);
  });

  test("unmount cleanup releases listeners, observers, timer, and GL resources", async ({
    page,
  }) => {
    await installReferenceWebGLProbe(page, {intersectionMode: "controlled"});
    await page.goto(REFERENCE_HERO_URL);

    const canvas = page.locator(".reference-webgl-hero-canvas");
    await expect(canvas).toHaveAttribute("data-reference-webgl-status", "ready");
    const readySnapshot = await readReferenceWebGLProbe(page);

    await page.evaluate(() => window.dispatchEvent(new Event("scroll")));
    await expect
      .poll(async () => (await readReferenceWebGLProbe(page)).heldScrollTimers)
      .toBe(1);

    await page.getByRole("button", {name: "Canvas", exact: true}).click();
    await expect(canvas).toHaveCount(0);
    await expect
      .poll(async () => (await readReferenceWebGLProbe(page)).activeListeners)
      .toBe(0);

    const cleanupSnapshot = await readReferenceWebGLProbe(page);
    expect(cleanupSnapshot.resizeDisconnects).toBeGreaterThanOrEqual(1);
    expect(cleanupSnapshot.intersectionDisconnects).toBeGreaterThanOrEqual(1);
    expect(cleanupSnapshot.heldScrollTimers).toBe(0);
    expect(cleanupSnapshot.clearedScrollTimers).toBeGreaterThanOrEqual(1);
    expect(cleanupSnapshot.removedListeners).toBeGreaterThan(0);
    expect(deletionTotal(cleanupSnapshot)).toBeGreaterThan(
      deletionTotal(readySnapshot),
    );
    await expectDrawsStable(page);
  });
});
