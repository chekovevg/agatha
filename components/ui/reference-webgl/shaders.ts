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
