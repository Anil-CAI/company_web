import { copyFileSync, existsSync, writeFileSync } from 'node:fs';

import { NextResponse, type NextRequest } from 'next/server';

import { sanitizeOverrides } from '@/lib/site-overrides';
import { OVERRIDES_BACKUP_FILE, OVERRIDES_FILE, readOverrides } from '@/lib/site-overrides-server';

/**
 * The visual editor's save endpoint — local development tooling, not a
 * backend for visitors.
 *
 * Three gates, all of which must pass:
 * - `SITE_EDITOR=1` in the server's environment (`npm run edit` sets it). A
 *   normal `npm run start` or a real deployment answers 404, as if the route
 *   did not exist.
 * - The request is addressed to localhost.
 * - A write carries a local `Origin` (or none), so another site open in the
 *   same browser cannot post edits to it.
 */

export const dynamic = 'force-dynamic';

const LOCAL_HOST_RE = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
const MAX_BYTES = 512 * 1024;

/* The file as it stood before this server's first save — a session undo. */
let backedUp = false;

function allowed(request: NextRequest): boolean {
  if (process.env.SITE_EDITOR !== '1') return false;
  if (!LOCAL_HOST_RE.test(request.headers.get('host') ?? '')) return false;

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (!LOCAL_HOST_RE.test(new URL(origin).host)) return false;
    } catch {
      return false;
    }
  }
  return true;
}

const notFound = () => new NextResponse(null, { status: 404 });

export function GET(request: NextRequest) {
  if (!allowed(request)) return notFound();
  return NextResponse.json({ enabled: true, overrides: readOverrides() });
}

export async function PUT(request: NextRequest) {
  if (!allowed(request)) return notFound();

  const raw = await request.text();
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: 'Edits are too large to save.' }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Not valid JSON.' }, { status: 400 });
  }

  const clean = sanitizeOverrides(body);

  if (!backedUp && existsSync(OVERRIDES_FILE)) {
    copyFileSync(OVERRIDES_FILE, OVERRIDES_BACKUP_FILE);
    backedUp = true;
  }
  writeFileSync(OVERRIDES_FILE, `${JSON.stringify(clean, null, 2)}\n`);

  return NextResponse.json({ ok: true });
}
