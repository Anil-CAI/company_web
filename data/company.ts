import { SITE_URL } from '@/constants/site';
import type { Company } from '@/types/company';

/**
 * Company identity.
 *
 * Edit this file to rebrand the entire site — the wordmark, footer, metadata
 * and structured data all read from here.
 */
export const company: Company = {
  name: 'KRL',
  legalName: 'KRL Labs',
  tagline: 'Robotic Solutions',
  description:
    'We design, build and deploy robotic systems — autonomous platforms, industrial automation, perception stacks and the simulation infrastructure behind them.',
  longDescription:
    'KRL Labs is an engineering studio for applied robotics. We work across the full stack — mechanical integration, embedded control, perception, autonomy, simulation and the operator interfaces that make a fleet usable in production. Every system we ship is validated in a digital twin before it ever touches a factory floor.',
  url: SITE_URL,

  /*
   * The square mark, cropped from the supplied mockup. It keeps its own dark
   * ground, so `logo.tsx` sets it in a rounded badge rather than trying to
   * float it on the page. The same file serves both surfaces — the mark is
   * already light-on-dark, so there is nothing to invert.
   */
  logo: {
    src: '/images/krl-mark-512.png',
    alt: 'KRL Labs logo',
    width: 512,
    height: 512,
  },
  logoInverted: {
    src: '/images/krl-mark-512.png',
    alt: 'KRL Labs logo',
    width: 512,
    height: 512,
  },

  /* Empty renders a placeholder in the footer. */
  founded: '2026',

  principles: [
    {
      id: 'principle-precision',
      title: 'Built to work every day, not just in a demo',
      description:
        'We judge a robot by whether it still does the job reliably after hundreds of runs, not by how it looks in one video. Nothing is called finished until it has run on the real Go2 or G1, in conditions like yours.',
    },
    {
      id: 'principle-simulation',
      title: 'Tested in simulation first',
      description:
        'Before a robot moves in your space, we rehearse what it will do in a computer simulation of that space. Mistakes found there cost nothing; found on your floor, they cost time, money and sometimes hardware.',
    },
    {
      id: 'principle-open',
      title: 'You own what we build',
      description:
        'We use open, widely used tools such as ROS 2 and hand over the code and the documentation with it. No locked black box — your team can understand, maintain and extend the system after the project ends.',
    },
  ],
};
