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
      title: 'Precision over spectacle',
      description:
        'A robot that works on the tenth thousandth cycle is worth more than one that impresses on the first.',
    },
    {
      id: 'principle-simulation',
      title: 'Simulate before you build',
      description:
        'Every system is proven in a digital twin — failure modes are cheap in simulation and expensive on the floor.',
    },
    {
      id: 'principle-open',
      title: 'Open standards',
      description:
        'ROS 2, open message contracts and documented interfaces. No black boxes handed over at the end of a project.',
    },
  ],
};
