"use client";

import { useEffect, useRef, useState } from "react";

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

// Reflections on the Sava: gentle flowing distortion below the waterline, shimmering
// highlights and a ripple that follows the pointer.
const FRAG = `
precision mediump float;
uniform sampler2D u_tex;
uniform vec2 u_res;
uniform float u_imgAspect;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_strength;
uniform float u_waterline;
varying vec2 v_uv;

vec2 cover(vec2 uv) {
  float ca = u_res.x / u_res.y;
  vec2 s = ca > u_imgAspect ? vec2(1.0, u_imgAspect / ca) : vec2(ca / u_imgAspect, 1.0);
  vec2 r = (uv - 0.5) * s + 0.5;
  return vec2(r.x, 1.0 - r.y);
}

void main() {
  vec2 uv = v_uv;
  vec2 base = cover(uv);
  float water = smoothstep(u_waterline - 0.01, u_waterline + 0.05, base.y);
  float depth = clamp((base.y - u_waterline) * 2.5, 0.0, 1.0);
  float t = u_time;

  vec2 d = vec2(
    sin(uv.y * 120.0 + t * 1.7) * 0.0024 + sin(uv.y * 31.0 - t * 0.9) * 0.0018,
    sin(uv.x * 26.0 + t * 1.1) * 0.0012
  ) * water * (0.4 + depth * 1.4);

  vec2 m = uv - u_mouse;
  m.x *= u_res.x / u_res.y;
  float dist = length(m);
  float ripple = sin(dist * 70.0 - t * 7.0) * exp(-dist * 7.0) * u_strength;
  d += (m / (dist + 0.0001)) * ripple * 0.01 * (0.35 + water);

  vec4 c = texture2D(u_tex, cover(uv + d));
  float shimmer = pow(max(0.0, sin(uv.x * 160.0 + t * 2.2 + sin(uv.y * 60.0 + t) * 3.0)), 24.0) * water * 0.1;
  gl_FragColor = vec4(c.rgb + shimmer * vec3(1.0, 0.72, 0.42), 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

/**
 * WebGL river over a photo. Starts in requestIdleCallback once near the viewport, runs at
 * 30fps on touch devices, pauses off-screen, and leaves the photo underneath as the fallback.
 */
export function RiverWater({ src, aspect, waterline }: { src: string; aspect: number; waterline: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let running = false;
    let started = false;
    let disposed = false;
    let idleId: number | undefined;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const mouse = { x: 0.5, y: 0.3, strength: 0 };
    let gl: WebGLRenderingContext | null = null;
    let uniforms: Record<string, WebGLUniformLocation | null> = {};
    let last = 0;
    const t0 = performance.now();

    const resize = () => {
      if (!gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uniforms.u_res, w, h);
    };

    const frame = (now: number) => {
      if (!running || !gl) return;
      raf = requestAnimationFrame(frame);
      if (coarse && now - last < 33) return;
      last = now;
      mouse.strength *= 0.965;
      gl.uniform1f(uniforms.u_time, (now - t0) / 1000);
      gl.uniform2f(uniforms.u_mouse, mouse.x, mouse.y);
      gl.uniform1f(uniforms.u_strength, mouse.strength);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const start = () => {
      if (started || disposed) return;
      started = true;
      gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
      if (!gl) return;
      const vs = compile(gl, gl.VERTEX_SHADER, VERT);
      const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
      if (!vs || !fs) return;
      const prog = gl.createProgram()!;
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, "a_pos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      uniforms = Object.fromEntries(
        ["u_tex", "u_res", "u_imgAspect", "u_time", "u_mouse", "u_strength", "u_waterline"].map((n) => [n, gl!.getUniformLocation(prog, n)]),
      );
      gl.uniform1f(uniforms.u_imgAspect, aspect);
      gl.uniform1f(uniforms.u_waterline, waterline);

      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (disposed || !gl) return;
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        resize();
        running = true;
        raf = requestAnimationFrame(frame);
        setReady(true);
      };
      img.src = src;
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!started) {
            const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
            idleId = ric(start) as number;
          } else if (gl && !running) {
            running = true;
            raf = requestAnimationFrame(frame);
          }
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
      mouse.strength = Math.min(1, mouse.strength + 0.12);
    };
    const parent = canvas.parentElement;
    parent?.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", resize);

    return () => {
      // Never call loseContext() here: it breaks StrictMode remounts.
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      if (idleId !== undefined) (window.cancelIdleCallback ?? window.clearTimeout)(idleId);
      io.disconnect();
      parent?.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, [src, aspect, waterline]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 h-full w-full transition-opacity duration-[1500ms] ${ready ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    />
  );
}
