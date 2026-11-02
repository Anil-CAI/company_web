import type { AboutContent, ContactContent, HomeContent, ServicesContent } from '@/types/content';

/**
 * Section copy.
 *
 * Every heading, eyebrow, paragraph and button label on the site lives here —
 * components render this file and never hold literal copy of their own. Edit
 * text once, in one place.
 */

export const homeContent: HomeContent = {
  projects: {
    eyebrow: 'Selected work',
    title: 'Featured Projects',
    description:
      'Systems built end to end — from perception and autonomy through to the production floor.',
    ctaLabel: 'Explore capabilities',
  },
  dance: {
    eyebrow: 'Motion lab',
    title: 'Robot dance models',
    description:
      'Two routines choreographed on the G1 humanoid, set to music from the Telugu film Paradise. Choreography is a stress test with better optics: balance, timing and whole-body coordination, judged on the beat.',
  },
  services: {
    eyebrow: 'Capabilities',
    title: 'What we build',
    description:
      'Robotics, intelligence and the virtual engineering layer that validates both before they reach production.',
    ctaLabel: 'All services',
  },
  domains: {
    eyebrow: 'Expertise',
    title: 'Domains we work across',
    description:
      'Fifteen intersecting disciplines. Most systems we ship draw on several of them at once.',
    /* The large word the Domains wall assembles around. */
    wallWord: 'Disciplines',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Let’s build something that works on the ten-thousandth cycle.',
    body: 'Tell us about the system you have in mind — the constraints, the environment and what it has to do. We will tell you what it takes to build it.',
    ctaLabel: 'Start a conversation',
  },
};

export const servicesContent: ServicesContent = {
  hero: {
    eyebrow: 'Services',
    title: 'Engineering across the full robotics stack.',
    description:
      'From the first feasibility question to a system running unattended on a production floor — mechanics, embedded control, perception, autonomy and the simulation infrastructure that proves all of it before deployment.',
  },
  /* Showreel slot for the services hero. Set `src` to activate playback. */
  showreel: { src: '', poster: '', label: 'Services showreel' },
  categories: {
    eyebrow: 'Capabilities',
    title: 'What runs on which robot',
    description:
      'Most of the stack runs on both platforms. Where a capability only exists on one — or works differently there — it is listed under that robot and nowhere else.',
  },
  details: {
    eyebrow: 'In detail',
    title: 'Every capability, unpacked',
    description:
      'Expand any service to see what it covers, what you receive and the stack behind it.',
  },
  technologies: {
    eyebrow: 'Stack',
    title: 'Technology we build on',
    description:
      'Open standards wherever they exist, so nothing we hand over is a black box.',
  },
  process: {
    eyebrow: 'Process',
    title: 'How an engagement runs',
    description:
      'Six phases, each with a defined deliverable. You always know what exists and what comes next.',
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Questions we get asked',
  },
  cta: {
    eyebrow: 'Next step',
    title: 'Have a system in mind?',
    body: 'Send us the constraints — throughput, tolerances, environment, timeline. We will come back with an honest read on feasibility and what it takes to build.',
    ctaLabel: 'Start a project',
    secondaryLabel: 'See featured work',
  },
};

export const aboutContent: AboutContent = {
  hero: {
    eyebrow: 'About',
    title: 'A robotics team, not a robot shop.',
    description:
      'We build the autonomy, perception and interfaces that turn a capable machine into a system that does a specific job — on the platforms our clients already run.',
  },
  principles: {
    eyebrow: 'How we work',
    title: 'What we hold to',
    description:
      'Three commitments that decide how a project is run, not just how it is described.',
  },
};

export const contactContent: ContactContent = {
  hero: {
    eyebrow: 'Contact',
    title: 'Start a conversation.',
    description:
      'Tell us what you are trying to build and the constraints around it. We read every message and reply with a real technical answer, not a brochure.',
  },
  channels: {
    eyebrow: 'Direct',
    title: 'Reach us',
    description: 'Whichever channel suits you — all of them reach the engineering team.',
  },
  form: {
    eyebrow: 'Enquiry',
    title: 'Send a message',
    description: 'The more you can say about the environment and constraints, the better.',
    submitLabel: 'Send message',
    submittingLabel: 'Sending…',
    successTitle: 'Message sent',
    successBody:
      'Thanks — your message is with us and we will reply to the address you gave, usually within a couple of working days.',
    errorBody:
      'That did not send. Please email kinematicroboticslabs@gmail.com directly and we will pick it up from there.',
    disclaimer:
      'We use what you send only to reply to your enquiry. Nothing is shared with anyone else.',
    mailSubject: 'Enquiry from the KRL Labs website',
    handoffTitle: 'Your email app is open',
    handoffBody:
      'Your message is written and addressed to us — press Send in your email app to deliver it. If nothing opened, email kinematicroboticslabs@gmail.com directly.',
    backLabel: 'Back to the form',
    anotherLabel: 'Write another message',
  },
  map: {
    eyebrow: 'Location',
    title: 'Find us',
    description: 'Set a Google Maps embed URL in the data file to replace the placeholder.',
  },
};
