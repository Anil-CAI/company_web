import type { ProcessStep } from '@/types/service';

/** How an engagement runs, start to finish. Rendered as a timeline. */
export const processSteps: ProcessStep[] = [
  {
    id: 'process-discovery',
    step: '01',
    title: 'Discovery',
    description:
      'We map the problem before proposing hardware. Constraints, cycle times, failure modes, safety envelope and what success has to look like in numbers.',
    deliverables: ['Requirements brief', 'Constraint analysis', 'Success metrics'],
  },
  {
    id: 'process-architecture',
    step: '02',
    title: 'Architecture',
    description:
      'System design across mechanics, electronics and software — interface contracts, data flow and the integration risks that decide the schedule.',
    deliverables: ['System architecture', 'Interface specification', 'Risk register'],
  },
  {
    id: 'process-simulation',
    step: '03',
    title: 'Simulation',
    description:
      'The design is validated in a digital twin before anything is fabricated. Failure modes get exercised where they cost nothing.',
    deliverables: ['Digital twin', 'Scenario suite', 'Validation report'],
  },
  {
    id: 'process-build',
    step: '04',
    title: 'Build',
    description:
      'Iterative implementation with hardware in the loop. Every increment runs against the same scenario suite, so regressions surface the day they appear.',
    deliverables: ['Working increments', 'HIL test results', 'Source and docs'],
  },
  {
    id: 'process-deployment',
    step: '05',
    title: 'Deployment',
    description:
      'On-site commissioning, safety sign-off and operator training. We stay until the system runs a full production shift without us.',
    deliverables: ['Commissioned system', 'Safety documentation', 'Operator training'],
  },
  {
    id: 'process-support',
    step: '06',
    title: 'Support',
    description:
      'Telemetry-backed monitoring, scheduled maintenance windows and a documented upgrade path as requirements evolve.',
    deliverables: ['Monitoring dashboards', 'Maintenance plan', 'Upgrade roadmap'],
  },
];
