import * as THREE from "three";

/*
 * The wine section, desktop only: the sommelier's bottle for a region, standing in the arch.
 *
 * - The bottle is lathed from a Bordeaux profile in physical glass: dark green for reds, clear
 *   flint for whites, with the wine inside (its level shows at the shoulder against the light).
 * - The label is printed on a canvas in the site's serif and wrapped round the body; a foil
 *   capsule closes the neck.
 * - Scroll turns it a little; picking a region spins it once and it comes back round as that
 *   region's wine (new label, glass and colour while its back is to you).
 */

export type BottleWine = {
  name: string;
  producer: string;
  grape: string;
  vintage: number;
  region: string;
  kind: "white" | "orange" | "rose" | "red" | "sweet";
};

export type BottleHandle = {
  show: (index: number) => void;
  setProgress: (p: number) => void;
  setPointer: (x: number, y: number) => void;
  setVisible: (v: boolean) => void;
  resize: () => void;
  /** Settle and render once, for the stills. */
  freeze: () => void;
  dispose: () => void;
};

type Opts = {
  wines: BottleWine[];
  start: number;
  /** CSS font families for the label: the display serif and the UI sans. */
  serif: string;
  sans: string;
  labels: { country: string; volume: string };
  onReady: () => void;
};

const WINE: Record<BottleWine["kind"], [number, number, number]> = {
  white: [0.62, 0.48, 0.12],
  orange: [0.62, 0.3, 0.06],
  rose: [0.7, 0.22, 0.2],
  red: [0.16, 0.012, 0.02],
  sweet: [0.38, 0.12, 0.03],
};
/** Glass by style: dark green for reds, olive "dead leaf" for whites, amber for skin-contact and sweet. */
const GLASS: Record<BottleWine["kind"], [number, number]> = {
  white: [0x5c5a1c, 0.2],
  rose: [0x6a4a22, 0.24],
  orange: [0x6b3a10, 0.18],
  sweet: [0x5a2a0c, 0.16],
  red: [0x1e4a2c, 0.14],
};

// ───────────────────────────── geometry ─────────────────────────────

const R = 0.37;
const LEVEL = 2.08;

function bottleProfile(inset = 0) {
  const pts: [number, number][] = [
    [0.0001, 0.16],
    [0.12, 0.13], // the punt
    [0.27, 0.05],
    [0.335, 0.012],
    [0.362, 0.03],
    [R, 0.09],
    [R, 1.9],
    [0.362, 2.02],
    [0.315, 2.14],
    [0.235, 2.27],
    [0.17, 2.4],
    [0.148, 2.55],
    [0.143, 2.8],
    [0.146, 2.88],
  ];
  return pts.map(([r, y]) => new THREE.Vector2(Math.max(0.0001, r - inset), y));
}

function bottleGeometry() {
  const pts = bottleProfile();
  pts.push(new THREE.Vector2(0.168, 2.9), new THREE.Vector2(0.17, 2.97), new THREE.Vector2(0.15, 3.0), new THREE.Vector2(0.118, 2.99), new THREE.Vector2(0.11, 2.9));
  return new THREE.LatheGeometry(pts, 96);
}

function wineGeometry() {
  const inner = bottleProfile(0.03).filter((p) => p.y < LEVEL && p.y > 0.24);
  const pts = [new THREE.Vector2(0.0001, 0.2), new THREE.Vector2(0.3, 0.2), ...inner, new THREE.Vector2(0.33, LEVEL), new THREE.Vector2(0.0001, LEVEL)];
  return new THREE.LatheGeometry(pts, 64);
}

function capsuleGeometry() {
  const pts = [
    new THREE.Vector2(0.15, 2.52),
    new THREE.Vector2(0.152, 2.55),
    new THREE.Vector2(0.149, 2.8),
    new THREE.Vector2(0.151, 2.88),
    new THREE.Vector2(0.174, 2.9),
    new THREE.Vector2(0.176, 2.975),
    new THREE.Vector2(0.158, 3.008),
    new THREE.Vector2(0.0001, 3.012),
  ];
  return new THREE.LatheGeometry(pts, 64);
}

// ───────────────────────────── the label ─────────────────────────────

const LABEL_W = 1024;
const LABEL_H = 820;

function paper() {
  const c = document.createElement("canvas");
  c.width = LABEL_W;
  c.height = LABEL_H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#efe5d2";
  g.fillRect(0, 0, LABEL_W, LABEL_H);
  // Laid paper: a little fibre and a slow tone.
  const img = g.getImageData(0, 0, LABEL_W, LABEL_H);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 10;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n * 0.8;
  }
  g.putImageData(img, 0, 0);
  const grad = g.createRadialGradient(LABEL_W / 2, LABEL_H / 2, 100, LABEL_W / 2, LABEL_H / 2, 700);
  grad.addColorStop(0, "rgba(255,250,235,0)");
  grad.addColorStop(1, "rgba(120,90,50,0.16)");
  g.fillStyle = grad;
  g.fillRect(0, 0, LABEL_W, LABEL_H);
  return c;
}

function printLabel(canvas: HTMLCanvasElement, base: HTMLCanvasElement, w: BottleWine, o: Opts) {
  const g = canvas.getContext("2d")!;
  g.drawImage(base, 0, 0);
  const ink = "#2a1a12";
  const wine = "#6e1f2a";
  const cx = LABEL_W / 2;
  g.textAlign = "center";
  g.textBaseline = "alphabetic";

  // Frame
  g.strokeStyle = ink;
  g.globalAlpha = 0.75;
  g.lineWidth = 2;
  g.strokeRect(150, 46, LABEL_W - 300, LABEL_H - 92);
  g.lineWidth = 1;
  g.strokeRect(162, 58, LABEL_W - 324, LABEL_H - 116);
  g.globalAlpha = 1;

  // The sun setting into the river: Suton's mark
  g.save();
  g.translate(cx, 150);
  g.fillStyle = wine;
  g.beginPath();
  g.arc(0, 0, 30, Math.PI, 0);
  g.fill();
  g.fillRect(-46, 8, 92, 4);
  g.fillRect(-34, 18, 68, 4);
  g.fillRect(-22, 28, 44, 4);
  g.restore();

  const spaced = (text: string, y: number, size: number, spacing: number, color = ink) => {
    g.font = `500 ${size}px ${o.sans}`;
    g.fillStyle = color;
    const chars = [...text.toUpperCase()];
    const widths = chars.map((ch) => g.measureText(ch).width);
    const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
    let x = cx - total / 2;
    g.textAlign = "left";
    chars.forEach((ch, i) => {
      g.fillText(ch, x, y);
      x += widths[i] + spacing;
    });
    g.textAlign = "center";
  };

  spaced(w.producer, 236, 24, 7);
  // The wine's name, as large as fits
  let size = 112;
  g.font = `400 ${size}px ${o.serif}`;
  while (g.measureText(w.name).width > LABEL_W - 380 && size > 56) {
    size -= 4;
    g.font = `400 ${size}px ${o.serif}`;
  }
  g.fillStyle = ink;
  g.fillText(w.name, cx, 372);
  g.font = `italic 400 52px ${o.serif}`;
  g.fillStyle = wine;
  g.fillText(`${w.grape} · ${w.vintage}`, cx, 456);
  g.fillStyle = ink;
  g.fillRect(cx - 60, 500, 120, 2);
  spaced(w.region, 568, 30, 9);
  spaced(o.labels.country, 616, 22, 10);
  spaced(o.labels.volume, 728, 18, 6);
}

// ───────────────────────────── shaders ─────────────────────────────

const WINE_VERT = /* glsl */ `
varying vec3 vNormal;
varying vec3 vView;
varying float vY;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(w.xyz - cameraPosition);
  vY = position.y;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// The wine seen through the glass: dense in the middle, glowing where it is thin and lit from behind.
const WINE_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uLevel;
varying vec3 vNormal;
varying vec3 vView;
varying float vY;
void main() {
  float facing = clamp(dot(-vView, normalize(vNormal)), 0.0, 1.0);
  float thin = pow(1.0 - facing, 1.6);
  vec3 c = uColor * (0.25 + 0.9 * thin);
  c += uColor * 1.4 * smoothstep(uLevel - 0.06, uLevel, vY); // the surface line catches light
  gl_FragColor = vec4(c, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

const BACK_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uGlow;
void main() {
  // A warm glow behind the bottle, falling to the room's dark.
  vec2 p = vUv - vec2(0.527, 0.5);
  p.x *= 2.0;
  float d = length(p);
  vec3 c = mix(uGlow, vec3(0.006, 0.0045, 0.0035), smoothstep(0.0, 0.42, d));
  // Melts into the counter at the bottom.
  c *= smoothstep(0.0, 0.18, vUv.y) * 0.85 + 0.15;
  gl_FragColor = vec4(c, 1.0);
  #include <colorspace_fragment>
}`;

const FLOOR_FRAG = /* glsl */ `
varying vec2 vUv;
uniform vec3 uGlow;
void main() {
  vec2 p = (vUv - 0.5) * vec2(20.0, 6.0);
  float r = length(p);
  // Contact shadow under the base and a soft pool of light around it.
  float shadow = 1.0 - (1.0 - smoothstep(0.32, 0.8, r)) * 0.8;
  vec3 c = mix(uGlow * 0.55, vec3(0.006, 0.0045, 0.0035), smoothstep(0.0, 2.2, length(p * vec2(0.8, 1.4) - vec2(0.5, -0.4))));
  c *= mix(1.0, 0.25, smoothstep(0.55, 1.0, vUv.y));
  gl_FragColor = vec4(c * shadow, 1.0);
  #include <colorspace_fragment>
}`;

const PLANE_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

function cellarEnvironment() {
  const env = new THREE.Scene();
  env.add(new THREE.Mesh(new THREE.SphereGeometry(30, 32, 16), new THREE.MeshBasicMaterial({ color: 0x080605, side: THREE.BackSide })));
  const panel = (w: number, h: number, color: number, k: number, pos: [number, number, number]) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }));
    m.position.set(...pos);
    m.lookAt(0, 1.5, 0);
    env.add(m);
  };
  panel(2.2, 12, 0xffe2b8, 6, [-6, 3, 3]); // tall softbox, left
  panel(0.8, 10, 0xffb070, 4, [5.5, 2.5, -3]); // candle-warm strip behind right
  panel(8, 1.5, 0xfff0dc, 1.5, [0, 9, 2]); // ceiling
  panel(3, 3, 0xffd9a0, 1.2, [2, 1.5, 7]); // front fill
  return env;
}

export function createBottleScene(canvas: HTMLCanvasElement, opts: Opts): BottleHandle {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x0e0c0a, 1);
  renderer.debug.checkShaderErrors = false;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(cellarEnvironment(), 0.03);
  scene.environment = envRT.texture;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(22, 3 / 4.6, 0.1, 60);

  const glow = new THREE.Color(0.032, 0.013, 0.005);
  const backMat = new THREE.ShaderMaterial({ uniforms: { uGlow: { value: glow } }, vertexShader: PLANE_VERT, fragmentShader: BACK_FRAG, depthWrite: false });
  const back = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), backMat);
  back.position.set(0, 2.2, -3.2);
  scene.add(back);
  const floorMat = new THREE.ShaderMaterial({ uniforms: { uGlow: { value: glow } }, vertexShader: PLANE_VERT, fragmentShader: FLOOR_FRAG });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 6), floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const key = new THREE.DirectionalLight(0xffe4c4, 2.2);
  key.position.set(-4, 5, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffa860, 1.6);
  rim.position.set(4, 3, -4);
  scene.add(rim);

  const bottle = new THREE.Group();
  scene.add(bottle);

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0,
    roughness: 0.04,
    transmission: 1,
    thickness: 0.18,
    ior: 1.52,
    attenuationColor: new THREE.Color(0x1e4a2c),
    attenuationDistance: 0.14,
    specularIntensity: 1,
    envMapIntensity: 1.3,
  });
  const glassGeo = bottleGeometry();
  bottle.add(new THREE.Mesh(glassGeo, glassMat));

  const wineMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color() }, uLevel: { value: LEVEL } },
    vertexShader: WINE_VERT,
    fragmentShader: WINE_FRAG,
  });
  const wine = new THREE.Mesh(wineGeometry(), wineMat);
  bottle.add(wine);

  const capMat = new THREE.MeshPhysicalMaterial({ color: 0x4a1019, metalness: 0.75, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.2, envMapIntensity: 1.1 });
  const capGeo = capsuleGeometry();
  bottle.add(new THREE.Mesh(capGeo, capMat));

  // Label: wrapped on a slightly larger cylinder, front half of the body.
  const base = paper();
  const labelCanvas = document.createElement("canvas");
  labelCanvas.width = LABEL_W;
  labelCanvas.height = LABEL_H;
  const labelTex = new THREE.CanvasTexture(labelCanvas);
  labelTex.colorSpace = THREE.SRGBColorSpace;
  labelTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const ARC = 2.3;
  const labelGeo = new THREE.CylinderGeometry(R + 0.004, R + 0.004, 0.98, 96, 1, true, -ARC / 2, ARC);
  const labelMat = new THREE.MeshStandardMaterial({ map: labelTex, roughness: 0.78, metalness: 0, envMapIntensity: 0.9 });
  const label = new THREE.Mesh(labelGeo, labelMat);
  label.position.y = 1.05;
  bottle.add(label);

  let current = -1;
  function dress(i: number) {
    const w = opts.wines[i];
    current = i;
    printLabel(labelCanvas, base, w, opts);
    labelTex.needsUpdate = true;
    const [tint, depth] = GLASS[w.kind];
    glassMat.attenuationColor.set(tint);
    glassMat.attenuationDistance = depth;
    const [r, g, b] = WINE[w.kind];
    wineMat.uniforms.uColor.value.setRGB(r, g, b);
    capMat.color.set(w.kind === "red" ? 0x4a1019 : w.kind === "white" ? 0x8a7a4a : 0x2a1a12);
    dirty = true;
  }

  // ── motion ──
  let W = 1;
  let H = 1;
  let progress = 0;
  let shown = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  let spin = 0; // extra turn while changing bottles, 0..1
  let spinStart = -1;
  let queued = -1;
  const SPIN_MS = 1250;

  function frame() {
    const aspect = W / H;
    camera.aspect = aspect;
    // Fit the bottle's height to the frame, whatever the arch's shape.
    const fit = Math.max(1, 0.62 / aspect);
    camera.fov = 22 * Math.min(fit, 1.5);
    camera.position.set(pointer.x * 0.5, 1.95 + pointer.y * 0.25, 11.4);
    camera.lookAt(0, 1.52, 0);
    camera.updateProjectionMatrix();
    const turn = THREE.MathUtils.lerp(-0.45, 0.45, shown) + pointer.x * 0.18;
    const ease = spin < 0.5 ? 4 * spin * spin * spin : 1 - Math.pow(-2 * spin + 2, 3) / 2;
    bottle.rotation.y = turn + ease * Math.PI * 2;
  }

  function resize() {
    // Layout size, not the transformed one (the arch is scaled for its parallax).
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    renderer.setSize(W, H, false);
    dirty = true;
  }

  let visible = true;
  let running = false;
  let raf = 0;
  let dirty = true;
  let ready = false;
  let last = performance.now();

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    shown += (progress - shown) * Math.min(1, dt * 5);
    let moving = Math.abs(pointer.tx - pointer.x) > 0.0005 || Math.abs(pointer.ty - pointer.y) > 0.0005 || Math.abs(progress - shown) > 0.0005;
    if (spinStart >= 0) {
      spin = Math.min(1, (now - spinStart) / SPIN_MS);
      // Re-dress while its back is turned.
      if (queued >= 0 && spin > 0.32) {
        dress(queued);
        queued = -1;
      }
      if (spin >= 1) {
        spinStart = -1;
        spin = 0;
      }
      moving = true;
    }
    if (!dirty && !moving) return;
    dirty = false;
    frame();
    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      opts.onReady();
    }
  }

  function setRunning(on: boolean) {
    if (on === running) return;
    running = on;
    if (on) {
      last = performance.now();
      dirty = true;
      raf = requestAnimationFrame(tick);
    } else cancelAnimationFrame(raf);
  }
  const onVis = () => setRunning(visible && !document.hidden);
  document.addEventListener("visibilitychange", onVis);

  dress(opts.start);
  resize();
  setRunning(true);

  return {
    show(i) {
      if (i === current && queued < 0) return;
      if (spinStart >= 0 && spin < 0.32) {
        queued = i;
        return;
      }
      queued = i;
      spinStart = performance.now();
      if (!running) {
        dress(i);
        queued = -1;
        spinStart = -1;
      }
    },
    setProgress(p) {
      progress = p;
    },
    setPointer(x, y) {
      pointer.tx = x;
      pointer.ty = y;
    },
    setVisible(v) {
      visible = v;
      onVis();
    },
    resize,
    freeze() {
      pointer.x = pointer.tx = 0;
      pointer.y = pointer.ty = 0;
      shown = progress = 0.5;
      spinStart = -1;
      spin = 0;
      frame();
      renderer.render(scene, camera);
    },
    dispose() {
      setRunning(false);
      document.removeEventListener("visibilitychange", onVis);
      [glassGeo, wine.geometry, capGeo, labelGeo, back.geometry, floor.geometry].forEach((g) => g.dispose());
      [glassMat, wineMat, capMat, labelMat, backMat, floorMat].forEach((m) => m.dispose());
      labelTex.dispose();
      envRT.dispose();
      renderer.dispose();
    },
  };
}
