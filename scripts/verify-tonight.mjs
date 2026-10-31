#!/usr/bin/env node
/**
 * Acceptance checks for the Go2/G1 services split, the new services, the
 * privacy policy and the header logo badge.
 *
 * Each subcommand asserts against the built artefacts or the source of truth in
 * `/data`, then prints a single success-only token. Any failed assertion throws
 * before the token is printed, so the token cannot appear on a partial pass.
 */

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();
const read = (p) => readFileSync(join(ROOT, p), 'utf8');

function assert(cond, msg) {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

/** Pull every `platform:` tag value out of the services data. */
function servicePlatforms() {
  const src = read('data/services.ts');
  const out = [];
  const re = /id: '(service-[a-z0-9-]+)',[\s\S]*?title: '([^']*)',[\s\S]*?platforms: \[([^\]]*)\]/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({
      id: m[1],
      title: m[2],
      platforms: [...m[3].matchAll(/'([^']+)'/g)].map((x) => x[1]),
    });
  }
  return out;
}

const commands = {
  /** G1 — the services data carries a platform split and the removals happened. */
  services() {
    const svc = servicePlatforms();
    assert(svc.length >= 10, `expected >=10 services with platforms, found ${svc.length}`);

    const titles = svc.map((s) => s.title);
    assert(
      !titles.includes('Robotics Engineering'),
      'Robotics Engineering must be removed — KRL does not do hardware',
    );

    const go2 = svc.filter((s) => s.platforms.includes('go2')).map((s) => s.title);
    const g1 = svc.filter((s) => s.platforms.includes('g1')).map((s) => s.title);

    for (const t of [
      'Industrial Automation',
      'Computer Vision',
      'Simulation',
      'Digital Twin',
      'VR / AR Robotics',
      'Autonomous Systems',
    ]) {
      assert(go2.includes(t), `Go2 is missing "${t}"`);
    }
    for (const t of [
      'AI Systems',
      'Industrial Automation',
      'Computer Vision',
      'Digital Twin',
      'Simulation',
      'VR / AR Robotics',
      'Autonomous Systems',
    ]) {
      assert(g1.includes(t), `G1 is missing "${t}"`);
    }
    assert(!go2.includes('AI Systems'), 'AI Systems was not assigned to Go2');

    console.log('services split verified');
  },

  /** G2 — the four new capabilities exist and are platform-tagged. */
  newservices() {
    const svc = servicePlatforms();
    const byTitle = Object.fromEntries(svc.map((s) => [s.title, s]));

    const wanted = {
      'Natural Language Control': 'go2',
      'Multilingual Interaction': 'g1',
      'Person Following': 'go2',
      'Custom Applications': 'other',
    };
    for (const [title, platform] of Object.entries(wanted)) {
      assert(byTitle[title], `new service "${title}" is missing`);
      assert(
        byTitle[title].platforms.includes(platform),
        `"${title}" should be tagged ${platform}, got ${byTitle[title].platforms.join(',')}`,
      );
    }
    console.log('new services verified');
  },

  /** G3 — the privacy page exists, is routed, and names the real contact address. */
  privacy() {
    assert(existsSync(join(ROOT, 'app/privacy/page.tsx')), 'app/privacy/page.tsx missing');
    const data = read('data/privacy.ts');
    assert(
      data.includes('kinematicroboticslabs@gmail.com'),
      'privacy copy must name the real contact address',
    );
    assert(/sections/.test(data), 'privacy data should expose sections');

    const nav = read('data/navigation.ts');
    assert(/privacy/i.test(nav), 'privacy must be linked from the footer navigation');
    console.log('privacy policy verified');
  },

  /** G4 — the header renders the logo badge from a real asset on disk. */
  logo() {
    assert(
      existsSync(join(ROOT, 'public/images/krl-mark-512.png')),
      'public/images/krl-mark-512.png missing',
    );
    const company = read('data/company.ts');
    assert(
      /krl-mark-512\.png/.test(company),
      'company.logo.src must point at the extracted mark',
    );
    const logo = read('components/common/logo.tsx');
    assert(/Image/.test(logo), 'logo component must render next/image when a src exists');
    console.log('logo badge verified');
  },
};

const cmd = process.argv[2];
if (!commands[cmd]) {
  console.error(`usage: verify-tonight.mjs <${Object.keys(commands).join('|')}>`);
  process.exit(2);
}
commands[cmd]();
