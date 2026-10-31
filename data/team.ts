import type { TeamContent } from '@/types/team';

/**
 * About page content.
 *
 * Everything here is what the company actually told us. Where a detail is not
 * settled — job titles, individual backgrounds, headshots — the field is left
 * deliberately thin rather than filled with plausible invention, because a
 * team page that overstates itself is the fastest way to lose a reader's
 * trust. Fill `focus`, `note` and `image` in as they firm up.
 */
export const teamContent: TeamContent = {
  story: {
    eyebrow: 'About',
    title: 'Started in college, built on real deployments',
    body: [
      'KRL Labs began while its founder was still at university, working with fellow students on robots that had to do something real rather than demo well. That starting point still shapes how the company works: build it, run it on the actual machine, and let the failures tell you what the specification missed.',
      'What began as a student project is now a team spread across different domains — navigation and perception, humanoid control, simulation, and the web and application work that makes a robot usable by someone who did not build it. Several members bring prior industry experience alongside the research work.',
      'We do not manufacture hardware. We work on the platforms our clients already run — Unitree Go2 and G1 today — and build the autonomy, perception and interfaces that turn a capable machine into a system that does a specific job.',
    ],
  },

  founder: {
    id: 'founder',
    name: 'V. Vamsi',
    role: 'Founder',
    focus: 'Robotics engineering',
    note: 'Established KRL Labs in college, alongside fellow students.',
  },

  people: {
    eyebrow: 'Team',
    title: 'The people behind the work',
    description:
      'A team working across navigation, perception, humanoid control, simulation and application engineering.',
  },

  members: [
    {
      id: 'member-anil',
      name: 'B. Anil Kumar',
      focus: 'Robotics engineering',
    },
  ],

  note: 'Along with a wider team working across robotics, software and research.',
};
