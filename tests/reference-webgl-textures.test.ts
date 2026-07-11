import {describe, expect, it} from "vitest";

import {
  createReferenceGradientData,
  createReferenceNoiseData,
} from "@/components/ui/reference-webgl/textures";

function getLuminanceField(width: number, height: number) {
  const data = createReferenceGradientData(width, height);
  const luminance = new Float32Array(width * height);

  for (let index = 0; index < luminance.length; index += 1) {
    const offset = index * 4;
    luminance[index] =
      data[offset] * 0.299 +
      data[offset + 1] * 0.587 +
      data[offset + 2] * 0.114;
  }

  return luminance;
}

function quantile(values: Float32Array, amount: number) {
  const sorted = Array.from(values).sort((a, b) => a - b);
  return sorted[Math.floor((sorted.length - 1) * amount)];
}

function directionalVariation(
  values: Float32Array,
  width: number,
  height: number,
  offsetX: number,
  offsetY: number,
) {
  let difference = 0;
  let samples = 0;

  for (let y = Math.max(0, -offsetY); y < height - Math.max(0, offsetY); y += 1) {
    for (let x = Math.max(0, -offsetX); x < width - Math.max(0, offsetX); x += 1) {
      const first = values[y * width + x];
      const second = values[(y + offsetY) * width + x + offsetX];
      difference += Math.abs(first - second);
      samples += 1;
    }
  }

  return difference / samples;
}

describe("reference WebGL generated textures", () => {
  it("creates deterministic RGBA gradient bytes", () => {
    const first = createReferenceGradientData(8, 4);
    const second = createReferenceGradientData(8, 4);

    expect(first).toHaveLength(8 * 4 * 4);
    expect(second).toEqual(first);
    expect(new Set(first).size).toBeGreaterThan(8);
  });

  it("creates a high-contrast brush field without flooding the frame with highlights", () => {
    const luminance = getLuminanceField(128, 77);
    const low = quantile(luminance, 0.05);
    const high = quantile(luminance, 0.95);
    const highlightThreshold = low + (high - low) * 0.78;
    const highlightCoverage =
      Array.from(luminance).filter((value) => value >= highlightThreshold)
        .length / luminance.length;

    expect(high - low).toBeGreaterThan(52);
    expect(highlightCoverage).toBeGreaterThan(0.08);
    expect(highlightCoverage).toBeLessThan(0.42);
  });

  it("keeps the shadow field in the warm rose reference palette", () => {
    const data = createReferenceGradientData(128, 77);
    const reds = new Float32Array(data.length / 4);
    const greens = new Float32Array(data.length / 4);
    const blues = new Float32Array(data.length / 4);

    for (let index = 0; index < reds.length; index += 1) {
      reds[index] = data[index * 4];
      greens[index] = data[index * 4 + 1];
      blues[index] = data[index * 4 + 2];
    }

    expect(quantile(reds, 0.05)).toBeGreaterThan(190);
    expect(quantile(greens, 0.05)).toBeGreaterThan(108);
    expect(quantile(blues, 0.05)).toBeGreaterThan(100);
    expect(quantile(reds, 0.95)).toBeGreaterThan(248);
  });

  it("varies more across the displayed slash strokes than along them", () => {
    const width = 128;
    const height = 77;
    const luminance = getLuminanceField(width, height);
    // Texture rows are displayed bottom-up by WebGL: (+x, +y) here becomes /.
    const alongStroke = directionalVariation(
      luminance,
      width,
      height,
      5,
      5,
    );
    const acrossStroke = directionalVariation(
      luminance,
      width,
      height,
      5,
      -5,
    );

    expect(acrossStroke).toBeGreaterThan(5);
    expect(acrossStroke).toBeGreaterThan(alongStroke * 1.45);
  });

  it("creates deterministic seeded two-channel noise", () => {
    const first = createReferenceNoiseData(16, 20260711);
    const second = createReferenceNoiseData(16, 20260711);
    const different = createReferenceNoiseData(16, 7);

    expect(first).toHaveLength(16 * 16 * 2);
    expect(second).toEqual(first);
    expect(different).not.toEqual(first);
  });

  it("rejects invalid generated texture dimensions", () => {
    expect(() => createReferenceGradientData(0, 4)).toThrow("positive");
    expect(() => createReferenceNoiseData(1)).toThrow("at least 2");
  });
});
