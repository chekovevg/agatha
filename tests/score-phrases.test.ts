import {describe, expect, it} from "vitest";

import {scorePhrases} from "@/content/score-phrases";

describe("score phrases", () => {
  it("contains three complete, ordered, licensed excerpts", () => {
    expect(scorePhrases).toHaveLength(3);
    expect(new Set(scorePhrases.map((phrase) => phrase.curve.id)).size).toBe(3);

    for (const phrase of scorePhrases) {
      expect(phrase.composer.length).toBeGreaterThan(0);
      expect(phrase.work.length).toBeGreaterThan(0);
      expect(phrase.licence).toMatch(/public domain|CC/i);
      expect(() => new URL(phrase.sourceUrl)).not.toThrow();
      expect(phrase.bpm).toBeGreaterThanOrEqual(48);
      expect(phrase.bpm).toBeLessThanOrEqual(132);
      expect(phrase.notes.length).toBeGreaterThanOrEqual(12);

      const orderedTimes = phrase.notes.map((note) => note.time);
      expect(orderedTimes).toEqual([...orderedTimes].sort((a, b) => a - b));

      const duration = Math.max(
        ...phrase.notes.map((note) => note.time + note.duration),
      );
      expect(duration).toBeGreaterThanOrEqual(8);
      expect(duration).toBeLessThanOrEqual(12);

      for (const note of phrase.notes) {
        expect(note.pitch).toMatch(/^[A-G][#b]?\d$/);
        expect(note.duration).toBeGreaterThan(0);
        expect(Number.isFinite(note.staffOffset)).toBe(true);
      }
    }
  });
});
