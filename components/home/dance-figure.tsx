import * as React from 'react';

import { cn } from '@/lib/utils';

/** Which figure to draw. Matches the platform of each dance model. */
export type DanceFigureKind = 'biped' | 'quadruped' | 'arm';

interface DanceFigureProps {
  kind: DanceFigureKind;
  /**
   * Beats per minute the figure moves at. Converted to a CSS variable so the
   * keyframes in `globals.css` can run at the tempo the data asks for — the
   * whole point of carrying `bpm` as a number in `data/dance.ts`.
   */
  bpm: number;
  /**
   * What the figure is doing, for the accessible label. The navigation cards
   * reuse this drawing at a slow, even tempo to read as walking rather than
   * dancing, and a screen reader should hear the difference.
   */
  action?: string;
  className?: string;
}

/**
 * A dancing figure, drawn in the same ink-on-paper language as the hero.
 *
 * Stick-figure geometry on purpose: a rigged 3D model is the obvious reading of
 * "dance model", but it costs a WebGL runtime and a loader for something that
 * sits a third of the way down a marketing page. A jointed line figure carries
 * the same information — which links move, against which beat — at zero bytes
 * of dependency.
 *
 * Every part is a `<g>` whose transform-origin is its own joint, so the CSS
 * rotates limbs around anatomically correct pivots instead of sliding them.
 */
export function DanceFigure({ kind, bpm, action = 'dancing', className }: DanceFigureProps) {
  /*
   * One beat in seconds. The keyframes are authored as a two-beat phrase, so
   * the duration handed to CSS is doubled here rather than in every rule.
   */
  const beat = 60 / bpm;

  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`${kind} robot figure, ${action}`}
      className={cn('dance-figure block h-full w-full text-foreground', className)}
      style={{ '--beat': `${(beat * 2).toFixed(3)}s` } as React.CSSProperties}
    >
      {/* Floor line — gives the figure something to be grounded against. */}
      <line
        x1="28"
        y1="176"
        x2="172"
        y2="176"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.18"
      />

      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {kind === 'biped' ? <Biped /> : null}
        {kind === 'quadruped' ? <Quadruped /> : null}
        {kind === 'arm' ? <Arm /> : null}
      </g>
    </svg>
  );
}

/** Walking platform: head, torso, two arms, two legs, all pivoting. */
function Biped() {
  return (
    <g className="dance-biped">
      {/* Head — a screen-faced block, echoing the hero machine. */}
      <g className="dance-head" style={{ transformOrigin: '100px 62px' }}>
        <rect x="86" y="40" width="28" height="24" rx="7" />
        <circle cx="94" cy="52" r="2.4" fill="currentColor" stroke="none" />
        <circle cx="106" cy="52" r="2.4" fill="currentColor" stroke="none" />
      </g>

      {/* Spine. */}
      <line x1="100" y1="64" x2="100" y2="116" />

      {/* Arms pivot at the shoulder, mirrored and half a phrase apart. */}
      <g className="dance-arm-l" style={{ transformOrigin: '100px 76px' }}>
        <polyline points="100,76 76,92 70,114" />
      </g>
      <g className="dance-arm-r" style={{ transformOrigin: '100px 76px' }}>
        <polyline points="100,76 124,92 130,114" />
      </g>

      {/* Legs pivot at the hip. */}
      <g className="dance-leg-l" style={{ transformOrigin: '100px 116px' }}>
        <polyline points="100,116 88,144 84,174" />
      </g>
      <g className="dance-leg-r" style={{ transformOrigin: '100px 116px' }}>
        <polyline points="100,116 112,144 116,174" />
      </g>
    </g>
  );
}

/** Four-legged platform: a body block over four jointed legs. */
function Quadruped() {
  return (
    <g className="dance-quad">
      {/* Body, with the head cantilevered off the front. */}
      <g className="dance-body" style={{ transformOrigin: '100px 118px' }}>
        <rect x="64" y="104" width="72" height="30" rx="10" />
        <polyline points="136,112 154,100 154,88" />
        <circle cx="154" cy="84" r="4" fill="currentColor" stroke="none" />
      </g>

      {/* Front pair and rear pair move as diagonals, a half phrase apart. */}
      <g className="dance-leg-fl" style={{ transformOrigin: '76px 134px' }}>
        <polyline points="76,134 68,154 72,174" />
      </g>
      <g className="dance-leg-fr" style={{ transformOrigin: '92px 134px' }}>
        <polyline points="92,134 96,154 92,174" />
      </g>
      <g className="dance-leg-rl" style={{ transformOrigin: '110px 134px' }}>
        <polyline points="110,134 106,154 110,174" />
      </g>
      <g className="dance-leg-rr" style={{ transformOrigin: '126px 134px' }}>
        <polyline points="126,134 134,154 130,174" />
      </g>
    </g>
  );
}

/**
 * Fixed-base manipulator: nested groups so each joint rotates in its parent's
 * frame, which is what makes the end effector trace a compound path instead of
 * a circle.
 */
function Arm() {
  return (
    <g className="dance-arm-rig">
      {/* Base — the only part that never moves. */}
      <path d="M 78 174 L 122 174 L 114 158 L 86 158 Z" />

      <g className="dance-j1" style={{ transformOrigin: '100px 158px' }}>
        <line x1="100" y1="158" x2="100" y2="112" />

        <g className="dance-j2" style={{ transformOrigin: '100px 112px' }}>
          <line x1="100" y1="112" x2="136" y2="84" />

          <g className="dance-j3" style={{ transformOrigin: '136px 84px' }}>
            <line x1="136" y1="84" x2="150" y2="56" />
            {/* End effector — two fingers, so the tool orientation reads. */}
            <polyline points="144,50 150,56 156,50" />
          </g>
        </g>
      </g>
    </g>
  );
}
