import * as THREE from "three";
import { breathe, environment, gpuRenderer, warmUp } from "./warm";
import { GRILL_LIGHT } from "./grillLight";

/*
 * The hero, desktop only: a glass of Serbian red on the oak counter, the grill working behind it.
 *
 * - The glass is lathed from a real Bordeaux profile: physical transmission refracts the grill,
 *   and a faint back wall is drawn in the opaque pass so the far side of the bowl shows through.
 * - The wine is its own shader: firelight passes through it (thin at the edges, so they glow
 *   ruby, near black in the middle), and its surface stays level in the world. A swirl of the
 *   cursor tilts it on a spring, like turning a glass on the bar.
 * - The counter is oiled oak. It reflects the fire at a grazing angle and carries the glass's
 *   long shadow, with the ruby light the wine focuses inside it.
 * - The grill film is a texture, mipmapped so the wine and the counter can see it blurred, and
 *   its brightness drives the light: the shadow and the ruby spot flicker with the flames. The
 *   brightness is measured ahead of time (scripts/grill-light.mjs) and looked up by the film's
 *   clock, so the video is never read back from the GPU.
 *
 * `setProgress(p)` (0..1, the hero's scroll) brings the camera round to the glass and centres it
 * for the arch. Built in steps that hand the main thread back, its shaders compiled and one frame
 * drawn before the promise resolves; nothing runs until `setVisible(true)` or while it's off screen.
 */

export type CounterHandle = {
  setPointer: (x: number, y: number) => void;
  setProgress: (p: number) => void;
  setVisible: (v: boolean) => void;
  resize: () => void;
  /** Hold one frame of the film and stop the clocks (for the stills phones are given). */
  freeze: (seconds: number) => Promise<void>;
  /** `free` also lets go of the WebGL context at once (when falling back to the still). */
  dispose: (free?: boolean) => void;
};

type Opts = {
  /** The grill film and a poster to show until its first frame. */
  video: string;
  poster: string;
  /** Called once the wine has been swirled by hand (the hint can go). */
  onSwirl?: () => void;
};

// ───────────────────────────── geometry ─────────────────────────────

/**
 * The scene is framed for a 2.2:1 window and every real one crops it like object-fit: cover with
 * the glass's own position as the crop point, so the glass keeps its size and place on any
 * desktop and the still (rendered at 2.2:1) lands exactly under the live canvas.
 */
const REF_ASPECT = 2.2;
const GLASS_X = 0.78; // across the frame, 0..1
const FILL = 1.47; // wine level, a classic pour to the widest part of the bowl
const GLASS_TOP = 2.2;

/** Outer profile of the bowl, bottom to rim (radius, height). */
const BOWL: [number, number][] = [
  [0.085, 0.95],
  [0.2, 0.99],
  [0.33, 1.07],
  [0.43, 1.2],
  [0.485, 1.38],
  [0.49, 1.56],
  [0.465, 1.76],
  [0.425, 1.96],
  [0.385, 2.13],
  [0.372, GLASS_TOP],
];

function bowlCurve(inset = 0) {
  const curve = new THREE.SplineCurve(BOWL.map(([r, y]) => new THREE.Vector2(r, y)));
  const pts = curve.getSpacedPoints(48);
  if (!inset) return pts;
  // Offset along the inward normal of the profile.
  return pts.map((p, i) => {
    const a = pts[Math.max(0, i - 1)];
    const b = pts[Math.min(pts.length - 1, i + 1)];
    const t = new THREE.Vector2().subVectors(b, a).normalize();
    return new THREE.Vector2(p.x - t.y * inset, p.y + t.x * inset);
  });
}

function glassGeometry() {
  const wall = 0.011;
  const pts: THREE.Vector2[] = [];
  const v = (x: number, y: number) => pts.push(new THREE.Vector2(x, y));
  // foot: underside, rounded edge, top that rises into the stem
  v(0.0001, 0.004);
  v(0.3, 0.0);
  v(0.395, 0.002);
  v(0.418, 0.01);
  v(0.414, 0.022);
  v(0.36, 0.03);
  v(0.22, 0.042);
  v(0.1, 0.06);
  v(0.052, 0.1);
  v(0.04, 0.17);
  // stem
  v(0.034, 0.3);
  v(0.032, 0.6);
  v(0.034, 0.8);
  v(0.045, 0.88);
  v(0.07, 0.93);
  // bowl, outside then the rolled rim, then back down the inside
  const outer = bowlCurve();
  outer.slice(1).forEach((p) => pts.push(p));
  v(0.367, GLASS_TOP + 0.004);
  v(0.362, GLASS_TOP);
  const inner = bowlCurve(wall).reverse();
  inner.slice(1, -1).forEach((p) => pts.push(p));
  v(0.06, 1.0);
  v(0.0001, 0.995);
  return new THREE.LatheGeometry(pts, 128);
}

/** The wine fills the inside of the bowl; its top is cut by the surface plane in the shader. */
function wineGeometry() {
  const inner = bowlCurve(0.0135).filter((p) => p.y < 2.1);
  const pts = [new THREE.Vector2(0.0001, 1.006), new THREE.Vector2(0.055, 1.008), ...inner.filter((p) => p.y > 1.02)];
  pts.push(new THREE.Vector2(pts[pts.length - 1].x * 0.5, 2.1), new THREE.Vector2(0.0001, 2.1));
  return new THREE.LatheGeometry(pts, 96);
}

/** Inner radius of the bowl at a height (for the surface's meniscus). */
function innerRadiusAt(y: number) {
  const pts = bowlCurve(0.0135);
  for (let i = 1; i < pts.length; i++) {
    if (pts[i].y >= y) {
      const a = pts[i - 1];
      const b = pts[i];
      return a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
    }
  }
  return 0.37;
}

// ───────────────────────────── shaders ─────────────────────────────

// Shared: where a ray meets the film behind the counter, and the film blurred to a depth.
const FILM = /* glsl */ `
uniform sampler2D uFilm;
uniform vec3 uFilmCenter;
uniform vec2 uFilmSize;
uniform float uFilmGain;

vec2 filmUv(vec3 o, vec3 d) {
  float t = (uFilmCenter.z - o.z) / min(d.z, -0.0001);
  vec3 p = o + d * t;
  return (p.xy - uFilmCenter.xy) / uFilmSize + 0.5;
}
// Both the poster and the video arrive undecoded (three leaves video in sRGB), so decode here.
vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
vec3 film(vec2 uv, float lod) {
  uv = clamp(uv, vec2(0.002), vec2(0.998));
  return toLinear(textureLod(uFilm, uv, lod).rgb) * uFilmGain;
}
`;

const BG_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// The grill, out of focus behind the counter: slightly soft, graded warm, darker at the top.
const BG_FRAG = /* glsl */ `
uniform sampler2D uFilm;
uniform float uFilmGain;
uniform float uBlur;
varying vec2 vUv;
vec3 toLinear(vec3 c) { return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c)); }
void main() {
  vec3 c = toLinear(textureLod(uFilm, vUv, uBlur).rgb);
  c = pow(c, vec3(1.18)) * vec3(1.0, 0.9, 0.8) * uFilmGain * 0.82;
  float l = dot(c, vec3(0.299, 0.587, 0.114));
  c = mix(vec3(l), c, 1.12);
  c *= mix(0.45, 1.0, smoothstep(1.0, 0.5, vUv.y));
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`;

const WORLD_VERT = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormal;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vNormal = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const WINE_FRAG = /* glsl */ `
${FILM}
uniform vec4 uPlane;      // surface: dot(n, p) = w
uniform vec3 uLight;      // where the firelight comes from
uniform float uFlicker;
uniform float uRadius;    // inner radius of the bowl at the surface
uniform float uTime;
uniform float uWobble;
varying vec3 vWorld;
varying vec3 vNormal;

const vec3 ABSORB = vec3(1.1, 6.5, 5.6);
const vec3 DEEP = vec3(0.045, 0.004, 0.008);

void main() {
  vec3 n = uPlane.xyz;
  if (dot(n, vWorld) > uPlane.w) discard;
  vec3 V = normalize(vWorld - cameraPosition);
  vec3 L = normalize(uLight - vWorld);
  vec3 col;

  if (gl_FrontFacing) {
    // Through the body: the film behind, bent by the wine and filtered by its depth.
    vec3 N = normalize(vNormal);
    float facing = clamp(dot(-V, N), 0.0, 1.0);
    vec3 R = refract(V, N, 0.75);
    vec3 behind = film(filmUv(vWorld, R), 2.6);
    float path = mix(0.08, 1.05, pow(facing, 0.8));
    col = behind * exp(-ABSORB * path * 1.5) * 1.8;
    // Forward scatter: the bowl glows where it sits between you and the fire.
    float fwd = pow(max(dot(V, -L), 0.0), 3.0);
    col += vec3(0.42, 0.035, 0.03) * fwd * uFlicker * (1.0 - facing * 0.6);
    // Thin at the edge of the bowl, so the edge glows.
    col += vec3(0.3, 0.025, 0.03) * pow(1.0 - facing, 2.0) * uFlicker;
    col += DEEP * 0.6;
  } else {
    // The level surface, seen through the cut top.
    float t = (uPlane.w - dot(n, cameraPosition)) / dot(n, V);
    vec3 S = cameraPosition + V * t;
    // Swirl ripples ride on the surface normal.
    vec2 q = S.xz;
    float rip = sin(length(q) * 38.0 - uTime * 7.0) * 0.5 + sin(q.x * 21.0 + uTime * 3.1) * 0.25;
    vec3 Ns = normalize(n + vec3(q.x, 0.0, q.y) * rip * 0.05 * uWobble + vec3(0.0, 0.0, 0.0));
    vec3 Rr = reflect(V, Ns);
    float fres = 0.025 + 0.975 * pow(1.0 - clamp(dot(-V, Ns), 0.0, 1.0), 5.0);
    vec3 refl = Rr.z < -0.02 ? film(filmUv(S, Rr), 3.2) : vec3(0.02, 0.012, 0.01);
    float edge = smoothstep(0.62, 1.0, length(q) / uRadius);
    col = DEEP + vec3(0.33, 0.03, 0.035) * edge * edge * (0.45 + 0.55 * uFlicker);
    col += refl * fres * 1.25;
    // A soft highlight of the fire on the surface.
    vec3 H = normalize(L - V);
    col += vec3(1.0, 0.62, 0.32) * pow(max(dot(Ns, H), 0.0), 140.0) * 0.6 * uFlicker;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// Where the glass stops the firelight: soft discs projected from the light, sharper near the foot.
const COUNTER_FRAG = /* glsl */ `
${FILM}
uniform vec3 uLight;
uniform float uFlicker;
uniform float uEdge;     // z of the counter's back edge
uniform float uFill;
uniform vec4 uPlane;
uniform float uBowl[10];
uniform float uBowlR[10];
varying vec3 vWorld;
varying vec3 vNormal;

float hash(vec2 p) { return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}

// Where a point at height h on the glass's axis lands on the counter, and how much it grows.
vec2 proj(float h) { return -uLight.xz * h / (uLight.y - h); }
float grow(float h) { return uLight.y / (uLight.y - h); }

float disc(vec2 p, vec2 c, float r, float soft) {
  return 1.0 - smoothstep(r - soft, r + soft, length(p - c));
}
float segment(vec2 p, vec2 a, vec2 b, float r, float soft) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return 1.0 - smoothstep(r - soft, r + soft, length(pa - ba * h));
}

void main() {
  vec3 P = vWorld;
  vec2 q = P.xz;
  vec3 V = normalize(P - cameraPosition);

  // Oiled oak, grain running along the counter.
  float g = fbm(vec2(P.x * 0.22, P.z * 6.0) + fbm(P.xz * vec2(0.5, 1.6)) * 2.2);
  float fine = noise(vec2(P.x * 1.2, P.z * 70.0));
  float ring = smoothstep(0.35, 0.65, fract(g * 5.0));
  vec3 wood = mix(vec3(0.018, 0.011, 0.007), vec3(0.06, 0.035, 0.019), g) * (0.75 + 0.25 * ring) * (0.9 + 0.2 * fine);
  vec3 N = normalize(vec3((g - 0.5) * 0.025, 1.0, (fine - 0.5) * 0.012));

  // Firelight reflected at a grazing angle, blurred by the oil finish.
  vec3 R = reflect(V, N);
  float fres = 0.03 + 0.97 * pow(1.0 - clamp(dot(-V, N), 0.0, 1.0), 5.0);
  float dist = length(P - cameraPosition);
  vec3 refl = R.z < -0.01 ? film(filmUv(P, R), 5.2 + g * 0.8) : vec3(0.0);

  // The glass's shadow: foot, stem, then the bowl (deep where the wine is).
  float sFoot = disc(q, vec2(0.0), 0.43, 0.06);
  float sStem = segment(q, proj(0.1), proj(0.92), 0.04 * grow(0.6), 0.035);
  float sWine = 0.0, sGlass = 0.0;
  for (int i = 0; i < 10; i++) {
    float h = uBowl[i];
    float r = uBowlR[i] * grow(h);
    float soft = 0.05 + 0.06 * h;
    float d = disc(q, proj(h), r, soft);
    if (h < uFill) sWine = max(sWine, d); else sGlass = max(sGlass, d);
  }
  float shade = 1.0 - max(max(sFoot * 0.5, sStem * 0.55), max(sWine * 0.45, sGlass * 0.2));
  // Light through red wine stays red: the bowl's shadow is tinted, not black.
  vec3 tint = mix(vec3(1.0), vec3(0.55, 0.05, 0.06), sWine);

  // The bowl of wine is a lens: a ruby spot at the far end of its shadow, and a gold rim from the empty glass.
  vec2 dir = normalize(-uLight.xz);
  vec2 cWine = proj(uFill - 0.12) + dir * 0.1;
  vec2 rel = q - cWine;
  vec2 rq = vec2(dot(rel, dir) * 0.7, dot(rel, vec2(-dir.y, dir.x)));
  float spot = (1.0 - smoothstep(0.04, 0.3 * grow(1.3), length(rq))) * sWine;
  float core = 1.0 - smoothstep(0.0, 0.1 * grow(1.3), length(rq - vec2(0.03, 0.0)));

  vec3 fire = vec3(1.0, 0.56, 0.26) * uFlicker;
  vec3 Ld = normalize(uLight - P);
  vec3 col = wood * (0.06 + fire * max(dot(N, Ld), 0.0) * 1.1) * shade * tint;
  col += refl * fres * 0.55 * mix(1.0, shade, 0.85) * tint;
  col += vec3(0.5, 0.025, 0.03) * spot * 0.5 * uFlicker + vec3(0.85, 0.14, 0.09) * core * spot * 0.28 * uFlicker;

  // The back edge catches the fire.
  float lip = smoothstep(uEdge + 0.06, uEdge + 0.005, P.z) * smoothstep(uEdge - 0.01, uEdge + 0.005, P.z);
  col += fire * lip * 0.5;
  // Falls into the dark towards you.
  col *= mix(1.0, 0.35, smoothstep(4.0, 10.0, P.z));

  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

// ───────────────────────────── scene ─────────────────────────────

/** The bar at night, for the glass to reflect: dark room, the fire wall behind, two softboxes. */
function barEnvironment() {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0x0a0706, side: THREE.BackSide })));
  const panel = (w: number, h: number, color: number, k: number, pos: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 1.4, 0);
    env.add(m);
  };
  panel(22, 4, 0xff7a2e, 0.9, [0, 1.2, -12]); // the grill
  panel(1.4, 10, 0xffe9c8, 7, [-6.5, 3, 3.5]); // tall softbox, left
  panel(0.9, 8, 0xdfe6ff, 3, [7, 2.5, 3]); // cooler strip, right
  panel(1.2, 6, 0xff9a50, 2.4, [4, 2, -6]); // the fire's rim, behind right
  panel(10, 1.2, 0xfff0dc, 1.2, [0, 9, 1]); // ceiling line
  panel(20, 2, 0x140a05, 1, [0, -2, 0]); // the counter
  return env;
}

export async function createCounterScene(canvas: HTMLCanvasElement, opts: Opts): Promise<CounterHandle> {
  const renderer = gpuRenderer(canvas, 1.0);
  await breathe();

  const scene = new THREE.Scene();
  const envRT = await environment(renderer, barEnvironment(), 0.02);
  scene.environment = envRT.texture;
  await breathe();

  const camera = new THREE.PerspectiveCamera(24, 16 / 10, 0.1, 80);

  // The film: poster first (the first frame waits for it), then the video once it plays.
  const poster = await new THREE.TextureLoader().loadAsync(opts.poster);
  poster.colorSpace = THREE.NoColorSpace;
  poster.generateMipmaps = true;
  poster.minFilter = THREE.LinearMipmapLinearFilter;
  const video = document.createElement("video");
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "auto";
  video.src = opts.video;
  const vtex = new THREE.VideoTexture(video);
  vtex.colorSpace = THREE.NoColorSpace;
  vtex.generateMipmaps = true;
  vtex.minFilter = THREE.LinearMipmapLinearFilter;
  const filmUniforms = {
    uFilm: { value: poster as THREE.Texture },
    uFilmCenter: { value: new THREE.Vector3(0, 2, -14) },
    uFilmSize: { value: new THREE.Vector2(30, 30 / (16 / 9)) },
    uFilmGain: { value: 1 },
  };
  let videoOn = false;
  video.addEventListener("playing", () => {
    if (videoOn) return;
    videoOn = true;
    filmUniforms.uFilm.value = vtex;
  });
  // Draw when the film has a new frame (about 25 a second), not on every display refresh.
  const onVideoFrame = () => {
    dirty = true;
    video.requestVideoFrameCallback(onVideoFrame);
  };
  const frameCallbacks = "requestVideoFrameCallback" in video;
  if (frameCallbacks) video.requestVideoFrameCallback(onVideoFrame);

  const bgMat = new THREE.ShaderMaterial({
    uniforms: { uFilm: filmUniforms.uFilm, uFilmGain: filmUniforms.uFilmGain, uBlur: { value: 0.45 } },
    vertexShader: BG_VERT,
    fragmentShader: BG_FRAG,
    depthWrite: false,
  });
  const bg = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), bgMat);
  bg.renderOrder = -1;
  scene.add(bg);

  const light = new THREE.Vector3(2.6, 7.6, -4.6);
  const shared = { uLight: { value: light }, uFlicker: { value: 1 } };
  const plane = new THREE.Vector4(0, 1, 0, FILL);

  const EDGE = -1.7;
  const bowlH = [1.0, 1.12, 1.25, 1.38, 1.5, 1.62, 1.76, 1.9, 2.04, 2.18];
  const counterMat = new THREE.ShaderMaterial({
    uniforms: {
      ...filmUniforms,
      ...shared,
      uEdge: { value: EDGE },
      uFill: { value: FILL },
      uPlane: { value: plane },
      uBowl: { value: bowlH },
      uBowlR: { value: bowlH.map((h) => innerRadiusAt(h) + 0.012) },
    },
    vertexShader: WORLD_VERT,
    fragmentShader: COUNTER_FRAG,
  });
  const counter = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), counterMat);
  counter.rotation.x = -Math.PI / 2;
  counter.position.set(0, 0, EDGE + 15);
  scene.add(counter);

  const glass = new THREE.Group();
  scene.add(glass);
  const glassGeo = glassGeometry();
  const frontMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.025,
    transmission: 1,
    thickness: 0.06,
    ior: 1.5,
    specularIntensity: 1,
    envMapIntensity: 1.15,
  });
  // The foot is thick, near-flat glass seen edge on: it shows the dark bar more than the fire.
  frontMat.onBeforeCompile = (sh) => {
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying float vHeight;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvHeight = position.y;");
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vHeight;")
      .replace("#include <lights_fragment_end>", "#include <lights_fragment_end>\nreflectedLight.indirectSpecular *= mix(0.22, 1.0, smoothstep(0.03, 0.16, vHeight));")
      .replace("#include <transmission_fragment>", "#include <transmission_fragment>\ntotalDiffuse *= mix(0.6, 1.0, smoothstep(0.03, 0.16, vHeight));");
  };
  const front = new THREE.Mesh(glassGeo, frontMat);
  glass.add(front);
  // The bowl's far wall: only its reflections, added in the opaque pass so the front refracts it.
  const backMat = new THREE.MeshPhysicalMaterial({
    color: 0x000000,
    roughness: 0.04,
    metalness: 0,
    envMapIntensity: 0.55,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const back = new THREE.Mesh(glassGeo, backMat);
  back.renderOrder = 1;
  glass.add(back);

  const wineMat = new THREE.ShaderMaterial({
    uniforms: {
      ...filmUniforms,
      ...shared,
      uPlane: { value: plane },
      uRadius: { value: innerRadiusAt(FILL) },
      uTime: { value: 0 },
      uWobble: { value: 0 },
    },
    vertexShader: WORLD_VERT,
    fragmentShader: WINE_FRAG,
    side: THREE.DoubleSide,
  });
  const wine = new THREE.Mesh(wineGeometry(), wineMat);
  glass.add(wine);

  // ── framing ──
  let W = 1;
  let H = 1;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let progress = 0;
  let shownProgress = 0;
  const intro = { t: 0 };

  /** Camera for a scroll progress and pointer; the glass sits right of centre, then centred in the arch. */
  function frame() {
    const p = THREE.MathUtils.smoothstep(shownProgress, 0, 0.75);
    const aspect = W / H;
    camera.aspect = aspect;
    const dist = THREE.MathUtils.lerp(9.4, 10.6, p);
    const yaw = pointer.x * 0.06 + p * 0.1;
    const height = THREE.MathUtils.lerp(1.85, 2.75, p) - pointer.y * 0.18;
    const target = new THREE.Vector3(0, THREE.MathUtils.lerp(1.08, 1.12, p), 0);
    camera.position.set(Math.sin(yaw) * dist, height, Math.cos(yaw) * dist);
    camera.lookAt(target);
    camera.aspect = REF_ASPECT;
    camera.updateProjectionMatrix();
    camera.updateMatrixWorld();
    // Lens shift in the reference frame: the glass stays upright as it moves across. Then the
    // window is cropped the way object-fit: cover crops the still.
    const gx = THREE.MathUtils.lerp(GLASS_X * 2 - 1, 0, p);
    const gy = THREE.MathUtils.lerp(0.02, -0.1, p);
    const c = target.clone().project(camera);
    const top0 = camera.near * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const right0 = top0 * REF_ASPECT;
    let l = -right0 + (c.x - gx) * right0;
    let r = right0 + (c.x - gx) * right0;
    let t = top0 + (c.y - gy) * top0;
    let b = -top0 + (c.y - gy) * top0;
    if (aspect > REF_ASPECT) {
      const h = (r - l) / aspect;
      const mid = (t + b) / 2;
      t = mid + h / 2;
      b = mid - h / 2;
    } else {
      const w = (t - b) * aspect;
      l += (r - l - w) * THREE.MathUtils.lerp(GLASS_X, 0.5, p);
      r = l + w;
    }
    camera.aspect = aspect;
    camera.projectionMatrix.makePerspective(l, r, t, b, camera.near, camera.far);
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

    // Film plane: cover the frame with room for the pointer's parallax; the grill sits just above the counter.
    const z = -14;
    const corner = (x: number, y: number) => {
      const v = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const d = v.sub(camera.position).normalize();
      return camera.position.clone().add(d.multiplyScalar((z - camera.position.z) / d.z));
    };
    const tl = corner(-1, 1);
    const br = corner(1, -1);
    const edgeY = corner(0, new THREE.Vector3(0, 0, EDGE).project(camera).y).y;
    const filmAspect = 16 / 9;
    const top = tl.y + 1.2;
    const bottom = Math.min(edgeY - 0.9, br.y);
    const hgt = Math.max(top - bottom, (br.x - tl.x + 3) / filmAspect);
    const wid = hgt * filmAspect;
    const cx = (tl.x + br.x) / 2;
    const cy = bottom + hgt / 2;
    bg.position.set(cx, cy, z);
    bg.scale.set(wid, hgt, 1);
    filmUniforms.uFilmCenter.value.set(cx, cy, z);
    filmUniforms.uFilmSize.value.set(wid, hgt);
  }

  function resize() {
    // Layout size, not the transformed one (the arch is scaled for its parallax).
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    renderer.setSize(W, H, false);
    dirty = true;
  }

  // ── the wine on a spring ──
  // Starts where the still leaves it, then the wine swings round once as if just set down.
  const tilt = new THREE.Vector2(0.035, 0.01);
  const tiltV = new THREE.Vector2(-0.15, 1.1);
  const K = 92;
  const DAMP = 1.5;
  let swirlEnergy = 0;
  let swirled = false;
  const lastPtr = { x: 0, y: 0, t: 0 };

  function onPointer(x: number, y: number) {
    pointer.tx = x;
    pointer.ty = y;
    const now = performance.now();
    const dt = Math.max(8, now - lastPtr.t) / 1000;
    if (lastPtr.t && dt < 0.2) {
      // Movement near the glass turns it on the bar: horizontal sways x, vertical sways z.
      const vx = (x - lastPtr.x) / dt;
      const vy = (y - lastPtr.y) / dt;
      const near = 1 - THREE.MathUtils.smoothstep(Math.hypot(x - glassScreen.x, (y - glassScreen.y) * 0.8), 0.25, 0.9);
      tiltV.x += THREE.MathUtils.clamp(vx, -6, 6) * 0.05 * near;
      tiltV.y += THREE.MathUtils.clamp(-vy, -6, 6) * 0.05 * near;
      swirlEnergy += Math.hypot(vx, vy) * near * dt;
      if (!swirled && swirlEnergy > 2.2) {
        swirled = true;
        opts.onSwirl?.();
      }
    }
    lastPtr.x = x;
    lastPtr.y = y;
    lastPtr.t = now;
    dirty = true;
  }
  const glassScreen = new THREE.Vector2(0.6, 0);

  // ── firelight from the film ──
  let flickerTarget = 1;
  let probeTick = 0;
  function sampleFire() {
    if (!videoOn || video.readyState < 2) return;
    const { step, duration, values } = GRILL_LIGHT;
    const at = ((video.currentTime % duration) + duration) % duration * step;
    const i = Math.floor(at);
    const lum = THREE.MathUtils.lerp(values[i % values.length], values[(i + 1) % values.length], at - i);
    flickerTarget = THREE.MathUtils.clamp(0.55 + lum * 1.6, 0.75, 1.35);
  }

  // ── loop ──
  let visible = false;
  let running = false;
  let raf = 0;
  let dirty = true;
  let frozen = false;
  let last = performance.now();
  let time = 0;

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (frozen) return;
    time += dt;
    intro.t += dt;

    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3.2);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3.2);
    shownProgress += (progress - shownProgress) * Math.min(1, dt * 6);

    // Spring: the surface wants to be level, the push from the pointer swings it round.
    const ax = -K * tilt.x - DAMP * tiltV.x;
    const ay = -K * tilt.y - DAMP * tiltV.y;
    tiltV.x += ax * dt;
    tiltV.y += ay * dt;
    tilt.x += tiltV.x * dt;
    tilt.y += tiltV.y * dt;
    const max = 0.42;
    if (tilt.length() > max) tilt.setLength(max);
    const n = new THREE.Vector3(-tilt.x, 1, -tilt.y).normalize();
    plane.set(n.x, n.y, n.z, n.y * FILL);
    const energy = tilt.length() + tiltV.length() * 0.1;
    wineMat.uniforms.uWobble.value = Math.min(1, energy * 3);
    wineMat.uniforms.uTime.value = time;

    if (++probeTick % 3 === 0) sampleFire();
    const f = shared.uFlicker.value;
    shared.uFlicker.value = f + (flickerTarget - f) * Math.min(1, dt * 7);
    // The flames sway the light a little.
    light.x = 2.6 + Math.sin(time * 1.3) * 0.12 + (shared.uFlicker.value - 1) * 0.4;

    const moving = energy > 0.002 || Math.abs(pointer.tx - pointer.x) > 0.0005 || Math.abs(progress - shownProgress) > 0.0005 || intro.t < 3.4;
    if (!dirty && !moving && !(videoOn && !frameCallbacks)) return;
    dirty = false;
    frame();
    const gs = new THREE.Vector3(0, 1.45, 0).project(camera);
    glassScreen.set(gs.x, gs.y);
    renderer.render(scene, camera);
  }

  function setRunning(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      raf = requestAnimationFrame(tick);
      if (!frozen) video.play().catch(() => {});
    } else {
      cancelAnimationFrame(raf);
      video.pause();
    }
  }

  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  resize();
  await breathe();
  await warmUp(renderer, scene, camera, () => {
    frame();
    renderer.render(scene, camera);
  });

  return {
    setPointer: onPointer,
    setProgress: (p) => {
      progress = p;
      dirty = true;
    },
    setVisible: (v) => {
      visible = v;
      onVis();
    },
    resize,
    async freeze(seconds) {
      frozen = true;
      video.pause();
      await new Promise<void>((done) => {
        video.addEventListener("seeked", () => done(), { once: true });
        video.currentTime = seconds;
      });
      videoOn = true;
      filmUniforms.uFilm.value = vtex;
      vtex.needsUpdate = true;
      tilt.set(0.035, 0.01);
      tiltV.set(0, 0);
      intro.t = 10;
      pointer.x = pointer.tx = 0;
      pointer.y = pointer.ty = 0;
      shownProgress = progress;
      const n = new THREE.Vector3(-tilt.x, 1, -tilt.y).normalize();
      plane.set(n.x, n.y, n.z, n.y * FILL);
      wineMat.uniforms.uWobble.value = 0.1;
      flickerTarget = shared.uFlicker.value = 1.05;
      frame();
      renderer.render(scene, camera);
      renderer.render(scene, camera);
    },
    dispose(free) {
      setRunning(false);
      document.removeEventListener("visibilitychange", onVis);
      video.removeAttribute("src");
      video.load();
      vtex.dispose();
      poster.dispose();
      envRT.dispose();
      glassGeo.dispose();
      wine.geometry.dispose();
      counter.geometry.dispose();
      bg.geometry.dispose();
      [frontMat, backMat, wineMat, counterMat, bgMat].forEach((m) => m.dispose());
      renderer.dispose();
      if (free) renderer.forceContextLoss();
    },
  };
}
