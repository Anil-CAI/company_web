import type { IconName } from '@/lib/icons';
import type { ImageMedia } from '@/types/media';

/** Top-level grouping shown on the services page. */
export interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/**
 * Which platform a capability is offered on.
 *
 * `other` is not a lesser tier — it is work that is not tied to a robot at all
 * (custom web, Android and XR applications), so it needs its own group rather
 * than being forced under one of the two platforms.
 */
export type ServicePlatform = 'go2' | 'g1' | 'other';

/** A single capability offered by the company. */
export interface Service {
  id: string;
  /** Stable slug — used for anchors and future detail routes. */
  slug: string;
  /** Matches a `ServiceCategory.id`. */
  categoryId: string;
  title: string;
  /** One line, used on cards. */
  shortDescription: string;
  /** Full paragraph, used in the expandable detail rows. */
  description: string;
  icon: IconName;
  /** Bullet list of concrete deliverables. */
  highlights: string[];
  /** Chips rendered under the description. */
  technologies: string[];
  image: ImageMedia;
  /**
   * Platforms this capability is offered on.
   *
   * A service can appear under more than one — most of the stack runs on both
   * robots, and duplicating the entry per platform would mean two places to
   * edit the same copy.
   */
  platforms: readonly ServicePlatform[];
  /**
   * Overrides `shortDescription` for one platform where the offer genuinely
   * differs. Go2 VR is view-only (teleoperation and robot-perspective); G1 VR
   * adds training and maintenance, so one line cannot honestly cover both.
   */
  platformNotes?: Partial<Record<ServicePlatform, string>>;
  /** Surfaced in the landing page preview grid. */
  featured: boolean;
}

/** A named stack shown in the technology section of the services page. */
export interface TechnologyStack {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  items: string[];
}

/** One step of the engagement process. */
export interface ProcessStep {
  id: string;
  /** Zero-padded ordinal, e.g. "01". */
  step: string;
  title: string;
  description: string;
  deliverables: string[];
}

/** Frequently asked question. */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
