#!/usr/bin/env node
/**
 * Runs the production build and asserts the expected routes prerendered.
 *
 * Measures the route list from the build's own output rather than trusting a
 * supplied count, so a dropped or renamed page fails here instead of shipping.
 */

import { execSync } from 'node:child_process';

let out;
try {
  out = execSync('npm run build', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
} catch (err) {
  console.error('FAIL: build exited non-zero');
  console.error((err.stdout ?? '') + (err.stderr ?? ''));
  process.exit(1);
}

/*
 * Route table lines look like "┌ ○ /    138 B" or "├ ○ /privacy   1.06 kB".
 * Parse the route token out of each line and compare exactly, rather than
 * regex-matching the path inside the line: a substring match would let
 * "/privacy" satisfy a check for "/", which is how this check first passed
 * dishonestly.
 */
const routes = new Set(
  out
    .split('\n')
    .map((line) => /^[┌├└│]\s*[○●ƒλ]\s+(\S+)/.exec(line))
    .filter(Boolean)
    .map((m) => m[1]),
);

const required = ['/', '/about', '/services', '/contact', '/privacy'];
const missing = required.filter((r) => !routes.has(r));

if (missing.length > 0) {
  console.error(`FAIL: routes missing from build output: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('build routes verified');
