# Reference WebGL Hero Variant Design

## Goal

Add a clean, independently selectable WebGL2 hero background that reproduces
the rendering architecture and visual behavior observed on `microsoft.ai`,
while preserving the current production Canvas hero, ASCII overlay, and legacy
WebGL experiment.

## Approved product decisions

- The production default remains the existing 2D Canvas hero.
- The existing raw WebGL experiment remains available and is labeled
  `Legacy GL` in the comparison control.
- The new implementation is labeled `Reference GL` and is selected with
  `?hero=reference-webgl`.
- ASCII remains available as the existing Canvas-plus-ASCII variant.
- The comparison control exposes, in order: `Canvas`, `Legacy GL`,
  `Reference GL`, and `ASCII`.
- The current one-screen `100svh` hero shell remains unchanged for all
  variants. The reference site's `200vh` sticky continuation is explicitly
  deferred until the rendering variant is visually approved.
- No third-party WebGL dependency or copied Microsoft source/asset is added.

## Reference behavior to reproduce

The new variant recreates the verified rendering pattern rather than copying
the reference implementation:

1. A full-viewport WebGL2 canvas renders at half CSS resolution.
2. One reusable full-screen triangle is drawn through a sequence of shader
   passes.
3. Two framebuffer targets are reused as ping-pong read/write buffers.
4. The passes run in this order:
   - generated peach gradient background;
   - pointer-positioned vignette;
   - time-based sine distortion;
   - low-amplitude Voronoi/shatter distortion;
   - 50-sample golden-angle bokeh using a deterministic blue-noise-like
     texture;
   - final peach/apricot composite.
5. Pointer input is normalized to the canvas and eased toward the current
   target instead of snapping.
6. Rendering pauses while the page is actively scrolling and resumes 150 ms
   after the last scroll event.
7. Rendering also pauses when the component is outside the viewport or the
   document is hidden.
8. Reduced-motion mode renders one centered static frame and does not maintain
   an animation loop.

The effect remains a decorative 2D full-screen shader pipeline. It does not
introduce a 3D scene, model loader, camera controls, video, WebGPU, or a custom
general-purpose rendering engine.

## Component architecture

### `components/ui/ReferenceWebGLHeroBackground.tsx`

This client component owns only browser lifecycle and UI integration:

- renders the CSS fallback and an `aria-hidden` canvas;
- exposes `data-hero-background="reference-webgl"` on the wrapper;
- exposes renderer state on the canvas through
  `data-reference-webgl-status` with `idle`, `loading`, `ready`,
  `unsupported`, `error`, or `context-lost`;
- waits for an IntersectionObserver with a 300 px root margin before importing
  the renderer module;
- dynamically imports the heavy renderer so the default Canvas path does not
  download shader code eagerly;
- owns ResizeObserver, pointer, scroll, visibility, reduced-motion, and context
  loss/restoration listeners;
- guarantees that late dynamic-import completion cannot initialize a disposed
  component;
- calls `destroy()` during cleanup and before context restoration.

The component does not contain GLSL or low-level WebGL resource management.

### `components/ui/reference-webgl/renderer.ts`

This module exports:

```ts
type ReferenceHeroRenderer = {
  destroy(): void;
  drawStaticFrame(): void;
  pause(): void;
  resize(cssWidth: number, cssHeight: number): void;
  resume(): void;
  setPointer(x: number, y: number): void;
};

function createReferenceHeroRenderer(
  canvas: HTMLCanvasElement,
): ReferenceHeroRenderer | null;

function getReferenceRenderSize(
  cssWidth: number,
  cssHeight: number,
): {width: number; height: number};

function createSingleFrameScheduler(
  requestFrame: (callback: FrameRequestCallback) => number,
  cancelFrame: (handle: number) => void,
  draw: FrameRequestCallback,
): {
  pause(): void;
  resume(): void;
  destroy(): void;
};
```

The module requests `webgl2` with alpha, antialias, depth, and stencil disabled.
Returning `null` means WebGL2 is unsupported and leaves the CSS fallback
visible.

The renderer owns all GL resources: shader programs, the full-screen triangle,
generated textures, ping-pong framebuffer targets, uniform locations, and the
single animation scheduler. It performs no DOM queries beyond the supplied
canvas.

The animation scheduler maintains at most one pending
`requestAnimationFrame`. Each callback clears its stored handle before drawing
and scheduling the next frame. `pause()` and `destroy()` cancel the pending
handle. This avoids the duplicate-loop behavior present in the legacy
experiment. The injected request/cancel functions make the single-frame
invariant testable without a browser WebGL context.

### `components/ui/reference-webgl/shaders.ts`

This module contains only the WebGL2 GLSL ES 3.00 vertex and fragment shader
sources. Every pass uses the same full-screen vertex shader. Fragment shaders
have explicit, pass-specific uniforms and do not share hidden global state.

### `components/ui/reference-webgl/textures.ts`

This module exports deterministic texture-data builders:

```ts
function createReferenceGradientData(
  width: number,
  height: number,
): Uint8Array;

function createReferenceNoiseData(
  size: number,
  seed?: number,
): Uint8Array;
```

The generated gradient uses Agatha's existing peach/rose color tokens. The
noise builder produces repeatable high-frequency RG data for bokeh sampling.
Gradient output contains `width * height * 4` RGBA bytes; noise output contains
`size * size * 2` RG bytes. Both are created once during renderer
initialization and uploaded to WebGL; they allocate nothing during animation
frames.

### Existing integration files

`components/ui/HomeHeroBackground.tsx` expands `HeroBackgroundVariant` to
`"canvas" | "webgl" | "reference-webgl"`, preserves the existing URL behavior,
and renders the new component only for `?hero=reference-webgl`. The old
`?hero=webgl` contract remains valid.

The comparison control keeps its current opt-in `?heroCompare=1` behavior and
adds the approved labels without changing the default production UI.

`app/globals.css` adds isolated `.reference-webgl-hero-*` rules. The wrapper has
the approved peach CSS gradient so shader loading, unsupported WebGL2, shader
compile failure, or context loss never produces a blank hero.

## State and event flow

1. Server rendering and the first client render remain Canvas.
2. Hydration reads the query string, as it does today.
3. Selecting `Reference GL` pushes `hero=reference-webgl&heroCompare=1` and
   mounts the new component.
4. The component displays its CSS fallback immediately.
5. IntersectionObserver starts the dynamic renderer import.
6. The renderer initializes WebGL2 resources and draws the first frame.
7. The component marks the canvas `ready` only after initialization and the
   first successful draw.
8. Pointer targets are updated from passive pointer events; interpolation
   occurs inside the renderer frame loop.
9. Scroll, visibility, intersection, and reduced-motion state independently
   update component flags. One `reconcileMotionState()` function resumes the
   scheduler only when every blocking flag is false; ending one pause reason
   cannot restart animation while another reason remains active.
10. Unmount or context loss destroys every owned GL resource and prevents late
    callbacks from restarting the renderer.

## Fallback and error handling

- No WebGL2: set `unsupported`, keep the CSS gradient, and do not retry until a
  remount.
- Shader/program/framebuffer failure: release partial resources, set `error`,
  and keep the CSS gradient.
- Context loss: prevent the browser's default handling, pause and destroy the
  renderer, and set `context-lost`.
- Context restoration: initialize a fresh renderer through the same guarded
  path; do not reuse stale GL objects.
- Dynamic import failure: set `error` without throwing into React or producing
  an unhandled page exception.
- Component disposal: remove all observers/listeners, clear the scroll timer,
  cancel the frame handle, and destroy the renderer exactly once.

The effect is decorative, so fallback failures never block heading text,
navigation, or booking actions.

## Accessibility

- The canvas and shader wrapper remain `aria-hidden` and non-interactive.
- The comparison controls remain semantic buttons with `aria-pressed`.
- The CSS fallback preserves readable hero contrast before and without WebGL.
- `prefers-reduced-motion: reduce` produces a centered static frame and no
  continuous requestAnimationFrame loop.
- Pointer input enhances the effect but is not required to reveal content.
- Keyboard and touch behavior of the surrounding page remain unchanged.

## Performance constraints

- Internal canvas dimensions are `round(cssSize * 0.5)` on desktop and mobile,
  independent of device pixel ratio.
- One WebGL context, one vertex buffer, two reusable framebuffer targets, and
  the minimal texture set are allowed.
- No per-frame array, texture, program, framebuffer, or event-listener
  allocation is allowed.
- The bokeh pass uses the approved 50 samples but runs only at half resolution.
- Shader code is downloaded only when the reference variant is mounted and
  near the viewport.
- Rendering stops offscreen, during active scrolling, in a hidden document,
  and under reduced motion.

## Testing strategy

Implementation follows red-green-refactor. No production behavior is added
before its failing test is observed.

### Vitest

`tests/home-hero.test.tsx` gains focused tests that verify:

- the server/default render remains Canvas and contains no reference WebGL
  wrapper;
- the new component's static markup is decorative and contains the expected
  data contract;
- the switcher source supports `reference-webgl` without removing Canvas,
  legacy WebGL, or ASCII;
- the heavy renderer is dynamically imported rather than statically imported
  into the default background path;
- the legacy `?hero=webgl` behavior remains intact.

A focused renderer-helper test file verifies:

- half-resolution size calculation;
- deterministic gradient/noise output and exact byte lengths;
- different noise seeds produce different data;
- the animation scheduler never has more than one pending frame and cancels it
  on pause/destroy.

### Playwright and browser proof

`tests/e2e/site-smoke.spec.ts` adds a reference-variant smoke test that opens
`/?hero=reference-webgl&heroCompare=1&ascii=0` and verifies:

- the page returns 200 with one heading and no page exception;
- the `Reference GL` button is pressed;
- the reference wrapper and one canvas are present;
- the canvas reaches `ready` in Chromium;
- internal canvas width and height are half the rendered CSS dimensions within
  rounding tolerance;
- default `/` still selects Canvas.

Manual browser proof runs at 1440x900 and 390x844. It compares the new variant
against the current live reference for palette, bokeh density, blur softness,
motion speed, pointer easing, and mobile composition. It also checks the CSS
fallback by forcing WebGL2 initialization failure and checks reduced motion
with browser emulation.

## Verification commands

After implementation:

```powershell
npm.cmd run typecheck
npm.cmd run lint
npm.cmd test
npm.cmd run build
npm.cmd run e2e:run
```

Browser QA additionally covers `/`, `/?hero=webgl&heroCompare=1`,
`/?hero=reference-webgl&heroCompare=1`, and the mobile reference variant.

## Out of scope

- Making Reference GL the production default.
- Removing or rewriting Canvas, ASCII, or legacy WebGL.
- Changing hero copy, typography, header, CTA, or content sections.
- Extending the hero canvas to a `200vh` sticky continuation.
- Adding Beam, Three.js, React Three Fiber, GSAP, OGL, WebGPU, or any other
  dependency.
- Copying Microsoft shader source, source-map content, textures, or fonts.
- Adding settings persistence beyond the existing query-string controls.
- Deployment, analytics, legal, booking, contact, or content changes.

## Acceptance criteria

- `?hero=reference-webgl` visibly produces the approved peach bokeh field with
  smooth pointer response and restrained continuous motion.
- The render architecture is WebGL2 multipass with ping-pong framebuffers,
  generated gradient/noise textures, and a half-resolution canvas.
- Exactly one animation chain can be active per mounted component.
- Canvas, Legacy GL, Reference GL, and ASCII remain selectable through the
  comparison control.
- The queryless production page remains visually and behaviorally unchanged.
- Unsupported WebGL2, shader failure, context loss, reduced motion, page
  visibility, scroll pause, and unmount all degrade without a blank hero,
  uncaught browser exception, or leaked animation loop.
- Relevant unit, build, and browser checks pass without changing unrelated
  files.
