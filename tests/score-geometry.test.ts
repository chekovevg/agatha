import {describe, expect, it} from "vitest";

import {scorePhrases} from "@/content/score-phrases";
import {
  buildStaffPaths,
  placeNotes,
  sampleCurve,
} from "@/lib/score-geometry";

describe("curved score geometry", () => {
  const phrase = scorePhrases[0];

  it("samples a finite point and angle for the requested count", () => {
    const points = sampleCurve(phrase.curve, 41);

    expect(points).toHaveLength(41);
    for (const point of points) {
      expect(Number.isFinite(point.x)).toBe(true);
      expect(Number.isFinite(point.y)).toBe(true);
      expect(Number.isFinite(point.angle)).toBe(true);
    }
  });

  it("builds five staff paths and one ordered placement per note", () => {
    const staffPaths = buildStaffPaths(phrase.curve);
    const placements = placeNotes(phrase.curve, phrase.notes);

    expect(staffPaths).toHaveLength(5);
    expect(staffPaths.every((path) => path.startsWith("M "))).toBe(true);
    expect(placements).toHaveLength(phrase.notes.length);

    for (const placement of placements) {
      expect(Number.isFinite(placement.x)).toBe(true);
      expect(Number.isFinite(placement.y)).toBe(true);
      expect(Number.isFinite(placement.angle)).toBe(true);
    }
  });
});
