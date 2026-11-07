// The stills phones show instead of the hero film: the sharpest frame of meat over the flames,
// cropped for a phone's first screen. Run from the project root (needs ffmpeg on PATH):
//   node scripts/gen-hero-still.mjs
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";

const frame = join(mkdtempSync(join(tmpdir(), "still-")), "frame.png");
execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "5.1", "-i", "public/video/hero.mp4", "-frames:v", "1", frame]);

const base = () => sharp(frame).extract({ left: 0, top: 0, width: 900, height: 720 }).modulate({ saturation: 1.06 }).sharpen({ sigma: 0.9 });

await base().avif({ quality: 66, effort: 8 }).toFile("public/images/posters/hero-phone-900.avif");
await base().resize(640).avif({ quality: 66, effort: 8 }).toFile("public/images/posters/hero-phone-640.avif");
await base().webp({ quality: 80 }).toFile("public/images/posters/hero-phone-900.webp");
