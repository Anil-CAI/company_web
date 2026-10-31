import type { IconName } from '@/lib/icons';

/** A field of expertise shown in the domains grid. */
export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}
