import type { Domain } from '@/types/domain';

/**
 * Domains of expertise.
 *
 * Rendered as an animated grid on the landing page. Order here is the order on
 * screen — the index shown on each card is derived, never hardcoded.
 */
export const domains: Domain[] = [
  {
    id: 'domain-robotics',
    title: 'Robotics',
    description: 'Manipulators, mobile platforms and the control stacks that drive them.',
    icon: 'bot',
  },
  {
    id: 'domain-ai',
    title: 'Artificial Intelligence',
    description: 'Learning systems that perceive, predict and decide under real constraints.',
    icon: 'brain',
  },
  {
    id: 'domain-industrial-automation',
    title: 'Industrial Automation',
    description: 'Production cells, line control and factory-scale orchestration.',
    icon: 'factory',
  },
  {
    id: 'domain-computer-vision',
    title: 'Computer Vision',
    description: 'Detection, pose estimation and 3D reconstruction for guidance and inspection.',
    icon: 'eye',
  },
  {
    id: 'domain-digital-twin',
    title: 'Digital Twin',
    description: 'Live virtual replicas bound to physical telemetry.',
    icon: 'layers',
  },
  {
    id: 'domain-simulation',
    title: 'Simulation',
    description: 'Physics-accurate environments for training, testing and validation.',
    icon: 'orbit',
  },
  {
    id: 'domain-embedded',
    title: 'Embedded Systems',
    description: 'Real-time firmware, board bring-up and deterministic control loops.',
    icon: 'circuit',
  },
  {
    id: 'domain-vr',
    title: 'VR',
    description: 'Immersive teleoperation and operator training environments.',
    icon: 'glasses',
  },
  {
    id: 'domain-ar',
    title: 'AR',
    description: 'Spatial overlays for maintenance, assembly and field service.',
    icon: 'scan',
  },
  {
    id: 'domain-research',
    title: 'Research',
    description: 'Applied R&D, feasibility studies and instrumented prototypes.',
    icon: 'microscope',
  },
  {
    id: 'domain-automation',
    title: 'Automation',
    description: 'Process orchestration and autonomous workflows across systems.',
    icon: 'workflow',
  },
  {
    id: 'domain-ros2',
    title: 'ROS 2',
    description: 'Middleware architecture, DDS tuning and production-grade node design.',
    icon: 'network',
  },
  {
    id: 'domain-navigation',
    title: 'Navigation',
    description: 'Global planning, reactive avoidance and mission-level path logic.',
    icon: 'waypoints',
  },
  {
    id: 'domain-mapping',
    title: 'Mapping',
    description: 'SLAM, localisation and long-lived map lifecycle management.',
    icon: 'map',
  },
  {
    id: 'domain-machine-learning',
    title: 'Machine Learning',
    description: 'Dataset engineering, model training and edge deployment.',
    icon: 'binary',
  },
];
