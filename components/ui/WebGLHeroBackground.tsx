"use client";

import {useEffect, useRef} from "react";

const vertexShaderSource = `
attribute vec2 a_position;

varying vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_pointer;
uniform float u_scroll;
uniform float u_motion;

#define PI 3.14159265359
#define TAU 6.28318530718

float hash11(float p) {
  return fract(sin(p * 127.1) * 43758.5453123);
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 hash22(vec2 p) {
  return fract(sin(vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  )) * 43758.5453123);
}

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amp = 0.5;

  for (int i = 0; i < 5; i++) {
    value += noise(p) * amp;
    p = rotate2d(0.47) * p * 2.02 + 11.13;
    amp *= 0.5;
  }

  return value;
}

vec2 sineWarp(vec2 uv) {
  vec2 centered = uv * 2.0 - 1.0;
  float t = u_time * 0.11 * u_motion;
  centered.x += sin(centered.y * 3.2 + t * TAU) * 0.025;
  centered.y += sin(centered.x * 2.8 + t * TAU * 1.27) * 0.018;
  return centered * 0.5 + 0.5;
}

vec2 shatterOffset(vec2 uv, float aspect) {
  vec2 st = (uv - 0.5) * vec2(aspect, 1.0) * 4.2 + 0.5;
  vec2 cell = floor(st);
  vec2 local = fract(st);
  float minDist = 10.0;
  vec2 nearest = vec2(0.0);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 rnd = hash22(cell + neighbor);
      vec2 point = neighbor + 0.5 + 0.38 * sin(TAU * rnd + u_time * 0.07 * u_motion);
      vec2 diff = point - local;
      float dist = dot(diff, diff);

      if (dist < minDist) {
        minDist = dist;
        nearest = diff;
      }
    }
  }

  float push = smoothstep(0.34, 0.0, minDist);
  return normalize(nearest + 0.0001) * push * 0.035;
}

float ellipseMask(vec2 uv, vec2 center, float rx, float ry, float angle, float feather, float aspect) {
  vec2 p = uv - center;
  p.x *= aspect;
  p = rotate2d(angle) * p;
  float d = length(p / vec2(rx, ry));
  return smoothstep(1.0, feather, d);
}

vec3 screenBlend(vec3 base, vec3 blend) {
  return 1.0 - (1.0 - base) * (1.0 - blend);
}

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / max(1.0, u_resolution.y);
  vec2 pointer = u_pointer * vec2(0.018, -0.014);

  vec2 warped = sineWarp(uv + pointer);
  warped += shatterOffset(warped, aspect) * (0.18 + u_scroll * 0.08);
  vec2 shapeUv = mix(uv, warped, 0.28);

  float cloud = fbm(warped * vec2(1.35 * aspect, 1.35) + vec2(0.0, u_time * 0.012 * u_motion));
  float warmth = smoothstep(0.08, 0.96, warped.x * 0.58 + warped.y * 0.22 + cloud * 0.2);

  vec3 roseA = vec3(0.735, 0.428, 0.400);
  vec3 roseB = vec3(0.831, 0.529, 0.471);
  vec3 roseC = vec3(0.694, 0.430, 0.407);
  vec3 base = mix(roseA, roseB, warmth);
  base = mix(base, roseC, smoothstep(0.38, 1.05, distance(uv, vec2(0.5))));

  float bokeh = 0.0;
  float highlights = 0.0;
  vec2 pointerUv = vec2(0.5 + u_pointer.x * 0.5, 0.5 - u_pointer.y * 0.5);
  float pointerDistance = length((shapeUv - pointerUv) * vec2(aspect, 1.0));
  float pointerGlow = smoothstep(0.62, 0.0, pointerDistance);
  float pointerCore = smoothstep(0.34, 0.0, pointerDistance);

  for (int i = 0; i < 30; i++) {
    float fi = float(i);
    vec2 rnd = hash22(vec2(fi * 1.73, fi * 5.11));
    vec2 rnd2 = hash22(vec2(fi * 7.41 + 2.0, fi * 0.83 + 9.0));
    vec2 center = vec2(
      -0.12 + rnd.x * 1.24,
      0.06 + rnd.y * 0.92
    );

    center += vec2(
      sin(u_time * (0.025 + rnd2.x * 0.02) + fi) * 0.018,
      cos(u_time * (0.018 + rnd2.y * 0.02) + fi * 1.31) * 0.016
    ) * u_motion;

    center.y -= u_scroll * (0.035 + rnd2.y * 0.04);

    float radius = mix(0.07, 0.22, rnd2.x);
    float rx = radius * mix(1.28, 2.24, rnd.y);
    float ry = radius * mix(0.36, 0.62, rnd2.y);
    float angle = -0.82 + (rnd.x - 0.5) * 0.28;
    float blob = ellipseMask(shapeUv, center, rx, ry, angle, 0.2, aspect);
    float core = ellipseMask(shapeUv, center + vec2(0.006, -0.004), rx * 0.5, ry * 0.52, angle, 0.1, aspect);

    bokeh += blob * mix(0.5, 1.0, rnd2.y);
    highlights += core * mix(0.22, 0.54, rnd.x);
  }

  for (int i = 0; i < 16; i++) {
    float fi = float(i);
    float column = mod(fi, 8.0);
    float row = floor(fi / 8.0);
    vec2 rnd = hash22(vec2(fi * 3.17 + 19.0, fi * 1.41 + 3.0));
    vec2 center = vec2(
      -0.08 + column * 0.17 + row * 0.08 + (rnd.x - 0.5) * 0.06,
      0.18 + row * 0.38 + sin(column * 1.7) * 0.075 + (rnd.y - 0.5) * 0.08
    );

    center += vec2(
      sin(u_time * (0.018 + rnd.x * 0.012) + fi * 0.7) * 0.012,
      cos(u_time * (0.016 + rnd.y * 0.012) + fi * 0.9) * 0.01
    ) * u_motion;

    float angle = -0.82 + (rnd.x - 0.5) * 0.18;
    float blob = ellipseMask(
      shapeUv,
      center,
      mix(0.14, 0.26, rnd.x),
      mix(0.052, 0.088, rnd.y),
      angle,
      0.18,
      aspect
    );
    float core = ellipseMask(
      shapeUv,
      center + vec2(0.005, -0.003),
      mix(0.07, 0.14, rnd.x),
      mix(0.026, 0.044, rnd.y),
      angle,
      0.08,
      aspect
    );

    bokeh += blob * 0.54;
    highlights += core * 0.34;
  }

  for (int i = 0; i < 14; i++) {
    float fi = float(i);
    vec2 rnd = hash22(vec2(fi * 5.31 + 7.0, fi * 2.17 + 13.0));
    vec2 local = vec2(
      (fi - 6.5) * 0.035 + (rnd.x - 0.5) * 0.055,
      sin(fi * 1.37) * 0.078 + (rnd.y - 0.5) * 0.055
    );
    local = rotate2d(-0.82) * local;

    vec2 center = pointerUv + local;
    center += vec2(
      sin(u_time * (0.03 + rnd.x * 0.02) + fi) * 0.012,
      cos(u_time * (0.026 + rnd.y * 0.018) + fi * 0.7) * 0.01
    ) * u_motion;

    float angle = -0.82 + (rnd.x - 0.5) * 0.24;
    float blob = ellipseMask(
      shapeUv,
      center,
      mix(0.085, 0.18, rnd.x),
      mix(0.036, 0.076, rnd.y),
      angle,
      0.16,
      aspect
    );
    float core = ellipseMask(
      shapeUv,
      center + vec2(0.004, -0.003),
      mix(0.042, 0.092, rnd.x),
      mix(0.018, 0.04, rnd.y),
      angle,
      0.07,
      aspect
    );

    bokeh += blob * pointerGlow * 0.72;
    highlights += core * pointerCore * 0.5;
  }

  float pointerReveal = 0.26 + pointerGlow * 0.86;
  bokeh = clamp(bokeh * pointerReveal + pointerGlow * 0.18, 0.0, 1.0);
  highlights = clamp(highlights * pointerReveal + pointerCore * 0.34, 0.0, 1.0);

  vec3 peach = vec3(1.0, 0.665, 0.475);
  vec3 apricot = vec3(1.0, 0.778, 0.585);
  vec3 color = mix(base, peach, bokeh * 0.78);
  color = screenBlend(color, apricot * highlights * 0.56);
  color = screenBlend(color, apricot * pointerGlow * 0.18);

  float radial = distance((uv - 0.5) * vec2(aspect * 0.78, 1.0), vec2(0.0));
  float vignette = smoothstep(0.42, 1.0, radial);
  color = mix(color, vec3(0.365, 0.322, 0.294), vignette * 0.24);

  float grain = hash21(gl_FragCoord.xy + floor(u_time * 18.0)) - 0.5;
  color += grain * 0.018;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}
`;

type Uniforms = {
  resolution: WebGLUniformLocation;
  time: WebGLUniformLocation;
  pointer: WebGLUniformLocation;
  scroll: WebGLUniformLocation;
  motion: WebGLUniformLocation;
};

type MotionState = {
  x: number;
  y: number;
  scroll: number;
};

function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function getUniforms(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
): Uniforms | null {
  const resolution = gl.getUniformLocation(program, "u_resolution");
  const time = gl.getUniformLocation(program, "u_time");
  const pointer = gl.getUniformLocation(program, "u_pointer");
  const scroll = gl.getUniformLocation(program, "u_scroll");
  const motion = gl.getUniformLocation(program, "u_motion");

  if (!resolution || !time || !pointer || !scroll || !motion) {
    return null;
  }

  return {resolution, time, pointer, scroll, motion};
}

export function WebGLHeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl", {
      alpha: false,
      antialias: false,
      depth: false,
      powerPreference: "high-performance",
      stencil: false,
    });

    if (!canvas || !gl) {
      return;
    }

    const program = createProgram(gl);

    if (!program) {
      canvas.dataset.webglStatus = "compile-error";
      return;
    }

    const uniforms = getUniforms(gl, program);
    const positionLocation = gl.getAttribLocation(program, "a_position");

    if (!uniforms || positionLocation < 0) {
      canvas.dataset.webglStatus = "uniform-error";
      gl.deleteProgram(program);
      return;
    }

    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) {
      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animationFrame = 0;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let pointerX = 0;
    let pointerY = 0;
    let scrollProgress = 0;
    let isDisposed = false;
    const motion: MotionState = {x: 0, y: 0, scroll: 0};

    const updatePointer = (event: PointerEvent) => {
      if (isDisposed) {
        return;
      }

      pointerX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    const updateScroll = () => {
      if (isDisposed) {
        return;
      }

      const hero = canvas.closest("[data-home-hero]") as HTMLElement | null;
      const rect = (hero ?? canvas).getBoundingClientRect();
      scrollProgress = Math.min(
        1,
        Math.max(0, -rect.top / Math.max(1, window.innerHeight)),
      );
    };

    const resize = () => {
      if (isDisposed) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      canvasWidth = Math.max(1, rect.width);
      canvasHeight = Math.max(1, rect.height);
      const resolution = Math.max(
        0.55,
        Math.min(1.25, window.devicePixelRatio * 0.68),
      );

      canvas.width = Math.round(canvasWidth * resolution);
      canvas.height = Math.round(canvasHeight * resolution);
      gl.viewport(0, 0, canvas.width, canvas.height);
      updateScroll();
    };

    const draw = (time: number) => {
      if (isDisposed) {
        return;
      }

      const isReduced = mediaQuery.matches;
      motion.x += (pointerX - motion.x) * 0.05;
      motion.y += (pointerY - motion.y) * 0.05;
      motion.scroll += (scrollProgress - motion.scroll) * 0.045;

      gl.useProgram(program);
      gl.uniform2f(uniforms.resolution, canvasWidth, canvasHeight);
      gl.uniform1f(uniforms.time, isReduced ? 0 : time * 0.001);
      gl.uniform2f(uniforms.pointer, motion.x, motion.y);
      gl.uniform1f(uniforms.scroll, motion.scroll);
      gl.uniform1f(uniforms.motion, isReduced ? 0 : 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      if (!isDisposed && !isReduced && document.visibilityState === "visible") {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const start = () => {
      if (isDisposed) {
        return;
      }

      window.cancelAnimationFrame(animationFrame);
      draw(0);

      if (
        !isDisposed &&
        !mediaQuery.matches &&
        document.visibilityState === "visible"
      ) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    const observer = new ResizeObserver(() => {
      if (isDisposed) {
        return;
      }

      resize();
      start();
    });

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      window.cancelAnimationFrame(animationFrame);
    };

    resize();
    observer.observe(canvas);
    mediaQuery.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    canvas.addEventListener("webglcontextlost", handleContextLost);
    window.addEventListener("pointermove", updatePointer, {passive: true});
    window.addEventListener("scroll", updateScroll, {passive: true});
    start();

    return () => {
      isDisposed = true;
      observer.disconnect();
      mediaQuery.removeEventListener("change", start);
      document.removeEventListener("visibilitychange", start);
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      window.removeEventListener("pointermove", updatePointer);
      window.removeEventListener("scroll", updateScroll);
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <div
      className="webgl-hero-bg absolute inset-0 overflow-hidden"
      data-hero-background="webgl"
      data-pointer-reactive="true"
      aria-hidden="true"
      style={{
        background:
          "radial-gradient(58rem 24rem at 56% 24%, rgba(255, 184, 136, 0.42), transparent 72%), linear-gradient(120deg, #c77971, #d18678 52%, #c77f76 100%)",
      }}
    >
      <canvas
        ref={canvasRef}
        className="webgl-hero-canvas relative block h-full w-full"
      />
      <span
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(93, 82, 75, 0.08), rgba(93, 82, 75, 0.02) 44%, rgba(93, 82, 75, 0.14)), radial-gradient(78rem 42rem at 50% 56%, rgba(255, 248, 236, 0.045), transparent 72%)",
        }}
      />
    </div>
  );
}
