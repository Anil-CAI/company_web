import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { emptyOverrides, sanitizeOverrides } from '@/lib/site-overrides';
import type { SiteOverrides } from '@/types/site-overrides';

/**
 * Server-side access to the editor's saved overrides.
 *
 * Read with `fs` rather than `import`ed: an import would put the file in the
 * module graph, so every save from the editor would trigger a hot reload and
 * throw away the editor's undo history mid-session.
 */

export const OVERRIDES_FILE = join(process.cwd(), 'data', 'site-overrides.json');
export const OVERRIDES_BACKUP_FILE = join(process.cwd(), 'data', 'site-overrides.backup.json');

export function readOverrides(): SiteOverrides {
  try {
    return sanitizeOverrides(JSON.parse(readFileSync(OVERRIDES_FILE, 'utf8')));
  } catch {
    return emptyOverrides();
  }
}
