export type ScoreNote = {
  duration: number;
  pitch: string;
  staffOffset: number;
  time: number;
};

export type CurveProfile = {
  id: "ribbon" | "pebble" | "arch";
  points: readonly (readonly [number, number])[];
};

export type ScorePhrase = {
  bpm: number;
  composer: string;
  curve: CurveProfile;
  id: string;
  licence: string;
  notes: readonly ScoreNote[];
  sourceUrl: string;
  work: string;
};

const ribbon: CurveProfile = {
  id: "ribbon",
  points: [
    [82, 250],
    [150, 126],
    [370, 80],
    [682, 60],
    [898, 146],
    [916, 296],
    [736, 392],
    [430, 404],
    [178, 350],
    [82, 250],
  ],
};

const pebble: CurveProfile = {
  id: "pebble",
  points: [
    [104, 286],
    [232, 98],
    [460, 72],
    [760, 104],
    [908, 236],
    [774, 382],
    [456, 414],
    [202, 356],
    [104, 286],
  ],
};

const arch: CurveProfile = {
  id: "arch",
  points: [
    [86, 292],
    [202, 132],
    [390, 104],
    [500, 206],
    [612, 92],
    [820, 120],
    [920, 270],
    [820, 388],
    [608, 378],
    [500, 278],
    [382, 402],
    [178, 370],
    [86, 292],
  ],
};

const beethovenOdeToJoy: ScorePhrase = {
  id: "beethoven-ode-to-joy",
  composer: "Ludwig van Beethoven",
  work: "Ode to Joy — theme",
  bpm: 108,
  curve: ribbon,
  licence: "Public Domain — Mutopia Project edition",
  sourceUrl: "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=528",
  notes: [
    {pitch: "E4", time: 0, duration: 0.45, staffOffset: -2},
    {pitch: "E4", time: 0.55, duration: 0.45, staffOffset: -2},
    {pitch: "F4", time: 1.1, duration: 0.45, staffOffset: -1},
    {pitch: "G4", time: 1.65, duration: 0.45, staffOffset: 0},
    {pitch: "G4", time: 2.2, duration: 0.45, staffOffset: 0},
    {pitch: "F4", time: 2.75, duration: 0.45, staffOffset: -1},
    {pitch: "E4", time: 3.3, duration: 0.45, staffOffset: -2},
    {pitch: "D4", time: 3.85, duration: 0.45, staffOffset: -3},
    {pitch: "C4", time: 4.4, duration: 0.45, staffOffset: -4},
    {pitch: "C4", time: 4.95, duration: 0.45, staffOffset: -4},
    {pitch: "D4", time: 5.5, duration: 0.45, staffOffset: -3},
    {pitch: "E4", time: 6.05, duration: 0.45, staffOffset: -2},
    {pitch: "E4", time: 6.6, duration: 0.45, staffOffset: -2},
    {pitch: "D4", time: 7.15, duration: 0.45, staffOffset: -3},
    {pitch: "D4", time: 7.7, duration: 1.1, staffOffset: -3},
  ],
};

const mozartVariationsTheme: ScorePhrase = {
  id: "mozart-k265-theme",
  composer: "Wolfgang Amadeus Mozart",
  work: "Twelve Variations, K. 265 — theme",
  bpm: 100,
  curve: pebble,
  licence: "Public Domain — Mutopia Project edition",
  sourceUrl: "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2236",
  notes: [
    {pitch: "C5", time: 0, duration: 0.5, staffOffset: 3},
    {pitch: "C5", time: 0.6, duration: 0.5, staffOffset: 3},
    {pitch: "G5", time: 1.2, duration: 0.5, staffOffset: 7},
    {pitch: "G5", time: 1.8, duration: 0.5, staffOffset: 7},
    {pitch: "A5", time: 2.4, duration: 0.5, staffOffset: 8},
    {pitch: "A5", time: 3, duration: 0.5, staffOffset: 8},
    {pitch: "G5", time: 3.6, duration: 1.1, staffOffset: 7},
    {pitch: "F5", time: 4.8, duration: 0.5, staffOffset: 6},
    {pitch: "F5", time: 5.4, duration: 0.5, staffOffset: 6},
    {pitch: "E5", time: 6, duration: 0.5, staffOffset: 5},
    {pitch: "E5", time: 6.6, duration: 0.5, staffOffset: 5},
    {pitch: "D5", time: 7.2, duration: 0.5, staffOffset: 4},
    {pitch: "D5", time: 7.8, duration: 0.5, staffOffset: 4},
    {pitch: "C5", time: 8.4, duration: 1.2, staffOffset: 3},
  ],
};

const beethovenFurElise: ScorePhrase = {
  id: "beethoven-fur-elise",
  composer: "Ludwig van Beethoven",
  work: "Für Elise, WoO 59 — opening",
  bpm: 72,
  curve: arch,
  licence: "Public Domain — Mutopia Project edition",
  sourceUrl: "https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931",
  notes: [
    {pitch: "E5", time: 0, duration: 0.35, staffOffset: 5},
    {pitch: "D#5", time: 0.45, duration: 0.35, staffOffset: 4},
    {pitch: "E5", time: 0.9, duration: 0.35, staffOffset: 5},
    {pitch: "D#5", time: 1.35, duration: 0.35, staffOffset: 4},
    {pitch: "E5", time: 1.8, duration: 0.35, staffOffset: 5},
    {pitch: "B4", time: 2.25, duration: 0.35, staffOffset: 2},
    {pitch: "D5", time: 2.7, duration: 0.35, staffOffset: 4},
    {pitch: "C5", time: 3.15, duration: 0.35, staffOffset: 3},
    {pitch: "A4", time: 3.6, duration: 0.9, staffOffset: 1},
    {pitch: "C4", time: 4.5, duration: 0.35, staffOffset: -4},
    {pitch: "E4", time: 4.95, duration: 0.35, staffOffset: -2},
    {pitch: "A4", time: 5.4, duration: 0.35, staffOffset: 1},
    {pitch: "B4", time: 5.85, duration: 0.8, staffOffset: 2},
    {pitch: "E4", time: 6.75, duration: 0.35, staffOffset: -2},
    {pitch: "G#4", time: 7.2, duration: 0.35, staffOffset: 0},
    {pitch: "B4", time: 7.65, duration: 0.35, staffOffset: 2},
    {pitch: "C5", time: 8.1, duration: 1, staffOffset: 3},
  ],
};

export const scorePhrases = [
  beethovenOdeToJoy,
  mozartVariationsTheme,
  beethovenFurElise,
] as const satisfies readonly ScorePhrase[];
