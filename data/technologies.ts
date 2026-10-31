import type { TechnologyStack } from '@/types/service';

/** Technology stacks shown on the services page. */
export const technologyStacks: TechnologyStack[] = [
  {
    id: 'stack-robotics',
    title: 'Robotics & Middleware',
    description: 'The runtime backbone of every system we ship.',
    icon: 'bot',
    items: ['ROS 2', 'DDS / Cyclone', 'MoveIt 2', 'Nav2', 'micro-ROS', 'BehaviorTree.CPP'],
  },
  {
    id: 'stack-ai',
    title: 'AI & Perception',
    description: 'Training, optimisation and on-device inference.',
    icon: 'brain',
    items: ['PyTorch', 'TensorRT', 'ONNX', 'OpenCV', 'Open3D', 'CUDA'],
  },
  {
    id: 'stack-simulation',
    title: 'Simulation & Digital Twin',
    description: 'Virtual environments used to validate before deployment.',
    icon: 'orbit',
    items: ['Isaac Sim', 'Gazebo', 'MuJoCo', 'Omniverse', 'USD', 'Unity'],
  },
  {
    id: 'stack-embedded',
    title: 'Embedded & Control',
    description: 'Deterministic firmware and industrial interfaces.',
    icon: 'circuit',
    items: ['FreeRTOS', 'Zephyr', 'STM32', 'EtherCAT', 'CAN bus', 'IEC 61131-3'],
  },
  {
    id: 'stack-platform',
    title: 'Platform & Data',
    description: 'Fleet infrastructure, telemetry and deployment.',
    icon: 'database',
    items: ['Kubernetes', 'Docker', 'MQTT', 'Kafka', 'TimescaleDB', 'Grafana'],
  },
  {
    id: 'stack-interfaces',
    title: 'Interfaces & XR',
    description: 'Operator-facing tools and immersive control surfaces.',
    icon: 'glasses',
    items: ['Unity XR', 'OpenXR', 'WebXR', 'Three.js', 'Next.js', 'WebRTC'],
  },
];
