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

  it("uses ordered smoothstep edges for shatter strength", () => {
    expect(REFERENCE_FRAGMENT_SHADERS.shatter).not.toContain(
      "smoothstep(0.48, 0.02, nearestDistance)",
    );
    expect(REFERENCE_FRAGMENT_SHADERS.shatter).toContain(
      "float strength = (1.0 - smoothstep(0.02, 0.48, nearestDistance)) * 0.018;",
    );
  });

  it("keeps brush silhouettes through compact bokeh and screen composite", () => {
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain(
      "const float BOKEH_RADIUS = 0.036;",
    );
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain(
      "const float BOKEH_HIGHLIGHT_WEIGHT = 96.0;",
    );
    expect(REFERENCE_FRAGMENT_SHADERS.bokeh).toContain(
      "vec2(BOKEH_RADIUS / aspect, BOKEH_RADIUS)",
    );
    expect(REFERENCE_FRAGMENT_SHADERS.composite).toContain(
      "vec3 screenBlend = vec3(1.0) - (vec3(1.0) - base) * (vec3(1.0) - bokeh);",
    );
    expect(REFERENCE_FRAGMENT_SHADERS.composite).toContain(
      "vec3 color = mix(base, screenBlend, 0.32);",
    );
  });
});
