import type {CurveProfile, ScoreNote} from "@/content/score-phrases";

export type CurvePoint = {
  angle: number;
  x: number;
  y: number;
};

function pointAt(profile: CurveProfile, progress: number) {
  const points = profile.points;
  const lastIndex = points.length - 1;
  const scaled = Math.min(1, Math.max(0, progress)) * lastIndex;
  const index = Math.min(Math.floor(scaled), lastIndex - 1);
  const t = scaled - index;
  const p0 = points[Math.max(0, index - 1)];
  const p1 = points[index];
  const p2 = points[Math.min(lastIndex, index + 1)];
  const p3 = points[Math.min(lastIndex, index + 2)];
  const t2 = t * t;
  const t3 = t2 * t;

  const interpolate = (axis: 0 | 1) =>
    0.5 *
    (2 * p1[axis] +
      (-p0[axis] + p2[axis]) * t +
      (2 * p0[axis] - 5 * p1[axis] + 4 * p2[axis] - p3[axis]) * t2 +
      (-p0[axis] + 3 * p1[axis] - 3 * p2[axis] + p3[axis]) * t3);

  return {x: interpolate(0), y: interpolate(1)};
}

function curvePointAt(profile: CurveProfile, progress: number): CurvePoint {
  const point = pointAt(profile, progress);
  const before = pointAt(profile, progress - 0.001);
  const after = pointAt(profile, progress + 0.001);

  return {
    ...point,
    angle: (Math.atan2(after.y - before.y, after.x - before.x) * 180) / Math.PI,
  };
}

export function sampleCurve(profile: CurveProfile, count: number): CurvePoint[] {
  const safeCount = Math.max(2, Math.floor(count));

  return Array.from({length: safeCount}, (_, index) =>
    curvePointAt(profile, index / (safeCount - 1)),
  );
}

export function buildStaffPaths(profile: CurveProfile): string[] {
  const points = sampleCurve(profile, 144);

  return [-12, -6, 0, 6, 12].map((offset) =>
    points
      .map((point, index) => {
        const radians = (point.angle * Math.PI) / 180;
        const x = point.x - Math.sin(radians) * offset;
        const y = point.y + Math.cos(radians) * offset;

        return `${index === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" "),
  );
}

export function placeNotes(
  profile: CurveProfile,
  notes: readonly ScoreNote[],
): CurvePoint[] {
  const totalDuration = Math.max(
    1,
    ...notes.map((note) => note.time + note.duration),
  );

  return notes.map((note) => {
    const point = curvePointAt(profile, note.time / totalDuration);
    const radians = (point.angle * Math.PI) / 180;
    const offset = note.staffOffset * 3;

    return {
      angle: point.angle,
      x: point.x - Math.sin(radians) * offset,
      y: point.y + Math.cos(radians) * offset,
    };
  });
}
