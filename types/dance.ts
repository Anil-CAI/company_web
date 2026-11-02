/**
 * A robot dance routine, as shown in the "Robot dance models" section.
 *
 * One object holds everything about a routine: the book on the shelf, and the
 * reader it opens into (video, story, moves, tags). Nothing is shown anywhere
 * else, so there is one place to edit a routine.
 */

/** One choreographed move, listed A–C under the reader's "Moves" tab. */
export interface DanceMove {
  /** Single-letter index, e.g. "A". */
  letter: string;
  name: string;
  /** Beats per minute the move is choreographed against. */
  bpm: number;
  /** Joints the move works, e.g. "Hip · Knee". */
  bodyParts: string;
  /** One line on what the move demonstrates. */
  text: string;
}

/** The track a routine is danced to. */
export interface DanceSong {
  title: string;
  /** Film the track is from. */
  film: string;
}

export interface DanceRoutine {
  id: string;
  /** Routine name — in practice the track it is danced to. */
  title: string;
  song: DanceSong;
  /** Robot it runs on, e.g. "G1 Humanoid". */
  platform: string;
  /** Two-line summary under the title. */
  summary: string;
  /** The full account, one paragraph per entry — the reader's "Story" tab. */
  story: readonly string[];
  /** Footage of the routine, and the frame shown before it plays. */
  videoSrc: string;
  poster: string;
  /** Read out by screen readers for the video. */
  videoLabel: string;
  moves: readonly DanceMove[];
  /** Technique chips under the moves. */
  tags: readonly string[];
}
