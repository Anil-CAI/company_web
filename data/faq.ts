import type { FaqItem } from '@/types/service';

/** Questions answered on the services page. */
export const faqItems: FaqItem[] = [
  {
    id: 'faq-engagement',
    question: 'How does a typical engagement start?',
    answer:
      'With a discovery phase. We spend time on the constraints — cycle time, tolerances, safety envelope, existing infrastructure — and produce a requirements brief with measurable success criteria before any hardware is specified.',
  },
  {
    id: 'faq-timeline',
    question: 'How long does a project take?',
    answer:
      'A feasibility study or prototype usually runs weeks. A production system spans several months, driven mostly by hardware lead times and on-site commissioning. We work in increments, so you see a running system long before final delivery.',
  },
  {
    id: 'faq-existing',
    question: 'Can you work with our existing equipment?',
    answer:
      'Yes. Most of our work integrates with installed machinery, PLCs and MES platforms rather than replacing them. We support standard industrial protocols and will write adapters where a vendor interface is proprietary.',
  },
  {
    id: 'faq-simulation',
    question: 'Why simulate before building?',
    answer:
      'Because failure is cheap in a digital twin and expensive on a factory floor. Simulation lets us exercise thousands of edge cases, validate safety logic and refine control parameters before a single part is machined.',
  },
  {
    id: 'faq-ownership',
    question: 'Who owns the resulting IP?',
    answer:
      'You do. Deliverables include source code, hardware documentation and interface specifications. We build on open standards such as ROS 2 specifically to avoid handing over a black box.',
  },
  {
    id: 'faq-support',
    question: 'What happens after deployment?',
    answer:
      'We stay through commissioning until the system runs a full production shift unassisted, then move to a support arrangement — telemetry monitoring, scheduled maintenance and a documented upgrade path.',
  },
  {
    id: 'faq-research',
    question: 'Do you take on research work?',
    answer:
      'Regularly. We run applied R&D programmes, feasibility studies and instrumented prototypes, including collaborations with academic groups and grant-funded consortia.',
  },
];
