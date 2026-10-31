#!/usr/bin/env node
/**
 * Acceptance checks for the warm-palette migration and the motion work.
 *
 * Contrast is recomputed from the committed token values rather than trusted
 * from a design note, so a later tweak that quietly breaks legibility fails
 * here instead of shipping.
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const BASE = process.env.VERIFY_BASE_URL ?? 'http://localhost:3000';
const PAGES = ['/', '/about', '/services', '/contact', '/privacy'];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

/** Pull `--name: H S% L%;` declarations out of the `:root` block. */
function rootTokens() {
  const css = read('styles/globals.css');
  const block = /:root\s*\{([\s\S]*?)\n  \}/.exec(css);
  if (!block) fail('could not find the :root token block');
  const out = {};
  for (const m of block[1].matchAll(/--([a-z-]+):\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/g)) {
    out[m[1]] = { h: +m[2], s: +m[3], l: +m[4] };
  }
  return out;
}

function hslToRgb({ h, s, l }) {
  const S = s / 100;
  const L = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = S * Math.min(L, 1 - L);
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

function relLum(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const la = relLum(hslToRgb(a));
  const lb = relLum(hslToRgb(b));
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const commands = {
  /** The palette is warm, not greyscale, and every text pairing is legible. */
  tokens() {
    const t = rootTokens();
    for (const name of ['background', 'foreground', 'card', 'muted', 'muted-foreground', 'border']) {
      if (!t[name]) fail(`token --${name} is missing`);
    }

    // Greyscale would mean saturation ~0 on the surfaces. Warm means it is not.
    if (t.background.s < 10) fail(`--background is desaturated (s=${t.background.s}%) — not warm`);
    if (t.foreground.s < 8) fail(`--foreground is desaturated (s=${t.foreground.s}%) — not warm`);

    const pairs = [
      ['foreground', 'background', 4.5],
      ['muted-foreground', 'background', 4.5],
      ['foreground', 'card', 4.5],
      ['muted-foreground', 'card', 4.5],
      ['foreground', 'muted', 4.5],
    ];
    /* Reading ink and the emerald heading colour, on both surfaces. */
    if (t.snow && t.signal) {
      pairs.push(['snow', 'background', 4.5], ['signal', 'background', 3], ['signal', 'card', 3]);
    }
    if (t.accent && t['accent-foreground']) pairs.push(['accent-foreground', 'accent', 4.5]);
    for (const [fg, bg, min] of pairs) {
      const r = contrast(t[fg], t[bg]);
      if (r < min) fail(`--${fg} on --${bg} is ${r.toFixed(2)}:1, needs ${min}:1`);
    }
    console.log('palette tokens verified');
  },

  /** No page still hardcodes the old monochrome hexes. */
  async nogrey() {
    const banned = ['#111111', '#fff4e2', 'text-[#111111]'];
    const files = [
      'components/home/hero-light.tsx',
      'styles/globals.css',
    ];
    for (const f of files) {
      const src = read(f).toLowerCase();
      for (const b of banned) {
        if (src.includes(b.toLowerCase()) && !src.includes(`/* allow ${b.toLowerCase()}`)) {
          fail(`${f} still hardcodes ${b}`);
        }
      }
    }
    console.log('no stray monochrome verified');
  },

  /** Every page serves and carries the page-transition wrapper. */
  async pages() {
    for (const p of PAGES) {
      let res;
      try {
        res = await fetch(`${BASE}${p}`);
      } catch {
        fail(`could not reach ${BASE}${p} — is the dev server running?`);
      }
      if (!res.ok) fail(`${p} returned HTTP ${res.status}`);
      const html = await res.text();
      if (!html.includes('data-page-transition')) fail(`${p} is missing the page transition wrapper`);
    }
    console.log('pages and transitions verified');
  },

  /** Motion must still collapse under prefers-reduced-motion. */
  reducedmotion() {
    const css = read('styles/globals.css');
    if (!/@media \(prefers-reduced-motion: reduce\)/.test(css)) {
      fail('globals.css no longer guards reduced motion');
    }
    const transition = read('components/layout/page-transition.tsx');
    if (!/usePrefersReducedMotion|prefersReducedMotion/.test(transition)) {
      fail('page transition does not consult the reduced-motion preference');
    }
    console.log('reduced motion verified');
  },
};

const cmd = process.argv[2];
if (!commands[cmd]) {
  console.error(`usage: verify-palette.mjs <${Object.keys(commands).join('|')}>`);
  process.exit(2);
}
await commands[cmd]();
