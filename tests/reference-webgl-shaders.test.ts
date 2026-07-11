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
