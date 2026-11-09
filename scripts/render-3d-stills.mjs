// Stills rendered from the live 3D scenes, for everyone who doesn't get them live (phones, tablets,
// reduced motion, Save-Data) and for desktops to show before the canvas fades in over them:
//   - the hero: a glass of red on the counter (src/components/fx/counterScene.ts) at one film frame
//   - the wine section: the sommelier's bottle (src/components/fx/bottleScene.ts), Župa's by default
// Run from the project root after `next build` (the label borrows the built Hanken Grotesk):
//
//   ESBUILD=<path to esbuild package> PLAYWRIGHT=<path to playwright-core> node scripts/render-3d-stills.mjs
//
// Needs Google Chrome (real GPU, H.264). Nothing is served: the pages and /public are answered by
// the browser's own request interception, and the script exits by itself.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FRAME = 3.9; // seconds into grill.mp4: the meat in focus, flames behind
const CHROME = process.env.CHROME || "C:/Program Files/Google/Chrome/Application/chrome.exe";
// Neither is a dependency of the site: point at any installed copy.
const load = async (name) => {
  const mod = await import(pathToFileURL(createRequire(import.meta.url).resolve(process.env[name.toUpperCase()] || name)).href);
  return mod.default ?? mod;
};
const esbuild = await load("esbuild");
const { chromium } = await load("playwright");
setTimeout(() => {
  console.error("timed out");
  process.exit(3);
}, 180000).unref();

const types = { ".js": "text/javascript", ".html": "text/html", ".jpg": "image/jpeg", ".mp4": "video/mp4", ".woff2": "font/woff2" };
const posters = (f) => path.join(ROOT, "public/images/posters", f);

// The label's fonts, as the site has them.
function fontFaces() {
  const dir = path.join(ROOT, ".next/static/chunks");
  const css = fs.readdirSync(dir).filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(path.join(dir, f), "utf8")).find((c) => c.includes("Hanken Grotesk"));
  if (!css) throw new Error("run `next build` first");
  const hanken = css.match(/@font-face\{font-family:Hanken Grotesk;[^}]*\}/g).map((r) => r.replace("Hanken Grotesk", "LabelSans").replace(/url\(\.\.\/media\//g, "url(/__next/media/"));
  const serif = ["Regular", "Italic"].map((s) => `@font-face{font-family:LabelSerif;font-style:${s === "Italic" ? "italic" : "normal"};src:url(/__fonts/DMSerifDisplay-${s}.woff2)}`);
  return [...hanken, ...serif].join("\n");
}

async function bundle(tmp, name, code) {
  fs.writeFileSync(path.join(tmp, name + ".ts"), code);
  await esbuild.build({ entryPoints: [path.join(tmp, name + ".ts")], bundle: true, outfile: path.join(tmp, name + ".js"), nodePaths: [path.join(ROOT, "node_modules")], logLevel: "warning" });
}

(async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "stills-"));
  const src = (p) => JSON.stringify(path.join(ROOT, "src", p));
  await bundle(
    tmp,
    "counter",
    `import { createCounterScene } from ${src("components/fx/counterScene")};
createCounterScene(document.querySelector("canvas")!, { video: "/video/grill.mp4", poster: "/images/posters/grill.jpg" }).then((h) => {
  h.setVisible(true);
  (window as any).__freeze = () => h.freeze(${FRAME});
  (window as any).__ready = true;
});`,
  );
  await bundle(
    tmp,
    "bottle",
    `import { createBottleScene } from ${src("components/fx/bottleScene")};
import { regions, wines, cellarPicks } from ${src("content/wines")};
const picks = regions.map((r) => { const w = wines.find((x) => x.id === cellarPicks[r.id])!; return { name: w.name, producer: w.producer, grape: w.grape, vintage: w.vintage, region: r.name.sr, kind: w.color }; });
document.fonts.load("400 40px LabelSerif").then(() => document.fonts.load("italic 400 40px LabelSerif")).then(() => document.fonts.load("500 20px LabelSans")).then(() => {
  return createBottleScene(document.querySelector("canvas")!, { wines: picks, start: regions.findIndex((r) => r.id === "zupa"), serif: "LabelSerif", sans: "LabelSans", labels: { country: "Srbija", volume: "0,75 l · 13,5 % vol" } });
}).then((h) => {
  h.setVisible(true);
  (window as any).__freeze = () => h.freeze();
  (window as any).__ready = true;
});`,
  );
  const page = (name) =>
    `<!doctype html><style>${fontFaces()}</style><body style="margin:0;background:#0e0c0a"><canvas style="position:fixed;inset:0;width:100vw;height:100vh"></canvas><script src="/__${name}.js"></script>`;

  const browser = await chromium.launch({ executablePath: CHROME, headless: true, args: ["--enable-gpu", "--ignore-gpu-blocklist", "--autoplay-policy=no-user-gesture-required"] });
  const shoot = async (name, width, height) => {
    const tab = await browser.newPage({ viewport: { width, height } });
    await tab.route("**/*", async (route) => {
      const p = new URL(route.request().url()).pathname;
      if (p === "/") return route.fulfill({ body: page(name), headers: { "content-type": "text/html" } });
      const file = p.startsWith("/__next/") ? path.join(ROOT, ".next/static", p.slice(8)) : p.startsWith("/__fonts/") ? path.join(ROOT, "src/fonts", p.slice(9)) : p.startsWith("/__") ? path.join(tmp, p.slice(3)) : path.join(ROOT, "public", p);
      if (!fs.existsSync(file)) return route.fulfill({ status: 404, body: "" });
      const body = fs.readFileSync(file);
      const type = types[path.extname(file)] || "application/octet-stream";
      // The film has to be seekable.
      const range = /bytes=(\d*)-(\d*)/.exec(route.request().headers().range || "");
      if (!range) return route.fulfill({ body, headers: { "content-type": type, "accept-ranges": "bytes" } });
      const start = +range[1] || 0;
      const end = range[2] ? +range[2] : body.length - 1;
      return route.fulfill({ status: 206, body: body.subarray(start, end + 1), headers: { "content-type": type, "accept-ranges": "bytes", "content-range": `bytes ${start}-${end}/${body.length}` } });
    });
    await tab.goto("http://stills.local/");
    await tab.waitForFunction(() => window.__ready, null, { timeout: 30000 });
    await tab.waitForTimeout(1500);
    await tab.evaluate(() => window.__freeze());
    await tab.waitForTimeout(300);
    const png = await tab.screenshot();
    await tab.close();
    return png;
  };

  // Hero: 2.2:1, which every desktop window crops like object-fit: cover; phones get its right-hand 5:4.
  const hero = await shoot("counter", 2860, 1300);
  for (const w of [1600, 2200, 2860]) await sharp(hero).resize(w).avif({ quality: 58, effort: 8 }).toFile(posters(`hero-3d-${w}.avif`));
  await sharp(hero).resize(2200).webp({ quality: 72 }).toFile(posters("hero-3d-2200.webp"));
  const phone = () => sharp(hero).extract({ left: 2860 - 1625, top: 0, width: 1625, height: 1300 }).resize(900, 720).sharpen({ sigma: 0.6 });
  await phone().avif({ quality: 62, effort: 8 }).toFile(posters("hero-phone-900.avif"));
  await phone().resize(640).avif({ quality: 62, effort: 8 }).toFile(posters("hero-phone-640.avif"));
  await phone().webp({ quality: 78 }).toFile(posters("hero-phone-900.webp"));

  // Wine section: the arch on desktop (3:4.6), and 5:3 for a phone's shorter arch.
  const tall = await shoot("bottle", 1080, 1656);
  for (const w of [720, 1080]) await sharp(tall).resize(w).avif({ quality: 60, effort: 8 }).toFile(posters(`cellar-3d-${w}.avif`));
  await sharp(tall).resize(720).webp({ quality: 76 }).toFile(posters("cellar-3d-720.webp"));
  // Phones: the same render, closer in on the label.
  const close = () => sharp(tall).extract({ left: 0, top: 600, width: 1080, height: 648 }).resize(800).sharpen({ sigma: 0.5 });
  await close().avif({ quality: 62, effort: 8 }).toFile(posters("cellar-phone-800.avif"));
  await close().webp({ quality: 78 }).toFile(posters("cellar-phone-800.webp"));

  await browser.close();
  for (const f of fs.readdirSync(path.dirname(posters("x"))).filter((f) => /^(hero-(3d|phone)|cellar-)/.test(f))) console.log(f, Math.round(fs.statSync(posters(f)).size / 1024), "KB");
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
