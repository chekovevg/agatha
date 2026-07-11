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
type RenderTargetIndex = 0 | 1;
type TextureSource = "gradient" | "noise" | "target0" | "target1";
type RuntimeUniform = "pointer" | "resolution" | "time";
type PassDescriptor = {
  name: PassName;
  fragmentSource: string;
  output: RenderTargetIndex | null;
  textureBindings: ReadonlyArray<{
    name: string;
    source: TextureSource;
    unit: 0 | 1;
  }>;
  runtimeUniforms: ReadonlyArray<RuntimeUniform>;
};

const PASS_DESCRIPTORS = [
  {
    name: "background",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.background,
    output: 0,
    textureBindings: [
      {name: "u_gradient", source: "gradient", unit: 0},
    ],
    runtimeUniforms: [],
  },
  {
    name: "vignette",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.vignette,
    output: 1,
    textureBindings: [{name: "u_input", source: "target0", unit: 0}],
    runtimeUniforms: ["pointer", "resolution"],
  },
  {
    name: "sine",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.sine,
    output: 0,
    textureBindings: [{name: "u_input", source: "target1", unit: 0}],
    runtimeUniforms: ["resolution", "time"],
  },
  {
    name: "shatter",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.shatter,
    output: 1,
    textureBindings: [{name: "u_input", source: "target0", unit: 0}],
    runtimeUniforms: ["resolution", "time"],
  },
  {
    name: "bokeh",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.bokeh,
    output: 0,
    textureBindings: [
      {name: "u_input", source: "target1", unit: 0},
      {name: "u_noise", source: "noise", unit: 1},
    ],
    runtimeUniforms: ["resolution", "time"],
  },
  {
    name: "composite",
    fragmentSource: REFERENCE_FRAGMENT_SHADERS.composite,
    output: null,
    textureBindings: [
      {name: "u_input", source: "target0", unit: 0},
      {name: "u_gradient", source: "gradient", unit: 1},
    ],
    runtimeUniforms: [],
  },
] as const satisfies ReadonlyArray<PassDescriptor>;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create Reference GL shader");

  try {
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(shader) || "Unknown shader error";
      throw new Error(message);
    }
    return shader;
  } catch (error) {
    gl.deleteShader(shader);
    throw error;
  }
}

function createProgram(
  gl: WebGL2RenderingContext,
  fragmentSource: string,
): ProgramInfo {
  let vertex: WebGLShader | null = null;
  let fragment: WebGLShader | null = null;
  let program: WebGLProgram | null = null;

  try {
    vertex = compileShader(gl, gl.VERTEX_SHADER, REFERENCE_VERTEX_SHADER);
    fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error("Unable to create Reference GL program");

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || "Unknown program error";
      throw new Error(message);
    }

    const linkedProgram = program;
    const uniforms = new Map<string, WebGLUniformLocation | null>();
    program = null;

    return {
      program: linkedProgram,
      uniform(name) {
        if (!uniforms.has(name)) {
          uniforms.set(name, gl.getUniformLocation(linkedProgram, name));
        }
        return uniforms.get(name) ?? null;
      },
    };
  } finally {
    if (program) gl.deleteProgram(program);
    if (fragment) gl.deleteShader(fragment);
    if (vertex) gl.deleteShader(vertex);
  }
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

  try {
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
  } catch (error) {
    gl.deleteTexture(texture);
    throw error;
  }
}

function createRenderTarget(gl: WebGL2RenderingContext): RenderTarget {
  let texture: WebGLTexture | null = null;
  let framebuffer: WebGLFramebuffer | null = null;

  try {
    texture = createTexture(gl, 1, 1, gl.RGBA8, gl.RGBA, null);
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
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
      throw new Error("Reference GL framebuffer is incomplete");
    }

    const target = {framebuffer, texture};
    framebuffer = null;
    texture = null;
    return target;
  } finally {
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    if (texture) gl.deleteTexture(texture);
  }
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

  const resources = createCleanupStack();

  try {
    const programs = {} as Record<PassName, ProgramInfo>;
    for (const descriptor of PASS_DESCRIPTORS) {
      const info = createProgram(gl, descriptor.fragmentSource);
      programs[descriptor.name] = info;
      resources.add(() => gl.deleteProgram(info.program));
    }

    const vertexArray = gl.createVertexArray();
    if (!vertexArray) {
      throw new Error("Unable to create Reference GL vertex array");
    }
    resources.add(() => gl.deleteVertexArray(vertexArray));

    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      throw new Error("Unable to create Reference GL vertex buffer");
    }
    resources.add(() => gl.deleteBuffer(vertexBuffer));

    gl.bindVertexArray(vertexArray);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
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
    resources.add(() => gl.deleteTexture(gradient));

    const noise = createTexture(
      gl,
      256,
      256,
      gl.RG8,
      gl.RG,
      createReferenceNoiseData(256),
    );
    resources.add(() => gl.deleteTexture(noise));

    const firstTarget = createRenderTarget(gl);
    resources.add(() => gl.deleteTexture(firstTarget.texture));
    resources.add(() => gl.deleteFramebuffer(firstTarget.framebuffer));

    const secondTarget = createRenderTarget(gl);
    resources.add(() => gl.deleteTexture(secondTarget.texture));
    resources.add(() => gl.deleteFramebuffer(secondTarget.framebuffer));

    const targets = [firstTarget, secondTarget] as const;
    const textureSources: Record<TextureSource, WebGLTexture> = {
      gradient,
      noise,
      target0: firstTarget.texture,
      target1: secondTarget.texture,
    };
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

    const renderPass = (descriptor: PassDescriptor) => {
      const info = programs[descriptor.name];
      const output =
        descriptor.output === null ? null : targets[descriptor.output];
      gl.bindFramebuffer(gl.FRAMEBUFFER, output?.framebuffer ?? null);
      gl.viewport(0, 0, width, height);
      gl.useProgram(info.program);
      gl.bindVertexArray(vertexArray);

      for (const binding of descriptor.textureBindings) {
        bindTexture(
          info,
          binding.name,
          textureSources[binding.source],
          binding.unit,
        );
      }

      for (const uniform of descriptor.runtimeUniforms) {
        switch (uniform) {
          case "pointer":
            gl.uniform2f(
              info.uniform("u_pointer"),
              pointerCurrent.x,
              pointerCurrent.y,
            );
            break;
          case "resolution":
            gl.uniform2f(info.uniform("u_resolution"), width, height);
            break;
          case "time":
            gl.uniform1f(info.uniform("u_time"), elapsed);
            break;
        }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const renderFrame = (timestamp: number) => {
      if (disposed) return;
      if (lastTimestamp !== null) {
        elapsed += Math.min(
          0.05,
          Math.max(0, (timestamp - lastTimestamp) / 1000),
        );
      }
      lastTimestamp = timestamp;
      pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * 0.1;
      pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * 0.1;

      for (const descriptor of PASS_DESCRIPTORS) {
        renderPass(descriptor);
      }
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
        resources.release();
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
        if (disposed) return;
        const size = getReferenceRenderSize(cssWidth, cssHeight);
        width = size.width;
        height = size.height;
        canvas.width = width;
        canvas.height = height;
        targets.forEach((target) =>
          resizeRenderTarget(gl, target, width, height),
        );
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
  } catch (error) {
    resources.release();
    throw error;
  }
}
