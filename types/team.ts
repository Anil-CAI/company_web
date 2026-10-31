import type { ImageMedia } from '@/types/media';

/** A named person on the team. */
export interface TeamMember {
  id: string;
  name: string;
  /**
   * What they work on.
   *
   * Deliberately a domain rather than a job title: the company was founded by
   * students and the titles are not settled, so claiming one would be invented
   * detail. Fill these in as they firm up.
   */
  focus: string;
  /** Optional one-line note. Empty renders nothing rather than a filler line. */
  note?: string;
  /** Headshot slot. Empty renders the initials monogram instead. */
  image?: ImageMedia;
}

/** The founding story and the people behind it. */
export interface TeamContent {
  /** Section copy for the story block. */
  story: {
    eyebrow: string;
    title: string;
    /** One paragraph per entry. */
    body: readonly string[];
  };
  founder: TeamMember & {
    /** Shown under the founder's name on the story block. */
    role: string;
  };
  /** Section copy for the people grid. */
  people: {
    eyebrow: string;
    title: string;
    description: string;
  };
  members: readonly TeamMember[];
  /**
   * Closing line about the wider team.
   *
   * The named members are a few of a larger group, so the page says that
   * instead of implying the list is exhaustive.
   */
  note: string;
}
