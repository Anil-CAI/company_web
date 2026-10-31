import type { ImageMedia, MediaRatio, VideoMedia } from '@/types/media';
import type { NavPlatform } from '@/types/navigation-stack';

/** A delivered engagement or internal platform. */
export interface Project {
  id: string;
  slug: string;
  title: string;
  /** One line shown on the card. */
  summary: string;
  /** Longer paragraph reserved for future detail pages. */
  description: string;
  /** Free-form label, e.g. "Industrial Automation". */
  category: string;
  /** Placeholder-friendly: leave empty to hide the year chip. */
  year: string;
  /** Chips rendered on the card. */
  technologies: string[];
  image: ImageMedia;
  video: VideoMedia;
  /**
   * Frame the clip is rendered in.
   *
   * Carried per project because the real footage is mixed: the G1 clips are
   * 16:9 screen captures, the Go2 web-navigation ones are 9:16 phone
   * recordings. A single hardcoded ratio letterboxes half of them.
   */
  videoRatio?: MediaRatio;
  /** Destination of the "Read more" action. */
  href: string;
  /** Shown in the landing page "Featured Projects" section. */
  featured: boolean;
  /**
   * Optional per-platform capability breakdown, rendered as an expandable
   * "see more" panel on the card.
   *
   * Only the navigation project carries this today. It is optional rather than
   * a separate project type because every other field already fits — a project
   * with a capability matrix is still a project, and forking the type would
   * mean forking the card that renders it.
   */
  platforms?: readonly NavPlatform[];
}
