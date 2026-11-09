import * as THREE from "three";

/*
 * Shared by the scenes: a renderer only on a real graphics chip, and a warm-up so no shader is
 * ever compiled while the visitor is looking.
 */

const SOFTWARE = /swiftshader|llvmpipe|softpipe|software|basic render/i;

/** Thrown when this computer has no graphics chip worth using: it keeps the stills for the visit. */
export class NoGpu extends Error {
  name = "NoGpu";
}

/** Throws NoGpu without WebGL or on software rendering. Pixel ratio capped at 1.5. */
export function gpuRenderer(canvas: HTMLCanvasElement, exposure: number) {
  // The context is asked for here, with three's own attributes, so a refusal stays quiet.
  const gl = canvas.getContext("webgl2", {
    alpha: false,
    depth: true,
    stencil: false,
    antialias: true,
    premultipliedAlpha: true,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
    failIfMajorPerformanceCaveat: true,
  });
  if (!gl) throw new NoGpu("no WebGL 2 on a real graphics chip");
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, context: gl, antialias: true, alpha: false, powerPreference: "high-performance" });
  } catch (e) {
    throw new NoGpu(String(e));
  }
  // Firefox already names the chip in RENDERER (and warns about the extension); Chrome needs it.
  let chip = String(gl.getParameter(gl.RENDERER));
  if (/^webkit webgl$/i.test(chip)) {
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    if (info) chip = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL));
  }
  if (SOFTWARE.test(chip)) {
    renderer.dispose();
    renderer.forceContextLoss();
    throw new NoGpu(`software rendering: ${chip}`);
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = exposure;
  renderer.setClearColor(0x0e0c0a, 1);
  // The shaders are known good; skip the per-program check (and D3D precision notes in the console).
  renderer.debug.checkShaderErrors = false;
  return renderer;
}

/** Hands the main thread back between the steps of building a scene. */
export const breathe = () =>
  new Promise<void>((done) => {
    if (window.requestIdleCallback) window.requestIdleCallback(() => done(), { timeout: 300 });
    else window.setTimeout(done, 16);
  });

type PmremInternals = {
  _setSize: (size: number) => void;
  _allocateTargets: () => THREE.WebGLRenderTarget;
  _blurMaterial?: THREE.Material | null;
  _ggxMaterial?: THREE.Material | null;
};

/**
 * The room the glass reflects, prefiltered (PMREM). `fromScene` compiles its filter shaders and
 * uses them in the same breath, and the main thread waits for the GPU to link them: half a second
 * on Windows. So they (and the room's own materials) are compiled in the background first, and
 * `fromScene` finds them ready. Same result, nothing blocks.
 */
export async function environment(renderer: THREE.WebGLRenderer, room: THREE.Scene, sigma: number) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  try {
    const pm = pmrem as unknown as PmremInternals;
    pm._setSize(256); // fromScene's default size: it reuses these targets and materials
    const target = pm._allocateTargets();
    const filters = new THREE.Scene();
    for (const m of [pm._blurMaterial, pm._ggxMaterial]) if (m) filters.add(new THREE.Mesh(new THREE.BufferGeometry(), m));
    // fromScene draws into linear, untoned targets.
    const toneMapping = renderer.toneMapping;
    renderer.setRenderTarget(target);
    renderer.toneMapping = THREE.NoToneMapping;
    const compiled = Promise.all([renderer.compileAsync(filters, new THREE.OrthographicCamera()), renderer.compileAsync(room, new THREE.PerspectiveCamera(90, 1, 0.1, 100))]);
    renderer.setRenderTarget(null);
    renderer.toneMapping = toneMapping;
    await compiled;
    target.dispose();
  } catch {
    // A three.js without these internals: fromScene compiles them itself (and blocks).
  }
  await breathe();
  const env = pmrem.fromScene(room, sigma);
  pmrem.dispose();
  return env;
}

/**
 * Compiles every program the scene will use off the main thread (KHR_parallel_shader_compile),
 * then draws one frame while the canvas is still hidden, so textures are uploaded and the glass's
 * refraction target exists before anyone sees it.
 */
export async function warmUp(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera, draw: () => void) {
  await renderer.compileAsync(scene, camera);
  // Glass that refracts redraws the opaque things into a linear, untoned target first: those are
  // different programs, so compile them too.
  let refracts = false;
  scene.traverse((o) => {
    const m = (o as THREE.Mesh).material as THREE.MeshPhysicalMaterial | undefined;
    if (m && !Array.isArray(m) && m.transmission > 0) refracts = true;
  });
  if (refracts) {
    const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
    const toneMapping = renderer.toneMapping;
    renderer.setRenderTarget(target);
    renderer.toneMapping = THREE.NoToneMapping;
    const compiled = renderer.compileAsync(scene, camera);
    renderer.setRenderTarget(null);
    renderer.toneMapping = toneMapping;
    await compiled;
    target.dispose();
  }
  await breathe();
  draw();
}
