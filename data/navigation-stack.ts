import type { NavPlatform } from '@/types/navigation-stack';

/**
 * Navigation capabilities, per platform.
 *
 * Go2 carries the fuller stack today — multi-floor and person following are
 * running there — while G1 has indoor and outdoor. Person following is marked
 * `planned` on G1 rather than left out, because the roadmap is part of what
 * this section says: the capability exists, it is being brought across.
 */
export const navPlatforms: NavPlatform[] = [
  {
    id: 'nav-go2',
    slug: 'go2',
    name: 'Go2',
    form: 'Quadruped',
    summary:
      'The quadruped carries the full navigation stack — including the multi-floor and person-following work that has not yet crossed to the humanoid.',
    capabilities: [
      {
        id: 'go2-indoor',
        marker: 'A',
        name: 'Indoor navigation',
        description:
          'Metric SLAM in structured interiors, with a local planner that holds clearance through doorways and around furniture.',
        status: 'deployed',
      },
      {
        id: 'go2-outdoor',
        marker: 'B',
        name: 'Outdoor navigation',
        description:
          'GNSS-fused odometry over uneven ground, with terrain-aware footstep selection on slopes and loose surfaces.',
        status: 'deployed',
      },
      {
        id: 'go2-multifloor',
        marker: 'C',
        name: 'Multi-floor navigation',
        description:
          'Maps stitched per storey and linked by stairwells and lifts, so a goal on another floor is one continuous plan.',
        status: 'deployed',
      },
      {
        id: 'go2-following',
        marker: 'D',
        name: 'Person following',
        description:
          'Re-identifies and tracks a chosen operator through occlusion and crowding, holding a set standoff distance.',
        status: 'deployed',
      },
    ],
  },
  {
    id: 'nav-g1',
    slug: 'g1',
    name: 'G1',
    form: 'Humanoid',
    summary:
      'The humanoid runs indoor and outdoor navigation on the same planning core, with the balance controller in the loop at every step.',
    capabilities: [
      {
        id: 'g1-indoor',
        marker: 'A',
        name: 'Indoor navigation',
        description:
          'Bipedal path following in structured interiors, with footstep plans the balance controller can actually commit to.',
        status: 'deployed',
      },
      {
        id: 'g1-outdoor',
        marker: 'B',
        name: 'Outdoor navigation',
        description:
          'Open-ground traversal with terrain estimation feeding the step planner ahead of each footfall.',
        status: 'deployed',
      },
      {
        id: 'g1-following',
        marker: 'C',
        name: 'Person following',
        description:
          'Being ported from the Go2 stack — the tracker carries over, the standoff controller is being refitted to a walking base.',
        status: 'planned',
      },
    ],
  },
];
