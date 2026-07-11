# Reference WebGL Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in `Reference GL` WebGL2 hero variant that recreates the verified microsoft.ai multipass peach-bokeh rendering pattern while keeping Canvas as the production default and preserving Legacy GL and ASCII.

**Architecture:** Keep React lifecycle in a small client component and dynamically import a dependency-free WebGL2 renderer only when the new variant is near the viewport. The renderer reuses one full-screen triangle, two ping-pong framebuffer targets, deterministic generated textures, pass-specific GLSL ES 3.00 programs, and a single-frame scheduler.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, browser WebGL2, Vitest, Playwright, Tailwind CSS 4/global CSS, npm.

## Global Constraints

- Production `/` must continue to select the existing 2D Canvas hero.
- Preserve the existing `?hero=webgl` Legacy GL and ASCII behavior.
- Add `?hero=reference-webgl`; comparison order is Canvas, Legacy GL, Reference GL, ASCII.
- Keep the current `100svh` hero layout; do not add the deferred `200vh` sticky continuation.
- Do not add dependencies or copy Microsoft code, shaders, textures, fonts, or source-map content.
- Render at exactly half CSS resolution on desktop and mobile, independent of device pixel ratio.
- Honor `prefers-reduced-motion`, hidden-document, offscreen, and scroll-pause states.
- Preserve the user's existing `::selection` changes in `app/globals.css` and `tests/home-hero.test.tsx`.
- Do not change copy, typography, header, CTA, booking, content sections, or deployment configuration.
- Follow red-green-refactor: every production change is preceded by a focused failing test.

---

## File Map

- Create `components/ui/reference-webgl/runtime.ts` — half-resolution sizing and single-frame scheduler.
- Create `components/ui/reference-webgl/textures.ts` — deterministic gradient and noise texture bytes.
- Create `components/ui/reference-webgl/shaders.ts` — WebGL2 full-screen vertex shader and six pass shaders.
- Create `components/ui/reference-webgl/renderer.ts` — GL resources, ping-pong passes, uniforms, lifecycle.
- Create `components/ui/ReferenceWebGLHeroBackground.tsx` — React/browser lifecycle and lazy renderer import.
- Modify `components/ui/HomeHeroBackground.tsx` — query contract and four-way comparison switcher.
- Modify `app/globals.css` — isolated Reference GL fallback/canvas/switcher rules.
- Create `tests/reference-webgl-runtime.test.ts` — sizing and scheduler behavior.
- Create `tests/reference-webgl-textures.test.ts` — deterministic texture output.
- Create `tests/reference-webgl-shaders.test.ts` — WebGL2/pass shader contract.
- Create `tests/reference-webgl-renderer.test.ts` — renderer source/resource contract and unsupported context.
- Modify `tests/home-hero.test.tsx` — variant integration regression contract.
- Modify `tests/e2e/site-smoke.spec.ts` — real Chromium WebGL2 smoke proof.
- Modify `docs/MICROSOFT_AI_HOME_MAPPING.md` — record the optional reference variant.

---

### Task 1: Add half-resolution sizing and the single-frame scheduler

**Files:**
- Create: `tests/reference-webgl-runtime.test.ts`
- Create: `components/ui/reference-webgl/runtime.ts`

**Interfaces:**
- Produces `getReferenceRenderSize(cssWidth, cssHeight)` for renderer resize.
- Produces `createSingleFrameScheduler(requestFrame, cancelFrame, draw)` for renderer animation.

- [ ] **Step 1: Write the failing runtime tests**

Create `tests/reference-webgl-runtime.test.ts`:

```ts
import {describe, expect, it} from "vitest";

import {
  createSingleFrameScheduler,
  getReferenceRenderSize,
} from "@/components/ui/reference-webgl/runtime";

describe("reference WebGL runtime", () => {
  it("renders at half CSS resolution with safe minimum dimensions", () => {
    expect(getReferenceRenderSize(1440, 900)).toEqual({width: 720, height: 450});
    expect(getReferenceRenderSize(390, 844)).toEqual({width: 195, height: 422});
    expect(getReferenceRenderSize(0, -20)).toEqual({width: 1, height: 1});
  });

  it("keeps at most one animation frame pending", () => {
    let nextHandle = 1;
    const callbacks = new Map<number, FrameRequestCallback>();
    const cancelled: number[] = [];
    const frames: number[] = [];

    const requestFrame = (callback: FrameRequestCallback) => {
      const handle = nextHandle++;
      callbacks.set(handle, callback);
      return handle;
    };
    const cancelFrame = (handle: number) => {
      cancelled.push(handle);
      callbacks.delete(handle);
    };
    const scheduler = createSingleFrameScheduler(
      requestFrame,
      cancelFrame,
      (time) => frames.push(time),
    );

    scheduler.resume();
    scheduler.resume();
    expect(callbacks.size).toBe(1);

    const [[handle, callback]] = callbacks;
    callbacks.delete(handle);
    callback(16);

    expect(frames).toEqual([16]);
    expect(callbacks.size).toBe(1);

    scheduler.pause();
    expect(callbacks.size).toBe(0);
    expect(cancelled).toHaveLength(1);

    scheduler.resume();
    expect(callbacks.size).toBe(1);
    scheduler.destroy();
    expect(callbacks.size).toBe(0);

    scheduler.resume();
    expect(callbacks.size).toBe(0);
  });
});
```

- [ ] **Step 2: Run the runtime test and verify RED**

Run:

```powershell
npm.cmd test -- tests/reference-webgl-runtime.test.ts
```

Expected: FAIL because `components/ui/reference-webgl/runtime.ts` does not exist.

- [ ] **Step 3: Implement the runtime helpers**

Create `components/ui/reference-webgl/runtime.ts`:

```ts
export const REFERENCE_RENDER_SCALE = 0.5;

export function getReferenceRenderSize(cssWidth: number, cssHeight: number) {
  return {
    width: Math.max(1, Math.round(Math.max(0, cssWidth) * REFERENCE_RENDER_SCALE)),
    height: Math.max(1, Math.round(Math.max(0, cssHeight) * REFERENCE_RENDER_SCALE)),
  };
}

export function createSingleFrameScheduler(
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (handle: number) => void,
  draw: FrameRequestCallback,
) {
  let frameHandle: number | null = null;
  let active = false;
  let disposed = false;

  const schedule = () => {
    if (!active || disposed || frameHandle !== null) {
      return;
    }

    frameHandle = requestFrame(tick);
  };

  const tick: FrameRequestCallback = (time) => {
    frameHandle = null;

    if (!active || disposed) {
      return;
    }

    draw(time);
    schedule();
  };

  const pause = () => {
    active = false;

    if (frameHandle !== null) {
      cancelFrame(frameHandle);
      frameHandle = null;
    }
  };

  return {
    destroy() {
      pause();
      disposed = true;
    },
    pause,
    resume() {
      if (disposed) {
        return;
      }

      active = true;
      schedule();
    },
  };
}
```

- [ ] **Step 4: Run the runtime test and verify GREEN**

Run:

```powershell
npm.cmd test -- tests/reference-webgl-runtime.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit the runtime foundation**

```powershell
git add components/ui/reference-webgl/runtime.ts tests/reference-webgl-runtime.test.ts
git commit -m "feat: add reference hero frame runtime"
```

---

### Task 2: Generate deterministic gradient and noise texture data

**Files:**
- Create: `tests/reference-webgl-textures.test.ts`
- Create: `components/ui/reference-webgl/textures.ts`

**Interfaces:**
- Produces `createReferenceGradientData(width, height): Uint8Array` in RGBA layout.
- Produces `createReferenceNoiseData(size, seed): Uint8Array` in RG layout.

- [ ] **Step 1: Write the failing texture tests**

Create `tests/reference-webgl-textures.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the texture test and verify RED**

```powershell
npm.cmd test -- tests/reference-webgl-textures.test.ts
```

Expected: FAIL because `textures.ts` does not exist.

- [ ] **Step 3: Implement deterministic texture builders**

Create `components/ui/reference-webgl/textures.ts`:

```ts
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
```

- [ ] **Step 4: Run the texture test and verify GREEN**

```powershell
npm.cmd test -- tests/reference-webgl-textures.test.ts
```

Expected: 3 tests pass.

- [ ] **Step 5: Commit generated texture data**

```powershell
git add components/ui/reference-webgl/textures.ts tests/reference-webgl-textures.test.ts
git commit -m "feat: add reference hero texture data"
```

---

### Task 3: Add the pass-specific WebGL2 shaders

**Files:**
- Create: `tests/reference-webgl-shaders.test.ts`
- Create: `components/ui/reference-webgl/shaders.ts`

**Interfaces:**
- Produces `REFERENCE_VERTEX_SHADER`.
- Produces `REFERENCE_FRAGMENT_SHADERS` with `background`, `vignette`, `sine`, `shatter`, `bokeh`, and `composite`.

- [ ] **Step 1: Write the failing shader contract test**

Create `tests/reference-webgl-shaders.test.ts`:

```ts
import {describe, expect, it} from "vitest";

import {
  REFERENCE_FRAGMENT_SHADERS,
  REFERENCE_VERTEX_SHADER,
} from "@/components/ui/reference-webgl/shaders";

describe("reference WebGL shaders", () => {
  it("uses WebGL2 syntax for every pass", () => {
    expect(REFERENCE_VERTEX_SHADER).toContain("#version 300 es");
    expect(REFERENCE_VERTEX_SHADER).toContain("in vec2 a_position");

    expect(Object.keys(REFERENCE_FRAGMENT_SHADERS)).toEqual([
      "background",
      "vignette",
      "sine",
      "shatter",
      "bokeh",
      "composite",
    ]);

    for (const shader of Object.values(REFERENCE_FRAGMENT_SHADERS)) {
      expect(shader).toContain("#version 300 es");
      expect(shader).toContain("out vec4 fragColor");
      expect(shader).not.toContain("gl_FragColor");
    }
  });

  it("keeps the approved multipass controls", () => {
    expect(REFERENCE_FRAGMENT_SHADERS.vignette).toContain("u_pointer");
    expect(REFERENCE_FRAGMENT_SHADERS.sine).toContain("u_time");
    expect(REFERENCE_FRAGMENT_SHADERS.shatter).toContain("random2");
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain("const int ITERATIONS = 50");
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain("GOLDEN_ANGLE");
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain("u_noise");
  });
});
```

- [ ] **Step 2: Run the shader test and verify RED**

```powershell
npm.cmd test -- tests/reference-webgl-shaders.test.ts
```

Expected: FAIL because `shaders.ts` does not exist.

- [ ] **Step 3: Implement the complete shader module**

Create `components/ui/reference-webgl/shaders.ts` with these exports and no other runtime logic:

```ts
export const REFERENCE_VERTEX_SHADER = `#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const header = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 fragColor;`;

export const REFERENCE_FRAGMENT_SHADERS = {
  background: `${header}
uniform sampler2D u_gradient;
void main() {
  fragColor = texture(u_gradient, v_uv);
}`,
  vignette: `${header}
uniform sampler2D u_input;
uniform vec2 u_pointer;
uniform vec2 u_resolution;
mat2 rotate2d(float angle) {
  float sine = sin(angle);
  float cosine = cos(angle);
  return mat2(cosine, -sine, sine, cosine);
}
void main() {
  vec3 color = texture(u_input, v_uv).rgb;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 point = (v_uv - u_pointer) * vec2(aspect, 1.0);
  point = rotate2d(-0.18) * point;
  float distanceFromPointer = length(point / vec2(0.72, 0.5));
  float vignette = smoothstep(0.18, 1.05, distanceFromPointer);
  vec3 shadow = vec3(0.29, 0.10, 0.22);
  fragColor = vec4(mix(color, shadow, vignette * 0.42), 1.0);
}`,
  sine: `${header}
uniform sampler2D u_input;
uniform vec2 u_resolution;
uniform float u_time;
void main() {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 centered = v_uv * 2.0 - 1.0;
  centered.x *= aspect;
  centered.x += sin(centered.y * 7.0 + u_time * 0.52) * 0.035;
  centered.y += sin(centered.x * 4.5 - u_time * 0.38) * 0.022;
  centered.x /= aspect;
  fragColor = texture(u_input, centered * 0.5 + 0.5);
}`,
  shatter: `${header}
uniform sampler2D u_input;
uniform vec2 u_resolution;
uniform float u_time;
vec2 random2(vec2 point) {
  return fract(sin(vec2(
    dot(point, vec2(127.1, 311.7)),
    dot(point, vec2(269.5, 183.3))
  )) * 43758.5453);
}
void main() {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 space = (v_uv - 0.5) * vec2(aspect, 1.0) * 7.0;
  vec2 cell = floor(space);
  vec2 local = fract(space);
  vec2 nearest = vec2(0.0);
  float nearestDistance = 10.0;
  for (int y = -1; y <= 1; y += 1) {
    for (int x = -1; x <= 1; x += 1) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = neighbor + 0.5 + 0.36 * sin(
        6.2831853 * random2(cell + neighbor) + u_time * 0.16
      );
      vec2 difference = point - local;
      float candidate = dot(difference, difference);
      if (candidate < nearestDistance) {
        nearestDistance = candidate;
        nearest = difference;
      }
    }
  }
  float strength = (1.0 - smoothstep(0.02, 0.48, nearestDistance)) * 0.018;
  fragColor = texture(u_input, v_uv + normalize(nearest + 0.0001) * strength);
}`,
  bokeh: `${header}
uniform sampler2D u_input;
uniform sampler2D u_noise;
uniform vec2 u_resolution;
uniform float u_time;
const int ITERATIONS = 50;
const float GOLDEN_ANGLE = 2.39996323;
void main() {
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 noiseUv = fract(v_uv * u_resolution / 256.0);
  vec2 noiseValue = texture(u_noise, noiseUv).rg - 0.5;
  float noiseAngle = (noiseValue.x + noiseValue.y + u_time * 0.003) * 6.2831853;
  mat2 rotation = mat2(
    cos(noiseAngle), -sin(noiseAngle),
    sin(noiseAngle), cos(noiseAngle)
  );
  vec3 accumulated = vec3(0.0);
  vec3 weights = vec3(0.0);
  for (int index = 0; index < ITERATIONS; index += 1) {
    float sampleIndex = float(index) + 0.5;
    float radius = sqrt(sampleIndex / float(ITERATIONS));
    float angle = sampleIndex * GOLDEN_ANGLE;
    vec2 offset = rotation * vec2(cos(angle), sin(angle));
    offset *= radius * vec2(0.085 / aspect, 0.085);
    vec3 sampleColor = texture(u_input, v_uv + offset).rgb;
    vec3 sampleWeight = vec3(5.0) + pow(max(sampleColor, 0.0), vec3(9.0)) * 150.0;
    accumulated += sampleColor * sampleWeight;
    weights += sampleWeight;
  }
  fragColor = vec4(accumulated / max(weights, vec3(0.0001)), 1.0);
}`,
  composite: `${header}
uniform sampler2D u_input;
uniform sampler2D u_gradient;
void main() {
  vec3 base = texture(u_gradient, v_uv).rgb;
  vec3 bokeh = texture(u_input, v_uv).rgb;
  vec3 multiplyBlend = base * mix(vec3(1.0), bokeh, 0.34);
  vec3 apricot = vec3(1.0, 0.79, 0.62);
  float luminance = dot(bokeh, vec3(0.299, 0.587, 0.114));
  vec3 color = mix(base, multiplyBlend, 0.56);
  color = mix(color, apricot, smoothstep(0.56, 0.92, luminance) * 0.18);
  fragColor = vec4(color, 1.0);
}`,
} as const;
```

- [ ] **Step 4: Run the shader test and verify GREEN**

```powershell
npm.cmd test -- tests/reference-webgl-shaders.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Commit shader sources**

```powershell
git add components/ui/reference-webgl/shaders.ts tests/reference-webgl-shaders.test.ts
git commit -m "feat: add reference hero shader passes"
```

---

### Task 4: Build the WebGL2 ping-pong renderer

**Files:**
- Create: `tests/reference-webgl-renderer.test.ts`
- Create: `components/ui/reference-webgl/renderer.ts`

**Interfaces:**
- Consumes runtime sizing/scheduler, generated textures, and shader sources.
- Produces `createReferenceHeroRenderer(canvas): ReferenceHeroRenderer | null`.
- Re-exports `getReferenceRenderSize` and `createSingleFrameScheduler` to preserve the approved design interface.

- [ ] **Step 1: Write a failing renderer contract test**

Create `tests/reference-webgl-renderer.test.ts`:

```ts
import {existsSync, readFileSync} from "node:fs";

import {describe, expect, it} from "vitest";

const rendererUrl = new URL(
  "../components/ui/reference-webgl/renderer.ts",
  import.meta.url,
);

describe("reference WebGL renderer", () => {
  it("owns the WebGL2 multipass resource contract", () => {
    const exists = existsSync(rendererUrl);
    expect(exists).toBe(true);
    if (!exists) return;

    const source = readFileSync(rendererUrl, "utf8");
    expect(source).toContain('getContext("webgl2"');
    expect(source).toContain("createFramebuffer");
    expect(source).toContain("REFERENCE_FRAGMENT_SHADERS.background");
    expect(source).toContain("REFERENCE_FRAGMENT_SHADERS.bokeh");
    expect(source).toContain("createSingleFrameScheduler");
    expect(source).toContain("deleteFramebuffer");
    expect(source).toContain("deleteProgram");
    expect(source).toContain("deleteTexture");
  });
});
```

- [ ] **Step 2: Run the renderer test and verify RED**

```powershell
npm.cmd test -- tests/reference-webgl-renderer.test.ts
```

Expected: FAIL at `expect(exists).toBe(true)`.

- [ ] **Step 3: Implement the renderer module**

Create `components/ui/reference-webgl/renderer.ts` with these concrete units:

```ts
import {
  createSingleFrameScheduler,
  getReferenceRenderSize,
} from "@/components/ui/reference-webgl/runtime";
import {
  REFERENCE_FRAGMENT_SHADERS,
  REFERENCE_VERTEX_SHADER,
} from "@/components/ui/reference-webgl/shaders";
import {
  createReferenceGradientData,
  createReferenceNoiseData,
} from "@/components/ui/reference-webgl/textures";

export {createSingleFrameScheduler, getReferenceRenderSize};

export type ReferenceHeroRenderer = {
  destroy(): void;
  drawStaticFrame(): void;
  pause(): void;
  resize(cssWidth: number, cssHeight: number): void;
  resume(): void;
  setPointer(x: number, y: number): void;
};

type PassName = keyof typeof REFERENCE_FRAGMENT_SHADERS;
type ProgramInfo = {
  program: WebGLProgram;
  uniform(name: string): WebGLUniformLocation | null;
};
type RenderTarget = {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
};

function compileShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create Reference GL shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: WebGL2RenderingContext, fragmentSource: string): ProgramInfo {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, REFERENCE_VERTEX_SHADER);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create Reference GL program");
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unknown program error";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  const uniforms = new Map<string, WebGLUniformLocation | null>();
  return {
    program,
    uniform(name) {
      if (!uniforms.has(name)) uniforms.set(name, gl.getUniformLocation(program, name));
      return uniforms.get(name) ?? null;
    },
  };
}

function createTexture(
  gl: WebGL2RenderingContext,
  width: number,
  height: number,
  internalFormat: number,
  format: number,
  data: Uint8Array | null,
) {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Unable to create Reference GL texture");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    internalFormat,
    width,
    height,
    0,
    format,
    gl.UNSIGNED_BYTE,
    data,
  );
  return texture;
}

function createRenderTarget(gl: WebGL2RenderingContext): RenderTarget {
  const texture = createTexture(gl, 1, 1, gl.RGBA8, gl.RGBA, null);
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) {
    gl.deleteTexture(texture);
    throw new Error("Unable to create Reference GL framebuffer");
  }
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0,
  );
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    throw new Error("Reference GL framebuffer is incomplete");
  }
  return {framebuffer, texture};
}

function resizeRenderTarget(
  gl: WebGL2RenderingContext,
  target: RenderTarget,
  width: number,
  height: number,
) {
  gl.bindTexture(gl.TEXTURE_2D, target.texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA8,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null,
  );
}

export function createReferenceHeroRenderer(
  canvas: HTMLCanvasElement,
): ReferenceHeroRenderer | null {
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    antialias: false,
    depth: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
    stencil: false,
  });
  if (!gl) return null;

  const programs = Object.fromEntries(
    (Object.keys(REFERENCE_FRAGMENT_SHADERS) as PassName[]).map((name) => [
      name,
      createProgram(gl, REFERENCE_FRAGMENT_SHADERS[name]),
    ]),
  ) as Record<PassName, ProgramInfo>;
  const vertexArray = gl.createVertexArray();
  const vertexBuffer = gl.createBuffer();
  if (!vertexArray || !vertexBuffer) throw new Error("Unable to create Reference GL geometry");
  gl.bindVertexArray(vertexArray);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const gradient = createTexture(
    gl,
    256,
    154,
    gl.RGBA8,
    gl.RGBA,
    createReferenceGradientData(256, 154),
  );
  const noise = createTexture(
    gl,
    256,
    256,
    gl.RG8,
    gl.RG,
    createReferenceNoiseData(256),
  );
  const targets = [createRenderTarget(gl), createRenderTarget(gl)] as const;
  let width = 1;
  let height = 1;
  let disposed = false;
  let elapsed = 0;
  let lastTimestamp: number | null = null;
  const pointerTarget = {x: 0.5, y: 0.5};
  const pointerCurrent = {x: 0.5, y: 0.5};

  const bindTexture = (
    program: ProgramInfo,
    name: string,
    texture: WebGLTexture,
    unit: number,
  ) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(program.uniform(name), unit);
  };

  const renderPass = (
    name: PassName,
    output: RenderTarget | null,
    configure: (program: ProgramInfo) => void,
  ) => {
    const info = programs[name];
    gl.bindFramebuffer(gl.FRAMEBUFFER, output?.framebuffer ?? null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(info.program);
    gl.bindVertexArray(vertexArray);
    configure(info);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const renderFrame = (timestamp: number) => {
    if (disposed) return;
    if (lastTimestamp !== null) {
      elapsed += Math.min(0.05, Math.max(0, (timestamp - lastTimestamp) / 1000));
    }
    lastTimestamp = timestamp;
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.1;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.1;

    renderPass("background", targets[0], (program) => {
      bindTexture(program, "u_gradient", gradient, 0);
    });
    renderPass("vignette", targets[1], (program) => {
      bindTexture(program, "u_input", targets[0].texture, 0);
      gl.uniform2f(program.uniform("u_pointer"), pointerCurrent.x, pointerCurrent.y);
      gl.uniform2f(program.uniform("u_resolution"), width, height);
    });
    renderPass("sine", targets[0], (program) => {
      bindTexture(program, "u_input", targets[1].texture, 0);
      gl.uniform2f(program.uniform("u_resolution"), width, height);
      gl.uniform1f(program.uniform("u_time"), elapsed);
    });
    renderPass("shatter", targets[1], (program) => {
      bindTexture(program, "u_input", targets[0].texture, 0);
      gl.uniform2f(program.uniform("u_resolution"), width, height);
      gl.uniform1f(program.uniform("u_time"), elapsed);
    });
    renderPass("bokeh", targets[0], (program) => {
      bindTexture(program, "u_input", targets[1].texture, 0);
      bindTexture(program, "u_noise", noise, 1);
      gl.uniform2f(program.uniform("u_resolution"), width, height);
      gl.uniform1f(program.uniform("u_time"), elapsed);
    });
    renderPass("composite", null, (program) => {
      bindTexture(program, "u_input", targets[0].texture, 0);
      bindTexture(program, "u_gradient", gradient, 1);
    });
  };

  const scheduler = createSingleFrameScheduler(
    window.requestAnimationFrame.bind(window),
    window.cancelAnimationFrame.bind(window),
    renderFrame,
  );

  return {
    destroy() {
      if (disposed) return;
      disposed = true;
      scheduler.destroy();
      targets.forEach((target) => {
        gl.deleteFramebuffer(target.framebuffer);
        gl.deleteTexture(target.texture);
      });
      Object.values(programs).forEach(({program}) => gl.deleteProgram(program));
      gl.deleteTexture(gradient);
      gl.deleteTexture(noise);
      gl.deleteBuffer(vertexBuffer);
      gl.deleteVertexArray(vertexArray);
    },
    drawStaticFrame() {
      lastTimestamp = null;
      renderFrame(0);
    },
    pause() {
      scheduler.pause();
      lastTimestamp = null;
    },
    resize(cssWidth, cssHeight) {
      const size = getReferenceRenderSize(cssWidth, cssHeight);
      width = size.width;
      height = size.height;
      canvas.width = width;
      canvas.height = height;
      targets.forEach((target) => resizeRenderTarget(gl, target, width, height));
      renderFrame(0);
    },
    resume() {
      scheduler.resume();
    },
    setPointer(x, y) {
      pointerTarget.x = Math.max(0, Math.min(1, x));
      pointerTarget.y = Math.max(0, Math.min(1, y));
    },
  };
}
```

Add this cleanup helper above the exported factory:

```ts
function createCleanupStack() {
  const callbacks: Array<() => void> = [];
  let released = false;

  return {
    add(callback: () => void) {
      callbacks.push(callback);
    },
    release() {
      if (released) return;
      released = true;
      for (let index = callbacks.length - 1; index >= 0; index -= 1) {
        callbacks[index]();
      }
    },
  };
}
```

Inside `createReferenceHeroRenderer`, create `const resources =
createCleanupStack()` immediately after the successful `webgl2` lookup. Replace
the `Object.fromEntries` program creation with this registration loop:

```ts
const programs = {} as Record<PassName, ProgramInfo>;
for (const name of Object.keys(REFERENCE_FRAGMENT_SHADERS) as PassName[]) {
  const info = createProgram(gl, REFERENCE_FRAGMENT_SHADERS[name]);
  programs[name] = info;
  resources.add(() => gl.deleteProgram(info.program));
}
```

Register every subsequently created resource immediately after successful
creation:

```ts
resources.add(() => gl.deleteVertexArray(vertexArray));
resources.add(() => gl.deleteBuffer(vertexBuffer));
resources.add(() => gl.deleteTexture(gradient));
resources.add(() => gl.deleteTexture(noise));
targets.forEach((target) => {
  resources.add(() => gl.deleteFramebuffer(target.framebuffer));
  resources.add(() => gl.deleteTexture(target.texture));
});
```

Wrap all creation after `resources` plus the returned controller in `try/catch`.
The catch path must be exactly:

```ts
} catch (error) {
  resources.release();
  throw error;
}
```

Replace the controller's individual GL delete calls with:

```ts
destroy() {
  if (disposed) return;
  disposed = true;
  scheduler.destroy();
  resources.release();
},
```

This gives compile, link, geometry, texture, and framebuffer failures the same
idempotent cleanup path as normal disposal.

- [ ] **Step 4: Add and verify unsupported-context behavior**

Append to `tests/reference-webgl-renderer.test.ts` after the module exists:

```ts
it("returns null when WebGL2 is unsupported", async () => {
  const {createReferenceHeroRenderer} = await import(
    "@/components/ui/reference-webgl/renderer"
  );
  const canvas = {getContext: () => null} as unknown as HTMLCanvasElement;
  expect(createReferenceHeroRenderer(canvas)).toBeNull();
});
```

Run:

```powershell
npm.cmd test -- tests/reference-webgl-renderer.test.ts
```

Expected: 2 tests pass.

- [ ] **Step 5: Run all Reference GL unit tests**

```powershell
npm.cmd test -- tests/reference-webgl-runtime.test.ts tests/reference-webgl-textures.test.ts tests/reference-webgl-shaders.test.ts tests/reference-webgl-renderer.test.ts
```

Expected: all focused tests pass with no warnings.

- [ ] **Step 6: Commit the renderer**

```powershell
git add components/ui/reference-webgl/renderer.ts tests/reference-webgl-renderer.test.ts
git commit -m "feat: add reference hero webgl renderer"
```

---

### Task 5: Add the lazy React component and four-way variant integration

**Files:**
- Create: `components/ui/ReferenceWebGLHeroBackground.tsx`
- Modify: `components/ui/HomeHeroBackground.tsx`
- Modify: `app/globals.css`
- Modify: `tests/home-hero.test.tsx`
- Modify: `tests/e2e/site-smoke.spec.ts`

**Interfaces:**
- Consumes `createReferenceHeroRenderer` through dynamic import.
- Produces query value `reference-webgl` and switcher label `Reference GL`.
- Preserves `canvas`, `webgl`, and ASCII query contracts.

- [ ] **Step 1: Write the failing unit integration contract**

Add a focused test near the existing WebGL tests in `tests/home-hero.test.tsx`:

```ts
it("keeps Reference GL as an opt-in fourth hero variant", () => {
  const switcherUrl = new URL(
    "../components/ui/HomeHeroBackground.tsx",
    import.meta.url,
  );
  const componentUrl = new URL(
    "../components/ui/ReferenceWebGLHeroBackground.tsx",
    import.meta.url,
  );
  const componentExists = existsSync(componentUrl);
  const switcherSource = readFileSync(switcherUrl, "utf8");

  expect(componentExists).toBe(true);
  expect(switcherSource).toContain('"reference-webgl"');
  expect(switcherSource).toContain("<ReferenceWebGLHeroBackground />");
  expect(switcherSource).toContain("Legacy GL");
  expect(switcherSource).toContain("Reference GL");
  expect(switcherSource).toContain("Canvas");
  expect(switcherSource).toContain("ASCII");

  if (!componentExists) return;
  const componentSource = readFileSync(componentUrl, "utf8");
  expect(componentSource).toContain('data-hero-background="reference-webgl"');
  expect(componentSource).toContain("data-reference-webgl-status");
  expect(componentSource).toContain('"./reference-webgl/renderer"');
  expect(componentSource).toContain("IntersectionObserver");
  expect(componentSource).toContain("prefers-reduced-motion: reduce");
  expect(componentSource).toContain("webglcontextlost");
  expect(componentSource).toContain("webglcontextrestored");
});
```

- [ ] **Step 2: Run the unit test and verify RED**

```powershell
npm.cmd test -- tests/home-hero.test.tsx
```

Expected: FAIL because the component file and `reference-webgl` variant do not exist.

- [ ] **Step 3: Write the failing browser acceptance test**

Add to `tests/e2e/site-smoke.spec.ts`:

```ts
test("reference WebGL hero is opt-in and renders at half resolution", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const response = await page.goto(
    "/?hero=reference-webgl&heroCompare=1&ascii=0",
  );
  expect(response?.status()).toBe(200);

  const referenceButton = page.getByRole("button", {name: "Reference GL"});
  await expect(referenceButton).toHaveAttribute("aria-pressed", "true");

  const canvas = page.locator(".reference-webgl-hero-canvas");
  await expect(canvas).toHaveCount(1);
  await expect(canvas).toHaveAttribute("data-reference-webgl-status", "ready");

  const dimensions = await canvas.evaluate((element) => {
    const htmlCanvas = element as HTMLCanvasElement;
    const rect = htmlCanvas.getBoundingClientRect();
    return {
      cssHeight: rect.height,
      cssWidth: rect.width,
      height: htmlCanvas.height,
      width: htmlCanvas.width,
    };
  });
  expect(Math.abs(dimensions.width - Math.round(dimensions.cssWidth * 0.5))).toBeLessThanOrEqual(1);
  expect(Math.abs(dimensions.height - Math.round(dimensions.cssHeight * 0.5))).toBeLessThanOrEqual(1);
  expect(pageErrors).toEqual([]);

  await page.goto("/?ascii=0");
  await expect(page.locator('[data-home-hero-background-switcher="canvas"]')).toHaveCount(1);
  await expect(page.locator(".reference-webgl-hero-bg")).toHaveCount(0);
});
```

Build the unchanged production code and run only this test:

```powershell
npm.cmd run build
npm.cmd run e2e:run -- --grep "reference WebGL hero"
```

Expected: FAIL because the `Reference GL` button/canvas is absent.

- [ ] **Step 4: Implement the React lifecycle component**

Create `components/ui/ReferenceWebGLHeroBackground.tsx` as a client component with this exact lifecycle:

```tsx
"use client";

import {useEffect, useRef} from "react";

import type {ReferenceHeroRenderer} from "@/components/ui/reference-webgl/renderer";

type RendererStatus =
  | "idle"
  | "loading"
  | "ready"
  | "unsupported"
  | "error"
  | "context-lost";

export function ReferenceWebGLHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let renderer: ReferenceHeroRenderer | null = null;
    let disposed = false;
    let generation = 0;
    let importStarted = false;
    let intersecting = false;
    let scrolling = false;
    let scrollTimer: number | null = null;
    let staticFrameDrawn = false;

    const setStatus = (status: RendererStatus) => {
      canvas.dataset.referenceWebglStatus = status;
    };

    const reconcileMotionState = () => {
      if (!renderer) return;
      const blocked =
        !intersecting || document.visibilityState !== "visible" || scrolling;

      if (reducedMotion.matches) {
        renderer.pause();
        renderer.setPointer(0.5, 0.5);
        if (!staticFrameDrawn) {
          renderer.drawStaticFrame();
          staticFrameDrawn = true;
        }
        return;
      }

      staticFrameDrawn = false;
      if (blocked) renderer.pause();
      else renderer.resume();
    };

    const resize = () => {
      if (!renderer) return;
      const rect = canvas.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);
      staticFrameDrawn = reducedMotion.matches;
    };

    const initialize = async () => {
      if (disposed || importStarted || !intersecting) return;
      importStarted = true;
      const currentGeneration = ++generation;
      setStatus("loading");

      try {
        const {createReferenceHeroRenderer} = await import(
          "./reference-webgl/renderer"
        );
        if (disposed || currentGeneration !== generation) return;
        renderer = createReferenceHeroRenderer(canvas);
        if (!renderer) {
          setStatus("unsupported");
          return;
        }
        resize();
        renderer.drawStaticFrame();
        setStatus("ready");
        reconcileMotionState();
      } catch {
        if (!disposed && currentGeneration === generation) setStatus("error");
      }
    };

    const updatePointer = (event: PointerEvent) => {
      if (!renderer || reducedMotion.matches) return;
      const rect = canvas.getBoundingClientRect();
      renderer.setPointer(
        (event.clientX - rect.left) / Math.max(1, rect.width),
        1 - (event.clientY - rect.top) / Math.max(1, rect.height),
      );
    };
    const updateScroll = () => {
      scrolling = true;
      reconcileMotionState();
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        scrolling = false;
        scrollTimer = null;
        reconcileMotionState();
      }, 150);
    };
    const updateVisibility = () => reconcileMotionState();
    const updateReducedMotion = () => {
      staticFrameDrawn = false;
      reconcileMotionState();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      generation += 1;
      renderer?.destroy();
      renderer = null;
      importStarted = false;
      setStatus("context-lost");
    };
    const handleContextRestored = () => {
      setStatus("idle");
      void initialize();
    };

    const resizeObserver = new ResizeObserver(resize);
    let intersectionObserver: IntersectionObserver | null = null;

    resizeObserver.observe(canvas);
    if ("IntersectionObserver" in window) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          intersecting = entry.isIntersecting;
          if (intersecting) void initialize();
          reconcileMotionState();
        },
        {rootMargin: "300px"},
      );
      intersectionObserver.observe(canvas);
    } else {
      intersecting = true;
      void initialize();
    }
    reducedMotion.addEventListener("change", updateReducedMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener("pointermove", updatePointer, {passive: true});
    window.addEventListener("scroll", updateScroll, {passive: true});

    return () => {
      disposed = true;
      generation += 1;
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
      reducedMotion.removeEventListener("change", updateReducedMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      if (scrollTimer !== null) window.clearTimeout(scrollTimer);
      renderer?.destroy();
    };
  }, []);

  return (
    <div
      className="reference-webgl-hero-bg absolute inset-0 overflow-hidden"
      data-hero-background="reference-webgl"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="reference-webgl-hero-canvas block h-full w-full"
        data-reference-webgl-status="idle"
      />
    </div>
  );
}
```

- [ ] **Step 5: Add the fourth variant without changing defaults**

Modify `components/ui/HomeHeroBackground.tsx`:

```tsx
import {ReferenceWebGLHeroBackground} from "@/components/ui/ReferenceWebGLHeroBackground";

type HeroBackgroundVariant = "canvas" | "webgl" | "reference-webgl";

function readHeroVariant(): HeroBackgroundVariant {
  if (typeof window === "undefined") return "canvas";
  const value = new URLSearchParams(window.location.search).get("hero");
  return value === "webgl" || value === "reference-webgl" ? value : "canvas";
}
```

Update ASCII detection so any non-Canvas hero disables ASCII. Update `selectVariant` so Canvas deletes `hero`, while both GL variants set their exact query value. Render:

```tsx
{variant === "webgl" ? (
  <WebGLHeroBackground />
) : variant === "reference-webgl" ? (
  <ReferenceWebGLHeroBackground />
) : (
  <>
    <WatercolorHeroBackground />
    {isAsciiEnabled ? <AsciiHeroReveal /> : null}
  </>
)}
```

Keep the control opt-in and use this order/labels:

```tsx
<button>Canvas</button>
<button aria-pressed={variant === "webgl"}>Legacy GL</button>
<button aria-pressed={variant === "reference-webgl"}>Reference GL</button>
<button>ASCII</button>
```

Preserve the current classes, `data-active`, click handlers, `heroCompare=1`, and history behavior for each button.

- [ ] **Step 6: Add isolated fallback and canvas CSS**

Add immediately after the existing legacy WebGL rules in `app/globals.css`:

```css
.reference-webgl-hero-bg {
  background:
    radial-gradient(70rem 34rem at 58% 34%, rgba(255, 205, 159, 0.72), transparent 70%),
    linear-gradient(122deg, #bb7068, #ef9d82 54%, #c27a72 100%);
  pointer-events: none;
  z-index: 0;
}

.reference-webgl-hero-bg::after {
  background: linear-gradient(
    180deg,
    rgba(93, 82, 75, 0.08),
    rgba(93, 82, 75, 0.02) 44%,
    rgba(93, 82, 75, 0.14)
  );
  content: "";
  inset: 0;
  pointer-events: none;
  position: absolute;
}

.reference-webgl-hero-canvas {
  opacity: 0;
  position: relative;
  transition: opacity 0.45s var(--alias-easeOutCubic);
}

.reference-webgl-hero-canvas[data-reference-webgl-status="ready"] {
  opacity: 1;
}

@media (width < 600px) {
  .hero-background-switcher {
    bottom: 12px;
    left: 12px;
    max-width: calc(100vw - 24px);
    overflow-x: auto;
    right: auto;
  }

  .hero-background-switcher-button {
    flex: 0 0 auto;
    font-size: 11px;
    padding: 8px 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reference-webgl-hero-canvas {
    transition: none;
  }
}
```

Do not alter or reorder the existing user-owned `::selection` block.

- [ ] **Step 7: Run focused unit tests and verify GREEN**

```powershell
npm.cmd test -- tests/home-hero.test.tsx tests/reference-webgl-runtime.test.ts tests/reference-webgl-textures.test.ts tests/reference-webgl-shaders.test.ts tests/reference-webgl-renderer.test.ts
```

Expected: all focused tests pass, including the pre-existing selection test.

- [ ] **Step 8: Build and run the reference browser test**

```powershell
npm.cmd run build
npm.cmd run e2e:run -- --grep "reference WebGL hero"
```

Expected: build exits 0 and the reference WebGL Playwright test passes.

- [ ] **Step 9: Commit the selectable Reference GL variant**

```powershell
git add components/ui/ReferenceWebGLHeroBackground.tsx components/ui/HomeHeroBackground.tsx tests/e2e/site-smoke.spec.ts
git add -p -- app/globals.css tests/home-hero.test.tsx
git diff --cached -- app/globals.css tests/home-hero.test.tsx
git commit -m "feat: add reference webgl hero variant"
```

In the interactive add, stage only the new Reference GL CSS/test hunks. Answer
`n` for the pre-existing `::selection` rule and its matching test. Confirm the
cached diff contains no selection changes before committing.

---

### Task 6: Browser proof, documentation, and full verification

**Files:**
- Modify: `docs/MICROSOFT_AI_HOME_MAPPING.md`
- Review only: all implementation files from Tasks 1–5

**Interfaces:**
- Consumes the complete selectable variant.
- Produces the final evidence-backed handoff; no new runtime behavior.

- [ ] **Step 1: Document the optional variant**

Add a short `Hero background variants` subsection to `docs/MICROSOFT_AI_HOME_MAPPING.md` recording:

```markdown
## Hero background variants

- Production default: animated 2D Canvas.
- `?hero=webgl`: retained legacy single-pass WebGL experiment.
- `?hero=reference-webgl`: WebGL2 multipass reference implementation with
  half-resolution framebuffer rendering and generated local textures.
- `?ascii=1`: Canvas plus the decorative ASCII overlay.
- `?heroCompare=1`: exposes the local comparison control; it is not part of the
  default production UI.

The Reference GL variant reproduces the rendering architecture and behavior
observed on microsoft.ai without copying its source or assets. The site's
200vh sticky continuation remains deferred.
```

- [ ] **Step 2: Run React best-practices review**

Review the edited TSX files for:

- one component per file and named exports;
- unconditional hooks and complete effect cleanup;
- no derived state mirrored through effects;
- semantic switcher buttons with correct `aria-pressed`;
- no inline heavy renderer/shader code in React;
- dynamic import guarded against late completion;
- no continuous loop under reduced motion;
- no per-render object construction that affects a memoized child.

Apply only minimal fixes, then rerun the focused unit test.

- [ ] **Step 3: Desktop browser proof at 1440x900**

Start the dev server:

```powershell
npm.cmd run dev
```

Open and capture:

- `http://127.0.0.1:3000/?ascii=0`
- `http://127.0.0.1:3000/?hero=webgl&heroCompare=1`
- `http://127.0.0.1:3000/?hero=reference-webgl&heroCompare=1`
- `https://microsoft.ai/`

Verify the new variant's palette, bokeh density, softness, motion speed,
pointer easing, text contrast, single canvas, and absence of console errors.
Confirm the queryless page still shows the original 2D Canvas output.

- [ ] **Step 4: Mobile browser proof at 390x844**

Verify:

- the same half-resolution pipeline produces a 195x422 internal canvas;
- heading/subtitle remain centered and readable;
- the four-way comparison control remains usable without viewport overflow;
- touch/pointer absence still leaves a complete visual;
- no layout change extends the hero beyond `100svh`.

- [ ] **Step 5: Verify reduced motion and fallback states**

With reduced-motion emulation, confirm the canvas reaches `ready`, draws a
centered static frame, and does not continuously update. Temporarily intercept
or override `HTMLCanvasElement.prototype.getContext` in browser test setup to
return `null` for `webgl2`; confirm the canvas becomes `unsupported`, the CSS
fallback stays visible, the heading remains readable, and no page exception is
raised. Do not commit the diagnostic override.

- [ ] **Step 6: Request code review and address findings**

Dispatch a focused reviewer with:

- design spec: `docs/superpowers/specs/2026-07-11-reference-webgl-hero-design.md`;
- implementation plan: this file;
- base SHA: `ddb0fc6`;
- current HEAD SHA;
- explicit instruction to review lifecycle leaks, WebGL cleanup, shader/FBO
  correctness, accessibility, performance, variant regressions, and user-owned
  diff preservation.

Fix every Critical or Important finding before continuing. Record any accepted
Minor finding in the final handoff.

- [ ] **Step 7: Run the full verification suite**

Run fresh, in this order:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
git diff --check
git status --short
```

Expected:

- typecheck, lint, unit tests, production build, and all Playwright tests exit 0;
- `git diff --check` has no output;
- status contains only intentional Reference GL work plus the preserved
  user-owned selection changes if they remain uncommitted.

- [ ] **Step 8: Commit documentation or final review fixes**

```powershell
git add docs/MICROSOFT_AI_HOME_MAPPING.md
git commit -m "docs: record reference hero variant"
```

If review fixes also changed implementation files, stage only the reviewed
Reference GL files and include them in a separate `fix:` commit. Never stage
unrelated user-owned changes implicitly.

---

## Completion Checklist

- [ ] `?hero=reference-webgl` mounts only the new Reference GL component.
- [ ] Canvas remains the queryless production default.
- [ ] Legacy GL and ASCII remain selectable and unchanged internally.
- [ ] Heavy shader/renderer code is dynamically imported.
- [ ] WebGL2 uses one triangle, two ping-pong targets, generated textures, six passes, and 50 bokeh samples.
- [ ] Internal dimensions are exactly half CSS dimensions on desktop/mobile.
- [ ] One and only one animation frame can be pending.
- [ ] Scroll, visibility, intersection, reduced motion, context loss, and unmount lifecycle are covered.
- [ ] CSS fallback prevents a blank hero on loading/unsupported/error states.
- [ ] Desktop/mobile visual proof is compared with the live reference.
- [ ] Full project checks and code review pass.
- [ ] Unrelated user changes are preserved.
