import {describe, expect, it} from "vitest";

import {
  createReferenceGradientData,
  createReferenceNoiseData,
} from "@/components/ui/reference-webgl/textures";

describe("reference WebGL generated textures", () => {
  it("creates deterministic RGBA gradient bytes", () => {
    const first = createReferenceGradientData(8, 4);
    const second = createReferenceGradientData(8, 4);

    expect(first).toHaveLength(8 * 4 * 4);
    expect(second).toEqual(first);
    expect(new Set(first).size).toBeGreaterThan(8);
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
