'use client';

import Link from 'next/link';
import * as React from 'react';

import { HERO_RECEDE } from '@/constants/animation';
import { heroLight } from '@/data/hero';
import { gsap } from '@/lib/gsap';

/**
 * The KRL light wordmark.
 *
 * A photograph of the letters in brushed light fibres, re-drawn every frame by
 * a fragment shader: the cursor wakes a spectral trail along the fibres,
 * pressing adds a bright core, and dragging fast throws ripple rings and bends
 * the strands. Ported from the hero design (`KRL hero-html/`) with its shader
 * and motion constants unchanged.
 *
 * The `<img>` underneath is the real content. If WebGL is unavailable or the
 * shader fails to compile, the canvas stays transparent and the photo shows.
 *
 * Three changes from the standalone design, all because it now lives inside a
 * page: a fade under the site header so its links stay readable over the
 * letters, the loop pauses while the hero is off screen (it would otherwise run a
 * full-screen shader under every other section), and `touch-action: pan-y`
 * lets a phone scroll past it — `none` trapped the first screen.
 */

const VS = 'attribute vec2 p;varying vec2 v;void main(){v=p*0.5+0.5;gl_Position=vec4(p,0.0,1.0);}';
const FS = `
precision highp float;
varying vec2 v;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uTexAspect;
uniform float uFit;
uniform float uTime;
uniform float uMotion;
uniform float uGain;
uniform vec4 uPts[24];
uniform vec4 uHead;
uniform vec4 uRip[6];
uniform vec4 uWave;
const vec2 REF = vec2(3024.0, 1964.0);
float hash(float n){ return fract(sin(n * 127.1) * 43758.5453); }
vec3 spectrum(float x){ return 0.5 + 0.5 * cos(6.28318 * (x + vec3(0.0, 0.33, 0.67))); }
void main(){
  float ra = uRes.x / uRes.y;
  vec2 uv = v;
  bool wide = ra > uTexAspect;
  if (uFit > 0.5) {
    if (wide) uv.x = (v.x - 0.5) * ra / uTexAspect + 0.5;
    else uv.y = (v.y - 0.5) * uTexAspect / ra + 0.5;
  } else {
    if (wide) uv.y = (v.y - 0.5) * uTexAspect / ra + 0.5;
    else uv.x = (v.x - 0.5) * ra / uTexAspect + 0.5;
  }
  vec2 P = vec2(uv.x, 1.0 - uv.y) * REF;

  vec2 wd = (P - uWave.xy * REF) / vec2(280.0, 210.0);
  float wf = exp(-dot(wd, wd));
  P.x += uWave.z * wf * sin(P.y * 0.055 + uTime * 9.0) * 15.0;

  vec2 st = P / REF;
  vec3 c = texture2D(uTex, st).rgb * step(0.0, st.x) * step(st.x, 1.0) * step(0.0, st.y) * step(st.y, 1.0);
  float lum = dot(c, vec3(0.3333));
  float mask = smoothstep(0.006, 0.035, lum);

  float id = floor(P.x / 4.0);
  float h = hash(id);
  float h2 = hash(id + 17.3);
  float sweep = sin(P.y * 0.0024 - uTime * (0.35 + h * 0.35) + h * 31.0);
  c *= 1.0 + uMotion * (0.07 * sweep + 0.045 * sin(uTime * 0.7 + h2 * 50.0));

  vec3 rb = spectrum(h * 0.55 + P.x * 0.0009 + uTime * 0.08);
  rb = mix(rb, vec3(1.0), 0.1);

  float G = 0.0;
  for (int i = 0; i < 24; i++) {
    vec4 q = uPts[i];
    if (q.z <= 0.001) continue;
    vec2 d = (P - q.xy * REF) / vec2(46.0 * q.w, 125.0 * q.w);
    G += exp(-dot(d, d)) * q.z;
  }
  G = 1.0 - exp(-G * 1.4);

  vec2 dh = P - uHead.xy * REF;
  vec2 dhh = dh / vec2(72.0, 175.0);
  float halo = exp(-dot(dhh, dhh)) * uHead.z;
  vec2 dhc = dh / vec2(13.0, 36.0);
  float core = exp(-dot(dhc, dhc)) * uHead.w;
  G = max(G, halo);

  vec3 ripc = vec3(0.0);
  for (int i = 0; i < 6; i++) {
    vec4 r = uRip[i];
    if (r.w <= 0.001) continue;
    vec2 d = P - r.xy * REF;
    float rr = length(d * vec2(1.0, 0.45));
    float R = r.z * 640.0;
    float env = r.w * (1.0 - smoothstep(0.0, 1.3, r.z));
    float yy = d.y / 260.0;
    float vy = exp(-yy * yy);
    for (int k = 0; k < 3; k++) {
      float fk = float(k);
      float a = (rr - (R - fk * 58.0)) / (11.0 + fk * 3.0);
      float ring = exp(-a * a);
      ripc += ring * spectrum(fk * 0.27 + r.z * 0.4 + h * 0.12) * env * vy * (1.0 - fk * 0.25);
    }
  }

  G *= uGain;
  c = mix(c, rb * 1.3 * (0.55 + 0.6 * lum), clamp(G, 0.0, 1.0) * 0.8 * mask) + rb * G * 0.18 * mask;
  c += ripc * (0.25 + 0.75 * mask) * 1.1 * uGain;
  c += vec3(1.0, 0.98, 0.96) * core * (0.6 + 0.4 * mask) * uGain + rb * core * 0.3;
  gl_FragColor = vec4(c, 1.0);
}`;

/** Light intensity — the design's `intensity` prop at its default. */
const GAIN = 1;

interface Trail {
  x: number;
  y: number;
  t: number;
  s: number;
  life: number;
  r: number;
}
interface Ripple {
  x: number;
  y: number;
  t: number;
  s: number;
}

function startLight(cv: HTMLCanvasElement, src: string): () => void {
  const opts = { antialias: false, premultipliedAlpha: false, alpha: true };
  /* WebGL2 can mipmap a non-power-of-two photo, which stops the fibres
     shimmering when the wordmark is drawn smaller than its 2560px source. */
  const gl = (cv.getContext('webgl2', opts) ??
    cv.getContext('webgl', opts)) as WebGLRenderingContext | null;
  if (!gl) return () => {};
  const mipmaps =
    typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

  const sh = (type: number, code: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, code);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = sh(gl.VERTEX_SHADER, VS);
  const fs = sh(gl.FRAGMENT_SHADER, FS);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return () => {};
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return () => {};
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  );
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = Object.fromEntries(
    [
      'uTex',
      'uRes',
      'uTexAspect',
      'uFit',
      'uTime',
      'uMotion',
      'uGain',
      'uPts',
      'uHead',
      'uRip',
      'uWave',
    ].map((n) => [n, gl.getUniformLocation(prog, n)]),
  );

  let dead = false;
  const tex = gl.createTexture();
  let texReady = false;
  let texAspect = 3024 / 1964;
  const upload = (img: TexImageSource & { width: number; height: number }) => {
    if (dead) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    if (mipmaps) gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(
      gl.TEXTURE_2D,
      gl.TEXTURE_MIN_FILTER,
      mipmaps ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR,
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    texAspect = img.width / img.height;
    texReady = true;
  };
  const viaImage = () => {
    const im = new Image();
    im.onload = () => {
      try {
        upload(im);
      } catch (e) {
        console.warn(e);
      }
    };
    im.src = src;
  };
  fetch(src)
    .then((r) => r.blob())
    .then((b) => createImageBitmap(b))
    .then(upload)
    .catch(viaImage);

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const S = {
    target: [0.35, 0.5],
    pos: [0.35, 0.5],
    prev: [0.35, 0.5],
    inside: false,
    down: false,
    moved: false,
    halo: 0,
    core: 0,
    speed: 0,
    wave: 0,
    trail: [] as Trail[],
    rips: [] as Ripple[],
    lastRip: 0,
    lastPush: [0, 0],
  };

  const toTex = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect();
    const sx = (e.clientX - r.left) / r.width;
    const sy = (e.clientY - r.top) / r.height;
    const ra = r.width / r.height;
    let tx = sx;
    let ty = sy;
    /* Mirrors the shader: the photo is contained on every screen. */
    const wide = ra > texAspect;
    if (!wide) ty = ((sy - 0.5) * texAspect) / ra + 0.5;
    else tx = ((sx - 0.5) * ra) / texAspect + 0.5;
    return [tx, ty];
  };
  const now = () => performance.now() / 1000;
  const addRip = (s: number) => {
    S.rips.push({ x: S.pos[0], y: S.pos[1], t: now(), s });
    if (S.rips.length > 6) S.rips.shift();
    S.lastRip = now();
  };
  const onMove = (e: PointerEvent) => {
    S.target = toTex(e);
    if (!S.moved) {
      S.pos = S.target.slice();
      S.prev = S.target.slice();
    }
    S.moved = true;
    S.inside = true;
  };
  const onDown = (e: PointerEvent) => {
    onMove(e);
    S.pos = S.target.slice();
    S.down = true;
    try {
      cv.setPointerCapture(e.pointerId);
    } catch {
      /* capture is a nicety; the drag still works without it */
    }
    addRip(0.9);
  };
  const onUp = () => {
    S.down = false;
  };
  const onLeave = () => {
    if (!S.down) S.inside = false;
  };
  cv.addEventListener('pointermove', onMove);
  cv.addEventListener('pointerdown', onDown);
  cv.addEventListener('pointerup', onUp);
  cv.addEventListener('pointercancel', onUp);
  cv.addEventListener('pointerleave', onLeave);

  const pts = new Float32Array(96);
  const rip = new Float32Array(24);
  const t0 = now();
  let last = t0;
  let raf = 0;
  let visible = true;

  const frame = () => {
    if (dead || !visible) {
      raf = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
    const t = now();
    const dt = Math.min(0.05, Math.max(0.001, t - last));
    last = t;
    const el = t - t0;

    // one gentle sweep on load, until the visitor moves
    let intro = false;
    if (!S.moved && !reduce && el < 3.2) {
      intro = true;
      const k = Math.min(1, el / 3.0);
      const e2 = k * k * (3 - 2 * k);
      S.target = [0.08 + 0.8 * e2, 0.42 + 0.12 * Math.sin(e2 * 3.1)];
      if (el < 0.05) {
        S.pos = S.target.slice();
        S.prev = S.target.slice();
      }
    }

    const follow = 1 - Math.exp(-dt * (S.down ? 22 : 16));
    S.pos[0] += (S.target[0] - S.pos[0]) * follow;
    S.pos[1] += (S.target[1] - S.pos[1]) * follow;
    const dx = (S.pos[0] - S.prev[0]) * 3024;
    const dy = (S.pos[1] - S.prev[1]) * 1964;
    const inst = Math.sqrt(dx * dx + dy * dy) / dt;
    S.speed += (inst - S.speed) * (1 - Math.exp(-dt * 10));
    S.prev = S.pos.slice();

    const active = S.inside || intro;
    const haloT = active
      ? S.down
        ? 1.0
        : intro
          ? 0.5 * Math.sin(Math.PI * Math.min(1, el / 3.0))
          : 0.45
      : 0;
    const coreT = S.down ? 1.0 : 0;
    S.halo += (haloT - S.halo) * (1 - Math.exp(-dt * 8));
    S.core += (coreT - S.core) * (1 - Math.exp(-dt * (S.down ? 18 : 6)));

    // trail
    const mx = (S.pos[0] - S.lastPush[0]) * 3024;
    const my = (S.pos[1] - S.lastPush[1]) * 1964;
    if (active && mx * mx + my * my > 36) {
      S.trail.push({
        x: S.pos[0],
        y: S.pos[1],
        t,
        s: S.down ? 0.9 : 0.24,
        life: S.down ? 1.5 : 0.6,
        r: S.down ? 1.0 + Math.min(S.speed / 3200, 0.7) : 0.85,
      });
      S.lastPush = S.pos.slice();
      if (S.trail.length > 24) S.trail.shift();
    }
    if (S.down && S.speed > 1500 && t - S.lastRip > 0.17) addRip(Math.min(1, S.speed / 3200));

    const waveT = S.down ? Math.min(1, S.speed / 2600) : 0;
    S.wave += (waveT - S.wave) * (1 - Math.exp(-dt * (waveT > S.wave ? 10 : 2.2)));

    pts.fill(0);
    let j = 0;
    for (let i = S.trail.length - 1; i >= 0 && j < 24; i--) {
      const q = S.trail[i];
      const a = 1 - (t - q.t) / q.life;
      if (a <= 0) continue;
      pts[j * 4] = q.x;
      pts[j * 4 + 1] = q.y;
      pts[j * 4 + 2] = q.s * a * a;
      pts[j * 4 + 3] = q.r;
      j++;
    }
    S.trail = S.trail.filter((q) => t - q.t < q.life);
    rip.fill(0);
    S.rips = S.rips.filter((r) => t - r.t < 1.4);
    S.rips.forEach((r, i) => {
      rip[i * 4] = r.x;
      rip[i * 4 + 1] = r.y;
      rip[i * 4 + 2] = t - r.t;
      rip[i * 4 + 3] = r.s;
    });

    if (!texReady) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(cv.clientWidth * dpr));
    const hgt = Math.max(1, Math.round(cv.clientHeight * dpr));
    if (cv.width !== w || cv.height !== hgt) {
      cv.width = w;
      cv.height = hgt;
    }
    gl.viewport(0, 0, w, hgt);
    gl.uniform1i(U.uTex, 0);
    gl.uniform2f(U.uRes, w, hgt);
    gl.uniform1f(U.uTexAspect, texAspect);
    /* The whole wordmark on every screen: the photo's ground is black, so the
       bars are invisible. Portrait used to crop to a slice of the R, which on
       a phone left KRL unreadable. */
    gl.uniform1f(U.uFit, 1);
    gl.uniform1f(U.uTime, el);
    gl.uniform1f(U.uMotion, reduce ? 0.3 : 1.0);
    gl.uniform1f(U.uGain, GAIN);
    gl.uniform4fv(U.uPts, pts);
    gl.uniform4f(U.uHead, S.pos[0], S.pos[1], S.halo, S.core);
    gl.uniform4fv(U.uRip, rip);
    gl.uniform4f(U.uWave, S.pos[0], S.pos[1], S.wave, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };
  raf = requestAnimationFrame(frame);

  /* Off screen, stop drawing; back on screen, pick up where it left off. */
  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf && !dead) {
      last = now();
      raf = requestAnimationFrame(frame);
    }
  });
  io.observe(cv);

  return () => {
    dead = true;
    io.disconnect();
    if (raf) cancelAnimationFrame(raf);
    cv.removeEventListener('pointermove', onMove);
    cv.removeEventListener('pointerdown', onDown);
    cv.removeEventListener('pointerup', onUp);
    cv.removeEventListener('pointercancel', onUp);
    cv.removeEventListener('pointerleave', onLeave);
  };
}

export function HeroLight() {
  const frameRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;
    return startLight(canvasRef.current, heroLight.image);
  }, []);

  /*
   * The hero holds still while the next section slides up over it, and steps
   * back as it is covered. `pinSpacing: false` is what lets the next section
   * overlap instead of waiting below; its own z-index and background (the
   * `#hero + *` rule in globals.css) are what make it cover. Reduced motion
   * gets an ordinary scroll.
   */
  React.useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!frame || !stage) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: frame,
            start: 'top top',
            end: '+=100%',
            pin: true,
            pinSpacing: false,
            scrub: true,
          },
        })
        .to(stage, { scale: HERO_RECEDE.scale, opacity: HERO_RECEDE.opacity, ease: 'none' });
    }, frame);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={frameRef} className="relative h-svh min-h-[480px] w-full overflow-hidden bg-black">
      <div
        ref={stageRef}
        className="krl-hero-stage absolute inset-0 origin-center font-[family-name:var(--font-hero)] text-[#E9EEF6] will-change-transform"
      >
        {/*
          The wordmark: photo plus the shader canvas over it. Full-bleed on
          landscape; on portrait (`.krl-hero-mark` in globals.css) a block at
          the photo's own proportions, stacked above the copy.
        */}
        <div className="krl-hero-mark">
          {/* eslint-disable-next-line @next/next/no-img-element -- the shader samples this exact file; it must not be re-encoded or resized */}
          <img
            src={heroLight.image}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="absolute inset-0 block size-full object-contain"
          />
          <canvas
            ref={canvasRef}
            role="img"
            aria-label={heroLight.canvasLabel}
            className="absolute inset-0 block size-full cursor-default touch-pan-y"
          />
        </div>
        {/* The site header floats over the bright letters; this keeps its links readable. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[calc(var(--header-height)+3rem)] bg-gradient-to-b from-black/80 to-transparent"
        />

        <div className="krl-hero-copy flex flex-col gap-[1.1em]">
          <div className="krl-hero-spacer grow" />
          <h1 className="m-0 text-[2.35em] font-medium leading-[1.04] tracking-[-0.025em] text-[#F4F7FB]">
            {heroLight.title}
          </h1>
          <p className="m-0 max-w-[22em] text-[1em] leading-[1.5] text-[#9AA6B8]">
            {heroLight.description}
          </p>
          <div className="flex">
            <Link
              href={heroLight.cta.href}
              className="inline-flex min-h-11 items-center rounded-full border border-[#E9EEF6] px-[1.3em] text-[0.95em] font-medium text-[#E9EEF6] no-underline transition-colors duration-[250ms] ease-[ease] hover:bg-[#E9EEF6] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#E9EEF6]"
            >
              {heroLight.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
