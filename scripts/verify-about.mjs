#!/usr/bin/env node
/**
 * Acceptance checks for the About / Team page.
 *
 * `render` fetches the running dev server rather than reading source, so it
 * proves the page actually serves the names instead of proving a string exists
 * in a file that may never be imported.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');
const BASE = process.env.VERIFY_BASE_URL ?? 'http://localhost:3000';

/** Everyone who must appear, from the user's own brief. */
const PEOPLE = ['Yekkanti Sai', 'V. Vamsi', 'K. Satya', 'B. Anil Kumar'];

function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

const commands = {
  data() {
    if (!existsSync(join(ROOT, 'data/team.ts'))) fail('data/team.ts missing');
    const src = read('data/team.ts');
    for (const name of PEOPLE) {
      if (!src.includes(name)) fail(`team data is missing "${name}"`);
    }
    if (!/role: 'Founder'/.test(src)) fail('the founder must be marked as Founder');
    // The brief said the named members are a few of a larger team — the page
    // must say so rather than implying the list is complete.
    if (!/note:/.test(src)) fail('team data must carry the wider-team note');
    console.log('team data verified');
  },

  async render() {
    let res;
    try {
      res = await fetch(`${BASE}/about`);
    } catch {
      fail(`could not reach ${BASE}/about — is the dev server running?`);
    }
    if (!res.ok) fail(`/about returned HTTP ${res.status}`);
    const html = await res.text();

    for (const name of PEOPLE) {
      if (!html.includes(name)) fail(`/about does not render "${name}"`);
    }
    for (const id of ['id="story"', 'id="team"', 'id="principles"']) {
      if (!html.includes(id)) fail(`/about is missing section ${id}`);
    }
    if (!/Started in college/.test(html)) fail('/about does not render the founding story');
    console.log('about render verified');
  },

  links() {
    const nav = read('data/navigation.ts');
    if (!/id: 'nav-about'/.test(nav)) fail('About is not in the header navigation');
    if (!/id: 'footer-about'/.test(nav)) fail('About is not in the footer navigation');
    const sitemap = read('app/sitemap.ts');
    if (!/ROUTES\.about/.test(sitemap)) fail('About is not in the sitemap');
    console.log('about links verified');
  },
};

const cmd = process.argv[2];
if (!commands[cmd]) {
  console.error(`usage: verify-about.mjs <${Object.keys(commands).join('|')}>`);
  process.exit(2);
}
await commands[cmd]();
