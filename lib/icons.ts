import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  Binary,
  Blocks,
  Bot,
  Boxes,
  BrainCircuit,
  Building2,
  Camera,
  CheckCircle2,
  CircuitBoard,
  Compass,
  Cpu,
  Database,
  Eye,
  Factory,
  FlaskConical,
  Gauge,
  GitBranch,
  Glasses,
  Headset,
  Instagram,
  Layers,
  Linkedin,
  Mail,
  Map,
  MapPin,
  MessageCircle,
  Microscope,
  Move3d,
  Network,
  Orbit,
  Phone,
  Radar,
  Radio,
  Rocket,
  Ruler,
  ScanLine,
  Send,
  Settings2,
  Shield,
  Sparkles,
  Target,
  Trophy,
  Users,
  Waypoints,
  Workflow,
  Zap,
  createLucideIcon,
  type LucideIcon,
} from 'lucide-react';

/**
 * Icon registry.
 *
 * Data files reference icons by string key so they stay serialisable and easy
 * to edit. Components resolve the key through {@link getIcon}. Adding an icon
 * is a one-line change here — the `IconName` union updates automatically.
 */
/*
 * WhatsApp has no lucide icon. This is Tabler's MIT-licensed "brand-whatsapp"
 * outline (a speech bubble with a handset), built with lucide's own factory so
 * it takes the same props and stroke as every other icon here.
 */
const Whatsapp = createLucideIcon('Whatsapp', [
  ['path', { d: 'M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9', key: 'bubble' }],
  [
    'path',
    {
      d: 'M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1',
      key: 'handset',
    },
  ],
]);

export const iconRegistry = {
  activity: Activity,
  'arrow-right': ArrowRight,
  'arrow-up-right': ArrowUpRight,
  award: Award,
  binary: Binary,
  blocks: Blocks,
  bot: Bot,
  boxes: Boxes,
  brain: BrainCircuit,
  building: Building2,
  camera: Camera,
  check: CheckCircle2,
  circuit: CircuitBoard,
  compass: Compass,
  cpu: Cpu,
  database: Database,
  eye: Eye,
  factory: Factory,
  flask: FlaskConical,
  gauge: Gauge,
  git: GitBranch,
  glasses: Glasses,
  headset: Headset,
  instagram: Instagram,
  layers: Layers,
  linkedin: Linkedin,
  mail: Mail,
  map: Map,
  'map-pin': MapPin,
  message: MessageCircle,
  whatsapp: Whatsapp,
  microscope: Microscope,
  move3d: Move3d,
  network: Network,
  orbit: Orbit,
  phone: Phone,
  radar: Radar,
  radio: Radio,
  rocket: Rocket,
  ruler: Ruler,
  scan: ScanLine,
  send: Send,
  settings: Settings2,
  shield: Shield,
  sparkles: Sparkles,
  target: Target,
  trophy: Trophy,
  users: Users,
  waypoints: Waypoints,
  workflow: Workflow,
  zap: Zap,
} as const satisfies Record<string, LucideIcon>;

/** Every valid icon key. Use this type in data files. */
export type IconName = keyof typeof iconRegistry;

/** Resolve an icon key to its component. */
export function getIcon(name: IconName): LucideIcon {
  return iconRegistry[name];
}

export type { LucideIcon };
