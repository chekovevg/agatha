function clampByte(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const amount = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return amount * amount * (3 - 2 * amount);
}

type BrushStroke = {
  centerAcross: number;
  centerAlong: number;
  intensity: number;
  length: number;
  phase: number;
  width: number;
};

const REFERENCE_BRUSH_STROKES: ReadonlyArray<BrushStroke> = [
  {centerAcross: 0.49, centerAlong: 0.22, intensity: 0.74, length: 0.38, phase: 0.4, width: 0.05},
  {centerAcross: 0.47, centerAlong: 0.76, intensity: 0.92, length: 0.52, phase: 2.1, width: 0.075},
  {centerAcross: 0.46, centerAlong: 1.45, intensity: 0.84, length: 0.56, phase: 4.4, width: 0.07},
  {centerAcross: 0.25, centerAlong: 0.35, intensity: 0.8, length: 0.48, phase: 1.2, width: 0.055},
  {centerAcross: 0.23, centerAlong: 1.05, intensity: 1, length: 0.74, phase: 5.2, width: 0.09},
  {centerAcross: 0.2, centerAlong: 1.72, intensity: 0.74, length: 0.32, phase: 3.6, width: 0.05},
  {centerAcross: 0.02, centerAlong: 0.2, intensity: 0.72, length: 0.3, phase: 0.8, width: 0.045},
  {centerAcross: 0, centerAlong: 0.73, intensity: 0.9, length: 0.6, phase: 2.8, width: 0.075},
  {centerAcross: -0.03, centerAlong: 1.45, intensity: 0.96, length: 0.72, phase: 4.9, width: 0.09},
  {centerAcross: -0.24, centerAlong: 0.35, intensity: 0.78, length: 0.42, phase: 1.7, width: 0.055},
  {centerAcross: -0.25, centerAlong: 1.06, intensity: 1, length: 0.86, phase: 5.8, width: 0.105},
  {centerAcross: -0.29, centerAlong: 1.72, intensity: 0.72, length: 0.34, phase: 3.1, width: 0.05},
  {centerAcross: -0.51, centerAlong: 0.62, intensity: 0.76, length: 0.5, phase: 0.2, width: 0.06},
  {centerAcross: -0.52, centerAlong: 1.36, intensity: 0.94, length: 0.68, phase: 4, width: 0.085},
  {centerAcross: -0.76, centerAlong: 0.32, intensity: 0.68, length: 0.32, phase: 2.4, width: 0.045},
  {centerAcross: -0.78, centerAlong: 0.92, intensity: 0.86, length: 0.62, phase: 5.5, width: 0.07},
  {centerAcross: -0.76, centerAlong: 1.65, intensity: 0.76, length: 0.38, phase: 1, width: 0.05},
  {centerAcross: -1.02, centerAlong: 1.45, intensity: 0.78, length: 0.48, phase: 3.4, width: 0.065},
] as const;

function getBrushAmount(u: number, v: number, aspect: number) {
  const directionX = Math.SQRT1_2;
  const directionY = Math.SQRT1_2;
  let remainingRose = 1;

  for (const stroke of REFERENCE_BRUSH_STROKES) {
    const pointX = u * aspect;
    const along =
      pointX * directionX + v * directionY - stroke.centerAlong;
    const across =
      -pointX * directionY + v * directionX - stroke.centerAcross;
    const edgeWobble =
      Math.sin(along * 31 + stroke.phase) * stroke.width * 0.11 +
      Math.sin(along * 67 - stroke.phase * 1.7) * stroke.width * 0.035;
    const widthVariation =
      1 +
      Math.sin(along * 18 + stroke.phase) * 0.13 +
      Math.sin(along * 43 - stroke.phase) * 0.045;
    const beyondEnd = Math.max(0, Math.abs(along) - stroke.length * 0.5);
    const distance = Math.hypot(
      across - edgeWobble,
      beyondEnd * 1.35,
    );
    const radius = stroke.width * widthVariation;
    const mask =
      (1 - smoothstep(radius * 0.34, radius * 1.04, distance)) *
      stroke.intensity;

    remainingRose *= 1 - mask;
  }

  return 1 - remainingRose;
}

function createRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function createReferenceGradientData(width: number, height: number) {
  if (width <= 0 || height <= 0) {
    throw new Error("Reference gradient dimensions must be positive");
  }

  const data = new Uint8Array(width * height * 4);
  const rose = [205, 117, 109];
  const dustyRose = [221, 143, 124];
  const peach = [255, 168, 125];
  const apricot = [255, 198, 150];
  const aspect = width / height;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = width === 1 ? 0.5 : x / (width - 1);
      const v = height === 1 ? 0.5 : y / (height - 1);
      const brush = getBrushAmount(u, v, aspect);
      const ambientGlow = Math.exp(
        -(
          ((u - 0.52) * (u - 0.52)) / 0.42 +
          ((v - 0.48) * (v - 0.48)) / 0.7
        ),
      );
      const edge = Math.min(1, Math.hypot((u - 0.5) * 1.2, v - 0.5));
      const offset = (y * width + x) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        const base = mix(
          rose[channel],
          dustyRose[channel],
          ambientGlow * 0.38,
        );
        const strokeColor = mix(
          peach[channel],
          apricot[channel],
          brush * 0.42,
        );
        data[offset + channel] = clampByte(
          mix(base, strokeColor, brush) - edge * 7,
        );
      }

      data[offset + 3] = 255;
    }
  }

  return data;
}

export function createReferenceNoiseData(size: number, seed = 20260711) {
  if (size < 2) {
    throw new Error("Reference noise size must be at least 2");
  }

  const random = createRandom(seed);
  const source = new Float32Array(size * size);
  const data = new Uint8Array(size * size * 2);

  for (let index = 0; index < source.length; index += 1) {
    source[index] = random();
  }

  const read = (x: number, y: number) => {
    const wrappedX = (x + size) % size;
    const wrappedY = (y + size) % size;
    return source[wrappedY * size + wrappedX];
  };

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let localAverage = 0;

      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
          localAverage += read(x + offsetX, y + offsetY);
        }
      }

      localAverage /= 9;
      const index = y * size + x;
      const output = index * 2;
      data[output] = clampByte(128 + (source[index] - localAverage) * 420);
      data[output + 1] = clampByte(
        128 + (read(x + 5, y + 3) - localAverage) * 420,
      );
    }
  }

  return data;
}
