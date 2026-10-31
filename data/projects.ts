import { navPlatforms } from '@/data/navigation-stack';
import type { Project } from '@/types/project';

/**
 * Projects.
 *
 * The featured four carry real footage from `/public/videos`; `videoRatio`
 * reflects how each clip was actually shot — the G1 captures are 16:9, the Go2
 * web-navigation clips are 9:16 phone recordings. Every clip has a poster frame
 * beside it so a card costs one small JPEG until someone presses play, which
 * matters most for the 25 MB 3D navigation capture.
 *
 * Image slots are still empty, so those render placeholders. `year` is blank by
 * the same convention — set it to show the year chip.
 */
export const projects: Project[] = [
  {
    id: 'project-01',
    slug: 'g1-custom-dance',
    title: 'G1 Custom Dance',
    summary:
      'Bespoke choreography on the G1 humanoid — whole-body routines authored to music and held on the beat.',
    description:
      'Custom dance routines authored for the G1. Each move is planned against the balance controller rather than keyframed blindly, so the robot holds its centre of mass through weight transfer, turns and held poses. The same pipeline retargets a routine to a new track by its tempo.',
    category: 'Humanoid Robotics',
    year: '',
    technologies: ['Whole-body Control', 'ZMP Balance', 'Motion Retargeting', 'G1'],
    image: {
      src: '/projects/g1-dance-ayaa-sher.jpg',
      alt: 'G1 humanoid mid-routine in the lab',
    },
    video: {
      src: '/videos/g1-dance-ayaa-sher.mp4',
      poster: '/videos/g1-dance-ayaa-sher-poster.jpg',
      label: 'G1 humanoid performing a custom dance routine to Ayaa Sher',
    },
    videoRatio: 'video',
    href: '#',
    featured: true,
  },
  {
    id: 'project-02',
    slug: 'g1-multilingual-interaction',
    title: 'Multilingual Interaction',
    summary:
      'A G1 that greets people in their own language — speech in, intent out, spoken back without leaving the robot.',
    description:
      'Conversational interaction on the G1. Incoming speech is transcribed and language-identified on the robot, routed to intent, and answered in the same language it arrived in. The exchange runs on-board so there is no network round trip between a question and its answer.',
    category: 'Human-Robot Interaction',
    year: '',
    technologies: ['Speech-to-Text', 'Language ID', 'On-device Inference', 'TTS', 'G1'],
    image: {
      src: '/projects/g1-multilingual-interaction.jpg',
      alt: 'G1 humanoid in conversation with a person in the lab',
    },
    video: {
      src: '/videos/g1-multilingual-interaction.mp4',
      poster: '/videos/g1-multilingual-interaction-poster.jpg',
      label: 'G1 humanoid interacting with people in their own language',
    },
    videoRatio: 'video',
    href: '#',
    featured: true,
  },
  {
    id: 'project-03',
    slug: 'g1-parcel-handling',
    title: 'Parcel Pick and Place',
    summary:
      'Whole-body pick and place on a walking humanoid, where the grasp and the balance problem have to be solved together.',
    description:
      'Parcel handling on the G1. Picking from the floor on a biped is not a manipulation problem with an arm bolted to it — reaching down moves the centre of mass, so the grasp plan and the balance controller are solved against each other rather than in sequence.',
    category: 'Humanoid Robotics',
    year: '',
    technologies: ['Whole-body Control', 'Grasp Planning', 'Balance', 'G1'],
    image: {
      src: '/projects/g1-parcel-pick-and-drop.jpg',
      alt: 'G1 humanoid approaching a parcel on a table',
    },
    video: {
      src: '/videos/g1-parcel-pick-and-drop.mp4',
      poster: '/videos/g1-parcel-pick-and-drop-poster.jpg',
      label: 'G1 humanoid picking up and placing a parcel',
    },
    videoRatio: 'video',
    href: '#',
    featured: true,
  },
  {
    id: 'project-04',
    slug: 'navigation',
    title: 'Navigation',
    summary:
      'One planning core across two very different bases — a quadruped running the full stack today, and a humanoid catching up on it.',
    description:
      'A navigation stack built once and ported across platforms. Metric SLAM and a predictive local planner handle structured interiors; GNSS-fused odometry and terrain-aware footstep selection take it outdoors. On the Go2 it extends to multi-floor planning across stairwells and lifts, and to operator following that survives occlusion and crowding.',
    category: 'Autonomous Systems',
    year: '',
    technologies: ['ROS 2', 'Nav2', 'LiDAR SLAM', 'GNSS Fusion', 'C++'],
    image: {
      src: '/projects/go2-web-outdoor-navigation.jpg',
      alt: 'Go2 quadruped navigating outdoors, driven from a web interface',
    },
    video: {
      src: '/videos/go2-web-outdoor-navigation.mp4',
      poster: '/videos/go2-web-outdoor-navigation-poster.jpg',
      label: 'Go2 navigating outdoors, driven from a web interface',
    },
    videoRatio: 'tall',
    href: '#',
    featured: true,
    /* The per-platform matrix powering the card's "see more" panel. */
    platforms: navPlatforms,
  },
  {
    id: 'project-05',
    slug: 'multi-floor-navigation',
    title: 'Multi-Floor Navigation',
    summary:
      'A Go2 planning across storeys — maps stitched per floor and linked by stairwells, driven from a 3D web interface.',
    description:
      'Multi-floor autonomy for the Go2. Each storey is mapped independently and the maps are linked at their transitions, so a goal on another floor resolves to one continuous plan rather than a series of manual hops. The operator drives and monitors it from a browser, with the live 3D reconstruction rendered in the page.',
    category: 'Autonomous Systems',
    year: '',
    technologies: ['ROS 2', 'Multi-floor SLAM', 'Three.js', 'WebRTC', 'Go2'],
    image: {
      src: '/projects/go2-3d-web-navigation.jpg',
      alt: 'Go2 multi-floor navigation shown in a 3D web interface',
    },
    video: {
      src: '/videos/go2-3d-web-navigation.mp4',
      poster: '/videos/go2-3d-web-navigation-poster.jpg',
      label: 'Go2 navigating across floors through a 3D web interface',
    },
    videoRatio: 'tall',
    href: '#',
    featured: true,
  },
  {
    id: 'project-06',
    slug: 'vision-guided-assembly-cell',
    title: 'Vision-Guided Assembly Cell',
    summary:
      'A robotic assembly cell that locates, orients and places unstructured parts at production cycle time.',
    description:
      'A six-axis assembly cell driven entirely by vision. Structured-light capture feeds a 6-DoF pose estimator, which hands grasp candidates to a collision-aware planner. The cell handles part variation without re-teaching and holds cycle time under production load.',
    category: 'Industrial Automation',
    year: '',
    technologies: ['Computer Vision', '6-DoF Pose', 'MoveIt 2', 'PLC', 'OPC UA'],
    image: { src: '', alt: 'Vision-guided assembly cell project' },
    video: { src: '', poster: '', label: 'Vision-guided assembly cell walkthrough' },
    href: '#',
    featured: false,
  },
  {
    id: 'project-07',
    slug: 'industrial-digital-twin',
    title: 'Industrial Digital Twin',
    summary:
      'A live virtual replica of a production line, bound to plant telemetry for rehearsal and incident replay.',
    description:
      'A physics-accurate twin of an entire production line, synchronised with live plant telemetry. Engineers rehearse layout changes, replay incidents frame by frame and validate control logic against the twin before any change reaches the floor.',
    category: 'Digital Twin',
    year: '',
    technologies: ['Omniverse', 'USD', 'Kafka', 'Time-series', 'Simulation'],
    image: { src: '', alt: 'Industrial digital twin project' },
    video: { src: '', poster: '', label: 'Industrial digital twin walkthrough' },
    href: '#',
    featured: false,
  },
  {
    id: 'project-08',
    slug: 'vr-teleoperation-suite',
    title: 'VR Teleoperation Suite',
    summary:
      'Immersive remote control for manipulators, with force feedback and sub-100 ms round-trip latency.',
    description:
      'A VR teleoperation system that puts an operator inside the robot’s workspace. Stereo video and reconstructed depth are streamed to the headset while haptic gloves relay contact forces, keeping precise manipulation possible from anywhere on the network.',
    category: 'VR / AR Robotics',
    year: '',
    technologies: ['Unity XR', 'OpenXR', 'WebRTC', 'Haptics', 'ROS 2'],
    image: { src: '', alt: 'VR teleoperation suite project' },
    video: { src: '', poster: '', label: 'VR teleoperation suite walkthrough' },
    href: '#',
    featured: false,
  },
  {
    id: 'project-09',
    slug: 'edge-perception-module',
    title: 'Edge Perception Module',
    summary:
      'A compact perception unit running fused multi-sensor inference entirely on-device.',
    description:
      'A self-contained perception module that fuses camera, depth and IMU streams on an embedded GPU. Models are quantised and scheduled to hold a fixed frame budget, so downstream control receives a deterministic, low-latency world model.',
    category: 'Embedded Systems',
    year: '',
    technologies: ['Jetson', 'TensorRT', 'Sensor Fusion', 'micro-ROS', 'C++'],
    image: { src: '', alt: 'Edge perception module project' },
    video: { src: '', poster: '', label: 'Edge perception module walkthrough' },
    href: '#',
    featured: false,
  },
  {
    id: 'project-10',
    slug: 'simulation-training-environment',
    title: 'Simulation Training Environment',
    summary:
      'A scenario-driven simulation platform used to train and regression-test autonomy stacks in CI.',
    description:
      'A large-scale simulation platform where autonomy candidates are exercised against thousands of procedurally generated scenarios. Domain randomisation keeps sim-to-real transfer honest, and every pull request is gated on the resulting scorecard.',
    category: 'Simulation',
    year: '',
    technologies: ['Isaac Sim', 'Gymnasium', 'Domain Randomisation', 'CI', 'Python'],
    image: { src: '', alt: 'Simulation training environment project' },
    video: { src: '', poster: '', label: 'Simulation training environment walkthrough' },
    href: '#',
    featured: false,
  },
];

/** Projects shown in the landing page "Featured Projects" section. */
export const featuredProjects: Project[] = projects.filter((project) => project.featured);
