function clampByte(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mix(a: number, b: number, amount: number) {
  return a + (b - a) * amount;
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
  const rose = [188, 112, 103];
  const peach = [248, 164, 132];
  const apricot = [255, 202, 157];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const u = width === 1 ? 0.5 : x / (width - 1);
      const v = height === 1 ? 0.5 : y / (height - 1);
      const diagonal = Math.max(0, Math.min(1, u * 0.62 + (1 - v) * 0.38));
      const glow = Math.exp(
        -(
          ((u - 0.58) * (u - 0.58)) / 0.13 +
          ((v - 0.34) * (v - 0.34)) / 0.22
        ),
      );
      const edge = Math.min(1, Math.hypot((u - 0.5) * 1.2, v - 0.5));
      const offset = (y * width + x) * 4;

      for (let channel = 0; channel < 3; channel += 1) {
        const base = mix(rose[channel], peach[channel], diagonal);
        data[offset + channel] = clampByte(
          mix(base, apricot[channel], glow * 0.56) - edge * 12,
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
