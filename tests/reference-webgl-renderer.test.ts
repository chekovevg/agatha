import {existsSync, readFileSync} from "node:fs";

import {afterEach, describe, expect, it, vi} from "vitest";

import {createReferenceHeroRenderer} from "@/components/ui/reference-webgl/renderer";
import {REFERENCE_FRAGMENT_SHADERS} from "@/components/ui/reference-webgl/shaders";

const rendererUrl = new URL(
  "../components/ui/reference-webgl/renderer.ts",
  import.meta.url,
);

type PassName = keyof typeof REFERENCE_FRAGMENT_SHADERS;
type ResourceKind =
  | "buffers"
  | "framebuffers"
  | "programs"
  | "shaders"
  | "textures"
  | "vertexArrays";
type FakeShader = {
  compiled: boolean;
  id: number;
  source: string;
  type: number;
};
type FakeProgram = {
  id: number;
  linked: boolean;
  name: PassName | "unknown";
  shaders: FakeShader[];
};
type FakeTexture = {id: number};
type FakeFramebuffer = {
  id: number;
  texture: FakeTexture | null;
};
type FakeVertexArray = {id: number};
type FakeBuffer = {id: number};
type FakeUniformLocation = {
  name: string;
  program: FakeProgram;
};
type FakeWebGlRecords = {
  cancelledFrames: number[];
  drawCalls: Array<{
    framebuffer: number | null;
    program: PassName | "unknown";
    textures: Record<0 | 1, number | null>;
  }>;
  linkedPrograms: Array<PassName | "unknown">;
  requestedFrames: number[];
  resources: Record<
    ResourceKind,
    {
      created: number[];
      deleted: number[];
    }
  >;
  texImage2DCalls: Array<{
    dataBytes: number | null;
    format: number;
    height: number;
    internalFormat: number;
    texture: number | null;
    width: number;
  }>;
  uniform1iCalls: Array<{
    name: string;
    program: PassName | "unknown";
    value: number;
  }>;
  viewportCalls: Array<{
    height: number;
    width: number;
    x: number;
    y: number;
  }>;
};
type FakeWebGlOptions = {
  failCompileAt?: number;
  failCreateFramebufferAt?: number;
  failCreateProgramAt?: number;
  failLinkAt?: number;
};

const RESOURCE_KINDS = [
  "buffers",
  "framebuffers",
  "programs",
  "shaders",
  "textures",
  "vertexArrays",
] as const satisfies ReadonlyArray<ResourceKind>;

const PASS_BY_FRAGMENT_SOURCE = new Map<string, PassName>(
  (Object.entries(REFERENCE_FRAGMENT_SHADERS) as Array<[PassName, string]>).map(
    ([name, source]) => [source, name] as const,
  ),
);

function expectCompleteCleanup(records: FakeWebGlRecords) {
  for (const kind of RESOURCE_KINDS) {
    expect([...records.resources[kind].deleted].sort((a, b) => a - b)).toEqual(
      [...records.resources[kind].created].sort((a, b) => a - b),
    );
  }
}

function createFakeWebGlHarness(options: FakeWebGlOptions = {}) {
  const records: FakeWebGlRecords = {
    cancelledFrames: [],
    drawCalls: [],
    linkedPrograms: [],
    requestedFrames: [],
    resources: {
      buffers: {created: [], deleted: []},
      framebuffers: {created: [], deleted: []},
      programs: {created: [], deleted: []},
      shaders: {created: [], deleted: []},
      textures: {created: [], deleted: []},
      vertexArrays: {created: [], deleted: []},
    },
    texImage2DCalls: [],
    uniform1iCalls: [],
    viewportCalls: [],
  };
  const constants = {
    ARRAY_BUFFER: 0x8892,
    COLOR_ATTACHMENT0: 0x8ce0,
    COMPILE_STATUS: 0x8b81,
    FLOAT: 0x1406,
    FRAGMENT_SHADER: 0x8b30,
    FRAMEBUFFER: 0x8d40,
    FRAMEBUFFER_COMPLETE: 0x8cd5,
    LINEAR: 0x2601,
    LINK_STATUS: 0x8b82,
    REPEAT: 0x2901,
    RG: 0x8227,
    RG8: 0x822b,
    RGBA: 0x1908,
    RGBA8: 0x8058,
    STATIC_DRAW: 0x88e4,
    TEXTURE0: 0x84c0,
    TEXTURE_2D: 0x0de1,
    TEXTURE_MAG_FILTER: 0x2800,
    TEXTURE_MIN_FILTER: 0x2801,
    TEXTURE_WRAP_S: 0x2802,
    TEXTURE_WRAP_T: 0x2803,
    TRIANGLES: 0x0004,
    UNPACK_ALIGNMENT: 0x0cf5,
    UNSIGNED_BYTE: 0x1401,
    VERTEX_SHADER: 0x8b31,
  } as const;
  const allocate = (kind: ResourceKind) => {
    const id = records.resources[kind].created.length + 1;
    records.resources[kind].created.push(id);
    return id;
  };
  const deleteResource = (kind: ResourceKind, id: number) => {
    records.resources[kind].deleted.push(id);
  };

  let activeTextureUnit: 0 | 1 = 0;
  let compileCount = 0;
  let createFramebufferCount = 0;
  let createProgramCount = 0;
  let currentFramebuffer: FakeFramebuffer | null = null;
  let currentProgram: FakeProgram | null = null;
  let linkCount = 0;
  const boundTextures = new Map<number, FakeTexture | null>();

  const fakeGl = {
    ...constants,
    activeTexture(texture: number) {
      activeTextureUnit = (texture - constants.TEXTURE0) as 0 | 1;
    },
    attachShader(program: FakeProgram, shader: FakeShader) {
      program.shaders.push(shader);
    },
    bindBuffer() {},
    bindFramebuffer(_target: number, framebuffer: FakeFramebuffer | null) {
      currentFramebuffer = framebuffer;
    },
    bindTexture(_target: number, texture: FakeTexture | null) {
      boundTextures.set(activeTextureUnit, texture);
    },
    bindVertexArray() {},
    bufferData() {},
    checkFramebufferStatus() {
      return constants.FRAMEBUFFER_COMPLETE;
    },
    compileShader(shader: FakeShader) {
      compileCount += 1;
      shader.compiled = compileCount !== options.failCompileAt;
    },
    createBuffer(): FakeBuffer {
      return {id: allocate("buffers")};
    },
    createFramebuffer(): FakeFramebuffer | null {
      createFramebufferCount += 1;
      if (createFramebufferCount === options.failCreateFramebufferAt) {
        return null;
      }
      return {id: allocate("framebuffers"), texture: null};
    },
    createProgram(): FakeProgram | null {
      createProgramCount += 1;
      if (createProgramCount === options.failCreateProgramAt) {
        return null;
      }
      return {
        id: allocate("programs"),
        linked: false,
        name: "unknown",
        shaders: [],
      };
    },
    createShader(type: number): FakeShader {
      return {
        compiled: false,
        id: allocate("shaders"),
        source: "",
        type,
      };
    },
    createTexture(): FakeTexture {
      return {id: allocate("textures")};
    },
    createVertexArray(): FakeVertexArray {
      return {id: allocate("vertexArrays")};
    },
    deleteBuffer(buffer: FakeBuffer) {
      deleteResource("buffers", buffer.id);
    },
    deleteFramebuffer(framebuffer: FakeFramebuffer) {
      deleteResource("framebuffers", framebuffer.id);
    },
    deleteProgram(program: FakeProgram) {
      deleteResource("programs", program.id);
    },
    deleteShader(shader: FakeShader) {
      deleteResource("shaders", shader.id);
    },
    deleteTexture(texture: FakeTexture) {
      deleteResource("textures", texture.id);
    },
    deleteVertexArray(vertexArray: FakeVertexArray) {
      deleteResource("vertexArrays", vertexArray.id);
    },
    drawArrays() {
      records.drawCalls.push({
        framebuffer: currentFramebuffer?.id ?? null,
        program: currentProgram?.name ?? "unknown",
        textures: {
          0: boundTextures.get(0)?.id ?? null,
          1: boundTextures.get(1)?.id ?? null,
        },
      });
    },
    enableVertexAttribArray() {},
    framebufferTexture2D(
      _target: number,
      _attachment: number,
      _textarget: number,
      texture: FakeTexture | null,
    ) {
      if (currentFramebuffer) currentFramebuffer.texture = texture;
    },
    getProgramInfoLog() {
      return "link failure";
    },
    getProgramParameter(program: FakeProgram) {
      return program.linked;
    },
    getShaderInfoLog() {
      return "compile failure";
    },
    getShaderParameter(shader: FakeShader) {
      return shader.compiled;
    },
    getUniformLocation(program: FakeProgram, name: string): FakeUniformLocation {
      return {name, program};
    },
    linkProgram(program: FakeProgram) {
      linkCount += 1;
      const fragment = program.shaders.find(
        (shader) => shader.type === constants.FRAGMENT_SHADER,
      );
      program.name =
        PASS_BY_FRAGMENT_SOURCE.get(fragment?.source ?? "") ?? "unknown";
      program.linked = linkCount !== options.failLinkAt;
      if (program.linked) records.linkedPrograms.push(program.name);
    },
    pixelStorei() {},
    shaderSource(shader: FakeShader, source: string) {
      shader.source = source;
    },
    texImage2D(
      _target: number,
      _level: number,
      internalFormat: number,
      width: number,
      height: number,
      _border: number,
      format: number,
      _type: number,
      data: ArrayBufferView | null,
    ) {
      records.texImage2DCalls.push({
        dataBytes: data?.byteLength ?? null,
        format,
        height,
        internalFormat,
        texture: boundTextures.get(activeTextureUnit)?.id ?? null,
        width,
      });
    },
    texParameteri() {},
    uniform1f() {},
    uniform1i(location: FakeUniformLocation | null, value: number) {
      if (!location) return;
      records.uniform1iCalls.push({
        name: location.name,
        program: location.program.name,
        value,
      });
    },
    uniform2f() {},
    useProgram(program: FakeProgram | null) {
      currentProgram = program;
    },
    vertexAttribPointer() {},
    viewport(x: number, y: number, width: number, height: number) {
      records.viewportCalls.push({height, width, x, y});
    },
  };
  const gl = fakeGl as unknown as WebGL2RenderingContext;
  const canvas = {
    getContext: (contextId: string) =>
      contextId === "webgl2" ? gl : null,
    height: 0,
    width: 0,
  } as unknown as HTMLCanvasElement;
  let nextFrame = 1;
  const frameCallbacks = new Map<number, FrameRequestCallback>();
  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    const handle = nextFrame;
    nextFrame += 1;
    frameCallbacks.set(handle, callback);
    records.requestedFrames.push(handle);
    return handle;
  });
  const cancelAnimationFrame = vi.fn((handle: number) => {
    frameCallbacks.delete(handle);
    records.cancelledFrames.push(handle);
  });
  vi.stubGlobal("window", {cancelAnimationFrame, requestAnimationFrame});

  return {canvas, frameCallbacks, gl, records};
}

function createRenderer(harness: ReturnType<typeof createFakeWebGlHarness>) {
  const renderer = createReferenceHeroRenderer(harness.canvas);
  if (!renderer) throw new Error("Expected the fake WebGL2 context to work");
  return renderer;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it("uses the pass descriptors as the single compile and render graph", () => {
    const source = readFileSync(rendererUrl, "utf8");
    const descriptorLoops = source.match(
      /for \(const descriptor of PASS_DESCRIPTORS\)/g,
    );

    expect(descriptorLoops).toHaveLength(2);
    expect(source).not.toMatch(
      /renderPass\("(?:background|vignette|sine|shatter|bokeh|composite)"/,
    );
  });

  it("returns null when WebGL2 is unsupported", () => {
    const canvas = {getContext: () => null} as unknown as HTMLCanvasElement;
    expect(createReferenceHeroRenderer(canvas)).toBeNull();
  });

  it("compiles and draws the descriptor graph in program and target order", () => {
    const harness = createFakeWebGlHarness();
    const renderer = createRenderer(harness);
    const expectedPassOrder: PassName[] = [
      "background",
      "vignette",
      "sine",
      "shatter",
      "bokeh",
      "composite",
    ];

    renderer.drawStaticFrame();

    expect(harness.records.linkedPrograms).toEqual(expectedPassOrder);
    expect(harness.records.drawCalls.map(({program}) => program)).toEqual(
      expectedPassOrder,
    );
    expect(harness.records.drawCalls.map(({framebuffer}) => framebuffer)).toEqual(
      [1, 2, 1, 2, 1, null],
    );

    renderer.destroy();
  });

  it.each([
    {
      expectedPrograms: 0,
      failure: "shader compilation",
      message: "compile failure",
      options: {failCompileAt: 2},
    },
    {
      expectedPrograms: 0,
      failure: "program creation",
      message: "Unable to create Reference GL program",
      options: {failCreateProgramAt: 1},
    },
    {
      expectedPrograms: 1,
      failure: "program linking",
      message: "link failure",
      options: {failLinkAt: 1},
    },
  ])(
    "cleans shader and program ownership after $failure failure",
    ({expectedPrograms, message, options}) => {
      const harness = createFakeWebGlHarness(options);

      expect(() => createReferenceHeroRenderer(harness.canvas)).toThrow(message);
      expect(harness.records.resources.shaders.created).toHaveLength(2);
      expect(harness.records.resources.programs.created).toHaveLength(
        expectedPrograms,
      );
      expectCompleteCleanup(harness.records);
    },
  );

  it("cleans all transferred resources when the second target fails", () => {
    const harness = createFakeWebGlHarness({failCreateFramebufferAt: 2});

    expect(() => createReferenceHeroRenderer(harness.canvas)).toThrow(
      "Unable to create Reference GL framebuffer",
    );
    expect(harness.records.resources.programs.created).toHaveLength(6);
    expect(harness.records.resources.textures.created).toHaveLength(4);
    expect(harness.records.resources.framebuffers.created).toHaveLength(1);
    expectCompleteCleanup(harness.records);
  });

  it("destroys once and cancels the pending animation frame", () => {
    const harness = createFakeWebGlHarness();
    const renderer = createRenderer(harness);

    renderer.resume();
    expect(harness.frameCallbacks.size).toBe(1);

    renderer.destroy();
    renderer.destroy();
    renderer.resume();

    expect(harness.records.requestedFrames).toEqual([1]);
    expect(harness.records.cancelledFrames).toEqual([1]);
    expect(harness.frameCallbacks.size).toBe(0);
    expectCompleteCleanup(harness.records);
  });

  it("resizes both targets and the viewport at half CSS resolution", () => {
    const harness = createFakeWebGlHarness();
    const renderer = createRenderer(harness);
    const creationCallCount = harness.records.texImage2DCalls.length;

    renderer.resize(390, 844);

    expect(harness.canvas.width).toBe(195);
    expect(harness.canvas.height).toBe(422);
    expect(harness.records.texImage2DCalls.slice(creationCallCount)).toEqual([
      expect.objectContaining({
        height: 422,
        internalFormat: harness.gl.RGBA8,
        texture: 3,
        width: 195,
      }),
      expect.objectContaining({
        height: 422,
        internalFormat: harness.gl.RGBA8,
        texture: 4,
        width: 195,
      }),
    ]);
    expect(harness.records.viewportCalls).toEqual(
      Array.from({length: 6}, () => ({height: 422, width: 195, x: 0, y: 0})),
    );

    renderer.destroy();
  });

  it("allocates gradient, noise, and targets with their required formats", () => {
    const harness = createFakeWebGlHarness();
    const renderer = createRenderer(harness);
    const [gradient, noise, firstTarget, secondTarget] =
      harness.records.texImage2DCalls;

    expect(gradient).toMatchObject({
      format: harness.gl.RGBA,
      height: 154,
      internalFormat: harness.gl.RGBA8,
      texture: 1,
      width: 256,
    });
    expect(gradient?.dataBytes).toBeGreaterThan(0);
    expect(noise).toMatchObject({
      format: harness.gl.RG,
      height: 256,
      internalFormat: harness.gl.RG8,
      texture: 2,
      width: 256,
    });
    expect(noise?.dataBytes).toBeGreaterThan(0);
    expect([firstTarget, secondTarget]).toEqual([
      expect.objectContaining({
        dataBytes: null,
        format: harness.gl.RGBA,
        internalFormat: harness.gl.RGBA8,
        texture: 3,
      }),
      expect.objectContaining({
        dataBytes: null,
        format: harness.gl.RGBA,
        internalFormat: harness.gl.RGBA8,
        texture: 4,
      }),
    ]);

    renderer.destroy();
  });

  it("binds bokeh and composite textures to their descriptor units", () => {
    const harness = createFakeWebGlHarness();
    const renderer = createRenderer(harness);

    renderer.drawStaticFrame();

    expect(
      harness.records.drawCalls.find(({program}) => program === "bokeh"),
    ).toMatchObject({
      textures: {0: 4, 1: 2},
    });
    expect(
      harness.records.drawCalls.find(({program}) => program === "composite"),
    ).toMatchObject({
      textures: {0: 3, 1: 1},
    });
    expect(
      harness.records.uniform1iCalls.filter(
        ({program}) => program === "bokeh" || program === "composite",
      ),
    ).toEqual([
      {name: "u_input", program: "bokeh", value: 0},
      {name: "u_noise", program: "bokeh", value: 1},
      {name: "u_input", program: "composite", value: 0},
      {name: "u_gradient", program: "composite", value: 1},
    ]);

    renderer.destroy();
  });
});
