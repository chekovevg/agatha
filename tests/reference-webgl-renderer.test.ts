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

  it("returns null when WebGL2 is unsupported", async () => {
    const {createReferenceHeroRenderer} = await import(
      "@/components/ui/reference-webgl/renderer"
    );
    const canvas = {getContext: () => null} as unknown as HTMLCanvasElement;
    expect(createReferenceHeroRenderer(canvas)).toBeNull();
  });
});
