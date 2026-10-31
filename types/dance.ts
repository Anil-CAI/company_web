import type { VideoMedia } from '@/types/media';

/** Shape of the robot dance models showcase. */

export interface DanceMove {
  id: string;
  /** Single-letter index shown in the card gutter, like the hero spec rows. */
  marker: string;
  name: string;
  /** One line on what the move demonstrates. */
  description: string;
  /**
   * Beats-per-minute the move is choreographed against. Drives the stage's
   * animation tempo, so it is a number rather than display copy.
   */
  bpm: number;
  /** Degrees of freedom the move exercises. Rendered as a chip. */
  dof: string;
}

/** The piece of music a routine is choreographed to. */
export interface DanceTrack {
  title: string;
  /** Film the track is from. */
  film: string;
}

export interface DanceModel {
  id: string;
  slug: string;
  /** Routine name — in practice the track it is danced to. */
  name: string;
  /** Platform the routine runs on, e.g. "G1 Humanoid". */
  platform: string;
  track: DanceTrack;
  /**
   * Footage of the routine.
   *
   * Optional: a routine with no clip falls back to the animated stick figure,
   * which is what the cards showed before any footage existed.
   */
  video?: VideoMedia;
  summary: string;
  /**
   * The full account of how the routine was made.
   *
   * One paragraph per entry. Shown when someone opens the routine on the 3D
   * shelf — the place where a visitor has actively asked for more than the
   * one-line summary.
   */
  story?: readonly string[];
  /** Chips rendered on the card. */
  capabilities: readonly string[];
  moves: readonly DanceMove[];
}
