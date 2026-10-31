import type { ImageMedia } from '@/types/media';
import type { Service, ServiceCategory, ServicePlatform } from '@/types/service';

/**
 * Services.
 *
 * `featured: true` promotes a service into the landing page preview grid.
 * Media slots are empty on purpose — drop files into `/public/services` and set
 * `image.src` to swap the placeholder for the real asset.
 */

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'category-systems',
    title: 'Robotic Systems',
    description:
      'Physical platforms, from mechanical integration and embedded control through to autonomous field deployment.',
    icon: 'bot',
  },
  {
    id: 'category-intelligence',
    title: 'Intelligence',
    description:
      'Perception, learning and decision-making — the software that lets a machine understand and act on its surroundings.',
    icon: 'brain',
  },
  {
    id: 'category-virtual',
    title: 'Virtual Engineering',
    description:
      'Simulation, digital twins and immersive interfaces used to design, validate and operate systems before they exist.',
    icon: 'boxes',
  },
];

export const services: Service[] = [
  {
    id: 'service-ai',
    slug: 'ai-systems',
    categoryId: 'category-intelligence',
    title: 'AI Systems',
    shortDescription: 'Learning-based perception, planning and control for real machines.',
    description:
      'Applied machine learning built for embedded constraints rather than benchmark leaderboards. We handle dataset engineering, model architecture, quantisation and on-device deployment, with evaluation harnesses that track real-world performance after the model ships.',
    icon: 'brain',
    highlights: [
      'Dataset pipelines and annotation strategy',
      'Model training, distillation and quantisation',
      'Edge inference on Jetson and ARM targets',
      'Continuous evaluation and drift monitoring',
    ],
    technologies: ['PyTorch', 'ONNX', 'TensorRT', 'CUDA', 'MLflow'],
    image: { src: '', alt: 'AI systems service' },
    platforms: ['g1'],
    featured: true,
  },
  {
    id: 'service-automation',
    slug: 'industrial-automation',
    categoryId: 'category-systems',
    title: 'Industrial Automation',
    shortDescription: 'Production cells, line integration and factory-floor control.',
    description:
      'We design and commission automated cells that hold up under production load — PLC and motion control, safety architecture, fleet coordination and the MES integration that makes throughput visible. Delivered with commissioning support and operator training.',
    icon: 'factory',
    highlights: [
      'Automated cell design and commissioning',
      'PLC, motion and safety architecture',
      'AGV / AMR fleet coordination',
      'MES and ERP integration',
    ],
    technologies: ['PLC / IEC 61131-3', 'OPC UA', 'Modbus', 'SCADA', 'MQTT'],
    image: { src: '', alt: 'Industrial automation service' },
    platforms: ['go2', 'g1'],
    featured: true,
  },
  {
    id: 'service-vision',
    slug: 'computer-vision',
    categoryId: 'category-intelligence',
    title: 'Computer Vision',
    shortDescription: 'Perception stacks for inspection, guidance and 3D understanding.',
    description:
      'Vision systems that survive the lighting, vibration and cycle-time constraints of real environments: calibration, detection, pose estimation, depth reconstruction and the tooling to keep accuracy measurable over the life of the deployment.',
    icon: 'eye',
    highlights: [
      'Multi-camera calibration and hand-eye alignment',
      '6-DoF pose estimation and bin picking',
      'Defect detection and metrology',
      'Structured light and stereo depth',
    ],
    technologies: ['OpenCV', 'Open3D', 'PCL', 'YOLO', 'RealSense'],
    image: { src: '', alt: 'Computer vision service' },
    platforms: ['go2', 'g1'],
    featured: true,
  },
  {
    id: 'service-digital-twin',
    slug: 'digital-twin',
    categoryId: 'category-virtual',
    title: 'Digital Twin',
    shortDescription: 'Synchronised virtual replicas of physical systems and lines.',
    description:
      'A digital twin that stays honest: live telemetry bound to a physics-accurate model, so you can inspect state, replay incidents and rehearse changes before touching production hardware. Includes the data pipeline and the operator-facing view.',
    icon: 'layers',
    highlights: [
      'Physics-accurate asset modelling',
      'Live telemetry binding and state sync',
      'What-if simulation and change rehearsal',
      'Predictive maintenance signals',
    ],
    technologies: ['NVIDIA Omniverse', 'USD', 'Unity', 'Kafka', 'TimescaleDB'],
    image: { src: '', alt: 'Digital twin service' },
    platforms: ['go2', 'g1'],
    featured: true,
  },
  {
    id: 'service-simulation',
    slug: 'simulation',
    categoryId: 'category-virtual',
    title: 'Simulation',
    shortDescription: 'High-fidelity environments for training, testing and validation.',
    description:
      'Simulation infrastructure that replaces months of field testing: sensor-accurate scenes, domain randomisation for sim-to-real transfer, and automated scenario suites wired into CI so every commit is validated against thousands of virtual runs.',
    icon: 'orbit',
    highlights: [
      'Sensor-accurate scene construction',
      'Domain randomisation for sim-to-real',
      'Automated regression scenario suites',
      'Reinforcement learning environments',
    ],
    technologies: ['Gazebo', 'Isaac Sim', 'MuJoCo', 'Unreal Engine', 'Gymnasium'],
    image: { src: '', alt: 'Simulation service' },
    platforms: ['go2', 'g1'],
    featured: true,
  },
  {
    id: 'service-vr-ar',
    slug: 'vr-ar-robotics',
    categoryId: 'category-virtual',
    title: 'VR / AR Robotics',
    shortDescription: 'Immersive teleoperation, training and maintenance interfaces.',
    description:
      'Spatial interfaces for people who work with machines: VR teleoperation with force feedback, AR overlays that guide maintenance in situ, and training environments that let operators make mistakes safely before they reach the real cell.',
    icon: 'glasses',
    highlights: [
      'VR teleoperation with haptic feedback',
      'AR maintenance and assembly overlays',
      'Immersive operator training',
      'Spatial telemetry visualisation',
    ],
    technologies: ['Unity XR', 'OpenXR', 'WebXR', 'Unreal Engine', 'ARKit / ARCore'],
    image: { src: '', alt: 'VR and AR robotics service' },
    platforms: ['go2', 'g1'],
    platformNotes: {
      go2: 'Teleoperation and a live robot-perspective field view in VR — drive the quadruped and see exactly what it sees.',
      g1: 'Immersive teleoperation plus operator training and guided maintenance walkthroughs.',
    },
    featured: false,
  },
  {
    id: 'service-autonomy',
    slug: 'autonomous-systems',
    categoryId: 'category-systems',
    title: 'Autonomous Systems',
    shortDescription: 'Navigation, mapping and decision stacks for unsupervised operation.',
    description:
      'Full autonomy stacks: SLAM and localisation, global and local planning, behaviour trees for mission logic, and the safety supervision layer that decides when a machine should stop rather than guess.',
    icon: 'waypoints',
    highlights: [
      'SLAM, localisation and map lifecycle',
      'Global and reactive local planning',
      'Behaviour-tree mission logic',
      'Safety supervision and fallback states',
    ],
    technologies: ['Nav2', 'SLAM Toolbox', 'Cartographer', 'BehaviorTree.CPP', 'LiDAR'],
    image: { src: '', alt: 'Autonomous systems service' },
    platforms: ['go2', 'g1'],
    featured: false,
  },
  {
    id: 'service-embedded',
    slug: 'embedded-systems',
    categoryId: 'category-systems',
    title: 'Embedded Systems',
    shortDescription: 'Real-time firmware, board bring-up and deterministic control.',
    description:
      'The layer nothing else works without: schematic review, board bring-up, RTOS firmware with hard real-time guarantees, driver development and secure over-the-air update paths for fleets in the field.',
    icon: 'circuit',
    highlights: [
      'Board bring-up and driver development',
      'RTOS firmware with real-time guarantees',
      'Sensor fusion at the edge',
      'Secure OTA update infrastructure',
    ],
    technologies: ['FreeRTOS', 'Zephyr', 'STM32', 'micro-ROS', 'Embedded C'],
    image: { src: '', alt: 'Embedded systems service' },
    platforms: ['other'],
    featured: false,
  },
  {
    id: 'service-research',
    slug: 'robotics-research',
    categoryId: 'category-intelligence',
    title: 'Robotics Research',
    shortDescription: 'Applied R&D, feasibility studies and prototype programmes.',
    description:
      'For problems without an off-the-shelf answer. We run structured feasibility studies, build instrumented prototypes and publish results your team can act on — including the negative results that save a year of engineering.',
    icon: 'microscope',
    highlights: [
      'Feasibility studies and technical due diligence',
      'Instrumented rapid prototyping',
      'Benchmark design and evaluation',
      'Grant and publication support',
    ],
    technologies: ['ROS 2', 'PyTorch', 'Isaac Lab', 'Jupyter', 'Weights & Biases'],
    image: { src: '', alt: 'Robotics research service' },
    platforms: ['other'],
    featured: false,
  },
  {
    id: 'service-nl-control',
    slug: 'natural-language-control',
    categoryId: 'category-intelligence',
    title: 'Natural Language Control',
    shortDescription: 'Speak a command in plain language and the robot carries it out.',
    description:
      'Spoken instructions become motion. "Go forward", "turn left", "stop" and longer phrasings are parsed into grounded navigation goals rather than fixed keywords, so an operator directs the robot without a controller or a trained vocabulary.',
    icon: 'message',
    highlights: [
      'Speech-to-intent grounded in the live map',
      'Open phrasing rather than a fixed command list',
      'Directional and goal-relative instructions',
      'Falls back safely when intent is unclear',
    ],
    technologies: ['LLM', 'Speech-to-Text', 'ROS 2', 'Nav2'],
    image: { src: '', alt: 'Natural language robot control' },
    platforms: ['go2'],
    featured: true,
  },
  {
    id: 'service-multilingual',
    slug: 'multilingual-interaction',
    categoryId: 'category-intelligence',
    title: 'Multilingual Interaction',
    shortDescription: 'The robot answers in whatever language it is spoken to.',
    description:
      'Incoming speech is transcribed and language-identified on the robot, routed to intent, and answered aloud in the same language it arrived in. The exchange runs on-board, so there is no network round trip between a question and its reply.',
    icon: 'users',
    highlights: [
      'On-device speech recognition and language ID',
      'Replies in the speaker\u2019s own language',
      'Runs without a cloud round trip',
      'Extensible to new languages',
    ],
    technologies: ['LLM', 'Speech-to-Text', 'TTS', 'On-device Inference'],
    image: { src: '', alt: 'Multilingual robot interaction' },
    platforms: ['g1'],
    featured: true,
  },
  {
    id: 'service-person-following',
    slug: 'person-following',
    categoryId: 'category-intelligence',
    title: 'Person Following',
    shortDescription: 'Name a person by what they are wearing and the robot follows them.',
    description:
      '"Follow the person in the yellow shirt" is enough to lock on. Camera and LiDAR are fused so the target keeps its identity through occlusion and crowding, and the robot holds a set standoff distance rather than tailgating.',
    icon: 'radar',
    highlights: [
      'Target selected by spoken description',
      'Camera and LiDAR fusion for re-identification',
      'Holds a configurable standoff distance',
      'Recovers the target after occlusion',
    ],
    technologies: ['Computer Vision', 'LiDAR', 'Re-ID', 'ROS 2'],
    image: { src: '', alt: 'Robot person following' },
    platforms: ['go2'],
    featured: true,
  },
  {
    id: 'service-custom-apps',
    slug: 'custom-applications',
    categoryId: 'category-virtual',
    title: 'Custom Applications',
    shortDescription: 'Web, Android and XR front-ends built around how you actually operate.',
    description:
      'The interface is part of the system. We build the web dashboard, Android app or AR/VR client a deployment needs \u2014 live telemetry, map views, mission control, fleet status \u2014 specified around your operators rather than shipped as a fixed console.',
    icon: 'layers',
    highlights: [
      'Web dashboards and mission control',
      'Android companion applications',
      'AR / VR operator clients',
      'Built to the requirement, not a fixed template',
    ],
    technologies: ['Next.js', 'React', 'Android', 'WebRTC', 'Three.js'],
    image: { src: '', alt: 'Custom robotics applications' },
    platforms: ['other'],
    featured: true,
  },
];

/** Services promoted to the landing page preview grid. */
export const featuredServices: Service[] = services.filter((service) => service.featured);

/** Group services under their category — used by the services page. */
export function getServicesByCategory(categoryId: string): Service[] {
  return services.filter((service) => service.categoryId === categoryId);
}

/**
 * The platform groups the services page is built around.
 *
 * Visitors arrive asking "can it do X on a Go2?", not "I need Virtual
 * Engineering", so the page leads with the robots. Order matters: Go2 first
 * because it carries the fuller deployed stack.
 */
export const servicePlatformGroups = [
  {
    id: 'go2',
    name: 'Go2',
    form: 'Quadruped',
    description:
      'The quadruped carries the deployed stack — navigation, perception and the spoken-command and person-following work that runs on it today.',
    /* Cropped to the robot itself — the wider capture is mostly laptop screen. */
    image: {
      src: '/images/platform-go2.jpg',
      alt: 'Go2 quadruped walking across a room',
    },
  },
  {
    id: 'g1',
    name: 'G1',
    form: 'Humanoid',
    description:
      'The humanoid adds whole-body control and on-board conversation, with the same perception and simulation core underneath.',
    image: {
      src: '/images/platform-g1.jpg',
      alt: 'G1 humanoid standing in the lab',
    },
  },
  {
    id: 'other',
    name: 'Other services',
    form: 'Platform-independent',
    description:
      'Work that is not tied to a robot: custom applications, embedded engineering and applied research.',
    /* No single photograph represents platform-independent work — the slot
       stays empty so it renders the drafting frame rather than borrowing a
       robot photo that would contradict the label. */
    image: { src: '', alt: 'Custom applications and research work' },
  },
] as const satisfies readonly {
  id: ServicePlatform;
  name: string;
  form: string;
  description: string;
  image: ImageMedia;
}[];

/** Services offered on a given platform. */
export function getServicesByPlatform(platform: ServicePlatform): Service[] {
  return services.filter((service) => service.platforms.includes(platform));
}
